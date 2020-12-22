<template>
  <el-card ref="card">
    <div slot="header">應用程式列表</div>
    <el-input placeholder="搜尋" prefix-icon="el-icon-search" />
    <el-row>
      <el-button
        v-for="application in applications"
        :key="application.id"
        :type="application.isActive ? 'primary' : 'default'"
        :class="{ 'flex-button': isFullApplication }"
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
      applications: [],
      isFullApplication: false,
      index: 0
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
    window.addEventListener('resize', this.customApplicationClass)
    this.customApplicationClass()
  },
  destroyed() {
    window.removeEventListener('resize', this.customApplicationClass)
  },
  methods: {
    getApplications() {
      getApplication()
        .then(result => {
          if (result.isSuccess) {
            this.applications = []
            result.data.applications.forEach(x => {
              this.applications.push(Object.assign({ isActive: false }, x))
            })
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
      })
    },

    onApplicationClick(application) {
      this.$store.commit('application/SET_ID', application.id)
      this.setApplicationActive()
    },

    customApplicationClass() {
      const cardWidth = this.$refs.card.$el.clientWidth
      this.isFullApplication = cardWidth < '450'
    }
  }
}
</script>

<style lang="scss" scoped>
.el-button {
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  padding-top: 20px;
  padding-bottom: 20px;
  overflow: hidden;
  width: 23.5%;
}

.flex-button {
  width: 100%;
  margin-left: 0;
}

.el-card {
  overflow: auto;
}
</style>
