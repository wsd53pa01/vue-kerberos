import request from '@/utils/request'

export function getApplication(params) {
  return request({
    url: '/vue-admin-template/application',
    method: 'get',
    params
  })
}
