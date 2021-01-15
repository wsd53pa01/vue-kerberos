<template>
  <div class="app-container">
    <application-list>
    </application-list>
    <permission-component
      class="permission-card"
    >
    </permission-component>
  </div>
</template>

<script>
import ApplicationList from '@/components/ApplicationList'
import Permission from '@/components/Permission'

export default {
  name: 'Permission',
  components: {
    PermissionComponent: Permission,
    ApplicationList
  },
  created() {
  },
  computed: {
  },
  data() {
    return {
    }
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
  .permission-card {
    margin-top: 10px
  }
</style>

