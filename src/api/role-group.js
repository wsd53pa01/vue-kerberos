import request from '@/utils/request'

export function getRelation(roleId, groupId) {
  return request({
    url: '/role-group/',
    method: 'get',
    params: { roleId, groupId }
  })
}

export function createRelation(data) {
  return request({
    url: '/role-group/',
    method: 'post',
    data
  })
}

export function getRoleGroup(applicationId) {
  return request({
    url: '/role-group/',
    method: 'get',
    params: { applicationId }
  })
}

export function createRoleGroup(data) {
  return request({
    url: '/role-group/assign/',
    method: 'post',
    data
  })
}

export function deleteRoleGroup(data) {
  return request({
    url: '/role-group/',
    method: 'delete',
    data
  })
}

export function tree(applicationId) {
  return request({
    url: '/role-group/tree/',
    method: 'get',
    params: { applicationId }
  })
}

export function assign(data) {
  return request({
    url: '/role-group/assign/',
    method: 'post',
    data
  })
}
