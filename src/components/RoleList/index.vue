<template>
  <card-list-button
    title="角色列表"
    class="role-card"
    :data="roles"
    :searchable="true"
    @onClick="roleClick"
  />
</template>

<script>
import CardListButton from '@/components/CardListButton'
import { getRole } from '@/api/role'
import notify from '@/utils/notify'

export default {
  name: 'RoleList',
  components: {
    CardListButton
  },
  data() {
    return {
      roles: []
    }
  },
  computed: {
    applicationId() {
      return this.$store.state.application.id
    },
    roleId: {
      get() {
        return this.$store.state.role.id
      },
      set(id) {
        this.$store.dispatch('role/setId', id)
      }
    }
  },
  watch: {
    applicationId() {
      this.fetchRole()
    }
  },
  created() {
    this.fetchRole()
  },
  methods: {
    fetchRole() {
      getRole(this.applicationId)
        .then(response => {
          if (response.isSuccess) {
            this.roles = []
            let data = response.data
            this.roleId = data.map(x => x.id ).includes(this.roleId) ? this.roleId : response.data[0].id
            response.data.forEach(x => {
              const obj = Object.assign({ isActive: x.id == this.roleId }, x)
              this.roles.push(obj)
            })
            if (this.roles.length == 0) {
              notify.warning('尚未設定角色，請先設定角色')
              this.$router.push({ path: '/role'})
            }
          }
        })
    },
    roleClick(item) {
      this.roleId = item.id
    }
  }
}
</script>

<style>
  .group-card {
    margin-top: 10px
  }
</style>

