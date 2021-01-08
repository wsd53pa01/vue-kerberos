<template>
  <Transfer
    :left="left"
    :right="right"
    @addClick="addClick"
    :rightCreateRootVisible="true"
    @rightCreateRoot="rightCreateRoot"
    @rightUpdateNode="rightUpdateNode"
    @rightDeleteNode="rightDeleteNode"
  >
  </Transfer>
</template>

<script>
import Transfer from '@/components/Transfer'
import { getGroup } from '@/api/group'
import { createRole, deleteRole, updateRole } from '@/api/role'
import { tree, assign, deleteRoleGroup } from '@/api/role-group'
import { convertTreeData } from '@/utils'


export default {
  name: 'Role',
  components: {
    Transfer
  },
  data() {
    return {
      left: {
        title: '群組',
        data: [],
      },
      right: {
        title: '角色',
        data: [],
      }
    }
  },
  computed: {
    applicationId: {
      get() {
        return this.$store.state.process.applicationId
      }
    }
  },
  created() {
    this.fetchLeftTree()
    this.fetchRightTree()
  },
  methods: {
    // 取得左樹的群組資料
    fetchLeftTree() {
      getGroup(this.applicationId).then(response => {
        this.left.data = convertTreeData(response.data)
      })
    },
    // 取得右樹的角色資料
    fetchRightTree(){
      tree(this.applicationId).then((response) => {
        response.data.forEach(data => {
          switch(true) {
            case data.tag == "role":
              data.deleteVisible = true
              data.updateVisible = true
              break;
            case data.tag == "group":
              data.deleteVisible = true
              break;
          }
        })
        this.right.data = convertTreeData(response.data)
      })
    },
    // 右樹的刪除事件，新增角色
    rightCreateRoot(node) {
      let data = {
        applicationId: this.applicationId,
        name: node.label
      }
      createRole(data).then(response => {
        if (response.isSuccess) {
          let data = response.data
          this.right.data.push({
            checked: false,
            children: [],
            id: data.id,
            data_id: data.id,
            label: data.name,
            tag: 'role',
            deleteVisible: true,
            updateVisible: true
          })
        }
      })
    },
    // 右樹的刪除節點事件，刪除角色
    rightDeleteNode(obj) {
      let data = {
        tag: obj.node.data.tag,
        id: obj.node.data.id,
        data_id: obj.node.data.data_id
      }
      deleteRoleGroup(data).then(response => {
        if (response.isSuccess)
          obj.removeNode()
      })
    },
    // 右樹的更新節點事件，更新角色
    rightUpdateNode(node) {
      let data = {
        id: node.data.id,
        name: node.data.label
      }
      updateRole(data).then(response => {
      })
    },
    // 加入按鈕的事件
    addClick(data) {
      let groupsId = data.left.map(x => x.id)
      let rolesId = data.right.filter(x => x.tag == 'role').map(x => x.data_id)
      let requestData = { groupsId, rolesId }
      assign(requestData).then((response) => {
        tree(this.applicationId).then((response) => {
          let data = response.data
          data.forEach(x => {
            switch(true) {
              case x.tag == 'role':
                x.deleteVisible = true
                x.updateVisible = true
                break;
              case x.tag == 'group':
                x.deleteVisible = true
                break;
            }
          })
          response.data.forEach(d => {
            if (d.tag != 'role')
              return false;
            let roleId = d.data_id
            if (rolesId.includes(roleId)) {
              const index = this.right.data.findIndex(i => i.data_id == roleId)
              let groups = []
              response.data
                .filter(g => g.tag == 'group' &&
                  groupsId.includes(g.data_id) &&
                  !this.right.data[index].children.map(x => x.data_id).includes(g.data_id))
                .forEach(x => {
                  groups.push({
                    checked: false,
                    deleteVisible: true,
                    data_id: x.data_id,
                    id: x.id,
                    label: x.name,
                    tag: 'group'
                  })
                })
              console.log(index)
              this.right.data[index].children.push(...groups)
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
