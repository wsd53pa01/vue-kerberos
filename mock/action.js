let data = [
  {
    applicationId: 1,
    href: "",
    icon: "",
    id: 1,
    menuCode: "5b16c132-efba-4084-a581-ff08dd9b91da",
    menuName: "應用程式設置",
    operationFlag: 12,
    parentCode: null,
    sortNumber: 0
  },
  {
    applicationId: 1,
    href: "",
    icon: "",
    id: 2,
    menuCode: "0b692ed2-d863-486c-9c35-d715c0e2e841",
    menuName: "功能管理",
    operationFlag: 15,
    parentCode: null,
    sortNumber: 0
  },
  {
    applicationId: 1,
    href: "",
    icon: "",
    id: 3,
    menuCode: "02ef25da-f015-4982-8334-521263f0ef35",
    menuName: "功能管理的兒子",
    operationFlag: 15,
    parentCode: "0b692ed2-d863-486c-9c35-d715c0e2e841",
    sortNumber: 0
  },
  {
    applicationId: 2,
    href: "",
    icon: "",
    id: 3,
    menuCode: "1b86e4c5-91d2-4bc0-afbd-e559d3fb9ec3",
    menuName: "客戶流失報表",
    operationFlag: 1,
    parentCode: null,
    sortNumber: 0
  },
  {
    applicationId: 2,
    href: "",
    icon: "",
    id: 4,
    menuCode: "0dc311ed-d9a0-476f-b64c-ae6a372f4e2a",
    menuName: "營收",
    operationFlag: 8,
    parentCode: null,
    sortNumber: 0
  }
];

module.exports = [
  {
    url: "/action/",
    type: "get",
    response: config => {
      const { applicationId } = config.query
      let action = data.filter(x => x.applicationId == applicationId)

      return createResponse(
        true,
        "",
        20000,
        action
      );
    }
  },

  {
    url: "/action/",
    type: "put",
    response: config => {
      const { id, href, icon, operationFlag, sortNumber, parentCode, menuName } = config.body;
      const toUpdate = data.find(value => value.id === id)
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
        id: Math.max(...data.map(x => x.id)) + 1,
        menuCode: Math.max(...data.map(x => x.id)) + 1,
        href,
        icon,
        operationFlag: operationFlag | 0,
        sortNumber: sortNumber | 0,
        parentCode,
        menuName,
        applicationId
      }
      data.push(d)
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
      data = data.filter(value => value.id != id)

      return createResponse(true, '刪除成功', 20000, data)
    }
  }
];

const createResponse = (isSuccess, message, code, data) => {
  return {
    isSuccess,
    message,
    code,
    data
  };
};
