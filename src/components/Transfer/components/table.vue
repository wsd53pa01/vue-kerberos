<template>
  <el-card :body-style="{padding: '0'}" shadow="never" class="box-card">
    <el-table
      :data="data"
      row-key="id"
      class="table"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      size="mini"
      cell-class-name="cellClass"
    >
      <!-- <el-table-column
        align="center"
        width="42px"
        type="selection"
      >
      </el-table-column> -->
      <el-table-column width="110" align="center">
        <template slot="header">
          <el-checkbox
            :indeterminate="indeterminate"
            @change="handleCheckedAll"
          />
        </template>
        <template slot-scope="scope">
          <el-checkbox
            v-model="scope.row.checked"
            @change="handleCheckedOne(scope.row)"
          />
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        :label="name"
        header-align="center"
        width="auto"
      >
        <template slot-scope="scope">
          <div v-if="scope.row.state == 'update'">
            update
          </div>
          <span v-else>
            {{ scope.row.name }}
          </span>
        </template>
      </el-table-column>
      <el-table-column
        v-if="create"
        width="70px"
        align="center"
      >
        <template slot="header" slot-scope="scope">
          <el-button
            type="text"
            icon="el-icon-plus"
            @click="createRoot"
          />
        </template>
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-plus" />
        </template>
      </el-table-column>
    </el-table>
  </el-card>
</template>

<script>
export default {
  name: 'Table',
  props: {
    name: {
      required: true,
      type: String
    },
    data: {
      type: Array
    },
    create: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      indeterminate: false
    }
  },
  methods: {
    createRoot() {
      this.data.unshift({ id: 0, name: '', state: 'update' })
    },
    checkOne(obj, boolValue) {
      obj.checked = boolValue
      if (obj.children) {
        obj.children.forEach(item => this.checkOne(item, boolValue))
      }
    },
    handleCheckedOne(row) {
      if (row.checked) {
        this.checkOne(row, true)
      } else {
        this.checkOne(row, false)
      }
    },
    checkAll(arr, boolValue) {
      arr.forEach(item => {
        item.checked = boolValue
        if (item.children) {
          this.checkAll(item.children, boolValue)
        }
      })
    },
    handleCheckedAll(scope) {
      if (scope) {
        this.checkAll(this.data, true)
      } else {
        this.checkAll(this.data, false)
      }
    }
  }
}
</script>

<style lang="scss">
.table {
  height: calc(100vh - 380px);
  min-height: 320px;
  width:100%;
  margin-bottom: -1px;
}

.el-table__body-wrapper {
  height: calc(100% - 50px);
  overflow-y: auto !important;
}
</style>
