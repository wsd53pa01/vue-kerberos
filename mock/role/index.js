const { role } = require('./role.js')

module.exports = [
  {
    url: "/role/",
    type: "get",
    response: config => {
      const { applicationId } = config.query;

      return {
        isSuccess: true,
        code: 20000,
        data: role.filter(x => x.applicationId == applicationId)
      };
    }
  },

  {
    url: "/role/",
    type: "post",
    response: config => {
      const body = config.body;
      body.id = Math.max(...role.map(x => x.id)) + 1;
      let data = {
        id: body.id,
        application_id: body.applicationId,
        name: body.name
      }
      role.push(data);

      return {
        isSuccess: true,
        message: "新增成功",
        code: 20000,
        data: data
      };
    }
  },

  {
    url: "/role/",
    type: "put",
    response: config => {
      const { id, name } = config.body;
      console.log('put before: ', role)
      role.find(x => x.id == id).name = name;
      console.log('put after: ', role)
      return {
        isSuccess: true,
        message: "修改成功",
        code: 20000,
        data: {}
      };
    }
  },

  {
    url: "/role/",
    type: "delete",
    response: config => {
      const { id } = config.body;
      console.log('delete before: ', role)
      console.log(id)
      const index = role.findIndex(r => r.id == id)
      console.log(index)
      if (index > -1)
      role.splice(index,  1)
      console.log('delete after: ', role)
      return {
        isSuccess: true,
        message: "刪除成功",
        code: 20000,
        data: {}
      };
    }
  }
]
