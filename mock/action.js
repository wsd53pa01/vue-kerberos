module.exports = [
    {
        url: '/vue-admin-template/action\.*',
        type: 'get',
        response: config => {
            const { applicationId } = config.query
            if (applicationId == 1) {
                return {
                    isSuccess: true,
                    code: 20000,
                    data: {
                        actions: [{
                            applicationId: 91,
                            href: "",
                            icon: "",
                            id: 1,
                            menuCode: "0dc311ed-d9a0-476f-b64c-ae6a372f4e2a",
                            menuName: "應用程式設置",
                            operationFlag: 12,
                            parentCode: null,
                            sortNumber: 0
                        }, {
                            applicationId: 92,
                            href: "",
                            icon: "",
                            id: 2,
                            menuCode: "0dc311ed-d9a0-476f-b64c-ae6a372f4e2a",
                            menuName: "功能管理",
                            operationFlag: 15,
                            parentCode: null,
                            sortNumber: 0
                        }]
                    }
                }
            } else if (applicationId == 2) {
                return {
                    isSuccess: true,
                    code: 20000,
                    data: {
                        actions: [{
                            applicationId: 91,
                            href: "",
                            icon: "",
                            id: 1,
                            menuCode: "0dc311ed-d9a0-476f-b64c-ae6a372f4e2a",
                            menuName: "客戶流失報表",
                            operationFlag: 1,
                            parentCode: null,
                            sortNumber: 0
                        }, {
                            applicationId: 91,
                            href: "",
                            icon: "",
                            id: 2,
                            menuCode: "0dc311ed-d9a0-476f-b64c-ae6a372f4e2a",
                            menuName: "營收",
                            operationFlag: 8,
                            parentCode: null,
                            sortNumber: 0
                        }]
                    }
                }
            }
            else {
                return {
                    code: 20000,
                    data: []
                }
            }
        }
    }
]
