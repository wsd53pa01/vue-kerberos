<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <application-list
        />
      </el-col>
    </el-row>

    <el-row :gutter="20">
      <el-col :span="24">
        <el-card
          class="box-card screen-height"
          :body-style="{ height: 'inherit' }"
        >
          <action />
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import ApplicationList from '@/components/ApplicationList'
import Action from '@/components/Action'

export default {
  components: {
    Action,
    ApplicationList
  },
  data() {
    return {
      applications: []
    }
  },
  computed: {
    applicationId() {
      return this.$store.state.application.id
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

.screen-height {
  height: calc(100vh - 90px);
}
</style>

