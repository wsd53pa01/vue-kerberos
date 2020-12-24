import request from '@/utils/request'

export function getRelation(applicationId, roleId, groupId) {
  return request({
    url: '/role-group',
    method: 'get',
    params: { applicationId, roleId, groupId }
  })
}

export function createRelation(data) {
  return request({
    url: '/role-group',
    method: 'post',
    data
  })
}