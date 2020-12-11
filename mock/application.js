module.exports = [
  {
    url: '/vue-admin-template/application',
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
  }
]
