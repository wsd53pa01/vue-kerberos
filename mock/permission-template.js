let templateData ={
  list: [{
    id: 1,
    name: '新增'
  }, {
    id: 2,
    name: '查看'
  }, {
    id: 4,
    name: '修改'
  }, {
    id: 8,
    name: '刪除'
  }, {
    id: 16,
    name: '批次新增'
  }, {
    id: 32,
    name: '批次刪除'
  }],
  total: 6
}


module.exports = [
  {
    url: '/permission-template',
    type: 'get',
    response: config => {
      const { id, name, page = 1, limit = 20 } = config.query
      let data = Object.assign({}, templateData)
      data.list = data.list.filter(item => {
        if (name && item.name.indexOf(name) < 0) return false
        if (id && item.id != id) return false
        return true
      })
      data.list = data.list.filter((item, index) => index < limit * page && index >= limit * (page - 1))
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data: data
      }
    }
  }, {
    url: '/permission-template',
    type: 'post',
    response: config => {
      const { name } = config.body
      templateData.list.forEach(item => {
      })
      let emptyNames = templateData.list.filter(item => {
        if (item.name == '') return true
        return false
      })
      let id = 0
      if (emptyNames.length === 0) {
        id = Math.max(...templateData.list.map(item => item.id)) * 2
        templateData.list.push({id, name})
        templateData.total += 1
      } else {
        id = Math.min(...emptyNames.map(item => item.id))
        templateData.list.forEach(item => {
          if (item.id == id) item.name = name
        })
      }
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data:  [{id, name}]
      }
    }
  }, {
    url: '/permission-template',
    type: 'put',
    response: config => {
      const { id, name } = config.body
      templateData.list.forEach(item => {
        if (item.id == id) item.name = name
      })
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data:  []
      }
    }
  }
  , {
    url: '/permission-template',
    type: 'delete',
    response: config => {
      const { id } = config.body
      templateData.list.forEach(item => {
        if (item.id == id) item.name = ''
      })
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data:  []
      }
    }
  }
]
