<template>
  <Transfer
    :left="left"
    :right="right"
    ref="transfer"
    @addClick="addClick"
    :rightCreateRootVisible="true"
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
import { arrayToNested, addTreeProperty } from '@/utils/treeTable.js'
import { convertTreeData } from '@/utils'

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
        return this.$store.state.process.applicationId
      }
    }
  },
  beforeCreate() {
    emitter.$offAll(['next', 'previous'])
  },
  created() {
    emitter.$on('next', () => { this.active += 1 })
    emitter.$on('previous', () => { this.active -= 1 })
    getAd().then((response) => {
      this.left.data = response.data
    })
    this.fetchRightTree()
  },
  methods: {
    // 右樹的新增事件
    rightCreateRoot(node) {
      let postData = { applicationId: this.applicationId, name: node.data.label }
      createGroup(postData).then((response) => {
        this.right.data.push({
          checked: false,
          children: [],
          data_id: response.data.id,
          id: `g_${response.data.id}`,
          label: response.data.name,
          tag: 'group',
          deleteVisible: true,
          updateVisible: true
        })
      })
    },
    // 右樹的刪除節點事件
    rightDelete(obj) {
      let data = {
        tag: obj.node.data.tag,
        id: obj.node.data.id,
        data_id: obj.node.data.data_id
      }
      deleteGroupUser(data).then((response) => {
        obj.removeNode()
      })
    },
    // 右樹的更新節點事件
    rightUpdateNode(node) {
      let data = node.data
      switch(true) {
        case data.tag == 'user':
          break;
        case data.tag == 'group':
          updateGroup({id: data.data_id, name: data.label}).then(response => {
          })
          break;
      }
    },
    // 取得右樹的資料
    fetchRightTree() {
      tree(this.applicationId).then((response) => {
        response.data.forEach(data => {
          switch(true) {
            case data.tag == "group":
              data.deleteVisible = true
              data.updateVisible = true
              break;
            case data.tag == "user":
              data.deleteVisible = true
              break;
          }
        })
        this.right.data = convertTreeData(response.data)
      })
    },
    // 加入按鈕的事件。
    addClick(data) {
      let usersId = data.left.map(x => x.id);
      let groupsId = data.right.filter(x => x.tag != 'user').map(x => x.data_id)
      let requestData = { groupsId, usersId }
      assign(requestData).then((response) => {
        tree(this.applicationId).then((response) => {
          let data = response.data
          data.forEach(x => {
            switch(true) {
              case x.tag == "group":
                x.deleteVisible = true
                x.updateVisible = true
                break;
              case x.tag == "user":
                x.deleteVisible = true
                break;
            }
          })
          response.data.forEach(d => {
            if (d.tag != 'group')
              return false;
            let groupId = d.data_id
            if (groupsId.includes(groupId)) {
              const index = this.right.data.findIndex(i => i.data_id == groupId)
              let users = []
              response.data
                .filter(u => u.tag == 'user' &&  // filter 調已存在 Group 底下的 User
                  usersId.includes(u.data_id) &&
                  !this.right.data[index].children.map(x => x.data_id).includes(u.data_id))
                .forEach(x => {
                  users.push({
                    checked: false,
                    deleteVisible: true,
                    data_id: x.data_id,
                    id: x.id,
                    label: x.name,
                    tag: 'user',
                  })
                })
              this.right.data[index].children.push(...users)
            }
          })
        })
      })
    }
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
