<template>
  <el-dialog
    :title="'新增'"
    :visible.sync="visible">
    123
  </el-dialog>
</template>

<script>
export default {
  data () {
    return {
      visible: false
    }
  },
  methods: {
    init (id) {
      console.log(id)
      this.visible = true
    }
  }
}
</script>
