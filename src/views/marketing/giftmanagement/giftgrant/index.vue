<template>
  <!-- 礼品发放管理 -->
  <div class="giftgrant_cl">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <!-- 查询组件 -->
      <searchInfo @search_fun="getListFun"></searchInfo>
      <div class="h-widths"></div>
      <!-- 按钮 -->
      <div class="btn_list_1 m-top20">
        <el-button size="small" class="button-96" v-if="btnJurisdiction['giftgrant_add']" @click="giveFun">赠送礼品</el-button>
        <el-button size="small" class="button-96" v-if="btnJurisdiction['giftgrant_back']" @click="returnFun">礼品退回</el-button>
      </div>

      <div class="table_list lvs attribute">
        <el-table
          border
          :row-class-name="tableRowClassName"
          :row-key="getRowKeys"
          @selection-change="handleSelectionChange"
          :data="tabList"
          style="width: 100%;"
          v-loading="loading"
        >
          <el-table-column type="selection" fixed='left' width="40" :reserve-selection="true"></el-table-column>
          <el-table-column prop="giftCode" align="center" label="礼品编码" sortable width="240"></el-table-column>
          <el-table-column prop="giftName" align="center" label="礼品名称" sortable width="240"></el-table-column>
          <el-table-column prop="giftAmount" align="center" label="礼品数量" sortable width="240"></el-table-column>
          <el-table-column prop="sendWay" align="center" label="赠送方式" sortable width="240">
            <template slot-scope="scope">
              <!-- 0随车 1自提 -->
              <div>
                <p v-if="scope.row.sendWay == '1' ">随车</p>
                <p v-if="scope.row.sendWay == '2' ">自提</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="sendName" align="center" label="赠送人" sortable width="240"></el-table-column>
          <el-table-column prop="createTime" align="center" label="赠送时间" sortable width="240"></el-table-column>
          <el-table-column prop="storeName" align="center" label="门店" sortable width="240"></el-table-column>
          <el-table-column prop="giftStatus" align="center" label="礼品状态" sortable width="240">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.row.giftStatus == '0' ">已赠送</p>
                <p v-if="scope.row.giftStatus == '1' ">已退回</p>
                <!-- <p v-if="scope.row.giftStatus == '2' ">已退款</p> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="orderNumber" align="center" label="订单号" sortable width="240"></el-table-column>
          <el-table-column prop="orderTypeName" align="center" label="订单类型" sortable width="240"></el-table-column>
          <el-table-column prop="orderGoodsType" align="center" label="订单货品类型" sortable width="240">
            <!-- 1 成品， 2 订制品' -->
            <template slot-scope="scope">
              <div>
                <p v-if="scope.row.orderGoodsType == '1' ">成品</p>
                <p v-if="scope.row.orderGoodsType == '2' ">订制品</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="brandName" align="center" label="产品品牌" sortable width="240"></el-table-column>
          <el-table-column prop="categoryName" align="center" label="产品类别" sortable width="240"></el-table-column>
          <el-table-column prop="contractMoney" align="center" label="合同金额/元" sortable width="240"></el-table-column>
          <el-table-column prop="paymentAmount" align="center" label="实收金额/元" sortable width="240"></el-table-column>
        </el-table>
      </div>

      <!-- 分页 -->
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
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import searchInfo from "./components/searchInfo"; //查询条件组件
import { getNames } from "src/utils/pubilcFn.js";
import {
  issueGiftsList, //获取列表
  returnGifts //礼品退回
} from "api/order/giftmanagement/giftmanagement";
import { loadavg } from "os";
export default {
  components: {
    breadcrumb,
    pagination,
    searchInfo //查询条件组件
  },
  // name: 'brandmanagement',
  data() {
    return {
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),//按钮权限
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      navList: [], //头部面包屑
      form: {}, //查询条件
      elsectVal: [], //选中框
      tabList: [], //table数据
      loading: true,

      refund_vis: false //退款弹框是否课件
    };
  },

  activated(){
    // 头部面包屑
    this.navList = this.$route.meta;
    this.getListFun();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  //   this.getListFun();
  // },

  methods: {
    getListFun(form) {
      this.form = form;
      this.currentPage = 1;
      this.issueGiftsListFun();
    },

    //获取礼品发放列表
    issueGiftsListFun() {
      this.loading = true;
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        ...this.form
      };
      issueGiftsList(data)
        .then(res => {
          this.loading = false;
          this.total = res.data.total;
          this.tabList = res.data.rows;
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },

    //勾选记忆
    getRowKeys(row) {
      return row.orderGiftId;
    },

    //赠送
    giveFun() {
      this.$router.push({
        path: "givegift",
        query: {}
      });
    },

    //退回  returnGifts
    returnFun() {
      if (this.elsectVal.length == "0") {
        this.$message.warning("请勾选礼品");
      } else {
        let flag = this.elsectVal.every(item => {
          return item.giftStatus != 1;
        });
        if (flag) {
          this.$confirm("是否退回勾选礼品?", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          })
            .then(() => {
              let data = {
                orderGiftDTOList: this.elsectVal
              };
              returnGifts(data)
                .then(res => {
                  if (res.status == "200") {
                    this.$message.success("礼品退回成功");
                    this.getListFun();
                  }
                })
                .catch(error => {
                  console.log(
                    error + "views/marketing/giftmanagement/giftgrant/index"
                  );
                });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消退回"
              });
            });
        } else {
          this.$message.warning("所勾选礼品不可存在已退回礼品");
        }
      }
    },

    //获取列表
    searchFun(form) {
      this.currentPage = 1;
      this.form = form;
      this.issueGiftsListFun();
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.issueGiftsListFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.issueGiftsListFun();
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
    },

    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style scoped lang='scss'>
.giftgrant_cl {
  .btn_list_1 {
    height: 55px;
    float: left;
  }
}
</style>

