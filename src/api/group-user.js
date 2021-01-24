import request from '@/utils/request'

/**
 * 將 AD 群組的使用者或群組加入到應用程式群組
 * @param { Object } data
 */
export function assign(data) {
  return request({
    url: '/group-user/assign/',
    method: 'post',
    data
  })
}

/**
 * 取得群組樹
 * @param { Number } applicationId
 */
export function tree(applicationId) {
  return request({
    url: '/group-user/tree/',
    method: 'get',
    params: { applicationId }
  })
}

/**
 * 刪除 Group User
 * @param { Object } data
 */
export function deleteGroupUser(data) {
  return request({
    url: '/group-user/',
    method: 'delete',
    data
  })
}
