import Vue from 'vue'

export default {
  success(message) {
    Vue.prototype.$notify({
      title: '成功',
      message: message,
      type: 'success',
      duration: 2000
    })
  },
}
