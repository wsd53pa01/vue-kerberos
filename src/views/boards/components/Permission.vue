<template>
  <div>
    <el-row>
      <card-list-button
        title="角色列表"
        class="role-card"
        :data="roles"
        @onClick="onRoleClick"
      />
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <Tree name="功能列表" :data="actions" title="功能列表" />
      </el-col>
      <el-col :span="12">
        <el-card class="permission-card">
          <div slot="header" class="card-header">權限列表</div>
          <checkbox-data-grid
            :data="checkboxGrid.rolePermission"
            :header="checkboxGrid.permission"
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
import { getRolePermission, createRolePermission } from '@/api/role-permission'
import { operationFlagDecode } from '@/utils/operationFlag'
import emitter from '@/utils/emitter.js'

export default {
  name: 'Permission',
  components: { Tree, CardListButton, CheckboxDataGrid },
  data() {
    return {
      roles: [
        {
          id: 1,
          name: 'Roile1',
          applicationId: 123
        }
      ],
      actions: [],
      checkboxGrid: {
        rolePermission: [],
        permission: [],
        checkedData: []
      },
      roleId: 0,
      selectAction: []
    }
  },
  computed: {
    applicationId() {
      return this.$store.state.creation.applicationId
    },

    permissions() {
      return this.checkboxGrid.permission.map(x => x.id)
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
  beforeCreate() {
    // emitter.$offAll(['next', 'previous'])
  },
  destroyed() {
    // emitter.$offAll(['next', 'previous'])
  },
  created() {
    // emitter.$on('next', this.createRolePermission)
    // emitter.$on('previous', () => { this.active -= 1 })
    this.getRole()
    this.getAction()
    this.getOperation()
  },
  methods: {
    getRole() {
      this.roles = [
        {
          id: 1,
          name: 'Roile1',
          applicationId: 123
        }
      ]

      // getRole(this.applicationId)
      //   .then(response => {
      //     this.roles = response.isSuccess ? response.data : []
      //   })
      //   .catch(err => {
      //     throw err
      //   })
    },

    getAction() {
      getAction(this.applicationId)
        .then(response => {
          this.actions = response.isSuccess ? response.data : []
        })
        .catch(err => {
          throw err
        })
    },

    getOperation() {
      this.checkboxGrid.permission = [
        {
          id: 1,
          name: '操操操操1'
        },
        {
          id: 2,
          name: '操作2'
        },
        {
          id: 4,
          name: '操作4'
        },
      ]
      // getOperation(this.applicationId)
      //   .then(response => {
      //     if (response.isSuccess) {
      //       this.checkboxGrid.permission = response.data.map(x => {
      //         return {
      //           id: x.operationFlag,
      //           name: x.name
      //         }
      //       })
      //     }
      //   })
      //   .catch(err => {
      //     throw err
      //   })
    },

    getRolePermission() {
      this.checkboxGrid.rolePermission = [
        {
          id: 1,
          name: '功能操操操',
          checked: operationFlagDecode(this.permissions, 7)
        },
        {
          id: 2,
          name: '功能2',
          checked: operationFlagDecode(this.permissions, 3)
        },
        {
          id: 3,
          name: '功能3',
          checked: operationFlagDecode(this.permissions, 1)
        },
        {
          id: 4,
          name: '功能4',
          checked: operationFlagDecode(this.permissions, 1)
        }
      ]
      // const query = { roleId: this.roleId, actionIds: this.selectAction }
      // getRolePermission(query)
      //   .then(response => {
      //     this.checkboxGrid.rolePermission = []
      //     if (response.isSuccess) {
      //       response.data.forEach(element => {
      //         const { id, name, operationFlag } = element
      //         const obj = {
      //           id,
      //           name,
      //           checked: operationFlagDecode(
      //             this.checkboxGrid.permission,
      //             operationFlag
      //           )
      //         }
      //         this.checkboxGrid.rolePermission.push(obj)
      //       })
      //     }
      //   })
      //   .catch(err => {
      //     throw err
      //   })
    },

    createRolePermission() {
      const toCreateData = {
        roleId: this.roleId,
        ...this.checkedData
      }
      createRolePermission(toCreateData)
        .then(response => {
          if (response.isSuccess) {
            this.$notify({
              title: '成功',
              message: '新增成功',
              type: 'success'
            })
          }
        })
        .catch(err => {
          throw err
        })
    },

    onRoleClick(value) {
      this.roleId = value
      this.getRolePermission()
    },

    onCheckboxClick(checkedData) {
      this.checkedData = checkedData.map(element => {
        return {
          id: element.id,
          operationFlag: element.checked.reduce((acc, cur) => acc + cur)
        }
      })
    },

    restoreData() {
      this.checkboxGrid.rolePermission = [...this.checkboxGrid.rolePermission]
    }
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
</style>
