<template>
  <div class="repaircom5">
    <!-- <el-card class="m-top20">
      <div class="search_box">
        <div class="search_item">
          <el-input v-model="name" class="width-100" placeholder="安装任务编号/汇报人"></el-input>
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
    </el-card>-->

    <!-- 照片预览弹框 -->
    <picPreviewDia :visible="pic_vis" :picList="picList" @close_pic="closeAll"></picPreviewDia>

    <!-- table表格 -->
    <div class="table_list lvs attribute m-top20">
      <el-table border :data="tabList" style="width: 100%;" :row-class-name="tableRowClassName">
        <el-table-column
          prop="designateInstallationNumber"
          label="安装任务编号"
          width="240"
          sortable
          align="center"
        ></el-table-column>

        <el-table-column prop="stryppedPic" label="改制照片" width="240" sortable align="center">
          <template slot-scope="scope">
            <p class="table_action_span" @click="picPreview(scope.row.stryppedPic)">图片预览</p>
          </template>
        </el-table-column>

        <el-table-column prop="dutyName" label="定责对象" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="stryppedDownNumber" label="改制板数" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="unitPrice" label="单块价格" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="materialCost" label="材料成本" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="stryppedDownMoney" label="改制费" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="stryppedDownFactory" label="改板厂" width="240" sortable align="center"></el-table-column>

        <el-table-column
          prop="stryppedDownContent"
          label="改制原因"
          width="240"
          sortable
          align="center"
        ></el-table-column>

        <el-table-column prop="name" label="汇报人" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="reportTime" label="汇报时间" width="240" sortable align="center"></el-table-column>
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
import { listStryppedDown } from "api/Installation/dispatchcenter/dispatchcenter";

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

      elsectVal: [], //选中框
      tabList: [], //table数据
      pic_vis: false, //照片是否显示
      picList: [], //照片
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
        orderId: this.$route.query.orderId,
      };
      listStryppedDown(data).then(res => {
        if (res.status == "200") {
          this.tabList = res.data.rows;
          this.total = res.data.total;
        } else {
          this.$message.error("获取维修改制日志失败");
        }
      });
    },

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
  .installfrontphotos {
    display: flex;
    flex-wrap: wrap;
    li {
      border: 1px solid #000;
      width: 100px;
      height: 100px;
      // flex: 1;
      margin: 0 15px 10px 0;
    }
  }
}
</style>

