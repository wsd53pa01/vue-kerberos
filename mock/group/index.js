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
      let data = group.filter(x => x.applicationId == applicationId)[0].list
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
]
