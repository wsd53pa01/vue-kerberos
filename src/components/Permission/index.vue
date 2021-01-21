<template>
  <div>
    <div class="permission-row">
      <div class="permission-col">
        <action-list
          style=" width: 100%;"
          ref="actionList"
          @check="check"
        />
      </div>
      <div class="permission-col">
        <el-card class="permission-card permission-list" >
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
      </div>
    </div>
  </div>
</template>

<script>
import CheckboxDataGrid from '@/components/CheckboxGrid/index'
import { getOperation } from '@/api/operation'
import { getRolePermission, createRolePermission, saveRolePermission } from '@/api/role-permission'
import { operationFlagDecode } from '@/utils/operationFlag'
import { convertTreeData } from '@/utils/tree'
import ActionList from '@/components/Action/ActionList'

import emitter from '@/utils/emitter.js'

export default {
  name: 'Permission',
  components: {
    CheckboxDataGrid,
    ActionList
  },
  data() {
    return {
      checkboxGrid: {
        data: [],
        columnList: []
      },
      selectAction: [],
      checkedData: [],
    }
  },
  computed: {
    permissions() {
      return this.checkboxGrid.columnList.map(x => x.id)
    },
    applicationId() {
      return this.$store.state.application.id
    },
    roleId() {
      return this.$store.state.role.id
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
      this.fetchOperation()
      this.$refs.actionList.fetchAction()
      this.checkedData = []
      this.checkboxGrid.data = []
    },
    roleId() {
      this.$refs.actionList.fetchAction()
      this.checkedData = []
      this.checkboxGrid.data = []
    }
  },
  created() {
    this.fetchOperation()
  },
  mounted() {
    this.$refs.actionList.fetchAction()
  },
  methods: {
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
      const query = { roleId: this.roleId, actionIds: this.selectAction.map(x => x.id) }
      getRolePermission(query)
        .then(response => {
          if (response.isSuccess) {
            let temp = []
            response.data.forEach(element => {
              temp.push({
                id: element.actionId,
                name: element.name,
                operationFlag: element.operationFlag
              })
            })
            let data = this.selectAction
              .map(x => {
                let dataFind = temp.find(t => t.id == x.id)
                let flag = dataFind == null ? 0 : dataFind.operationFlag
                return {
                  id: x.id,
                  name: x.name,
                  disabled: getDisabled(x.id),
                  checked: operationFlagDecode(
                    this.checkboxGrid.columnList.map(x => x.id),
                    flag
                  )
                }
              })
            this.checkboxGrid.data.push(...data)
          }
        })

      const getDisabled = (actionId) => {
        let data = {}
        this.checkboxGrid.columnList.forEach( x => {
          // operationFlagDecode 會解出現在的權限有哪些，在抓出那些 id 不包含在裡面。
          data[x.id] = !operationFlagDecode(this.checkboxGrid.columnList.map(y => y.id),
            this.selectAction.find(ap => ap.id == actionId).operationFlag).includes(x.id)
        })
        return data
      }

    },

    // 功能列表的 check 事件
    check(data) {
      this.selectAction = data.map(x => { return {
        id: x.data_id,
        name: x.label,
        operationFlag: x.operationFlag,
      }})
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

.permission-row {
  display: flex;
  justify-content: space-between;
}

.permission-col {
  flex: 1;
  margin: 0 5px 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

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
  height: calc(100vh - 100px);
  min-height: 380px;
  width: 100%;
}

.permission-card::v-deep > .el-card__body {
  overflow: auto !important;
}

.permission-list .el-table {
  height: calc(100vh - 200px) !important;
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
