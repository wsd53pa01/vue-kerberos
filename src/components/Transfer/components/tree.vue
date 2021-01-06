<template>
  <el-card :body-style="{padding: '0'}" shadow="never" class="box-card tree-card">
    <div slot="header" class="clearfix" style="text-align: center;">
      {{ name }}
      <el-button
        v-if="createOption.open"
        type="text"
        icon="el-icon-plus"
        style="float: right; padding: 0"
        @click="appendRoot"
      />
    </div>
    <el-tree
      :data="data"
      show-checkbox
      node-key="id"
    >
      <span slot-scope="{ node, data }">
        <div v-if="node.data.update == true">
          <el-input
            v-model="input"
            class="tree-input"
            autofocus="true"
            @change="changeNode(node, data) "
          />
        </div>
        <div v-else>
          <span>{{ node.label }}</span>
        </div>
      </span>
    </el-tree>
  </el-card>
</template>

<script>
export default {
  name: 'Tree',
  props: {
    name: {
      required: true,
      type: String
    },
    data: {
      type: Array
    },
    createOption: {
      type: Object,
      default: () => {
        return {
          open: false
        }
      }
      // default: false,
    }
  },
  data() {
    return {
      input: ''
    }
  },
  methods: {
    appendRoot() {
      const newData = {
        id: 0,
        label: '',
        children: [],
        update: true,
        disabled: true
      }
      this.data.push(newData)
    },
    changeNode(node) {
      node.data.update = false
      node.data.label = this.input
      node.data.disabled = false
      this.input = ''
      this.createOption.event(node)
    }
  }
}
</script>

<style lang="scss">
.tree-card {
  height: calc(100vh - 380px);
  min-height: 320px;
  width:100%;
  margin-bottom: -1px;
}
.el-card__body {
  height: calc(100% - 50px);
  overflow-y: auto !important;
}
.tree-input > input {
  height: 29px !important;
}
</style>
