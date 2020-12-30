import request from '@/utils/request'

export function assign() {
  return request({
    url: '/group-user/assign/',
    method: 'post'
  })
}

export function tree(applicationId) {
  return request({
    url: '/group-user/tree/',
    method: 'get',
    params: { applicationId }
  })
}
