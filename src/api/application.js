import request from '@/utils/request'

export function getApplication(params) {
  return request({
    url: '/application/',
    method: 'get',
    params
  })
}

export function createApplication(data) {
  return request({
    url: '/application/',
    method: 'post',
    data
  })
}

export function updateApplication(data) {
  return request({
    url: '/application/',
    method: 'put',
    data
  })
}
export function deleteApplication(data) {
  return request({
    url: '/application/',
    method: 'delete',
    data
  })
}
