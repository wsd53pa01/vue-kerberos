<template>
  <div class="container">
  <el-row type="flex" justify="space-around">
    <el-col :span="7">
      <Tree
        :name="left.name"
        :data="left.data"
      >
      </Tree>
    </el-col>
    <el-col :span="2">
      <div class="button-block" type="flex" justify="content-center">
        <!-- <el-button @click="addEvent">加入</el-button> -->
      </div>
    </el-col>
    <el-col :span="7">
      <Tree
        :name="right.name"
        :data="right.data"
        :createOption="right.createOption"
      >
      </Tree>
    </el-col>
  </el-row>
  </div>
</template>

<script>
// import Table from './components/table'
import Tree from './components/tree'
export default {
  name: 'Transfer',
  components: {
    // Table
    Tree
  },
  props: {
    left: {
      required: true,
      type: Object
    },
    right: {
      required: true,
      type: Object
    },
    addEvent: {
      type: Function
    }
  },
  created() {
  },
  data() {
    return {
    }
  },
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
