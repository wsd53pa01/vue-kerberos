import request from '@/utils/request'

export function getAction(applicationId) {
  return request({
    url: '/vue-admin-template/action',
    method: 'get',
    params: { applicationId }
  })
}
