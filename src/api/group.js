import request from '@/utils/request'

export function getGroup(data) {
  return request({
    url: '/vue-admin-template/group',
    method: 'get',
    data
  })
}