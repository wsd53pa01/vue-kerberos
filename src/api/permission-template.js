import request from '@/utils/request'

export function getPermissionTemplate(query) {
  return request({
    url: '/permission-template',
    method: 'get',
    params: query
  })
}

export function createPermissionTemplate(data) {
  return request({
    url: '/permission-template',
    method: 'post',
    data
  })
}

export function updatePermissionTemplate(data) {
  return request({
    url: '/permission-template',
    method: 'put',
    data
  })
}

export function deletePermissionTemplate(data) {
  return request({
    url: '/permission-template',
    method: 'delete',
    data
  })
}

