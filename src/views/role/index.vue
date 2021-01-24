<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="6">
        <application-list
          button-layout="horizontal"
        />
      </el-col>
      <el-col :span="6">
        <condition-card
          :condition-list="conditionCard.list"
          :data="conditionCard.data"
          @itemClick="itemClick"
          @change="conditionCardChange"
          @create="conditionCardCreate"
          @update="conditionCardUpdate"
          @delete="conditionCardDelete"
        />
      </el-col>
      <el-col :span="12">
        <manage-card
          :title="manageCard.title"
          :columns="manageCard.columns"
          :data="manageCard.data"
          @sendClick="sendClick"
        />
        <!-- <manage-card
          :title="manageCard.title"
          :data="manageCard.data"
          :columns="manageCard.columns"
          @getSelected="submit"
        /> -->
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ConditionCard from './ConditionCard'
import ManageCard from './ManageCard'
import { getApplication } from '@/api/application'
import { getRole, createRole, updateRole, deleteRole } from '@/api/role'
import { getGroup, createGroup, updateGroup, deleteGroup } from '@/api/group'
import { getRelation, createRelation } from '@/api/role-group'
import notify from '@/utils/notify'

import ApplicationList from '@/components/ApplicationList'

const stateName = { group: 'group', role: 'role' }

export default {
  name: 'Role',
  components: {
    ApplicationList,
    ConditionCard,
    ManageCard
  },
  data() {
    return {
      currentConditionCardId: 0,
      conditionCardState: stateName.role,
      conditionCard: {
        list: ['角色', '群組'],
        data: [{ id: 0, name: '' }]
      },
      manageCard: {
        title: '群組',
        columns: [{ prop: 'name', label: '群組'}],
        data: [{ id: 0, name: '' }],
      },
      dataMapping: {
        'role': {
          fetch: this.fetchRoles,
          create: createRole,
          update: updateRole,
          delete: deleteRole,
          relationId: [],
          data: [{ id: 0, name: '' }],
        },
        'group': {
          fetch: this.fetchGroups,
          create: createGroup,
          update: updateGroup,
          delete: deleteGroup,
          relationId: [],
          data: [{ id: 0, name: '' }],
        }
      },
    }
  },
  computed: {
    applicationId() {
      return this.$store.state.application.id
    }
  },
  watch: {
    // 每次 application id 有異動，重新抓取新 Group、Role 的資料。
    applicationId: {
      handler() {
        this.fetchGroups()
        this.fetchRoles()
      },
      immediate: true
    },
    // 如果 role data 改變，重製
    "dataMapping.role.data"(newValue, oldValue) {
      if (newValue.length == 0)
        return
      if (this.conditionCardState == stateName.role) {
        // 狀態為 role，role 有更新資料，則 Condition Card 設定新的資料。
        this.conditionCard.data = newValue
        this.fetchRelation(newValue[0].id)
      }
    },
    "dataMapping.group.data"(newValue, oldValue) {
      if (newValue.length == 0)
        return
      if (this.conditionCardState == stateName.group) {
        // 狀態為 group，group 有更新資料，則 Condition Card 設定新的資料。
        this.conditionCard.data = newValue
        this.fetchRelation(newValue[0].id)
      }
    },
    "dataMapping.role.relationId"(newValue, oldValue) {
      this.fetchManageCard(stateName.group)
    },
    "dataMapping.group.relationId"(newValue, oldValue) {
      this.fetchManageCard(stateName.role)
    },
    conditionCardState(newValue, oldValue) {
      this.conditionCard.data = this.dataMapping[newValue].data
      this.fetchRelation(this.dataMapping[newValue].data[0].id)
    }
  },
  methods: {
    /**
     * Condition Card 點選右上 button 的事件處理。
     * @param {String} data return conditionCard.list 的其中的內容。
     */
    conditionCardChange(data) {
      this.conditionCardState = data == '角色' ? stateName.role : stateName.group
    },
    // 從 API 抓取新的， role 資料。
    fetchRoles() {
      getRole(this.applicationId)
        .then(response => {
          if (response.isSuccess) {
            this.dataMapping[stateName.role].data = response.data.map(x => { return { id: x.id, name: x.name}})
          }
        })
    },
    // 從 API 抓取新的， group 資料。
    fetchGroups() {
      getGroup(this.applicationId)
        .then(response => {
          if (response.isSuccess) {
            this.dataMapping[stateName.group].data = response.data.map(x => { return { id: x.id, name: x.name}})
          }
        })
    },
    // Condition Card's item click。
    itemClick(id) {
      this.fetchRelation(id)
    },
    /**
     * Condition Card's create event。
     * @param {String} name input item's name to create。
     */
    conditionCardCreate(name) {
      let request = {
        applicationId: this.applicationId,
        name: name
      }
      this.dataMapping[this.conditionCardState]
        .create(request)
        .then(response => {
          if (response.isSuccess) {
            notify.success('新增成功')
            this.dataMapping[this.conditionCardState].fetch()
          }
        })
    },
    /**
     * Condition Card's update event
     * @param {id:(Number|String), name:String} data input item's id and name to update
     */
    conditionCardUpdate(data) {
      this.dataMapping[this.conditionCardState]
        .update(data)
        .then(response => {
          if (response.isSuccess) {
            notify.success('更新成功')
            this.dataMapping[this.conditionCardState].fetch()
          }
        })
    },
    /**
     * Condition Card's delete event
     * @param {Number|String} id input item's to delete
     */
    conditionCardDelete(id) {
      this.dataMapping[this.conditionCardState]
        .delete({id})
        .then(response => {
          if (response.isSuccess) {
            notify.success('刪除成功')
            this.dataMapping[this.conditionCardState].fetch()
          }
        })
    },
    /**
     * 抓取 Manage Card 的資料，
     * @param {String} manageCardState Manage Card 的狀態 ex: role 或 group
     */
    fetchManageCard(manageCardState) {
      let nameMapping = { group: '群組', role: '角色' },
        columnsMapping = { group: [{ prop: 'name', label: '群組'}], role: [{ prop: 'name', label: '角色'}] },
        data = this.dataMapping[manageCardState].data.map(element => {
          return {
            id: element.id,
            name: element.name,
            checked: this.dataMapping[this.conditionCardState].relationId.includes(element.id)
          }
        })
      this.manageCard.title = nameMapping[manageCardState]
      this.manageCard.columns = columnsMapping[manageCardState]
      this.manageCard.data = data
    },
    sendClick(data) {
      const roleIds = this.conditionCardState == stateName.role ? [this.currentConditionCardId] : data.map(x => x.id)
      const groupIds = this.conditionCardState == stateName.group ? [this.currentConditionCardId] : data.map(x => x.id)
      let request = data.map(d => {
        let roleId, groupId, state
        if (this.conditionCardState == stateName.role) {
          roleId = this.currentConditionCardId
          groupId = d.id
          state = d.checked
        } else {
          roleId = d.id,
          groupId = this.currentConditionCardId
          state = d.checked
        }
        return {
          roleId,
          groupId,
          state
        }
      })
      createRelation(request)
        .then(response => {
          if (response.isSuccess) {
            notify.success('設定成功')
            this.fetchRelation(this.currentConditionCardId)
          }
        })
    },
    /**
     * 抓取現在 Condition Card 的 focus item 跟 Manage Card 關係，用於判斷那些 item 是要被勾選的。
     */
    fetchRelation(id) {
      this.currentConditionCardId = id
      const roleId = this.conditionCardState == stateName.role ? id : 0
      const groupId = this.conditionCardState == stateName.group ? id : 0
      const keyMapping = { group: 'roleId', role: 'groupId' }
      getRelation(roleId, groupId).then(response => {
        if (response.isSuccess) {
          this.dataMapping[this.conditionCardState].relationId = response.data.map(data => data[keyMapping[this.conditionCardState]])
        }
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

