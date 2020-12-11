<template>
  <div>
    <div class="title">功能設定</div>
    <div class="content">
      <el-form ref="form" :label-position="'top'" :model="form">
        <el-form-item label="父節點名稱">
          <el-select v-model="form.parentCode" class="full-width" placeholder="請選擇">
            <el-option label="Zone one" value="shanghai" />
            <el-option label="Zone two" value="beijing" />
          </el-select>
        </el-form-item>
        <el-form-item label="選單名稱">
          <el-input v-model="form.menuName" />
        </el-form-item>
        <el-form-item label="選單代碼">
          <el-input v-model="form.menuCode" disabled />
        </el-form-item>
        <el-form-item label="Icon">
          <el-input v-model="form.icon" />
        </el-form-item>
        <el-form-item label="功能連結">
          <el-input v-model="form.href" />
        </el-form-item>
        <el-form-item
          label="排序編號"
          prop="sortNumber"
          :rules="[
            { required: true, message: '排序編號為必填'},
            { type: 'number', message: '排序編號須為數字'}
          ]"
        >
          <el-input v-model.number="form.sortNumber" type="sortNumber" />
        </el-form-item>
        <el-form-item label="操作功能">
          <el-checkbox-group v-model="operationFlags">
            <el-checkbox
              v-for="permission in permissions"
              :key="permission.permission"
              :label="permission.permission"
            >
              {{ permission.name }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>

        <el-form-item>
          <el-button
            :disabled="isSubmitDisabled"
            class="full-width"
            type="primary"
            @click="submitForm"
          >
            送出
          </el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { getPermissions } from '@/api/permissions'
import { operationFlagDecode } from '@/utils/operationFlag'

const defaultForm = {
  applicationId: 0,
  href: '',
  icon: '',
  id: 0,
  menuCode: '',
  menuName: '',
  operationFlag: 0,
  parentCode: '',
  sortNumber: 0
}
export default {
  props: ['applicationId', 'parentCode', 'actionDetail'],
  data() {
    return {
      form: {},
      isSubmitDisabled: true,
      permissions: [],
      operationFlags: []
    }
  },
  watch: {
    applicationId: function(newVal, oldVal) {
      this.init(newVal)
    },
    actionDetail: function(newVal, oldVal) {
      this.form = newVal
      this.isSubmitDisabled = false
      this.operationFlags = operationFlagDecode(this.permissions.map(x => x.permission), this.form.operationFlag)
    }
  },
  created() {
    this.init(this.applicationId)
  },
  methods: {
    init(applicationId) {
      this.getPermissions(applicationId)
      this.form = Object.assign({}, defaultForm)
      this.isSubmitDisabled = true
    },

    getPermissions(applicationId) {
      getPermissions(applicationId).then(result => {
        if (result.isSuccess) {
          this.permissions = result.data.permissions
        }
      }).catch(err => {
        throw (err)
      })
    },

    submitForm() {
      this.form.operationFlag = this.operationFlags.reduce((prev, curr) => prev + curr, 0)
      this.isSubmitDisabled = true
      console.log(this.form)
    }
  }
}
</script>

<style lang="scss">
.title {
    padding-bottom: 20px;
    border-bottom: 1px solid #EBEEF5;;
}

.content {
    padding-top: 20px;
}

.full-width {
  width: 100%;
}
</style>
