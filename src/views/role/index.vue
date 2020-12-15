<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="4">
        <application-card />
      </el-col>
      <el-col :span="4">
        <condition />
      </el-col>
      <el-col :span="8">
        <el-card>
          <span slot="header"> </span>
          body
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <span slot="header"> </span>
          body
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ApplicationCard from '@/components/ApplicationCard'
import Condition from './condition'

export default {
  components: { ApplicationCard, Condition },
  data() {
    return {}
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  height: 100%;
  width: 140vw;
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
  overflow-x: scroll;
  height: calc(100vh - 50px);
}
</style>

