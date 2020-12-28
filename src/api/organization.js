import request from '@/utils/request'

export function getOrganization(query) {
  return request({
    url: '/organization',
    method: 'get',
    params: query
  })
}

export function createOrganization(data) {
  return request({
    url: '/organization',
    method: 'post',
    data
  })
}

export function updateOrganization(data) {
  return request({
    url: '/organization',
    method: 'put',
    data
  })
}

export function deleteOrganization(data) {
  return request({
    url: '/organization',
    method: 'delete',
    data
  })
}

