<template>
  <div class="measuremanage">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="lvs">
      <div class="measuremanage_search">
        <div class="search_box">
          <div class="search_item">
            <el-input placeholder="订单编号/客户合同号/客户姓名/客户电话/订单地址" @keyup.enter.native="searchFun()" v-model="manInfo.names" size="medium" maxlength="50"></el-input>
          </div>
          <div class="search_item">
            <el-date-picker size="medium" v-model="searchData" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
            format="yyyy-MM-dd HH:mm:ss" range-separator="-" start-placeholder="年-月-日" end-placeholder="年-月-日" width="100%"></el-date-picker>
          </div>
          <div class="search_item">
            <el-select class="width-100" v-model="manInfo.status" placeholder="选择状态" size="medium">
              <el-option v-for="item in stateList" :key="item.assignedType" :label="item.label" :value="item.assignedType"></el-option>
            </el-select>
          </div>
          <div class="search_item">
            <el-select class="width-100" v-model="manInfo.commodityCategoryId" placeholder="品类" size="medium">
              <el-option v-for="item in typeList" :key="item.commodityCategoryId" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
            </el-select>
          </div>
          <div class="search_item" v-if="showInput">
            <el-select class="width-100" v-model="manInfo.orderChannel" placeholder="选择订单渠道" size="medium">
              <el-option v-for="item in channelList" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="search_item" v-if="showInput">
            <el-select class="width-100" v-model="manInfo.storeId" placeholder="选择所属门店" size="medium">
              <el-option v-for="item in dotList" :key="item.storeId" :label="item.storeName" :value="item.storeId"></el-option>
            </el-select>
          </div>
          <div class="search_item" v-if="showInput">
            <el-select class="width-100" v-model="manInfo.businessId" placeholder="选择销售员" size="medium">
              <el-option v-for="item in salespersonList" :key="item.designerId" :label="item.designerName" :value="item.designerId"></el-option>
            </el-select>
          </div>
          <div class="search_item" v-if="showInput">
            <el-select class="width-100" v-model="manInfo.orderSourceId" placeholder="选择订单来源" size="medium">
              <el-option v-for="item in fromList" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="search_item" v-if="showInput">
            <el-select class="width-100" v-model="manInfo.surveyor" placeholder="选择测量员" size="medium">
              <el-option v-for="item in surveyorlist" :key="item.designerId" :label="item.designerName" :value="item.designerId"></el-option>
            </el-select>
          </div>
          <div class="search_item" v-if="showInput">
            <el-select class="width-100" v-model="manInfo.sesigner" placeholder="选择设计师" size="medium">
              <el-option v-for="item in designerlist" :key="item.designerId" :label="item.designerName" :value="item.designerId"></el-option>
            </el-select>
          </div>
        </div>
        <div class="sear_btn">
          <div :class="[{'head_nav_btn': !showInput},'head_nav_datapick']">
            <span class="cursors gengd" @click="fontClick()">{{showInput ? '收起' : '更多'}}</span>
            <el-button @click="searchFun" type="warning" class="button-fc" size="medium">查询</el-button>
            <el-button @click="resetFun" type="primary" size="medium">重置</el-button>
          </div>
        </div>
      </div>
      <div class="h-width"></div>
      <div class="order-btn-list">
        <!-- <el-button size="small" class="button-96" @click="addFun">查看</el-button> -->
        <el-button v-if="btnJurisdiction.measuremanage_Assign" size="small" class="button-96" @click="downFun">指派测量设计</el-button>
        <!-- <el-button size="small" class="button-96" @click="importhFun">变更测量设计</el-button> -->
        <el-button v-if="btnJurisdiction.measuremanage_Door" size="small" class="button-96" @click="salesmanFun">确认上门时间</el-button>
        <el-button v-if="btnJurisdiction.measuremanage_Measure" size="small" class="button-96" @click="mechanismFun">测量汇报</el-button>
        <el-button v-if="btnJurisdiction.measuremanage_Design" size="small" class="button-96" @click="saleFun">设计汇报</el-button>
        <el-button v-if="btnJurisdiction.measuremanage_Enclosure" size="small" class="button-96" @click="seeannexfun">附件查看</el-button>
        <el-button v-if="btnJurisdiction.measuremanage_Receive" size="small" class="button-96" @click="receiveFn">接受</el-button>
        <el-button v-if="btnJurisdiction.measuremanage_Refuse" size="small" class="button-96" @click="refuseFn">拒绝</el-button>
      </div>
      <div class="order_table">
        <el-table border ref="tableMulti" :data="tableData" style="width: 100%" 
          :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :max-height="maxHeight">
          <el-table-column type="selection" align="center" width="55" fixed="left" ></el-table-column>
          <el-table-column prop="assignedNumber" align="center" label="任务编号" sortable fixed="left" width="115" show-overflow-tooltip>
            <template slot-scope="scope">
              <div><p class="table_action_span" @click="addFun(scope.row)">{{scope.row.assignedNumber}}</p></div>
            </template>
          </el-table-column>
          <el-table-column prop="status" align="center" label="状态" width="130">
            <template slot-scope="scope">
              <div class="statusStyle">
                <p v-if="scope.row.status==0">待接受</p>
                <p v-if="scope.row.status==1">拒绝</p>
                <p v-if="scope.row.status==2">待汇报</p>
                <p v-if="scope.row.status==3">已汇报</p>
                <i class="many" v-if="scope.row.reports==1"></i>
                <i class="manyStyle" v-if="scope.row.reports==1">多</i>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="assignedType" align="center" label="任务类型" width="90">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.row.assignedType==0">测量任务</p>
                <p v-if="scope.row.assignedType==1">设计任务</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="customerName" align="center" label="客户姓名" width="90" show-overflow-tooltip></el-table-column>
          <el-table-column prop="customerPhone" align="center" label="客户电话" width="110"></el-table-column>
          <el-table-column prop="customerAdress" align="center" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
          <el-table-column prop="assignedName" align="center" label="指派人" width="90"></el-table-column>
          <el-table-column prop="assignedTime" align="center" label="指派时间" width="160"></el-table-column>
          <el-table-column prop="measureAssignedTime" align="center" label="指派测量时间" width="160"></el-table-column>
          <el-table-column prop="designAssignedTime" align="center" label="指派设计时间" width="160"></el-table-column>
          <el-table-column prop="orderNumber" align="center" label="订单编号" width="130">
            <template slot-scope="scope">
              <div class="table_action_span" @click="orderdetails(scope.row)"
              >{{scope.row.orderNumber}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="createName" align="center" label="创建人" width="90"></el-table-column>
          <el-table-column prop="createTime" align="center" label="创建时间" width="180"></el-table-column>
          <el-table-column prop="orderTypeName" align="center" label="订单类型" width="120"></el-table-column>
          <el-table-column prop="orderGoodsType" align="center" label="货品类型" width="120">
            <template slot-scope="scope">
              <div v-if="scope.row.orderGoodsType == 1">成品</div>
              <div v-if="scope.row.orderGoodsType == 2">定制</div>
            </template>
          </el-table-column>
          <el-table-column prop="brandName" align="center" label="品牌" width="80"></el-table-column>
          <el-table-column prop="categoryName" align="center" label="品类" width="80"></el-table-column>
          <el-table-column prop="reportedTypeName" align="center" label="报备类型" width="100"></el-table-column>
          <el-table-column prop="otherPhone" align="center" label="备用电话" width="150"></el-table-column>
          <el-table-column prop="salesmanName" align="center" label="销售员" width="100"></el-table-column>
          <el-table-column prop="surveyorName" align="center" label="测量员" width="100"></el-table-column>
          <el-table-column prop="designerName" align="center" label="设计师" width="100"></el-table-column>
          <el-table-column prop="actuallyTime" align="center" label="实际上门时间" width="160"></el-table-column>
          <el-table-column prop="measureReportTime" align="center" label="测量汇报时间" width="160"></el-table-column>
          <el-table-column prop="designReportTime" align="center" label="设计汇报时间" width="160"></el-table-column>
          <el-table-column prop="storeName" align="center" label="所属门店" width="130" show-overflow-tooltip></el-table-column>
          <el-table-column prop="orderRemark" align="center" label="订单备注" width="200" show-overflow-tooltip></el-table-column>
        </el-table>
      </div>
      <!-- <div class="pagination_wrap">
        <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange"
          :current-page="currentPage" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total"
        ></el-pagination>
      </div> -->
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

    <el-dialog title="拒绝" :visible.sync="isRefuse" width="600px" custom-class="customDialogTitle"
      :before-close="handleClose">
      <div class="refuseStyle">
        <p><span>*</span>拒绝原因：</p>
        <el-input resize="none" type="textarea" :rows="2" placeholder="请输入内容" v-model="textarea"></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="determineFn">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 确认上门时间按钮 -->
    <measuredoortime
      v-if="measuredoorval"
      :dialogvisible="measuredoorval"
      :assignmeasuredata="assignmeasuredata"
      @measuredoorfun="measuredoorfun"
    ></measuredoortime>

    <!-- 指派测量设计 -->
    <assignmeasure
      v-if="assignmeasureval"
      ref="assignmeasure"
      :dialogvisibletwo="assignmeasureval"
      :asssinstatus="asssinstatus"
      :assignmeasuredata="assignmeasuredata"
      @assignmeasurefun="assignmeasurefun"
      @getDataFun="getData"
    ></assignmeasure>
    <orderlist
      v-if="isorderList"
      :isorderList="isorderList"
      @orderListfun="orderListfun"
      @assignmeasure="assignmeasure"
    ></orderlist>

    <!-- 变更测量设计 -->
    <changeassign
      :dialogvisibletwo="ischangeassign"
      @assignmeasurefun="assignmeasurefun"
      ref="changeassign"
    ></changeassign>

    <!-- 查看附件 -->
    <el-dialog :visible.sync="seeannexval" width="960px">
      <div>
        <accessory :orderId="orderId" :accessoryTypes="accessoryTypes"></accessory>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  listOrderAssignedMeasureByUser,
  getOrderDetailAssignedVO,
  editOrderAssignedMeasure,
  listBaseDict,
  listOrganizationStore,
  getDesignerList,
  listCategory,
  editAssignedMeasure
} from "api/order/measuremanage/measuremanage";
import pagination from "@/views/components/pagination";
import spot from "@/assets/images/spot.png";
import breadcrumb from "@/views/components/breadcrumb";
import measuredoortime from "@/views/components/measuredoortime";
import assignmeasure from "@/views/components/assignmeasure";
import addmeasurereport from "./components/addmeasurereport"; //添加测量汇报
import changeassign from "./components/changeassign"; //变更测量设计
import orderlist from "./components/orderlist"; //订单列表
import addesign from "./components/addesign"; //添加设计汇报
import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"; //附件管理组件引入
import { mapGetters } from 'vuex'
export default {
  components: {
    breadcrumb,
    measuredoortime,
    assignmeasure,
    addmeasurereport,
    addesign,
    accessory,
    orderlist,
    changeassign,
    pagination
  },
  data() {
    return {
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      orderId: "",
      accessoryTypes: 3,
      showInput: false,
      manInfo: {},
      value: "",
      checkdata: [],
      asssinstatus: 1, //指派上门状态：1、指派 2、变更
      measuredoorval: false, //确认上门时间开关
      assignmeasureval: false, //指派测量设计开关
      ischangeassign: false, //变更测量
      isorderList: false, //指派测量设计开关
      assignmeasuredata: {},
      seeannexval: false, //查看附件开关
      isRefuse: false, //拒绝
      textarea: "", //拒绝原因
      navList: [],
      spot,
      searchtext: "", // 条件搜索
      // 时间搜索
      searchData: [],
      stateList: [
        { assignedType: "0", label: "待接受" },
        { assignedType: "1", label: "拒绝" },
        { assignedType: "2", label: "待汇报" },
        { assignedType: "3", label: "已汇报" }
      ], // 状态条件
      typeList: [], // 类别条件
      channelList: [], //渠道条件
      dotList: [], // 门店列表
      surveyorlist: [], //测量员
      designerlist: [], //设计师
      salespersonList: [], // 销售员列表
      fromList: [], //来源列表
      tableData: [],
      multipleSelection: [],
      isShow: true,
      //分页
      total: 0, // 总数
      page: 0, // 页数
      pageSize: 10, // 单页条数
      currentPage: 1 // 当前页
    };
  },
  computed: {
    ...mapGetters(['maxHeight'])
  },
  activated(){
    this.getData();

     // 头部面包屑
    this.navList = this.$route.meta;
    this.getOrderchannel();
    this.getOrdersource();
    this.getAffiliatedstore();
    this.getAllList();
    this.getlistCategory();
  },
  // deactivated () {
  //   this.$destroy(true)
  // },
  // created() {
  //   this.getData();
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  //   this.getOrderchannel();
  //   this.getOrdersource();
  //   this.getAffiliatedstore();
  //   this.getAllList();
  //   this.getlistCategory();
  // },
  methods: {
    getlistCategory() {
      listCategory()
        .then(res => {
          this.typeList = res.data;
        })
        .catch(error => {
          console.error("获取品类/产品类别列表", error);
        });
    },
    getRowKeys(row) {
      return row.assignedMeasureId;
    },
    //获取本门店下所有的设计员、测量员、销售员
    getAllList() {
      getDesignerList({ dataCode: "G080" }).then(res => {
        this.designerlist = res.data.rows;
      });
      getDesignerList({ dataCode: "G271" }).then(res => {
        this.surveyorlist = res.data.rows;
      });
      getDesignerList({ dataCode: "G070" }).then(res => {
        this.salespersonList = res.data.rows;
      });
    },
    //获取所属门店
    getAffiliatedstore() {
      listOrganizationStore()
        .then(res => {
          this.dotList = res.data;
        })
        .catch(error => {
          console.error("获取所属门店", error);
        });
    },
    //获取订单渠道
    getOrderchannel() {
      let data = {
        dataType: "ORDER_CHANNEL"
      };
      listBaseDict(data).then(res => {
        this.channelList = res.data;
      });
    },
    //订单来源
    getOrdersource() {
      let data = {
        dataType: "ORDER_SOURCE"
      };
      listBaseDict(data).then(res => {
        this.fromList = res.data;
      });
    },
    //获取列表
    getData() {
      (this.manInfo.page = this.currentPage),
        (this.manInfo.limit = this.pageSize);
      this.manInfo.startTime = this.searchData[0];
      this.manInfo.endTime = this.searchData[1];
      listOrderAssignedMeasureByUser(this.manInfo)
        .then(res => {
          if (res.status == 200) {
            this.total = res.data.total;
            this.tableData = res.data.rows;
          }
        })
        .catch(error => {
          console.error("指派测量:指派测量列表", error);
        });
    },
    //订单详情
    orderdetails(val) {
      this.$router.push({
        path: "/ordermm/details",
        query: { orderId: val.orderId, orderNumber: val.orderNumber }
      });
    },
    //搜索
    searchFun() {
      this.currentPage = 1;
      this.getData();
    },
    fontClick() {
      this.showInput = !this.showInput;
    },
    seeannexfun() {
      if (this.checkfun()) {
        this.seeannexval = true;
        this.orderId = this.checkdata[0].orderId;
      }
    },
    //接受
    receiveFn() {
      if (this.checkdata.length < 1) {
        this.$message.error("当前未勾选!");
        return;
      }

      this.$confirm("是否作接受条信息?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arr = [];
          if (this.checkdata.length == 1) {
            if (this.checkdata[0].status != 0) {
              this.$message.error("当前状态不能接受!");
              return;
            }
          }
          this.checkdata.forEach(item => {
            if (item.status == 0) {
              arr.push({
                orderId: item.orderId,
                assignedMeasureId: item.assignedMeasureId,
                assignedType: item.assignedType
              });
            }
          });
          if (arr.length == 0) {
            this.$message.error("当前状态不能接受!");
            return;
          }
          let data = {
            status: 2,
            acceptDTOS: arr
          };
          editAssignedMeasure(data)
            .then(res => {
              if (res.status == 200) {
                this.$message.success("接受成功!");
                this.getData();
                this.$refs.tableMulti.clearSelection();
              } else {
                this.$message.error(res.message);
              }
            })
            .catch(error => {
              console.error("接受", error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    //拒绝
    refuseFn() {
      if (this.checkdata.length < 1) {
        this.$message.error("当前未勾选!");
        return;
      }
      // if (this.checkdata.length == 1) {
      //   if (this.checkdata[0].status == 0||this.checkdata[0].status == 2) {
      //     this.isRefuse = true;
      //   }else{
      //     this.$message.error("当前状态不能拒绝!");
      //   }
      // }
      
      if(this.checkdata.length>=1){
       let arr=this.checkdata.every(item=>{
          return item.status == 0||item.status == 2
        })
        if(!arr){
          this.$message.error('当前有状态不能拒绝!')
          return
        }else{
          this.isRefuse = true;
        }
      }

      
    },
    //拒绝确定
    determineFn() {
      if (!this.textarea) {
        this.$message.error("没有填写拒绝原因!");
        return;
      }
      let arr = [];
      
      this.checkdata.forEach(item => {
        if (item.status == 0||item.status==2) {
          arr.push({
            orderId: item.orderId,
            assignedMeasureId: item.assignedMeasureId,
            assignedType: item.assignedType
          });
        } else {
          this.$message.error("有状态不能拒绝!");
        }
      });
      if (arr.length == 0) {
        this.$message.error("当前状态不能拒绝!");
        return;
      }
      let data = {
        status: 1,
        acceptDTOS: arr,
        returnReason: this.textarea
      };
      console.log(data);
      editAssignedMeasure(data)
        .then(res => {
          if (res.status == 200) {
            this.$message.success("拒绝成功!");
            this.getData();
            this.textarea = "";
            this.$refs.tableMulti.clearSelection();
            this.isRefuse = false;
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(error => {
          console.error("拒绝", error);
        });
    },
    //拒绝取消
    handleClose() {
      this.isRefuse = false;
      this.textarea = "";
    },
    // 判断选中
    checkfun() {
      if (this.checkdata.length === 0) {
        this.$message({
          message: "请选择订单",
          type: "warning"
        });
        return false;
      } else if (this.checkdata.length > 1) {
        this.$message({
          message: "只能选择一条数据",
          type: "warning"
        });
        return false;
      } else {
        return true;
      }
    },
    handleSelectionChange(val) {
      this.checkdata = val;
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    resetFun() {
      // 重置
      this.manInfo = {};
      this.searchtext = ""; // 条件搜索
      this.searchData = [];
    },
    //详情
    addFun(row) {
      console.log(row);
      this.$router.push({
        path: "seemeasure",
        query: {
          assignedMeasureId: row.assignedMeasureId,
          assignedType: row.assignedType,
          orderId: row.orderId
        }
      });
    },
    downFun() {
      // 指派测量设计
      this.isorderList = true;
    },
    assignmeasurefun() {
      this.assignmeasureval = false;
      this.ischangeassign = false;
    },
    assignmeasure(obj) {
      getOrderDetailAssignedVO(obj)
        .then(res => {
          if (res.status === 200) {
            this.assignmeasuredata = res.data;

            this.$refs.assignmeasure.staff(res.data.storeId);

            this.asssinstatus = 1;
          }
        })
        .catch(error => {
          console.error("指派测量:指派测量设计获取订单信息", error);
        });

      // }
      this.assignmeasureval = true;
    },
    orderListfun() {
      this.isorderList = false;
    },
    importhFun() {
      // 变更测量设计
      if (this.checkfun()) {
        this.ischangeassign = true;
        this.$refs.changeassign.staff(this.checkdata[0]);
        this.asssinstatus = 2;
      }
    },
    // 确认上门时间按钮
    salesmanFun() {
      if (this.checkfun()) {
        if (this.checkdata[0].status == 2) {
          if (this.checkdata[0].assignedType != 0) {
            this.$message.error("只有测量任务才能确认上门!");
            return;
          }
          let obj = {
            assignedMeasureId: this.checkdata[0].assignedMeasureId,
            orderId: this.checkdata[0].orderId
          };
          getOrderDetailAssignedVO(obj)
            .then(res => {
              if (res.status === 200) {
                this.assignmeasuredata = res.data;
                this.measuredoorval = true;
              }
            })
            .catch(error => {
              console.error("指派测量:指派测量设计获取订单信息", error);
            });
        } else {
          this.$message.error("待汇报状态才能确认上门!");
        }
      }
    },
    // 确认上门时间弹框隐藏事件
    measuredoorfun() {
      this.measuredoorval = false;
    },
    mechanismFun() {
      // 测量汇报
      if (this.checkfun()) {
        if (this.checkdata[0].assignedType != "0") {
          this.$message.error("当前类型无法测量");
          return;
        }
        if (this.checkdata[0].status == 2) {
          //指派单id & 客户id
          this.$router.push({
            path: "/ordermm/measuredetails",
            query: {
              id: this.checkdata[0].assignedMeasureId,
              customerId: this.checkdata[0].customerId,
              orderId: this.checkdata[0].orderId,
              storeId: this.checkdata[0].storeId,
              customerAddressId: this.checkdata[0].customerAddressId
            }
          });
        } else {
          this.$message.error("当前状态无法测量!");
        }
      }
    },
    // 设计汇报
    saleFun() {
      if (this.checkfun()) {
        if (this.checkdata[0].assignedType != "1") {
          this.$message.error("当前类型无法设计!");
          return;
        }
        if (this.checkdata[0].status == 2 || this.checkdata[0].status == 3) {
          this.$router.push({
            path: "/ordermm/designdetails",
            query: {
              id: this.checkdata[0].assignedMeasureId,
              orderId: this.checkdata[0].orderId
            }
          });
        } else {
          this.$message.error("当前状态无法设计!");
        }
      }
    },
    // 表格行样式
    tableRowStyle({ row, rowIndex }) {
      return row.isTovoid != "-" ? "color:#e1a6ac" : "";
    },
    // 显示隐藏搜索
    hideSearch() {
      this.isShow = !this.isShow;
      // console.error('111', this.isShow);
    },
    sizeChange(val) {
      //翻页方法
      this.currentPage = 1;
      this.pageSize = val;
      this.getData();
    },
    currentChange(val) {
      //翻页方法
      this.currentPage = val;
      this.getData();
    },
    // //分页函数回调
    // handleCurrentChange(val) {
    //   this.currentPage = val;
    //   this.getData();
    // },
    // // 单页条数改变
    // handleSizeChange(val) {
    //   this.pageSize = val;
    //   this.currentPage = 1;
    //   this.getData();
    // }
  }
};
</script>
<style scoped lang="scss">
.measuremanage {
  .measuremanage_search{
    display: flex;
    .search_box {
      flex: 1;
      display: flex;
      flex-flow: row wrap;
      // justify-content: space-between;
      .search_item {
        padding: 0px 5px;
        margin-bottom: 10px;
        box-sizing: border-box;
        // width: calc(((94vw - 250px)) / 5);
        width: 25%;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        span {
          min-width: 80px;
          text-align: right;
        }
        .fontMore {
          color: #d0cfcf;
        }
      }
    }
    .sear_btn{
      width: 200px;
      .gengd{
        color: #d0cfcf;
      }
    }
  }
  .h-width{
    margin-top: 0px;
  }
  .statusStyle {
    position: relative;
  }
  .manyStyle {
    position: absolute;
    right: 6px;
    top: 0;
    color: #fff;
    width: 20px;
    height: 20px;
    font-size: 15px;
    font-style:normal;
    font-family: "宋体";
  }
  .many {
    position: absolute;
    right: 10px;
    top: 0px;
    display: block;
    width: 14px;
    height: 25px;
    background-color: #00479d;
  }

  .many:before {
    content: "";
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    right: 14px;
    border-width: 11px 7px;
    border-style: solid;
    border-color: transparent #00479d transparent transparent;
  }

  .many:after {
    content: "";
    display: block;
    position: absolute;
    width: 0;
    height: 0;
    left: 14px;
    border-width: 11px 7px;
    border-style: solid;
    border-color: transparent transparent transparent #00479d;
    top: 0;
  }

  .refuseStyle {
    display: flex;
    p {
      min-width: 80px;
      span {
        color: red;
      }
    }
  }
  .el-icon-search {
    width: 36px;
    background: #d0cfcf;
    border-radius: 0 4px 4px 0;
    transform: translateX(5px);
  }
  .el-icon-search::before {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background: url(../../../assets/images/search.png) no-repeat center center;
    background-size: 15px 15px;
  }
  .el-range-separator {
    color: #bfbfbf;
  }
  .list_top,
  .list_bottom {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
  }
  .list_top {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    // justify-content: space-between;
    > div {
      margin: 10px 0px;
      padding: 0px 5px;
      width: 25%;
      > div {
        width: 100%;
      }
    }
    .head_nav_btn {
      width: 100%;
      text-align: center;
      margin-bottom: 0px;
      .fontMore {
        color: #d0cfcf;
      }
      .btnone {
        margin-left: 10px;
      }
    }
    .margright {
      margin-right: 5px;
    }
    .head_nav_datapick {
      .fontMore {
        color: #d0cfcf;
      }
      .btnone {
        margin-left: 10px;
      }
    }
  }

  .list_bottom {
    margin-top: 20px;
  }
  .head_nav_datapick .el-date-editor {
    width: 100%;
  }
  .head_nav_datapick .el-date-editor .el-range__icon {
    width: 36px;
    position: absolute;
    right: 0;
    top: 0;
    background: #d0cfcf;
    border-radius: 0 4px 4px 0;
  }
  .head_nav_datapick .el-date-editor .el-range__icon::before {
    content: "";
    display: block;
    width: 100%;
    height: 100%;
    background: url(../../../assets/images/time.png) no-repeat center center;
  }
  .head_nav_select {
    width: 170px;
    margin: 5px;
  }
  .reset_btn {
    background: none;
    color: #f2c27b;
    border: 1px solid #f2c27b;
  }
  .m-right {
    width: 10%;
    float: right;
    height: 100%;
    position: relative;
  }
  .order-btn-list {
    margin-bottom: 10px;
  }
  .order-btn-list .blue {
    background: #96bdde;
    color: #fff;
    width: 100px;
    padding-left: 0;
    padding-right: 0;
  }
  .order_table {
    width: 100%;
  }
  .order_table .el-tooltip {
    text-align: center;
  }
  .order_table .cell {
    text-align: center;
  }
  .text {
    float: left;
  }
  .attributesTips {
    transform: translateX(-25px);
  }
  .discount,
  .emergency {
    color: #fff;
    text-align: center;
    width: auto;
    height: 20px;
    line-height: 20px;
    font-size: 12px;
    border-radius: 20px;
    box-sizing: border-box;
    /* border: 1px solid rgba(64,158,255,.2);
            border-color: red; */
    white-space: nowrap;
    margin: 0;
    padding: 2px 5px;
    background: #e92a2a;
    float: right;
    margin: 0 1px;
    display: flex;
    align-items: center;
  }
  .el-tag--aa {
    color: #000;
    text-align: center;
    width: unset;
    height: 32px;
    line-height: 30px;
    font-size: 12px;
    border-radius: 0;
    box-sizing: border-box;
    border: unset;
    white-space: nowrap;
    margin: 0;
    padding: 0;
    background: none;
  }
  .el-tag--bb {
    color: #e1a6ac;
    text-align: center;
    width: 32px;
    height: 32px;
    line-height: 30px;
    font-size: 12px;
    border-radius: 50%;
    box-sizing: border-box;
    border: 1px solid rgba(64, 158, 255, 0.2);
    border-color: #e1a6ac;
    white-space: nowrap;
    margin: 0;
    padding: 0;
    background: none;
  }
  .pagination_wrap .btn-prev {
    background: #efefef;
  }
  .pagination_wrap .el-pagination .btn-next,
  .pagination_wrap .el-pagination .btn-prev {
    background: #efefef;
  }
  .pagination_wrap .el-pager li {
    background: #efefef;
    margin: 0 5px;
    border-radius: 4px;
  }
  .pagination_wrap .el-pager li.active {
    background: #96bdde;
    color: #fff;
  }

  .measurereportbox {
    padding: 0px 40px;
  }
}
</style>