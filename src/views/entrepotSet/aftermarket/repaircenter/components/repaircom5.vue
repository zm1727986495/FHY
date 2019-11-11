<template>
  <div class="repaircom5">
    <!-- <el-card class="m-top20">
      <div class="search_box">
        <div class="search_item">
          <el-input v-model="name" class="width-100" placeholder="商品名称"></el-input>
        </div>

        <div class="search_item">
          <el-date-picker
            v-model="time1"
            class="width-100"
            style="width:100%"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
          ></el-date-picker>
        </div>
        <div class="search_item">
          <el-button class="button-fc" type="warning" size="medium" @click="searchFun">查询</el-button>
          <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
        </div>
        <div class="search_item"></div>
      </div>
    </el-card> -->

    <!-- 照片预览弹框 -->
    <picPreviewDia :visible="pic_vis" :picList="picList" @close_pic="closeAll"></picPreviewDia>

    <!-- table表格 -->
    <div class="table_list lvs attribute m-top20">
      <el-table border :data="tabList" style="width: 100%;" :row-class-name="tableRowClassName">
        <!-- 1安装 2维修 3入库 4出库 5物流 , -->
        <el-table-column prop="source" label="来源" width="240" sortable align="center">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.source == 1">安装</p>
              <p v-if="scope.row.source == 2">维修</p>
              <p v-if="scope.row.source == 3">入库</p>
              <p v-if="scope.row.source == 4">出库</p>
              <p v-if="scope.row.source == 5">物流</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="orderNumber" label="来源单号" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="taskDutyNumber" label="定责单号" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="status" label="状态" width="240" sortable align="center">
          <!-- 状态 1待处理 2处理中 3处理完成 4全部接受' -->
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.status == 1">待处理</p>
              <p v-if="scope.row.status == 2">处理中</p>
              <p v-if="scope.row.status == 3">处理完成</p>
              <p v-if="scope.row.status == 4">全部接受</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="groupName" label="发起部门" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="taskDutyPic" label="定责照片" width="240" sortable align="center">
          <template slot-scope="scope">
            <p class="table_action_span" @click="picPreview(scope.row.taskDutyPic)">图片预览</p>
          </template>
        </el-table-column>

        <el-table-column prop="sponsorTime" label="发起定责时间" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="remake" label="备注" width="240" sortable align="center"></el-table-column>
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
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import picPreviewDia from "@/views/components/picPreviewDia"; //图片预览

import { listTaskDuty } from "api/Installation/dispatchcenter/dispatchcenter";

export default {
  components: {
    breadcrumb,
    picPreviewDia,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      navList: [], //头部面包屑
      pic_vis: false, //照片是否显示
      picList: [], //照片
      elsectVal: [], //选中框
      tabList: [], //table数据
      time1: [],
      name: "",
      dialogVisible: false
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.searchFun();
  },
  methods: {

    //图片预览
    picPreview(list) {
      this.pic_vis = true;
      this.picList = list;
    },
    closeAll() {
      this.pic_vis = false;
    },
    // 查询按钮
    searchFun() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        taskType: "1",
        orderId: this.$route.query.orderId,
      };
      listTaskDuty(data).then(res => {
        if (res.status == "200") {
          this.tabList = res.data.rows;
          this.total = res.data.total;
        } else {
          this.$message.error("获取维修改制日志失败");
        }
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
.repaircom5 {
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

