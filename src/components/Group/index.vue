<template>
  <Transfer
    :left="left"
    :right="right"
    ref="transfer"
    right-create-root-visible
    @addClick="addClick"
    @rightCreateRoot="rightCreateRoot"
    @rightUpdateNode="rightUpdateNode"
    @rightDeleteNode="rightDelete"
  >
  </Transfer>
</template>

<script>
import Transfer from '@/components/Transfer'
import emitter from '@/utils/emitter.js'
import { getAd, createGroup, updateGroup } from '@/api/group'
import { tree, assign, deleteGroupUser } from '@/api/group-user'
import { convertTreeData, formatNode } from '@/utils/tree'
import notify from '@/utils/notify'

export default {
  name: 'Group',
  components: {
    Transfer,
  },
  /**
   * @param
   */
  data() {
    return {
      left: {
        title: 'AD 群組',
        data: [],
      },
      right: {
        title: '群組',
        data: [],
      },
    }
  },
  computed: {
    active: {
      get() {
        return this.$store.state.process.active
      },
      set(val) {
        this.$store.dispatch('process/setActive', val)
      }
    },
    applicationId: {
      get() {
        return this.$store.state.application.id
      },
    }
  },
  watch: {
    applicationId() {
      this.fetchRightTree()
    }
  },
  created() {
    emitter.$on('next', () => { this.active += 1 })
    emitter.$on('previous', () => { this.active -= 1 })
    this.fetchLeftTree()
    this.fetchRightTree()
  },
  beforeCreate() {
    emitter.$offAll(['next', 'previous'])
  },
  methods: {
    // 抓取 AD 群組（左樹）的資料
    fetchLeftTree() {
      getAd()
        .then((response) => {
          if (response.isSuccess) {
            console.log(response)
            this.left.data = convertTreeData(response.data)
            console.log(this.left.data)
          }
        })
    },
    // 右樹的新增事件
    rightCreateRoot(node) {
      let postData = { applicationId: this.applicationId, name: node.data.label }
      console.log(postData)
      createGroup(postData).then((response) => {
        console.log(response)
        if (response.isSuccess) {
          let data = {
            checked: false,
            children: [],
            data_id: response.data.id,
            id: `g_${response.data.id}`,
            label: response.data.name,
            tag: 'group',
            deleteVisible: true,
            updateVisible: true
          }
          console.log(data)
          this.right.data.push(data)
          notify.success('新增成功')
        }
      })
    },
    // 右樹的刪除節點事件
    rightDelete(node) {
      let data = {
        tag: node.data.tag,
        id: node.data.id,
        data_id: node.data.data_id
      }
      deleteGroupUser(data).then((response) => {
        if (response.isSuccess) {
          this.$notify({
            title: '成功',
            message: '刪除成功',
            type: 'success',
            duration: 2000
          })
        }
      })
    },
    // 右樹的更新節點事件
    rightUpdateNode(node) {
      let data = node.data
      switch(true) {
        case data.tag == 'user':
          break;
        case data.tag == 'group':
          updateGroup({id: data.data_id, name: data.label})
          .then(response => {
            if (response.isSuccess) {
              notify.success('更新成功')
            }
          })
          break;
      }
    },
    // 取得右樹的資料
    fetchRightTree() {
      tree(this.applicationId)
        .then((response) => {
          response.data.forEach(data => {
            switch(true) {
              case data.tag == 'group':
                data.deleteVisible = true
                data.updateVisible = true
                break;
              case data.tag == 'user':
                data.deleteVisible = true
                break;
            }
          })
          this.right.data = convertTreeData(response.data)
        })
    },
    /**
     * 加入按鈕的事件。
     * 如果直接使用 fetchRightTree 會導致 Tree 被收起來
     */
    addClick(data) {
      let usersId = data.left.map(x => x.id);
      let groupsId = data.right.filter(x => x.tag != 'user').map(x => x.data_id)
      let requestData = { groupsId, usersId }
      assign(requestData).then((response) => {
        if (response.isSuccess) {
          this.fetchRightTree()
          notify.success('新增成功')
        }
      })
    },
  }
}
</script>

<style lang="scss" scoped>
.title {
  text-align: center;
  font-size: x-large;
  margin-top: 30px;
}
</style>
