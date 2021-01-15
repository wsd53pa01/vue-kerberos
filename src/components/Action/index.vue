<template>
  <div class="full-height">
    <el-row :gutter="20" class="full-height">
      <el-col :span="12" class="scrollable full-height">
        <el-card class="action-card">
          <div>
            <el-row :gutter="20">
              <el-button style="width:100%;"
                @click="copyCheckedCode"
              >
                複製勾選的代碼
              </el-button>
            </el-row>
            <Tree
              ref="tree"
              title="功能列表"
              :data="action.tree"
              :create-root-visible="true"
              :node-clickable="true"
              :defaultExpandAll="true"
              :searchable="true"
              @createRoot="createAction"
              @createNode="createNode"
              @updateNode="updateAction"
              @deleteNode="deleteAction"
              @onNodeClick="onNodeClick"
              @handleDrop="handleDrop"
            />
          </div>
        </el-card>
      </el-col>

      <el-col :span="12" class="scrollable full-height">
        <detail :data="detail.data" />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import Detail from './Detail'
import {
  getAction,
  updateAction,
  createAction,
  deleteAction
} from '@/api/action'
import Tree from '@/components/Transfer/components/tree';
import { convertTreeData, formatNode } from '@/utils/tree'
import clip from '@/utils/clipboard'

export default {
  components: {
    Tree,
    Detail
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
      this.fetchAction()
    }
  },
  created() {
    this.fetchAction()
  },
  methods: {
    // 抓取功能列表的資料
    fetchAction() {
      this.action.data = []
      this.action.tree = []
      getAction({ applicationId: this.applicationId })
        .then(response => {
          if (response.isSuccess) {
            let treeData = []
            response.data.forEach(data => {
              treeData.push(this.actionConvertToTree(data))
            })
            this.action.tree = convertTreeData(treeData)
          }
        })
    },

    // 新增功能列表的資料
    createAction(node) {
      const data = {
        parentCode: node.data.parent,
        menuName: node.data.label,
        applicationId: this.applicationId
      }
      createAction(data)
        .then(response => {
          if (response.isSuccess) {
            let data = response.data
            this.action.tree.push(this.actionConvertToTree(data))
            this.success('新增成功')
          }
        })
        .catch(err => {
          throw err
        })
    },

    // 新增子節點
    createNode(node) {
      const request = {
        parentCode: node.parent.data.id,
        menuName: node.data.label,
        applicationId: this.applicationId
      }
      createAction(request)
        .then(response => {
          if (response.isSuccess) {
            let data = this.actionFormatToTree(response.data)
            Object.keys(data).forEach(key => {
              node.data[key] = data[key]
            })
          }
        })
    },

    // 更新功能列表的資料
    updateAction(node) {
      let required = this.treeConvertToAction(node.data)
      updateAction(required)
        .then(response => {
          if (response.isSuccess) {
            this.success(response.message)
          }
        })
    },

    // 刪除功能列表的資料
    deleteAction(node) {
      const data = node.data
      deleteAction({ id: data.id })
        .then(response => {
          if (response.isSuccess) {
            this.success(response.message)
          }
        })
    },

    // 點擊節點，將節點資料放到 Detail 的卡片上
    onNodeClick(data) {
      this.detail.data = this.treeConvertToAction(data)
    },

    treeConvertToAction(data) {
      let actionData = {
        menuCode: data.id,
        href: data.href,
        icon: data.icon,
        parentCode: data.parentId,
        operationFlag: data.operationFlag,
        sortNumber: data.sortNumber,
        menuName: data.label,
      }
      return actionData
    },

    /**
     * 將 action 的資料轉換成 tree 使用的格式
     * @param {{ menuCode: String, menuName: String, parentCode: String }=} data
     */
    actionConvertToTree(data) {
      return formatNode({
        id: data.menuCode,
        label: data.menuName,
        children: [],
        parentId: data.parentCode,
        createVisible: true,
        updateVisible: true,
        deleteVisible: true,
        href: data.href,
        icon: data.icon,
        operationFlag: data.operationFlag,
        sortNumber: data.sortNumber
      })
    },


    // Drag & Drop event
    handleDrop(node) {
      this.updateAction(node)
    },

    success(message) {
      this.$notify({
        title: 'Success',
        message: message,
        type: 'success'
      })
    },

    copyCheckedCode() {
      let text = this.$refs.tree.getCheckedNodes().map(x => x.id).join('\n')
      clip(text, event)
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
.el-card__body {
  height: 100%;
  overflow-y: auto !important;
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

