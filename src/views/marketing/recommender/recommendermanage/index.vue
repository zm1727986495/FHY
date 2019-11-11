<template>
  <div class="recommenman">
    <!-- 导航栏 -->
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <el-card>
      <!-- 查询条件组 -->
      <searchinfo @get_List="getDataFun" ref="searinfo"></searchinfo>

      <div class="h-width"></div>

      <div class="btn_list_1 m-top20">
        <el-button size="small" v-if="btnJurisdiction['recommendermanage_add']" class="button-96" @click="addrecommender">新增</el-button>
        <el-button size="small" v-if="btnJurisdiction['recommendermanage_exm']" class="button-96" @click="examine">审核</el-button>
        <el-button size="small" v-if="btnJurisdiction['recommendermanage_edit']" class="button-96" @click="editrecommender">修改</el-button>
        <el-button size="small" v-if="btnJurisdiction['recommendermanage_del']" class="button-96" @click="cancelrecommender">作废</el-button>
        <el-button size="small" v-if="btnJurisdiction['recommendermanage_upup']" class="button-96" @click="subrecommender">提交</el-button>
        <el-button size="small" v-if="btnJurisdiction['recommendermanage_log']" class="button-96" @click="examinelog">审核记录</el-button>
        <el-button size="small" v-if="btnJurisdiction['recommendermanage_export']" class="button-96" @click="exportEx">导出</el-button>
        <el-button size="small" v-if="btnJurisdiction['recommendermanage_change']" class="button-96" @click="changelog">变更记录</el-button>
      </div>

      <!-- 审核记录 -->
      <examinedia :visible="examine_vis" v-if="examine_vis" :referrerId="referrerId" @close_examin="examineclose"></examinedia>

      <!-- changelogdia变更记录 -->
      <changelogdia :visible="changelog_vis" v-if="changelog_vis" :referrerId="referrerId" @close_change="changeclose"></changelogdia>

      <!-- table表格 -->
      <div class="table_list lvs attribute m-top20">
        <el-table border :row-key="getRowKeys" :row-class-name="tableRowClassName" @selection-change="handleSelectionChange" :data="tabList" style="width: 100%;">
          <el-table-column type="selection" width="45" fixed='left' :reserve-selection="true"></el-table-column>
          <el-table-column prop="referrerStatus" label="申请状态" width="120" align="center">
            <template slot-scope="scope">
              <!-- 0待提交  1通过 2驳回  3审核中  4待审核 -->
              <div>
                <p v-if="scope.row.referrerStatus == '0' ">待提交</p>
                <p v-if="scope.row.referrerStatus == '1' ">通过</p>
                <p v-if="scope.row.referrerStatus == '2' ">驳回</p>
                <p v-if="scope.row.referrerStatus == '3' ">审核中</p>
                <p v-if="scope.row.referrerStatus == '4' ">待审核</p>
                <p v-if="scope.row.referrerStatus == '5' ">驳回修改信息</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="applySn" label="申请单号" width="120" sortable align="center"></el-table-column>

          <el-table-column prop="companyName" label="公司" width="130" align="center" show-overflow-tooltip></el-table-column>

          <el-table-column prop="referrerName" label="外部推荐人" width="120" align="center">
            <template slot-scope="scope">
              <div>
                <p
                  class="table_action_span"
                  @click="userinfodia(scope.row)"
                >{{scope.row.referrerName}}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="phone" label="联系电话" width="120" align="center"></el-table-column>

          <el-table-column prop="idCard" label="推荐人身份证号" width="200" align="center"></el-table-column>

          <el-table-column prop="referrerLevelName" label="返点等级" width="120" align="center"></el-table-column>

          <el-table-column prop="referrerType" label="外部推荐人类型" width="120" align="center"></el-table-column>

          <el-table-column prop="jobState" label="工作状态" width="120" align="center">
            <template slot-scope="scope">
              <!-- 0:待提交 1:待审核 2:审核通过 3:驳回 -->
              <div>
                <p v-if="scope.row.jobState == '1' ">在职</p>
                <p v-if="scope.row.jobState == '2' ">离职</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="position" label="岗位" width="120" align="center"></el-table-column>

          <el-table-column prop="accountName" label="户名" width="120" align="center"></el-table-column>

          <el-table-column prop="openingBank" label="开户行" width="150" align="center" show-overflow-tooltip></el-table-column>

          <el-table-column prop="accountNumber" label="银行账号" width="200" align="center"></el-table-column>

          <el-table-column prop="applyTime" label="申请时间" width="160" align="center"></el-table-column>

          <el-table-column prop="applyName" label="申请人" width="120" align="center"></el-table-column>
        </el-table>
      </div>

      <!-- 推荐人信息 -->
      <userInfodia :visible="userInfo_vis" :ruleForm="ruleForm" @close_user="userInfoclose"></userInfodia>

      <!-- 分页 -->
      <div class="pagination_wrap">
        <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
      </div>
    </el-card>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import {
  listReferrerByPage, //查询
  addBrand, //添加推荐人
  getReferrer, //查看推荐人信息
  listReferrerCheckLog, //获取推荐人审核记录
  cancelReferrer, //作废
  commitReferrer, //提交
  referrerChangeRecord //变更记录
} from "@/api/order/recommender/recommender";
import module from "../../../../../config/index"; //导出文件
import searchinfo from "./searchInfo"; //查询条件
import userInfodia from "../filemanage/userInfodia"; //用户信息
import examinedia from "./examinedia"; //审核记录条件
import changelogdia from "./changelogdia"; //变更记录条件

import spot from "@/assets/images/spot.png";
export default {
  components: {
    breadcrumb,
    pagination,
    searchinfo, //查询条件
    userInfodia, //推荐人信息弹框
    examinedia, //审核弹框
    changelogdia //变更记录弹框
  },
  // name: 'brandmanagement',
  data() {
    return {
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),//按钮权限
      navList: [], //头部面包屑
      currentPage: 1,
      pageSize: 10,
      total: 0,
      tabList: [],
      elsectVal: [],
      ruleForm: {},
      form:{},//查询条件
      userInfo_vis: false, //推荐人信息弹框是否显示
      referrerId: "", //推荐人id
      examine_vis: false, //审核记录弹框是否显示
      logResult: [],
      referrerId: "", //推荐人id     往弹出组件传值使用
      changetabList: [], //变更记录查询数据
      changelog_vis: false, //变更记录弹框是否显示.
      downFile: ""
    };
  },

  activated(){
     // 头部面包屑
    this.navList = this.$route.meta;
    this.$refs['searinfo'].searchFun();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  //   this.$refs['searinfo'].searchFun();
  //   // this.downFile =
  //   //   module.dev.proxyTable["/api"].target +
  //   //   "/api/pc/referrer/exportListReferrer"
  // },
  methods: {
    exportEx() {
      let {
        searchText,
        referrerStatus,
        startTime,
        endTime
      } = this.$refs.searinfo.searchForm;
      let str = `?searchText=${searchText ? searchText : ""}&referrerStatus=${
        referrerStatus ? referrerStatus : ""
      }&startTime=${startTime ? startTime : ""}&endTime=${
        endTime ? endTime : ""
      }`;
      str =
        module.dev.proxyTable["/api"].target +
        "/api/pc/referrer/exportListReferrer" +
        str;
      console.log(str);
      // str = module.dev.proxyTable["/api"].target+"/api/pc/batchImport/exportBatchImport"
      window.location.href = str;
    },
    // 新增推荐人
    addrecommender() {
      this.$router.push({
        path: "addrecommender"
      });
    },
    //判断是否勾选  且之勾选一条数据
    canonlyFun() {
      if (this.elsectVal.length < 1) {
        this.$message.warning("您未勾选!");
        return false;
      } else if (this.elsectVal.length > 1) {
        this.$message.warning("只能勾选一条!");
        return false;
      } else {
        return true;
      }
    },

    // 编辑推荐人
    editrecommender() {
      if(this.canonlyFun()){
         this.$router.push({
            path: "addrecommender",
            query: {
              referrerId: this.elsectVal[0].referrerId,
              workFlowBusinessId:this.elsectVal[0].workFlowBusinessId
            }
          });
        // if(
        //   this.elsectVal[0].referrerStatus == "0" ||
        //   this.elsectVal[0].referrerStatus == "1" || 
        //   this.elsectVal[0].referrerStatus == "2" || 
        //   this.elsectVal[0].referrerStatus == "5"){
         
        // }else{
        //   this.$message.warning("审核中和待审核状态不可修改")
        // }
      }
    },

    //作废推荐人
    cancelrecommender() {
      if (this.elsectVal.length == 0) {
        this.$message.error("请勾选要作废的推荐人");
      } else {
        this.$confirm("是否作废信息?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let arr = [];
            arr = this.elsectVal.map(item => {
              return item.referrerId;
            });
            //操作调接口
            let data = {
              referrerIds: arr
            };
            cancelReferrer(data).then(res => {
              if (res.status == "200") {
                this.$message.success("作废推荐人成功");
                this.getListFun();
              } else {
                this.$message.error("作废推荐人失败");
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      }
    },
    getRowKeys(row) {
      return row.referrerId;
    },

    // 提交推荐人
    subrecommender() {
      if (this.elsectVal.length == 0) {
        this.$message.error("请勾选要提交的推荐人");
      } else if (this.elsectVal.length > 1) {
        this.$message.error("只能编辑单条信息");
      } else if (this.elsectVal[0].referrerStatus != "0") {
        this.$message.error("仅可提交待提交状态信息");
      } else {
        this.$confirm("是否提交本条信息?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            //操作调接口
            let data = {
              referrerId: this.elsectVal[0].referrerId
              // referrerStatus: 1
            };
            commitReferrer(data).then(res => {
              if (res.status == "200") {
                this.$message.success("提交推荐人成功");
                this.getListFun();
              } else {
                this.$message.error("提交推荐人失败");
              }
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      }
    },

    // 审核推荐人
    examine() {
      // referrerStatus
      if (this.elsectVal.length == 0) {
        this.$message.error("请勾选要审核的信息");
      } else if (this.elsectVal.length > 1) {
        this.$message.error("只能编辑单条信息");
      } else {
        let {referrerStatus,referrerId,workFlowBusinessId}=this.elsectVal[0]
        //0待提交  1通过 2驳回  3审核中  4待审核
        // if(referrerStatus == '0'){
        //   this.$message.warning('待提交推荐人无法审核信息');
        //   return;
        // }
        if(referrerStatus == '3' || referrerStatus == '4'){
          this.$router.push({
            path: "examine",
            query: {referrerId: referrerId,operateResult: referrerStatus,workFlowBusinessId}
          });
        }else{
          this.$message.error('当前状态无法审核!')
        }
      }
    },

    //审核记录  打开审核记录弹框
    examinelog() {
      if (this.elsectVal.length == 0) {
        this.$message.error("请勾选要查看的推荐人");
      } else if (this.elsectVal.length > 1) {
        this.$message.error("只能查看单条信息");
      } else {
        this.referrerId = this.elsectVal[0].referrerId;
        this.examine_vis = true;
      }
    },

    //关闭弹框   审核记录
    examineclose() {
      this.examine_vis = false;
    },

    //变更记录  打开变更记录弹框
    changelog() {
      if (this.elsectVal.length == 0) {
        this.$message.error("请勾选要查看的推荐人");
      } else if (this.elsectVal.length > 1) {
        this.$message.error("只能查看单条信息");
      } else {
        this.referrerId = this.elsectVal[0].referrerId;
        this.changelog_vis = true;
      }
    },

    //关闭弹框   变更记录
    changeclose() {
      this.changelog_vis = false;
    },

    //确认关闭弹框   变更记录
    changeok() {
      this.changelog_vis = false;
    },
    getDataFun(form){
      this.form = form;
      this.currentPage = 1 ;
      this.getListFun();
    },


    // 查询按钮查询列表
    getListFun() {
      let data = {
        ...this.form,
        page: this.currentPage,
        limit: this.pageSize
      };
      listReferrerByPage(data).then(res => {
        console.log(res);
        if (res.status == 200) {
          this.tabList = res.data.rows;
          this.total = res.data.total;
        } else {
          this.$message.error("查询失败");
        }
      });
    },

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

