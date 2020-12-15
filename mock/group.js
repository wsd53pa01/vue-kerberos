module.exports = [
    {
      url: '/vue-admin-template/role',
      type: 'get',
      response: _ => {
        return {
          isSuccess: true,
          code: 20000,
          data: {
              groups: [{
                  id: 1,
                  name: '管理群'
              },{
                  id: 2,
                  name: '一般用戶群'
              }]
          }
        }
      }
    }
  ]
  