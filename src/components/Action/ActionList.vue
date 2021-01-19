<template>
  <el-card class="action-card">
    <div>
      <el-row
        :gutter="20"
        v-if="modifiable"
        >
        <el-button style="width:100%;"
          @click="copyCheckedCode"
        >
          複製勾選的代碼
        </el-button>
      </el-row>
      <Tree
        ref="tree"
        title="功能列表"
        :data="treeData"
        :create-root-visible="modifiable"
        :create-node-visible="modifiable"
        :node-clickable="modifiable"
        :defaultExpandAll="true"
        :searchable="true"
        @createRoot="createRoot"
        @createNode="createNode"
        @updateNode="updateNode"
        @deleteNode="deleteNode"
        @onNodeClick="onNodeClick"
        @handleDrop="handleDrop"
      />
    </div>
  </el-card>
</template>

<script>
import Tree from '@/components/Tree';
import { getAction, updateAction, createAction, deleteAction } from '@/api/action'
import { convertTreeData, formatNode } from '@/utils/tree'
import notify from '@/utils/notify'
import clip from '@/utils/clipboard'

export default {
  name: 'ActionList',
  components: {
    Tree
  },
  /**
   * @param { Boolean } prop.readOnly 只能看到 Tree、搜尋框
   */
  props: {
    modifiable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      treeData: []
    }
  },
  computed: {
    applicationId() {
      return this.$store.state.application.id
    }
  },
  watch: {
    applicationId(newVal, oldVal) {
      this.fetchAction()
    }
  },
  created() {
    this.fetchAction()
  },
  methods: {
    // 抓取功能列表的資料
    fetchAction() {
      this.treeData = []
      getAction({ applicationId: this.applicationId })
        .then(response => {
          if ( response.isSuccess ) {
            let temp = []
            response.data.forEach(data => {
              temp.push(this.actionConvertToTree(data))
            })
            this.treeData = convertTreeData(temp)
          }
        })
    },
    // 新增功能列表根節點
    createRoot(node) {
      const data = {
        parentCode: node.data.parent,
        menuName: node.data.label,
        applicationId: this.applicationId
      }
      createAction(data)
        .then(response => {
          if (response.isSuccess) {
            let data = response.data
            this.treeData.push(this.actionConvertToTree(data))
            notify.success('新增成功')
          }
        })
        .catch(err => {
          throw err
        })
    },
    // 新增功能列表子節點
    createNode(node) {
      const data = {
        parentCode: node.parent.data.id,
        menuName: node.data.label,
        applicationId: this.applicationId
      }
      createAction(data)
        .then(response => {
          if (response.isSuccess) {
            let data = this.actionConvertToTree(response.data)
            Object.keys(data).forEach(key => {
              node.data[key] = data[key]
            })
          }
        })
    },
    // 更新功能列表
    updateNode(node) {
      let data = this.treeConvertToAction(node.data)
      updateAction(data)
        .then(response => {
          if (response.isSuccess) {
            notify.success('更新成功')
          }
        })
    },
    // 刪除功能列表
    deleteNode(node) {
      const data = node.data
      deleteAction({ id: data.id })
        .then(response => {
          if (response.isSuccess) {
            notify.success('刪除成功')
          }
        })
    },
    // Drag & Drop event
    handleDrop(node) {
      this.updateNode(node)
    },
    // 將 tree 的資料格式轉換成 Action 的資料格式。
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
     * 將 action 的資料轉換成 tree 使用的格式。
     * @param {{ menuCode: String, menuName: String, parentCode: String }=} data
     */
    actionConvertToTree(data) {
      return formatNode({
        id: data.menuCode,
        label: data.menuName,
        children: [],
        parentId: data.parentCode,
        createVisible: this.modifiable,
        updateVisible: this.modifiable,
        deleteVisible: this.modifiable,
        href: data.href,
        icon: data.icon,
        operationFlag: data.operationFlag,
        sortNumber: data.sortNumber
      })
    },
    // 點擊節點，將節點資料放到 Detail 的卡片上。
    onNodeClick(data) {
      this.$emit('onNodeClick', this.treeConvertToAction(data))
    },
    //「複製勾選的代碼」按鈕的事件。
    copyCheckedCode() {
      let text = this.$refs.tree.getCheckedNodes().map(x => x.id).join('\n')
      clip(text, event)
    }
  }
}

</script>

<style lang="scss" scoped>

.action-card {
  height: 100%;
}

</style>
