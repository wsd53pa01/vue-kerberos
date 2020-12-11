<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
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
      </el-col>
    </el-row>

    <action :application-id="applicationId" />
  </div>
</template>

<script>
import Action from './Action'

export default {
  components: { Action },
  data() {
    return {
      applicationId: '',
      applications: []
    }
  },
  created() {
    this.getApplications()
    this.applications.forEach(application => {
      if (application.id == this.$route.query.applicationId) {
        application.isActive = true
        this.applicationId = application.id
      }
    })
  },
  methods: {
    getApplications() {
      this.applications = [
        { name: 'Kerberos', id: 1, isActive: false },
        { name: 'EipApp', id: 2, isActive: false }
      ]
    },
    onApplicationClick(application) {
      this.applications.forEach(a => {
        a.isActive = false
      })
      application.isActive = true
      this.applicationId = application.id
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

.el-row {
  margin-bottom: 20px;
    &:last-child {
        margin-bottom: 0;
    }
}
.el-col {
  border-radius: 4px;
}
</style>

