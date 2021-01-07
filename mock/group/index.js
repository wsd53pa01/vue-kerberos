const { adData, group } = require('./group.js')
let tempId = Number.MAX_VALUE


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
      const fakeData = group.filter(x => x.applicationId == applicationId)[0]
      let data = fakeData ? fakeData.list : []
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
      group.forEach(x => {
        if (x.applicationId == applicationId)
          x.list.push({ id: tempId--, label: name })
      })
      let temp = group.filter(x => x.applicationId == applicationId)[0].list
      let data = temp.filter(x => x.label == name)
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
      data.find(x => x.id == id).name = name
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
