<template>
  <el-card>
    <div slot="header">
      {{ title }}
      <el-button
        type="primary"
        size="mini"
        class="condition-button"
        @click="onConditionChange()"
      >
        {{ conditionButton }}
      </el-button>
    </div>
    <div class="card-content">
      <el-input placeholder="搜尋" prefix-icon="el-icon-search" />

      <el-button @click="onItemCreate()">
        <i class="el-icon-plus" />
      </el-button>

      <el-button v-if="isCreating" class="input-button">
        <el-input
          ref="createInput"
          v-model="value"
          @blur="isCreating = false"
          @keyup.enter.native="handleBlur({ name: value })"
        />
      </el-button>

      <el-button
        v-for="item in items"
        :key="item.id"
        :class="{ 'input-button': item.editable }"
        :type="item.isActive && item.editable == false ? 'primary' : 'default'"
        @click="onItemClick(item)"
        @mouseover.native="item.isHover = true"
        @mouseleave.native="item.isHover = false"
      >
        <span v-if="item.editable == false">
          {{ item.name }}
        </span>

        <el-input
          v-show="item.editable"
          :ref="'input' + item.id"
          v-model="value"
          @blur="item.editable = false"
          @keyup.enter.native="handleBlur({ id: item.id, name: value })"
        />

        <i
          v-if="item.isHover && item.editable == false"
          class="el-icon-edit"
          @click="onItemUpdate(item)"
        />
        <i
          v-if="item.isHover && item.editable == false"
          class="el-icon-delete"
          @click="onItemDelete(item)"
        />
      </el-button>
    </div>
  </el-card>
</template>

<script>
const emitEvent = {
  getItemId: 'getItemId',
  blurFinish: 'blurFinish',
  conditionChange: 'conditionChange'
}

export default {
  props: {
    title: {
      type: String,
      required: true
    },
    conditionButton: {
      type: String,
      required: true
    },
    data: {
      type: Array,
      required: true
    },
    event: {
      type: Object,
      required: true,
      default() {
        return {
          create: function() {},
          update: function() {},
          delete: function() {}
        }
      }
    }
  },
  data() {
    return {
      isByRole: true,
      selectingId: false,
      value: '',
      isCreating: false,
      items: [],
      blurEvent: function() {}
    }
  },
  watch: {
    data() {
      this.items = []
      this.data.forEach(x => {
        const selectingId = (this.isByRole ? 'role' : 'group') + x.id
        this.items.push(
          Object.assign(
            {
              selectingId: selectingId,
              isActive: selectingId == this.selectingId,
              isHover: false,
              editable: false
            },
            x
          )
        )
      })
    }
  },
  methods: {
    onConditionChange() {
      this.isByRole = !this.isByRole
      this.$emit(emitEvent.conditionChange, this.isByRole)
    },

    onItemClick(item) {
      this.selectingId = item.selectingId
      this.items.forEach(x => {
        x.isActive = x.selectingId == this.selectingId
      })
      this.$emit(emitEvent.getItemId, item.id)
    },

    onItemCreate() {
      this.isCreating = true
      this.value = '新' + this.title

      this.$nextTick(() => {
        this.$refs.createInput.select()
      })
    },

    onItemUpdate(item) {
      item.editable = true
      this.value = item.name

      this.$nextTick(() => {
        this.$refs['input' + item.id][0].select()
      })
    },

    onItemDelete(item) {
      this.$confirm(
        '是否刪除該角色？相關資料會一併被刪除',
        '警告',
        {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          this.event.delete(item)
            .then(result => {
              this.$emit(emitEvent.blurFinish, result)
            })
            .catch(err => {
              throw err
            })
        })
    },

    handleBlur(item) {
      this.blurEvent = this.isCreating ? this.event.create : this.event.update
      const data = Object.assign({ applicationId: this.$store.state.application.id }, item)
      this.blurEvent(data)
        .then(result => {
          this.isCreating = false
          this.items.forEach(x => {
            x.editable = false
          })
          this.$emit(emitEvent.blurFinish, result)
        })
        .catch(err => {
          throw err
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

.card-content .el-button {
  margin-top: 0.4rem;
  margin-bottom: 0.4rem;
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

.el-input::v-deep .el-input__inner {
  text-align: center;
  border-top: 0;
  border-left: 0;
  border-right: 0;
}
</style>
