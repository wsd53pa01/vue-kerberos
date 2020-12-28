const { group } = require('../group/group.js')
const { user } = require('../user/user.js')
const { groupUser } = require('./group-user.js')


module.exports = [
  {
    url: '/group-user/tree/',
    type: 'get',
    response: config => {
      let result = []
      const { applicationId } = config.query
      let temp = group.filter(x => x.applicationId == applicationId)[0].list
      groupUser.forEach(x => {
        if (!result.find((r => r.id == x.group_id && r.tag == 'group'))) {
          console.log(temp)
          let groupTemp = temp.filter(g => g.id == x.group_id)[0]
          result.push({ id: x.group_id, name: groupTemp.label, tag: 'group', parentId: null })
        }
        if (!result.find((r => r.id == x.user_id && r.tag == 'user'))) {
          let userTemp = user.filter(u => u.id == x.user_id)[0]
          result.push({ id: x.user_id, name: userTemp.name, tag: 'user', parentId: x.group_id })
        }
      })
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data: result
      }
    },
  }
]
