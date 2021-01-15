let organizations = {
  list: [{
    id: 1,
    name: 'Organization 1'
  }, {
    id: 2,
    name: 'Organization 5'
  }, {
    id: 3,
    name: 'Organization 11'
  }, {
    id: 4,
    name: 'Organization 12'
  }, {
    id: 5,
    name: 'Organization 13'
  }, {
    id: 6,
    name: 'Organization 14'
  }, {
    id: 7,
    name: 'Organization 15'
  }, {
    id: 8,
    name: 'Organization 16'
  }, {
    id: 9,
    name: 'Organization 17'
  }, {
    id: 10,
    name: 'Organization 18'
  }, {
    id: 11,
    name: 'Organization 19'
  }, {
    id: 12,
    name: 'Organization 20'
  }, {
    id: 13,
    name: 'Organization 21'
  }, {
    id: 14,
    name: 'Organization 22'
  }, {
    id: 15,
    name: 'Organization 23'
  }, {
    id: 16,
    name: 'Organization 24'
  }, {
    id: 17,
    name: 'Organization 25'
  }, {
    id: 18,
    name: 'Organization 26'
  }, {
    id: 19,
    name: 'Organization 27'
  }, {
    id: 20,
    name: 'Organization 28'
  }, {
    id: 21,
    name: 'Organization 29'
  }, {
    id: 22,
    name: 'Organization 30'
  }, {
    id: 23,
    name: 'Organization 31'
  }, {
    id: 24,
    name: 'Organization 32'
  }, {
    id: 25,
    name: 'Organization 33'
  }, {
    id: 26,
    name: 'Organization 34'
  }, {
    id: 27,
    name: 'Organization 35'
  }, {
    id: 28,
    name: 'Organization 36'
  }, {
    id: 29,
    name: 'Organization 37'
  }, {
    id: 30,
    name: 'Organization 38'
  }, {
    id: 31,
    name: 'Organization 39'
  }, {
    id: 32,
    name: 'Organization 40'
  }, {
    id: 33,
    name: 'Organization 41'
  }],
  total: 33
}

module.exports = [
  {
    url: '/organization/',
    type: 'get',
    response: config => {
      const { name, page = 1, limit = 20 } = config.query
      let data = Object.assign({}, organizations)
      data.list = data.list.filter(item => {
        if (name && item.name.indexOf(name) < 0) return false
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
    url: '/organization/',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data:  []
      }
    }
  }, {
    url: '/organization/',
    type: 'put',
    response: _ => {
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data:  []
      }
    }
  }, {
    url: '/organization/',
    type: 'delete',
    response: _ => {
      return {
        code: 20000,
        message: 'success',
        isSuccess: true,
        data:  []
      }
    }
  }
]
