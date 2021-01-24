<template>
  <div class="full-height">
    <el-row :gutter="20" class="full-height">
      <el-col :span="12" class="scrollable full-height">
        <action-list
          @onNodeClick="onNodeClick"
          modifiable
        />
      </el-col>
      <el-col :span="12" class="scrollable full-height">
        <detail :data="detailData" />
      </el-col>
    </el-row>

  </div>
</template>

<script>
import Detail from './Detail'
import ActionList from './ActionList'
import emitter from '@/utils/emitter.js'

export default {
  name: 'ActionIndex',
  components: {
    Detail,
    ActionList
  },
  data() {
    return {
      detailData: {}
    }
  },
  computed: {
    active: {
      get() {
        return this.$store.state.process.active
      },
      set(val) {
        this.$store.dispatch('process/setActive', val)
      }
    }
  },
  mounted() {
    emitter.$on('next', () => { this.active += 1 })
    emitter.$on('previous', () => { this.active -= 1 })
  },
  destroyed() {
    emitter.$offAll(['next', 'previous'])
  },
  methods: {
    // 點擊節點，將節點資料放到 Detail 的卡片上
    onNodeClick(data) {
      this.detailData = data
    },
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

