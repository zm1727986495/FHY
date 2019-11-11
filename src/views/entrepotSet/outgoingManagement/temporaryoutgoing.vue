<template>
  <div class="temporaryoutgoing">
    <div class="head_nav" ref="topInfo">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="queryBox m-bottom10">
        <div class="qeury_item width-100">
          <el-input placeholder="采购合同号" @keyup.enter.native='getData()' v-model="purchaseContractCode" size="medium"></el-input>
        </div>
        <div class="qeury_item width-100">
          <el-input placeholder="姓名/电话" @keyup.enter.native='getData()' v-model="text" size="medium"></el-input>
        </div>
        <!-- <div class="qeury_item width-100">
          <el-input placeholder="采购合同号/姓名/电话" @keyup.enter.native='getData()' v-model="text" size="medium"></el-input>
        </div> -->
        <div class="qeury_item width-100">
          <div class="btnSty">
          <el-button class="button-fc m-left10" type="warning" size="medium" @click="getData">查询</el-button>
          <el-button class="m-left10" type="primary" size="medium" @click="reset">重置</el-button>
        </div>
        </div>
      </div>


      <!-- <div class="queryBox m-bottom10">
        <div style="width:250px;">
          <el-input placeholder="采购合同号/姓名/电话" @keyup.enter.native='getData()' v-model="text" size="medium"></el-input>
        </div>
        <div class="qeury_item">
          <div class="btnSty">
          <el-button class="button-fc m-left10" type="warning" size="medium" @click="getData">查询</el-button>
          <el-button class="m-left10" type="primary" size="medium" @click="reset">重置</el-button>
        </div>
        </div>
      </div> -->

      <div class="outBox m-bottom10">
        <div class="timeName">
          <span>*</span><el-input placeholder="出库人" v-model="workerStr" size="medium" @focus="openCheckOrgan" class="width-100"></el-input>
        </div>
        <div class="timeName m-left10">
          <span>*</span>
          <el-date-picker v-model="dateTime" size="medium" value-format="yyyy-MM-dd" format="yyyy-MM-dd" type="date" placeholder="选择日期" class="width-100">
          </el-date-picker>
        </div>
      </div>
      <div class="table_list lvs attribute" v-loading='loading'>
        <el-table border style="width: 100%" @selection-change="chooseDelete" :row-class-name="tableRowClassName" :data="tableData">
          <el-table-column align="center" type="selection" fixed="left"></el-table-column>
          <el-table-column align="center" prop="orderNumber" fixed="left" label="订单号" sortable width="170"></el-table-column>
          <el-table-column align="center" prop="factoryContractNo" label="采购合同号" width="170"></el-table-column>
          <el-table-column align="center" prop="orderType" label="订单类型" width="150"></el-table-column>
          <el-table-column align="center" prop="customerName" label="客户姓名" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="customerPhone" label="客户电话" width="130"></el-table-column>
          <el-table-column align="center" prop="address" label="客户地址" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="outboundTypeStr" label="出库状态" width="120"></el-table-column>
          <el-table-column align="center" prop="storeName" label="所属门店" width="130"></el-table-column>
          <el-table-column align="center" prop="outboundTime" label="出库时间" width="160"></el-table-column>
          <el-table-column align="center" prop="userName" label="出库人" width="120"></el-table-column>
        </el-table>
      </div>
    <div class="pagination_wrap">
      <pagination
        :current-page="currentPage"
        :pageSize="pageSize"
        :total="total"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      ></pagination>
    </div>
    </el-card>
    <!-- 借调工人 -->
    <organcheckdia 
      :isType='false' 
      :visible="checkorg_visible"
      v-if="checkorg_visible"
      :defaultArrF="defaultArrF"
      :userListF="userListF"
      @close_org='close_org'
      :title='title'
      @singleFn='singleFn'>
    </organcheckdia>
     <div class="btn">
      <el-button type="primary" @click="handleok" :loading="loadingbtn">提 交</el-button>
      <el-button @click="handleClose">返 回</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb"; //导航
import pagination from "@/views/components/pagination"; //分页
import organcheckdia from "@/views/Installation/dispatchcenter/components/organcheckdia"; //组织机构--多选
import { temporaryOutboundOrderByPage, temporaryOutbound } from "api/entrepotSet/outgoingManagement/outgoingManagement";
export default {
  components:{
    breadcrumb,
    pagination,
    organcheckdia
  },
  data(){
    return{
      navList:[],
      tableData:[],
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
      loading:false,//页面加载
      text: "",//查询条件
      purchaseContractCode:'',//客户合同号
      loadingbtn:false,//按钮提交
      choseArr:[],//勾选
      dateTime:'',
      checkorg_visible:false,
      userListF:[],
      defaultArrF:[],
      workerStr:'',
      userListId:'',//出库人ID
      title:'出库人'
    }
  },
  created() {
    let obj = JSON.parse(localStorage.getItem('loggedObj'));
    this.workerStr = obj.name;
    this.userListId = obj.id;
    this.dateTime = this.getNowFormatDate()
  },
  mounted() {
    this.navList = this.$route.meta;
    this.getData()
  },
  methods: {
    getNowFormatDate() {
      var date = new Date();
      var seperator1 = "-";
      var year = date.getFullYear();
      var month = date.getMonth() + 1;
      var strDate = date.getDate();
      if (month >= 1 && month <= 9) {
          month = "0" + month;
      }
      if (strDate >= 0 && strDate <= 9) {
          strDate = "0" + strDate;
      }
      var currentdate = year + seperator1 + month + seperator1 + strDate;
      return currentdate;
    },
    //打开多选组织机构弹框
    openCheckOrgan() {
      this.checkorg_visible = true;
    },
    close_org(){
      this.checkorg_visible = false;
    },
    //关闭单选组织机构弹框
    singleFn(userListId,checkList){
      this.userListId = userListId;
      this.workerStr = checkList.filter(item=>{
        return item.id == userListId;
      })[0].name
      this.checkorg_visible = false;
    },
    //获取列表
    getData(){
      let data = {
        text:this.text,
        purchaseContractCode:this.purchaseContractCode,
        page: this.currentPage,
        limit: this.pageSize
      }
      temporaryOutboundOrderByPage(data).then(res=>{
        if(res.status == 200){
          this.tableData = res.data.rows;
          this.total = res.data.total;
        }
      }).catch(error=>{
        console.error('获取临时出库列表',error);
      })
    },
    //提交
    handleok(){
      if(this.choseArr.length < 1){
        this.$message.error('当前没有勾选!');
      }else if(this.choseArr.length > 1){
        this.$message.error('只能勾选一个!');
      }else{
        if(this.choseArr[0].status == 1){
          this.$message.error('当前已经出库!');
          return;
        }
        if(!this.userListId){
          this.$message.error('没有选择出库人');
          return
        }
        if(!this.dateTime){
          this.$message.error('没有选择出库时间');
          return
        }
        let data = {
          customerContractId:this.choseArr[0].customerContractId,
          orderId:this.choseArr[0].orderId,
          outboundUserId:this.userListId,
          outboundTime:this.dateTime
        };
        temporaryOutbound(data).then(res=>{
          if(res.status == 200){
            this.$message.success('提交成功!')
            this.getData()
          }
        }).catch(error=>{
          console.error('临时出库提交',error);
        })
      }
    },
    //重置
    reset(){
      this.text = '';
      this.purchaseContractCode = ''
      this.getData()
    },
    handleClose(){
      this.$router.go(-1);
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getData();
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    //勾选
    chooseDelete(val) {
      this.choseArr = val;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
  },
}
</script>
<style lang="scss" scoped>
.temporaryoutgoing{
  .el-date-editor.el-input, .el-date-editor.el-input__inner{
    width: 100%;
  }
  .outBox{
    width: 500px;
    display: flex;
  }
  .timeName{
    display: flex;
    align-items: center;
    color: red;
  }
  .btn {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }

  .btnSty{
    display: flex;
  }
  .queryBox{
    display: flex;
    width: 60%;
    .qeury_item{
      padding: 0 5px;
    }
  }
  
}
</style>