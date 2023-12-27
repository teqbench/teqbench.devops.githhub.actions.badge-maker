import * as core from '@actions/core'
import { Format, makeBadge } from 'badge-maker'

/**
 * Supported badge types.
 *
 * @enum {number}
 */
enum BadgeType {
  // General purpose success badge, green. Label optional, message is required.
  SUCCESS = 'SUCCESS',

  // General purpose failure badge, red. Label optional, message is required.
  FAILURE = 'FAILURE',

  // General purpose passing badge, green. Default message is 'passing'. Label optional, message is optional; if message param not supplied, defaults to 'passing'.
  PASSING = 'PASSING',

  // General purpose failing badge, red. Default message is 'failing'. Label optional, message is optional; if message param not supplied, defaults to 'failing'.
  FAILING = 'FAILING',

  // General purpose date/time stamp badge, blue. Label required, message ignored.
  DATESTAMP = 'DATESTAMP',

  // General purpose information badge, blue. Label required, message required.
  INFORMATION = 'INFORMATION',

  // General purpose warning badge, yellow. Label required, message required.
  WARNING = 'WARNING'
}

/**
 * Supported badge styles.
 *
 * @enum {number}
 */
enum BadgeStyleType {
  PLASTIC = 'plastic',
  FLAT = 'flat',
  FLAT_SQUARE = 'flat-square',

  // Default style
  FOR_THE_BADGE = 'for-the-badge',
  SOCIAL = 'social'
}

/**
 * Supported datetime locale formats. Add to library as needed; for now start
 * with small set to verify funcitonality.
 *
 * @enum {number}
 */
enum BadgeDatestampFormatType {
  // Default datestamp format
  ENGLISH_UNITED_STATES = 'en-US'
}

/**
 * Supported datetime locale formats. Add to library as needed; for now start
 * with small set to verify funcitonality.
 *
 * @enum {number}
 */
enum BadgeDatestampTimezoneType {
  // Default datestamp timezone
  UTC = 'UTC',

  US_ALASKA = 'US/Alaska',
  US_ALEUTIAN = 'US/Aleutian',
  US_ARIZONA = 'US/Arizona',
  US_CENTRAL = 'US/Central',
  US_EAST_INDIANA = 'US/East_Indiana',
  US_EASTERN = 'US/Eastern',
  US_HAWAII = 'US/Hawaii',
  US_INDIANA_STARKE = 'US/Indiana_Starke',
  US_MICHIGAN = 'US/Michigan',
  US_MOUNTAIN = 'US/Mountain',
  US_PACIFIC = 'US/Pacific',
  US_PACIFIC_NEW = 'US/Pacific_New',
  US_SAMOA = 'US/Samoa'
}

/**
 * Supported badge datestamp date styles.
 *
 * @enum {number}
 */
enum BadgeDatestampDateStyleType {
  // Default date style
  MEDIUM = 'medium',

  FULL = 'full',
  LONG = 'long',
  SHORT = 'short'
}

/**
 * Supported badge datestamp time styles.
 *
 * @enum {number}
 */
enum BadgeDatestampTimeStyleType {
  MEDIUM = 'medium',
  FULL = 'full',

  // Default time style
  LONG = 'long',

  SHORT = 'short'
}

/**
 * The main function for the action.
 *
 * @returns {Promise<void>} Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    const inputBadgeType: string = core.getInput('badge-type')
    const inputLabel: string = core.getInput('label')
    const inputMessage: string = core.getInput('message')
    const inputBadgeStyleType: string = core.getInput('badge-style')

    // TypeScript does not have anyting like ENUM.TryParse and does not throw an
    // error when trying to cast a string to the enum. Created stringToEnum as a workaround
    // to convert a string to an enum. If fails, returns a null.
    const badgeType: BadgeType | null = stringToBadgeType(inputBadgeType)
    const badgeStyleType: BadgeStyleType | null =
      stringToBadgeStyleType(inputBadgeStyleType)

    if (badgeType === null) {
      throw new Error('Badge type invalid.')
    }

    if (badgeStyleType === null) {
      throw new Error('Badge style invalid.')
    }

    let label = ''
    let message = ''

    switch (badgeType) {
      case BadgeType.SUCCESS:
      case BadgeType.FAILURE: {
        // Label optional, message is required.
        label = inputLabel
        message = validateInputMessage(inputMessage)

        break
      }
      case BadgeType.PASSING:
      case BadgeType.FAILING: {
        // Label optional, message is optional; if message param not supplied, defaults to 'passing'/'failing'.
        label = inputLabel

        // If no input message supplied, set to default value depending on the badge type.
        if (inputMessage === null || inputMessage.trim().length === 0) {
          message = badgeType.toLocaleLowerCase()
        } else {
          message = validateInputMessage(inputMessage)
        }

        break
      }
      case BadgeType.DATESTAMP: {
        // Label required, message ignored, datestamp-format optional,
        // datestamp-timezone optional, datestamp-datestyle optional, datestamp-timestyle optional
        label = validateInputLabel(inputLabel)

        // Only get the datestamp-format input when the badge style is DATESTAMP
        const inputBadgeDatestampFormatType: string =
          core.getInput('datestamp-format')

        const badgeBadgeDatestampFormatType: BadgeDatestampFormatType | null =
          stringToBadgeDatestampFormatType(inputBadgeDatestampFormatType)

        if (badgeBadgeDatestampFormatType === null) {
          throw new Error('Badge datestamp format invalid.')
        }

        // Only get the timezone input when badge style is DATESTAMP
        const inputBadgeDatestampTimezoneType: string =
          core.getInput('datestamp-timezone')

        const badgeBadgeDatestampTimezoneType: BadgeDatestampTimezoneType | null =
          stringToBadgeDatestampTimezoneType(inputBadgeDatestampTimezoneType)

        if (badgeBadgeDatestampTimezoneType === null) {
          throw new Error('Badge datestamp timezone invalid.')
        }

        // Only get the datestyle input when the badge style is DATESTAMP
        const inputBadgeDatestampDateStyle: string = core.getInput(
          'datestamp-datestyle'
        )

        const badgeDatestampDateStyle: BadgeDatestampDateStyleType | null =
          stringToBadgeStyleDateStyle(inputBadgeDatestampDateStyle)

        if (badgeDatestampDateStyle === null) {
          throw new Error('Badge datestamp date style invalid.')
        }

        // Only get the timestyle input when the badge style is DATESTAMP
        const inputBadgeDatestampTimeStyle: string = core.getInput(
          'datestamp-timestyle'
        )

        const badgeDatestampTimeStyle: BadgeDatestampTimeStyleType | null =
          stringToBadgeStyleTimeStyle(inputBadgeDatestampTimeStyle)

        if (badgeDatestampTimeStyle === null) {
          throw new Error('Badge datestamp time style invalid.')
        }

        message = Intl.DateTimeFormat(
          badgeBadgeDatestampFormatType?.toString(),
          {
            timeZone: badgeBadgeDatestampTimezoneType?.toString(),

            // The style property of the Format type is defined using an inline type def. Make sure to force
            // to lowercase in order to cast.
            dateStyle: badgeDatestampDateStyle?.toLowerCase() as
              | 'medium'
              | 'full'
              | 'long'
              | 'short',

            // The style property of the Format type is defined using an inline type def. Make sure to force
            // to lowercase in order to cast.
            timeStyle: badgeDatestampTimeStyle?.toLowerCase() as
              | 'medium'
              | 'full'
              | 'long'
              | 'short'
          }
        ).format(new Date())

        break
      }
      case BadgeType.INFORMATION:
      case BadgeType.WARNING: {
        // Label required, message required.
        label = validateInputLabel(inputLabel)
        message = validateInputMessage(inputMessage)

        break
      }
    }

    // Determine badge's message color based on the supplied badge type.
    let color = 'gray'

    switch (badgeType) {
      case BadgeType.SUCCESS:
      case BadgeType.PASSING: {
        color = 'success'

        break
      }
      case BadgeType.FAILURE:
      case BadgeType.FAILING: {
        color = 'critical'

        break
      }
      case BadgeType.DATESTAMP:
      case BadgeType.INFORMATION: {
        color = 'informational'

        break
      }
      case BadgeType.WARNING: {
        color = 'yellow'

        break
      }
    }

    const format: Format = {
      label,
      message,
      color,

      // The style property of the Format type is defined using an inline type def. Make sure to force
      // to lowercase in order to cast.
      style: badgeStyleType.toLowerCase() as
        | 'plastic'
        | 'flat'
        | 'flat-square'
        | 'for-the-badge'
        | 'social'
    }

    const svg = makeBadge(format)

    // Set outputs for other workflow steps to use
    core.setOutput('svg', svg)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error.message)
    }
  }
}

/**
 * Converts the supplied string to BadgeType.
 *
 * Returns null if string cannot be converted to BadgeType.
 *
 * @param {string} value - The string value to convert to BadgeType.
 * @return {*}  {(BadgeType | null)}
 */
function stringToBadgeType(value: string): BadgeType | null {
  const uc: string = (value ?? '').toUpperCase().trim()

  if (Object.values(BadgeType).findIndex(x => x === uc) >= 0) {
    return uc as BadgeType
  }

  // Return a null if supplied value is not found in list of supported badge types to
  // indicate to the dev the value they are supplying is invalid.
  return null
}

/**
 * Converts the supplied string to BadgeStyleType.
 *
 * Returns BadgeStyleType.FOR_THE_BADGE if string is an empty string.
 *
 * Returns null if string cannot be converted to BadgeStyleType.
 *
 * @param {string} value - The string value to convert to BadgeStyleType.
 * @return {*}  {(BadgeStyleType | null)}
 */
function stringToBadgeStyleType(value: string): BadgeStyleType | null {
  const style: string = (value ?? '').toLowerCase().trim()

  if (style === '') {
    return BadgeStyleType.FOR_THE_BADGE
  } else if (Object.values(BadgeStyleType).findIndex(x => x === style) >= 0) {
    return style as BadgeStyleType
  }

  // Return a null if supplied value is not an empty string AND not found in list of supported formats to
  // indicate to the dev the value they are supplying is invalid.
  return null
}

/**
 * Converts the supplied string to BadgeDatestampFormatType.
 *
 * Returns BadgeDatestampFormatType.ENGLISH_UNITED_STATES if string is an empty string.
 *
 * Returns null if string cannot be converted to BadgeDatestampFormatType.
 *
 * @param {string} value - The string value to convert to BadgeDatestampFormatType.
 * @return {*}  {(BadgeDatestampFormatType | null)}
 */
function stringToBadgeDatestampFormatType(
  value: string
): BadgeDatestampFormatType | null {
  // Do not change case of the original value
  const format: string = (value ?? '').trim()

  if (format === '') {
    return BadgeDatestampFormatType.ENGLISH_UNITED_STATES
  } else if (
    Object.values(BadgeDatestampFormatType).findIndex(x => x === format) >= 0
  ) {
    return format as BadgeDatestampFormatType
  }

  // Return a null if supplied value is not found in list of supported formats to
  // indicate to the dev the value they are supplying is invalid.
  return null
}

/**
 * Converts the supplied string to BadgeDatestampTimezoneType.
 *
 * Returns BadgeDatestampTimezoneType.UTC if string is an empty string.
 *
 * Returns null if string cannot be converted to BadgeDatestampTimezoneType.
 *
 * @param {string} value - The string value to convert to BadgeDatestampTimezoneType.
 * @return {*}  {(BadgeDatestampTimezoneType | null)}
 */
function stringToBadgeDatestampTimezoneType(
  value: string
): BadgeDatestampTimezoneType | null {
  // Do not change case of the original value
  const timezone: string = (value ?? '').trim()

  if (timezone === '') {
    return BadgeDatestampTimezoneType.UTC
  } else if (
    Object.values(BadgeDatestampTimezoneType).findIndex(x => x === timezone) >=
    0
  ) {
    return timezone as BadgeDatestampTimezoneType
  }

  // Return a null if supplied value is not an empty string AND not found in list of supported timezones to
  // indicate to the dev the value they are supplying is invalid.
  return null
}

/**
 * Converts the supplied string to BadgeDatestampDateStyleType.
 *
 * Returns BadgeDatestampDateStyleType.MEDIUM if string is an empty string.
 *
 * Returns null if string cannot be converted to BadgeDatestampDateStyleType.
 *
 * @param {string} value - The string value to convert to BadgeDatestampDateStyleType.
 * @return {*}  {(BadgeDatestampDateStyleType | null)}
 */
function stringToBadgeStyleDateStyle(
  value: string
): BadgeDatestampDateStyleType | null {
  const style: string = (value ?? '').toLowerCase().trim()

  if (style === '') {
    return BadgeDatestampDateStyleType.MEDIUM
  } else if (
    Object.values(BadgeDatestampDateStyleType).findIndex(x => x === style) >= 0
  ) {
    return style as BadgeDatestampDateStyleType
  }

  // Return a null if supplied value is not an empty string AND not found in list of supported formats to
  // indicate to the dev the value they are supplying is invalid.
  return null
}

/**
 * Converts the supplied string to BadgeDatestampTimeStyleType.
 *
 * Returns BadgeDatestampTimeStyleType.LONG if string is an empty string.
 *
 * Returns null if string cannot be converted to BadgeDatestampTimeStyleType.
 *
 * @param {string} value - The string value to convert to BadgeDatestampTimeStyleType.
 * @return {*}  {(BadgeDatestampTimeStyleType | null)}
 */
function stringToBadgeStyleTimeStyle(
  value: string
): BadgeDatestampTimeStyleType | null {
  const style: string = (value ?? '').toLowerCase().trim()

  if (style === '') {
    return BadgeDatestampTimeStyleType.LONG
  } else if (
    Object.values(BadgeDatestampTimeStyleType).findIndex(x => x === style) >= 0
  ) {
    return style as BadgeDatestampTimeStyleType
  }

  // Return a null if supplied value is not an empty string AND not found in list of supported formats to
  // indicate to the dev the value they are supplying is invalid.
  return null
}

/**
 * Validates the supplied value is not null, not undefined and not an empty string. If value is valid,
 * the value is returned trimmed, i.e. without leading/trailing spaces.
 *
 * @param {(string | null)} value - The value to validate.
 * @param {string} name - Descriptive name of the value to validate to be used in error message.
 * @return {*}  {string}
 */
function validateValue(value: string | null, name: string): string {
  if (value === null || value === undefined || value.trim().length === 0) {
    throw new Error(`A ${name} is required.`)
  }

  return value.trim()
}

/**
 * Validates the supplied value is not null, not undefined and not an empty string. If value is valid,
 * the value is returned trimmed, i.e. without leading/trailing spaces.
 *
 * @param {(string | null)} value - The value to validate.
 * @return {*}  {string}
 */
function validateInputLabel(value: string | null): string {
  return validateValue(value, 'label')
}

/**
 * Validates the supplied value is not null, not undefined and not an empty string. If value is valid,
 * the value is returned trimmed, i.e. without leading/trailing spaces.
 *
 * @param {(string | null)} value - The value to validate.
 * @return {*}  {string}
 */
function validateInputMessage(value: string | null): string {
  return validateValue(value, 'message')
}
