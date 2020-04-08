const statueController = require('./statue.controller')

describe('Sample Test', () => {
  it('should test that true === true', () => {
    expect(true).toBe(true)
  })
})

describe('createOne', () => {
  it('creates a new doc', async () => {
    expect.assertions(2)
    const body = {name: 'name'}

    const req = {
      body,
    }

    const res = {
      status(status) {
        expect(status).toBe(201)
        return this
      },
      json(results) {
        console.log(results)
        expect(results.data.user.name).toBe(body.name)
      },
    }

    await statueController.getStatue(req, res)
  })
})
