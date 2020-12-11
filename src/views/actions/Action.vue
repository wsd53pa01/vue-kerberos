<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card class="box-card action-card">
        <div slot="header">功能列表</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input
              placeholder="搜尋"
              prefix-icon="el-icon-search"
            />
          </el-col>
          <el-button type="success" icon="el-icon-s-order" circle :disabled="isCopyDisabled" />
        </el-row>
        <el-row>
          <el-col>
            <el-tree
              ref="tree"
              :data="data"
              show-checkbox
              node-key="id"
              default-expand-all
              highlight-current
              :expand-on-click-node="false"
              @check-change="onNodeChecked"
              @node-click="onNodeClicked"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => append(data)"
                  >
                    新增
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)"
                  >
                    刪除
                  </el-button>
                </span>
              </span>
            </el-tree>
          </el-col>
        </el-row>
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="box-card action-card">
        <div slot="header">功能設定</div>
        <el-form ref="form" :label-position="'top'" :model="form">
          <el-form-item label="父節點名稱">
            <el-select v-model="form.parentCode" class="full-width" placeholder="請選擇">
              <el-option label="Zone one" value="shanghai" />
              <el-option label="Zone two" value="beijing" />
            </el-select>
          </el-form-item>
          <el-form-item label="選單名稱">
            <el-input v-model="form.menuName" />
          </el-form-item>
          <el-form-item label="選單代碼">
            <el-input v-model="form.menuCode" disabled />
          </el-form-item>
          <el-form-item label="Icon">
            <el-input v-model="form.icon" />
          </el-form-item>
          <el-form-item label="功能連結">
            <el-input v-model="form.href" />
          </el-form-item>
          <el-form-item
            label="排序編號"
            prop="sortNumber"
            :rules="[
              { required: true, message: '排序編號為必填'},
              { type: 'number', message: '排序編號須為數字'}
            ]"
          >
            <el-input v-model.number="form.sortNumber" type="sortNumber" />
          </el-form-item>
          <el-form-item label="操作功能">
            <el-checkbox-group v-model="operationFlags">
              <el-checkbox
                v-for="permission in permissions"
                :key="permission.permission"
                :label="permission.permission" 
                :true-label="permission.permission">
                {{permission.name}}
              </el-checkbox>
              <!-- <el-checkbox label="新增" />
              <el-checkbox label="刪除" />
              <el-checkbox label="修改" />
              <el-checkbox label="查詢" /> -->
            </el-checkbox-group>
          </el-form-item>

          <el-form-item>
            <el-button
              :disabled="isSubmitDisabled"
              class="full-width"
              type="primary"
              @click="submitForm('numberValidateForm')"
            >
              送出
            </el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { getActions } from '@/api/actions'
import { getPermissions } from '@/api/permissions'
import { operationFlagDecode } from '@/utils/operationFlag';

let id = 0
const defaultForm = {
  applicationId: 0,
  href: '',
  icon: '',
  id: 0,
  menuCode: '',
  menuName: '',
  operationFlag: 0,
  parentCode: null,
  sortNumber: 0
}

export default {
  props: ['applicationId'],
  data() {
    return {
      data: [],
      isCopyDisabled: true,
      isSubmitDisabled: true,
      form: {},
      permissions: [],
      operationFlags: []
    }
  },
  watch: {
    applicationId: function(newVal, oldVal) {
      this.init(newVal)
    }
  },
  created() {
    this.init(this.applicationId)
  },
  methods: {
    init(applicationId){
      this.getActions(applicationId)
      this.getPermissions(applicationId)
      this.form = Object.assign({}, defaultForm)
      this.isSubmitDisabled = true
    },

    append(data) {
      const newChild = Object.assign({}, defaultForm)
      // TODO: call 建立的api後，放入新建立的Action
      newChild.id = id++
      newChild.label = '新節點'
      newChild.menuName = '新節點'
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
    },

    getActions(applicationId) {
      getActions(applicationId).then(result => {
        this.data = result.data.actions || []
        this.data.forEach(action => {
          action.label = action.menuName
        })
      }).catch(e => {
        throw (e)
      })
    },

    getPermissions(applicationId) {
      getPermissions(applicationId).then(result => {
        if(result.isSuccess){
          this.permissions = result.data.permissions
        }
      }).catch(err => {
        throw(err)
      })
    },

    onNodeChecked() {
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      this.isCopyDisabled = checkedNodes.length > 0 === false
    },

    onNodeClicked(node) {
      for (const key in node) {
        if (this.form.hasOwnProperty(key)) {
          this.form[key] = node[key]
        }
      }
      this.isSubmitDisabled = false
      
      this.operationFlags = operationFlagDecode(this.permissions.map(x => x.permission), this.form.operationFlag)
      // TODO: 建立操作功能，並把operationFlag餵上去
    }
  }
}
</script>

<style lang="scss">
.el-button:hover {
  color: #45a1ff;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.action-card {
  overflow-y: scroll;
  height: calc(100vh - 50px);
}

.full-width {
  width: 100%;
}
</style>
