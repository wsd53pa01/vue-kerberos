<template>

  <div class="app-container">
    <el-card class="box-card">
      <el-container>
        <el-header height="100px">
          <el-steps :active="active" finish-status="success" align-center>
            <el-step v-for="item in step" :title="item.title"></el-step>
          </el-steps>
          <div class="title" style="text-align: center; margin-top: 20px; board-bottom: none;">
            {{ title }}
          </div>
        </el-header>
        <el-main>
          <keep-alive>
            <componnet :is="main"></componnet>
          </keep-alive>
        </el-main>
        <el-footer>
          <el-row>
            <el-col :span="11" :offset="1">
              <el-button :disabled="step.length-1 == active || active == 0" type="primary">完成</el-button>
            </el-col>
            <el-col :span="2" :offset="5">
              <el-button :disabled="active == 0" type="primary" @click="previous">上一步</el-button>
            </el-col>
            <el-col :span="3" :offset="2">
              <el-button :disabled="step.length-1 == active" type="primary" @click="next">下一步</el-button>
            </el-col>
          </el-row>
        </el-footer>
      </el-container>
    </el-card>
  </div>
</template>

<script>
import Application from './components/Application'
import Group from './components/Group'
import Role from './components/Role'
import Action from './components/Action'
import Permission from './components/Permission'
import Finish from './components/Finish'
import emitter from '@/utils/emitter'

export default {
  name: 'create',
  components: {
    Application,
    Group,
    Role,
    Action,
    Permission,
    Finish
  },
  data() {
    return {
      step: [{
        title: '建立應用程式',
        component: 'Application',
      }, {
        title: '建立群組',
        component: 'Group',
      }, {
        title: '建立角色',
        component: 'Role',
      }, {
        title: '功能設定',
        component: 'Action'
      }, {
        title: '角色權限設定',
        component: 'Permission'
      }, {
        title: '完成',
        component: 'Finish'
      }],
      title: '',
      main: '',
    }
  },
  computed: {
    active: {
      get() {
        let value = this.$store.state.creation.active
        if (value < this.step.length) {
          this.title = this.step[value].title
          this.main = this.step[value].component
        }
        return value
      },
      set(val) {
        this.$store.dispatch('creation/setActive', val)
      }
    }
  },
  created() {
    this.active = 0
  },
  methods: {
    previous() {
      emitter.$emit('previous')
    },
    next() {
      emitter.$emit('next')
    },
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: x-large;
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
