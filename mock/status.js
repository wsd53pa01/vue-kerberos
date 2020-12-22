const application = require("./application");

const roleId1 = [
  {
    id: "1",
    roleId: "1",
    roleName: "Administrator",
    groupId: "1",
    groupName: "權限管理群組",
    applicationId: "1",
    status: '2'
  },
  {
    id: "2",
    roleId: "1",
    roleName: "Administrator",
    groupId: "2",
    groupName: "開發人員群組",
    applicationId: "1",
    status: '2'
  }
];
const roleId2 = [
  {
    id: null,
    roleId: "2",
    roleName: "Developer",
    groupId: "1",
    groupName: "權限管理群組",
    applicationId: "1",
    status: '0'
  },
  {
    id: "4",
    roleId: "2",
    roleName: "Developer",
    groupId: "2",
    groupName: "開發人員群組",
    applicationId: "1",
    status: '2'
  }
];
const group1 = [
  {
    id: "5",
    roleId: "1",
    roleName: "Administrator",
    groupId: "1",
    groupName: "權限管理群組",
    applicationId: "1",
    status: '2'
  },
  {
    id: "6",
    roleId: "2",
    roleName: "Developer",
    groupId: "2",
    groupName: "開發人員群組",
    applicationId: "1",
    status: '2'
  }
];
const group2 = [
  {
    id: null,
    roleId: "2",
    roleName: "Developer",
    groupId: "1",
    groupName: "權限管理群組",
    applicationId: "1",
    status: '0'
  },
  {
    id: "8",
    groupId: "2",
    roleId: "1",
    roleName: "Administrator",
    groupName: "開發人員群組",
    applicationId: "1",
    status: '2'
  }
];

module.exports = [
  {
    url: "/vue-admin-template/status",
    type: "get",
    response: config => {
      const { applicationId, roleId, groupId } = config.query;
      if (roleId && groupId) {
        return createResult(false, "參數過多", 50000, {});
      }

      let result
      if (roleId) {
        result = roleId == '1' ? roleId1 : roleId2
      } else if (groupId) {
        result = groupId == '1' ? group1 : group2
      }

      return createResult(false, "", 20000, {
        status: result.filter(x => x.applicationId == applicationId)
      });
    }
  }
];

const createResult = (isSuccess, message, code, data) => {
  return {
    isSuccess,
    message,
    code,
    data
  };
};
