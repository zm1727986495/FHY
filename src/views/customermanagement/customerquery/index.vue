<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <el-card class="m-bottom attribute lvs">
        <div class="search_box">
          <div class="search_item">
            <el-input placeholder="客户姓名" @keyup.enter.native="searchFun()" v-model="queryForm.customerName" maxlength="50" class="width-100"></el-input>
          </div>
          <div class="search_item">
            <el-input placeholder="客户电话" @keyup.enter.native="searchFun()" v-model="queryForm.customerPhone" maxlength="50" class="width-100"></el-input>
          </div>
          <div class="search_item">
            <el-date-picker class="width-100" v-model="timeArr" type="daterange" value-format="yyyy-MM-dd" format="yyyy-MM-dd"
              @change="datapickChange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期" style="width:365px;"
            ></el-date-picker>
          </div>

          <div class="search_item">
            <el-input v-model="queryForm.salesmanIds" @keyup.enter.native="searchFun()" placeholder="请输入业务人员"></el-input>
          </div>
        </div>

        <div class="search_box">
          <div class="search_item">
            <el-select v-model="queryForm.storeIds" placeholder="请选择门店" multiple filterable collapse-tags class="head_nav_search width-100">
              <el-option v-for="item in storeOptions" :key="item.storeId" :label="item.storeName" :value="item.storeId"></el-option>
            </el-select>
          </div>
          <div class="search_item">
            <el-button type="warning" class="button-fc el-button--medium" @click="searchFun">查询</el-button>
            <el-button type="primary" class="el-button--medium" @click="resetFun">重置</el-button>
          </div>
          <div class="search_item"></div>
          <div class="search_item"></div>
        </div>

        <div class="h-widths"></div>

        <!-- 按钮组 -->
        <div class="warp_head_action_btns m-bottom m-top20">
          <!-- 按钮组 -->

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


          <!-- <el-button
            v-for="(item,index) in actionBtnList1"
            :type="item.style"
            :key="index"
            size="small"
            class="button-96"
            @click="butGroupAction(item.url,item.type)"
            v-if="item.flag==shopowner"
          >{{item.name}}</el-button> -->
        </div>
        <!-- 表格 -->
        <div class="table_list">
          <!--  -->
          <el-table
            border
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
            :data="tabList"
            style="width: 100%;"
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column
              prop="customerName"
              label="客户姓名"
              align="center"
              sortable
              :filters="names"
              :filter-method="filterName"
            >
              <template slot-scope="scope">
                <div>
                  <el-tooltip placement="right" visible-arrow>
                    <div slot="content" class="tips tipFon">
                      <p class="operaItems" @click="editHandle(scope.row)">编辑</p>
                    </div>
                    <img :src="spot" alt class="attributesTips" />
                  </el-tooltip>
                  <p
                    class="table_action_span"
                    @click="userinfoHandle(scope.row)"
                  >{{scope.row.customerName}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="customerPhone" align="center" label="客户电话" sortable></el-table-column>
            <el-table-column prop="storeName" align="center" label="所属门店" sortable></el-table-column>
            <el-table-column prop="salesman" align="center" label="导购" sortable></el-table-column>
            <el-table-column prop="createTime" align="center" label="创建时间" sortable></el-table-column>
            <el-table-column prop="wxNickname" align="center" label="微信昵称" sortable></el-table-column>
            <el-table-column prop="customerWx" align="center" label="微信号" sortable></el-table-column>
          </el-table>
          <div class="pagination_wrap">
            <pagination
              :current-page="currentPage"
              :pageSize="pageSize"
              :total="total"
              @sizeChange="sizeChange"
              @currentChange="currentChange"
            ></pagination>
          </div>
        </div>
      </el-card>
    </div>
    <!-- 弹框页面 -->
    <div class="dialog_con_box">
      <el-dialog :title="Dialogtitle" :visible.sync="centerDialogVisible" width="40%">
        <span slot="footer" class="dialog-footer">
          <el-button @click="centerDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="centerDialogVisible = false">确 定</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 提示弹框页面 -->
    <el-dialog title="提示" :visible.sync="tipsdialogVisible" width="30%">
      <span>请先勾选客户</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="tipsdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="tipsdialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import breadcrumb from "../../components/breadcrumb";
import pagination from "../../components/pagination";
import { getNames, getTypes } from "src/utils/pubilcFn";
import spot from "@/assets/images/spot.png";
import {
  listAllStoreCustomer,
  Shopowner
} from "src/api/customermanagement/customerquery/customerquery";
import { listStoreByPresent, listLoginUserStore } from "api/common/common";
import { mapGetters } from "vuex"

export default {
  // name: 'brandmanagement',
  data() {
    return {
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),//按钮权限
      size: "medium",
      queryForm: {
        customerName: "",
        customerPhone: "",
        salesmanIds:"",
        storeIds: [],
      },
      timeArr: null,

      names: [], //过滤客户姓名的

      currentPage: 1,
      pageSize: 20,
      total: 0,
      tabList: [],
      spot, //表格操作图片
      //头部面包屑导航
      navList: [],
      brandnames: [],
      searchData: [],
      startTime: "",
      endTime: "",
      //表格勾选对象
      tableSelectList: [],
      //分页
      currentPage3: 1,
      totle: 100,
      //查询内容
      searchtext: "",
      //状态查询
      statuestyle: "",
      statuestylearr: [],
      styleList: [
        { label: "全部", value: "" },
        { label: "启用", value: 1 },
        { label: "停用", value: 2 }
      ],
      //品牌类型
      brandstyle: "",
      brandstylearr: [],
      brandList: [
        { label: "全部", value: "" },
        { label: "自营", value: 1 },
        { label: "合作商", value: 1 }
      ],
      //页面操作按钮list
      actionBtnList: [
        { name: "新增客户", style: "default", codename: "customerquery_add", type: 1 },
        // { name: "批量导入", style: "default", url: "/addbrand", type: 5 }
      ],
      actionBtnList1: [
        {
          name: "业务变更",
          style: "default",
          url: "/addbrand",
          type: 3,
          flag: "1"
        },
        {
          name: "客户共享",
          style: "default",
          url: "/addbrand",
          type: 4,
          flag: "1"
        }
      ],
      storeId:JSON.parse(window.localStorage.getItem("activeStoreId")).storeId,
      //页面弹框
      Dialogtitle: "",
      centerDialogVisible: false,
      //弹框页面数据
      brandInfo: {},
      //选择品牌类型
      DialogbrandList: [
        { label: "自营", value: 1 },
        { label: "合作商", value: 1 }
      ],
      //提示弹框界面
      tipsdialogVisible: false,
      shopowner: "",
      storeOptions: [] //门店下拉选项
    };
  },
  activated(){
    this.getData();
    this.listStoreByPresent();
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  // deactivated () {
  //   this.$destroy(true)
  // },
  // created() {
  //   this.getData();
  //   // this.getNames();// 调用筛选数据处理
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.listStoreByPresent();
  //   this.navList = this.$route.meta;
  //   // Shopowner({}).then(res => {
  //   //   this.shopowner = res.data.isLeader;
  //   // });
  // },

  computed: {
    ...mapGetters(["activeStoreId"])
  },

  watch:{
    activeStoreId(val){

      this.storeId = val.storeId;
      this.currentPage = 1;
      this.getData();
    },
  },


  methods: {

    //获取门店
    listStoreByPresent() {
      listLoginUserStore()
        .then(res => {
          this.storeOptions = res.data;
        })
        .catch(error => {
          console.log(error + "views/customermanagement/customerquery/index");
        });
    },

    resetFun() {
      this.queryForm = {};
      this.queryForm.storeIds = [];
      this.timeArr = [];
      this.searchFun();
    },
    currentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getData();
    },
    // getNames() { //筛选数据处理
    // this.brandname = this.tabList.map(function (item) {
    //   return {text: item.brandname, value: item.brandname}
    // });
    // },

    getInfos(val) {
      this.names = getNames("customerName", val); //调用筛选数据处理
    },
    filterName(value, row, column) {
      //筛选方法调用
      const property = column["property"];
      return row[property] == value;
    },
    datapickChange(val) {
      val == [] ? null : val;
      console.log(val);

      this.queryForm.createTimeStart = val ? this.timeArr[0] : "";
      this.queryForm.createTimeEnd = val ? this.timeArr[1] : "";
    },
    // 获取列表信息
    getData() {
      let params = {
        storeId:this.storeId,
        customerName: this.queryForm.customerName,
        customerPhone: this.queryForm.customerPhone,
        createTimeStart: this.queryForm.createTimeStart
          ? this.queryForm.createTimeStart
          : "",
        createTimeEnd: this.queryForm.createTimeEnd
          ? this.queryForm.createTimeEnd
          : "",
        storeIds : this.queryForm.storeIds.join(","),  
        page: this.currentPage,
        limit: this.pageSize
      };
      listAllStoreCustomer(params)
        .then(response => {
          const result = response.data;
          this.tabList = result.rows;
          this.total = result.total;
          this.getInfos(response.data.rows);
        })
        .catch(error => {
          console.log("storeCustomer/listAllStoreCustomer:" + error);
        });
    },

    // 操作
    projectdetail(row) {},
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    // 改变table头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background: #f8f8f8;border-color: #dddddd";
      }
    },
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },
    //分页函数回调
    handleCurrentChange(val) {
      this.currentPage3 = val;
      this.getData();
    },
    //勾选函数回调
    handleSelectionChange(val) {
      console.log(val);
      this.tableSelectList = val;
    },
    //查询按钮点击
    searchFun() {
      this.currentPage = 1;
      this.getData();
    },
    //按钮组函数
    butGroupAction(type) {
      if (type == 1) {
        this.$router.push({ path: "/customer/customeradd" });
      } 
    },
    //添加新
    addbrand(row) {
      this.Dialogtitle = "新增品牌";
      this.centerDialogVisible = true;
    },
    //编辑
    editHandle(row) {
      this.$router.push({
        path: "customeradd",
        query: { ids: row.storeCustomerId, customerId: row.customerId }
      });
    },
    //客户需求信息
    userinfoHandle(row) {
      this.$router.push({
        path: "clientinformation",
        query: { id: row.storeCustomerId, customerId: row.customerId }
      });
    },
    //移交
    moveHandle() {
      if (this.tableSelectList.length <= 0) {
        // this.tipsdialogVisible = true;
        this.$message({ message: "没有选择客户", type: "warning" });
        return;
      }
      let decideArr = this.tableSelectList.filter(item => {
        return item.salesman == this.tableSelectList[0].salesman;
      });
      if (decideArr.length != this.tableSelectList.length) {
        this.$message.error("必须选择同一门店的人员才能进行操作");
        return;
      }
      let id;
      id = this.tableSelectList.map(item => {
        return item.storeCustomerId;
      });
      let storeId = this.tableSelectList[0].storeId;

      this.$router.push({
        path: "customerHandover",
        query: {
          id: id,
          storeId: storeId,
          salesman: this.tableSelectList[0].salesman,
          storeName: this.tableSelectList[0].storeName
        }
      });
    },
    //共享
    shareHandle() {
      //console.log(this.tableSelectList[0].customerId);

      if (this.tableSelectList.length <= 0) {
        // this.tipsdialogVisible = true;
        this.$message({ message: "没有选择客户", type: "warning" });
        return;
      }

      let id;
      id = this.tableSelectList.map(item => {
        return item.storeCustomerId;
      });

      this.$router.push({ path: "customersharing", query: { id: id } });
    },
    //查看
    seeHandle(row) {
      console.log(row);
      this.$router.push({ path: "scalebrand", query: { id: row.id } });
    }
    //
  },
  components: {
    breadcrumb,
    pagination
  }
};
</script>
<style scoped lang="scss">
.btn_list{
  display: flex;
  flex-wrap: wrap;
}
.topbox {
  display: flex;
  justify-content: space-between;
}
.warp_head_list {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  .search_item {
    display: flex;
    align-items: center;
    margin-bottom: 20;
    > span {
      width: 100px;
      display: block;
      text-align: right;
      padding-right: 10px;
    }
  }
}

.warp_head_list {
  display: flex;
  .search_nav {
    flex: 1;
    display: flex;
  }
}
.head_nav_btn {
  width: 180px;
  right: 5vw;
  position: absolute;
}
.head_nav_datapick {
  margin-right: 20px;
}

.pagination_wrap {
  text-align: center;
  height: 50px;
  /* line-height: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.table_action_span {
  color: rgb(127, 221, 228);
  cursor: pointer;
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
.table_action_span {
  color: rgb(127, 221, 228);
  cursor: pointer;
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

.warp_head_action_btns {
  display: flex;
  align-items: center;
}
.collapse_input_cell_box {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
}
.input_befor_text {
  min-width: 80px;
  text-align: right;
}
.input_after_div {
  flex: 1;
  margin-right: 15px;
  .el-input {
    width: 100%;
  }
}

.search_box {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.search_item {
  width: calc(((94vw - 250px)) / 4);
  margin-bottom: 20px;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  // justify-content: center;
  align-items: center;
}
</style>

