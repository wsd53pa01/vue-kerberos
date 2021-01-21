<template>
  <card-list-button
    ref:="app"
    title="應用程式列表"
    :data="applications"
    :button-layout="buttonLayout"
    :searchable="true"
    @onClick="applicationClick"
  >
  </card-list-button>
</template>

<script>
import CardListButton from '@/components/CardListButton'
import { getApplication } from '@/api/application'

export default {
  name: 'ApplicationList',
  components: {
    CardListButton
  },
  /**
   * @param {String} prop.buttonLayout 設定縱向或橫向。
   */
  props: {
    buttonLayout: {
      type: String,
      default: 'vertical',
      validator: function (value) {
        return ['vertical', 'horizontal'].indexOf(value) !== -1
      }
    }
  },
  data() {
    return {
      applications: []
    }
  },
  computed: {
    applicationId: {
      get() {
        return this.$store.state.application.id
      },
      set(id) {
        this.$store.dispatch('application/setId', id)
      }
    }
  },
  created() {
    this.fetchApplication()
  },
  methods: {
    fetchApplication() {
      getApplication()
        .then(response => {
          if (response.isSuccess) {
            this.applicationId = response.data.includes(this.applicationId) ? this.applicationId : response.data[0].id
            response.data.forEach(x => {
              const obj = Object.assign({ isActive: x.id == this.applicationId }, x)
              this.applications.push(obj)
            })
          }
        })
    },
    applicationClick(item) {
      this.applicationId = item.id
    }
  }
}
</script>

<style>
  .group-card {
    margin-top: 10px
  }
</style>

