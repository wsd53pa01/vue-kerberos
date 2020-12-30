import request from '@/utils/request'

export function getPermission({ applicationId, name, code }) {
  return request({
    url: '/vue-admin-template/permission/',
    method: 'get',
    params: { applicationId, name, code }
  })
}

export function createPermission(data) {
  return request({
    url: '/vue-admin-template/permission/',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: '/vue-admin-template/permission/',
    method: 'put',
    data
  })
}

export function deletePermission(data) {
  return request({
    url: '/vue-admin-template/permission/',
    method: 'delete',
    data
  })
}
