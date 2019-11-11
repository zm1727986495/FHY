<template>
  <div>
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="procurement m-bottom10">
        <div>
          <el-input @keyup.enter.native='getData()' v-model="code" placeholder='采购合同号'></el-input>
        </div>
        <div>
          <el-date-picker v-model="installCompleteTime" type="date" placeholder="选择日期"></el-date-picker>
        </div>
        <div>
         <el-select v-model="serveGroupId" clearable filterable placeholder="请选择部门">
          <el-option
            v-for="item in options"
            :key="item.serveGroupId"
            :label="item.serveGroupName"
            :value="item.serveGroupId">
          </el-option>
        </el-select>
        </div>
         <div>
         <el-select v-model="positionId" clearable filterable placeholder="请选择位置">
          <el-option
            v-for="item in position"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
        </div>
      </div>


      <div class="table_list lvs attribute">
        <el-table border :row-class-name="tableRowClassName" @selection-change="chooseDelete" :data="tableData">
          <el-table-column fixed="left" type="selection" width="40"></el-table-column>
          <el-table-column align="center" prop="location" label="位置" width="120">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.row.location==0">未接单</p>
                <p v-if="scope.row.location==1">待处理</p>
                <p v-if="scope.row.location==2">进行中</p>
                <p v-if="scope.row.location==3">已完成</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="installationOrderStatus" label="状态" width="100">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.row.installationOrderStatus==0">未接单</p>
                <p v-if="scope.row.installationOrderStatus==1">已转单</p>
                <p v-if="scope.row.installationOrderStatus==2">转单被拒</p>
                <p v-if="scope.row.installationOrderStatus==3">已接单未通知</p>
                <p v-if="scope.row.installationOrderStatus==4">已通知未预约</p>
                <p v-if="scope.row.installationOrderStatus==5">派单已撤销</p>
                <p v-if="scope.row.installationOrderStatus==6">已预约待指派</p>
                <p v-if="scope.row.installationOrderStatus==7">安装中</p>
                <p v-if="scope.row.installationOrderStatus==8">汇报未完成</p>
                <p v-if="scope.row.installationOrderStatus==9">汇报已完成</p>
                <p v-if="scope.row.installationOrderStatus==10">回访中</p>
                <p v-if="scope.row.installationOrderStatus==11">回访驳回</p>
                <p v-if="scope.row.installationOrderStatus==12">已完成</p>
                <p v-if="scope.row.installationOrderStatus==13">已预约未确定</p>
                <p v-if="scope.row.installationOrderStatus==14">已指派待派单</p>
                <p v-if="scope.row.installationOrderStatus==15">待安装</p>
                <p v-if="scope.row.installationOrderStatus==16">已回访未结算</p>
                <p v-if="scope.row.installationOrderStatus==17">已回访已结算</p>
                <p v-if="scope.row.installationOrderStatus==18">汇报未完成已预约</p>
                <p v-if="scope.row.installationOrderStatus==19">回访未完成已预约</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="serveGroupName" label="部门名称" width="120"></el-table-column>
          <el-table-column align="center" prop="completionTime" label="回访完成时间" width="160"></el-table-column>
          <el-table-column align="center" prop="orderNumber" label="订单号" width="120"></el-table-column>
          <el-table-column align="center" prop="customerContractNumber" label="客户合同号" width="130"></el-table-column>
          <el-table-column align="center" prop="predictInstallTime" label="预计安装时间" width="160"></el-table-column>
          <el-table-column align="center" prop="installCompleteTime" label="安装完成时间" width="160"></el-table-column>
        </el-table>
      </div>
    </el-card>
    <div class="submissionStyle">
      <el-button type="primary" @click="submission" :loading="btnLoading">提交</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import { getOrderMessage, listServeGroup, addInstallation } from 'api/Installation/xushuang/xushuang'
export default {
  components:{
    breadcrumb
  },
  data(){
    return{
      navList:[],//导航条
      code:'',//采购合同号
      tableData:[],//列表数据
      choseArr:[],//勾选
      installCompleteTime:'',
      options:[],
      positionId:'',
      position:[
        {
          name:'未接单',
          id:0
        },
        {
          name:'待处理',
          id:1
        },
        {
          name:'进行中',
          id:2
        },
        {
          name:'已完成',
          id:3
        }
      ],
      serveGroupId:'',
      btnLoading:false
    }
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.getListServeGroup()
  },
  methods: {
    getData(){
      let data={
        code:this.code
      }
      getOrderMessage(data).then(res=>{
        if(res.status == 200){
          this.tableData = res.data.rows;
        }
      }).catch(error=>{
        console.error('徐爽专用',error);
      })
    },
    getListServeGroup(){
      listServeGroup().then(res=>{
        if(res.status == 200){
          this.options = res.data;
        }
      })
    },
    //提交
    submission(){
      if(this.choseArr.length!=1){
        this.$message.error('只能勾选一个!')
        return
      }
      let {
        orderId,
        orderNumber,
        customerContractNumber,
        customerContractId,
        storeId,
        customerId,
        customerAddressId,
        stylistId,
        marketId,
        predictInstallTime,
        location
      } = this.choseArr[0];
      let data = {
        orderId,
        orderNumber,
        customerContractNumber,
        customerContractId,
        storeId,
        customerId,
        customerAddressId,
        stylistId,
        marketId,
        predictInstallTime,
        location:this.positionId?this.positionId:location,
        installCompleteTime:this.installCompleteTime,
        serveGroupId:this.serveGroupId
      }
      this.btnLoading = true;
      addInstallation(data).then(res=>{
        if(res.status == 200){
          this.$message.success(res.message);
          this.getData();
          this.btnLoading = false;
        }else{
          this.$message.error(res.message)
          this.btnLoading = false;
        }
      }).catch(error=>{
        this.btnLoading = false;
        console.error('提交',error);
      })
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    chooseDelete(val){
      this.choseArr = val;
    },
  },
}
</script>
<style scoped lang="scss">
  .submissionStyle{
    margin-top:10px;
    display: flex;
    width: 100%;
    justify-content: center;
  }
  .procurement{
    display: flex;
    align-items: center;
    width: 200px;
    div{
      width: 200px;
      margin-right:10px;
    }
  }
</style>