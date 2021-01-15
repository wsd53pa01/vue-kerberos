let { group } = require('../group/group.js')
let { role } = require('../role/role.js')
let { roleGroup } = require('./role-group.js')

module.exports = [
  {
    url: '/role-group/tree/',
    type: 'get',
    response: config => {
      let result = []
      const { applicationId } = config.query
      let groupList = group.filter(g => g.application_id == applicationId)
      let roleList = role.filter(r => r.application_id == applicationId)
      roleList.forEach(roleObj => {
        result.push({
          id: `r_${roleObj.id}`,
          data_id: roleObj.id,
          name: roleObj.name,
          tag: 'role',
          parentId: null
        })
        roleGroup.forEach( roleGroup => {
          if (roleGroup.role_id == roleObj.id) {
            let groupObj = groupList.find(g => g.id == roleGroup.group_id)
            if (groupObj == null)
              return false
            result.push({
              id: roleGroup.id,
              data_id: roleGroup.group_id,
              name: groupObj.name,
              tag: 'group',
              parentId: `r_${roleGroup.role_id}`
            })
          }
        })
      })
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data: result
      }
    }
  },
  {
    url: '/role-group/assign/',
    type: 'post',
    response: config => {
      const { rolesId, groupsId } = config.body
      let id = Math.max(...roleGroup.map(x => x.id)) + 1
      rolesId.forEach(roleId => {
        let existsGroupId = roleGroup.filter(x => x.role_id == roleId).map(x => x.group_id)
        groupsId.forEach(groupId => {
          if (existsGroupId.includes(groupId))
            return false
          id++
          roleGroup.push({
            id: id,
            role_id: roleId,
            group_id: groupId
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
    url: '/role-group/',
    type: 'delete',
    response: config => {
      const data = config.body
      if ( data.tag == 'role' )
      {
        let index = role.findIndex(x => x.id == data.data_id)
        role.splice(index, 1)
        let roleGroupList = roleGroup.filter(x => role_id == data_id)
        roleGroupList.forEach(x => {
          let index = role.findIndex(x => x.id == data.data_id)
          role.splice(index, 1)
        })
      }
      if ( data.tag == 'group')
      {
        let index = roleGroup.findIndex(x => x.id == data.id)
        roleGroup.splice(index, 1)
      }
      return {
        code: 20000,
        message: 'success',
        isSuccess: true
      }
    }
  }
]
