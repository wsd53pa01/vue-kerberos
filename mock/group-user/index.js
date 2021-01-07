let { group } = require('../group/group.js')
let { user } = require('../user/user.js')
let { groupUser } = require('./group-user.js')

module.exports = [
  {
    url: '/group-user/tree/',
    type: 'get',
    response: config => {
      let result = []
      const { applicationId } = config.query
      let groupTemp = group.filter(g => g.application_id == applicationId)
      groupUser.forEach(groupUser => {
        // push group data
        if (!result.find((r => r.data_id == groupUser.group_id && r.tag == 'group'))) {
          let groupObj = groupTemp.find(g => g.id == groupUser.group_id)
          if (groupObj == null)
            return false
          result.push({
            id: `g_${groupObj.id}`,
            data_id: groupObj.id ,
            name: groupObj.name,
            tag: 'group',
            parentId: null
          })
        }
        // push user data
        if (!result.find((r => r.data_id == groupUser.user_id && r.tag == 'user'))) {
          let userObj = user.find(u => u.id == groupUser.user_id)
          if (userObj == null)
            return false
          result.push({
            id: groupUser.id,
            data_id: groupUser.user_id,
            name: userObj.name,
            tag: 'user',
            parentId: `g_${groupUser.group_id}`
          })
        }
      })
      // when group not in group-user's group_id. push group data
      groupTemp.forEach( g => {
        if (!result.find((r => r.data_id == g.id)))
          result.push({
            id: `g_${ g.id }`,
            data_id: g.id,
            name: g.name,
            tag: 'group',
            parentId: null
          })
      })
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data: result
      }
    },
  },
  {
    url: '/group-user/assign',
    type: 'post',
    response: config => {
      const { groupsId, usersId } = config.body
      let maxId = Math.max(...groupUser.map(gu => gu.id))
      groupsId.forEach(groupId => {
        usersId.forEach(userId => {
          maxId++
          groupUser.push({
            id: maxId,
            group_id: groupId,
            user_id: userId
          })
        })
      })
      return {
        code: 20000,
        message: 'success',
        isSuccess: true
      }
    }
  },
  {
    url: '/group-user/',
    type: 'delete',
    response: config => {
      const data = config.body
      if ( data.tag == 'group' )
      {
        group.forEach(g => {
          if (g.id == data.data_id)
            g.application_id = 0
        });
        groupUser.forEach(gu => {
          if (gu.group_id == data.data_id)
            gu.group_id = 0
        })
      }
      if ( data.tag == 'user')
      {
        groupUser.forEach(gu => {
          if (gu.id == data.id)
            gu.user_id = 0
        })
      }
      return {
        code: 20000,
        message: 'success',
        isSuccess: true
      }
    }
  }
]
