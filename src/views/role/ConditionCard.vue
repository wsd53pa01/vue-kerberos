<template>
  <el-card>
    <div slot="header">
      {{ title }}
      <el-button
        type="primary"
        size="mini"
        class="condition-button"
        @click="change"
      >
        {{ conditionList[index] }}
      </el-button>
    </div>
    <div class="card-content">
      <el-input
        placeholder="搜尋"
        v-model="filterText"
        prefix-icon="el-icon-search"
      />

      <el-button @click="createClick">
        <i class="el-icon-plus" />
      </el-button>

      <el-button v-if="state == 'create'" class="input-button">
        <el-input
          ref="createInput"
          v-model="value"
          @blur="state = ''"
          @keyup.enter.native="handleInputChange({ name: value })"
        />
      </el-button>

      <el-button
        v-for="item in items"
        :key="item.id"
        :class="{ 'input-button': item.isEditable }"
        :type="item.isActive && item.isEditable == false ? 'primary' : 'default'"
        @click="itemClick(item)"
        @mouseover.native="item.isHover = true"
        @mouseleave.native="item.isHover = false"
      >
        <span v-if="item.isEditable == false">
          {{ item.name }}
        </span>

        <el-input
          v-show="item.isEditable"
          :ref="'input' + item.id"
          v-model="value"
          @blur="item.isEditable = false"
          @keyup.enter.native="handleInputChange({ id: item.id, name: value })"
        />
        <i
          v-if="item.isHover && item.isEditable == false"
          class="el-icon-edit"
          @click="updateClick(item)"
        />
        <i
          v-if="item.isHover && item.isEditable == false"
          class="el-icon-delete"
          @click="deleteClick(item)"
        />
      </el-button>
    </div>
  </el-card>
</template>

<script>
export default {
  name: 'ConditionCard',
  props: {
    conditionList: {
      type: Array,
      required: true
    },
    data: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      title: this.conditionList[0],
      index: 1,
      filterText: '',
      state: '',
      value: '',
      items: [],
    }
  },
  watch: {
    data(newValue, oldValue) {
      this.setItemList(newValue)
    },
    filterText(newValue, oldValue) {
      let data = this.data.filter(x => x.name.indexOf(newValue) !== -1)
      this.setItemList(data)
    }
  },
  methods: {
    // change button click's event and emit change event to the parent component
    change() {
      this.title = this.conditionList[this.index]
      let maxIndex = this.conditionList.length - 1
      if (this.index == maxIndex) {
        this.index = 0
      } else {
        this.index += 1
      }
      this.$emit('change', this.title)
    },

    /**
     * 設定 Condition Card 的 Item List
     * @param {[{ id: String|Number, name: String }]} 要列出 Item List 的資料
     */
    setItemList(data) {
      this.items = []
      if (data.length != 0) {
        data.forEach(item => {
          let defaultKey = { isActive: false, isHover: false, isEditable: false }
          this.items.push(
            Object.assign(defaultKey,item)
          )
        })
        if (this.items.length != 0)
          this.items[0].isActive = true
      }
    },
    /**
     * 當 item 點擊時，將 item 變成 focus 的 style，並且觸發 itemClick 事件。
     * @param {{ id: (Number|String), name: String, isActive: Boolean, isHover: false, isEditable: false}=} item
     */
    itemClick(item) {
      this.items.forEach(x => {
        x.isActive = false
      })
      item.isActive = true
      this.$emit('itemClick', item.id)
    },
    createClick() {
      this.state = 'create'
      this.value = ''
      this.$nextTick(() => {
        this.$refs.createInput.select()
      })
    },
    updateClick(item) {
      this.state = 'update'
      item.isEditable = true
      this.value = item.name
      this.$nextTick(() => {
        this.$refs['input' + item.id][0].select()
      })
    },
    deleteClick(item) {
      this.$confirm(
        '是否刪除該資料？相關資料會一併被刪除',
        '警告',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
      .then(e => {
        if (e == 'confirm') {
          this.$emit('delete', item.id)
        }
      })
      .catch(_ => {});
    },
    handleInputChange(item) {
      switch(this.state) {
        case 'create':
          this.$emit('create', item.name)
          break
        case 'update':
          this.$emit('update', item)
          break
      }
      this.state = ''
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
}

.el-card::v-deep > .el-card__body {
  overflow: auto;
  height: calc(100% - 55px);
}

.app-container {
  height: calc(100vh - 50px);
}

.condition-button {
  margin-top: -5px;
  float: right;
}

.card-content .el-button {
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  width: 100%;
  margin-left: 0;
}

.card-content .el-button::v-deep > span {
  width: 100%;
  display: block;
  position: relative;
  padding: 0.4rem;
}

.input-button:hover {
  background-color: white;
}

.el-icon-edit {
  display: inline-block;
  right: 19px;
  position: absolute;
}

.el-icon-delete {
  display: inline-block;
  right: 0;
  position: absolute;
}

.input-button.el-input::v-deep .el-input__inner {
  text-align: center;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}
</style>
