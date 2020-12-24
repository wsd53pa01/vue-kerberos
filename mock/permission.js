const data = [{
    applicationId: 1,
    name: '新增',
    permission: 1
}, {
    applicationId: 1,
    name: '刪除',
    permission: 2
}, {
    applicationId: 1,
    name: '修改',
    permission: 4
}, {
    applicationId: 1,
    name: '查詢',
    permission: 8
}, {
    applicationId: 2,
    name: '新增eip',
    permission: 1
}, {
    applicationId: 2,
    name: '刪除eip',
    permission: 2
}]

module.exports = [
    {
        url: '/vue-admin-template/permission',
        type: 'get',
        response: config => {
            const { applicationId } = config.query
            return createResult(false, "", 20000, data.filter(x => x.applicationId == applicationId));
        }
    }
]


const createResult = (isSuccess, message, code, data) => {
    return {
      isSuccess,
      message,
      code,
      data
    };
  };
  