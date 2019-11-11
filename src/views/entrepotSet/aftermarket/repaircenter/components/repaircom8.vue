<template>
  <div class="repaircom8">
    <!-- table表格 -->
    <div class="table_list lvs attribute m-top20">
      <el-table border :data="tabList" style="width: 100%;" :row-class-name="tableRowClassName">
        <el-table-column prop="questionnaireNumberl" label="问题单号" sortable align="center"></el-table-column>

        <el-table-column prop="feedbackTime" label="反馈时间" sortable align="center"></el-table-column>

        <el-table-column prop="expectedVisitTime" label="希望上门时间" sortable align="center"></el-table-column>

        <el-table-column prop="customerProblemDescription" label="客户问题描述" sortable align="center"></el-table-column>

        <el-table-column prop="recordOfCommunication" label="沟通记录" sortable align="center"></el-table-column>

        <el-table-column label="操作" sortable align="center">
          <p class="table_action_span">查看详情</p>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="查看详情及照片" custom-class="customDialogTitle" :visible.sync="detailsVisible">
      <div class="dialogBody">
        <el-form label-width="130px" :model="fromdata" class="demo_form_inline">
          <el-form-item label="客户问题描述：" class="widmax">{{fromdata.customerProblemDescription}}</el-form-item>
          <el-form-item label="反馈时间：">{{fromdata.feedbackTime}}</el-form-item>
          <el-form-item label="希望上门时间：">{{fromdata.expectedVisitTime}}</el-form-item>
          <el-form-item label="问题照片：" class="widmax">
            <el-image
              v-for="(item,index) in fromdata.afterSalesProblemRecordPic"
              :src="item.fileUrl"
              fit="cover"
              :key="index"
              style="width: 100px; height: 100px; margin: 5px"
            ></el-image>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="detailsVisible = false">关 闭</el-button>
      </span>
    </el-dialog>

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
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { listAfterSalesProblemRecord } from "api/Installation/dispatchcenter/dispatchcenter";
import { afterSalesProblemRecordDetails } from "api/entrepotSet/aftermarket/aftermarket/aftersaleproblem";

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
      navList: [], //头部面包屑

      elsectVal: [], //选中框
      tabList: [{}], //table数据
      time1: [],
      name: "",
      fromdata: {},
      detailsVisible: false
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.searchFun();
  },
  methods: {
    detailscli(val) {
      afterSalesProblemRecordDetails({ afterSalesProblemRecordId: val })
        .then(res => {
          if (res.status == 200) {
            this.fromdata = res.data;
            this.detailsVisible = true;
          }
        })
        .catch(error => {
          console.error("工厂查货:提交备注信息 order/order/order.vue", error);
        });
    },
    // 查询按钮
    searchFun() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        orderId: this.$route.query.orderId
      };
      listAfterSalesProblemRecord(data).then(res => {
        this.tabList = res.data.rows;
        this.total = res.data.total;
      });
    },

    // 重置按钮
    resetFun() {},

    //多选内容改变
    handleSelectionChange(val) {
      this.elsectVal = val;
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.searchFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.searchFun();
    }
  }
};
</script>
<style scoped lang='scss'>
.repaircom8 {
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
    align-items: center;

    .fontMore {
      color: #d0cfcf;
    }
  }
  .table_action_span {
    color: rgb(127, 221, 228);
    cursor: pointer;
  }
}
</style>

