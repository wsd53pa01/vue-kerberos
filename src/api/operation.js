import request from '@/utils/request'

export function getOperation(params) {
  return request({
    url: '/operation/',
    method: 'get',
    params
  })
}

export function createOperation(data) {
  return request({
    url: '/operation/',
    method: 'post',
    data
  })
}

export function updateOperation(data) {
  return request({
    url: '/operation/',
    method: 'put',
    data
  })
}

export function deleteOperation(data) {
  return request({
    url: '/operation/',
    method: 'delete',
    data
  })
}
