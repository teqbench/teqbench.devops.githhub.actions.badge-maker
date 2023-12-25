import * as core from '@actions/core'
import { Format, makeBadge } from 'badge-maker'

// import { wait } from './wait'

// label: 'build',  // (Optional) Badge label
// message: 'passed',  // (Required) Badge message
// labelColor: '#555',  // (Optional) Label color
// color: '#4c1',  // (Optional) Message color

// // (Optional) One of: 'plastic', 'flat', 'flat-square', 'for-the-badge' or 'social'
// // Each offers a different visual design.
// style: 'flat',

enum BadgeType {
  SUCCESS = 'SUCCESS', // GREEN
  FAILURE = 'FAILURE', // Red
  INFORMATION = 'INFORMATION' // Blue
}

enum BadgeStyleType {
  PLASTIC = 'PLASTIC',
  FLAT = 'FLAT',
  FLAT_SQUARE = 'FLAT-SQUARE',
  FOR_THE_BADGE = 'FOR-THE-BADGE',
  SOCIAL = 'SOCIAL'
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

    if (inputLabel === null || inputLabel.trim().length === 0) {
      throw new Error('A label is required.')
    }

    if (inputMessage === null || inputMessage.trim().length === 0) {
      throw new Error('A message is required.')
    }

    if (badgeStyleType === null) {
      throw new Error('Badge style type invalid.')
    }

    let messageColor: string = 'gray'

    switch (badgeType) {
      case BadgeType.SUCCESS: {
        messageColor = 'brightgreen'

        break
      }
      case BadgeType.FAILURE: {
        messageColor = 'red'

        break
      }
      case BadgeType.INFORMATION: {
        messageColor = 'blue'

        break
      }
    }

    const format: Format = {
      label: inputLabel,
      message: inputMessage,
      color: messageColor,

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

    console.log(svg)

    // Set outputs for other workflow steps to use
    core.setOutput('svg', svg)
  } catch (error) {
    console.log(error)

    // Fail the workflow run if an error occurs
    if (error instanceof Error) {
      core.setFailed(error)
    }
  }
}

function stringToBadgeTypeEnum(value: string): BadgeType | null {
  const uc: string = (value ?? '').toUpperCase().trim()

  if (Object.values(BadgeType).findIndex(x => x === uc) >= 0) {
    return uc as BadgeType
  }

  return null
}

function stringToBadgeStyleTypeEnum(value: string): BadgeStyleType | null {
  const uc: string = (value ?? '').toUpperCase().trim()

  if (uc === '') {
    return BadgeStyleType.FOR_THE_BADGE
  } else if (Object.values(BadgeStyleType).findIndex(x => x === uc) >= 0) {
    return uc as BadgeStyleType
  }

  return null
}
