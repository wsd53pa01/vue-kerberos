<template>
  <div class="app-container">
    <el-card class="box-card">
      <h1 slot="header">應用程式列表</h1>
      <el-input
        v-model="search"
        placeholder="搜尋"
        prefix-icon="el-icon-search"
      />
      <el-row>
        <router-link :to="'/boards/creation'">
          <el-button>
            <svg-icon icon-class="add" />
          </el-button>
        </router-link>
        <el-button
          v-for="application in list"
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
import { getApplication } from '@/api/application'

export default {
  data() {
    return {
      applications: [],
      search: '',
      list: []
    }
  },
  created() {
    this.getApplications()
  },
  watch: {
    search() {
      this.list = this.applications.filter(item => {
        if (this.search && item.name.indexOf(this.search) < 0) return false
        return true
      })
    }
  },
  methods: {
    getApplications() {
      getApplications()

        .then((result) => {
          if (result.isSuccess) {
            this.applications = result.data.applications
            this.list = this.applications
          }
        }).catch((err) => {
          throw err
        })
    },
    directUrl(applicationId) {
      this.$store.commit('application/SET_ID', applicationId)
      this.$router.push({ path: 'actions' })
    },
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

.el-input {
  margin: .4rem;
}

h1 {
  margin: .3rem;
}
</style>

