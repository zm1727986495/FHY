<template>
  <div class="recommenderdia">
    <el-dialog title="选择外部推荐人" :visible.sync="visible" width="60%" :before-close="handleClose" custom-class="customDialogTitle">
      <div class="search_box">
        <el-input v-model="searchText" placeholder="申请单号/姓名/身份证号/开户行/银行卡号/电话" class="input_box"></el-input>
        <el-button type="warning" size="mini" @click="searchFun">查询</el-button>
      </div>
      <!-- table表格 -->
      <div class="table_list lvs attribute">
        <el-table border ref="multipleTable" @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" :data="tabList" style="width: 100%;">
          <el-table-column type="selection" width="45"></el-table-column>
          <el-table-column prop="referrerName" label="外部推荐人" width="240" sortable align="center">
            <template slot-scope="scope">
              <div>{{scope.row.referrerName}}</div>
            </template>
          </el-table-column>
          <el-table-column prop="referrerStatus" label="申请状态" width="240" sortable align="center">
            <template slot-scope="scope">
              <div>
                <!-- 0：待提交；1：审核通过；2：审核驳回；3：审核中；4待审核；5:驳回修改信息', -->
                <p v-if="scope.row.referrerStatus == 0">待提交</p>
                <p v-if="scope.row.referrerStatus == 1">审核通过</p>
                <p v-if="scope.row.referrerStatus == 2">审核驳回</p>
                <p v-if="scope.row.referrerStatus == 3">审核中</p>
                <p v-if="scope.row.referrerStatus == 4">待审核</p>
                <p v-if="scope.row.referrerStatus == 5">驳回修改信息</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="applySn" label="申请单号" width="240" sortable align="center"></el-table-column>
          <el-table-column prop="companyName" label="公司" width="240" sortable align="center"></el-table-column>
          <el-table-column prop="phone" label="联系电话" width="240" sortable align="center"></el-table-column>
          <el-table-column prop="idCard" label="推荐人身份证号" width="240" sortable align="center"></el-table-column>
          <el-table-column prop="outsidetReferrerType" label="外部推荐人类型" width="240" sortable align="center">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.row.outsidetReferrerType == 1">家装工长</p>
                <p v-if="scope.row.outsidetReferrerType == 2">家装设计师</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="jobState" label="工作状态" width="240" sortable align="center">
            <template slot-scope="scope">
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
          <el-table-column prop="applyTime" label="申请时间" width="240" sortable align="center"></el-table-column>
          <el-table-column prop="applyName" label="申请人" width="240" sortable align="center"></el-table-column>
        </el-table>
      </div>
      <!-- 分页 -->
      <div class="pagination_wrap">
        <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" 
          @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addClose">确认</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUpToken } from "@/utils/auth";
import pagination from "@/views/components/pagination";
import {
  listReferrerByPage //查询
} from "@/api/order/recommender/recommender";
export default {
  props: ["visible"],
  components: {
    pagination
  },
  data() {
    return {
      currentPage: 1,
      pageSize: 10,
      elselect: [],
      tabList: [],
      total: 0,
      searchText:"",
    };
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    //查询按钮
    searchFun(){
      this.currentPage = 1 ;
      this.getUserList();
    },
    //获取推荐人列表
    getUserList() {
      let data = {
        searchText:this.searchText,
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
    //勾选函数回调  只能单选一个推荐人
    handleSelectionChange(val) {
      this.elselect = val;
      if (this.elselect.length > 1) {
        this.$refs.multipleTable.toggleRowSelection(this.elselect[0]);
      }
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getUserList();
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getUserList();
    },
    addClose() {
      if (this.elselect.length == 0) {
        this.handleClose();
      } else {
        this.$emit("add_recomm", this.elselect[0]);
      }
    },
    handleClose() {
      this.$message.warning("您没有选择推荐人信息");
      this.$emit("close_recomm");
    }
  }
}
</script>
<style scoped lang='scss'>
.recommenderdia {
  .search_box{
    display: flex;
    flex-wrap: nowrap;
    margin-bottom: 10px;
    .input_box{
      width: 350px;
      margin-right: 25px;
    }
  }
}
</style>

