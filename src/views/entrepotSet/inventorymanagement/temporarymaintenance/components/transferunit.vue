<template>
  <div class="transferunit">

  </div>
</template>
<script>
  import selectCommodity from '@/views/components/selectCommodity';

  export default {
    components: {
      selectCommodity
    },
    props: {
      dialogVisible: Boolean
    },
    data() {
      return {
        conetntext: "",

        value: "",
        bindInfo: {},
        tableData: [],
        tableDataSeletecd: [],
        selectList: { // 选择商品参数
          selectedCommodities: [], // 选中的商品 可不传
          height: '350px', // 设置表格高度 可不传（弹出层最好传下）
          isDialog: true, // 是否为弹出层（不传默认为页面）
          brandList: [],
          categoryList: []
        }
      };
    },
    methods: {
      tableRowClassName({row, rowIndex}) {
        // 表格斑马线设置
        return rowIndex % 2 != 0 ? "el-f0" : "";
      },
      handleClose() {
        this.$emit("outerVisibleFun");
      },
      // 选择商品 复选框
      selectionChange(val) {
        this.selectedProducts = val;
      },
      // 点击添加商品
      addProduct() {
        this.selectList.selectedCommodities = this.getSelectedCommodityIds;
        this.productDialog = true;
      },
      // 确定添加商品
      addProductConfirm() {
        if (this.selectedProducts.length) {
          this.selectedProducts.forEach(item => {
            this.tableDataSeletecd.push(item);
          })
          this.productDialog = false;
        } else {
          this.$message.warning('请选择要添加的商品');
        }
      }
    },
    computed: {
      getSelectedCommodityIds() {
        let arr = [];
        if (this.tableDataSeletecd.length) {
          this.tableDataSeletecd.forEach(item => {
            arr.push(item.commodityId);
          })
        }
        return arr;
      }
    }
  };
</script>
