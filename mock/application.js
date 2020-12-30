module.exports = [
  {
    url: '/application/',
    type: 'get',
    response: _ => {
      return {
        isSuccess: true,
        code: 20000,
        data: {
            applications: [{
                id: 1,
                name: 'Kerberos'
            },{
                id: 2,
                name: 'EipApp'
            }]
        }
      }
    }
  }, {
    url: '/application/',
    type: 'post',
    response: config => {
      const { name } = config.body
      return {
        isSuccess: true,
        code: 20000,
        data: {
          name: name,
          id: 1
        }
      }
    }
  }
]
