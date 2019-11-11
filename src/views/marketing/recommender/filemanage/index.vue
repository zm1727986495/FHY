<template>
  <div class="recommenman">
    <!-- 导航栏 -->
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <el-card>
      <!-- 查询条件组 -->
      <searchinfo @get_List="getData" ref="searchinfo"></searchinfo>

      <div class="h-width"></div>

      <!-- table表格 -->
      <div class="table_list lvs attribute m-top20">
        <el-table
          border
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
          :data="tabList"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="45" fixed='left'></el-table-column>
          <el-table-column prop="updateTime" label="审核通过时间" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="applySn" label="申请单号" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="companyName" label="公司" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="referrerName" label="外部推荐人" width="240" sortable align="center">
            <template slot-scope="scope">
              <div>
                <p
                  class="table_action_span"
                  @click="userinfodia(scope.row)"
                >{{scope.row.referrerName}}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="phone" label="联系电话" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="idCard" label="推荐人身份证号" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="referrerType" label="外部推荐人类型" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="jobState" label="状态" width="240" sortable align="center">
            <template slot-scope="scope">
              <!-- 0:待提交 1:待审核 2:审核通过 3:驳回 -->
              <div>
                <p v-if="scope.row.jobState == '1' ">在职</p>
                <p v-if="scope.row.jobState == '2' ">离职</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="position" label="岗位" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="accountName" label="户名" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="openingBank" label="开户行" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="accountNumber" label="银行账号" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="applyTime" label="申请日期" width="240" sortable align="center"></el-table-column>
        </el-table>
      </div>

      <!-- 推荐人信息 -->
      <userInfodia :visible="userInfo_vis" :ruleForm="ruleForm" @close_user="userInfoclose"></userInfodia>

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
import searchinfo from "./searchInfo"; //查询条件
import userInfodia from "./userInfodia"; //用户信息

import {
  getReferrerDocument //查询
} from "@/api/order/recommender/filemanage";
import {
  getReferrer //查看推荐人信息
} from "@/api/order/recommender/recommender";

import spot from "@/assets/images/spot.png";
export default {
  components: {
    breadcrumb,
    pagination,
    searchinfo, //查询条件
    userInfodia //推荐人信息弹框
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
      tabList: [],
      userInfo_vis: false, //用户弹框是否显示
      ruleForm: {},
      form:{},//查询条件
    };
  },

  activated(){
    // 头部面包屑
    this.navList = this.$route.meta;
    this.$refs['searchinfo'].searchFun();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  //   this.$refs['searchinfo'].searchFun();
  // },
  methods: {
    //用户信息弹框
    userinfodia(row) {
      this.userInfo_vis = true;
      let data = {
        referrerId: row.referrerId
      };
      getReferrer(data).then(res => {
        this.ruleForm = res.data;
        this.ruleForm.brandId = String(this.ruleForm.brandId);
        this.ruleForm.jobState = String(this.ruleForm.jobState);

        let arr1 = this.ruleForm.accessoryList.filter(item => {
          return item.dataSourceEnum == "IdCopiesImg";
        });
        this.ruleForm.fileList1 = arr1.map(item => {
          return {
            ...item,
            url: item.fileUrl
          };
        });

        let arr2 = this.ruleForm.accessoryList.filter(item => {
          return item.dataSourceEnum == "BankcardCopiesImg";
        });
        this.ruleForm.fileList2 = arr2.map(item => {
          return {
            ...item,
            url: item.fileUrl
          };
        });

        let arr3 = this.ruleForm.accessoryList.filter(item => {
          return item.dataSourceEnum == "VCardCopiesImg";
        });
        this.ruleForm.fileList3 = arr3.map(item => {
          return {
            ...item,
            url: item.fileUrl
          };
        });

        let arr4 = this.ruleForm.accessoryList.filter(item => {
          return item.dataSourceEnum == "ProtocolImg";
        });
        this.ruleForm.fileList4 = arr4.map(item => {
          return {
            ...item,
            url: item.fileUrl
          };
        });

        this.ruleForm.totalMoney =
          this.ruleForm.totalMoney == null ? "0" : this.ruleForm.totalMoney;
        this.ruleForm.recommendNumber =
          this.ruleForm.recommendNumber == null
            ? "0"
            : this.ruleForm.recommendNumber;
        console.log(this.ruleForm);
      });

      this.referrerId = row.referrerId;
    },

    //关闭弹框   审核记录
    userInfoclose() {
      this.userInfo_vis = false;
    },

    getData(form){
      this.currentPage = 1;
      this.form = form;
      this.getListFun();
    },

    //查询按钮
    getListFun() {
      let data = {
        ...this.form,
        limit: this.pageSize,
        page: this.currentPage
      };
      getReferrerDocument(data).then(res => {
        console.log(res);
        this.total = res.data.total;
        this.tabList = res.data.rows;
      });
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
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
.recommenman {
  .persondia {
    color: #93dfea;
    cursor: pointer;
  }
}
</style>

