import request from '@/utils/request'

export function getRolePermission(params) {
  return request({
    url: '/role-permission/',
    method: 'get',
    params
  })
}

export function createRolePermission(data) {
  return request({
    url: '/role-permission/',
    method: 'post',
    data
  })
}

export function SaveRolePermission(data) {
  return request({
    url: '/role-permission/',
    method: 'post',
    data
  })
}
