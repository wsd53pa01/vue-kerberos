<template>
  <div class="app-container">
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
      this.$store.dispatch('application/setId', id)
      this.$router.push({ path: '/actions' })
    },

    createApplication() {
      this.$router.push({ path: '/boards/process' })
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

