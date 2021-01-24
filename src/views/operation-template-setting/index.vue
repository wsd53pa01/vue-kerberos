
<template>
  <div class="app-container">
    <Table
      :title="'操作功能範本'"
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
  getOperationTemplate,
  createOperationTemplate,
  updateOperationTemplate,
  deleteOperationTemplate
} from '@/api/operation-template'
import Table from '@/components/Table'
import notify from '@/utils/notify'

export default {
  name: 'OperationTemplateSetting',
  components: {
    Table
  },
  data() {
    const validateOrganizationName = (rule, value, callback) => {
      if (value == '') {
        callback(new Error(''))
      } else {
        callback()
      }
    }
    return {
      tableData: [],
      loading: false,
      fields: [{
        prop: 'id',
        label: '代碼',
        width: '180',
        dialog: {
          show: false,
        },
        filterable: true
      }, {
        prop: 'name',
        label: '範本名稱',
        dialog: {
          show: true,
          type: 'text',
        },
        filterable: true
      }]
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    // 取得資料表的 Data
    fetchData() {
      this.loading = true
      getOperationTemplate().then((response) => {
        setTimeout(() => {
          this.loading = false,
          this.tableData = response.data
        }, 1000)
      })
    },
    createEvent(data) {
      const { name } = data
      this.loading = true
      createOperationTemplate({ name }).then((response) => {
        if (response.isSuccess) {
          this.fetchData()
          notify.success('新增成功')
        }
      })
    },
    updateEvent(data) {
      this.loading = true
      updateOperationTemplate(data).then((response) => {
        if (response.isSuccess) {
          this.fetchData()
          notify.success('修改成功')
        }
      })
    },
    deleteEvent(data) {
      this.loading = true
      deleteOperationTemplate(data).then((response) => {
        if (response.isSuccess) {
          this.fetchData()
          notify.success('刪除成功')
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
