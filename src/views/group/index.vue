<template>
  <div class="app-container">
    <el-row>
      <ApplicationList
      ></ApplicationList>
    </el-row>
    <el-row>
      <el-card class="group-card">
        <div slot="header" class="clearfix">
          <span>群組管理</span>
        </div>
        <group-component>
        </group-component>
      </el-card>
    </el-row>
  </div>
</template>

<script>
import ApplicationList from '@/components/ApplicationList'
import Group from '@/components/Group'

export default {
  name: 'Group',
  components: {
    GroupComponent: Group,
    ApplicationList
  }
}
</script>

<style>
  .group-card {
    margin-top: 10px
  }
</style>

