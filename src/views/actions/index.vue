<template>
  <div class="app-container">
    <el-row :gutter="20">
      <el-col :span="24">
        <card-list-button
          title="應用程式列表"
          :data="applications"
          @onClick="onApplicationClick"
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
import { getApplication } from '@/api/application'
import Action from '@/components/Action'
import CardListButton from '@/components/CardListButton'

export default {
  components: { Action, CardListButton },
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
    this.getApplication()
  },
  methods: {
    getApplication() {
      getApplication()
        .then(response => {
          if (response.isSuccess) {
            response.data.forEach(element => {
              const assignObject = {
                isActive: this.applicationId == element.id
              }
              this.applications.push(Object.assign(assignObject, element))
            })
          }
        })
        .catch(err => {
          throw err
        })
    },

    onApplicationClick(item) {
      this.$store.commit('application/SET_ID', item.id)
    }
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

