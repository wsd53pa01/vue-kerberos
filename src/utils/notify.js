import Vue from 'vue'

export default {
  Success(message) {
    Vue.prototype.$notify({
      title: '成功',
      message: message,
      type: 'success',
      duration: 2000
    })
  },
}
