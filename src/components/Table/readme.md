# Table

# 功能

產生一張卡片樣式的表格 Component。

# Usage

`<table>` 支持如下自定義屬性。

| attribute | type | description | 可選值 | 默認值 |
| --------- | ---- | ----------- | ----- | ------ |
| `title` | String | 表格的 Title。 | － | － |
| `fields` | \[Object\] | 1. 必填 <br /> 2. 定義要顯示的欄位。 | `prop`：欄位的代碼 。<br />`width`：欄位的寬度。<br /> `label`：欄位的名稱。 <br />`filterable`：設定欄位是否，設定進搜尋框中。<br />`dialog.show`：編輯時，是否顯示該欄位。<br />`dialog.type` ：編輯時的編輯類型，有 `text`、`select`兩種。<br />`dialog.data`： 如果 `dialog.type`是`select`，才須賦予值。<br /> `dialog.require`：設定是否為必填欄位。 |－|
| `edit-dialog-width` | String | CSS 的 width 設定值。 | 只要符合 CSS Width 設定值即可。 |－|
| `data` | [Object] | 1. 必填。<br />2. 資料表內容的資料。<br />3. Object 的 Key 值要對應到 prop。 | － |－|
| `crete-visible` | Boolean | 顯示新增的按紐 | －                                                           |false|
| `loding` | Boolean | 開啟表的 Loading UI | － |false|
| `search-bar-visible` | Boolean | 顯示搜尋框 | － |false|
# Example

path：src\views\organization-setting\index.vue

