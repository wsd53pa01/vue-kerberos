<template>
  <div class="app-container">
    <application-list />
    <div style="margin-top: 10px;">
      <role-list />
    </div>
    <permission-component
      class="permission-card"
    />
  </div>
</template>

<script>
import ApplicationList from '@/components/ApplicationList'
import RoleList from '@/components/RoleList'
import Permission from '@/components/Permission'

export default {
  name: 'Permission',
  components: {
    PermissionComponent: Permission,
    ApplicationList,
    RoleList
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

