<template>
  <!-- 本页面为生成调拨单的新增页面
在查看调拨单列表页面点击调拨单号也可以到本页面查看调拨单详情
在查看页面没有备注的信息
  -->

  <div class="createallocated">
    <!-- 导航栏 -->
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="iconBox">
        <i class="Icon"></i>
        <span>生成调拨单</span>
      </div>
      <div class="header_body">
        <div class="items" v-if="isShow">
          <div class="item">
            <span class="span_title">调拨单号：</span>
            <span>{{obj.transfersNumber}}</span>
          </div>
          <div class="item">
            <span class="span_title">调拨生成时间：</span>
            <span>{{obj.createTime}}</span>
          </div>
        </div>
        <div class="items_3">
          <div>
            <span class="span_title">提货时间：</span>
            <el-date-picker
              v-model="bindInfo.pickUpTime"
              style="width:100%"
              type="datetime"
              placeholder="选择日期"
              value-format="yyyy-M-dd HH:mm:ss"
              format="yyyy-M-dd HH:mm:ss"
              :disabled="isShow"
            ></el-date-picker>
          </div>
        </div>
        <div class="items_3">
          <div>
            <span class="span_title">车辆：</span>
            <el-input
              :disabled="isShow"
              style="width:100%;"
              placeholder="请填写车辆信息"
              v-model="bindInfo.transfersCar"
            ></el-input>
          </div>
          <div>
            <span class="span_title">司机：</span>
            <el-input
              :disabled="isShow"
              style="width:100%;"
              placeholder="请填写司机信息"
              v-model="bindInfo.transfersDriver"
            ></el-input>
          </div>
        </div>
        <div class="remarks">
          <span class="span_title">备注：</span>
          <el-input
            type="textarea"
            :disabled="isShow"
            :rows="2"
            placeholder="请输入内容"
            v-model="bindInfo.remarks"
          ></el-input>
        </div>

        <!-- 商品信息 -->
        <!-- <prolist></prolist> -->

        <!-- 订单信息 -->
        <orderlist ref="orderlist" class="m-top50" :tableList="tableList"></orderlist>
      </div>
    </el-card>
    <div class="btn">
      <el-button type="primary" @click="submission" :loading="loadingBtn" v-if="!isShow">提 交</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import prolist from "../allocatedlist/prolist";
import orderlist from "../allocatedlist/orderlist";
import {
  getStorage, //添加调拨申请单
  getTransfersApplyOrder, //调拨申请id获取调拨申请详情
  addTransfers,
  getTransfersOrder,
  getTransfersById
} from "api/entrepotSet/allocationmanage/tobeallocated/tobeallocated";
import { getUUID } from "api/pulicJava"; //生成编码

export default {
  components: {
    breadcrumb,
    pagination,
    prolist,
    orderlist
  },
  data() {
    return {
      bindInfo: {}, //信息头
      loadingBtn:false,
      obj: {},
      navList: [], //头部面包屑
      tableList: [], //列表数据
      storage1: {},
      storage2: {},
      isShow: false //判断当前是查看还是新增
    };
  },
  created() {
    if (this.$route.query.nums == 0) {
      this.isShow = true;
    } else {
      this.isShow = false;
    }
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;

    if (this.isShow) {
      this.getTran();
      this.getOrder();
    } else {
      this.getByIdFun();
      this.getStorageFun1(this.$route.query.theWarehousingId);
      this.getStorageFun2(this.$route.query.bringUpTheLibraryId);
    }
  },
  methods: {
    //获取详情商品数据
    getOrder() {
      let data = {
        transfersId: this.$route.query.transfersId
      };
      getTransfersOrder(data)
        .then(res => {
          this.tableList = res.data.map(item => {
            return { checked: false, ...item };
          });
        })
        .catch(error => {
          console.error("获取详情", error);
        });
    },
    //获取详情头信息
    getTran() {
      let data = {
        transfersId: this.$route.query.transfersId
      };
      getTransfersById(data)
        .then(res => {
          this.bindInfo = res.data;
          this.obj.createTime = res.data.createTime;
          this.obj.transfersNumber = res.data.transfersNumber;
        })
        .catch(error => {
          console.error("获取详情头信息", error);
        });
    },

    //调拨申请id获取调拨申请详情
    getByIdFun() {
      let data = {};
      if (this.$route.query.transfersApplyId instanceof Array) {
        data.transfersApplyId = this.$route.query.transfersApplyId.join(",");
      } else {
        data.transfersApplyId = this.$route.query.transfersApplyId;
      }

      getTransfersApplyOrder(data).then(res => {
        console.log(res);
        this.tableList = res.data.map(item => {
          return { checked: false, ...item };
        });
      });
    },
    //获取仓库1
    getStorageFun1(id) {
      let data = {
        storageId: id
      };
      getStorage(data).then(res => {
        if (res.data !== null) {
          this.storage1 = res.data;
        }
      });
    },
    //获取仓库2
    getStorageFun2(id) {
      let data = {
        storageId: id
      };
      getStorage(data).then(res => {
        if (res.data !== null) {
          this.storage2 = res.data;
        }
      });
    },
    //提交
    submission() {
      let arr = []; //调拨申请单集合
      if (this.$route.query.transfersApplyId instanceof Array) {
        this.$route.query.transfersApplyId.forEach(item => {
          arr.push(item);
        });
      } else {
        arr.push(this.$route.query.transfersApplyId);
      }
      let sum = 0; //包
      let num = 0; //商品
      let purchasingArr = []; //采购单
      let ary = []; //库取商品集合
      this.tableList.forEach(item => {
        // 采购单id
        purchasingArr.push(item.storagePurchaseOrderId);
        // 包数量
        if (item.unpackingDataVOS) {
          item.unpackingDataVOS.forEach(attr => {
            sum += attr.unpackingName * 1;
          });
        }

        // 商品数量
        if (item.inventoryGoodsVOS) {
          item.inventoryGoodsVOS.forEach(attr => {
            ary.push({
              storagePurchaseOrderId: item.storagePurchaseOrderId,
              inventoryGoodsId: attr.inventoryGoodsId,
              number: attr.transfersNumber
            });
            num += attr.inventoryNumber * 1;
          });
        }
      });

      if(this.$route.query.orderId&&this.$route.query.orderId.length==1){
        this.bindInfo.orderId = this.$route.query.orderId[0];
      }
      let data = {
        ...this.bindInfo,
        theWarehousingName: this.$route.query.theWarehousingId,
        bringUpTheLibraryName: this.$route.query.bringUpTheLibraryId,
        status: 3,
        list: arr,
        transfersCount: sum + num,
        storagePurchaseOrderList: purchasingArr,
        goodsList: ary
      };
      this.loadingBtn = true;
      new Promise((resolve, reject) => {
        getUUID({ serialNumber: "TO" }).then(res => {
          resolve(res);
        });
      }).then(res => {
        data.transfersNumber = res.data;
        addTransfers(data).then(res => {
          if (res.status == 200) {
            this.$message.success("生成调拨单成功");
            this.loadingBtn = false;
            this.$router.push({
              path: "/allocationmanage/allocatedlist"
            });
          }else{
            this.loadingBtn = false;
          }
        }).catch(error => {
          this.loadingBtn = false;
          console.error("生成调拨单", error);
        });
      });
    },
    //取消
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>

<style scope lang="scss">
.btn {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.createallocated {
  .header_body {
    font-size: 14px;
    margin-top: 20px;
    .items {
      display: flex;
      flex-wrap: nowrap;
      .item {
        margin: 10px 0;
        width: 25%;
        // border: 1px solid red;
        .span_title {
          display: inline-block;
          min-width: 80px;
          text-align: right;
          font-weight: bold;
        }
      }
    }
    .items_3 {
      display: flex;
      flex-wrap: nowrap;
      // justify-content: space-between;
      margin: 10px 0;
      div {
        display: flex;
        align-items: center;
        width: 350px;
        .span_title {
          display: inline-block;
          min-width: 80px;
          text-align: right;
          font-weight: bold;
        }
      }
    }
    .remarks {
      display: flex;
      flex-wrap: nowrap;
      .span_title {
        display: inline-block;
        min-width: 80px;
        text-align: right;
        font-weight: bold;
      }
    }
  }
}
</style>
