<template>

  <div class="app-container">
    <el-card class="box-card">
      <el-container>
        <el-header height="100px">
          <el-steps :active="active" finish-status="success" align-center>
            <el-step v-for="item in step" :title="item.title" />
          </el-steps>
          <div class="title" style="text-align: center; margin-top: 20px; board-bottom: none;">
            {{ title }}
          </div>
        </el-header>
        <el-main>
          <component :is="main"></component>
        </el-main>
        <el-footer>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-button :disabled="step.length-1 == active || active == 0" type="primary" @click="finish">完成</el-button>
            </el-col>
            <el-col :span="2" :offset="5">
              <el-button :disabled="active == 0" type="primary" @click="previous">上一步</el-button>
            </el-col>
            <el-col :span="3" :offset="2">
              <el-button type="primary" @click="next">下一步</el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import Application from './components/Application'
import Group from '@/components/Group'
import Role from '@/components/Role'
import Action from '@/components/Action'
import Permission from '@/components/Permission'
import emitter from '@/utils/emitter'

export default {
  name: 'Create',
  components: {
    Application,
    Group,
    Role,
    Action,
    Permission,
  },
  data() {
    return {
      step: [{
        title: '建立應用程式',
        component: 'Application'
      }, {
        title: '建立群組',
        component: 'Group'
      }, {
        title: '建立角色',
        component: 'Role'
      }, {
        title: '功能設定',
        component: 'Action'
      }, {
        title: '角色權限設定',
        component: 'Permission'
      }],
      title: '',
      main: ''
    }
  },
  computed: {
    active: {
      get() {
        let value = this.$store.state.process.active
        if (value < this.step.length) {
          this.title = this.step[value].title
          this.main = this.step[value].component
        }
        return value
      },
      set(val) {
        this.$store.dispatch('process/setActive', val)
      }
    }
  },
  created() {
    this.active = 0
  },
  destroyed() {
    this.$store.dispatch('process/setApplicationId', null)
  },
  methods: {
    previous() {
      emitter.$emit('previous')
    },
    next() {
      emitter.$emit('next')
    },
    finish() {
      this.$router.push('/')
    }
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: x-large;
  border-bottom: 0px;
}

.el-row {
  margin-top: 17px;
}

.el-container {
  min-height: calc(100vh - 150px);
  display: flex;
  flex-direction: column
}

</style>
