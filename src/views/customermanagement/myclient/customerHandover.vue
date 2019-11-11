<template>
  <div class="customerHandover">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

      <el-card class="box-card">
        <div class="iconBox">
          <i class="Icon"></i>
          <span>客户移交</span>
        </div>

        <table class="tab_class">
          <tr>
            <td>
              <span class="befor_text_bold">原导购：</span>
              {{salesman}}
            </td>
            <td>
              <span class="befor_text_bold">原门店：</span>
              {{storeName}}
            </td>
            <td>
              <span class="befor_text_bold">共</span>
              {{idlength}}
              <span class="befor_text_bold">个客户</span>
            </td>
          </tr>
        </table>
        <div class="iconBox">
          <i class="Icon"></i>
          <span>移交信息</span>
        </div>

        <el-form :model="sendForm" :rules="rules" ref="ruleForm" label-width="120px">
          <div class="infoform">
            <div class="infoform_item">
              <el-form-item label="导购：" prop="transferStoreAtId">
                <el-select v-model="sendForm.transferStoreAtId" placeholder="请选择导购人">
                  <el-option
                    v-for="(item,index) in userList"
                    :key="index"
                    :label="item.name"
                    :value="item.userId"
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="infoform_item">
              <el-form-item label="移交开始时间：" prop="transferDatetime">
                <el-date-picker
                  class="input_time_fl"
                  v-model="sendForm.transferDatetime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </div>
            <div class="infoform_item">
              <el-form-item label="核算开始时间：" prop="businessAccountingDatetime">
                <el-date-picker
                  class="input_time_fl"
                  v-model="sendForm.businessAccountingDatetime"
                  type="datetime"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  placeholder="选择日期"
                ></el-date-picker>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </el-card>
      <div class="collapse_cell_div">
        <!-- 查询条件组 -->
        <el-card class="box-card manman">
          <div class="iconBox">
            <i class="Icon"></i>
            <span>选择移交订单</span>
          </div>

          <div class="search_box">
            <div class="search_item2">
              <span>客户姓名：</span>
              <el-input
                class="width-100"
                placeholder="客户姓名"
                size="meduim"
                v-model="queryForm.customerName"
              ></el-input>
            </div>
            <div class="search_item2">
              <span>客户电话：</span>
              <el-input
                class="width-100"
                placeholder="客户电话"
                size="meduim"
                v-model="queryForm.customerPhone"
              ></el-input>
            </div>
            <div class="search_item2">
              <span>订单编号：</span>
              <el-input
                class="width-100"
                placeholder="订单编号"
                size="meduim"
                v-model="queryForm.orderNumber"
              ></el-input>
            </div>
            <div class="search_item2">
              <span>品牌名称：</span>
              <el-input
                class="width-100"
                placeholder="品牌名称"
                size="meduim"
                v-model="queryForm.brandName"
              ></el-input>
            </div>
            <div class="search_item2">
              <span>订单状态：</span>
              <el-input
                class="width-100"
                placeholder="订单状态"
                size="meduim"
                v-model="queryForm.orderStatus"
              ></el-input>
            </div>
            <div class="search_item2">
              <span>订单类型：</span>
              <el-input
                class="width-100"
                placeholder="订单类型"
                size="meduim"
                v-model="queryForm.orderType"
              ></el-input>
            </div>
            <div class="search_item2">
              <span>货品类型：</span>
              <el-input
                class="width-100"
                placeholder="货品类型"
                size="meduim"
                v-model="queryForm.orderGoodsType"
              ></el-input>
            </div>
            <div class="search_item2">
              <el-button type="warning" @click="searchOrder" class="button-fc el-button--medium">查询</el-button>
              <el-button type="primary" @click="resetOrder" class="el-button--medium">重置</el-button>
            </div>
          </div>

          <div class="table_list">
            <el-table
              border
              :row-class-name="tableRowClassName"
              @selection-change="handleSelectionChange"
              :data="tabList"
              style="width: 100%;overflow-x:scroll"
            >
              <el-table-column type="selection" width="40" fixed='left'></el-table-column>
              <el-table-column align="center" prop="orderNumber" label="订单号" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="orderType" label="订单类型" width="200" show-overflow-tooltip>
                <template slot-scope="scope">
                  <span v-if="scope.row.orderType == '1'">正单</span>
                  <span v-else>正单</span>
                </template>
              </el-table-column>
              <el-table-column
                align="center"
                prop="orderGoodsType"
                label="订单货品类型"
                width="200"
                show-overflow-tooltip
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.orderGoodsType == '1'">定制</span>
                  <span v-else>成品</span>
                </template>
              </el-table-column>
              <el-table-column sortable align="center" prop="brandName" label="产品品牌" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column sortable align="center" prop="productName" label="产品类别" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column sortable align="center" prop="contractMoney" label="合同金额" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column sortable align="center" prop="collectMoney" label="实收金额" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column sortable align="center" prop="reportedType" label="报备类型" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column sortable align="center" prop="customerName" label="客户姓名" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column sortable align="center" prop="customerPhone" label="客户电话" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column sortable align="center" prop="address" label="订单地址" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column sortable align="center" prop="salesman" label="销售员" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column sortable align="center" prop="surveyor" label="测量员" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column sortable align="center" prop="designer" label="设计师" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column sortable align="center" prop="storeName" label="所属网点" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column sortable align="center" prop="orderChannel" label="订单渠道" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column sortable
                align="center"
                prop="createOrderTime"
                label="创建订单时间"
                width="200"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column sortable align="center" prop="measureTime" label="指派测量时间" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column sortable align="center" prop="designTime" label="指派设计时间" width="200" show-overflow-tooltip></el-table-column>
            </el-table>
          </div>
          <div class="pagination_wrap">
            <!-- <el-pagination background layout="prev, pager, next" :pager-count="8" prev-text="上一页" next-text="下一页" :total="1000"></el-pagination> -->
            <pagination
              :current-page="currentPage"
              :pageSize="pageSize"
              :total="total"
              @sizeChange="sizeChange"
              @currentChange="currentChange"
            ></pagination>
          </div>

          <div class="collapse_cell_div">
            <div class="collapse_input_cell_box_area">
              <span class="input_befor_text">备注：</span>
              <div class="input_after_div">
                <el-input type="textarea" placeholder v-model="sendForm.remarks" maxlength="50"></el-input>
              </div>
            </div>
          </div>

          <div class="foot_btn_box">
            <el-button type="primary" @click="sendTransfer(1)">保 存</el-button>
            <el-button type="primary" @click="sendTransfer(2)">提 交</el-button>
            <el-button @click="goBack">取 消</el-button>
          </div>
        </el-card>

        <!-- 表格 -->
      </div>
    </div>
  </div>
</template>


<script>
import breadcrumb from "../../components/breadcrumb";
import pagination from "../../components/pagination";

import {
  listTransferOrder,
  insertTransferCustomerContent
} from "api/customermanagement/myclient/myclient";

import { listStoreUser } from "api/common/common";

export default {
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //当前页最大条数
      total: 0, //总条数

      ids: null,
      customerIds: null,
      idlength: 0,
      salesman: "",
      storeName: "",
      queryForm: {
        // customerIds:[],	//客户id
        customerName: "", //客户姓名
        customerPhone: "", //客户电话
        orderNumber: "", //订单编号
        brandName: "", //品牌名称
        orderStatus: "", //订单状态
        orderType: "", //订单类型
        orderGoodsType: "" //货品类型
      },
      sendForm: {
        transferStoreAtId: "", //移交负责人
        transferDatetime: "", //移交开始时间
        businessAccountingDatetime: "", //核算开始时间
        storeCustomerTransferType: 1, //移交类型
        remarks: "" //备注
      },
      rules: {
        transferStoreAtId: [
          { required: true, message: "请选择移交负责人", trigger: "change" }
        ],
        transferDatetime: [
          {
            required: true,
            message: "请选择日期",
            trigger: "change"
          }
        ],
        businessAccountingDatetime: [
          {
            required: true,
            message: "请选择时间",
            trigger: "change"
          }
        ]
      },
      submitStatus: "",

      //客户的人员列表
      userList: [],

      //选中的订单列表
      orderList: [],

      //头部面包屑导航
      navList: [],
      moveStartTime: "",
      checkStartTime: "",
      brandInfo: {},
      tagList: [
        { name: "新品上架", code: "1" },
        { name: "热卖爆款", code: "2" },
        { name: "清场优惠", code: "3" }
      ],

      //文件上传
      upLoadList: [],

      tabList: [],
      //状态查询
      statuestyle: "",
      styleList: [
        { label: "全部", value: "" },
        { label: "启用", value: 1 },
        { label: "停用", value: 2 }
      ],
      //
      //分页
      currentPage3: 1,
      totle: 100,
      //查询内容
      searchtext: "",
      //状态查询

      //弹框
      centerDialogVisible: false
    };
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.ids = this.$route.query.id;
    this.customerIds = this.$route.query.customerId;
    this.storeName = this.$route.query.storeName;
    this.salesman = this.$route.query.salesman;
    this.idlength = this.getLength();
    this.getStoreListUser();
    this.searchOrder();
  },
  methods: {
    currentChange(val) {
      this.currentPage = val;
      this.getSearchOrderFun();
    },
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getSearchOrderFun();
    },

    //下拉效果
    handleChange(index) {
      console.log(index);
    },

    //获取选中人个数
    getLength() {
      if (Array.isArray(this.$route.query.id)) {
        return this.$route.query.id.length;
      } else {
        return 1;
      }
    },

    //获取列表信息
    getListData() {
      let _this = this;
      let url = "";

      //待备案
      url = baseURL + "/company/project/getStayRecordProjectList2";

      let data = {
        pc_id: "", //项目类型
        company_name: "", //项目施工单位
        create_start: "", //创建起始时间
        create_end: "", //创建结束时间
        searchtext: "",
        currPage: this.currentPage3, //分页信息
        pageSize: 10 //显示数量
      };
      $.ajax({
        url: url,
        type: "POST",
        // contentType:"application/json",
        data: data,
        success: function(res) {
          console.log(res);
          if (res.code == 0) {
            _this.tabList = res.page.list;

            _this.totle = res.page.totalCount;
          } else {
            alert(res.msg);
            return;
          }
        },
        error: function(err) {}
      });
    },

    // 操作
    projectdetail(row) {},

    // 改变table头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background: #f8f8f8;border-color: #dddddd";
      }
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //分页函数回调
    handleCurrentChange(val) {
      this.currentPage3 = val;
      this.getData();
    },
    //勾选函数回调
    handleSelectionChange(val) {
      this.orderList = val;
    },

    //查询按钮点击
    searchFun() {
      this.currentPage3 = 1;
      this.getListData();
    },
    resetOrder() {
      this.queryForm = {};
    },
    //查询订单
    searchOrder() {
      this.currentPage = 1;
      this.getSearchOrderFun();
    },

    //查询订单方法
    getSearchOrderFun() {
      this.queryForm.page = this.currentPage;
      this.queryForm.limit = this.pageSize;
      this.queryForm.customerIds = this.customerIds.join(",");

      listTransferOrder(this.queryForm).then(res => {
        if (res.status == "200") {
          this.total = res.data.total;
          this.tabList = res.data.rows;
        } else {
          this.$message.error("查询失败");
        }
      });
    },

    //根据门店id获取门店人员列表
    getStoreListUser() {
      let data = {
        storeId: this.$route.query.storeId
      };
      listStoreUser(data)
        .then(res => {
          if (res.status == "200") {
            this.userList = res.data;
          } else {
            this.$message.error("获取门店负责人失败");
          }
        })
        .catch(error => {
          console.error(
            "获取门店人员列表  -----  customermanagementmyclientcustomerHandover",
            error
          );
        });
    },

    //发送移交表单
    sendTransfer(val) {
      (this.submitStatus = val),
        this.$refs["ruleForm"].validate(valid => {
          if (valid) {
            // if (this.orderList.length == "0") {
            //   this.$message.warning("您没有选择订单！");
            //   return;
            // }
            let arr;
            arr = this.orderList.map(item => {
              return parseInt(item.orderId);
            });
            this.sendForm.orderIds = arr;
            let storeCustomerIds;
            if (Array.isArray(this.ids)) {
              storeCustomerIds = this.ids.map(item => {
                return item;
              });
            } else {
              storeCustomerIds = [];
              storeCustomerIds.push(parseInt(this.ids));
            }
            this.sendForm.transferStoreAtId = parseInt(
              this.sendForm.transferStoreAtId
            );
            let data = {
              ...this.sendForm,
              submitStatus: this.submitStatus,
              storeCustomerIds: storeCustomerIds
            };
            insertTransferCustomerContent(data)
              .then(res => {
                if (res.status == "200") {
                  this.$message.success("移交信息成功");
                  this.$router.go(-1);
                } else {
                  this.$message.error("移交信息失败");
                }
              })
              .catch(error => {
                console.error(
                  "客户移交_保存、提交 customermanagementmyclientcustomerHandover" +
                    error
                );
              });
          } else {
            this.$message.error("检查填写信息");
            return false;
          }
        });
    },
    goBack() {
      this.$router.go(-1);
    }
  },
  components: {
    breadcrumb,
    pagination
  }
};
</script>
<style scoped lang="scss">
.customerHandover {
  .pagination_wrap {
    text-align: center;
    height: 50px;
    /* line-height: 50px; */
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .collapse_cell_div {
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
    padding: 10px 0;
  }
  .warp_head_list {
    justify-content: space-between;
    width: 100%;
  }
  .page_head_div {
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 50px;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    margin-bottom: 10px;
    width: 100%;
  }
  .table_edit_column {
    display: flex;
    align-items: center;
  }
  .table_edit_column .input_box {
    width: 20%;
  }

  .collapse_cell_div .ImgBox {
    width: 100%;
    display: flex;
    margin-bottom: 10px;
  }
  .collapse_input_cell_box {
    display: flex;
    flex-wrap: nowrap;
  }
  .collapse_input_cell_box_area {
    width: 100%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    span {
      text-align: center;
    }
  }
  .collapse_input_cell_box_area .input_after_div {
    width: 84%;
  }
  .el-input {
    flex: 1;
    width: 80%;
  }

  .collapse_input_cell_box {
    width: 50%;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    height: 50px;
  }
  .collapse_input_cell_box .input_befor_text {
    width: 120px;
  }
  .collapse_input_cell_box .input_after_div {
    flex: 1;
  }
  .table_list {
    width: 100%;
    margin-top: 10px;
  }
  .head_nav_search_t {
    margin-right: 20px;
    display: flex;
    align-items: center;
    span {
      min-width: 100px;
    }
  }
  .head_nav_select_t {
    margin-right: 20px;
    display: flex;
    align-items: center;
  }
  .input_befor_text {
    width: 120px;
  }
  .foot_btn_box {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .collapse_input_cell_box_area .input_after_div {
    width: 88%;
  }

  .el-collapse-item__header {
    background-color: #dddddd;
    padding: 0 10px;
  }
  .table_edit_column .input_box .el-input {
    width: 60%;
  }
  .table_edit_column .input_box:first-child .el-input {
    width: 90%;
  }

  .search_box {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
    margin: 20px auto;
  }
  .search_item1 {
    width: calc(((90vw - 250px)) / 3);
    // margin-bottom:20px;
    // cursor: pointer;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    align-items: center;
    span {
      min-width: 80px;
      text-align: right;
    }
    /* margin-right: 20px; */
  }
  .userInfo {
    height: 40px;
    // border: 1px solid red;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .span_h {
      font-weight: bold;
    }
    .span_n {
      // color: aqua
    }
    .user {
      width: 200px;
      // border: 1px solid green;
    }
    .user1 {
      .span_h {
        display: inline-block;
        min-width: 100px;
        text-align: center;
      }
      width: 200px;
    }
  }
  table tr td {
    width: 33%;
    height: 48px;
    border: solid #ebeef5;
    border-width: 0px 1px 1px 0px;
    padding-left: 10px;
    white-space: nowrap;
  }
  .tab_class {
    border: solid #ebeef5;
    border-radius: 5px;
    border-width: 1px 0px 0px 1px;
    width: 95%;
    margin: 20px auto;
  }
  .befor_text_bold {
    font-weight: bold;
  }

  .search_item2 {
    width: calc(((92vw - 250px)) / 4);
    margin-bottom: 20px;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    justify-content: center;
    align-items: center;
    height: 50px;
    // background-color: red;
  }
  .order_box {
    width: 95%;
    margin: 0 auto;
    border: 1px solid red;
    height: 20px;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;
    .order_item {
      width: 34%;
      border: 1px solid green;
      height: 20px;
      display: flex;
      flex-wrap: nowrap;
      align-items: center;
      padding-left: 10px;
    }
  }
  .infoform {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .infoform_item {
      width: 30%;
    }
  }
  .input_time_fl {
    flex: 0 1 auto;
    width: 60%;
  }
}
</style>



