import request from '@/utils/request'

export function getOperationTemplate() {
  return request({
    url: '/operation-template/',
    method: 'get'
  })
}

export function createOperationTemplate(data) {
  return request({
    url: '/operation-template/',
    method: 'post',
    data
  })
}

export function updateOperationTemplate(data) {
  return request({
    url: '/operation-template/',
    method: 'put',
    data
  })
}

export function deleteOperationTemplate(data) {
  return request({
    url: '/operation-template/',
    method: 'delete',
    data
  })
}

