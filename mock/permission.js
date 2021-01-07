let data = [
  {
    id: 1,
    applicationId: 1,
    name: '新增',
    operationFlag: 1
  },
  {
    id: 2,
    applicationId: 1,
    name: '刪除',
    operationFlag: 2
  },
  {
    id: 3,
    applicationId: 1,
    name: '修改',
    operationFlag: 4
  },
  {
    id: 4,
    applicationId: 1,
    name: '查詢',
    operationFlag: 8
  },
  {
    id: 5,
    applicationId: 2,
    name: '新增eip',
    operationFlag: 1
  },
  {
    id: 6,
    applicationId: 2,
    name: '刪除eip',
    operationFlag: 2
  }
]

module.exports = [
  {
    url: '/permission/',
    type: 'get',
    response: config => {
      const { applicationId, name, operationFlag, limit, page } = config.query
      let filterPermission = data.filter(x => {
        const filterApplication = x.applicationId == applicationId
        const filterName = x.name.includes(name) || name === '' || name == null
        const filteroperationFlag = x.operationFlag == operationFlag || operationFlag == '' || operationFlag == null
        return filterApplication && filterName && filteroperationFlag
      })

      if (limit && page) {
        const start = page * limit - limit
        const end = page * limit
        filterPermission = filterPermission.slice(start, end)
      }

      return createResult(
        true,
        '',
        20000,
        filterPermission
      )
    }
  },

  {
    url: '/permission/',
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
        body.operationFlag = Math.max(...data.map(x => x.operationFlag)) * 2
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
    url: '/permission/',
    type: 'put',
    response: config => {
      const { id, name } = config.body

      const toUpdate = data.find(x => x.id == id)
      toUpdate.name = name
      return createResult(
        true,
        '',
        20000,
        toUpdate
      )
    }
  },

  {
    url: '/permission/',
    type: 'delete',
    response: config => {
      const { applicationId, id } = config.body
      data.forEach(element => {
        if (element.id == id) {
          element.name = ''
        }
      })

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
