<template>
  <el-card>
    <el-form ref="form" :label-position="'top'" :model="actionDetail">
      <el-form-item label="父節點名稱">
        <el-select
          v-model="actionDetail.parentCode"
          class="full-width"
          placeholder="請選擇"
        >
          <el-option
            v-for="parentCode in parentCodes"
            :key="parentCode"
            :value="parentCode"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="選單名稱">
        <el-input v-model="actionDetail.menuName" />
      </el-form-item>
      <el-form-item label="選單代碼">
        <el-input v-model="actionDetail.menuCode" disabled />
      </el-form-item>
      <el-form-item label="Icon">
        <el-input v-model="actionDetail.icon" />
      </el-form-item>
      <el-form-item label="功能連結">
        <el-input v-model="actionDetail.href" />
      </el-form-item>
      <el-form-item
        label="排序編號"
        prop="sortNumber"
        :rules="[
          { required: true, message: '排序編號為必填' },
          { type: 'number', message: '排序編號須為數字' },
        ]"
      >
        <el-input v-model.number="actionDetail.sortNumber" type="sortNumber" />
      </el-form-item>
      <el-form-item label="temp">
        <span slot="label"
          >操作功能
          <el-button
            type="primary"
            size="mini"
            :disabled="isPermissionDisabled"
            @click="isPermissionVisible = true"
          >
            管理操作功能
          </el-button>
        </span>
        <el-checkbox-group v-model="operationFlags">
          <el-checkbox
            v-for="permission in permissions"
            :key="permission.id"
            :label="permission.operationFlag"
            :disabled="isSubmitDisabled"
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
  </el-card>
</template>

<script>
export default {}
</script>