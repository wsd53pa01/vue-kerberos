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
