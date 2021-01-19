<template>
  <Table
    class="dialog"
    ref="table"
    :title="''"
    :fields="fields"
    edit-dialog-width="400px"
    :data="tableData"
    create-visible
    search-bar-visible
    @create="createEvent"
    @delete="deleteEvent"
    @update="updateEvent"
    :loading="isLoading"
    @check="check"
  />
</template>

<script>
import Table from '../Table'
import emitter from '@/utils/emitter.js'
import notify from '@/utils/notify.js'
import {
  getOperation,
  createOperation,
  updateOperation,
  deleteOperation
} from '@/api/operation'

export default {
  name: 'Operation',
  components: {
    Table
  },
  data() {
    return {
      fields: [
        {
          prop: 'flag',
          label: '代碼',
          width: '180',
          dialog: {
            show: false,
          },
          filterable:true,
        },
        {
          prop: 'name',
          label: '操作功能名稱',
          dialog: {
            show: true,
            type: 'text',
          },
          filterable: true,
        },
      ],
      isLoading: false,
      tableData: [],
    }
  },
  computed: {
    applicationId() {
      return this.$store.state.application.id
    }
  },
  created() {
    this.fetchTableData()
  },
  methods: {
    fetchTableData() {
      this.isLoading = true
      getOperation({ applicationId: this.applicationId })
        .then(response => {
          if (response.isSuccess) {
            this.tableData = response.data
          }
        })
        .catch(err => {
          throw err
        })
        .finally(_ => {
          this.isLoading = false
        })
    },

    createEvent(data) {
      this.isLoading = true
      const applicationId = this.$store.state.application.id
      createOperation({ applicationId, ...data })
        .then(response => {
          if (response.isSuccess) {
            this.fetchTableData()
            this.operationChange()
            notify.success('新增成功')
          }
        })
        .catch(err => {
          throw err
        })
        .finally(_ => {
          this.isLoading = false
        })
    },

    updateEvent(data) {
      this.isLoading = true
      updateOperation(data)
        .then(response => {
          if (response.isSuccess) {
            this.fetchTableData()
            this.operationChange()
            notify.success('更新成功')
          }
        })
        .catch(err => {
          throw err
        })
        .finally(_ => {
          this.isLoading = false
        })
    },

    deleteEvent(data) {
      this.isLoading = true
      deleteOperation(data)
        .then(response => {
          if (response.isSuccess) {
            this.fetchTableData()
            this.operationChange()
            notify.success('刪除成功')
          }
        })
        .catch(err => {
          throw err
        })
        .finally(_ => {
          this.isLoading = false
        })
    },

    // 點選節點的 checkbox，後會啟動 check event
    check(data) {
      this.$emit('check', data)
    },

    // 每次「新，刪，修」完都要執行一次，通知 parent 操作功能被改變了。
    operationChange() {
      emitter.$emit('operationChange')
    }
  }
}
</script>
