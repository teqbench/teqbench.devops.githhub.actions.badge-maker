import * as core from '@actions/core'
import { Format, makeBadge } from 'badge-maker'

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

enum BadgeStyleType {
  PLASTIC = 'PLASTIC',
  FLAT = 'FLAT',
  FLAT_SQUARE = 'FLAT-SQUARE',

  // Default style
  FOR_THE_BADGE = 'FOR-THE-BADGE',
  SOCIAL = 'SOCIAL'
}

// List of supported datetime locale formats. Add to library as needed; for now start with small set to verify funcitonality.
enum BadgeTimestampFormatType {
  // Default timestamp format
  ENGLISH_UNITED_STATES = 'en_US'
}

// List of supported datetime locale formats. Add to library as needed; for now start with small set to verify funcitonality.
enum BadgeTimestampTimezoneType {
  // Default timestamp timezone
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
 * The main function for the action.
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
    const badgeType: BadgeType | null = stringToBadgeTypeEnum(inputBadgeType)
    const badgeStyleType: BadgeStyleType | null =
      stringToBadgeStyleTypeEnum(inputBadgeStyleType)

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
        // Label required, message ignored, timestamp-format optional, timestamp-timezone optional
        label = validateInputLabel(inputLabel)

        // Only get the timestamp-format input when the badge style is DATESTAMP
        const inputBadgeTimestampFormatType: string =
          core.getInput('timestamp-format')
        const badgeBadgeTimestampFormatType: BadgeTimestampFormatType | null =
          stringToBadgeTimestampFormatType(inputBadgeTimestampFormatType)

        if (badgeBadgeTimestampFormatType === null) {
          throw new Error('Badge timestamp format invalid.')
        }

        // Only get the timezone input when badge style is DATESTAMP
        const inputBadgeTimestampTimezoneType: string =
          core.getInput('timestamp-timezone')
        const badgeBadgeTimestampTimezoneType: BadgeTimestampTimezoneType | null =
          stringToBadgeTimestampTimezoneType(inputBadgeTimestampTimezoneType)

        if (badgeBadgeTimestampTimezoneType === null) {
          throw new Error('Badge timestamp timezone invalid.')
        }

        const options = {
          timeZone: badgeBadgeTimestampTimezoneType?.toString()
        }

        message = new Intl.DateTimeFormat(
          badgeBadgeTimestampFormatType?.toString(),
          options
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
      style: badgeStyleType.toLocaleLowerCase() as
        | 'plastic'
        | 'flat'
        | 'flat-square'
        | 'for-the-badge'
        | 'social'
    }

    const svg = makeBadge(format)

    // console.log(svg)

    // Set outputs for other workflow steps to use
    core.setOutput('svg', svg)
  } catch (error) {
    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error)
    }

    throw error
  }
}

function stringToBadgeTypeEnum(value: string): BadgeType | null {
  const uc: string = (value ?? '').toUpperCase().trim()

  if (Object.values(BadgeType).findIndex(x => x === uc) >= 0) {
    return uc as BadgeType
  }

  // Return a null if supplied value is not found in list of supported badge types to
  // indicate to the dev the value they are supplying is invalid.
  return null
}

function stringToBadgeStyleTypeEnum(value: string): BadgeStyleType | null {
  const uc: string = (value ?? '').toUpperCase().trim()

  if (uc === '') {
    return BadgeStyleType.FOR_THE_BADGE
  } else if (Object.values(BadgeStyleType).findIndex(x => x === uc) >= 0) {
    return uc as BadgeStyleType
  }

  // Return a null if supplied value is not an empty string AND not found in list of supported formats to
  // indicate to the dev the value they are supplying is invalid.
  return null
}

function stringToBadgeTimestampFormatType(
  value: string
): BadgeTimestampFormatType | null {
  // Do not change case of the original value
  const uc: string = (value ?? '').trim()

  if (uc === '') {
    return BadgeTimestampFormatType.ENGLISH_UNITED_STATES
  } else if (
    Object.values(BadgeTimestampFormatType).findIndex(x => x === uc) >= 0
  ) {
    return value.trim() as BadgeTimestampFormatType
  }

  // Return a null if supplied value is not found in list of supported formats to
  // indicate to the dev the value they are supplying is invalid.
  return null
}

function stringToBadgeTimestampTimezoneType(
  value: string
): BadgeTimestampTimezoneType | null {
  const uc: string = (value ?? '').toUpperCase().trim()

  if (uc === '') {
    return BadgeTimestampTimezoneType.UTC
  } else if (
    Object.values(BadgeTimestampTimezoneType).findIndex(x => x === uc) >= 0
  ) {
    return uc as BadgeTimestampTimezoneType
  }

  // Return a null if supplied value is not an empty string AND not found in list of supported timezones to
  // indicate to the dev the value they are supplying is invalid.
  return null
}

function validateValue(value: string | null, name: string): string {
  if (value === null || value === undefined || value.trim().length === 0) {
    throw new Error(`A ${name} is required.`)
  }

  return value.trim()
}

function validateInputLabel(value: string | null): string {
  return validateValue(value, 'label')
}

function validateInputMessage(value: string | null): string {
  return validateValue(value, 'message')
}
