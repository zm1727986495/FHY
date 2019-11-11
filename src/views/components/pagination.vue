<template>
  <el-pagination
    background
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
    :current-page="currentPage"
    :page-sizes="pageSizes"
    :page-size="pageSize"
    :layout="layout"
    :total="total"
    :prev-text="prevText"
    :next-text="nextText"
    v-if="total">
  </el-pagination>
</template>

<script>
  export default {
    name: 'pagination',
    props: {
      currentPage: {
        type: Number,
        default: () => 1
      },
      pageSizes: {
        type: Array,
        default: () => [10, 20, 30, 50]
      },
      pageSize: {
        type: Number,
        default: () => 20
      },
      total: {
        type: Number,
        default: () => 0
      },
      layout: {
        type: String,
        default: () => 'total, sizes, prev, pager, next, jumper'
      },
      prevText: {
        type: String,
        default: () => ''
      },
      nextText: {
        type: String,
        default: () => ''
      }
    },
    methods: {
      handleSizeChange(val) {
        this.$emit('sizeChange', val);
      },
      handleCurrentChange(val) {
        this.$emit('currentChange', val);
      }
    }
  }
</script>

<style scoped>

</style>
