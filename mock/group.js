let data = [
  {
    applicationId: 1,
    id: 1,
    name: "權限管理群組",
  },
  {
    applicationId: 1,
    id: 2,
    name: "開發人員群組",
  },
  {
    applicationId: 2,
    id: 3,
    name: "權限管理群組",
  },
  {
    applicationId: 2,
    id: 4,
    name: "開發人員群組",
  },
  {
    applicationId: 2,
    id: 5,
    name: "一般人員群組",
  }
];

module.exports = [
  {
    url: "/vue-admin-template/group",
    type: "get",
    response: config => {
      const { applicationId } = config.query
      return {
        isSuccess: true,
        code: 20000,
        data: {
          groups: data.filter(x => x.applicationId == applicationId)
        }
      };
    }
  },

  {
    url: "/vue-admin-template/group",
    type: "post",
    response: config => {
      const body = config.body;
      body.id = Math.max(...data.map(x => x.id)) + 1;
      data.push(body);

      return {
        isSuccess: true,
        message: '新增成功',
        code: 20000,
        data: {}
      };
    },
  },

  {
    url: "/vue-admin-template/group",
    type: "put",
    response: config => {
      const { id, name } = config.body;
      data.find(x => x.id == id).name = name
      
      return {
        isSuccess: true,
        message: '修改成功',
        code: 20000,
        data: {}
      };
    }
  },

  {
    url: "/vue-admin-template/group",
    type: "delete",
    response: config => {
      const { id } = config.body
      data = data.filter(value => value.id != id)

      return {
        isSuccess: true,
        message: '刪除成功',
        code: 20000,
        data: {}
      };
    }
  }
];
