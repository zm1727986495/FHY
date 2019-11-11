<template>
  <div>
    {{categoryVal}}
    <el-dialog
      title="添加商品"
      :visible.sync="isChoseproducts"
      width="90%"
      :before-close="handleClose"
      custom-class="customDialogTitle"
      top="5vh"
    >
      <div class="addingGoods">
        <select-commodity
          @selectionChange="selectionChange"
          ref="selectedCommodities"
          :select-list="selectList"
        ></select-commodity>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submission">提 交</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>

    <!-- <div>
      <div class="foot_btn_box">
        <el-button type="primary" @click="submission">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </div>-->
  </div>
</template>


<script>
import selectCommodity from "@/views/components/selectCommodity";
import { listOrganization } from "api/pulicJava";
import {
  listCommodity,
  listCommodityByPage,
  addProductCommodity
} from "api/productmanage/productmanages/productmanages";
export default {
  props: ["isChoseproducts", "choose", "categoryVal", "brandVal"],
  components: {
    selectCommodity
  },
  data() {
    return {
      selectList: {
        selectedCommodities: [], // 选中的商品 可不传
        brandList: [], // 品牌数组 可不传（不传默认为全部品牌）
        categoryList: [], // 品类数组 可不传（不传默认为全部品类）
        priceStrategyId: "", // 价格策略 不是必填
        height: "350px", // 设置表格高度 可不传（弹出层最好传下）
        isDialog: true, // 是否为弹出层（不传默认为页面）
        commodityCategoryId: this.categoryVal,
        brandId: this.brandVal
      },
      commodityList: []
    };
  },
  mounted() {
    // 头部面包屑
  },
  methods: {
    //勾选
    selectionChange(val) {
      console.log(val);
      this.commodityList = val;
    },
    //提交
    submission() {
      if (this.commodityList.length < 1) {
        this.$message.error("您未勾选!");
        return;
      }
      let ids = this.commodityList
        .map(item => {
          return item.commodityId;
        })
        .join(",");
      let productId;
      if (this.$route.query.productId) {
        productId = this.$route.query.productId;
      } else {
        productId = this.choose;
      }
      let data = {
        productId,
        commodityIds: ids
      };

      addProductCommodity(data)
        .then(res => {
          if (res.status == 200) {
            this.$message.success("提交成功!");
            this.handleClose();
            this.$emit("getListData");
          } else {
            this.$message.danger("提交失败!");
          }
        })
        .catch(error => {
          console.error(
            "新增产品下的商品 productmanageproductmanageschoseproducts.vue",
            error
          );
        });
    },
    //关闭弹框
    handleClose() {
      this.$emit("cancelFn");
    }
  }
};
</script>
<style lang="scss" scoped>
.addingGoods {
  // max-height: 300px;
}
.foot_btn_box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>




