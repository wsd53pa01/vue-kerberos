const adData = [{
    id: 1,
    label: 'root 1',
    tag: 'group',
    children: [{
      id: 11,
      label: 'node 11',
      tag: 'group',
      children: [{
        id: 111,
        label: 'node 111',
        tag: 'group',
        children: [{
          id: 1111,
          label: 'admin',
          tag: 'user',
        },{
          id: 1112,
          label: 'node 1112',
          tag: 'user',
        }, {
          id: 1113,
          label: 'node 1113',
          tag: 'user',
        }, {
          id: 1114,
          label: 'node 1114',
          tag: 'user',
        }]
      },{
        id: 112,
        label: 'node 112',
        tag: 'user',
      }, {
        id: 113,
        label: 'node 113',
        tag: 'user',
      }, {
        id: 114,
        label: 'node 114',
        tag: 'user',
      }]
    }, {
      id: 12,
      label: 'node 12',
      tag: 'user',
    }, {
      id: 13,
      label: 'node 13',
      tag: 'user',
    }, {
      id: 14,
      label: 'node 14',
      tag: 'user',
    }]
  }, {
    id: 2,
    label: 'root 2',
    tag: 'group',
    children: [{
      id: 21,
      label: 'node 21',
      tag: 'group',
      children: [{
        id: 211,
        label: 'node 211',
        tag: 'user',
      },{
        id: 212,
        label: 'node 212',
        tag: 'user',
      }, {
        id: 213,
        label: 'node 213',
        tag: 'user',
      }, {
        id: 214,
        label: 'node 214',
        tag: 'user',
      }]
    }, {
      id: 22,
      label: 'node 22',
      tag: 'user',
    }, {
      id: 23,
      label: 'node 23',
      tag: 'user',
    }, {
      id: 24,
      label: 'node 24',
      tag: 'user',
    }]
  }]

const group = []

module.exports = {
  adData,
  group
}
