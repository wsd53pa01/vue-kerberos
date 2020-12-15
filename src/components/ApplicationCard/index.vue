<template>
  <el-card ref="card">
    <div slot="header">應用程式列表</div>
    <el-input placeholder="搜尋" prefix-icon="el-icon-search" />
    <el-row>
      <el-button
        v-for="application in applications"
        :key="application.id"
        :type="application.isActive ? 'primary' : 'default'"
        :style="{ width: setApplicationWidth() }"
        @click="onApplicationClick(application)"
      >
        {{ application.name }}
      </el-button>
    </el-row>
  </el-card>
</template>

<script>
import { getApplication } from '@/api/application'
export default {
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
    this.getApplications()
  },
  mounted() {
    window.addEventListener('resize', this.setApplicationWidth)
  },
  destroyed() {
    window.removeEventListener('resize', this.setApplicationWidth)
  },
  methods: {
    getApplications() {
      getApplication()
        .then(result => {
          if (result.isSuccess) {
            this.applications = result.data.applications
            this.setApplicationActive()
          }
        })
        .catch(e => {
          throw e
        })
    },

    setApplicationActive() {
      this.applications.forEach(application => {
        application.isActive = application.id == this.applicationId
        const tempApplicationName = application.name
        application.name = ''
        application.name = tempApplicationName
      })
    },

    onApplicationClick(application) {
      this.$store.commit('application/SET_ID', application.id)
      this.setApplicationActive()
    },

    setApplicationWidth(application) {
      const cardWidth = this.$refs.card.$el.clientWidth
      return cardWidth >= '400' ? '23.5%' : '100%'
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button {
  margin: 0.4rem;
  padding-top: 20px;
  padding-bottom: 20px;
  overflow: hidden;
}

.el-button:hover {
  color: #45a1ff;
}

.el-input {
  margin: 0.4rem;
}
</style>
