
/**
 * 將 Array Data 轉換成有階層式的 Tree Data
 * @param { Array } data Tree 的 Array Data
 */
export function convertTreeData(data) {
  let tree = []
  let root = data.filter((x) => { return x.parentId == null })
  root.forEach(x => {
    tree.push(formatNode(x))
  })
  addChild(tree)
  function addChild(parent) {
    parent.forEach(x => {
      let child = data.filter((d) => { return d.parentId == x.id })
      if (child.length != 0) {
        x['children'] = []
        child.forEach( c => {
          x['children'].push(formatNode(c))
        })
        addChild(x['children'])
      }
    })
  }
  return tree
}

/**
 * 將資料轉為 Tree 使用的資料格式
 * @param { {
 *   id: (String|Number),
 *   data_id: (String|Number),
 *   parentId: (String|Number),
 *   children: Array,
 *   label: String,
 *   tag: String,
 *   checked: Boolean,
 *   createVisible: Boolean,
 *   updateVisible: Boolean,
 *   deleteVisible: Boolean
 *  }=} data
 *    id: 每個節點的 key
 *    data_id: 資料原始的 Id
 *    parentId: 父節點的 key
 *    children: 子節點的集合
 *    name: 節點名稱
 *    tag: 節點的標籤，可用於識別節點是屬於哪個類別
 *    checked: 節點是否勾選
 *    createVisible: 啟用新增功能
 *    updateVisible: 啟用更新功能
 *    deleteVisible: 啟用刪除功能
 */
export function formatNode(data) {
  let required = {
    id: data.id,
    data_id: data.data_id,
    parentId: data.parentId,
    children: data.children ?? [],
    label: data.name,
    tag: data.tag,
    checked: false,
    createVisible: data.createVisible | false,
    updateVisible: data.updateVisible | false,
    deleteVisible: data.deleteVisible | false,
  }

  let dataKeys = Object.keys(data),
    requiredKey = Object.keys(required)

  dataKeys.forEach(dataKey => {
    if (!requiredKey.includes(dataKey)) {
      required[dataKey] = data[dataKey]
    }
  })
  return required
}
