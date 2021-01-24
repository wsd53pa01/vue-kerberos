const { organization } = require('./organization.js')

module.exports = [
  {
    url: '/organization/',
    type: 'get',
    response: _ => {
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data: organization
      }
    }
  },
  {
    url: '/organization/',
    type: 'post',
    response: config => {
      const { name } = config.body
      let maxId = Math.max(...organization.map(x => x.id)) + 1
      organization.push({
        id: maxId,
        name: name
      })
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
      }
    }
  },
  {
    url: '/organization/',
    type: 'delete',
    response: config => {
      const { id } = config.body;
      let index = organization.findIndex(x => x.id == id)
      organization.splice(index, 1)
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
      }
    }
  },
  {
    url: '/organization/',
    type: 'put',
    response: config => {
      const { id, name } = config.body;
      let data = organization.find(x => x.id == id)
      data.name = name
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
      }
    }
  }
]
