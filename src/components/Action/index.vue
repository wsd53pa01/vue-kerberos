<template>
    <div>
        <div class="title">功能列表</div>
        <div class="content">
            <el-row :gutter="20">
                <el-col :span="12">
                <el-input
                    placeholder="搜尋"
                    prefix-icon="el-icon-search"
                />
                </el-col>
                <el-button type="success" icon="el-icon-s-order" circle :disabled="isCopyDisabled" />
            </el-row>
            <el-tree
                ref="tree"
                :data="data"
                show-checkbox
                node-key="id"
                default-expand-all
                highlight-current
                :expand-on-click-node="false"
                @check-change="onNodeChecked"
                @node-click="onNodeClicked"
            >
                <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span>
                    <el-button
                    type="text"
                    size="mini"
                    @click="() => append(data)"
                    >
                    新增
                    </el-button>
                    <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)"
                    >
                    刪除
                    </el-button>
                </span>
                </span>
            </el-tree>
        </div>
    </div>
</template>

<script>
import { getActions } from '@/api/actions'

const defaultNode = {
  applicationId: 0,
  href: '',
  icon: '',
  id: 0,
  menuCode: '',
  menuName: '',
  operationFlag: 0,
  parentCode: '',
  sortNumber: 0
}
let id = 0
export default {
  props: ['applicationId'],
  data() {
    return {
      data: [],
      isCopyDisabled: true,
    }
  },
  watch: {
    applicationId: function(newVal, oldVal) {
      this.init(newVal)
    },
  },
  created() {
    this.init(this.applicationId)
  },
  methods: {
    init(applicationId){
      this.getActions(applicationId)
    },

    append(data) {
      let newChild = Object.assign({}, defaultNode)
      // TODO: call 建立的api後，放入新建立的Action
      newChild.id = id++
      newChild.label = '新節點'
      newChild.menuName = '新節點'
      this.onNodeClicked(newChild)
      if (!data.children) {
        this.$set(data, 'children', [])
      }
      data.children.push(newChild)
    },

    remove(node, data) {
      const parent = node.parent
      const children = parent.data.children || parent.data
      const index = children.findIndex((d) => d.id === data.id)
      children.splice(index, 1)
    },

    getActions(applicationId) {
      getActions(applicationId).then(result => {
        this.data = result.data.actions || []
        this.data.forEach(action => {
          action.label = action.menuName
        })
      }).catch(e => {
        throw (e)
      })
    },

    onNodeChecked() {
      const checkedNodes = this.$refs.tree.getCheckedNodes()
      this.isCopyDisabled = checkedNodes.length > 0 === false
    },

    onNodeClicked(node) {
      this.$emit('emitActionDetail', node)
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

.title {
    padding-bottom: 20px;
    border-bottom: 1px solid #EBEEF5;;
}

.content {
    padding-top: 20px;
}
</style>
