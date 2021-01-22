let { application } = require('./application.js')
let { group } = require('../group/group.js')
let { groupUser } = require('../group-user/group-user.js')
let { operation } = require('../operation/operation.js')
let { operationTemplate } = require('../operation-template/operation-template.js')

module.exports = [
  {
    url: '/application/',
    type: 'get',
    response: _ => {
      return {
        isSuccess: true,
        code: 20000,
        data: application
      }
    }
  }, {
    url: '/application/',
    type: 'post',
    response: config => {
      const { name } = config.body
      let maxApplicationId = Math.max(...application.map(a => a.id)) + 1
      const data = {
        id: maxApplicationId,
        name
      }
      application.push(data)

      let maxGroupId = (Math.max(...group.map(a => a.id)) + 1) | 1
      group.push({
        id: maxGroupId,
        application_id: maxApplicationId,
        name: '權限管理群組',
      })

      let maxGroupUserId = (Math.max(...groupUser.map(a => a.id)) + 1 ) | 1
      groupUser.push({
        id: maxGroupUserId,
        group_id: maxGroupId,
        user_id: 1111
      })

      let maxOperationId = Math.max(...operation.map(a => a.id)) + 1
      operationTemplate.forEach(template => {
        operation.push({
          id: maxOperationId++,
          applicationId: maxApplicationId,
          name: template.name,
          flag: template.id
        })
      })

      return {
        isSuccess: true,
        code: 20000,
        data
      }
    }
  },

  {
    url: '/application/',
    type: 'put',
    response: config => {
      const body = config.body
      const app = application.find(value => value.id == body.id)
      app.name = body.name
      return {
        isSuccess: true,
        code: 20000,
        body
      }
    }
  },

  {
    url: '/application/',
    type: 'delete',
    response: config => {
      const { id } = config.body
      application = application.filter(value => value.id != id)
      return {
        isSuccess: true,
        code: 20000,
        application
      }
    }
  },
]
