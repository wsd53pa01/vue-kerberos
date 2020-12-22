import request from '@/utils/request'

export function getRole(applicationId) {
  return request({
    url: '/vue-admin-template/role',
    method: 'get',
    params: { applicationId }
  })
}

export function createRole(data) {
  return request({
    url: '/vue-admin-template/role',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/vue-admin-template/role',
    method: 'put',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/vue-admin-template/role',
    method: 'delete',
    data
  })
}