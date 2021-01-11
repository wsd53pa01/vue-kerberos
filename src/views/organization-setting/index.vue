<template>
  <div class="app-container">
    <Table
      :title="'組織設定'"
      :fields="[{
        prop: 'name',
        label: '組織名稱',
        dialog: {
          show: true,
          data: [{ value: 1, text: '嘉里大榮物流股份有限公司'}, { value: 2, text: 'Organization 5' }],
          type: 'select',
          require: true,
        },
        filter: {
          show: true,
        }
      }]"
      dialog-width="400px"
      :table-data="tableData"
      :fetch-data="getOrganizations"
      :create-option="createOption"
      :delete-option="deleteOption"
      :update-option="updateOption"
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
import Pagination from '@/components/Pagination'
import Table from '@/components/Table'

export default {
  name: 'OraganizationSetting',
  components: {
    Pagination,
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
      tableData: {},
      // TODO: 換成 api 取得組織
      adOrganizations: (() => {
        const prefixString = ''
        const result = []
        for (let i = 0; i <= 10; i++) {
          result.push(prefixString + i)
        }
        return result
      })(),
      createOption: {
        hidden: false,
        event: this.createEvent
      },
      deleteOption: {
        hidden: false,
        event: this.deleteEvent
      },
      updateOption: {
        hidden: false,
        event: this.updateEvent
      },
      loading: false
    }
  },
  methods: {
    getOrganizations(query) {
      this.tableLoading = true
      getOrganization(query).then(response => {
        setTimeout(() => {
          this.tableLoading = false
          this.tableData = response.data
        }, 150)
      })
    },
    createEvent(data) {
      createOrganization(data).then(response => {
        if (response.isSuccess) {
          this.tableData.list.unshift(data)
        }
      })
    },
    updateEvent(data) {
      updateOrganization(data).then((response) => {
        const findData = this.tableData.list.find(x => x.id == data.id)
        findData.name = data.name
      })
    },
    deleteEvent(row, index) {
      deleteOrganization(row.id).then((response) => {
        this.tableData.list.splice(index, 1)
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
