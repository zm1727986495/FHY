<template>
  <!-- 赠送礼品 -->
  <div class="giftgrant_cl">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <!-- 订单详情信息 -->
    <orderdetail class="mar_bot_info" v-if="isShowDetail" :orderId="form.orderId"></orderdetail>
    <el-card class="m-top10">
      <div class="givegift_p">
        <!-- 头信息 -->
        <div class="iconBox gift_title_btom" v-if="queryorderId">
          <i class="Icon"></i>
          <span>选择订单</span>
        </div>
        <!-- 订单信息 -->
        <div class="order_info">
          <div class="order_info_input" v-if="queryorderId">
            <el-input class="input_250" placeholder="订单号" v-model="orderNumber" disabled></el-input>
            <el-button type="primary" size="medium" class="reset_btn m-left20" @click="openOrderDia">选择</el-button>
          </div>
        </div>
        <!-- 礼品信息 -->
        <div class="iconBox gift_title_btom">
          <i class="Icon"></i>
          <span>添加礼品</span>
          <i class="el-icon-circle-plus icon_size" @click="opengiftDia"></i>
          <i class="el-icon-remove icon_size" @click="delgift"></i>
        </div>

        <!-- addgiftdia弹框 -->
        <addgiftdia v-if="addgift_vis" :addgift_vis="addgift_vis" :storeId="storeId" :disabedArr="disabedArr" @addgift-clo="addGiftClo" @addgift="addgift"></addgiftdia>

        <div class="table_list lvs attribute">
          <el-table border :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :data="tabList">
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column prop="commodityName" align="center" label="礼品名称" sortable></el-table-column>
            <el-table-column prop="commodityCode" align="center" label="礼品编码" sortable></el-table-column>
            <el-table-column prop="availableAmount" align="center" label="价格" sortable></el-table-column>
            <el-table-column prop="sendWay" align="center" label="赠送方式" sortable>
              <!-- 1随车   2自提 -->
              <template slot-scope="scope">
                <p v-if="scope.row.sendWay == 1">随车</p>
                <p v-if="scope.row.sendWay == 2">自提</p>
              </template>
            </el-table-column>
            <el-table-column prop="receivableNumber" align="center" label="可用数量" sortable></el-table-column>
            <el-table-column prop="giftAmount" align="center" label="赠送数量" sortable width="200">
              <template slot-scope="scope">
                <el-input v-model="scope.row.giftAmount"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="remark" align="center" label="备注" sortable>
              <template slot-scope="scope">
                <el-input v-model="scope.row.remark" placeholder="输入备注信息"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <div class="bottom_send">
          <el-button type="primary" size="medium" @click="sendJava" :loading="loadingBtn">确定</el-button>
          <el-button size="medium" @click="backFun">返回</el-button>
        </div>
        <!-- 选择订单弹框 -->
        <ordercomponent v-if="centerDialogVisible" :centerDialogVisible="centerDialogVisible" @orderclosefun="orderclosefun"></ordercomponent>
      </div>
    </el-card>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import ordercomponent from "@/views/components/ordercomponent"; //选择订单弹框
import orderdetail from "@/views/order/components/orderdetail"; //订单详情
import { givingGifts } from "api/order/giftmanagement/giftmanagement"; //添加礼品接口
import addgiftdia from "./components/addgiftdia"; //订单信息弹框
import { getUUID } from "api/pulicJava"; //生成编码
import { orderDetails }  from 'api/order/order/order'
import { getNames } from "src/utils/pubilcFn.js";
export default {
  components: {
    breadcrumb,
    pagination,
    ordercomponent, //订单弹框
    orderdetail, //订单详情信息
    addgiftdia //添加礼品弹框
  },
  // name: 'brandmanagement',
  data() {
    return {
      loadingBtn: false,
      navList: [], //面包屑
      tabList: [],
      centerDialogVisible: false, // 订单弹出框
      isShowDetail: false, //点单详情是否显示
      form: {
        //发送的form
        orderGiftDTOList: [], //table勾选的数组对象
        orderId: "" //订单id
      },

      /**
       * 通过选择订单  取出门店id  订单id   订单号
       */
      storeId: "", //门店id
      orderNumber: "", //订单号
      orderId: "", //订单id
      queryorderId: true,//如果路由传参orderid   不能选择订单
      orderdia_vis: false, //订单弹框是否显示
      addgift_vis: false, //添加礼品弹框是否显示
      disabedArr: [], //添加礼品的禁用数组  已有的数据不能再添加
      selectedProducts: [], //勾选的商品
      id: "" //订单id
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    if(this.$route.query.orderId){
      this.isShowDetail = true;
      this.queryorderId = false;
      orderDetails({orderId:this.$route.query.orderId}).then(res=>{
        this.storeId = res.data.storeId;
        this.orderNumber = res.data.orderNumber;
        this.form.orderId = res.data.orderId;
      })
    }
  },

  methods: {
    //确认按钮添加商品
    sendJava() {
      if (!this.storeId) {
        this.$message.warning("请选择订单");
        return;
      }
      if (!this.form.orderGiftDTOList.length) {
        this.$message.warning("请勾选要提交的礼品");
        return;
      }
      let flag = this.form.orderGiftDTOList.every(item => {
        return (
          !/\d/.test(item.giftAmount) || //必须为数字
          !(item.giftAmount <= item.receivableNumber) || //必须小于可用数量
          item.giftAmount <= 0
        );
      });

      if (flag) {
        this.$message.warning("格式有误或填写数量大于可用数量");
        return;
      }
      this.loadingBtn = true;
      new Promise((resolve, reject) => {
        getUUID({ serialNumber: "GD" }).then(res => {
          resolve(res);
        });
      }).then(res => {
        this.form.giftCode = res.data;
        givingGifts(this.form)
          .then(res => {
            this.loadingBtn = false;
            if (res.status == "200") {
              this.$message.success("添加礼品成功");
              this.$router.go(-1);
            }
          })
          .catch(error => {
            this.loadingBtn = false;
            console.log(
              error + "views/marketing/giftmanagement/giftgrant/givegift"
            );
          });
      });
    },

    //取消按钮
    backFun() {
      this.$router.go(-1);
    },

    //弹出订单选择弹框
    openOrderDia() {
      this.centerDialogVisible = true;
    },

    //订单关闭  选择订单
    orderclosefun(val) {
      if (val) {
        this.isShowDetail = false;
        this.$nextTick(() => {
          this.storeId = val[0].storeId;
          this.orderNumber = val[0].orderNumber;
          this.form.orderId = val[0].orderId;
          this.centerDialogVisible = false;
          this.isShowDetail = true;
          this.$message.success("选择订单号成功");
        });
      } else {
        // 取消按钮
        this.$message.warning("您没有选择订单");
        this.centerDialogVisible = false;
      }
    },

    //弹出添加选择礼品弹框
    opengiftDia() {
      if (this.storeId) {
        this.addgift_vis = true;
        this.disabedArr = this.getCommodityIds;
      } else {
        this.$message.warning("请先选择订单");
      }
    },

    //关闭添加选择礼品弹框
    addGiftClo() {
      this.addgift_vis = false;
    },

    //添加礼品子组件确定
    addgift(arr, type) {
      if (arr.length) {
        arr.forEach(item => {
          if (type == "0") {
            item.sendWay = "2";
          } else {
            item.sendWay = "1";
          }
          this.tabList.push(item);
        });
        this.addgift_vis = false;
      } else {
        this.$message.warning("请勾选商品!!");
      }
    },

    //删除添加的礼品
    delgift() {
      if (this.form.orderGiftDTOList.length > 0) {
        this.$confirm("是否作废勾选信息?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            this.form.orderGiftDTOList.forEach(item => {
              this.tabList = this.tabList.filter(attr => {
                return item.commodityCode !== attr.commodityCode;
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      } else {
        this.$message.warning("请勾选需要删除的商品");
      }
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.form.orderGiftDTOList = val;
    },

    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  },
  computed: {
    getCommodityIds() {
      let arr = [];
      if (this.tabList.length) {
        this.tabList.forEach(item => {
          arr.push(item.commodityCode);
        });
      }
      return arr;
    }
  }
};
</script>
<style scoped lang='scss'>
.givegift_p {
  .gift_title_btom {
    // border-bottom: 1px solid rgb(151, 150, 150);
    padding-bottom: 8px;
    width: 250px;
  }
  .order_info {
    .input_250 {
      width: 250px;
    }
    .order_info_input {
      margin-left: 2.5%;
    }
  }
  .icon_size {
    font-size: 25px;
    color: #409eff;
    padding-left: 20px;
    cursor: pointer;
  }
  .mar_bot_info {
    border-bottom: 1px solid #f2eeee;
    padding-top: 8px;
  }
  .bottom_send {
    width: 200px;
    text-align: center;
    margin: 25px auto;
  }
}
</style>

