<template>
  <div class="app-container">
    <Table
      :title="'組織設定'"
      :fields="fields"
      edit-dialog-width="400px"
      :data="tableData"
      create-visible
      search-bar-visible
      @create="createEvent"
      @delete="deleteEvent"
      @update="updateEvent"
      :loading="loading"
    />
  </div>
</template>

<script>
import {
  getOrganization,
  createOrganization,
  updateOrganization,
  deleteOrganization
} from '@/api/organization'
import Table from '@/components/Table'
import notify from '@/utils/notify'

export default {
  name: 'OrganizationSetting',
  components: {
    Table
  },
  data() {
    const validateOrganizationName = (rule, value, callback) => {
      if (value == '') {
        callback(new Error('請選擇組織名稱'))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      fields: [{
        prop: 'name',
        label: '組織名稱',
        dialog: {
          show: true,
          data: [{
              value: 1, text: 'Organization 1'
            }, {
              value: 2, text: 'Organization 5'
            }],
          type: 'select',
          require: true,
        },
        filterable: true
      }],
      loading: false
    }
  },
  created() {
    this.fetchOrganization()
  },
  methods: {
    fetchOrganization() {
      getOrganization().then(response => {
        setTimeout(() => {
          this.tableLoading = false
          this.tableData = response.data
        }, 150)
      })
    },
    createEvent(data) {
      this.tableLoading = true
      createOrganization(data).then(response => {
        if (response.isSuccess) {
          this.fetchOrganization()
          notify.success('新增成功')
        }
      })
    },
    updateEvent(data) {
      this.tableLoading = true
      updateOrganization(data).then((response) => {
        if (response.isSuccess) {
          this.fetchOrganization()
          notify.success('修改成功')
        }
      })
    },
    deleteEvent(row, index) {
      this.tableLoading = true
      deleteOrganization({id: row.id}).then((response) => {
        if (response.isSuccess) {
          this.fetchOrganization()
          notify.success('删除成功')
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.action-icon {
  text-align: center
}

</style>
