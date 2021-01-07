/**
 *
 * @param {Array} arr
 */
export function arrayToNested(arr) {
  let nested = {}
  nested = arr.map(arr.ParentId == '')
}

export function addTreeProperty(arr) {
  arr.forEach((obj) => {
    obj['checked'] = false
    obj['indeterminate'] = false
    if ('children' in obj && obj['children'].length > 0) { addTreeProperty(obj['children']) }
  })
  return arr
}
