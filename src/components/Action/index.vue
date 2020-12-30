<template>
  <div class="full-height">
    <el-row :gutter="20" class="full-height">
      <el-col :span="12" class="scrollable full-height">
        <div class="title">功能列表</div>
        <div class="content">
          <el-row :gutter="20">
            <el-col :span="12">
              <el-input placeholder="搜尋" prefix-icon="el-icon-search" />
            </el-col>
            <el-button
              type="primary"
              icon="el-icon-plus"
              circle
              @click="addNewNode()"
            />
            <el-button
              type="success"
              icon="el-icon-s-order"
              circle
              :disabled="isCopyDisabled"
            />
          </el-row>
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
                <el-button type="text" size="mini" @click="() => append(data)">
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
        </div>
      </el-col>

      <el-col :span="12" class="scrollable full-height">
        <div class="title">功能設定</div>
        <div class="content">
          <el-form ref="form" :label-position="'top'" :model="actionDetail">
            <el-form-item label="父節點名稱">
              <el-select
                v-model="actionDetail.parentCode"
                class="full-width"
                placeholder="請選擇"
              >
                <el-option
                  v-for="parentCode in parentCodes"
                  :key="parentCode"
                  :value="parentCode"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="選單名稱">
              <el-input v-model="actionDetail.menuName" />
            </el-form-item>
            <el-form-item label="選單代碼">
              <el-input v-model="actionDetail.menuCode" disabled />
            </el-form-item>
            <el-form-item label="Icon">
              <el-input v-model="actionDetail.icon" />
            </el-form-item>
            <el-form-item label="功能連結">
              <el-input v-model="actionDetail.href" />
            </el-form-item>
            <el-form-item
              label="排序編號"
              prop="sortNumber"
              :rules="[
                { required: true, message: '排序編號為必填' },
                { type: 'number', message: '排序編號須為數字' },
              ]"
            >
              <el-input
                v-model.number="actionDetail.sortNumber"
                type="sortNumber"
              />
            </el-form-item>
            <el-form-item label="temp">
              <span
                slot="label"
              >操作功能
                <el-button
                  type="primary"
                  size="mini"
                  :disabled="isPermissionDisabled"
                  @click="isPermissionVisible = true"
                >
                  管理操作功能
                </el-button>
              </span>
              <el-checkbox-group v-model="operationFlags">
                <el-checkbox
                  v-for="permission in permissions"
                  :key="permission.id"
                  :label="permission.code"
                >
                  {{ permission.name }}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>

            <el-form-item>
              <el-button
                :disabled="isSubmitDisabled"
                class="full-width"
                type="primary"
                @click="submitForm"
              >
                送出
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </el-col>
    </el-row>

    <el-dialog title="操作功能管理" :visible.sync="isPermissionVisible" width="900px">
      <permission
        :permissions="permissions"
        @dmlFinished="permissionUpdated"
      />
    </el-dialog>
  </div>
</template>

<script>
import {
  getAction,
  createAction,
  updateAction,
  deleteAction
} from '@/api/action'
import { getPermission } from '@/api/permission'
import { operationFlagDecode } from '@/utils/operationFlag'
import Permission from './Permission'

const defaultNode = {
  applicationId: 0,
  href: '',
  icon: '',
  id: 0,
  menuCode: '',
  menuName: '',
  operationFlag: 0,
  parentCode: '',
  sortNumber: 0
}
let id = 0
export default {
  components: {
    Permission
  },
  data() {
    return {
      data: [],
      isCopyDisabled: true,
      parentCodes: [],
      actionDetail: {},
      isSubmitDisabled: true,
      permissions: [],
      operationFlags: [],
      isPermissionDisabled: true,
      isPermissionVisible: false
    }
  },
  computed: {
    applicationId() {
      const applicationId = this.$store.state.application.id
      return applicationId
    }
  },
  watch: {
    applicationId: function(newVal, oldVal) {
      this.renderPage(newVal)
    }
  },
  created() {
    this.renderPage(this.applicationId)
  },
  methods: {
    renderPage(applicationId) {
      this.getActions(applicationId)
      this.getPermission(applicationId)
      this.actionDetail = Object.assign({}, defaultNode)
      this.operationFlags = 0
      this.isPermissionDisabled = applicationId == null || applicationId == ''
    },

    append(data) {
      const newChild = Object.assign({}, defaultNode)
      newChild.id = id++
      newChild.label = '新節點'
      newChild.menuName = '新節點'
      createAction(newChild).then(x => {
        // TODO: call 建立的api後，放入新建立的Action
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
        this.onNodeClicked(newChild)
      })
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex(d => d.id === data.id)
      children.splice(index, 1)
    },

    getActions(applicationId) {
      getAction(applicationId)
        .then(result => {
          this.data = []
          result.data.forEach(action => {
            this.data.push(
              Object.assign({ label: action.menuName }, action)
            )
          })
        })
        .catch(e => {
          throw e
        })
    },

    getPermission(applicationId) {
      getPermission(applicationId)
        .then(result => {
          if (result.isSuccess) {
            this.permissions = result.data
          }
        })
        .catch(err => {
          throw err
        })
    },

    addNewNode(node) {
      const newChild = Object.assign({}, defaultNode)
      newChild.id = id++
      newChild.label = '新節點'
      newChild.menuName = '新節點'
      // TODO: call 建立的api後，放入新建立的Action
      this.onNodeClicked(newChild)
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      this.data.push(newChild)
    },

    submitForm() {
      this.actionDetail.operationFlag = this.operationFlags.reduce(
        (prev, curr) => prev + curr,
        0
      )
      this.isSubmitDisabled = true
    },

    onNodeChecked() {
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      this.isCopyDisabled = checkedNodes.length > 0 === false
    },

    onNodeClicked(node) {
      this.actionDetail = node
      this.parentCodes = this.data
        .map(node => {
          return node.parentCode
        })
        .filter(parentCode => parentCode !== node.parentCode)
      this.isSubmitDisabled = false
      this.operationFlags = operationFlagDecode(
        this.permissions.map(x => x.code),
        this.actionDetail.operationFlag
      )
    },

    permissionUpdated() {
      this.getPermission(this.applicationId)
    }
  }
}
</script>

<style lang="scss">
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

.title {
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.content {
  padding-top: 20px;
}

.full-width {
  width: 100%;
}

.scrollable {
  overflow: auto;
}

.full-height {
  height: 100%;
}

.dialog > .el-card {
  box-shadow: none;
  border: none;
  margin-top: -60px;
}
</style>
