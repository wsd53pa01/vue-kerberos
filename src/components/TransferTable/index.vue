<template>
  <el-card :body-style="{padding: '0'}" shadow="never" class="box-card">
    <el-table
      :data="tableData"
      row-key="id"
      class="table"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column
        prop="name"
        label="姓名"
        header-align="center"
        width="auto"
        show-overflow-tooltip
      />
      <el-table-column
        type="selection"
        width="55"
      />
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: 'TransferTable',
  data() {
    return {
      tableData: [{
        id: 1,
        name: 'root 1',
        children: [{
          id: 11,
          name: 'node 11',
          children: [{
            id: 111,
            name: 'node 111',
            children: [{
              id: 1111,
              name: 'node 1111111111'
            }, {
              id: 1112,
              name: 'node 1112'
            }, {
              id: 1113,
              name: 'node 1113'
            }, {
              id: 1114,
              name: 'node 1114'
            }]
          }, {
            id: 112,
            name: 'node 112'
          }, {
            id: 113,
            name: 'node 113'
          }, {
            id: 114,
            name: 'node 114'
          }]
        }, {
          id: 12,
          name: 'node 12'
        }, {
          id: 13,
          name: 'node 13'
        }, {
          id: 14,
          name: 'node 14'
        }]
      }, {
        id: 2,
        name: 'root 2',
        children: [{
          id: 21,
          name: 'node 21',
          children: [{
            id: 211,
            name: 'node 211'
          }, {
            id: 212,
            name: 'node 212'
          }, {
            id: 213,
            name: 'node 213'
          }, {
            id: 214,
            name: 'node 214'
          }]
        }, {
          id: 22,
          name: 'node 22'
        }, {
          id: 23,
          name: 'node 23'
        }, {
          id: 24,
          name: 'node 24'
        }]
      }]
    }
  }
}
</script>

<style lang="scss" scoped>
.table {
  height: calc(100vh - 380px);
  min-height: 320px;
  width:100%;
  margin-bottom: -1px;
}
</style>
