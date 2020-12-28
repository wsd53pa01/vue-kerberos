import request from '@/utils/request'

export function getPermissions(applicationId) {
  return request({
    url: '/vue-admin-template/permissions/',
    method: 'get',
    params: { applicationId }
  })
}
