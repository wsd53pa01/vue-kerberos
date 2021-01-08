import request from '@/utils/request'

export function getPermission(params) {
  return request({
    url: '/permission/',
    method: 'get',
    params
  })
}

export function createPermission(data) {
  return request({
    url: '/permission/',
    method: 'post',
    data
  })
}

export function updatePermission(data) {
  return request({
    url: '/permission/',
    method: 'put',
    data
  })
}

export function deletePermission(data) {
  return request({
    url: '/permission/',
    method: 'delete',
    data
  })
}
