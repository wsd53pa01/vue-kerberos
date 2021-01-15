<template>
  <Table
    class="dialog"
    ref="table"
    :fields="[
      {
        prop: 'flag',
        label: '代碼',
        width: '180',
        dialog: {
          show: false,
        },
        filter: {
          show: true,
        },
      },
      {
        prop: 'name',
        label: '權限名稱',
        dialog: {
          show: true,
          type: 'text',
        },
        filter: {
          show: true,
        },
      },
    ]"
    :fetch-data="fetchData"
    :title="''"
    dialog-width="400px"
    :table-data="tableData"
    :create-option="createOption"
    :update-option="updateOption"
    :delete-option="deleteOption"
    :loading="isLoading"
  />
</template>

<script>
import Table from '../Table'
import emitter from '@/utils/emitter.js'
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
      data: [],
      isLoading: false,
      tableData: {},
      createOption: {
        hidden: false,
        event: this.createOperation
      },
      updateOption: {
        hidden: false,
        event: this.updateOperation
      },
      deleteOption: {
        hidden: false,
        event: this.deleteOperation
      }
    }
  },
  computed: {
    applicationId() {
      return this.$store.state.application.id
    }
  },
  watch: {
    data(newVal, oldVal) {
      this.tableData = {
        list: newVal,
        total: newVal.length
      }
    }
  },
  created() {
    this.tableData = {
      list: this.data,
      total: this.data.length
    }
  },
  methods: {
    fetchData(data) {
      this.isLoading = true
      getOperation({ applicationId: this.applicationId, ...data })
        .then(response => {
          if (response.isSuccess) {
            this.tableData = {
              list: response.data,
              total: response.data.length
            }
          }
        })
        .catch(err => {
          throw err
        })
        .finally(_ => {
          this.isLoading = false
        })
    },

    createOperation(data) {
      this.isLoading = true
      const applicationId = this.$store.state.application.id
      createOperation({ applicationId, ...data })
        .then(response => {
          if (response.isSuccess) {
            this.$refs.table.refreshTable()
            this.operationChange()
          }
        })
        .catch(err => {
          throw err
        })
        .finally(_ => {
          this.isLoading = false
        })
    },

    updateOperation(data) {
      this.isLoading = true
      updateOperation(data)
        .then(response => {
          if (response.isSuccess) {
            this.$refs.table.refreshTable()
            this.operationChange()
          }
        })
        .catch(err => {
          throw err
        })
        .finally(_ => {
          this.isLoading = false
        })
    },

    deleteOperation(data) {
      this.isLoading = true
      deleteOperation(data)
        .then(response => {
          if (response.isSuccess) {
            this.$refs.table.refreshTable()
            this.operationChange()
          }
        })
        .catch(err => {
          throw err
        })
        .finally(_ => {
          this.isLoading = false
        })
    },

    // 每次「新，刪，修」完都要執行一次。
    operationChange() {
      emitter.$emit('operationChange')
    }
  }
}
</script>
