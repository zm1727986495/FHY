
<template>
  <div class="wrapper">
    <div class="apper attribute">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- <div class="pageTitle">查询条件</div> -->
      <el-card class="m-bottom">

        <div class="search_box">
          <div class="search_item">
            <el-input placeholder=" 录入人" @keyup.enter.native="searchFun()" size="meduim" v-model="createAt" maxlength="50"></el-input>
          </div>
          <div class="search_item">
            <el-date-picker  class="width-100" style="width:100%;" size="meduim" v-model="searchData1" type="daterange"
            value-format="yyyy/MM/dd" format="yyyy-MM-dd" range-separator="至" start-placeholder="录入开始日期" end-placeholder="录入结束日期"
            ></el-date-picker>
          </div>
          <div class="search_item">
            <el-input placeholder=" 审批人" @keyup.enter.native="searchFun()" size="medium" v-model="auditAt" maxlength="50"></el-input>
          </div>

          <div class="search_item">
            <el-date-picker size="medium" v-model="searchData2" type="daterange" value-format="yyyy/MM/dd" format="yyyy-MM-dd" 
            style="width:100%;" range-separator="至" start-placeholder="审批开始日期" end-placeholder="审批结束日期"></el-date-picker>
          </div>
          
        </div>
        <div class="search_box_btn">
            <el-button type="warning" class="button-fc " size="medium" @click="searchFun">查询</el-button>
            <el-button type="primary" size="medium" @click="resetFun">重置</el-button>
        </div>
          <!-- 查询条件组 -->
          <!-- <div class="warp_head_list">
            <div class="search_nav" >
                
                <span>
                    录入人：
                </span>
              <div class="head_nav_search m-right20">
                <el-input placeholder=" 录入人" size="meduim" v-model="createAt" maxlength="50"></el-input>
              </div>
              <span>
                    录入时间：
                </span>
              <div class="head_nav_datapick">
                <el-date-picker 
                  size="meduim"
                  v-model="searchData1"
                  type="daterange"
                  value-format="yyyy/MM/dd"
                  format="yyyy-MM-dd"
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </div>
              
            </div>
            <div class="search_nav">
                <span>
                    审批人：
                </span>
              <div class="head_nav_search m-right20">
                <el-input placeholder=" 审批人" size="medium" v-model="auditAt" maxlength="50"></el-input>
              </div>
              <span>
                    审批时间：
                </span>
              <div class="head_nav_datapick">
                <el-date-picker
                  size="medium"
                  v-model="searchData2"
                  type="daterange"
                  value-format="yyyy/MM/dd"
                  format="yyyy-MM-dd"
                  
                  range-separator="至"
                  start-placeholder="开始日期"
                  end-placeholder="结束日期"
                ></el-date-picker>
              </div>
            </div>
            <div class="head_nav_btn">
              <el-button type="warning" class="button-fc " size="medium" @click="searchFun">查询</el-button>
              <el-button type="primary" size="medium" @click="resetFun">重置</el-button>
            </div>
          </div> -->
      </el-card>

      <!-- <ul class="tabtop m-left20"> -->
            <!-- <li v-for="(itm, idx) in tablists" :key="idx" @click="tabclickH(idx)" :class="[tabstatus===idx ? 'checkclass': '']">{{itm}}</li> -->
      <!-- </ul> -->
      <!-- <div v-if="tabstatus === 0" :key="tabstatus">
        </div>
        <div v-if="tabstatus === 1" :key="tabstatus" class="m-top20">
      </div> -->


        <el-tabs @tab-click="tabclickH"  type="border-card">
          <el-tab-pane label="待审批" name="0">

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



              <div class="table_warp_box">
                  <div class="table_list">
                    <el-table
                      border
                      :row-class-name="tableRowClassName"
                      @selection-change="handleSelectionChange"
                      :data="tabList"
                      ref="multipleTable"
                      style="width: 100%;"
                    >
                      <el-table-column type="selection" width="40"></el-table-column>
                      
                      <el-table-column prop="createAt" align="center" label="录入人" sortable :filters=namesOne :filter-method="filterHandler">
                        <template slot-scope="scope">
                          <div>
                                <el-tooltip placement="right" visible-arrow >
                                    <div slot="content"  class="tips tipFon">
                                      <p @click="passHandle(scope.row)" class="operaItems">通过</p>
                                      <p @click="openDia(scope.row)" class="operaItems">退回</p>
                                    </div>
                                    <img :src="spot" alt="" class=" attributesTips">
                                </el-tooltip>
                                <p class="operation">{{scope.row.createAt}}</p>
                              </div>
                        </template>
                      </el-table-column>
                      <el-table-column prop="storeName" align="center" label="所属门店" sortable :filters= stores :filter-method="filterHandler"></el-table-column>
                      <el-table-column prop="serviceTimeId" align="center" label="服务时间段" sortable></el-table-column>
                      <el-table-column prop="serviceTime" align="center" label="服务时长" sortable></el-table-column>
                      <el-table-column prop="servicePopulation" align="center" label="服务人数" sortable></el-table-column>
                      
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
                    <el-dialog :title="Dialogtitle" :visible.sync="centerDialogVisible" width="40%" custom-class="customDialogTitle">
                      <div class="content_box">
                          <div class="left_form">
                              <div class="Dialog_input_cell lastDialog_input_cell">
                                  <span class="Dialog_input_cell_title">备注：</span>
                                  <div class="Dialog_input_cell_input">
                                    <el-input type="textarea" :rows="3" placeholder="请输入内容" maxlength="200" v-model="note"></el-input>
                                  </div>
                              </div>
                          </div>
                      </div>
                      
                      <span slot="footer" class="dialog-footer">
                          <el-button @click="centerDialogVisible = false">取 消</el-button>
                          <el-button type="primary" @click="insertAudit()">确 定</el-button>  
                      </span>
                    </el-dialog>
                </div>
                  </div>
                </div>
          </el-tab-pane>
          <el-tab-pane label="已审批" name="1">
              <div class="table_warp_box">
                  <div class="table_list">
                    <el-table
                      border
                      @selection-change="handleSelectionChange"
                      :row-class-name="tableRowClassName"
                      :data="tabList"
                      style="width: 100%;"
                    >
                      <el-table-column prop="createAt" align="center" label="录入人" sortable :filters=namesOne :filter-method="filterHandler"></el-table-column>
                      <el-table-column prop="storeName" align="center" label="所属门店" sortable></el-table-column>
                      <el-table-column prop="serviceTimeId" align="center" label="服务时间段" sortable></el-table-column>
                      <el-table-column prop="serviceTime" align="center" label="服务时长" sortable></el-table-column>
                      <el-table-column prop="servicePopulation" align="center" label="服务人数" sortable></el-table-column>
                      <el-table-column prop="auditAt" align="center" label="审批人" sortable></el-table-column>
                      <el-table-column prop="auditTime" align="center" label="审批时间" sortable></el-table-column>
                      <el-table-column prop="isTransferCustomer" align="center" label="是否转客户" sortable>
                          <template slot-scope="scope">
                          <span v-if="scope.row.isTransferCustomer==1">是</span>
                          <span v-else>否</span>
                        </template>
                      </el-table-column>
                      <el-table-column prop="status" align="center" label="状态">
                          <template slot-scope="scope">
                          <span v-if="scope.row.status==1">已审批</span>
                        <span v-else-if="scope.row.status==2">已退回</span>
                        <span v-else>未审批</span>
                        
                        </template>
                      </el-table-column>
      
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
import { listFlowAudit,insertFlowAudit } from "api/customermanagement/flowapproval/flowapproval";
import { getNames } from 'src/utils/pubilcFn.js';
import spot from '@/assets/images/spot.png';
import pagination from '../../components/pagination';
export default {
  
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),//按钮权限
      currentPage: 1,//当前页数
      pageSize: 20,//当前页最大条数
      total: 0,//总条数
      spot,//table滑动图标
      names:[],//筛选数据
      stores:[],//筛选数据
      namesOne:[],
      //头部面包屑导航
      navList: [],
      //头部日期1选择
      searchData1: [],
      //日期控件2
      searchData2: [],
      //录入人
      createAt :"",
      //所属门店
      storeId :"",
      //审批人
      auditAt :"",

      //开始结束时间
      startTime: "",
      endTime: "",

      //默认展开的
      opentab:'0',
      // TABLE  页1

      //状态栏切换
      tablists:["待审批","已审批"],
      tabstatus:0,

      //勾选内容
      multipleSelection: [],

      tabList: [
        {
          name: "张三",
          phone: "18879432548",
          brandname: "北京欧派",
          brandtype: "自营",
          type: 1, //0为禁用  1为启用
          id: 1
        },
        {
          name: "张三",
          phone: "18879432548",
          brandname: "北京欧派",
          brandtype: "自营",
          type: 1, //0为禁用  1为启用
          id: 1
        },
        {
          name: "张三",
          phone: "18879432548",
          brandname: "北京欧派1",
          brandtype: "自营",
          type: 1, //0为禁用  1为启用
          id: 1
        },
        {
          name: "张三1",
          phone: "18879432548",
          brandname: "北京欧派",
          brandtype: "自营",
          type: 1, //0为禁用  1为启用
          id: 1
        }
      ],
      //分页
      currentPage: 1,
      totle: 100,
      //查询内容
      searchtext: "",
      Dialogtitle:'',
      centerDialogVisible:false,
      //页面操作按钮list
      actionBtnList: [
        { name: "通过", style: "default",codename:"flowapproval_ok", url: "/addbrand", type: 1 },
        { name: "退回", style: "default",codename:"flowapproval_back", url: "/addbrand", type: 2 }, 
      ],

      // TABLE  页2

      tabList2: [
          // {
          //           'name':'张三',
          //           'phone':'18879432548',
          //           'brandname':'北京欧派',
          //           'brandtype':'自营',
          //           'type':1,//0为禁用  1为启用
          //           'id':1,
          //           "spflag":1,
          //       },
          //          {
          //           'name':'张三',
          //           'phone':'18879432548',
          //           'brandname':'北京欧派',
          //           'brandtype':'自营',
          //           'type':1,//0为禁用  1为启用
          //           'id':1,
          //            "spflag":2,
          //       },
          //          {
          //           'name':'张三',
          //           'phone':'18879432548',
          //           'brandname':'北京欧派',
          //           'brandtype':'自营',
          //           'type':1,//0为禁用  1为启用
          //           'id':1,
          //            "spflag":3,
          //       }
      ],
      //分页
      currentPage2: 1,
      totle2: 100,
      //查询内容
      customShare: false,
      customMove: false,
      //页面操作按钮list
      actionBtnList2: [],

      //弹框的备注信息
      note:"",
    
      //弹框页面数据
      brandInfo: {},
      //选择品牌类型
      DialogbrandList: [
        { label: "自营", value: 1 },
        { label: "合作商", value: 1 }
      ],
      //imglogosrc
      imglogosrc: "",
      //文件上传
      dialogImglist: [],
      flag:true
    };
  },
  activated(){
    this.navList = this.$route.meta;
    this.centerDialogVisible=false;
    this.getListData();
  },
  // deactivated () {
  //   this.$destroy(true)
  // },
  // created(){
  //   //this.names = getNames('name',this.tabList);
  //   //this.stores = getNames('brandname',this.tabList);
  //   //this.namesOne = getNames('brandname',this.tabList);
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  //   this.centerDialogVisible=false;
  //   this.getListData();
  // },
  methods: {
    currentChange(val) {//翻页方法
    
      this.currentPage = val;
      this.getListData();
    },
    sizeChange(val) {//翻页方法
      this.currentPage = 1;
      this.pageSize = val;
      this.getListData();
    },


  
    //勾选事件改变触发
    handleSelectionChange(val) {
        this.multipleSelection = val;
    },



    inte () {
      console.log('21')
    },

    filterHandler(value, row, column) { //筛选方法调用
            const property = column['property'];
            return row[property] === value;                
    },
    tableRowClassName({row, rowIndex}) {//表格斑马线设置
          return rowIndex%2 != 0 ? 'el-f0' : '';
    },


    getInfos(val){
        this.stores = getNames('storeId',val);//调用筛选数据处理
        this.namesOne = getNames('createAt',val);//调用筛选数据处理
    },
    //获取查询列表信息
    getListData() {
      if(this.searchData1 == null){
        this.searchData1 = [];
      }
      if(this.searchData2 == null){
        this.searchData2 = [];
      }
      let data ={
        createAt:this.createAt,
        auditAt:this.auditAt,
        createTimeStart:this.searchData1[0]==undefined?null:this.searchData1[0],
        createTimeEnd:this.searchData1[0]==undefined?null:this.searchData1[1],
        auditTimeStart:this.searchData2[0]==undefined?null:this.searchData2[0],
        auditTimeEnd:this.searchData2[0]==undefined?null:this.searchData2[1],
        storeId:JSON.parse(window.localStorage.getItem("activeStoreId")).storeId,
        auditStatus:this.opentab,   
        page:this.currentPage,                       	
        limit:this.pageSize                      
      }
      //console.log(listFlowAudit);
      listFlowAudit(data).then(res =>{
        if(res.status == "200"){
          this.total=res.data.total;
          this.tabList = res.data.rows;
          this.getInfos(res.data.rows);
        }else{
          this.$message.error('查询失败');
        }
        
      }).catch(error =>{
        console.error('客流量审批_查询列表 customermanagement\flowapproval\index', error) 
      })
    },
    
    //tab页选择
    tabclickH(e) {
      this.opentab = e.name;
      // this.tabstatus = a;
      this.getListData();
    },

    // 改变table头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background: #f8f8f8;border-color: #dddddd";
      }
    },
    //分页函数回调
    handleCurrentChange(val) {
      this.currentPage3 = val;
      this.getData();
    },
    
    //查询按钮点击
    searchFun() {
      this.currentPage = 1 ;
      this.getListData();
    },
    //重置按钮点击  清空页面输入框数据
    resetFun(){
      this.createAt = "";
      this.storeId  = "";
      this.auditAt = "";
      this.searchData1 = [];
      this.searchData2 = [];
      this.searchFun();
    },
    //按钮组函数
    butGroupAction(type) {
      if (type == 1) {
        //通过按钮触发事件
        this.passHandle(this.multipleSelection);
      } else if (type == 2) {
        //页面跳转  开启页面弹窗
        this.openDia(this.multipleSelection);
      } else if (type == 3) {
        //
      }
    },
    //添加新
    addbrand() {
      this.$router.push({ path: "/customermanagement/customeradd"});
    },
    
   
    //开启页面弹窗div
    openDia(val){
      if(val.length == undefined){
        console.log("单个对象的退回操作");
        this.centerDialogVisible=true;
        this.multipleSelection = val;

        console.log(val);
      }else if(val.length == "0"){
        this.$message.error('请勾选后再进行批量操作');
      }else{
        console.log("批量对象的退回操作");
        this.centerDialogVisible=true;
        console.log(val);
      }
      
    },

    //单个通过和批量通过操作
    passHandle(val){
      console.log(val.length);
      if(val.length == undefined){
        console.log("单个对象的通过操作");
        console.log(val.storePassengerFlowId);
        let arr = [];
        arr.push(val.storePassengerFlowId);
        let data = {
          storePassengerFlowId : arr,
          status : 1
        };
        console.log(data);
        insertFlowAudit(data).then(res=>{
          console.log(res);
          if(res.status == "200"){
            this.$message.success('通过操作成功');
            this.getListData();
          }else{
            this.$message.error('通过操作失败');
          }
        }).catch(error =>{
            console.error('客流量审批_查询列表 customermanagement\flowapproval\index', error) 
          })
      }else if(val.length == "0"){
        this.$message.error('请勾选后再进行批量操作');
      }else{
        console.log("批量对象的通过操作");
        console.log(val);
        let arr = [];
        arr = val.map(item=>{
          return item.storePassengerFlowId
        })
        console.log(arr);
        let data = {
          storePassengerFlowId : arr,
          status : 1
        };
        insertFlowAudit(data).then(res=>{
          console.log(res);
          if(res.status == "200"){
            this.$message.success('通过操作成功');
            this.getListData();
          }else{
            this.$message.error('通过操作失败');
          }
        }).catch(error =>{
            console.error('客流量审批_查询列表 customermanagement\flowapproval\index', error) 
          })
        
        
      }
    },


    //单个退回和批量退回操作
    insertAudit(){
      let val = this.multipleSelection;
      console.log(val.length);
      
      if(val.length == undefined){
        console.log(val);
        let arr = [];
        arr.push(val.storePassengerFlowId);
        let data = {
          storePassengerFlowId:arr,
          status:2,
          remarks:this.note
        }
        insertFlowAudit(data).then(res=>{
          this.note = "";
          if(res.status == "200"){
            this.getListData();
            this.$message.success("退回成功");
            this.centerDialogVisible = false;
          }else{
            this.$message.error("退回失败")
          }
          
          

        }).catch(error =>{
            console.error('客流量审批_查询列表 customermanagement\flowapproval\index', error) 
        })
        
      }else{
        
        
        let arr = val.map(item=>{
          return item.storePassengerFlowId
        });
        
        let data = {
          storePassengerFlowId:arr,
          status:2,
          remarks:this.note
        }
        insertFlowAudit(data).then(res=>{
          this.note = "";
          if(res.status == "200"){
            this.centerDialogVisible = false;
            this.getListData();
            this.$message.success("退回成功")
          }else{
            this.$message.error("退回失败")
          }

        }).catch(error =>{
            console.error('客流量审批_查询列表 customermanagement\flowapproval\index', error) 
        })
        

      };
      

    },


     

    //共享
     shareHandle(row){
       this.$router.push({ path: "/customersharing", query: { id: row.id } });
    },
   

  }
};
</script>
<style scoped lang='scss'>
.btn_list{
  display: flex;
  flex-wrap: wrap;
}
.pagination_wrap {
  text-align: center;
  height: 50px;
  /* line-height: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.warp_head_list {
  justify-content: space-between;
}
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
.head_nav_search {
  width: 200px;
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
  width: 80%;
  margin: 0;
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
.attribute{
      position: relative;
}
.search_box{
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.search_box_btn{
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
}
.search_item{
  width: calc(((94vw - 250px))/4);
  margin-bottom:20px;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
}
.input_befor_text{
  min-width: 80px;
  text-align: right;
}
.border_none{
  border: none
}
</style>

