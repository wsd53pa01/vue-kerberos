<!--
propDialog: {
  width: String, ex: '100px'
  form: Object, ex: { fields: [{ name: 'fields name', data: ['option 1', 'option 2']}]}
}
-->
<template>
  <div class="table-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ title }}</span>
      </div>

      <!-- 搜尋框 -->
      <el-input
        v-for="(field, index) in fields"
        v-show="field.filter.show"
        v-model="tableFilter[field.prop]"
        :key="index"
        :placeholder="field.label"
        @keyup.enter.native="handleFilter()"
        style="width: 180px;"
      />
      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter()">
          搜尋
      </el-button>
      <el-button
        :class="{'hidden': createOption.hidden}"
        type="primary"
        style="margin-bottom: 8px"
        plain
        @click="handleCreate()"
      >
        新增
      </el-button>

      <el-table
        :data="tableData.list"
        border
        style="width: 100%"
        size="mini"
        highlight-current-row
        v-loading = "loading"
      >
      <el-table-column
          prop="action"
          label="動作"
          width="150"
          align="center"
        >
          <el-table-column
            prop="edit"
            label="編輯"
            width="75"
            align="center"
          >
            <template slot-scope="{row,$index}">
              <el-button
                style="font-size: x-large"
                @click="handleUpdate(row)"
                type="text"
                icon="el-icon-edit">
              </el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="delete"
            label="刪除"
            width="75"
            align="center"
          >
            <template slot-scope="{row,$index}">
              <el-button
                style="font-size: x-large"
                @click="deleteEvent(row, $index)"
                type="text"
                icon="el-icon-delete">
              </el-button>
            </template>
          </el-table-column>
        </el-table-column>

        <el-table-column
          v-for="(field, index) in fields"
          :key="index"
          :prop="field.prop"
          :label="field.label"
          :width="field.width"
        />
      </el-table>

      <!-- 分頁 -->
      <pagination
        v-if="tableData.total > 0"
        :total="tableData.total"
        :page.sync="tableFilter.page"
        :limit.sync="tableFilter.limit"
        @pagination="fetchData(tableFilter)" />

      <!-- dialog -->
      <el-dialog
        :title="textMap[dialog.status]"
        :visible.sync="dialog.visible"
        append-to-body
        :width="dialogWidth"
      >
        <el-form
          ref="form"
          :rules="rules"
          :model="form"
        >
          <div v-for="(field, index) in fields" :key="index">
            <el-form-item
              v-show="field.dialog.show"
              :label="field.label"
              :prop="field.prop">
              <!-- select item -->
              <el-select
                v-show="field.dialog.type == 'select'"
                v-model="form[field.prop]"
                filterable
                placeholder="請選擇"
              >
                <el-option
                  v-for="item in field.dialog.data"
                  :key="item.text"
                  :label="item.text"
                  :value="item.text">
                </el-option>
              </el-select>
              <!-- text input -->
              <div
                v-show="field.dialog.type == 'text'"
                style="display:inline-block; width:75%">
                <el-input
                  v-show="field.dialog.type == 'text'"
                  v-model="form[field.prop]"
                >
                </el-input>
              </div>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialog.status==='create' ? createEvent() : updateEvent()">確認</el-button>
          <el-button @click="handleCancel()">取消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>

</template>

<script>
import Pagination from '@/components/Pagination'

export default {
  name: 'Table',
  components: {
    Pagination
  },
  data() {
    return {
      dialog: {
        status: '',
        visible: false,
        rule: '',
        model: '',
        item: [],
      },
      textMap:{
        update: '更新',
        create: '新增'
      },
      form: {},
      rules: {},
      tableFilter: {
        page: 1,
        limit: 20,
      },
    }
  },
  props: {
    title: {
      required: true,
      type: String
    },
    fields: {
      type: Array
    },
    dialogWidth: {
      type: String
    },
    tableData: {
      type: Object
    },
    fetchData: {
      type: Function
    },
    createOption: {
      type: Object,
      validator: (value) => {
        let isValid = true;
        value = Object.assign({
          hidden: false
        }, value)
        return isValid
      }
    },
    deleteOption: {
      type: Object
    },
    updateOption: {
      type: Object
    },
    loading: {
      type: Boolean
    },
  },
  created() {
    this.fetchData(this.tableFilter)
    this.fields.forEach((field) => {
      this.form[field.prop] = ''
      if (field.dialog.show && field.dialog.require) {
        this.rules[field.prop] = [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if(value == '') {
              callback(new Error(`請選擇${field.label}`))
            } else {
              callback()
            }
        }}]
      }
    })
  },
  computed: {
  },
  methods: {
    handleCreate() {
      this.resetForm()
      this.dialog.status = 'create'
      this.dialog.visible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    handleCancel() {
      this.dialog.visible = false
    },
    handleUpdate(row) {
      this.form = Object.assign({}, row)
      this.dialog.status = 'update'
      this.dialog.visible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    handleFilter() {
      this.tableFilter.page = 1
      this.fetchData(this.tableFilter)
    },
    resetForm() {
      // this.form = Object.assign({ id: 0, name: '' })
      this.form['id'] = undefined
      this.fields.forEach((field) => {
        this.form[field.prop] = ''
      })
      this.form = Object.assign({}, this.form)
    },
    createEvent() {
      console.log('create')
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.createOption.event(this.form)
          this.dialog.visible = false
          this.$notify({
            title: '成功',
            message: '新增成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    updateEvent() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const temp = Object.assign({}, this.form)
          this.updateOption.event(temp)
          this.$notify({
            title: '成功',
            message: '修改成功',
            type: 'success',
            duration: 2000
          })
          this.$nextTick(() => {
            this.dialog.visible = false
          })
        }
      })
    },
    deleteEvent(row, index) {
      this.deleteOption.event(row, index)
      this.$notify({
        title: '成功',
        message: '删除成功',
        type: 'success',
          duration: 2000
      })
    }
  }
}
</script>

<style scoped>
.table-container .hidden {
  display: none;
}
</style>
