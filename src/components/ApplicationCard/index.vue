<template>
  <el-card class="box-card">
    <div slot="header">
      應用程式列表
    </div>
    <el-row>
      <el-button
        v-for="application in applications"
        :key="application.id"
        :type="application.isActive ? 'primary' : 'default'"
        @click="onApplicationClick(application)"
      >
        {{ application.name }}
      </el-button>
    </el-row>
  </el-card>
</template>

<script>
import { getApplications } from '@/api/application'
const id = 1
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
  methods: {
    getApplications() {
      getApplications().then(result => {
        if (result.isSuccess) {
          this.applications = result.data.applications
          this.setApplicationActive()
        }
      }).catch(e => {
        throw (e)
      })
    },
    setApplicationActive() {
      this.applications.forEach(application => {
        application.isActive = application.id == this.applicationId
        // application.name = '1'
        const tempApplicationName = application.name
        application.name = ''
        application.name = tempApplicationName
      })
    },
    onApplicationClick(application) {
      this.$store.commit('application/SET_ID', application.id)
      this.setApplicationActive()
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
</style>
