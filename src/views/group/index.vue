<template>
  <div class="app-container">
    <el-row>
      <card-list-button
        ref:="app"
        title="應用程式列表"
        :data="applications"
        button-layout="vertical"
        :searchable="true"
        @onClick="applicationClick"
      >
      </card-list-button>
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
import CardListButton from '@/components/CardListButton'
import Group from '@/components/Group'
import { getApplication } from '@/api/application'

export default {
  name: 'Group',
  components: {
    GroupComponent: Group,
    CardListButton
  },
  computed: {
    applicationId: {
      get() {
        return this.$store.state.application.id
      },
      set(id) {
        this.$store.commit('application/SET_ID', id)
      }
    }
  },
  created() {
    this.fetchApplication()
  },
  data() {
    return {
      applications: []
    }
  },
  methods: {
    fetchApplication() {
      getApplication()
        .then(response => {
          if (response.isSuccess) {
            response.data.forEach(x => {
              const obj = Object.assign({ isActive: x.id == this.applicationId }, x)
              this.applications.push(obj)
            })
          }
        })
    },

    applicationClick(item) {
      this.applicationId = item.id
    }
  }
}
</script>

<style>
  .group-card {
    margin-top: 10px
  }
</style>

