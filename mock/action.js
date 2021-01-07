const data = [
  {
    applicationId: 1,
    href: "",
    icon: "",
    id: 1,
    menuCode: "0dc311ed-d9a0-476f-b64c-ae6a372f4e2a",
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
    menuCode: "0dc311ed-d9a0-476f-b64c-ae6a372f4e2a",
    menuName: "功能管理",
    operationFlag: 15,
    parentCode: null,
    sortNumber: 0
  },
  {
    applicationId: 2,
    href: "",
    icon: "",
    id: 3,
    menuCode: "0dc311ed-d9a0-476f-b64c-ae6a372f4e2a",
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
    }
  },

  {
    url: "/action/",
    type: "post",
    response: config => {
      const body = config.body;
      body.id = Math.max(...data.map(x => x.id)) + 1
      data.push(body)
      return createResponse(
        true,
        "",
        20000,
        data.filter(x => x.applicationId == body.applicationId)
      );
    }
  },

  {
    url: "/action/",
    type: "delete",
    response: config => {}
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
