<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <application-card />
      </el-col>
      <el-col :span="6">
        <condition
          :title="condition.title"
          :condition-button="condition.conditionButton"
          :data="condition.data"
          :event="condition.event"
          @getItemId="getRelation"
          @conditionChange="changeConditionFlag"
          @blurFinish="reGetItems"
        />
      </el-col>
      <el-col :span="12">
        <result
          :title="result.title"
          :data="result.data"
          :columns="result.columns"
          @getSelected="submit"
        />
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ApplicationCard from '@/components/ApplicationCard'
import Condition from './Condition'
import Result from './Result'
import { getRole, createRole, updateRole, deleteRole } from '@/api/role'
import { getGroup, createGroup, updateGroup, deleteGroup } from '@/api/group'
import { getRelation, createRelation } from '@/api/role-group'

export default {
  components: { ApplicationCard, Condition, Result },
  data() {
    return {
      isByRole: true,
      condition: {
        title: '',
        conditionButton: '',
        data: [],
        event: {
          create: function() {},
          update: function() {},
          delete: function() {}
        }
      },
      result: {
        title: '',
        data: [],
        columns: []
      },
      roles: {
        title: '角色',
        conditionButton: '群組',
        data: [],
        event: {
          create: function() {},
          update: function() {},
          delete: function() {}
        },
        columns: [{ prop: 'name', label: '角色' }]
      },
      groups: {
        title: '群組',
        conditionButton: '角色',
        data: [],
        event: {
          create: function() {},
          update: function() {},
          delete: function() {}
        },
        columns: [{ prop: 'name', label: '群組' }]
      },
      currentItemId: 0
    }
  },
  computed: {
    applicationId() {
      return this.$store.state.application.id
    }
  },
  watch: {
    applicationId() {
      this.refreshPage()
    }
  },
  created() {
    this.refreshPage()
  },
  methods: {
    refreshPage() {
      const rolePromise = this.getRole()
      const groupPromise = this.getGroup()
      this.roles.event = {
        create: createRole,
        update: updateRole,
        delete: deleteRole
      }
      this.groups.event = {
        create: createGroup,
        update: updateGroup,
        delete: deleteGroup
      }
      Promise.all([rolePromise, groupPromise]).then(_ => {
        this.renderCondition()
      })
    },

    getRole() {
      return getRole(this.applicationId)
        .then(result => {
          if (result.isSuccess) {
            this.roles.data = result.data.roles
          }
        })
        .catch(err => {
          throw err
        })
    },

    getGroup() {
      return getGroup(this.applicationId)
        .then(result => {
          if (result.isSuccess) {
            this.groups.data = result.data.groups
          }
        })
        .catch(err => {
          throw err
        })
    },

    renderCondition() {
      if (this.isByRole) {
        this.condition = Object.assign({}, this.roles)
        this.result = Object.assign({}, this.groups)
      } else {
        this.condition = Object.assign({}, this.groups)
        this.result = Object.assign({}, this.roles)
      }
    },

    changeConditionFlag(isByRole) {
      this.isByRole = isByRole
      this.renderCondition()
    },

    getRelation(id) {
      this.currentItemId = id
      const roleId = this.isByRole ? id : ''
      const groupId = this.isByRole ? '' : id
      getRelation(this.applicationId, roleId, groupId).then(response => {
        if (this.isByRole) {
          this.result.data = response.data.map(x => {
            return {
              id: x.id,
              groupId: x.groupId,
              name: x.groupName,
              status: x.status
            }
          })
        } else {
          this.result.data = response.data.status.map(x => {
            return {
              id: x.id,
              roleId: x.roleId,
              name: x.roleName,
              status: x.status
            }
          })
        }
      })
    },

    reGetItems(apiResponse) {
      const promise = this.isByRole ? this.getRole() : this.getGroup()
      promise.then(_ => {
        this.renderCondition()
        this.success(apiResponse.message)
      })
    },

    submit(selected) {
      const conditionKey = this.isByRole ? 'roleId' : 'groupId'
      const resultKey = this.isByRole ? 'groupId' : 'roleId'
      const toCreateResult = selected.map(x => {
        return x[resultKey]
      })

      const toCreate = []
      toCreateResult.forEach(x => {
        const element = {}
        element[conditionKey] = this.currentItemId
        element[resultKey] = x
        toCreate.push(element)
      })

      createRelation(toCreate).then(x => {
        if (x.isSuccess) {
          this.getRelation(this.currentItemId)
          this.success(apiResponse.message)
        }
      })
    },

    success(message) {
      this.$notify({
        title: 'Success',
        message: message,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  height: 100%;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  height: 100%;
  border-radius: 4px;
}

.el-card {
  height: 100%;
}

.app-container {
  height: calc(100vh - 50px);
}

.el-button {
  margin-left: 0;
}
</style>

