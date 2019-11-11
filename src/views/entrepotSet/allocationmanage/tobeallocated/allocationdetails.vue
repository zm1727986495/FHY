<template>
  <div>
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <div>
      <el-card>
        <div class="iconBox">
          <i class="Icon"></i>
          <span>基本信息</span>
        </div>
        <div>
          <ul class="customerlist">
            
            <li>
              <span class="fw">来源：</span>
              <span v-if="obj.transfersSource==1">安装</span>
              <span v-if="obj.transfersSource==2">备货</span>
              <span v-if="obj.transfersSource==3">订单</span>
              <span v-if="obj.transfersSource==4">门店</span>
              <span v-if="obj.transfersSource==5">仓库</span>
            </li>
            <li>
              <span class="fw">提货时间：</span>
              <span>{{obj.pickUpTime}}</span>
            </li>
            <li>
              <span class="fw">入库时间：</span>
              <span>{{obj.storageTime}}</span>
            </li>
            <li>
              <span class="fw">预计上门时间：</span>
              <span>{{obj.appointmentTime}}</span>
            </li>
            <li>
              <span class="fw">安装部：</span>
              <span>{{obj.installationName}}</span>
            </li>
            <li>
              <span class="fw">品牌：</span>
              <span>{{obj.brandName}}</span>
            </li>
            <li>
              <span class="fw">品类：</span>
              <span>{{obj.categoryName}}</span>
            </li>
            <li>
              <span class="fw">调入仓：</span>
              <span>{{obj.theWarehousingName}}</span>
            </li>
            <li>
              <span class="fw">调出仓：</span>
              <span>{{obj.bringUpTheLibraryName}}</span>
            </li>
            <li>
              <span class="fw">数量：</span>
              <span>{{obj.transfersNumber}}</span>
            </li>
            <li>
              <span class="fw">发起人：</span>
              <span>{{obj.userName}}</span>
            </li>
            <li>
              <span class="fw">发起部门：</span>
              <span>{{obj.departmentName}}</span>
            </li>
            <li>
              <span class="fw">发起时间：</span>
              <span>{{obj.createTime}}</span>
            </li>
          </ul>
        </div>
      </el-card>

      <el-card class="m-top10">
        <orderlist ref="orderlist" :tableList="tableList"></orderlist>
      </el-card>
      <div class="btn m-top10">
        <el-button @click="cancel">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import breadcrumb from "@/views/components/breadcrumb";
import { getByIdDetails,getTransfersApplyOrder } from "api/entrepotSet/allocationmanage/tobeallocated/tobeallocated";
import orderlist from "../allocatedlist/orderlist";

export default {
  components:{
    breadcrumb,
    orderlist
  },
  data(){
    return{
      navList:[],
      obj:{},
      tableList:[]
    }
  },
  mounted() {
   this.navList = this.$route.meta;
   this.getDetails()
   this.getData()
  },
  methods: {
    //取消
    cancel(){
      this.$router.go(-1)
    },
    getData(){
      getTransfersApplyOrder({transfersApplyId:this.$route.query.transfersApplyId}).then(res=>{
        if(res.status == 200){
          this.tableList = res.data;
        }
      }).catch(error=>{
        console.error('调拨详情',error);
      })
    },
    //获取详情
    getDetails(){
      getByIdDetails({transfersApplyId:this.$route.query.transfersApplyId}).then(res=>{
        if(res.status == 200){
          this.obj = res.data;
        }
      }).catch(error=>{
        console.error(error,'调拨详情');
        
      })
    }
  },
}
</script>

<style lang='scss' scoped>
.btn{
  display: flex;
  justify-content: center;
}
.customerlist {
  display: flex;
  flex-wrap: wrap;
  padding: 0 20px;
  li {
    width: 25%;
    padding: 1px 0;
    display: flex;
    align-items: center;
    // line-height: 40px;
    p{
      width: 85px;
      text-align: right;
    }
    span {
      font-weight: none !important;
    }
  }
}
</style>