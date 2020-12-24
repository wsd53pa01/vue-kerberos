import request from '@/utils/request'

export function getAction(applicationId) {
  return request({
    url: '/vue-admin-template/action',
    method: 'get',
    params: { applicationId }
  })
}

export function updateAction(data) {
  return request({
    url: '/vue-admin-template/action',
    method: 'put',
    data
  })
}

export function createAction(data) {
  return request({
    url: '/vue-admin-template/action',
    method: 'post',
    data
  })
}

export function deleteAction(data) {
  return request({
    url: '/vue-admin-template/action',
    method: 'delete',
    data
  })
}
