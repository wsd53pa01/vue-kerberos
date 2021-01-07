<template>
  <div class="container">
    <span style="line-height:1.7" >應用程式名稱</span>
    <el-form ref="form" :model="model" :rules="rule" >
      <el-form-item prop="name">
        <el-input
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
  createApplication
} from '@/api/application'
import emitter from '@/utils/emitter.js'

export default {
  name: 'Application',
  data() {
    const validateInput = (rule, value, callback) => {
      if(value.trim().length == 0) {
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
    }
  },
  computed: {
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
  created() {
    emitter.$on('next', this.handleApplication)
    emitter.$on('previous', () => { this.active -= 1 })
  },
  destroyed() {
    emitter.$offAll(['next', 'previous'])
  },
  methods: {
    handleApplication() {
      this.$refs.form.validate(valid => {
        if (valid) {
          let data = { name: this.model.name }
          createApplication(data).then((response) => {
            console.log(response.data.id)
            this.$store.dispatch('process/setApplicationId', response.data.id)
            this.active += 1
          })
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
