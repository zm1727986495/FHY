<template>
  <div class="wrapper lvs">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <el-card class="selectCommodity">
        <select-commodity @selectionChange="selectionChange" ref="selectedCommodities" :select-list="selectList"></select-commodity>
      </el-card>
    </div>
  </div>
</template>
<script>
  import breadcrumb from '@/views/components/breadcrumb'
  import selectCommodity from '@/views/components/selectCommodity'
  export default {
    name: 'test',
    components: {
      breadcrumb,
      selectCommodity
    },
    data() {
      return {
        selectList: {
          selectedCommodities: [], // 选中的商品 可不传
          brandList: [], // 品牌数组 可不传（不传默认为全部品牌）
          categoryList: [], // 品类数组 可不传（不传默认为全部品类）
          priceStrategyId: '', // 价格策略 不是必填
          height: '350px', // 设置表格高度 可不传（弹出层最好传下）
          isDialog: true // 是否为弹出层（不传默认为页面）
        },
        navList: []
      }
    },
    created() {

    },
    mounted() {
      this.navList = this.$route.meta;
    },
    methods: {
      selectionChange(val) {
        console.log(val)
      }
    }
  }
</script>
