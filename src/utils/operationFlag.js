/**
 * 將operationFlag與flagList(ex: [1, 2, 4, 8])做比對，回傳相同的
 * @param {Array<Number>} flagList
 * @param {number} operationFlag
 */
export function operationFlagDecode(flagList, operationFlag) {
  return flagList.filter(x => operationFlag & x)
}
