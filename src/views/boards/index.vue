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
        <router-link :to="'/boards/process'">
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
    <card-list-button
      title="應用程式列表"
      :searchable="true"
      :data="applications"
      :has-create="true"
      :custom-create="true"
      :has-update="true"
      :has-delete="true"
      @onClick="onClick"
      @createEvent="createApplication"
      @updateEvent="updateApplication"
      @deleteEvent="deleteApplication"
    />
  </div>
</template>

<script>
import CardListButton from '@/components/CardListButton'
import {
  getApplication,
  updateApplication,
  deleteApplication
} from '@/api/application'

export default {
  components: { CardListButton },
  data() {
    return {
      applications: []
    }
  },
  created() {
    this.getApplication()
  },
  methods: {
    getApplication() {
      getApplication()
        .then(result => {
          if (result.isSuccess) {
            this.applications = result.data
          }
        })
        .catch(err => {
          throw err
        })
    },

    onClick(item) {
      this.$store.commit('application/SET_ID', item.id)
      this.$router.push({ path: '/actions' })
    },

    createApplication() {
      this.$router.push({ path: '/boards/creation' })
    },

    updateApplication(item) {
      const data = {
        id: item.id,
        name: item.name
      }
      updateApplication(data).then(response => {
        if (response.isSuccess) {
          this.getApplication()
          this.notifySuccess('更新成功', response.message)
        }
      })
    },

    deleteApplication(item) {
      console.log(item)
      const data = {
        id: item.id
      }
      deleteApplication(data).then(response => {
        if (response.isSuccess) {
          this.getApplication()
          this.notifySuccess('刪除成功', response.message)
        }
      })
    },

    notifySuccess(title, message) {
      this.$notify({
        title,
        message,
        type: 'success'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
h1 {
  margin: 0.3rem;
}
</style>

