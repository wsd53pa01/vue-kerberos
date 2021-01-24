<template>
  <div class="table-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ title }}</span>
      </div>

      <!-- 搜尋框 -->
      <el-input
        v-for="(field, index) in fields"
        v-if="searchBarVisible && field.filterable"
        :key="index"
        v-model="tableFilter[field.prop]"
        :placeholder="field.label"
        style="width: 180px;"
        @keyup.enter.native="handleFilter('search')"
      />
      <el-button
        class="filter-item"
        v-if="searchBarVisible"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        搜尋
      </el-button>
      <el-button
        :class="{'hidden': !createVisible}"
        type="primary"
        style="margin-bottom: 8px"
        plain
        @click="handleCreate()"
      >
        新增
      </el-button>

      <el-table
        v-loading="loading"
        :data="tableList"
        border
        style="width: 100%"
        size="mini"
        highlight-current-row
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
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(row)"
              />
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
                type="text"
                icon="el-icon-delete"
                @click="deleteEvent(row, $index)"
              />
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
        v-if="totalCount > 0"
        :total="totalCount"
        :page.sync="tableFilter.page"
        :limit.sync="tableFilter.limit"
        @pagination="handleFilter()"
      />

      <!-- dialog -->
      <el-dialog
        :title="textMap[dialog.status]"
        :visible.sync="dialog.visible"
        append-to-body
        :width="editDialogWidth"
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
              :prop="field.prop"
            >
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
                  :value="item.text"
                />
              </el-select>
              <!-- text input -->
              <div
                v-show="field.dialog.type == 'text'"
                style="display:inline-block; width:auto"
              >
                <el-input
                  v-show="field.dialog.type == 'text'"
                  v-model="form[field.prop]"
                />
              </div>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="executeChose(dialog.status)">確認</el-button>
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
  /**
   * @param { String } props.title 卡片的標頭。
   * @param { Array } props.fields  設定欄位。
   * @param { String } props.editDialogWidth 編輯室窗的寬度。
   * @param { Array } props.data 表的資料。
   * @param { Boolean } props.createVisible 開啟新增的 Button。\
   * @param { Boolean } props.loading 開啟 table 的 loading
   * @param { Boolean } props.searchBarVisible 開啟搜尋框
   */
  props: {
    title: {
      type: String
    },
    fields: {
      required: true,
      type: Array
    },
    editDialogWidth: {
      type: String,
      default: 'auto'
    },
    data: {
      required: true,
      type: Array
    },
    createVisible: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    searchBarVisible: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dialog: {
        status: '',
        visible: false,
        rule: '',
        model: '',
        item: []
      },
      textMap: {
        update: '更新',
        create: '新增'
      },
      form: {},
      rules: {},
      tableFilter: {
        page: 1,
        limit: 20
      },
      totalCount: 0,
      tableList: []
    }
  },
  watch: {
    data: {
      immediate: true,
      handler(newVal, oldVal) {
        this.tableList = newVal
        this.totalCount = newVal == null ? 0 : newVal.length
      }
    }
  },
  created() {
    this.fields.forEach((field) => {
      this.form[field.prop] = ''
      if (field.dialog.show && field.dialog.require) {
        this.rules[field.prop] = [{
          required: true,
          trigger: 'blur',
          validator: (rule, value, callback) => {
            if (value == '') {
              callback(new Error(`請選擇${field.label}`))
            } else {
              callback()
            }
          } }]
      }
    })
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
      this.form = row
      this.dialog.status = 'update'
      this.dialog.visible = true
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    /**
     * 過濾資料。
     * @param { String } type 過濾的類別，搜尋框要輸入 search，要初始化為第一頁。
     */
    handleFilter(type) {
      if (type == 'search') {
        this.tableFilter.page = 1
      }
      let filterKey = Object.keys(this.tableFilter).filter(key => !['page', 'limit'].includes(key))
      let dataFilter = this.data.filter(item => {
        let isValid = true
        filterKey.forEach( key => {
          let value = this.tableFilter[key]
          if (value && item[key].toString().indexOf(value) < 0) {
            isValid = false
          }
        })
        return isValid
      })
      const { limit, page } = this.tableFilter
      this.tableList = dataFilter.filter((item, index) => index < limit * page && index >= limit * (page -1))
    },
    resetForm() {
      this.form['id'] = undefined
      this.fields.forEach((field) => {
        this.form[field.prop] = ''
      })
      this.form = Object.assign({}, this.form)
    },
    // Table 新增資料的事件
    createEvent() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          // this.createOption.event(this.form)
          this.dialog.visible = false
          this.$emit('create', this.form)
        }
      })
    },
    // Table 更新資料的事件
    updateEvent() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          const temp = Object.assign({}, this.form)
          this.$emit('update', this.form)
          this.$nextTick(() => {
            this.dialog.visible = false
          })
        }
      })
    },
    // Table 刪除資料的事件
    deleteEvent(row, index) {
      this.$emit('delete', row, index)
      // this.deleteOption.event(row, index)
    },
    // Dialog 選擇要執行的事件
    executeChose(type) {
      if (type == 'create') {
        this.createEvent()
      } else {
        this.updateEvent()
      }
    }
  }
}
</script>

<style scoped>
.table-container .hidden {
  display: none;
}
</style>
