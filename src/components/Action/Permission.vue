<template>
  <Table
    class="dialog"
    :fields="[
      {
        prop: 'code',
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
    :fetch-data="function () {}"
    :title="''"
    dialog-width="400px"
    :table-data="tableData"
    :create-option="createOption"
    :update-option="updateOption"
    :delete-option="deleteOption"
    :loading="false"
  />
</template>

<script>
import Table from '../Table'
import {
  createPermission,
  updatePermission,
  deletePermission
} from '@/api/permission'

const emit = {
  dmlFinished: 'dmlFinished'
}

export default {
  components: {
    Table
  },
  props: {
    permissions: {
      required: true,
      default() {
        return []
      }
    }
  },
  data() {
    return {
      isLoading: false,
      tableData: {},
      createOption: {
        hidden: false,
        event: this.createPermission
      },
      updateOption: {
        hidden: false,
        event: this.updatePermission
      },
      deleteOption: {
        hidden: false,
        event: this.deletePermission
      }
    }
  },
  watch: {
    permissions(newVal, oldVal) {
      this.tableData = {
        list: newVal,
        total: newVal.length
      }
    }
  },
  created() {
    this.tableData = {
      list: this.permissions,
      total: this.permissions.length
    }
  },
  methods: {
    createPermission(data) {
      this.isLoading = true
      const applicationId = this.$store.state.application.id
      createPermission({ applicationId, ...data })
        .then(response => {
          if (response.isSuccess) {
            this.$emit(emit.dmlFinished, response.data)
          }
        })
        .catch(err => {
          throw err
        })
        .finally(_ => {
          this.isLoading = false
        })
    },

    updatePermission(data) {
      this.isLoading = true
      updatePermission(data)
        .then(response => {
          if (response.isSuccess) {
            this.$emit(emit.dmlFinished, response.data)
          }
        })
        .catch(err => {
          throw err
        })
        .finally(_ => {
          this.isLoading = false
        })
    },

    deletePermission(data) {
      this.isLoading = true
      deletePermission(data)
        .then(response => {
          if (response.isSuccess) {
            this.$emit(emit.dmlFinished, response.data)
          }
        })
        .catch(err => {
          throw err
        })
        .finally(_ => {
          this.isLoading = false
        })
    }
  }
}
</script>
