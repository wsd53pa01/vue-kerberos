<template>
  <div class="container">
  <el-row type="flex" justify="space-around">
    <el-col :span="7">
      <Tree
        ref="left"
        :title="left.title"
        :data="left.data"
        :createRootVisible="leftCreateRootVisible"
        @createRoot="leftCreateRoot"
        @updateNode="leftUpdateNode"
        @deleteNode="leftDeleteNode"
      >
      </Tree>
    </el-col>
    <el-col :span="2">
      <div class="button-block" type="flex" justify="content-center">
        <el-button @click="addClick">加入</el-button>
      </div>
    </el-col>
    <el-col :span="7">
      <Tree
        ref="right"
        :title="right.title"
        :data="right.data"
        :createRootVisible="rightCreateRootVisible"
        @createRoot="rightCreateRoot"
        @updateNode="rightUpdateNode"
        @deleteNode="rightDeleteNode"
      >
      </Tree>
    </el-col>
  </el-row>
  </div>
</template>

<script>
import Tree from './components/tree'
export default {
  name: 'Transfer',
  components: {
    Tree
  },
  /**
   * @param {String} props.left 左樹的資料
   * @param {String} props.leftCreateRootVisible 左樹新增根節點按鈕顯示
   * @param {String} props.right 右樹的資料
   * @param {String} props.rightCreateRootVisible 右樹新增根節點按鈕顯示
   */
  props: {
    left: {
      required: true,
      type: Object
    },
    leftCreateRootVisible: {
      type: Boolean,
      default: false,
    },
    right: {
      required: true,
      type: Object
    },
    rightCreateRootVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
    }
  },
  methods: {
    addClick() {
      let data = {
        left: this.$refs.left.getCheckedNodes(),
        right: this.$refs.right.getCheckedNodes()
      }
      if (data.left.length == 0 || data.right.length == 0)
        return;
      this.$emit('addClick', data)
    },
    // 左樹新增根節點事件
    leftCreateRoot(node) {
      this.$emit('leftCreateRoot', node)
    },
    // 左樹更新根節點事件
    leftUpdateNode(node) {
      this.$emit('leftUpdateNode', node)
    },
    // 左樹刪除節點事件
    leftDeleteNode(node) {
      this.$emit('leftDeleteNode', node)
    },
    // 右樹新增根節點事件
    rightCreateRoot(node) {
      this.$emit('rightCreateRoot', node)
    },
    // 右樹更新節點事件
    rightUpdateNode(node) {
      this.$emit('rightUpdateNode', node)
    },
    // 右樹刪除節點事件
    rightDeleteNode(node) {
      this.$emit('rightDeleteNode', node)
    }
  }
}
</script>

<style lang="scss" scoped>
.el-table::before{
  display: none
}

.container {
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
  align-self: center;
}

.button-block {
  display: flex;
  flex-direction: column;
  height: 300px;
  button {
    align-self: center;
    margin: 25px 0px 0px;
  }
}

.el-row {
  width: 100%
}
</style>
