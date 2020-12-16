
<template>
  <div class="context-container">
    <Table
      :title="'權限範本'"
      :fields="[{
        prop: 'id',
        label: '代碼',
        width: '180',
        dialog: {
          show: false,
        },
        filter: {
          show: true,
        }
      }, {
        prop: 'name',
        label: '範本名稱',
        dialog: {
          show: true,
          type: 'text',
        },
        filter: {
          show: true,
        }
      }]"
      dialogWidth='400px'
      :tableData="tableData"
      :fetchData="fetchData"
      :createOption="createOption"
      :deleteOption="deleteOption"
      :updateOption="updateOption"
      :loading="loading"
    >
    </Table>
  </div>
</template>

<script>
import {
  getPermissionTemplate,
  createPermissionTemplate,
  updatePermissionTemplate,
  deletePermissionTemplate
} from '@/api/permission-template'
import Table from '@/components/Table'

export default {
  name: 'PermissionTemplateSetting',
  components: {
    Table
  },
  data() {
    const validateOrganizationName =  (rule, value, callback) => {
      if(value == '') {
        callback(new Error('請選擇組織名稱'))
      } else {
        callback()
      }
    }
    return {
      tableData: {},
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
        event: this.updateEvent,
      },
      loading: false
    }
  },
  methods: {
    fetchData(query) {
      this.loading = true
      getPermissionTemplate(query).then((response) => {
        setTimeout(() => {
          this.loading = false,
          this.tableData = response.data
        }, 1000)
      })
    },
    createEvent(data) {
      this.loading = true
      createPermissionTemplate(data).then((response) => {
        let specifyData = this.tableData.list.find(item => item.id == response.data[0].i)
        if (specifyData == null)
          this.tableData.list.unshift(response.data[0])
        else
          specifyData.name = data.name
        this.loading = false
      })
    },
    updateEvent(data) {
      this.loading = true
      updatePermissionTemplate(data).then((response) => {
        let findData = this.tableData.list.find(x => x.id == data.id)
        findData.name = data.name
        this.loading = false
      })
    },
    deleteEvent(data) {
      this.loading = true
      deletePermissionTemplate(data).then((response) => {
        this.tableData.list.filter(item => {
          if(item.id == data.id)
            item.name = ''
        })
        this.loading = false
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.context-container {
  display: block;
  position: absolute;
  margin: 50px;
  width: 90%;
  height: auto;
  left: 50%;
  transform: translate(-55%, 0%);
}

.action-icon {
  text-align: center
}
</style>
