<template>
  <el-row :gutter="20">
    <el-col :span="12">
      <el-card class="box-card action-card">
        <action :applicationId="applicationId" @emitActionDetail="getActionDetail"></action>
        <!-- <div slot="header">功能列表</div>
        <el-row :gutter="20">
          <el-col :span="12">
            <el-input
              placeholder="搜尋"
              prefix-icon="el-icon-search"
            />
          </el-col>
          <el-button type="success" icon="el-icon-s-order" circle :disabled="isCopyDisabled" />
        </el-row>
        <el-row>
          <el-col>
            <el-tree
              ref="tree"
              :data="data"
              show-checkbox
              node-key="id"
              default-expand-all
              highlight-current
              :expand-on-click-node="false"
              @check-change="onNodeChecked"
              @node-click="onNodeClicked"
            >
              <span slot-scope="{ node, data }" class="custom-tree-node">
                <span>{{ node.label }}</span>
                <span>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => append(data)"
                  >
                    新增
                  </el-button>
                  <el-button
                    type="text"
                    size="mini"
                    @click="() => remove(node, data)"
                  >
                    刪除
                  </el-button>
                </span>
              </span>
            </el-tree>
          </el-col>
        </el-row> -->
      </el-card>
    </el-col>
    <el-col :span="12">
      <el-card class="box-card action-card">
        <action-detail
          :application-id="applicationId"
          :action-detail="actionDetail"
        ></action-detail>
      </el-card>
    </el-col>
  </el-row>
</template>

<script>
import { getActions } from '@/api/actions'
import { getPermissions } from '@/api/permissions'
import { operationFlagDecode } from '@/utils/operationFlag';
import Action from '@/components/Action';
import ActionDetail from '@/components/ActionDetail';

let id = 0
export default {
  components: { Action, ActionDetail },
  props: ['applicationId'],
  data() {
    return {
      data: [],
      isCopyDisabled: true,
      isSubmitDisabled: true,
      actionDetail: {},
      permissions: [],
      operationFlags: []
    }
  },
  watch: {
    applicationId: function(newVal, oldVal) {
      this.applicationId = newVal
    }
  },
  methods: {
    getActionDetail(actionDetail) {
      this.actionDetail = actionDetail
      this.operationFlags = operationFlagDecode(this.permissions.map(x => x.permission), this.actionDetail.operationFlag)
      // TODO: 建立操作功能，並把operationFlag餵上去
    },
  }
}
</script>

<style lang="scss">
.el-button:hover {
  color: #45a1ff;
}

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}

.custom-tree-node {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 14px;
  padding-right: 8px;
}

.action-card {
  overflow-y: scroll;
  height: calc(100vh - 50px);
}

.full-width {
  width: 100%;
}
</style>
