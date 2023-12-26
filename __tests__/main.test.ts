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

  it('badge type null', async () => {
    await expect(async () => {
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

      return await main.run()
    }).rejects.toThrow('Badge type invalid.')
  })

  it('badge style invalid', async () => {
    await expect(async () => {
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
    }).rejects.toThrow('Badge style invalid.')
  })

  it('badge type success with label and message', async () => {
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

  it('badge type success with message no label', async () => {
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

  it('badge type success with label and no message', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string => {
        switch (name) {
          case 'badge-type':
            return 'SUCCESS'
          case 'label':
            return 'build'
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('A message is required.')
  })

  it('badge type success with label and null message', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string | null => {
        switch (name) {
          case 'badge-type':
            return 'SUCCESS'
          case 'label':
            return 'build'
          case 'message':
            return null
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('A message is required.')
  })

  it('badge type failure with label and message', async () => {
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

  it('badge type failure with message no label', async () => {
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

  it('badge type failure with label and no message', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string => {
        switch (name) {
          case 'badge-type':
            return 'FAILURE'
          case 'label':
            return 'build'
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('A message is required.')
  })

  it('badge type failure with label and null message', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string | null => {
        switch (name) {
          case 'badge-type':
            return 'FAILURE'
          case 'label':
            return 'build'
          case 'message':
            return null
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('A message is required.')
  })

  it('badge type passing with label and message', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'PASSING'
        case 'label':
          return 'build'
        case 'message':
          return 'passing'
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

  it('badge type passing with message no label', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'PASSING'
        case 'label':
          return 'build'
        case 'message':
          return 'passing'
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

  it('badge type passing with label and no message', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'PASSING'
        case 'label':
          return 'build'
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

  it('badge type passing with no label and no message', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'PASSING'
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

  it('badge type passing with label and null message', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string | null => {
      switch (name) {
        case 'badge-type':
          return 'PASSING'
        case 'label':
          return 'build'
        case 'message':
          return null
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

  it('badge type failing with label and message', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'FAILING'
        case 'label':
          return 'build'
        case 'message':
          return 'failing'
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

  it('badge type failing with message no label', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'FAILING'
        case 'label':
          return 'build'
        case 'message':
          return 'failing'
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

  it('badge type failing with label and no message', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'FAILING'
        case 'label':
          return 'build'
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

  it('badge type failing with no label and no message', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'FAILING'
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

  it('badge type failing with label and null message', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string | null => {
      switch (name) {
        case 'badge-type':
          return 'FAILING'
        case 'label':
          return 'build'
        case 'message':
          return null
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

  it('badge type information with label and message', async () => {
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

  it('badge type information with no label and message', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string | null => {
        switch (name) {
          case 'badge-type':
            return 'INFORMATION'
          case 'label':
            return 'build'
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('A message is required.')
  })

  it('badge type information with label and no message', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string | null => {
        switch (name) {
          case 'badge-type':
            return 'INFORMATION'
          case 'label':
            return 'build'
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('A message is required.')
  })

  it('badge type information with label and null message', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string | null => {
        switch (name) {
          case 'badge-type':
            return 'INFORMATION'
          case 'label':
            return 'build'
          case 'message':
            return null
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('A message is required.')
  })

  it('badge type information with null label and message', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string | null => {
        switch (name) {
          case 'badge-type':
            return 'INFORMATION'
          case 'label':
            return null
          case 'message':
            return 'build'
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('A label is required.')
  })

  it('badge type warning with label and message', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'WARNING'
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

  it('badge type warning with no label and message', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string | null => {
        switch (name) {
          case 'badge-type':
            return 'WARNING'
          case 'label':
            return 'build'
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('A message is required.')
  })

  it('badge type warning with label and no message', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string | null => {
        switch (name) {
          case 'badge-type':
            return 'WARNING'
          case 'label':
            return 'build'
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('A message is required.')
  })

  it('badge type warning with label and null message', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string | null => {
        switch (name) {
          case 'badge-type':
            return 'WARNING'
          case 'label':
            return 'build'
          case 'message':
            return null
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('A message is required.')
  })

  it('badge type warning with null label and message', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string | null => {
        switch (name) {
          case 'badge-type':
            return 'WARNING'
          case 'label':
            return null
          case 'message':
            return 'build'
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('A label is required.')
  })

  it('badge type datestamp with label, no message, datestamp-format, datestamp-timezone, datestamp-datestyle, datestamp-timestyle', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string => {
      switch (name) {
        case 'badge-type':
          return 'DATESTAMP'
        case 'label':
          return 'build'
        case 'datestamp-format':
          return 'en-US'
        case 'datestamp-timezone':
          return 'US/Mountain'
        case 'datestamp-datestyle':
          return 'full'
        case 'datestamp-timestyle':
          return 'FULL'
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

  it('badge type datestamp with label, no message, invalid datestamp-format, datestamp-timezone, datestamp-datestyle, datestamp-timestyle', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string => {
        switch (name) {
          case 'badge-type':
            return 'DATESTAMP'
          case 'label':
            return 'build'
          case 'datestamp-format':
            return 'invalid'
          case 'datestamp-timezone':
            return 'US/Mountain'
          case 'datestamp-datestyle':
            return 'full'
          case 'datestamp-timestyle':
            return 'FULL'
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('Badge datestamp format invalid.')
  })

  it('badge type datestamp with label, no message, datestamp-format, invalid datestamp-timezone, datestamp-datestyle, datestamp-timestyle', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string => {
        switch (name) {
          case 'badge-type':
            return 'DATESTAMP'
          case 'label':
            return 'build'
          case 'datestamp-format':
            return 'en-US'
          case 'datestamp-timezone':
            return 'invalid'
          case 'datestamp-datestyle':
            return 'full'
          case 'datestamp-timestyle':
            return 'FULL'
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('Badge datestamp timezone invalid.')
  })

  it('badge type datestamp with label, no message, datestamp-format, datestamp-timezone, invalid datestamp-datestyle, datestamp-timestyle', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string => {
        switch (name) {
          case 'badge-type':
            return 'DATESTAMP'
          case 'label':
            return 'build'
          case 'datestamp-format':
            return 'en-US'
          case 'datestamp-timezone':
            return 'UTC'
          case 'datestamp-datestyle':
            return 'invalid'
          case 'datestamp-timestyle':
            return 'FULL'
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('Badge datestamp date style invalid.')
  })

  it('badge type datestamp with label, no message, datestamp-format, datestamp-timezone, datestamp-datestyle, invalid datestamp-timestyle', async () => {
    await expect(async () => {
      // Set the action's inputs as return values from core.getInput()
      getInputMock.mockImplementation((name: string): string => {
        switch (name) {
          case 'badge-type':
            return 'DATESTAMP'
          case 'label':
            return 'build'
          case 'datestamp-format':
            return 'en-US'
          case 'datestamp-timezone':
            return 'UTC'
          case 'datestamp-datestyle':
            return 'full'
          case 'datestamp-timestyle':
            return 'invalid'
          default:
            return ''
        }
      })

      await main.run()
    }).rejects.toThrow('Badge datestamp time style invalid.')
  })

  it('badge type datestamp with label, no message, null datestamp-format, datestamp-timezone, datestamp-datestyle, datestamp-timestyle', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string | null => {
      switch (name) {
        case 'badge-type':
          return 'DATESTAMP'
        case 'label':
          return 'build'
        case 'datestamp-format':
          return null
        case 'datestamp-timezone':
          return 'US/Mountain'
        case 'datestamp-datestyle':
          return 'full'
        case 'datestamp-timestyle':
          return 'FULL'
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

  it('badge type datestamp with label, no message, datestamp-format, null datestamp-timezone, datestamp-datestyle, datestamp-timestyle', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string | null => {
      switch (name) {
        case 'badge-type':
          return 'DATESTAMP'
        case 'label':
          return 'build'
        case 'datestamp-format':
          return 'en-US'
        case 'datestamp-timezone':
          return null
        case 'datestamp-datestyle':
          return 'full'
        case 'datestamp-timestyle':
          return 'FULL'
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

  it('badge type datestamp with label, no message, datestamp-format, datestamp-timezone, null datestamp-datestyle, datestamp-timestyle', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string | null => {
      switch (name) {
        case 'badge-type':
          return 'DATESTAMP'
        case 'label':
          return 'build'
        case 'datestamp-format':
          return 'en-US'
        case 'datestamp-timezone':
          return 'US/Mountain'
        case 'datestamp-datestyle':
          return null
        case 'datestamp-timestyle':
          return 'FULL'
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

  it('badge type datestamp with label, no message, datestamp-format, datestamp-timezone, datestamp-datestyle, null datestamp-timestyle', async () => {
    // Set the action's inputs as return values from core.getInput()
    getInputMock.mockImplementation((name: string): string | null => {
      switch (name) {
        case 'badge-type':
          return 'DATESTAMP'
        case 'label':
          return 'build'
        case 'datestamp-format':
          return 'en-US'
        case 'datestamp-timezone':
          return 'US/Mountain'
        case 'datestamp-datestyle':
          return 'full'
        case 'datestamp-timestyle':
          return null
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

  it('badge style null', async () => {
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

    expect(runMock).toHaveReturned()

    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      'svg',
      expect.stringContaining('svg')
    )

    expect(errorMock).not.toHaveBeenCalled()
  })
})
