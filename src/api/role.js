import request from '@/utils/request'

export function getRole(data) {
  return request({
    url: '/vue-admin-template/role',
    method: 'get',
    data
  })
}