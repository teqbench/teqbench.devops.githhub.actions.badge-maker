/**
 * Unit tests for the action's main functionality, src/main.ts
 *
 * These should be run as if the action was called from a workflow.
 * Specifically, the inputs listed in `action.yml` should be set as environment
 * variables following the pattern `INPUT_<INPUT_NAME>`.
 */

import * as core from '@actions/core'
import * as main from '../src/main'

// Mock the action's main function
const runMock = jest.spyOn(main, 'run')

// Mock the GitHub Actions core library
let errorMock: jest.SpyInstance
let getInputMock: jest.SpyInstance
let setOutputMock: jest.SpyInstance

describe('action', () => {
  beforeEach(() => {
    jest.clearAllMocks()

    errorMock = jest.spyOn(core, 'error').mockImplementation()
    getInputMock = jest.spyOn(core, 'getInput').mockImplementation()
    setOutputMock = jest.spyOn(core, 'setOutput').mockImplementation()
  })

  it('badge type success', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'SUCCESS'
        case 'label':
          return 'build'
        case 'message':
          return 'success'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'svg',
      expect.stringContaining('svg')
    )

    expect(errorMock).not.toHaveBeenCalled()
  })

  it('badge type failure', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'FAILURE'
        case 'label':
          return 'build'
        case 'message':
          return 'failure'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'svg',
      expect.stringContaining('svg')
    )

    expect(errorMock).not.toHaveBeenCalled()
  })

  it('badge type information', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'INFORMATION'
        case 'label':
          return 'build'
        case 'message':
          return 'info'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'svg',
      expect.stringContaining('svg')
    )

    expect(errorMock).not.toHaveBeenCalled()
  })

  it('badge type invalid', async () => {
    try {
      // See https://stackoverflow.com/questions/64545786/how-to-correctly-expect-an-error-to-be-thrown-in-jest-from-inside-a-catch-block
      // for how to test promises that throw errors.

      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string => {
        switch (name) {
          case 'badge-type':
            return 'invalid'
          case 'label':
            return 'build'
          case 'message':
            return 'info'
          default:
            return ''
        }
      })

      await main.run()
    } catch (e) {
      expect(e).toEqual({
        code: 'invalid'
      })
    }
  })

  it('badge type null', async () => {
    try {
      // See https://stackoverflow.com/questions/64545786/how-to-correctly-expect-an-error-to-be-thrown-in-jest-from-inside-a-catch-block
      // for how to test promises that throw errors.

      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string | null => {
        switch (name) {
          case 'badge-type':
            return null
          case 'label':
            return 'build'
          case 'message':
            return 'info'
          default:
            return ''
        }
      })

      await main.run()
    } catch (e) {
      expect(e).toEqual({
        code: 'invalid'
      })
    }
  })

  it('badge label missing', async () => {
    try {
      // See https://stackoverflow.com/questions/64545786/how-to-correctly-expect-an-error-to-be-thrown-in-jest-from-inside-a-catch-block
      // for how to test promises that throw errors.

      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string => {
        switch (name) {
          case 'badge-type':
            return 'SUCCESS'
          case 'message':
            return 'info'
          default:
            return ''
        }
      })

      await main.run()
    } catch (e) {
      console.log(e)
      expect(e).toEqual({
        code: 'A label is required.'
      })
    }
  })

  it('badge message missing', async () => {
    try {
      // See https://stackoverflow.com/questions/64545786/how-to-correctly-expect-an-error-to-be-thrown-in-jest-from-inside-a-catch-block
      // for how to test promises that throw errors.

      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string => {
        switch (name) {
          case 'badge-type':
            return 'SUCCESS'
          case 'label':
            return 'Build'
          default:
            return ''
        }
      })

      await main.run()
    } catch (e) {
      console.log(e)
      expect(e).toEqual({
        code: 'A message is required.'
      })
    }
  })

  it('badge style type plastic', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'SUCCESS'
        case 'label':
          return 'build'
        case 'message':
          return 'success'
        case 'badge-style':
          return 'plastic'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'svg',
      expect.stringContaining('svg')
    )

    expect(errorMock).not.toHaveBeenCalled()
  })

  it('badge style type flat', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'SUCCESS'
        case 'label':
          return 'build'
        case 'message':
          return 'success'
        case 'badge-style':
          return 'flat'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'svg',
      expect.stringContaining('svg')
    )

    expect(errorMock).not.toHaveBeenCalled()
  })

  it('badge style type flat-square', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'SUCCESS'
        case 'label':
          return 'build'
        case 'message':
          return 'success'
        case 'badge-style':
          return 'flat-square'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'svg',
      expect.stringContaining('svg')
    )

    expect(errorMock).not.toHaveBeenCalled()
  })

  it('badge style type for-the-badge', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'SUCCESS'
        case 'label':
          return 'build'
        case 'message':
          return 'success'
        case 'badge-style':
          return 'for-the-badge'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'svg',
      expect.stringContaining('svg')
    )

    expect(errorMock).not.toHaveBeenCalled()
  })

  it('badge style type social', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'SUCCESS'
        case 'label':
          return 'build'
        case 'message':
          return 'success'
        case 'badge-style':
          return 'social'
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'svg',
      expect.stringContaining('svg')
    )

    expect(errorMock).not.toHaveBeenCalled()
  })

  it('badge style type empty string', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'SUCCESS'
        case 'label':
          return 'build'
        case 'message':
          return 'success'
        case 'badge-style':
          return '' // is still valid. defaults to for-the-badge
        default:
          return ''
      }
    })

    await main.run()

    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'svg',
      expect.stringContaining('svg')
    )

    expect(errorMock).not.toHaveBeenCalled()
  })

  it('badge style type invalid', async () => {
    try {
      // See https://stackoverflow.com/questions/64545786/how-to-correctly-expect-an-error-to-be-thrown-in-jest-from-inside-a-catch-block
      // for how to test promises that throw errors.

      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string => {
        switch (name) {
          case 'badge-type':
            return 'SUCCESS'
          case 'label':
            return 'build'
          case 'message':
            return 'success'
          case 'badge-style':
            return 'invalid'
          default:
            return ''
        }
      })

      await main.run()
    } catch (e) {
      expect(e).toEqual({
        code: 'invalid'
      })
    }
  })

  it('badge style type null', async () => {
    try {
      // See https://stackoverflow.com/questions/64545786/how-to-correctly-expect-an-error-to-be-thrown-in-jest-from-inside-a-catch-block
      // for how to test promises that throw errors.

      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string | null => {
        switch (name) {
          case 'badge-type':
            return 'SUCCESS'
          case 'label':
            return 'build'
          case 'message':
            return 'success'
          case 'badge-style':
            return null
          default:
            return ''
        }
      })

      await main.run()
    } catch (e) {
      expect(e)
    }
  })
})
