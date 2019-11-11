<template>
  <div class="outrecommender">
    <!-- 导航栏 -->
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <el-card>
      <!-- 查询条件组 -->
      <!-- <searchinfo @get_List="getListFun"></searchinfo> -->

      <div class="h-width"></div>

      <div class="btn_list_1">
        <el-button size="small" class="button-96" @click="examine">审核</el-button>
        <el-button size="small" class="button-96">查看流程图</el-button>
        <el-button size="small" class="button-96" @click="examinelog">审核记录</el-button>
        <el-button size="small" class="button-96">附件管理</el-button>
        <el-button size="small" class="button-96 button-96-btn">
          <a class="button-96-a" :href="downFile">导出</a>
        </el-button>
        <!-- <el-button size="small" class="button-96" @click="exportdia">变更记录</el-button>  -->
      </div>

      <!-- 审核记录 -->
      <!-- <examinedia :visible="examine_vis" @close_examin="examineclose" @examin_ok="examinok"></examinedia> -->

      <!-- 审核记录 -->
      <!-- <examinedia :visible="examine_vis" :tabList="logResult" @close_examin="examineclose"></examinedia> -->

      <!-- 导出 -->
      <exportdia :visible="exportdia_vis" @close_export="exportclose" @export_ok="exportok"></exportdia>

      <!-- table表格 -->
      <div class="table_list lvs attribute m-top20">
        <el-table
          border
          :row-class-name="tableRowClassName"
          :row-style="tableBodycolor"
          @selection-change="handleSelectionChange"
          :data="tabList"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="referrerStatus" label="状态" width="240" sortable align="center">
            <template slot-scope="scope">
              <!-- 0:待提交 1:待审核 2:审核通过 3:驳回 -->
              <div>
                <p v-if="scope.row.referrerStatus == '0' ">待提交</p>
                <p v-if="scope.row.referrerStatus == '1' ">待审核</p>
                <p v-if="scope.row.referrerStatus == '2' ">审核通过</p>
                <p v-if="scope.row.referrerStatus == '3' ">驳回</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="companyName" label="公司" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="referrerName" label="外部推荐人" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="phone" label="联系电话" width="240" sortable align="center"></el-table-column>

          <el-table-column
            prop="outsidetReferrerType"
            label="外部推荐人类型"
            width="240"
            sortable
            align="center"
          ></el-table-column>

          <el-table-column prop="position" label="岗位" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="name" label="级别" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="accountName" label="户名" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="openingBank" label="开户行" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="accountNumber" label="账号" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="applyTime" label="创建日期" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="applyName" label="报备人" width="240" sortable align="center"></el-table-column>
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
import {
  listReferrerCheckByPage, //推荐人审核管理列表
  addReferrerCheckLog, //添加审核记录
  updateReferrerStatus //修改信息表审核状态
} from "@/api/administrationCenter/outrecommender/outrecommender";

import {
  listReferrerCheckLog //获取推荐人审核记录
} from "@/api/order/recommender/recommender";

import module from "../../../../../config/index"; //导出文件


import pagination from "../../../components/pagination";
import breadcrumb from "../../../components/breadcrumb";
// import searchinfo from "../../../order/recommender/recommendermanage/searchInfo"; //查询条件
// import examinedia from "@/views/order/recommender/recommendermanage/examinedia"; //审核记录  
import exportdia from "./exportdia"; //导出

import spot from "@/assets/images/spot.png";
export default {
  components: {
    // breadcrumb,
    // pagination,
    // searchinfo, //查询条件
    // examinedia, //审核弹框
    // exportdia //导出数据弹框
  },
  // name: 'brandmanagement',
  data() {
    return {
      navList: [], //头部面包屑
      currentPage: 1,
      pageSize: 10,
      total: 100,
      tabList: [],
      elsectVal: [],
      logResult: [],
      examine_vis: false, //审核记录弹框是否显示
      exportdia_vis: false, //导出弹框是否显示
      downFile: "",        //导出地址
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.getListFun();
    this.downFile =
      module.dev.proxyTable["/api"].target +
      "/api/pc/referrer/exportCheckListReferrer";
  },
  methods: {
    // 审核推荐人
    examine() {
      // referrerStatus
      if (this.elsectVal.length == 0) {
        this.$message.error("请勾选要审核的信息");
      } else if (this.elsectVal.length > 1) {
        this.$message.error("只能编辑单条信息");
      } else {
        this.$router.push({
          path: "examine",
          query: {
            referrerId: this.elsectVal[0].referrerId
          }
        });
      }
    },

    //审核记录  打开审核记录弹框
    examinelog() {
      if (this.elsectVal.length == 0) {
        this.$message.error("请勾选要查看的推荐人");
      } else if (this.elsectVal.length > 1) {
        this.$message.error("只能查看单条信息");
      } else {
        let data = {
          referrerId: this.elsectVal[0].referrerId
        };
        listReferrerCheckLog(data).then(res => {
          this.logResult = res.result;
          this.examine_vis = true;
        });
      }
    },

    //关闭弹框   审核记录
    examineclose() {
      this.examine_vis = false;
    },

    //确认关闭弹框   审核记录
    examinok() {
      this.examine_vis = false;
      this.$message("审核信息成功");
    },

    //导出数据  打开导出数据弹框
    // openexportdia() {
    //   this.exportdia_vis = true;
    // },

    //关闭弹框   导出数据
    exportclose() {
      this.exportdia_vis = false;
    },

    //确认关闭弹框   导出数据
    exportok() {
      this.exportdia_vis = false;
    },

    // 查询按钮查询列表
    getListFun(form) {
      if (form) {
        this.currentPage = 1;
      }
      let data = {
        ...form,
        page: this.currentPage,
        limit: this.pageSize
      };
      listReferrerCheckByPage(data).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.tabList = res.data.rows;
          this.total = res.data.total;
        } else {
          this.$message.error("查询失败");
        }
      });
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getListFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getListFun();
    }
  }
};
</script>
<style scoped lang='scss'>
.outrecommender {
  .btn_list_1 {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    > button {
      margin: 5px;
    }
    .button-96-btn {
      padding: 0;
    }
    .button-96-a {
      display: block;
      width: 100%;
      height: 100%;
      padding: 9px 10px;
    }
  }
}
</style>

