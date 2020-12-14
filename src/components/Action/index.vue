<template >
  <div class="full-height">
    <el-row :gutter="20" class="full-height">
      <el-col :span="12" class="scrollable full-height">
        <div class="title">功能列表</div>
          <div class="content">
            <el-row :gutter="20">
              <el-col :span="12">
                <el-input
                  placeholder="搜尋"
                  prefix-icon="el-icon-search"
                />
              </el-col>
              <el-button type="success" icon="el-icon-s-order" circle :disabled="isCopyDisabled" />
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
          </div>
      </el-col>

      <el-col :span="12" class="scrollable full-height">
        <div class="title">功能設定</div>
        <div class="content">
          <el-form ref="form" :label-position="'top'" :model="actionDetail">
            <el-form-item label="父節點名稱">
              <el-select v-model="actionDetail.parentCode" class="full-width" placeholder="請選擇">
                <el-option 
                  v-for="parentCode in parentCodes"
                  :key="parentCode"
                  :value="parentCode"
                ></el-option>
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
                { required: true, message: '排序編號為必填'},
                { type: 'number', message: '排序編號須為數字'}
              ]"
            >
              <el-input v-model.number="actionDetail.sortNumber" type="sortNumber" />
            </el-form-item>
            <el-form-item label="temp">
              <span slot="label">操作功能
                <el-button type="primary" size="mini" @click="isPermissionVisible = true">
                  管理操作功能
                </el-button>
              </span>
              <el-checkbox-group v-model="operationFlags">
                <el-checkbox
                  v-for="permission in permissions"
                  :key="permission.permission"
                  :label="permission.permission"
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

    <el-dialog title="" :visible.sync="isPermissionVisible">
        <el-table>
            <el-table-column label="Date" width="150"></el-table-column>
            <el-table-column label="Name" width="200"></el-table-column>
            <el-table-column label="Address"></el-table-column>
        </el-table>
    </el-dialog>
  </div>
</template>

<script>
import { getActions } from '@/api/actions'
import { getPermissions } from '@/api/permissions'
import { operationFlagDecode } from '@/utils/operationFlag'

const defaultNode = {
  applicationId: 0,
  href: '',
  icon: '',
  id: 0,
  menuCode: '',
  menuName: '',
  operationFlag: 0,
  parentCode: '',
  sortNumber: 0,
}
let id = 0
export default {
  data() {
    return {
      data: [],
      isCopyDisabled: true,
      parentCodes: [],
      actionDetail: {},
      isSubmitDisabled: true,
      permissions: [],
      operationFlags: [],
      isPermissionVisible: false,
    }
  },
  watch: {
    applicationId: function(newVal, oldVal) {
      this.init(newVal)
    }
  },
  computed: {
    applicationId() {
      return this.$store.state.application.id
    }
  },
  created() {
    this.init(this.applicationId)
  },
  methods: {
    init(applicationId) {
      this.getActions(applicationId)
      this.getPermissions(applicationId)
      this.actionDetail = Object.assign({}, defaultNode)
      this.operationFlags = 0
      this.isSubmitDisabled = true
    },

    append(data) {
      const newChild = Object.assign({}, defaultNode)
      newChild.id = id++
      newChild.label = '新節點'
      newChild.menuName = '新節點' + '1123123123123'
      // TODO: call 建立的api後，放入新建立的Action
      this.onNodeClicked(newChild)
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
          action.isNew = false
        })
      }).catch(e => {
        throw (e)
      })
    },

    getPermissions(applicationId) {
      getPermissions(applicationId).then(result => {
        if (result.isSuccess) {
          this.permissions = result.data.permissions
        }
      }).catch(err => {
        throw (err)
      })
    },

    submitForm() {
      this.actionDetail.operationFlag = this.operationFlags.reduce((prev, curr) => prev + curr, 0)
      this.isSubmitDisabled = true
      console.log(this.actionDetail)
    },

    onNodeChecked() {
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      this.isCopyDisabled = checkedNodes.length > 0 === false
    },

    onNodeClicked(node) {
      this.actionDetail = node
      this.parentCodes = this.data.map(node => {
        return node.parentCode;
      }).filter(parentCode => parentCode != node.parentCode)
      this.isSubmitDisabled = false
      this.operationFlags = operationFlagDecode(this.permissions.map(x => x.permission), this.actionDetail.operationFlag)
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
  border-bottom: 1px solid #EBEEF5;;
}

.content {
  padding-top: 20px;
}

.full-width {
  width: 100%;
}

.scrollable {
  overflow-y: scroll;
}

.full-height {
  height: 100%;
}
</style>
