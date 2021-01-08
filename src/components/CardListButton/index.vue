<template>
  <el-card ref="card">
    <div v-if="title != ''" slot="header">{{ title }}</div>
    <el-input
      v-if="searchable"
      v-model="search"
      :class="{
        'search-block': buttonLayout === 'horizontal',
        'search-vertical': buttonLayout === 'vertical',
      }"
      placeholder="搜尋"
      prefix-icon="el-icon-search"
    />

    <el-row class="card-content">
      <el-button
        v-if="hasCreate"
        :class="{
          'el-button-block': buttonLayout === 'horizontal',
          'el-button-vertical': buttonLayout === 'vertical',
        }"
        @click="customCreate ? createItem() : itemCreating()"
      >
        <i class="el-icon-plus" />
      </el-button>

      <el-button
        v-if="onCreate.isCreating"
        :class="{
          'input-button': true,
          'el-button-block': buttonLayout === 'horizontal',
          'el-button-vertical': buttonLayout === 'vertical',
        }"
      >
        <el-input
          ref="createInput"
          v-model="onCreate.value"
          @blur="onCreate.isCreating = false"
          @keyup.enter.native="createItem()"
        />
      </el-button>

      <el-button
        v-for="item in dataSource"
        :key="item.id"
        :type="item.isActive && item.isUpdating == false ? 'primary' : 'default'"
        :class="{
          'el-button-block': buttonLayout === 'horizontal',
          'el-button-vertical': buttonLayout === 'vertical',
        }"
        @click="
          onClick(item)
          setActive(item)
        "
        @mouseover.native="item.isHover = true"
        @mouseleave.native="item.isHover = false"
      >
        <span v-if="item.isUpdating == false">
          {{ item.name }}
        </span>

        <el-input
          v-show="item.isUpdating"
          :ref="'input' + item.id"
          v-model="updateValue"
          @blur="item.isUpdating = false"
          @keyup.enter.native="updateItem(item)"
          @click.stop.native="function(){}"
        />

        <i
          v-if="item.isHover && item.hasUpdate && item.isUpdating == false"
          class="el-icon-edit"
          @click.stop="itemUpdating(item)"
        />
        <i
          v-if="item.isHover && item.hasDelete && item.isUpdating == false"
          class="el-icon-delete"
          @click.stop="deleteItem(item)"
        />
      </el-button>
    </el-row>
  </el-card>
</template>

<script>
const emitEvent = {
  onClick: 'onClick',
  createEvent: 'createEvent',
  updateEvent: 'updateEvent',
  deleteEvent: 'deleteEvent'
}

export default {
  /**
   * @param {String} props.title 卡片的標頭
   * @param {Array} props.data 必填，卡片的資料
   * @param {String} props.buttonLayout 按鈕的布局，可填寫horizontal/vertical，預設為veritcal，填寫horizontal時，button呈現垂直排列；vertical時，button一列四個水平排列
   * @param {Boolean} props.searchable 是否要顯示搜尋框，預設不顯示
   * @param {Boolean} props.hasCreate 是否顯示新增的按鈕，預設不開啟
   * @param {Boolean} props.customCreate 是否自定義新增的樣式，若hasCreate=false，該變數無效
   * @param {Boolean} props.hasUpdate 是否顯示更新的icon，預設不開啟
   * @param {Boolean} props.hasDelete 是否顯示刪除的icon，預設不開啟
   */
  props: {
    title: {
      type: String,
      default() {
        return ''
      }
    },
    data: {
      type: Array,
      require: true,
      validation(value) {
        const obj = Object.keys(value[0])
        const idValidator = obj.findIndex(x => x === 'id')
        const nameValidator = obj.findIndex(x => x === 'name')
        return idValidator > -1 && nameValidator > -1
      },
      default() {
        return [{ id: 0, name: '' }]
      }
    },
    buttonLayout: {
      type: String,
      validator(value) {
        return ['horizontal', 'vertical'].indexOf(value) !== -1
      },
      default() {
        return 'vertical'
      }
    },
    searchable: {
      type: Boolean,
      default() {
        return false
      }
    },
    hasCreate: {
      type: Boolean,
      default() {
        return false
      }
    },
    customCreate: {
      type: Boolean,
      default() {
        return false
      }
    },
    hasUpdate: {
      type: Boolean,
      default() {
        return false
      }
    },
    hasDelete: {
      type: Boolean,
      default() {
        return false
      }
    }
  },
  data() {
    return {
      dataSource: [],
      search: '',
      onCreate: {
        value: '',
        isCreating: false
      },
      updateValue: ''
    }
  },
  watch: {
    data(newVal, oldVal) {
      this.setDataSource()
    },
    search(newVal, oldVal) {
      this.setDataSource()
    }
  },
  created() {
    this.setDataSource()
  },
  methods: {
    setDataSource() {
      this.dataSource = this.data
        .filter(
          x => x.name.toUpperCase().indexOf(this.search.toUpperCase()) > -1
        )
        .map(x => {
          const assignObject = {
            isActive: x.isActive || false,
            isHover: false,
            hasUpdate: this.hasUpdate,
            hasDelete: this.hasDelete,
            isUpdating: false
          }
          return Object.assign(assignObject, x)
        })
    },

    setActive(item) {
      this.dataSource.forEach(element => {
        element.isActive = element.id === item.id
      })
    },

    onClick(item) {
      this.$emit(emitEvent.onClick, item)
    },

    itemCreating() {
      this.onCreate.isCreating = true
      this.value = '新項目'
      this.$nextTick(() => {
        this.$refs.createInput.select()
      })
    },

    itemUpdating(item) {
      item.isUpdating = true
      this.updateValue = item.name
      this.$nextTick(() => {
        this.$refs['input' + item.id][0].select()
      })
    },

    createItem() {
      this.$emit(
        emitEvent.createEvent,
        this.customCreate ? '' : this.onCreate.value
      )
    },

    updateItem(item) {
      const data = item
      data.name = this.updateValue
      this.$emit(emitEvent.updateEvent, data)
      // item.isUpdating = false
    },

    deleteItem(item) {
      this.$confirm('是否刪除該項目？相關資料會一併被刪除', '警告', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$emit(emitEvent.deleteEvent, item)
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search-block {
  margin: 0;
}

.search-vertical {
  margin: 0.4rem;
}

.card-content .el-button-vertical {
  margin: 0.4rem;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 23.5%;
}

.card-content .el-button-block {
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
  padding-top: 20px;
  padding-bottom: 20px;
  width: 100%;
  margin-left: 0;
}

.flex-button {
  width: 100%;
  margin-left: 0;
}
.el-button::v-deep > span {
  width: 100%;
  display: block;
  position: relative;
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

.card-content .el-input::v-deep .el-input__inner {
  text-align: center;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}

.el-card::v-deep .el-card__body {
  height: calc(100% - 55px);
  overflow: auto;
}
</style>
