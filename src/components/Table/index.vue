<!--
propDialog: {
  width: String, ex: '100px'
  form: Object, ex: { fields: [{ name: 'fields name', data: ['option 1', 'option 2']}]}
}
-->
<template>
  <div class="table-container">
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>{{ title }}</span>
      </div>

      <!-- 搜尋框 -->
      <div v-for="(item, index) in searchBar.fields">
        <el-input
          v-model="item.name"
          :placeholder="item.placeholder"
          @keyup.enter.native="search"
          style="width: 180px;"
        />
        <el-button class="filter-item" type="primary" icon="el-icon-search">
            搜尋
        </el-button>
        <el-button
          :class="{'hidden': create.hidden}"
          type="primary"
          style="margin-bottom: 8px"
          plain
          @click="handleCreate()"
        >
          新增
        </el-button>
      </div>

      <!-- dialog -->
      <el-dialog
        :title="textMap[dialog.status]"
        :visible.sync="dialog.visible"
        append-to-body
        :width="propDialog.width"
      >
        <el-form
          :model="form"
          :ref="form"
          :rules="rules"
        >
          <div v-for="(field, index) in propDialog.form.fields">
            <el-form-item :label="field.label" :prop="field.prop">
              <el-select
                v-model="form[field.prop]"
                filterable
                placeholder="請選擇"
              >
                <el-option
                  v-for="item in field.data"
                  :key="item"
                  :label="item"
                  :value="item">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialog.status==='create' ? handleFormCreate() : updateRow()">確認</el-button>
          <el-button @click="handleCancel()">取消</el-button>
        </div>
      </el-dialog>
    </el-card>
  </div>

</template>

<script>
export default {
  name: 'Table',
  data() {
    return {
      dialog: {
        status: '',
        visible: false,
        rule: '',
        model: '',
        item: [],
      },
      textMap:{
        update: '更新',
        create: '新增'
      },
      form: {},
      rules: {}
    }
  },
  props: {
    title: {
      required: true,
      type: String
    },
    searchBar: {
      fields: {
        required: true,
        type: Array,
      },
    },
    search: {
      type: Function
    },
    create: {
      type: Object,
      validator: (value) => {
        let isValid = true;
        value = Object.assign({
          hidden: false
        }, value)
        return isValid
      }
    },
    propDialog: {
      type: Object,
      default: () => {
        return {
          width: '400px'
        }
      },
      validator: (value) => {
        let isValid = true;
        value = Object.assign({
          width: '400px'
        }, value)
        console.log(value)
        return isValid
      }
    },
  },
  created() {
    this.propDialog.form.fields.forEach((field) => {
      this.form[field.prop] = ''
      if (field.require)
        this.rules[field.prop] = [{
          required: true,
          trigger: 'blur',
          validastor: (rule, value, callback) => {
            if(value == '') {
              callback(new Error('請選擇組織名稱'))
            } else {
              callback()
            }
        }}]
    })

    /*
     { // 組織表單的組織名稱驗證規則
        name: [{ required: true, trigger: 'blur', validator: validateOrganizationName }]
      }
    */
    // this.propDialog.form.fields.forEach((x) => {
    //   this.rules[Object.keys(x)[0]]
    // })

  },
  computed: {
  },
  methods: {
    handleCreate() {
      this.dialog.status = 'create'
      this.dialog.visible = true
    },
    handleCancel() {
      this.dialog.visible = false
    },
    handleFormCreate() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log('success')
        }
      })
    }
  },
}
</script>

<style scoped>
.table-container .hidden {
  display: none;
}
</style>
