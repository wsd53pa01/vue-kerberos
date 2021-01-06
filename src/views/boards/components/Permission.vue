<template>
  <div>
    <el-row>
      <card-list-button
        class="role-card"
        :data="roles"
        @onClick="onRoleClick"
      />
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <Tree name="功能列表" :data="actions" />
      </el-col>
      <el-col :span="12">
        <checkbox-data-grid
          :data="checkboxGrid.rolePermission"
          :header="checkboxGrid.permission"
          @getCheckedData="onCheckboxClick"
        />
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
import { getPermission } from '@/api/permission'
import { getRolePermission, createRolePermission } from '@/api/role-permission'
import { operationFlagDecode } from '@/utils/operationFlag'

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
    }
  },
  created() {
    this.getRole()
    this.getAction()
    this.getPermission()
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

    getPermission() {
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
        }
      ]
      // getPermission(this.applicationId)
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
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

.role-card {
  box-shadow: none;
}
</style>
