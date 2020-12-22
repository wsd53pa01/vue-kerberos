<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <application-card />
      </el-col>
      <el-col :span="6">
        <condition
          :title="condition.title"
          :decorate-button="condition.decorateButton"
          :data="condition.data"
          :event="condition.event"
          @getItemId="getItemId"
          @conditionChange="changeConditionFlag"
          @blurFinish="eventFinished"
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
import { getStatus } from '@/api/role-group-status'

export default {
  components: { ApplicationCard, Condition, Result },
  data() {
    return {
      isByRole: true,
      condition: {
        title: '',
        decorateButton: '',
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
        decorateButton: '群組',
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
        decorateButton: '角色',
        data: [],
        event: {
          create: function() {},
          update: function() {},
          delete: function() {}
        },
        columns: [{ prop: 'name', label: '群組' }]
      },
    }
  },
  created() {
    this.refreshPage()
  },
  watch: {
    applicationId() {
      this.refreshPage()
    }
  },
  computed: {
    applicationId() {
      return this.$store.state.application.id
    }
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

    getItemId(id) {
      const roleId = this.isByRole ? id : ''
      const groupId = this.isByRole ? '' : id
      getStatus(this.applicationId, roleId, groupId).then(response => {
        if(this.isByRole) {
          this.result.data = response.data.status.map(x => {
            return {
              id: x.id,
              groupId: x.groupId,
              name: x.groupName,
              status: x.status
            }
          })
        }
        else {
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

    eventFinished(apiResponse) {
      const promise = this.isByRole ? this.getRole() : this.getGroup()
      promise.then(result => {
        this.renderCondition()
        this.$notify({
          title: 'Success',
          message: apiResponse.message,
          type: 'success'
        })
      })
    },

    submit(selected) {
      // console.log(selected);
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

