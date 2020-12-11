/**
 * 將operationFlag與permissions(ex: [1, 2, 4, 8])做比對，回傳相同的
 * @param {Array} permissions
 * @param {number} operationFlag
 */
export function operationFlagDecode(permissions, operationFlag) {
  return permissions.filter(x => operationFlag & x)
}
