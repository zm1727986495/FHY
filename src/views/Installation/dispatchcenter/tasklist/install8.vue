<template>
  <div class="repaircom6">
    <!-- <el-card class="m-top20">
      <div class="search_box">
        <div class="search_item">
          <el-input v-model="name" class="width-100" placeholder="安装任务编号/预约人"></el-input>
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

    <!-- table表格 -->
    <div class="table_list lvs attribute m-top20">
      <el-table border :data="tabList" style="width: 100%;" :row-class-name="tableRowClassName">
        <el-table-column prop="declarantTime" label="申报时间" sortable align="center"></el-table-column>

        <el-table-column prop="returnCommodity" label="返厂货品" align="center"></el-table-column>

        <el-table-column prop="returnCause" label="返厂原因" align="center"></el-table-column>

        <el-table-column prop="declarant" label="申报人" align="center"></el-table-column>

        <el-table-column prop="factoryName" label="工厂名称" align="center"></el-table-column>
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
import { listReturnFactory } from "api/Installation/dispatchcenter/dispatchcenter";

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
      total: 0, //总条数
      navList: [], //头部面包屑

      elsectVal: [], //选中框
      tabList: [], //table数据
      time1: [],
      name: ""
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.searchFun();
  },
  methods: {
    // 查询按钮
    searchFun() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        orderId: this.$route.query.orderId
      };
      listReturnFactory(data)
        .then(res => {
          console.log(res);
          this.tabList = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("返厂日志", error);
        });
    },


    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
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
.repaircom6 {
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

