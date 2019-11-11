
<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <el-card class="m-bottom">
         <!-- search_box     search_item -->
         <div class="search_box">
           <div class="search_item">
             <el-input class="width-100" @keyup.enter.native="searchFun()" placeholder=" 请输入客户名称" size="meduim" v-model="brandInfo.customerName"></el-input>
           </div>
           <div class="search_item">
             <el-input class="width-100" @keyup.enter.native="searchFun()" placeholder=" 请输入电话" size="meduim" v-model="brandInfo.customerPhone"></el-input>
           </div>
           <div class="search_item">
             <el-input class="width-100" @keyup.enter.native="searchFun()" placeholder=" 请输入原导购" size="meduim" v-model="brandInfo.sourceAtName"></el-input>
           </div>
           <div class="search_item">
             <el-input class="width-100" @keyup.enter.native="searchFun()" placeholder=" 请输入接收人" size="meduim" v-model="brandInfo.transferAtName"></el-input>
           </div>
           <div class="search_item">
             <el-input class="width-100" @keyup.enter.native="searchFun()" placeholder=" 请输入提交人" size="meduim" v-model="brandInfo.createAtName"></el-input>
           </div>
           <div class="search_item">
             <el-button type="warning" class="button-fc el-button--medium" @click="searchFun">查询</el-button>
             <el-button type="primary" class="el-button--medium" @click="resetFun">重置</el-button>
           </div>
           <div class="search_item"></div>
           <div class="search_item"></div>
         </div>
      </el-card>
      <!-- <ul class="tabtop m-left20">
            <li v-for="(itm, idx) in tablists" :key="idx" @click="tabclickH(idx)" :class="[tabstatus===idx ? 'checkclass': '']">{{itm}}</li>
      </ul> -->
        <!-- <div v-if="tabstatus === 0" :key="tabstatus">
        </div>
        <div v-if="tabstatus === 1" :key="tabstatus" class="m-top20">
        </div> -->
        <el-tabs @tab-click="tabclickH"  type="border-card">
          <el-tab-pane label="待审批" name="0">
            <div class="table_warp_box">
                  <div class="btn_list m-bottom10">
                    <div v-for="(item,index) in actionBtnList" :key="index" >
                      <el-button
                      v-if="btnJurisdiction[item.codename]"
                      type="default"
                      size="small"
                      class="button-96 m-left10 m-top5"
                      @click="butGroupAction(item.type)"
                      >{{item.name}}</el-button>
                    </div>
                  </div>


                  <div class="table_list attribute lvs">
                    <el-table
                      border
                      :row-class-name="tableRowClassName"
                      @selection-change="handleSelectionChange"
                      :data="tabList"
                      ref="multipleTable"
                      style="width: 100%;"
                    >
                      <el-table-column type="selection" width="40"></el-table-column>
                      <el-table-column prop="customerName" width="200" align="center" label="客户名称" sortable :filters=names :filter-method="filterHandler">
                        <template slot-scope="scope">
                          <div>
                            <el-tooltip placement="right" visible-arrow>
                                <div slot="content"  @click="passHandle(scope.row)" class="tips tipFon">
                                  <p class="operaItems" @click="transHandle(scope.row)">通过</p>
                                  <p class="operaItems" @click="editHandle(scope.row)">退回</p>
                                </div>
                                <img :src="spot" alt="" class=" attributesTips">
                              </el-tooltip>
                              <p class="">{{scope.row.customerName}}</p>
                            </div>                                
                        </template>
                      </el-table-column>
                      <el-table-column prop="customerPhone" width="200" align="center" label="客户电话" sortable ></el-table-column>
                      <el-table-column prop="sourceAtName" width="200" align="center" label="原导购" sortable></el-table-column>
                      <el-table-column prop="transferAtName" width="200" align="center" label="接收人" sortable></el-table-column>
                      <el-table-column prop="num" align="center" width="200" label="移交订单数" sortable></el-table-column>
                      <el-table-column prop="transferDatetime" width="200" align="center" label="移交开始时间" sortable></el-table-column>
                      <el-table-column prop="createAtName" width="200" align="center" label="提交人" sortable></el-table-column>
                      <el-table-column prop="createTime" width="200" align="center" label="提交时间" sortable></el-table-column>
                      
                    </el-table>
                    <div class="pagination_wrap">
                        <pagination
                        :current-page="currentPage"
                        :pageSize="pageSize"
                        :total="total"
                        @sizeChange="sizeChange"
                        @currentChange="currentChange">
                        </pagination>
                    </div>
                <div class="dialog_con_box">
                        <el-dialog title="退回原因" :visible.sync="centerDialogVisible" width="40%" custom-class="customDialogTitle">
                          <div class="content_box">
                              <div class="left_form">
                                  <div class="Dialog_input_cell lastDialog_input_cell">
                                      <span class="Dialog_input_cell_title">备注：</span>
                                      <div class="Dialog_input_cell_input">
                                      <el-input
                                      type="textarea"
                                      :rows="3"
                                      v-model="roomks"
                                      placeholder="请输入内容"
                                      maxlength="200"
                                      >
                                      </el-input>
                                      </div>
                                  </div>
                              </div>
                          </div>
                          
                          <span slot="footer" class="dialog-footer">
                              <el-button type="warning" class="button-fc " @click="sendJava()">退 回</el-button>
                              <el-button type="primary" @click="centerDialogVisible = false">取 消</el-button>
                          </span>
                        </el-dialog>
                </div>
                  </div>
                </div>
          </el-tab-pane>
          <el-tab-pane label="已审批" name="3">
            <div class="table_warp_box">
              <div class="table_list attribute lvs">
                <el-table
                  border
                  :row-class-name="tableRowClassName"
                  :data="tabList"
                  style="width: 100%;"
                >
                  <el-table-column width="200" prop="customerName" align="center" label="客户名称" sortable :filters=names :filter-method="filterHandler">
                  </el-table-column>
                  <el-table-column width="200" prop="customerPhone" align="center" label="客户电话" sortable ></el-table-column>
                  <el-table-column width="200" prop="sourceAtName" align="center" label="原导购" sortable></el-table-column>
                  <el-table-column width="200" prop="transferAtName" align="center" label="接收人" sortable></el-table-column>
                  <el-table-column width="200" prop="num" align="center" label="移交订单数" sortable></el-table-column>
                  <el-table-column width="200" prop="transferDatetime" align="center" label="移交开始时间" sortable></el-table-column>
                  <el-table-column width="200" prop="createAtName" align="center" label="提交人" sortable></el-table-column>
                  <el-table-column width="200" prop="createTime" align="center" label="提交时间" sortable></el-table-column>

                </el-table>
                  <div class="pagination_wrap">
                    <pagination
                    :current-page="currentPage"
                    :pageSize="pageSize"
                    :total="total"
                    @sizeChange="sizeChange"
                    @currentChange="currentChange">
                    </pagination>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
    </div>
  </div>
</template>


<script>
import breadcrumb from "../../components/breadcrumb";
import { btnCustomer, listrCustomer } from "api/customermanagement/transfer/transfer";
import { getNames } from 'src/utils/pubilcFn.js';
import spot from '@/assets/images/spot.png';
import pagination from '../../components/pagination';
export default {
  // name: 'brandmanagement',
  components: {
    breadcrumb,
    pagination
  },
  data() {
    return {
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),//按钮权限
      names:[],  //过滤客户名称
      currentPage: 1,//当前页数
      pageSize: 20,//当前页最大条数
      total: 0,//总条数
      navList: [],//导航标签
      spot,
      roomks:'',//弹框备注
      actionBtnList:[
        { name: "审核通过", codename: "transfer_ok", url: "/addbrand", type: 1 },
        { name: "审核退回", codename: "transfer_back", url: "/addbrand", type: 2 }
      ],

      //状态栏切换
      tablists:["待审批","已审批"],
      tabstatus:0,


      centerDialogVisible:false,
      brandInfo:{},
      tabList:[],//获取列表信息
      opentab:'0',//tab选项卡默认参数
      selectVal:[],
      details:'',
      flag:false
    }
  },
  activated(){
    this.getList();
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  // deactivated () {
  //   this.$destroy(true)
  // },
  // created(){
  //   this.getList();
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  // },
  methods: {
    tabclickH(e){//tab选项卡切换方法
        this.opentab = e.name;
        this.getList();
    },

    transHandle(val){//单个通过
      this.listBtn(1,{storeCustomerTransferId:val.storeCustomerTransferId})
    },
    editHandle(val){//单个回退
      this.centerDialogVisible = true;
      this.details=val.storeCustomerTransferId,
      this.flag=true
    },
    currentChange(val) {//翻页方法
      this.currentPage = val;
      this.getList();
    },
    sizeChange(val) {//翻页方法
      this.currentPage = 1;
      this.pageSize = val;
      this.getList();
    },
    listBtn(type,val){//审核（通过或者退回）
    var strId =[];
            Array.isArray(val) ? strId = val : strId.push(val);
            strId = strId.map(item => {
                return Number(item.storeCustomerTransferId)
            });
            let data = {
                storeCustomerTransferIds: strId,
               auditStatus: type
            };
            console.log(data);
      type == 2 ? data.auditReason = this.roomks : null;
      btnCustomer(data).then(res =>{
        this.centerDialogVisible = false;
        this.getList();
        this.$message({message: '操作成功',type: 'success'});
      }).catch(error =>{
        this.$message.error({message: '操作失败'});
      })
    },

    //过滤的方法
    filterHandler(value, row, column) { //筛选方法调用
        const property = column['property'];
        return row[property] === value;                
    },

    getInfos(val){
        this.names = getNames('customerName',val);//调用筛选数据处理
    },



    handleSelectionChange(val){//table勾选事件
      this.selectVal = val;
        
    },
    butGroupAction(type){
      if(this.selectVal.length==0){
        this.$message.error('请勾选内容后再进行操作')
        return
      }
      if (type == 1) {
        this.listBtn(1,this.selectVal);
      }else {
        this.roomks ='';
        this.centerDialogVisible = true;
        this.flag=false
      }
    },
    //重置
    resetFun(){
      this.brandInfo = {};
      this.currentPage = 1;
      this.searchFun();
    },
    getList(){//获取列表
      let data={
        storeId:JSON.parse(window.localStorage.getItem("activeStoreId")).storeId,
        ...this.brandInfo,
        auditStatus:this.opentab,
        page:this.currentPage,
        limit:this.pageSize
      }
      listrCustomer(data).then(res =>{
          this.tabList = res.data.rows;
          this.total=res.data.total
          this.getInfos(res.data.rows);
      }).catch(error =>{
          console.error('客户移交审批查询列表 customermanagement\transfer\transfer.vue', error)
      })
    },
    
    searchFun(){
      this.currentPage = 1;
      this.getList()
    },
    sendJava(){
      if(this.flag){
        this.listBtn(2,{storeCustomerTransferId:this.details});
      }else{
        this.listBtn(2,this.selectVal);
      }
    },
    passHandle(val){
      console.log(1);
    },
    tableRowClassName({row, rowIndex}) {//表格斑马线设置
        return rowIndex%2 != 0 ? 'el-f0' : '';
    },
  },
};
</script>
<style scoped lang='scss'>
.btn_list{
  display: flex;
  flex-wrap: wrap;
}
.title_nav{
  margin: 20px;
}
.felxHead{
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.pagination_wrap {
  text-align: center;
  height: 50px;
  /* line-height: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
/* .warp_head_list {
  justify-content: space-between;
} */
.search_nav {
  display: flex;
  align-items: center;
  justify-content: flex-start;
}
.table_action_span {
  color: rgb(127, 221, 228);
  cursor: pointer;
}
.pageTitle {
  height: 50px;
  line-height: 50px;
  font-size: 20px;
  /* border-bottom: 1px solid #ddd; */
  margin-bottom: 10px;
}
.tabel_page_box {
  position: relative;
  margin-top: 10px;
}
.left_fix_table {
  position: absolute;
  right: 10px;
  top: 8px;
}
.dialog_con_box {
}
.dialog_con_box .content_box {
  display: flex;
  flex-wrap: nowrap;
}
.dialog_con_box .left_form {
  width: 100%;
}
.dialog_con_box .right_logo {
  width: 40%;
}
.Dialog_input_cell {
  display: flex;
  flex-wrap: nowrap;
  height: 50px;
  align-items: center;
}
.left_form > .lastDialog_input_cell {
  display: flex;
  flex-wrap: nowrap;
  height: 100px;
  align-items: top !important;
}
.dialog_con_box .Dialog_input_cell .Dialog_input_cell_title {
  width: 100px;
  text-align: right;
  padding-right: 10px;
}
.Dialog_input_cell_input {
  flex: 1;
}
.right_logo .img_logo {
  width: 150px;
  height: 150px;
  margin: auto;
  background-color: #dddddd;
  overflow: hidden;
}
.right_logo .img_logo img {
  width: 100%;
}
.upload_logo {
  text-align: center;
  padding: 10px 0px;
}
.tabtop{
    position: absolute;
    margin-top: 50px;
    // top: -27px;
    // left: 0px;
    transform: translate(-20px, -47px);
    display: flex;
    font-size: 14px;
    background: #006EC7;
    border-radius: 5px 5px 0px 0px;
    border-bottom: none;
    cursor:pointer;
    li{
      padding: 5px 8px;
      color: #ffffff;
      transition: 1s all;
      height: 100%;
    }
    .checkclass{
      background: #ffffff;
      color: #333;
      border-radius: 5px 5px 0px 0px!important;
      transition: 1s all;
      border-bottom: none;
    }
}
.collapse_input_cell_box {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;   
  justify-content:space-around;
}
.input_befor_text{
  min-width: 80px;
  text-align: right;
}
.input_after_div{
  flex:1;
  margin-right: 15px;
  .el-input{
    width:100%
  }
}
.wid20{
  width: 20vw !important;
}
.head_nav_btn{
  width: 20vw;
}
.border_none{
  border: none
}
.search_box{           
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.search_item{
  width: calc(((94vw - 250px))/4);
  margin-bottom:20px;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  // justify-content: center;
  align-items: center;
}

</style>

