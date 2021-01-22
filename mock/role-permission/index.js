const { rolePermission } = require('./role-permission')
const { action } = require('../action/action.js')

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
      let permissionList = []
      if ( roleId != null && actionIds != null) {
        permissionList = rolePermission.filter(x => x.roleId == roleId && actionIds.includes(x.actionId.toString()))
        permissionList.forEach(x => {
          x.name = action.find(a => a.id.toString() == x.actionId).menuName
        });
      }
      return success('success', permissionList)
    }
  },

  {
    url: '/role-permission/',
    type: 'post',
    response: config => {
      const { roleId, permission } = config.body
      permission.forEach(p => {
        if(rolePermission.map(x => x.roleId).includes(roleId) && rolePermission.map(x => x.actionId).includes(p.id)) {
          rolePermission.find(x => x.roleId == roleId && x.actionId == p.id).operationFlag = p.operationFlag
        } else {
          // 如果找不到 roleId && p.id (actionId) 代表 目前 RolePermission 沒有資料，所以要 push 新增一筆資料
          let maxId = Math.max(...rolePermission.map(x => x.id)) + 1
          rolePermission.push({
            id: maxId,
            roleId: roleId,
            actionId: p.id,
            operationFlag: p.operationFlag
          })
        }
      })
      return success('success', {})
    }
  },

]
