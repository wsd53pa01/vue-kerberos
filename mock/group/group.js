const adData = [{
  id: 1,
  name: 'root 1',
  tag: 'group',
  parentId: null
}, {
  id: 11,
  name: 'node 11',
  tag: 'group',
  parentId: 1,
}, {
  id: 111,
  name: 'node 111',
  tag: 'group',
  parentId: 11
}, {
  id: 1111,
  name: 'admin',
  tag: 'user',
  parentId: 111
}, {
  id: 1112,
  name: 'node 1112',
  tag: 'user',
  parentId: 111
}, {
  id: 1113,
  name: 'node 1113',
  tag: 'user',
  parentId: 111
}, {
  id: 1114,
  name: 'node 1114',
  tag: 'user',
  parentId: 111
}, {
  id: 112,
  name: 'node 112',
  tag: 'user',
  parentId: 11,
}, {
  id: 113,
  name: 'node 113',
  tag: 'user',
  parentId: 11,
}, {
  id: 114,
  name: 'node 114',
  tag: 'user',
  parentId: 11,
}, {
  id: 12,
  name: 'node 12',
  tag: 'user',
  parentId: 1
}, {
  id: 13,
  name: 'node 13',
  tag: 'user',
  parentId: 1
}, {
  id: 14,
  name: 'node 14',
  tag: 'user',
  parentId: 1
}, {
  id: 2,
  name: 'root 12',
  tag: 'group',
  parentId: null
}, {
  id: 21,
  name: 'node 21',
  tag: 'group',
  parentId: 2
}, {
  id: 211,
  name: 'node 211',
  tag: 'user',
  parentId: 21
}, {
  id: 212,
  name: 'node 212',
  tag: 'user',
  parentId: 21
}, {
  id: 213,
  name: 'node 213',
  tag: 'user',
  parentId: 21
}, {
  id: 214,
  name: 'node 214',
  tag: 'user',
  parentId: 21
}, {
  id: 22,
  name: 'node 22',
  tag: 'user',
  parentId: 2
}, {
  id: 23,
  name: 'node 23',
  tag: 'user',
  parentId: 2
}, {
  id: 24,
  name: 'node 24',
  tag: 'user',
  parentId: 2
}]

const group = [{
  id: 1,
  application_id: 1,
  name: '權限管理群組'
}, {
  id: 2,
  application_id: 2,
  name: '權限管理群組'
}]

module.exports = {
  adData,
  group
}
