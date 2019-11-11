<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- <div class="pageTitle">查询条件</div> -->
      <!-- 查询条件组 -->
      <el-card class="m-bottom">
        <div class="search_box">
          <div class="search_item fl">
            <el-input class="width-100" :size="size" placeholder="客户姓名" @keyup.enter.native="searchFun()" v-model="manInfo.customerName" maxlength="50" style="display:inline-block;flex:1"></el-input>
          </div>

          <div class="search_item fl">
            <el-input class="width-100" :size="size" placeholder="客户电话" @keyup.enter.native="searchFun()" v-model="manInfo.customerPhone" maxlength="50" style="display:inline-block;flex:1"></el-input>
          </div>

          <div class="search_item fl">
            <el-date-picker class="width-100" :size="size" v-model="searchData" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              @change="datapickChange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:365px;"></el-date-picker>
          </div>

          <div class="search_item fl">
            <el-button class="button-fc" type="warning" :size="size" @click="searchFun">查询</el-button>
            <el-button class="el-button--medium" type="primary" :size="size" @click="resetFun">重置</el-button>
          </div>
        </div>
      </el-card>

      <!-- tab页 -->
      <el-tabs @tab-click="tabclickH" type="border-card">
        <div class="left_fix_table" style="float:right;">
          <el-button type="primary" class="el-button--medium" v-if="myclient_add" @click="addbrand">新增客户</el-button>
        </div>
        <el-tab-pane label="我的客户" name="0">
          <div class="table_warp_box">
            <!-- 按钮组 -->
            <div class="warp_head_action_btn border_none">
              <el-button size="small" class="button-96" v-if="myclient_addorder" @click="btnaddJustOrder()">新增订单</el-button>
              <el-button size="small" class="button-96" v-if="myclient_handover" @click="btnHandover()">移交</el-button>
              <el-button size="small" class="button-96" v-if="myclient_sharing" @click="btnsharing()">共享</el-button>
            </div>
            <!-- 表格 -->
            <div class="table_list lvs attribute">

              <el-table border :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;">
                
                <el-table-column type="selection" width="40"></el-table-column>

                <el-table-column prop="customerName" align="center" width="150" label="客户姓名" sortable :filters="names" :filter-method="filterHandler">
                  <template slot-scope="scope">
                    <div>
                      <el-tooltip placement="right" visible-arrow>
                        <div slot="content" class="tips tipFon">
                          <p class="operaItems" @click="editHandle(scope.row)">编辑</p>
                          <p class="operaItems" @click="addOrder(scope.row)">新增订单</p>
                          <p class="operaItems" @click="moveHandle(scope.row)">移交</p>
                          <p class="operaItems" @click="shareHandle(scope.row)">共享</p>
                          <p class="operaItems" @click="needHandle(scope.row)">需求</p>
                        </div>
                        <img :src="spot" alt class="attributesTips">
                      </el-tooltip>
                      <p
                        class="table_action_span"
                        @click="userinfoHandle(scope.row)"
                      >{{scope.row.customerName}}</p>
                    </div>
                  </template>
                </el-table-column>

                <el-table-column show-overflow-tooltip prop="customerPhone" align="center" label="客户电话" sortable></el-table-column>

                <el-table-column show-overflow-tooltip prop="address" align="center" label="客户地址" sortable></el-table-column>

                <el-table-column show-overflow-tooltip prop="wxNickname" align="center" label="微信昵称" sortable></el-table-column>

                <el-table-column show-overflow-tooltip prop="customerWx" align="center" label="微信号" sortable></el-table-column>

                <el-table-column show-overflow-tooltip prop="storeName" align="center" label="所属门店" sortable></el-table-column>

                <el-table-column show-overflow-tooltip prop="salesman" align="center" label="导购" sortable></el-table-column>

                <el-table-column show-overflow-tooltip prop="createTime" align="center" label="创建日期" sortable></el-table-column>

                <el-table-column show-overflow-tooltip prop="customerCode" align="center" label="客户编码" sortable></el-table-column>

              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="推荐给我" name="1">
          <div class="table_warp_box m-top50">
            <!-- 表格 -->
            <div class="table_list lvs attribute">
              <el-table border :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;">
                <el-table-column prop="customerName" align="center" width="200" label="客户姓名" sortable :filters="names" :filter-method="filterHandler">
                  <template slot-scope="scope">
                    <div>
                      <p
                        class="table_action_span"
                        @click="userinfoHandle(scope.row)"
                      >{{scope.row.customerName}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="wxNickname" align="center" label="微信昵称" sortable></el-table-column>
                <el-table-column prop="customerWx" align="center" label="微信号" sortable></el-table-column>
                <el-table-column prop="customerPhone" align="center" label="客户电话" sortable></el-table-column>
                <el-table-column prop="customerSourceId" align="center" label="客户来源" sortable>
                  <template slot-scope="scope">
                    <div>
                      <p v-if="scope.row.customerSourceId ==1">客户移交</p>
                      <p v-else>客户共享</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="recommendName" align="center" label="推荐人" sortable :filters="Recommenders" :filter-method="filterHandler"></el-table-column>
                <el-table-column prop="recommendPhone" align="center" label="推荐人电话" sortable></el-table-column>
                <el-table-column prop="createTime" align="center" label="创建时间" sortable></el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="我推荐客户" name="2">
          <div class="table_warp_box">
            <div class="warp_head_action_btn border_none light_h3">
              <el-checkbox @change="CustomerTransfer" v-model="customShare">客户移交</el-checkbox>
              <el-checkbox @change="CustomerTransfer" v-model="customMove">客户共享</el-checkbox>
            </div>
            <!-- 表格 -->
            <div class="table_list lvs attribute">
              <el-table :row-class-name="tableRowClassName" border @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;">
                <el-table-column prop="customerName" align="center" width="200" label="客户姓名" sortable :filters="names" :filter-method="filterHandler">
                  <template slot-scope="scope">
                    <div>
                      <p
                        class="table_action_span"
                        @click="userinfoHandle(scope.row)"
                      >{{scope.row.customerName}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="customerPhone" align="center" label="客户电话" sortable></el-table-column>
                <el-table-column prop="storeCustomerTransferType" align="center" label="推荐方式" sortable :filters="Recommens" :filter-method="filterHandler">
                  <template slot-scope="scope">
                    <div>
                      <p v-if="scope.row.storeCustomerTransferType ==1">客户移交</p>
                      <p v-else>客户共享</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="acceptStatus" align="center" label="接收状态" sortable>
                  <template slot-scope="scope">
                    <div>
                      <p v-if="scope.row.acceptStatus ==1">移交</p>
                      <p v-else>共享</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="storeName" align="center" label="所属门店" sortable :filters="shops" :filter-method="filterHandler"></el-table-column>
                <el-table-column prop="receiveName" align="center" label="接收人" sortable :filters="Receiver" :filter-method="filterHandler"></el-table-column>
                <el-table-column prop="receivePhone" align="center" label="接收人电话" sortable></el-table-column>
                <el-table-column prop="acceptTime" align="center" label="接收时间" sortable></el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待接收" name="3">
          <div class="table_warp_box">
            <!-- 按钮组 -->
            <div class="warp_head_action_btn border_none">
              <el-button
                v-for="(item,index) in actionBtnList4"
                size="small"
                class="button-96"
                :key="index"
                :type="item.style"
                @click="customer()"
              >{{item.name}}</el-button>
            </div>
            <!-- 表格 -->
            <div class="table_list lvs attribute">
              <!--  -->
              <el-table
                border
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :data="tabList"
                style="width: 100%;"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column
                  prop="customerName"
                  align="center"
                  width="200"
                  label="客户姓名"
                  sortable
                  :filters="names"
                  :filter-method="filterHandler"
                >
                  <template slot-scope="scope">
                    <div>
                      <p
                        class="table_action_span"
                        @click="userinfoHandle(scope.row)"
                      >{{scope.row.customerName}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="customerWx" align="center" label="微信号" sortable></el-table-column>
                <el-table-column prop="storeCustomerTransferType" align="center" label="推荐方式" sortable>
                  <template slot-scope="scope">
                    <div>
                      <p v-if="scope.row.storeCustomerTransferType ==1">客户移交</p>
                      <p v-else>客户共享</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column prop="sourceStoreName" align="center" label="推荐门店" sortable></el-table-column>
                <el-table-column prop="recommendName" align="center" label="推荐人" sortable></el-table-column>
                <el-table-column prop="recommendPhone" align="center" label="推荐人电话" sortable></el-table-column>
                <el-table-column prop="recommendTime" align="center" label="推荐时间" sortable></el-table-column>
              </el-table>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>

      <div class="pagination_wrap">
        <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
      </div>

      <!-- </el-card> -->
    </div>
  </div>
</template>
<script>
import {
  listCustomer,
  listRecommend,
  receiveStatus
} from "api/customermanagement/myclient/myclient";
import pagination from "../../components/pagination";
import breadcrumb from "../../components/breadcrumb";
import spot from "@/assets/images/spot.png";
import { getNames } from "src/utils/pubilcFn.js";
import { mapGetters } from "vuex"

export default {
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      spot, //操作图片
      names: [], //客户名称筛选数据
      namesOne: [], //客户名称筛选数据
      namesTow: [], //客户名称筛选数据
      namesThree: [], //客户筛选电话
      Recommenders: [], //推荐人筛选数据
      Recommens: [], //推荐方式帅选数据
      Receiver: [], //接收人筛选数据
      shops: [], //所属门店筛选数据
      //头部面包屑导航
      navList: [],
      elsectVal: [], //table表单 勾选属性
      manInfo: {},
      //头部日期选择
      searchData: [],
      //开始结束时间
      startTime: "",
      endTime: "",
      //默认展开的
      opentab: "1",
      // TABLE  页1

      tabList: [],

      //状态栏切换
      tablists: ["我的客户", "推荐给我", "我推荐客户", "待接收"],
      tabstatus: 0,

      //查询内容
      searchtext: "",
      //页面操作按钮list
      actionBtnList: [
        { name: "新增订单", style: "default", url: "/addbrand", type: 1 },
        { name: "移交", style: "default", url: "/addbrand", type: 2 },
        { name: "共享", style: "default", url: "/addbrand", type: 3 }
      ],

      // TABLE  页2
      storeId:JSON.parse(window.localStorage.getItem("activeStoreId")).storeId,

      tabList2: [],
      customShare: false,
      customMove: false,
      // TABLE  页3
      tabList3: [],
      // TABLE  页4
      tabList4: [],
      //页面操作按钮list
      actionBtnList4: [
        { name: "客户接收", style: "default", url: "/addbrand", type: 1 }
      ],
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
      myclient_add: false,//按钮权限  新增客户
      myclient_addorder: false,//按钮权限  新增订单
      myclient_handover: false,//按钮权限  移交
      myclient_sharing: false,//按钮权限  共享
      myclient_accept: false,//按钮权限  客户接收
    };
  },
  activated(){
    // 头部面包屑
    this.navList = this.$route.meta;
    this.getListData();
    this.myclient_add = JSON.parse(this.$loca.getItem('element'))['myclient_add'];//按钮权限  新增客户
    this.myclient_addorder = JSON.parse(this.$loca.getItem('element'))['myclient_addorder']//按钮权限  新增订单
    this.myclient_handover = JSON.parse(this.$loca.getItem('element'))['myclient_handover']//按钮权限  移交
    this.myclient_sharing = JSON.parse(this.$loca.getItem('element'))['myclient_sharing']//按钮权限  共享
    this.myclient_accept = JSON.parse(this.$loca.getItem('element'))['myclient_accept']//按钮权限  客户接收
  },
  // deactivated () {
  //   this.$destroy(true)
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  //   this.getListData();
  //   this.myclient_add = JSON.parse(this.$loca.getItem('element'))['myclient_add'];//按钮权限  新增客户
  //   this.myclient_addorder = JSON.parse(this.$loca.getItem('element'))['myclient_addorder']//按钮权限  新增订单
  //   this.myclient_handover = JSON.parse(this.$loca.getItem('element'))['myclient_handover']//按钮权限  移交
  //   this.myclient_sharing = JSON.parse(this.$loca.getItem('element'))['myclient_sharing']//按钮权限  共享
  //   this.myclient_accept = JSON.parse(this.$loca.getItem('element'))['myclient_accept']//按钮权限  客户接收
  //   // console.log(this.elements['myclient_add']);
    
  // },

  computed: {
      ...mapGetters(["activeStoreId",'elements','size'])
  },

  watch:{
    activeStoreId(val){
      if (this.tabstatus == 0) {
        this.storeId = val.storeId;
        this.currentPage = 1;
        this.getListData();
      }
    },
  },





  methods: {
    CustomerTransfer(val) {
      let type = null;
      if (this.customShare) {
        type = 1;
      }
      if (this.customMove) {
        type = 2;
      }
      if (this.customShare && this.customMove) {
        type = null;
      }
      let data = {
        tabType: "2",
        storeCustomerTransferType: type,
        page: this.currentPage,
        limit: this.pageSize
      };
      this.Recommend(data, 2);
    },
    filterHandler(value, row, column) {
      //筛选方法调用
      const property = column["property"];
      return row[property] === value;
    },
    getInfos(val) {
      this.names = getNames("customerName", val); //调用筛选数据处理
    },

    //重置按钮
    resetFun() {
      this.manInfo = {};
      this.searchData = [];
      this.searchFun();
    },

    //获取我的客户
    getListData() {
      let data = {
        ...this.manInfo,
        storeId:this.storeId,
        page: this.currentPage,
        limit: this.pageSize
      };
      listCustomer(data)
        .then(res => {
          this.total = res.data.total;
          this.tabList = res.data.rows;
          this.getInfos(res.data.rows);
        })
        .catch(error => {
          console.log(
            "我的客户:获取我的客户列表 customermanagement/myclient/index",
            error
          );
        });
    },
    Recommend(data, index) {
      this.tabList = [];
      listRecommend(data)
        .then(res => {
          this.total = res.data.total;
          this.tabList = res.data.rows;
          this.getInfos(res.data.rows);
        })
        .catch(error => {
          console.log(
            "我的客户:获取我的客户列表 customermanagement/myclient/index",
            error
          );
        });
    },
    //时间选择器   改变
    datapickChange(val) {
      this.manInfo.createTimeStart = this.searchData ? this.searchData[0] : "";
      this.manInfo.createTimeEnd = this.searchData ? this.searchData[1] : "";
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //tab页选择
    tabclickH(e) {
      this.tabstatus = e.name;
      if (e.name == 0) {
        this.getListData();
      } else if (e.name == 1) {
        //推荐给我列表
        let tabType = {
          storeId:JSON.parse(window.localStorage.getItem("activeStoreId")).storeId,
          ...this.manInfo,
          tabType: "1",
          page: this.currentPage,
          limit: this.pageSize
        };
        this.Recommend(tabType, 1);
      } else if (e.name == 2) {
        //我推荐客户
        let tabTypeOne = {
          storeId:JSON.parse(window.localStorage.getItem("activeStoreId")).storeId,
          tabType: "2",
          ...this.manInfo,
          // storeCustomerTransferType:1,
          page: this.currentPage,
          limit: this.pageSize
        };
        this.Recommend(tabTypeOne, 2);
      } else {
        let tabTypeThree = {
          storeId:JSON.parse(window.localStorage.getItem("activeStoreId")).storeId,
          tabType: "3",
          ...this.manInfo,
          page: this.currentPage,
          limit: this.pageSize
        };
        this.Recommend(tabTypeThree, 3);
      }
    },
    customer() {
      if (this.elsectVal.length == 0) {
        this.$message({ message: "没有选择客户", type: "warning" });
        return;
      }
      let storeArry = this.elsectVal.map(item => {
        return {
          storeCustomerTransferId: item.storeCustomerTransferId,
          storeCustomerTransferType: Number(item.storeCustomerTransferType)
        };
      });
      receiveStatus({
        storeCustomerTransfers: storeArry
      })
        .then(res => {
          let tabTypeThree = {
            tabType: "3",
            page: this.currentPage,
            limit: this.pageSize
          };
          this.Recommend(tabTypeThree, 3);
          this.$message({ message: "接收成功", type: "success" });
        })
        .catch(error => {
          this.$message.error({ message: "接收失败" });
          console.log(
            "我的客户: 移交客户客户 customermanagement/myclient/index",
            error
          );
        });
    },
    sizeChange(val) {
      //翻页方法
      this.currentPage = 1;
      this.pageSize = val;
      this.getListData();
    },
    currentChange(val) {
      //翻页方法
      this.currentPage = val;
      this.getListData();
    },


    // 改变table头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background: #f8f8f8;border-color: #dddddd";
      }
    },
    
    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
    },


    //查询按钮点击
    searchFun() {
      this.currentPage = 1;
      if(this.tabstatus == 0){
        this.getListData();
      }else{
        let tabType = {
          ...this.manInfo,
          storeId:this.storeId,
          tabType: this.tabstatus,
          page: this.currentPage,
          limit: this.pageSize
        };
        this.Recommend(tabType, 1);
      }
    },
    //新增订单按钮
    btnaddJustOrder(){
      if (this.elsectVal.length == 0) {
        this.$message.error("请勾选客户");
      } else if (this.elsectVal.length > 1) {
        this.$message.error("只能选择一名用户");
      } else {
        this.$router.push({
          path: "/ordermm/addJustOrder",
          query: {
            storeCustomerId: this.elsectVal[0].storeCustomerId
          }
        });
      }
    },

    //移交页面跳转
    btnHandover(){
      if (this.elsectVal.length != 0) {
        var id;
        id = this.elsectVal.map(item => {
          return item.storeCustomerId;
        });

        var customerId;
        customerId = this.elsectVal.map(item => {
          return item.customerId;
        });
        let storeId = this.elsectVal[0].storeId;

        this.$router.push({
          path: "customerHandover",
          query: {
            id: id,
            storeId: storeId,
            customerId:customerId,
            salesman: this.elsectVal[0].salesman,
            storeName: this.elsectVal[0].storeName
          }
        });
      } else {
        this.$message({ message: "没有选择客户", type: "warning" });
      }
    },

    //客户共享
    btnsharing(){
      if (this.elsectVal.length != 0) {
      var id;
      id = this.elsectVal.map(item => {
        return item.storeCustomerId;
      });
      this.$router.push({ path: "customersharing", query: { id: id } });
      } else {
        this.$message({ message: "没有选择客户", type: "warning" });
      }
    },



    //按钮组函数
    // butGroupActions(url, type) {
      // if (type == 1) {
      //   if (this.elsectVal.length == 0) {
      //     this.$message.error("请勾选客户");
      //   } else if (this.elsectVal.length > 1) {
      //     this.$message.error("只能选择一名用户");
      //   } else {
      //     this.$router.push({
      //       path: "/ordermm/addJustOrder",
      //       query: {
      //         storeCustomerId: this.elsectVal[0].storeCustomerId
      //       }
      //     });
      //   }
    //   } else if (type == 2) {
    //     //移交页面跳转
    //     if (this.elsectVal.length != 0) {
    //       var id;
    //       id = this.elsectVal.map(item => {
    //         return item.customerId;
    //       });
    //       let storeId = this.elsectVal[0].storeId;

    //       this.$router.push({
    //         path: "customerHandover",
    //         query: {
    //           id: id,
    //           storeId: storeId,
    //           salesman: this.elsectVal[0].salesman,
    //           storeName: this.elsectVal[0].storeName
    //         }
    //       });
    //     } else {
    //       this.$message({ message: "没有选择客户", type: "warning" });
    //     }
    //   } else if (type == 3) {
    //     if (this.elsectVal.length != 0) {
    //       var id;
    //       id = this.elsectVal.map(item => {
    //         return item.storeCustomerId;
    //       });
    //       this.$router.push({ path: "customersharing", query: { id: id } });
    //     } else {
    //       this.$message({ message: "没有选择客户", type: "warning" });
    //     }
    //   }
    // },
    //添加新
    addbrand() {
      this.$router.push({ path: "customeradd" });
    },
    //编辑   ids门店客户id   customerId客户id
    editHandle(row) {
      this.$router.push({
        path: "customeradd",
        query: { ids: row.storeCustomerId, customerId: row.customerId }
      });
    },
    //移交
    moveHandle(row) {
      console.log(row);
      this.$router.push({
        path: "customerHandover",
        query: {
          id: row.storeCustomerId,
          customerId:[row.customerId],
          storeId: row.storeId,
          salesman: row.salesman,
          storeName: row.storeName
        }
      });
    },
    //共享
    shareHandle(row) {
      this.$router.push({
        path: "customersharing",
        query: { id: row.storeCustomerId }
      });
    },
    //需求
    needHandle(row) {
      this.$router.push({
        path: "clientinformation",
        query: { id: row.storeCustomerId,customerId:row.customerId }
      });
    },
    //客户需求信息
    userinfoHandle(row) {
      this.$router.push({
        path: "clientinformation",
        query: { id: row.storeCustomerId,customerId:row.customerId }
      });
    },
    //新增订单
    addOrder(row) {
      this.$router.push({
        path: "/ordermm/addJustOrder",
        query: {
          storeCustomerId: row.storeCustomerId
        }
      });
    },
    setStatue(row, type) {
      console.log(row);
    },
    //查看
    seeHandle(row) {
      console.log(row);
      this.$router.push({ path: "scalebrand", query: { id: row.id } });
    },
    //上传前的回调
    beforUpload(file) {
      console.log(file);
    },
    //弹框里的函数方法
    uploadchange(file, fileList) {
      console.log(file);
      console.log(fileList);
    }
  }
};
</script>
<style scoped lang='scss'>
.head_nav_btn {
  width: 180px;
}

.pagination_wrap {
  text-align: center;
  height: 50px;
  /* line-height: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.topbox {
  display: flex;
  justify-content: space-between;
}
// .warp_head_list {
//   flex: 1;
//   display: flex;
//   flex-wrap: wrap;
//   align-items: center;
//   .search_item{
//     display: flex;
//     align-items: center;
//     >span{
//       width: 120px;
//       display: block;
//       text-align: right;
//       padding-right: 10px;
//     }
//   }
// }
.search_nav {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: flex-start;
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
  /* position: absolute;
  right: 10px;
  top: 8px; */
}
.dialog_con_box {
}
.dialog_con_box .content_box {
  display: flex;
  flex-wrap: nowrap;
}
.dialog_con_box .left_form {
  width: 60%;
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

.attribute {
  position: relative;
}
.apper {
  position: relative;
}
.tabtop {
  position: absolute;
  margin-top: 50px;
  // top: -27px;
  // left: 0px;
  transform: translate(-20px, -47px);
  display: flex;
  font-size: 14px;
  background: #006ec7;
  border-radius: 5px 5px 0px 0px;
  border-bottom: none;
  cursor: pointer;
  li {
    padding: 5px 8px;
    color: #ffffff;
    transition: 1s all;
    height: 100%;
  }
  .checkclass {
    background: #ffffff;
    color: #333;
    border-radius: 5px 5px 0px 0px !important;
    transition: 1s all;
    border-bottom: none;
  }
}
.search_box {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.search_item {
  width: calc(((94vw - 250px)) / 4);
  // margin-bottom:20px;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  // justify-content: center;
  align-items: center;
  span {
    min-width: 80px;
    text-align: right;
  }
  /* margin-right: 20px; */
}
.border_none {
  border: none;
}
.light_h3 {
  line-height: 3;
}
</style>

