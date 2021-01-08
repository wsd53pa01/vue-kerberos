const { adData, group } = require('./group.js')

module.exports = [
  {
    url: '/group/ad/',
    type: 'get',
    response: _ => {

      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data: adData
      }
    },
  },
  {
    url: '/group/',
    type: 'get',
    response: config => {
      const { applicationId } = config.query
      let data = group.filter(x => x.application_id == applicationId)
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data: data
      }
    }
  },
  {
    url: '/group/',
    type: 'post',
    response: config => {
      const { applicationId, name } = config.body
      console.log(group)
      let maxId = Math.max(...group.filter(g => g.application_id == applicationId).map(g => g.id)) + 1
      group.push({ id: maxId, name: name, application_id: applicationId })
      let data = group.find(g => g.id == maxId)
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data: data
      }
    }
  },
  {
    url: '/group/',
    type: 'put',
    response: config => {
      const { id, name } = config.body;
      group.forEach(x => {
          if (x.id == id)
            x.name = name
        })
      return {
        isSuccess: true,
        message: '修改成功',
        code: 20000,
        data: {}
      }
    }
  },
  {
    url: "/group/",
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
]
