<template>
  <el-card :body-style="{padding: '0'}" shadow="never" class="box-card tree-card">
    <div slot="header" class="clearfix" style="text-align: center;">
      {{ title }}
      <el-button
        v-if="createRootVisible"
        type="text"
        icon="el-icon-plus"
        style="float: right; padding: 0"
        @click="appendRoot"
      />
    </div>
    <div
      style="padding: 10px 20px 10px"
      v-if="searchable"
    >
      <el-input
        prefix-icon="el-icon-search"
        style="height: 28px"
        placeholder="搜尋"
        v-model="filterText">
      </el-input>
    </div>
    <el-tree
      :data="data"
      :show-checkbox="checkboxVisible"
      node-key="id"
      ref="tree"
      :default-expand-all="defaultExpandAll"
      :default-expanded-keys="key"
      :expand-on-click-node="false"
      :highlight-current="nodeClickable"
      :filter-node-method="filterNode"
      @node-click="onNodeClick"
      @check="check"
      :draggable="draggable"
      @node-drop="handleDrop"
    >
      <span slot-scope="{ node, data }" style="width: 100%;">
        <div v-if="node.data.edit == true">
          <el-input
            ref="input"
            class="tree-input"
            v-model="data.label"
            @change="changeNode(node, data)"
          >
            <i
              slot="suffix"
              class="el-input__icon el-icon-close"
              @click="closeInput(node, data)"
            ></i>
          </el-input>
        </div>
        <div v-else>
          <el-button
            v-if="data.createVisible"
            type="text"
            class="icon"
            icon="el-icon-plus"
            @click="appendChild(node)"
          />
          <el-button
            v-if="data.updateVisible"
            class="icon"
            type="text"
            icon="el-icon-edit"
            @click="editClick(node, data)"
          />
          <el-button
            v-if="data.deleteVisible"
            class="icon"
            type="text"
            icon="el-icon-delete"
            @click="deleteNode(node, data)"
          />
          <span
            style="margin-left: 5px;"
          >
            {{ node.label }}
          </span>
        </div>
      </span>
    </el-tree>
  </el-card>
</template>

<script>
export default {
  name: 'Tree',
  /**
   * @param {String} props.title 卡片標頭
   * @param {[{
   *  id: (String|Number),
   *  data_id: Number,
   *  name: String,
   *  parentId: String,
   *  tag: String,
   *  deleteVisible: Boolean, 更新按鈕，顯示或不顯示
   *  updateVisible: Boolean, 刪除按鈕，顯示或不顯示
   * }]} props.data tree 的 data
   * @param {Boolean} props.createRootVisible 新增根節點按鈕，顯示或不顯示
   * @param {Boolean} props.nodeClickable 節點可否點選，若設定為true則會highlight，預設false
   * @param {Boolean} props.defaultExpandAll 展開所有的節點
   * @param {Boolean} props.searchable 搜尋框
   * @param {Boolean} props.checkboxVisible 開啟勾選框  default: false
   * @param {Boolean} props.draggable 開啟拖放的功能 default: false
   */
  props: {
    title: {
      required: true,
      type: String
    },
    data: {
      type: Array,
    },
    createRootVisible: {
      type: Boolean,
      default: false
    },
    nodeClickable: {
      type: Boolean,
      default: false
    },
    defaultExpandAll: {
      type: Boolean,
      default: false
    },
    searchable: {
      type: Boolean,
      default: false
    },
    checkboxVisible: {
      type: Boolean,
      default: true
    },
    draggable: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      key: [],
      filterText: '',
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 新增空的根結點。
    appendRoot() {
      const newData = {
        id: 0,
        label: '',
        children: [],
        edit: true,
        create: true,
        disabled: true
      }
      if (!this.data.find(d => d.id == 0)) {
        this.data.unshift(newData)
      }
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    // 新增新的子節點。
    appendChild(node) {
      if (!node.data.children.map(x => x.id).includes(0)) {
        node.data.children.push({
          id: 0,
          label: '',
          children: [],
          edit: true,
          createNode: true,
          disabled: true
        })
      }
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    // 節點修改後，發送修改事件。
    changeNode(node, data) {
      if (data.label.trim().length != 0) {
        switch(true) {
          case data.create == true:
            this.createRoot(node)
            break;
          case data.update == true:
            this.updateNode(node)
            break;
          case data.createNode == true:
            this.createNode(node)
            break;
        }
      }
      this.closeInput(node, data)
    },
    // 取得所有 checked 狀態的節點。
    getCheckedNodes() {
      return this.$refs.tree.getCheckedNodes()
    },
    // 關閉 input
    closeInput(node, data) {
      data.edit = false
      data.disabled = false
      switch(true) {
        case data.create == true:
          data.update = false
          this.data.shift()
          break;
        case data.update == true:
          data.update = false
          this.spliceNode(node, data)
          break;
        case data.createNode == true:
          data.createNode = false
          if (data.label.length == 0)
            this.spliceNode(node)
          break;
      }
    },
    // 點選編輯 icon，讓節點變成 input
    editClick(node, data) {
      let temp = {
        id: data.id,
        label: data.label,
        children: data.children,
        tag: data.tag,
        data_id: data.data_id,
        deleteVisible: data.deleteVisible,
        createVisible: data.createVisible,
        updateVisible: data.updateVisible,
        edit: true,
        update: true,
        disabled: true
      }
      Object.keys(node.data).forEach(key => {
        if (!Object.keys(temp).includes(key)) {
          temp[key] = node.data[key]
        }
      })
      this.spliceNode(node, temp)
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    // 父節點結果
    handleDrop(draggingNode, dropNode, dropType, ev) {
      switch(true) {
        case dropType == 'inner':
          draggingNode.data.parentId = dropNode.data.id
          break;
        case ['before', 'after'].includes(dropType):
          draggingNode.data.parentId = dropNode.data.parentId
          break;
      }
      this.$emit('handleDrop', draggingNode)
    },
    // 可將 Node 從 parent 中移除，或是用新的節點取代。
    spliceNode(node, replace) {
      const parent = node.parent;
      const children = parent.data.children || parent.data;
      const index = children.findIndex(d => d.id === node.data.id);
      if (replace != null) {
        children.splice(index, 1, replace);
      } else {
        children.splice(index, 1)
      }
    },
    // 新增根節點
    createRoot(node) {
      this.$emit('createRoot', node)
    },
    // 新增子節點
    createNode(node) {
      this.$emit('createNode', node)
    },
    // 更新節點
    updateNode(node) {
      this.$emit('updateNode', node)
    },
    // 刪除節點
    deleteNode(node) {
      this.spliceNode(node)
      this.$emit('deleteNode', node)
    },
    onNodeClick(node) {
      this.$emit('onNodeClick', node)
    },
    check(node) {
      this.$emit('check', node)
    }
  },
}
</script>

<style lang="scss">
.tree-card {
  height: calc(100vh - 200px);
  min-height: 320px;
  width:100%;
  margin-bottom: -1px;
}
.tree-card .el-card__body {
  height: calc(100vh - 200px);
  overflow-y: auto !important;
}
.tree-input > input {
  height: 24px !important;
  width: calc(100% - 10px);
}
.tree-input i {
  display: flex;
  align-items: center;
}
.icon {
  color: #C0C4CC;
  margin-left: 0px !important;
}
</style>
