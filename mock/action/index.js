const { action } = require('./action.js')
const { uuid } = require('../utils')

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
      console.log( config.body)
      const { menuCode } = config.body;
      console.log(menuCode)
      let data = action.find(value => value.menuCode == menuCode)
      Object.keys(config.body).forEach(key => {
        if (key != menuCode && key != 'id') {
          data[key] = config.body[key]
        }
      })
      console.log(data)
      return createResponse(true, '', 20000, data)
    }
  },
  {
    url: "/action/",
    type: "post",
    response: config => {
      console.log('post before: ', action)
      const { href, icon, operationFlag, sortNumber, parentCode, menuName, applicationId } = config.body;
      const d = {
        id: Math.max(...action.map(x => x.id)) + 1,
        menuCode: uuid(),
        href,
        icon,
        operationFlag: operationFlag | 0,
        sortNumber: sortNumber | 0,
        parentCode,
        menuName,
        applicationId
      }
      action.push(d)
      console.log('post after: ', action)
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
      let deleteList = action.filter(x => x.menuCode == id || x.parentCode == id).map(x => x.id)
      deleteList.forEach(id => {
        let index = action.findIndex(x => x.id == id)
        action.splice(index, 1)
      })
      return createResponse(true, '刪除成功', 20000)
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
