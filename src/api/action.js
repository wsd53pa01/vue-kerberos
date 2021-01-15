import request from '@/utils/request'

export function getAction(params) {
  return request({
    url: '/action/',
    method: 'get',
    params
  })
}

export function updateAction(data) {
  console.log(data)
  return request({
    url: '/action/',
    method: 'put',
    data
  })
}

export function createAction(data) {
  return request({
    url: '/action/',
    method: 'post',
    data
  })
}

export function deleteAction(data) {
  return request({
    url: '/action/',
    method: 'delete',
    data
  })
}
