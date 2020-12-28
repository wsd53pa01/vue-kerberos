module.exports = [
    {
        url: '/vue-admin-template/permissions/',
        type: 'get',
        response: config => {
            const { applicationId } = config.query
            let data = []

            if (applicationId == 1) {
                data = {
                    permissions: [{
                        name: '新增',
                        permission: 1
                    }, {
                        name: '刪除',
                        permission: 2
                    }, {
                        name: '修改',
                        permission: 4
                    }, {
                        name: '查詢',
                        permission: 8
                    }]
                }
            }
            else if (applicationId == 2) {
                data = {
                    permissions: [{
                        name: '新增eip',
                        permission: 1
                    }, {
                        name: '刪除eip',
                        permission: 2
                    }]
                }
            }
            else {
                data = {}
            }
            return {
                isSuccess: true,
                code: 20000,
                data: data
            }
        }
    }
]
