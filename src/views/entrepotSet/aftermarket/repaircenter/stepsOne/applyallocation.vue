<template>
  <div class="applyallocation">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="header_two">
      <el-form-item label="调出仓库" prop="calloutLibrariesId">
        <el-select v-model="ruleForm.calloutLibrariesId" clearable filterable @change="calloutFn" placeholder="请选择调出仓库">
          <el-option v-for="item in options" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
        </el-select>  
      </el-form-item>

      <el-form-item label="调入仓库" prop="foldLibraryId">
        <el-select v-model="ruleForm.foldLibraryId" clearable filterable placeholder="请选择调入仓库">
          <el-option v-for="item in options" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <!-- 库区单 -->
    <libraryacquisition :orderId="orderId" ref="library"></libraryacquisition>
    <!-- 订单 -->
    <procurement :orderId="orderId" ref="procurlist"></procurement>
    <!-- 礼品单 -->
    <!-- <selectiongift></selectiongift> -->
    <div class="btn-footer">
      <el-button type="primary" @click="handleok" :loading="loadingbtn">确 定</el-button>
      <el-button @click="handleno">取 消</el-button>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import libraryacquisition from "@/views/entrepotSet/aftermarket/repaircenter/stepsOne/components/libraryacquisition";
import procurement from "@/views/Installation/dispatchcenter/components/procurement";
// import selectiongift from "@/views/Installation/dispatchcenter/components/selectiongift";
import spot from "@/assets/images/spot.png";
// D:\agweb\src\api\Installation\dispatchcenter\dispatchcenter.js
import {
  addTransfersApply, //申请调拨
  checkPurchaseOrder
} from "@/api/entrepotSet/aftermarket/repaircenter/repaircenter";

import {
  getStorageList //仓库列表
} from "api/entrepotSet/allocationmanage/tobeallocated/tobeallocated";

export default {
  components: {
    breadcrumb,
    pagination,
    libraryacquisition,
    procurement
    //selectiongift,
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      spot, //操作图片
      navList: [], //头部面包屑
      options:[],//仓库列表
      elsectVal: [], //选中框
      tabList: [], //table数据
      ruleForm: {
        calloutLibrariesId:'',
        storageId:''
      },
      loadingbtn:false,
      rules: {
        calloutLibrariesId: [
          { required: true, message: "请选择调出仓库", trigger: "change" }
        ],
        foldLibraryId: [
          { required: true, message: "请选择调入仓库", trigger: "change" }
        ]
      },
      orderId: ""
    };
  },
  created() {
    this.orderId = this.$route.query.orderId;
    this.ruleForm.installationOrderId = this.$route.query.installationOrderId;
    this.getStorageListFun();
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    //当前采购单仓库不同，默认出库仓是第一个，反之取采购单仓库
    // storageFun(val){
    //   if(val){
    //     this.ruleForm.calloutLibrariesId = val
    //   }else{
    //     this.ruleForm.calloutLibrariesId = this.options&&this.options.length? this.options[0].storageId:'';
    //   }
    // },
    //选择调出仓
    calloutFn(){
      this.$refs.procurlist.gerlistOrder(this.ruleForm.calloutLibrariesId);
      this.$refs.library.getWarehouse(this.ruleForm.calloutLibrariesId);
    },
    //获取仓库列表
    getStorageListFun() {
      getStorageList().then(res => {
        if(res.status == 200){
          this.options = res.data;
          // this.ruleForm.calloutLibrariesId = res.data ? res.data[0].storageId:'';
        }
        })
        .catch(error => {
          console.log("获取仓库列表" + error);
        });
    },
    //跳转调拨申请页面
    handleok() {
      console.log(this.$refs["library"].elsectVal);
      //要发送的库区表数据
      let isundefined = this.$refs["library"].elsectVal.every(item => {
        return item.number1 != undefined;
      });
      
      if (isundefined) {
        this.ruleForm.librariesTakeDTOS = this.$refs["library"].elsectVal.map(item => {
            if (typeof item.number1 != "number") {
              this.$message.error("申请数量格式有误");
              return;
            } else if (item.number1 > item.number || item.number1 <= 0) {
              this.$message.error("申请数量非法数值");
              return;
            } else {
              
              return {
                inventoryGoodsId: item.inventoryGoodsId,
                number: item.number1,
                relLibrariesTakeCommodity: item.relLibrariesTakeCommodity,
                storagePurchaseOrderId: item.storagePurchaseOrderId
              };
            }
        });
      } else {
        this.$message.error("您有勾选的库取数据没有填写申请数量");
        return;
      }
      //要发送的订单表数据
      this.ruleForm.purchaseOrderVOS = this.$refs["procurlist"].orderData();
      if (
        this.ruleForm.purchaseOrderVOS.length == 0 &&
        this.ruleForm.librariesTakeDTOS.length == 0
      ) {
        this.$message.error("您未勾选订单商品或库区商品");
        return;
      }

      if (this.ruleForm.foldLibraryId == "") {
        this.$message.warning("请选择仓库");
        return;
      }
      

      let num = 0;
      this.ruleForm.librariesTakeDTOS.forEach(item => {
        num = Number(item.number) + num;
      });
      let storagePurchaseList = [];//库存采购单id
      let storageIdList = [];//判断当前所有采购单是否是一个仓库
      this.ruleForm.purchaseOrderVOS.forEach(item => {
        num = Number(item.deliveryNumber) + num;
        storagePurchaseList.push(item.storagePurchaseOrderId)//库存采购单id
        storageIdList.push(item.storageId)
      });
      let flag = Math.max.apply(null, storageIdList) == Math.min.apply(null, storageIdList);
      if(!flag){
        this.$message.error('当前采购单仓库不一致!')
        return
      }

      this.ruleForm.transfersNumber = num;
      this.ruleForm.orderId = this.$route.query.orderId;
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let data = {
            purchaseOrderIdList:storagePurchaseList.join(',')
          }
          console.log(data,'库存采购单id');
          checkPurchaseOrder(data).then(res=>{
            if(res.status == 200){
              this.loadingbtn = true;
              addTransfersApply(this.ruleForm).then(res => {
                if (res.status == "200") {
                  this.$message.success("申请调拨成功");
                  this.$router.push({ path: "/allocationmanage/tobeallocated" });
                  this.loadingbtn = false;
                } else {
                  this.loadingbtn = false;
                  this.$message.error("申请调拨失败");
                }
              }).catch(error=>{
                console.error('安装申请调拨',error);
              })
            }else{
              this.$message.error(res.message)
            }
          }).catch(error=>{
            console.error('验证采购单是否调拨',error);
          })
          
        } else {
          this.loadingbtn = false;
          this.$message.error("检查填写信息");
          return false;
        }
      });
    },

    //退回
    handleno() {
      this.$router.go(-1);
    },
    //查询按钮获取
    getListFun(form) {
      console.log(form);
    },

    //多选内容改变
    handleSelectionChange(val) {
      this.elsectVal = val;
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getListFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getListFun();
    }
  }
};
</script>
<style scoped lang='scss'>
.applyallocation {
  .header_two {
    display: flex;
    flex-wrap: nowrap;
    align-content: center;
    justify-items: center;
    margin: 0 auto;
    width:100%;
  }
  .btn-footer {
    // width: 180px;
    // margin: 20px auto;
    display: flex;
    justify-content: center;
    width: 100%;
  }
}
</style>

