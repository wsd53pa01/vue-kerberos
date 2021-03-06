<template>
  <el-table :data="dataSource" height="100%">
    <el-table-column min-width="80px" width="100" align="center">
      <template slot-scope="scope">
        <span>{{ scope.row.name }}</span>
      </template>
    </el-table-column>

    <el-table-column
      label="全選"
      :min-width="columnList.length > 4 ? null : 20"
      align="center"
    >
      <template slot-scope="scope">
        <el-checkbox
          v-model="scope.row['checkedAll' + scope.$index]"
          @change="
            scope.$index === 0 ? selectAll() : selectAllOnColumn(scope.$index)
          "
        />
      </template>
    </el-table-column>

    <el-table-column
      v-for="item in columnList"
      :key="item.id"
      :min-width="columnList.length > 4 ? null : 20"
      align="center"
      :label="item.name"
    >
      <template slot-scope="scope">
        <el-checkbox
          :disabled="scope.row.disabled[item.id]"
          v-model="!scope.row.disabled[item.id] && scope.row.checked[item.id]"
          @change="onCheckboxSelect(scope.$index, item.id)"
        />
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
const checkedColumnBaseId = 'checkedAll'
export default {
  /**
   * @param {Array} props.data 必填欄位，checked中的資料會對應head的id，欄位： [{ id: 0, name: Any, checked: Array<Any> }]
   * @param {Array} props.columnList 必填欄位，資料表的標頭，欄位：[{ id: Any, name: Any }]
   */
  props: {
    data: {
      type: Array,
      require: true,
      validator(value) {
        if (value.length === 0) {
          return true
        }
        const keys = Object.keys(value[0])
        const hasId = keys.includes('id')
        const hasName = keys.includes('name')
        const hasChecked = keys.includes('checked')
        return hasId && hasName && hasChecked
      },
      default() {
        return [{ id: 0, name: '', checked: [], disabled: {} }]
      }
    },
    columnList: {
      type: Array,
      require: true,
      validator(value) {
        if (value.length === 0) {
          return true
        }
        const keys = Object.keys(value[0])
        const hasId = keys.includes('id')
        const hasName = keys.includes('name')
        return hasId && hasName
      },
      default() {
        return [{ id: 0, name: '' }]
      }
    }
  },
  data() {
    return {
      dataSource: [{ id: 'selectAllId', name: '全選', checked: [], disabled: {} }]
    }
  },
  computed: {
    headColumnIds() {
      return this.columnList.map(x => x.id)
    }
  },
  watch: {
    /**
     * 生成table資料，在最前面插入一個全選作為全選的欄位
     */
    data(newVal, oldVal) {
      this.dataSource = [
        { id: 'selectAllId', name: '全選', checked: [], disabled: {} },
        ...newVal
      ].map((value, index) => {
        const obj = Object.assign(
          { checked: {}, disabled: {} },
          { id: value.id, name: value.name }
        )
        this.headColumnIds.forEach(headColumnId => {
          obj.checked[headColumnId] = value.checked.includes(headColumnId)
          obj.disabled[headColumnId] = value.disabled[headColumnId]
        })
        obj[checkedColumnBaseId + index] = false
        return obj
      })

      this.checkedAllColumn()
      this.checkedAllRow()
      this.dataSource[0][checkedColumnBaseId + 0] = this.isCheckedAll()
    }
  },
  created() {
  },
  methods: {
    /**
     * 點擊全選checkbox的事件
     */
    selectAll() {
      const isCheckedAll = this.isCheckedAll()
      this.dataSource.forEach((element, index) => {
        element[checkedColumnBaseId + index] = !isCheckedAll
        this.headColumnIds.forEach(headColumnId => {
          element.checked[headColumnId] = !isCheckedAll
        })
      })
      this.returnCheckedData()
    },

    /**
     * 點擊全選列checkbox時，勾選整列checkbox
     */
    selectAllOnColumn(index) {
      const isCheckedAllColumnBox = Object.values(
        this.dataSource[index].checked
      ).every(x => x === true)

      this.headColumnIds.forEach(headColumnId => {
        this.dataSource[index][
          checkedColumnBaseId + index
        ] = !isCheckedAllColumnBox
        this.dataSource[index].checked[headColumnId] = !isCheckedAllColumnBox
      })

      this.dataSource[0][checkedColumnBaseId + 0] = this.isCheckedAll()
      this.checkedAllRow()
      this.returnCheckedData()
    },

    /**
     * 點擊全選行checkbox時，勾選整行checkbox
     */
    selectAllOnRow(headColumnId) {
      const isCheckedAllRowBox = Object.values(
        this.dataSource
          .filter((element, index) => index !== 0)
          .map(element => element.checked[headColumnId])
      ).every(value => value === true)

      this.dataSource.forEach((element, index) => {
        if (index === 0) return
        element.checked[headColumnId] = !isCheckedAllRowBox
      })

      this.checkedAllColumn()
    },

    /**
     * 當checkbox被選擇時，判斷是否要勾起全選checkbox
     */
    onCheckboxSelect(index, headColumnId) {
      if (index === 0) {
        this.selectAllOnRow(headColumnId)
      }

      this.checkedAllColumn()
      this.checkedAllRow()

      this.dataSource[0][checkedColumnBaseId + 0] = this.isCheckedAll()
      this.returnCheckedData()
    },

    /**
     * 判斷所有checkbox是否打勾
     */
    isCheckedAll() {
      let onlyOneRow = this.dataSource.length == 1
      if (onlyOneRow) return false
      const checkedIntegrated = []
      this.dataSource.forEach((element, index) => {
        if (index === 0) return
        const isCheckedColumn = Object.values(element.checked).every(
          x => x === true
        )
        checkedIntegrated.push(isCheckedColumn)
      })

      return checkedIntegrated.every(x => x === true)
    },

    /**
     * 設定列全選checkbox是否打勾
     */
    checkedAllColumn() {
      let onlyOneRow = this.dataSource.length == 1
      if (onlyOneRow) return false
      this.dataSource.forEach((element, index) => {
        element[checkedColumnBaseId + index] = Object.values(
          element.checked
        ).every(x => x === true)
      })
    },

    /**
     * 設定行全選checkbox是否打勾
     */
    checkedAllRow() {
      let onlyOneRow = this.dataSource.length == 1
      if (onlyOneRow) return false
      this.headColumnIds.forEach(headColumnId => {
        const isRowCheckboxChecked = this.dataSource
          .filter((value, index) => index !== 0)
          .map(x => x.checked[headColumnId])
          .every(x => x === true)
        this.dataSource[0].checked[headColumnId] = isRowCheckboxChecked
      })
    },

    /**
     * 回傳選擇的資料，在每次勾選checkbox時回傳
     */
    returnCheckedData() {
      const checkedData = this.dataSource
        .filter((value, index) => {
          return (
            index !== 0
          )
        })
        .map(value => {
          return {
            id: value.id,
            name: value.name,
            checked: this.headColumnIds.filter(
              headColumnId => value.checked[headColumnId] && !value.disabled[headColumnId]
            )
          }
        })
      this.$emit('getCheckedData', checkedData)
    },
  }
}
</script>

<style lang="scss">
.el-table {
  width: 100%;
}
.el-table::before {
}
</style>
