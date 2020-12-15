<template>
  <el-card>
    <div slot="header">
      {{ conditionBy }}
      <el-button
        type="primary"
        size="mini"
        class="condition-button"
        @click="convertCondition"
      >
        {{ reverseCondition }}
      </el-button>
    </div>
    body
  </el-card>
</template>

<script>
import { getRole } from '@/api/role'
import { getGroup } from '@/api/group'

export default {
  data() {
    return {
      isConditionByRole: true,
      items: [],
      roles: [],
      groups: []
    }
  },
  computed: {
    conditionBy() {
      return this.isConditionByRole ? '角色' : '群組'
    },
    reverseCondition() {
      return this.isConditionByRole ? '群組' : '角色'
    }
  },
  created() {
    getRoles()
    getGroups()
  },
  methods: {
    convertCondition() {
      this.isConditionByRole = !this.isConditionByRole
      this.items = this.isConditionByRole ? this.roles : this.groups
      console.log(this.items)
    },

    getRole() {
      getRole()
        .then(result => {
          if (result.isSuccess) {
            this.roles = result.data.roles
          }
        })
        .catch(err => {
          throw err
        })
    },

    getGroup() {
      getGroup()
        .then(result => {
          if(result.isSuccess) {
            this.groups = result.data.groups
          }
        })
        .catch(err => {
          throw err
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  height: 100%;
  width: 140vw;
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
  overflow-x: scroll;
  height: calc(100vh - 50px);
}

.condition-button {
  margin-top: -5px;
  float: right;
}
</style>

