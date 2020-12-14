<template>
  <div class="context-container">
    <Table
      :title="'組織設定'"
      :searchBar="{ fields:[{'name': tableQuery.name, 'placeholder': '組織名稱'}]}"
      :create="{event: openOrganizationForm}"
      :propDialog="{
          width: '400px',
          form: {
            fields: [{
              prop: 'name',
              label: '組織名稱',
              text: '',
              value: '',
              data: [ 'Organization 1', 'Organization 2' ],
              require: true
            }]
          }
        }"
    >

    </Table>

    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>組織設定</span>
      </div>

      <!-- 搜尋框 -->
      <el-input v-model="tableQuery.name" placeholder="組織名稱" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        搜尋
      </el-button>

      <el-button
        type="primary"
        style="margin-bottom: 8px"
        plain
        @click="openOrganizationForm()"
      >
        新增
      </el-button>

      <el-table
        :data="tableData"
        border
        style="width: 100%"
        size="mini"
        highlight-current-row
        v-loading="tableLoading"
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
                @click.native.prevent="handleUpdate(row)"
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
                @click.native.prevent="handleDelete(row, $index)"
                type="text"
                icon="el-icon-delete">
              </el-button>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          prop="name"
          label="組織名稱"
        />
      </el-table>

      <!-- 分頁 -->
      <pagination v-show="total>0" :total="total" :page.sync="tableQuery.page" :limit.sync="tableQuery.limit" @pagination="getOrganizations" />

    </el-card>



    <!-- 新增組織表單 -->
    <el-dialog
      :title="dialogStatus"
      :visible.sync="organizationFormVisible"
      append-to-body
      width="400px"
    >
      <el-form
        :model="organizationForm"
        ref="organizationForm"
        :rules="organizationRules">
        <el-form-item label="組織名稱" prop="name">
        <el-select
            v-model="organizationForm.name"
            filterable
            placeholder="請選擇"
          >
            <el-option
              v-for="item in adOrganizations"
              :key="item"
              :label="item"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogStatus==='新增' ? createOrganization() : updateOrganization()">確認</el-button>
        <el-button @click="closeOrganizationForm()">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization
  } from '@/api/organization'
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'

export default {
  name: 'OraganizationSetting',
  components: {
    Pagination,
    Table
  },
  data() {
    const validateOrganizationName =  (rule, value, callback) => {
      if(value == '') {
        callback(new Error('請選擇組織名稱'))
      } else {
        callback()
      }
    }
    return {
      tableData: [{}],
      tableLoading: true,
      tableQuery: {
        page: 1,
        limit: 20,
        name: ''
      },
      organizationFormVisible: false,
      organizationForm: {
        id: 0,
        name: ''
      },
      total: 0,
      organizationRules: { // 組織表單的組織名稱驗證規則
        name: [{ required: true, trigger: 'blur', validator: validateOrganizationName }]
      },
      //TODO: 換成 api 取得組織
      adOrganizations: (() => {
        const prefixString = ''
        let result = []
        for (let i = 0; i <= 10; i++) {
          result.push(prefixString + i)
        }
        return result;
      })(),
      dialogStatus: ''
    }
  },
  created() {
    this.getOrganizations()
  },
  methods: {
    initialOrganizationForm() { // 初始化 organization model
      this.organizationForm = { id: 0, name: '' }
    },
    openOrganizationForm() { //
      this.initialOrganizationForm()
      this.dialogStatus = '新增'
      this.organizationFormVisible = true;
    },
    closeOrganizationForm() {
      this.organizationFormVisible = false;
    },
    getOrganizations() {
      this.tableLoading = true
      getOrganization(this.tableQuery).then(response => {
        setTimeout(() => {
          this.tableData = response.data.list
          this.total = response.data.total
          this.tableLoading = false
        }, 150)
      })
    },
    createOrganization() {
      this.$refs['organizationForm'].validate((valid) => {
        if (valid) {
          const name = this.organizationForm.name
          createOrganization(this.organizationForm.name).then(response => {
            if (response.isSuccess) {
              this.tableData.push({'name': name})
              this.organizationFormVisible = false
            }
          })
        }
      })
    },
    handleUpdate(row) {
      console.log(row)
      this.organizationForm = Object.assign(row)
      this.organizationFormVisible = true
      this.dialogStatus = '編輯'
      this.$nextTick(() => {
        this.$refs['organizationForm'].clearValidate()
      })
    },
    updateOrganization() {
      this.$refs['organizationForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.organizationForm)
          updateOrganization(tempData).then(() => {
            this.organizationFormVisible = false
            this.$notify({
              title: '成功',
              message: '修改成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleDelete(row, index) {
      deleteOrganization(row.id).then(() => {
        this.$notify({
          title: '成功',
          message: '删除成功',
          type: 'success',
          duration: 2000
        })
        this.tableData.splice(index, 1)
      })
    },
    handleFilter() {
      this.tableQuery.page = 1
      this.getOrganizations()
    }
  }
}
</script>

<style lang="scss" scoped>
.context-container {
  display: block;
  position: absolute;
  margin: 50px;
  width: 90%;
  height: auto;
  left: 50%;
  transform: translate(-55%, 0%);
}

.action-icon {
  text-align: center
}
</style>
