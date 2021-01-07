const adData = [{
    id: 1,
    label: 'root 1',
    children: [{
      id: 11,
      label: 'node 11',
      children: [{
        id: 111,
        label: 'node 111',
        children: [{
          id: 1111,
          label: 'node 1111111111',
        },{
          id: 1112,
          label: 'node 1112',
        }, {
          id: 1113,
          label: 'node 1113',
        }, {
          id: 1114,
          label: 'node 1114',
        }]
      },{
        id: 112,
        label: 'node 112',
      }, {
        id: 113,
        label: 'node 113',
      }, {
        id: 114,
        label: 'node 114',
      }]
    }, {
      id: 12,
      label: 'node 12',
    }, {
      id: 13,
      label: 'node 13',
    }, {
      id: 14,
      label: 'node 14',
    }]
  }, {
    id: 2,
    label: 'root 2',
    children: [{
      id: 21,
      label: 'node 21',
      children: [{
        id: 211,
        label: 'node 211',
      },{
        id: 212,
        label: 'node 212',
      }, {
        id: 213,
        label: 'node 213',
      }, {
        id: 214,
        label: 'node 214',
      }]
    }, {
      id: 22,
      label: 'node 22',
    }, {
      id: 23,
      label: 'node 23',
    }, {
      id: 24,
      label: 'node 24',
    }]
  }]

const group  = [{
  applicationId: 1,
  list: [{
    id: 1,
    name: '權限管理群組'
  }]
}]

module.exports = {
  adData,
  group
}
