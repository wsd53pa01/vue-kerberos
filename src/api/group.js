import request from '@/utils/request'

export function getAd() {
  return request({
    url: '/group/ad/',
    method: 'get'
  })
}

export function getGroup(applicationId) {
  return request({
    url: '/group/',
    method: 'get',
    params: { applicationId }
  })
}

export function createGroup(data) {
  return request({
    url: '/group/',
    method: 'post',
    data
  })
}


export function updateGroup(data) {
  return request({
    url: '/group/',
    method: 'put',
    data
  })
}

export function deleteGroup(data) {
  return request({
    url: '/group/',
    method: 'delete',
    data
  })
}
