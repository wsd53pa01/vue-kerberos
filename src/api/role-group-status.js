import request from '@/utils/request'

export function getStatus(applicationId, roleId, groupId) {
  return request({
    url: '/vue-admin-template/status',
    method: 'get',
    params: { applicationId, roleId, groupId }
  })
}
