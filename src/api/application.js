import request from '@/utils/request'

export function getApplications(params) {
  return request({
    url: '/vue-admin-template/application',
    method: 'get',
    params
  })
}
