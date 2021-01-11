const { action } = require('./action.js')

module.exports = [
  {
    url: '/action/',
    type: 'get',
    response: config => {
      const { applicationId } = config.query
      let data = action.filter(x => x.applicationId == applicationId)
      return createResponse(
        true,
        'success',
        20000,
        data
      )
    }
  },
  {
    url: "/action/",
    type: "put",
    response: config => {
      const { id, href, icon, operationFlag, sortNumber, parentCode, menuName } = config.body;
      const toUpdate = action.find(value => value.id === id)
      toUpdate.href = href
      toUpdate.icon = icon
      toUpdate.operationFlag = operationFlag
      toUpdate.sortNumber = sortNumber
      toUpdate.parentCode = parentCode
      toUpdate.menuName = menuName
      return createResponse(true, '', 20000, toUpdate)
    }
  },
  {
    url: "/action/",
    type: "post",
    response: config => {
      const { href, icon, operationFlag, sortNumber, parentCode, menuName, applicationId } = config.body;
      const d = {
        id: Math.max(...action.map(x => x.id)) + 1,
        menuCode: Math.max(...action.map(x => x.id)) + 1,
        href,
        icon,
        operationFlag: operationFlag | 0,
        sortNumber: sortNumber | 0,
        parentCode,
        menuName,
        applicationId
      }
      action.push(d)
      return createResponse(
        true,
        "更新成功",
        20000,
        d
      );
    }
  },
  {
    url: "/action/",
    type: "delete",
    response: config => {
      const { id } = config.body
      let index = action.findIndex(x => x.id == id)
      action.splice(index, 1)
      return createResponse(true, '刪除成功', 20000, data)
    }
  }
]

const createResponse = (isSuccess, message, code, data) => {
  return {
    isSuccess,
    message,
    code,
    data
  };
};
