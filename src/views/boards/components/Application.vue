<template>
  <div class="container">
    <span style="line-height:1.7">應用程式名稱</span>
    <el-form ref="form" :model="model" :rules="rule">
      <el-form-item prop="name">
        <el-input
          :disabled="disabled"
          ref="input"
          v-model="model.name"
          placeholder="應用程式名稱"
          @keyup.enter.native="onEnterEvent"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import {
  createApplication,
  getApplication
} from '@/api/application'
import emitter from '@/utils/emitter.js'

export default {
  name: 'Application',
  data() {
    const validateInput = (rule, value, callback) => {
      if (value.trim().length == 0) {
        callback(new Error('不可為空'))
      } else {
        callback()
      }
    }
    return {
      model: {
        name: ''
      },
      rule: {
        name: [{ required: true, trigger: 'blur', validator: validateInput }]
      },
      isNewApplication: true,
      disabled: false
    }
  },
  computed: {
    applicationId: {
      get() {
        return this.$store.state.process.applicationId
      },
      set(val) {
        this.$store.dispatch('process/setApplicationId', val)
      }
    },
    active: {
      get() {
        return this.$store.state.process.active
      },
      set(val) {
        this.$store.dispatch('process/setActive', val)
      }
    }
  },
  beforeCreate() {
    emitter.$offAll(['next', 'previous'])
  },
  mounted() {
    emitter.$on('next', this.handleApplication)
    emitter.$on('previous', () => { this.active -= 1 })
    this.fetchApplication()
  },
  destroyed() {
    emitter.$offAll(['next', 'previous'])
  },
  methods: {
    handleApplication() {
      if (this.isNewApplication) {
        this.$refs.form.validate(valid => {
          if (valid) {
            let data = { name: this.model.name }
            createApplication(data).then((response) => {
              this.$store.dispatch('application/setId', response.data.id)
              this.applicationId = response.data.id
              this.active += 1
            })
          }
        })
      } else {
        this.active += 1
        return false
      }
    },
    fetchApplication() {
      getApplication().then(response => {
        if (response.isSuccess) {
          const app = response.data.find(app => app.id == this.applicationId)
          this.model.name = app == null ? '' : app.name
          if (this.model.name !== '') {
            this.isNewApplication = false
            this.disabled = true
          }
        }
      }) 
    },
    onEnterEvent() {
      emitter.$emit('next')
    }
  }
}
</script>

<style lang="scss" scoped>
.container {
  position: absolute;
  width: 80%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
