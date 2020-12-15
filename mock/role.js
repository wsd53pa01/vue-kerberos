module.exports = [
    {
      url: '/vue-admin-template/role',
      type: 'get',
      response: _ => {
        return {
          isSuccess: true,
          code: 20000,
          data: {
              roles: [{
                  id: 1,
                  name: '管理員'
              },{
                  id: 2,
                  name: '用戶'
              }]
          }
        }
      }
    }
  ]
  