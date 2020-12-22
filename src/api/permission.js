import request from '@/utils/request'

export function getPermission(applicationId) {
  return request({
    url: '/vue-admin-template/permission',
    method: 'get',
    params: { applicationId }
  })
}
