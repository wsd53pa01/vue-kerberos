<template>
  <el-card ref="card">
    <div slot="header">
      {{ title }}
    </div>
    <div class="card-content">
      <el-input
        placeholder="搜尋"
        prefix-icon="el-icon-search"
        v-model="filterText"
      />
      <el-table
        ref="table"
        class="table"
        :data="tableData"
        style="width: 100%"
        max-height="100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :min-width="20" />
        <el-table-column
          v-for="(column, index) in columns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
        />
      </el-table>
    </div>
    <div class="card-footer">
      <el-button
        class="restore"
        :disabled="disabled"
        @click="restoreClick"
      >
        復原
      </el-button>
      <el-button
        type="primary"
        class="submit"
        :disabled="disabled"
        @click="sendClick"
      >
        送出
      </el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'ManageCard',
  /**
   * @param {String} props.title 卡片名稱。
   * @param {Array} props.data 卡片的 row data。
   * @param {Array} props.columns 卡片的欄位。
   */
  props: {
    title: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    columns: {
      type: Array,
      required: true,
      default() {
        return [
          {
            prop: '',
            label: ''
          }
        ]
      }
    }
  },
  data() {
    return {
      filterText: '',
      tableData: [],
      rowSelected: [],
      disabled: true
    }
  },
  watch: {
    /**
     * Parent 改變 data 時，重製 tableData 的資料
     */
    data(newValue, oldValue) {
      this.resetTableData()
    },
    /**
     * 搜尋時，即時過濾資料
     */
    filterText(newValue, oldValue) {
      let data = this.data.filter(x => x.name.indexOf(newValue) !== -1)
      this.tableData = data
    },
    /**
     * tableData 改變時，即時復原勾選狀態
     */
    tableData() {
      this.resetTableCheckbox()
    }
  },
  methods: {
    /**
     * 勾選 checkbox 會觸發這個事件。
     * @param {id: Number, name: String, checked: Boolean} rows 有被勾選的 row
     */
    handleSelectionChange(rows) {
      this.disabled = false
      this.rowSelected = rows
    },
    /**
     * 送出按鈕的 click 事件。
     * 會發送 sendClick 事件，將 rowSelected 發送出去。
     */
    sendClick() {
      this.disabled = true
      this.tableData.forEach( data => data.checked = false)
      this.rowSelected.forEach( row => row.checked = true)
      this.$emit('sendClick', this.tableData)
    },
    // 復原按鈕的事件，點擊時，會重製 table data 和 checkbox。
    restoreClick() {
      this.resetTableData()
      this.resetTableCheckbox()
    },
    // 重製 table 的 data。
    resetTableData() {
      this.tableData = this.data
    },
    // 重製 table 的 checkbox。
    resetTableCheckbox() {
      this.$nextTick(() => {
        this.$refs.table.clearSelection()
        this.tableData
          .filter(x => x.checked)
          .forEach(row => {
            this.$refs.table.toggleRowSelection(row)
          })
        this.disabled = true
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-row {
  height: 100%;
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  height: 100%;
  border-radius: 4px;
}

.el-card {
  height: 100%;
  overflow: auto;
}

.app-container {
  height: calc(100vh - 50px);
}

.condition-button {
  margin-top: -5px;
  float: right;
}

.item-button {
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  width: 100%;
  margin-left: 0;
}

.table {
  margin-top: 5px;
}

.el-card::v-deep > .el-card__body {
  height: calc(100% - 55px);
  position: relative;
}

.card-footer {
  position: absolute;
  width: calc(100% - 40px);
  bottom: 20px;
  padding: 0;
}

.restore {
  right: 90px;
  bottom: 0;
  position: absolute;
}

.submit {
  right: 0;
  bottom: 0;
  position: absolute;
}
</style>

