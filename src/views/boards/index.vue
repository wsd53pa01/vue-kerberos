<template>
  <div class="app-container">
    <el-card class="box-card">
      <h1 slot="header">應用程式列表</h1>
      <el-input placeholder="搜尋" prefix-icon="el-icon-search" />
      <el-row>
        <el-button>
          <svg-icon icon-class="add" />
        </el-button>

        <el-button
          v-for="application in applications"
          :key="application.id"
          @click="directUrl(application.id)"
        >
          {{ application.name }}
        </el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script>
import { getApplications } from '@/api/application'

export default {
  data() {
    return {
      applications: []
    }
  },
  created() {
    this.getApplications()
  },
  methods: {
    getApplications: function() {
      getApplications()
        .then((result) => {
          if (result.isSuccess) {
            this.applications = result.data.applications
          }
        }).catch((err) => {
          throw err
        })
    },

    directUrl: function(applicationId) {
      this.$store.commit('application/SET_ID', applicationId)
      this.$router.push({ path: 'actions' })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button {
  margin: .4rem;
  width: 23.5%;
  padding-top: 20px;
  padding-bottom: 20px;
}

.el-button:hover {
  color: #45A1FF;
}

.el-input {
  margin: .4rem;
}

h1 {
  margin: .3rem;
}
</style>

