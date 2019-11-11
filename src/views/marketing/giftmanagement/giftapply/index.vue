<template>
  <div class="wrapper">
    <div class="apper">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <el-card>
        <!-- 查询条件组 -->
        <searchinfo ref="searchinfo" @get_List="getListFun"></searchinfo>

        <div class="h-widths"></div>
        <!-- 按钮组 -->
        <div class="btn_list_1 m-top20">
          <el-button size="small" class="button-96" v-if="btnJurisdiction['giftapply_add']" @click="addFun">新增礼品领用申请</el-button>
          <el-button size="small" class="button-96" v-if="btnJurisdiction['giftapply_exm']" @click="examineFun">审核</el-button>
        </div>
        <!-- 撤销的弹框 -->
        <!-- <revokedia
          :visible="revoke_vis"
          :giftCollarId="giftCollarId"
          @close_rev="closerev"
          @send_rev="sendrev"
        ></revokedia>-->

        <!-- table表格 -->
        <div class="table_list lvs attribute">
          <el-table border :row-class-name="tableRowClassName" :row-key="getRowKeys" @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;" v-loading="loading">
            <el-table-column type="selection" width="45" fixed='left' :reserve-selection="true"></el-table-column>
            <el-table-column prop="giftCollarStatus" label="审核状态" width="240" sortable align="center">
              <template slot-scope="scope">
                <!-- 0待审核 1:审核通过 2:驳回 -->
                <div>
                  <p v-if="scope.row.giftCollarStatus == '0' ">待审核</p>
                  <p v-if="scope.row.giftCollarStatus == '1' ">审核通过</p>
                  <p v-if="scope.row.giftCollarStatus == '2' ">驳回</p>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="applyOdd" label="申请单号" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="applyTime" label="申请时间" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="applyUserName" label="申请人" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="storeGifts.number" label="申请数量" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="storeGifts.collarNumber" label="验收数量" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="applyReason" label="申请原因" width="240" sortable align="center" show-overflow-tooltip></el-table-column>

            <el-table-column prop="auditUserName" label="审核人" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="auditTime" label="审核时间" width="240" sortable align="center"></el-table-column>

            <el-table-column prop="storeName" label="所属机构" width="240" sortable align="center"></el-table-column>
          </el-table>
        </div>

        <!-- 分页 -->
        <div class="pagination_wrap">
          <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
        </div>
      </el-card>

      <!-- </el-card> -->
    </div>
  </div>
</template>
<script>
import { listStoreGiftsCollar } from "@/api/order/giftmanagement/giftmanagement";

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
// import revokedia from "./revokedia";
import spot from "@/assets/images/spot.png";
import searchinfo from "./components/searchInfo";
export default {
  components: {
    breadcrumb,
    pagination,
    searchinfo //查询条件
    // revokedia, //撤销弹出框
  },
  // name: 'brandmanagement',
  data() {
    return {
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),//按钮权限
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      spot, //操作图片
      navList: [], //头部面包屑
      form: {}, //查询条件
      elsectVal: [], //选中框
      tabList: [], //table数据
      loading: true //loading

      //revoke_vis: false, //撤销的弹框是否显示
      //giftCollarId: "", //撤销的id
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
    //勾选记忆
    getRowKeys(row) {
      return row.giftCollarId;
    },

    //查询按钮获取
    getListFun(form) {
      this.form = form;
      this.currentPage = 1;
      this.pagetagFun();
    },

    pagetagFun() {
      this.loading = true;
      let query = {
        ...this.form,
        page: this.currentPage,
        limit: this.pageSize
      };

      listStoreGiftsCollar(query)
        .then(res => {
          this.loading = false;
          if (res.status == "200") {
            this.tabList = res.data.rows;
            this.total = res.data.total;
          } else {
            this.loading = false;
            this.$message.error("请求接口错误");
          }
        })
        .catch(error => {
          console.log(error);
          this.loading = false;
        });
    },

    // 新增礼品申请
    addFun() {
      this.$router.push({
        path: "addapply"
      });
    },

    // examinapply
    examineFun() {
      if (this.elsectVal.length == 0) {
        this.$message.error("请勾选要审核的申请单");
      } else if (this.elsectVal.length > 1) {
        this.$message.error("只能单条审核");
      } else {
        if (this.elsectVal[0].giftCollarStatus == 0) {
          this.$router.push({
            path: "/gift/examineapply",
            query: {
              giftCollarId: this.elsectVal[0].giftCollarId
            }
          });
        } else {
          this.$message.error("申请单状态无法审核");
        }
      }
    },

    //撤销申请单  打开弹出层   撤销申请单弹框  需求变更 去掉撤销功能
    // revokeFun() {
    //   if (this.elsectVal.length == 0) {
    //     this.$message.error("请勾选要撤销的申请单");
    //   } else if (this.elsectVal.length > 1) {
    //     this.$message.error("只能单条撤销");
    //   } else {
    //     if (
    //       this.elsectVal[0].giftCollarStatus == 2 ||
    //       this.elsectVal[0].giftCollarStatus == 4
    //     ) {
    //       this.$message.error("申请单状态无法撤回");
    //     } else {
    //       this.giftCollarId = this.elsectVal[0].giftCollarId;
    //       this.revoke_vis = true;
    //     }
    //   }
    // },

    //关闭撤销申请弹出框
    // closerev() {
    //   this.revoke_vis = false;
    // },

    //确认撤销申请
    // sendrev() {
    //   this.revoke_vis = false;
    //   this.pagetagFun();
    // },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.pagetagFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.pagetagFun();
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
      console.log(this.elsectVal);
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style scoped lang='scss'>
.btn_list_1 {
  margin-bottom: 10px;
  display: flex;
  flex-wrap: wrap;
  > button {
    margin: 5px;
  }
}

.pagination_wrap {
  text-align: center;
  height: 50px;
  /* line-height: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

