const data = require('./role-permission')

const success = (message, data) => {
  return {
    isSuccess: true,
    message: message,
    code: 20000,
    data: data
  }
}

module.exports = [
  {
    url: '/role-permission/',
    type: 'get',
    response: config => {
      const { roleId, actionIds } = config.query
      const result = data.filter(x => x.roleId == roleId && actionIds.includes(x.actionId))
      return success('', result)
    }
  },

  {
    url: '/role-permission/',
    type: 'post',
    response: config => {
      return success('', {})
    }
  },

]
