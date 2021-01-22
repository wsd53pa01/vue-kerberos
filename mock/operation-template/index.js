const { operationTemplate } = require('./operation-template.js')

module.exports = [
  {
    url: '/operation-template/',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data: operationTemplate
      }
    }
  }, {
    url: '/operation-template/',
    type: 'post',
    response: config => {
      const { name } = config.body
      let maxId = Math.max(...operationTemplate.map(x => x.id)) * 2
      operationTemplate.push({
        id: maxId,
        name: name
      })
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
      }
    }
  }, {
    url: '/operation-template/',
    type: 'put',
    response: config => {
      const { id, name } = config.body;
      let data = operationTemplate.find(x => x.id == id)
      data.name = name
      return {
        code: 20000,
        message: 'success',
        isSuccess: true
      }
    }
  }, {
    url: '/operation-template/',
    type: 'delete',
    response: config => {
      const { id } = config.body;
      let index = operationTemplate.findIndex(x => x.id == id)
      operationTemplate.splice(index, 1)
      return {
        code: 20000,
        message: 'success',
        isSuccess: true
      }
    }
  }
]
