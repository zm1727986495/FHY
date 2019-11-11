<template>
  <div>
    <div class="head_nav" ref="topInfo">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="box-card">
      <div>
        <basichandover ref="basichandover"></basichandover>
      </div>
      <div class="outgoingremarks m-top10">
        <p style="min-width:80px;" class="fw">出库备注：</p>
        <el-input
          :disabled="true"
          style="width:70%"
          type="textarea"
          :rows="2"
          placeholder="请输入内容"
          resize="none"
          v-model="textarea"
        ></el-input>
      </div>
      <div class="h-width"></div>
      <div class="m-top20">
        <collaruse :isShow="isShow" ref="collaruse" v-if="isFlag==4||isFlag==9"></collaruse>
        <procurement v-else :isShow="isShow"></procurement>
      </div>
    </el-card>
    <div class="foot_btn_box">
      <!-- <el-button type="primary" @click="submission" :loading="loadingbtn">确 认</el-button> -->
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import basichandover from "./components/basichandover";
import procurement from "./components/procurement";
import collaruse from "./components/collaruse";
import {
  deliveryConfirmation,
  getById,
  deliveryRecipientsGoods
} from "api/entrepotSet/outgoingManagement/outgoingManagement";
export default {
  components: {
    breadcrumb,
    basichandover,
    procurement,
    collaruse
  },
  data() {
    return {
      navList: [],
      textarea: "",
      tableData: [{}],
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      isShow: false,
      isFlag: 0,
      loadingbtn: false
    };
  },
  created() {
    this.isFlag = this.$route.query.outboundType;
  },
  mounted() {
    this.navList = this.$route.meta;
    // this.getData();
  },
  methods: {
    //出库交接确认
    submission() {
      if (this.isFlag == 4 || this.isFlag == 9) {
        let data = {
          outboundOrderId: this.$route.query.outboundOrderId, //出库单ID
          outboundStatus: 3, //出库状态
          remarks: this.textarea //备注
        };
        let { tableData } = this.$refs.collaruse;
        if (tableData.length == 0) {
          this.$message.error("当前无数据!");
          return;
        }
        let arr = [];
        tableData.forEach(item => {
          arr.push({
            inventoryGoodsId: item.inventoryGoodsId, //库存商品ID
            storageId: this.$refs.basichandover.bindInfo.storageId, //仓库ID
            skuGoodsId: item.skuGoodsId, //sku商品id
            inventoryType: 1, //库存类型
            inventoryStatus: 4, //库存状态
            number: item.inventoryNumber //出库数量
          });
        });
        data.goodsList = arr;
        this.loadingbtn = true;
        deliveryRecipientsGoods(data)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("提交成功!");
              this.loadingbtn = false;
              this.$router.go(-1);
            }else{
              this.loadingbtn = false;
            }
          })
          .catch(error => {
            this.loadingbtn = false;
            console.error("礼品或备货出库交接确认", error);
          });
      } else {
        let data = {
          outboundOrderId: this.$route.query.outboundOrderId,
          outboundType: this.$route.query.outboundType,
          outboundStatus: 3,
          remarks: this.textarea
        };
        this.loadingbtn = true;
        deliveryConfirmation(data)
          .then(res => {
            if (res.status == 200) {
              this.$message.success("提交成功!");
              this.loadingbtn = false;
              this.$router.go(-1);
            }else{
              this.loadingbtn = false;
            }
          })
          .catch(error => {
            this.loadingbtn = false;
            console.error("出库交接确认", error);
          });
      }
    },
    //取消
    cancel() {
      this.$router.go(-1);
    },
    
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.page_head_div {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 40px;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}
.foot_btn_box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.outgoingremarks {
  display: flex;
  flex-wrap: wrap;
  margin-left: 45px;
}
</style>
