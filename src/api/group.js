import request from '@/utils/request'

export function getGroup(applicationId) {
  return request({
    url: '/vue-admin-template/group',
    method: 'get',
    params: { applicationId }
  })
}

export function createGroup(data) {
  return request({
    url: '/vue-admin-template/group',
    method: 'post',
    data
  })
}

export function updateGroup(data) {
  return request({
    url: '/vue-admin-template/group',
    method: 'put',
    data
  })
}

export function deleteGroup(data) {
  return request({
    url: '/vue-admin-template/group',
    method: 'delete',
    data
  })
}
