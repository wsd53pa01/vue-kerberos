<template>
  <el-card>
    <el-form ref="form" :label-position="'top'" :model="data">
      <el-form-item label="父節點名稱">
        <el-select
          v-model="data.parentCode"
          class="full-width"
          placeholder="請選擇"
        >
          <el-option
            v-for="parentCode in parentCodes"
            :key="parentCode.id"
            :value="parentCode.id"
            :label="parentCode.name"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="選單名稱">
        <el-input v-model="data.menuName" />
      </el-form-item>
      <el-form-item label="選單代碼">
        <el-input v-model="data.menuCode" disabled />
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
            :disabled="managePermissionDisabled"
            @click="isPermissionVisible = true"
          >
            管理操作功能
          </el-button>
        </span>
        <el-checkbox-group v-model="checkedPermission">
          <el-checkbox
            v-for="permission in permissions"
            :key="permission.id"
            :disabled="submitDisabled"
            :label="permission.operationFlag"
          >
            {{ permission.name }}
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
  </el-card>
</template>

<script>
import { getAction, updateAction } from '@/api/action'
import { getPermission } from '@/api/permission'
import { operationFlagDecode } from '@/utils/operationFlag'

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
      permissions: [],
      managePermissionDisabled: true,
      submitDisabled: true,
      checkedPermission: [],
      parentCodes: []
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
      this.getParentCode()
      const operationFlags = this.permissions.map(value => value.operationFlag)
      this.checkedPermission = operationFlagDecode(
        operationFlags,
        this.data.operationFlag
      )
    }
  },
  created() {
    this.renderPage()
  },
  methods: {
    async renderPage() {
      await this.getPermission()
      this.managePermissionDisabled = false
      this.submitDisabled = true
    },

    getParentCode() {
      getAction({ applicationId: this.applicationId })
        .then(response => {
          if (response.isSuccess) {
            const parentCode = response.data
              .filter(action => action.menuCode !== this.data.menuCode)
              .map(action => {
                return { id: action.menuCode, name: action.menuName }
              })
            this.parentCodes = [{ id: null, name: '#' }, ...parentCode]
          }
        })
        .catch(err => {
          throw err
        })
    },

    getPermission() {
      getPermission({ applicationId: this.applicationId })
        .then(response => {
          this.permissions = response.isSuccess ? response.data : []
        })
        .catch(err => {
          throw err
        })
    },

    submit() {
      this.data.operationFlag = this.checkedPermission.reduce(
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
    }
  }
}
</script>
