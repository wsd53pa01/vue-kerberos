<template>
  <Transfer
    :left="left"
    :right="right"
  >
  </Transfer>
</template>

<script>
import Transfer from '@/components/Transfer'
import emitter from '@/utils/emitter.js'
import { getAd, createGroup } from '@/api/group'
import { tree } from '@/api/group-user'
import { arrayToNested, addTreeProperty } from '@/utils/treeTable.js'
import { convertTreeData } from '@/utils'

export default {
  name: 'Group',
  components: {
    Transfer,
  },
  data() {
    return {
      left: {
        name: 'AD 群組',
        data: [],
        search: true,
      },
      right: {
        name: '群組',
        data: [],
        search: true,
        createOption: {
          open: true,
          event: this.createEvent
        }
      },
    }
  },
  computed: {
    active: {
      get() {
        return this.$store.state.creation.active
      },
      set(val) {
        this.$store.dispatch('creation/setActive', val)
      }
    },
    applicationId: {
      get() {
        return this.$store.state.creation.applicationId
      }
    }
  },
  beforeCreate() {
    emitter.$offAll(['next', 'previous'])
  },
  created() {
    emitter.$on('next', () => { this.active += 1 })
    emitter.$on('previous', () => { this.active -= 1 })
    // this.left.data = data.list
    getAd().then((response) => {
      this.left.data = response.data
    })
    tree(this.applicationId).then((response) => {
      this.right.data = convertTreeData(response.data)
      console.log(this.right.data)
    })
  },
  methods: {
    createEvent(node) {
      console.log(node)
      let postData = { applicationId: this.applicationId, name: node.data.test }
      createGroup(postData).then((response) => {
        console.log(response)
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
