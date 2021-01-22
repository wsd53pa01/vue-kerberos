<template>
  <el-card>
    <el-form ref="form" :label-position="'top'" :model="data">
      <el-form-item label="選單名稱">
        <el-input v-model="data.menuName" />
      </el-form-item>
      <el-form-item label="選單代碼">
        <el-input v-model="data.menuCode" disabled>
          <i
            class="el-icon-s-order el-input__icon menu-code-icon"
            slot="suffix"
            @click="handleIconClick(data.menuCode, $event)"
          />
        </el-input>
      </el-form-item>
      <el-form-item label="Icon">
        <el-input v-model="data.icon" />
      </el-form-item>
      <el-form-item label="功能連結">
        <el-input v-model="data.href" />
      </el-form-item>
      <el-form-item
        label="排序編號"
        prop="sortNumber"
        :rules="[
          { required: true, message: '排序編號為必填' },
          { type: 'number', message: '排序編號須為數字' },
        ]"
      >
        <el-input v-model.number="data.sortNumber" type="sortNumber" />
      </el-form-item>
      <el-form-item label="temp">
        <span slot="label"
          >操作功能
          <el-button
            type="primary"
            size="mini"
            :disabled="operationManageDisabled"
            @click="operationVisible = true"
          >
            操作功能管理
          </el-button>
        </span>
        <el-checkbox-group v-model="checkOperation">
          <el-checkbox
            v-for="operation in operations"
            :key="operation.id"
            :disabled="submitDisabled"
            :label="operation.flag"
          >
            {{ operation.name }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <el-form-item>
        <el-button
          :disabled="submitDisabled"
          class="full-width"
          type="primary"
          @click="submit"
        >
          送出
        </el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="操作功能管理" :visible.sync="operationVisible">
      <Operation>
      </Operation>
    </el-dialog>
  </el-card>
</template>

<script>
import { updateAction } from '@/api/action'
import { getOperation } from '@/api/operation'
import { operationFlagDecode } from '@/utils/operationFlag'
import clip from '@/utils/clipboard' // use clipboard directly
import Operation from './Operation'
import emitter from '@/utils/emitter.js'

const defaultDetail = {
  parentCode: '',
  menuName: '',
  menuCode: '',
  icon: '',
  href: '',
  sortNumber: 0,
  operationFlags: 0
}

export default {
  components: {
    Operation
  },
  /**
   * @param {Object} props.data
   */
  props: {
    data: {
      type: Object,
      default() {
        return defaultDetail
      }
    }
  },
  data() {
    return {
      operations: [],
      operationManageDisabled: true,
      submitDisabled: true,
      checkOperation: [],
      operationVisible: false
    }
  },
  computed: {
    applicationId() {
      return this.$store.state.application.id
    }
  },
  watch: {
    applicationId: function(newVal, oldVal) {
      this.renderPage()
    },
    data: function(newVal, oldVal) {
      this.submitDisabled = false
      const operationFlags = this.operations.map(value => value.flag)
      this.checkOperation = operationFlagDecode(
        operationFlags,
        this.data.operationFlag
      )
    }
  },
  created() {
    this.renderPage()
    emitter.$on('operationChange', this.fetchOperation)
  },

  destroyed() {
    emitter.$offAll(['operationChange'])
  },

  methods: {
    async renderPage() {
      await this.fetchOperation()
      this.operationManageDisabled = false
      this.submitDisabled = true
    },

    // 抓取操作功能資料
    fetchOperation() {
      getOperation({ applicationId: this.applicationId })
        .then(response => {
          this.operations = response.isSuccess ? response.data : []
        })
        .catch(err => {
          throw err
        })
    },

    submit() {
      this.data.operationFlag = this.checkOperation.reduce(
        (prev, curr) => prev + curr,
        0
      )
      updateAction(this.data)
        .then(response => {
          if (response.isSuccess) {
            this.success(response.message)
            this.submitDisabled = true
          }
        })
        .catch(err => {
          throw err
        })
    },

    success(message) {
      this.$notify({
        title: 'Success',
        message: message,
        type: 'success'
      })
    },

    handleIconClick(text, event) {
      clip(text, event)
    }
  }
}
</script>

<style lang="scss">
  .menu-code-icon {
    cursor: copy !important;
    color: black;
  }
  .menu-code-icon:hover {
    color: #304156;
  }
</style>
