
const { operation } = require('./operation.js')

module.exports = [
  {
    url: '/operation/',
    type: 'get',
    response: config => {
      const { applicationId } = config.query
      let operationFilter = operation.filter(x => x.applicationId == applicationId)
      return createResult(
        true,
        '',
        20000,
        operationFilter
      )
    }
  },

  {
    url: '/operation/',
    type: 'post',
    response: config => {
      const body = config.body
      console.log(body)
      if (!body.applicationId) {
        return createResult(
          false,
          'applicationId為必填',
          50000,
          {}
        )
      }

      const emptyOperation = operation.filter(x => x.applicationId == body.applicationId && !x.name)
      if (emptyOperation.length === 0) {
        body.id = Math.max(...operation.map(x => x.id)) + 1
        body.flag = Math.max(...operation.map(x => x.flag)) * 2
        operation.push(body)
      } else {
        body.id = emptyOperation[0].id
        operation.find(x => x.id == body.id).name = body.name
      }

      return createResult(
        true,
        '',
        20000,
        body
      )
    }
  },

  {
    url: '/operation/',
    type: 'put',
    response: config => {
      const { id, name } = config.body
      const toUpdate = operation.find(x => x.id == id)
      toUpdate.name = name
      return createResult(
        true,
        '',
        20000,
        toUpdate
      )
    }
  },

  {
    url: '/operation/',
    type: 'delete',
    response: config => {
      const { applicationId, id } = config.body
      operation.forEach(element => {
        if (element.id == id) {
          element.name = ''
        }
      })
      return createResult(
        true,
        '',
        20000,
        operation.filter(x => x.applicationId == applicationId)
      )
    }
  }
]

const createResult = (isSuccess, message, code, data) => {
  return {
    isSuccess,
    message,
    code,
    data
  }
}
