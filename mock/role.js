let data = [
  {
    applicationId: 1,
    id: 1,
    name: "Administrator",
  },
  {
    applicationId: 1,
    id: 2,
    name: "Developer",
  },
  {
    applicationId: 2,
    id: 3,
    name: "RoleA",
  },
  {
    applicationId: 2,
    id: 4,
    name: "RoleB",
  },
  {
    applicationId: 2,
    id: 5,
    name: "RoleC",
  },
  {
    applicationId: 2,
    id: 6,
    name: "RoleD",
  },
];

module.exports = [
  {
    url: "/vue-admin-template/role",
    type: "get",
    response: config => {
      const { applicationId } = config.query
      
      return {
        isSuccess: true,
        code: 20000,
        data: {
          roles: data.filter(x => x.applicationId == applicationId)
        }
      };
    }
  },

  {
    url: "/vue-admin-template/role",
    type: "post",
    response: config => {
      const body = config.body;
      body.id = Math.max(...data.map(x => x.id)) + 1
      data.push(body)
      
      return {
        isSuccess: true,
        message: '新增成功',
        code: 20000,
        data: {}
      };
    }
  },

  {
    url: "/vue-admin-template/role",
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
    url: "/vue-admin-template/role",
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
