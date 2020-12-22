<template>
  <el-card ref="card">
    <div slot="header">
      {{ title }}
    </div>
    <div class="card-content">
      <el-input placeholder="搜尋" prefix-icon="el-icon-search" />

      <el-table
        ref="table"
        class="table"
        :data="data"
        style="width: 100%"
        max-height="100%"
        border
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" :min-width="20"> </el-table-column>
        <el-table-column
          v-for="(column, index) in columns"
          :key="index"
          :prop="column.prop"
          :label="column.label"
        >
        </el-table-column>
      </el-table>
    </div>
    <div class="card-footer">
      <el-button class="restore" :disabled="disabled" @click="restore"
        >復原</el-button
      >
      <el-button
        type="primary"
        class="submit"
        :disabled="disabled"
        @click="submit"
        >送出</el-button
      >
    </div>
  </el-card>
</template>

<script>
export default {
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
  watch: {
    data() {
      this.restore()
    }
  },
  data() {
    return {
      selectionItems: [],
      disabled: true
    }
  },
  computed: {
    checkedColumn() {
      return this.data.filter(x => x.status == 2)
    }
  },
  methods: {
    handleSelectionChange(val) {
      this.disabled = false
      this.selectionItems = val
    },

    submit() {
      this.$emit('getSelected', this.selectionItems)
      this.disabled = true
    },

    restore() {
      this.$nextTick(() => {
        this.$refs.table.clearSelection()
        this.checkedColumn.forEach(row => {
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

