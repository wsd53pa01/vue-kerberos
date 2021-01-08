<template>
  <div class="full-height">
    <el-row :gutter="20" class="full-height">
      <el-col :span="12" class="scrollable full-height">
        <el-card class="action-card">
          <div>
            <el-row :gutter="20">
              <el-col :span="12">
                <el-input placeholder="搜尋" prefix-icon="el-icon-search" />
              </el-col>
              <el-button
                type="success"
                icon="el-icon-s-order"
                circle
                :disabled="action.copyDisabled"
              />
            </el-row>

            <Tree
              title="功能列表"
              :data="action.tree"
              :create-root-visible="true"
              :node-clickable="true"
              @createRoot="createAction"
              @updateNode="updateAction"
              @deleteNode="deleteAction"
              @onNodeClick="onNodeClick"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="scrollable full-height">
        <detail :data="detail.data" />
      </el-col>
    </el-row>

    <!-- <el-dialog title="操作功能管理" :visible.sync="isPermissionVisible" width="900px">
      <permission
        :permissions="permissions"
        @dmlFinished="permissionUpdated"
      />
    </el-dialog> -->
  </div>
</template>

<script>
import {
  getAction,
  updateAction,
  createAction,
  deleteAction
} from '@/api/action'
import Detail from './Detail'
import Permission from './Permission'
import Tree from '@/components/Transfer/components/tree';
import { convertTreeData } from '@/utils'

export default {
  components: {
    Tree,
    Detail,
    Permission
  },
  data() {
    return {
      action: {
        focusing: {},
        data: [],
        tree: [],
        copyDisabled: true
      },
      detail: {
        data: {}
      }
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
      this.getActions()
    }
  },
  created() {
    this.getActions()
  },
  methods: {

    getActions() {
      getAction({ applicationId: this.applicationId })
        .then(response => {
          this.action.data = response.isSuccess ? response.data : []
          this.convertActionToTree()
        })
        .catch(e => {
          throw e
        })
    },

    createAction(node) {
      const data = { parentCode: node.data.parent, menuName: node.data.label, applicationId: this.applicationId }
      createAction(data)
        .then(response => {
          if (response.isSuccess) {
            this.action.data.push(response.data)
            this.convertActionToTree()
            this.success('新增成功')
          }
        })
        .catch(err => {
          throw err
        })
    },

    updateAction(value) {
      const node = value.data
      const toUpdate = this.action.data.find(value => value.menuCode === node.id)
      toUpdate.menuName = node.label
      updateAction(toUpdate)
        .then(response => {
          if (response.isSuccess) {
            this.success(response.message)
          }
        })
        .catch(err => {
          throw err
        })
    },

    deleteAction(value) {
      const node = value.node.data
      const toDelete = this.action.data.find(value => value.menuCode === node.id)
      deleteAction({ id: toDelete.id })
        .then(response => {
          if (response.isSuccess) {
            this.success(response.message)
          }
        })
        .catch(err => {
          throw err
        })
    },

    onNodeClick(node) {
      const data = this.action.data.find(value => value.menuCode === node.id)
      this.detail.data = data
    },

    convertActionToTree() {
      const tree = this.action.data.map(value => {
        const { menuName, parentCode, menuCode } = value
        return {
          id: menuCode,
          name: menuName,
          parentId: parentCode,
          createVisible: true,
          updateVisible: true,
          deleteVisible: true
        }
      })

      this.action.tree = convertTreeData(tree)
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

.action-card {
  height: 100%;
}

.title {
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
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
