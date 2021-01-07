let { application } = require('./application.js')
let { group } = require('../group/group.js')
let { groupUser } = require('../group-user/group-user.js')

module.exports = [
  {
    url: '/application/',
    type: 'get',
    response: _ => {
      let data = { applications: application }
      return {
        isSuccess: true,
        code: 20000,
        data
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
        user_id: 1
      })

      return {
        isSuccess: true,
        code: 20000,
        data
      }
    }
  }
]
