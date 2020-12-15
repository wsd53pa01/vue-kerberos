import request from '@/utils/request'

export function getActions(applicationId) {
  return request({
    url: '/vue-admin-template/action',
    method: 'get',
    params: { applicationId }
  })
}
