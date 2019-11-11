<template>

</template>

<script>
  export default {
    name: 'IllegalListingTable',
    data() {
      return {
        size: 'small'
      }
    },
    props: {
      datas: {
        type: Array,
        default: () => []
      },
      listType: ''
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      handleSelection(val) {
        this.$emit('selectionChange', val);
      }
    }
  }
</script>
