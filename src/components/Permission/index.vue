<template>
  <div>
    <el-row>
      <card-list-button
        title="角色列表"
        class="role-card"
        :data="roles"
        :searchable="true"
        @onClick="onRoleClick"
      />
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <Tree
          ref="tree"
          name="功能列表"
          :defaultExpandAll="true"
          :data="actions"
          title="功能列表"
          @check="check"
        />
      </el-col>
      <el-col :span="12">
        <el-card class="permission-card">
          <div slot="header" class="card-header">
            權限列表
            <div class="icon-block">
              <el-button
                class="card-header-icon"
                icon="el-icon-document-checked"
                type="text"
                @click="save"
              >
              </el-button>
              <el-button
                class="card-header-icon"
                icon="el-icon-refresh-left"
                type="text"
                @click="revert"
              >
              </el-button>
            </div>
          </div>
          <checkbox-data-grid
            :data="checkboxGrid.data"
            :columnList="checkboxGrid.columnList"
            @getCheckedData="onCheckboxClick"
          />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CardListButton from '@/components/CardListButton'
import Tree from '@/components/Transfer/components/tree'
import CheckboxDataGrid from '@/components/CheckboxGrid/index'
import { getRole } from '@/api/role'
import { getAction } from '@/api/action'
import { getOperation } from '@/api/operation'
import { getRolePermission, createRolePermission, saveRolePermission } from '@/api/role-permission'
import { operationFlagDecode } from '@/utils/operationFlag'
import { convertTreeData } from '@/utils/tree'

import emitter from '@/utils/emitter.js'

export default {
  name: 'Permission',
  components: { Tree, CardListButton, CheckboxDataGrid },
  data() {
    return {
      roles: [],
      actions: [],
      checkboxGrid: {
        data: [],
        columnList: []
      },
      roleId: 0,
      selectAction: [],
      checkedData: [],
      actionPermission: []
    }
  },
  computed: {
    permissions() {
      return this.checkboxGrid.columnList.map(x => x.id)
    },
    applicationId() {
      return this.$store.state.application.id
    },
    active: {
      get() {
        return this.$store.state.creation.active
      },
      set(val) {
        this.$store.dispatch('creation/setActive', val)
      }
    }
  },
  watch: {
    applicationId() {
      this.fetchAction()
      this.fetchRole()
      this.fetchOperation()
      this.checkedData = []
      this.checkboxGrid.data = []
    },
    roleId() {
      this.checkedData = []

    }
  },
  created() {
    this.fetchRole()
    this.fetchAction()
    this.fetchOperation()
  },
  methods: {
    fetchRole() {
      getRole(this.applicationId)
        .then(response => {
          if (response.isSuccess) {
            this.roles = []
            this.roleId = response.data.map(x => x.id ).includes(this.roleId) ? this.roleId : response.data[0].id
            response.data.forEach(x => {
              const obj = Object.assign({ isActive: x.id == this.roleId }, x)
              this.roles.push(obj)
            })
            if (this.roles.length == 0) {
              this.$notify({
                title: '警告',
                message: '尚未設定角色，請先設定角色',
                type: 'warning'
              });
              this.$router.push({ path: '/role' })
            }
          }
        })

    },

    fetchAction() {
      getAction({applicationId: this.applicationId})
        .then(response => {
          let data = []
          this.actions = []
          this.actionPermission = []
          if (response.isSuccess) {
            response.data.forEach(x => {
              data.push({
                id: x.menuCode,
                data_id: x.id,
                name: x.menuName,
                parentId: x.parentCode,
                operationFlag: x.operationFlag
              })
            })
            this.actions = convertTreeData(data)
            this.actionPermission = response.data.map(x => { return { id: x.id, operationFlag: x.operationFlag}})
          }
        })
        .catch(err => {
          throw err
        })
    },

    fetchOperation() {
      this.checkboxGrid.columnList = []
      getOperation({applicationId: this.applicationId})
        .then(response => {
          if (response.isSuccess) {
            this.checkboxGrid.columnList = response.data.map(x => {
              return {
                id: x.flag,
                name: x.name
              }
            })
          }
        })
        .catch(err => {
          throw err
        })
    },

    // 取得權限列表的資料
    fetchPermissionList() {
      this.checkedData = []
      this.checkboxGrid.data = []
      const query = { roleId: this.roleId, actionIds: this.selectAction }
      getRolePermission(query)
        .then(response => {
          if (response.isSuccess) {
            console.log(response)
            response.data.forEach(element => {
              const { name, operationFlag, actionId } = element
              const obj = Object.assign({
                id: actionId,
                name,
                disabled: getDisabled(actionId),
                checked: operationFlagDecode(
                  this.checkboxGrid.columnList.map(x => x.id),
                  operationFlag
                )
              })
              this.checkboxGrid.data.push(obj)
              console.log(this.checkboxGrid.data)
            })
          }
        })

      const getDisabled = (actionId) => {
        let data = {}
        this.checkboxGrid.columnList.forEach( x => {
          // operationFlagDecode 會解出現在的權限有哪些，在抓出那些 id 不包含在裡面。
          data[x.id] = !operationFlagDecode(this.checkboxGrid.columnList.map(y => y.id),
            this.actionPermission.find(ap => ap.id == actionId).operationFlag).includes(x.id)
        })
        return data
      }

    },

    // 功能列表的 check 事件
    check(data) {
      this.selectAction = this.$refs.tree.getCheckedNodes().map(x => x.data_id)
      this.fetchPermissionList()
    },

    createRolePermission() {
      const toCreateData = {
        roleId: this.roleId,
        permission: this.checkedData
      }
      createRolePermission(toCreateData)
        .then(response => {
          if (response.isSuccess) {
            createSuccess()
          }
        })
    },

    // 角色列表 button click 事件
    onRoleClick(value) {
      this.roleId = value.id
      this.fetchPermissionList()
    },

    // 權限列表的 check click 事件
    onCheckboxClick(checkedData) {
      this.checkedData = checkedData.map(element => {
        return {
          id: element.id,
          operationFlag: element.checked.length == 0 ? 0 : element.checked.reduce((acc, cur) => acc + cur)
        }
      })
    },

    save() {
      this.$confirm('確定要儲存設定?')
      .then(e => {
        if (e == 'confirm') {
          create()
        }
        done();
      })
      .catch(_ => {});

      let create = () => {
        let request = {
          roleId: this.roleId,
          permission: this.checkedData
        }
        console.log('request', request)
        createRolePermission(request)
          .then(response => {
            if (response.isSuccess) {
              this.$notify({
                title: '成功',
                message: '新增成功',
                type: 'success'
              })
            }
          })
      }
    },

    revert() {
      this.$confirm('確定要復原設定?')
      .then(e => {
        if (e == 'confirm')
          this.fetchPermissionList()
        done();
      })
      .catch(_ => {});
    },
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 10px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.card-role {
  box-shadow: none;
}

.permission-card {
  box-shadow: none;
  height: calc(100vh - 380px);
  min-height: 320px;
}

.permission-card::v-deep > .el-card__body {
  overflow: hidden !important;
}

.card-header {
  text-align: center;
}

.el-table::before {
  z-index: 0;
  bottom: auto;
}

.card-header-icon {
  padding: 0px;
  margin-left: 0px;
  left: 10px;
  font-size: large;
}

.icon-block {
  display: inline;
  position: relative;
  left: 10px;
}
</style>
