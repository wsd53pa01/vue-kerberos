let data = [
  {
    id: 1,
    applicationId: 1,
    name: '新增',
    code: 1
  },
  {
    id: 2,
    applicationId: 1,
    name: '刪除',
    code: 2
  },
  {
    id: 3,
    applicationId: 1,
    name: '修改',
    code: 4
  },
  {
    id: 4,
    applicationId: 1,
    name: '查詢',
    code: 8
  },
  {
    id: 5,
    applicationId: 2,
    name: '新增eip',
    code: 1
  },
  {
    id: 6,
    applicationId: 2,
    name: '刪除eip',
    code: 2
  }
]

module.exports = [
  {
    url: '/vue-admin-template/permission',
    type: 'get',
    response: config => {
      const { applicationId } = config.query
      return createResult(
        true,
        '',
        20000,
        data.filter(x => x.applicationId == applicationId)
      )
    }
  },

  {
    url: '/vue-admin-template/permission',
    type: 'post',
    response: config => {
      const body = config.body

      if (!body.applicationId) {
        return createResult(
          false,
          'applicationId為必填',
          50000,
          {}
        )
      }

      const emptyPermission = data.filter(x => x.applicationId == body.applicationId && !x.name)
      if (emptyPermission.length === 0) {
        body.id = Math.max(...data.map(x => x.id)) + 1
        body.code = Math.max(...data.map(x => x.code)) * 2
        data.push(body)
      } else {
        body.id = emptyPermission[0].id
        data.find(x => x.id == body.id).name = body.name
      }

      return createResult(
        true,
        '',
        20000,
        body
      )
    }
  },

  {
    url: '/vue-admin-template/permission',
    type: 'put',
    response: config => {
      console.log(config)
      const body = config.body
      return createResult(
        true,
        '',
        20000,
      )
    }
  },

  {
    url: '/vue-admin-template/permission',
    type: 'delete',
    response: config => {
      console.log(config)
      data = data.filter(value => value.id != id)

      return createResult(
        true,
        '',
        20000,
        data.filter(x => x.applicationId == applicationId)
      )
    }
  }
]

const createResult = (isSuccess, message, code, data) => {
  return {
    isSuccess,
    message,
    code,
    data
  }
}
