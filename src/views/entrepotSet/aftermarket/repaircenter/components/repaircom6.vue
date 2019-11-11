<template>
  <div class="repaircom6">
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

    <!-- table表格 -->
    <div class="table_list lvs attribute m-top20">
      <el-table border :data="tabList" style="width: 100%;" :row-class-name="tableRowClassName">
        <el-table-column prop="name" label="编号" width="240" sortable align="center"></el-table-column>
        
        <el-table-column prop="name" label="申请时间" width="240" sortable align="center"></el-table-column>
        
        <el-table-column prop="name" label="退货原因" width="240" sortable align="center"></el-table-column>
        
        <el-table-column prop="name" label="申请人姓名" width="240" sortable align="center"></el-table-column>
        
        <el-table-column prop="name" label="沟通记录" width="240" sortable align="center"></el-table-column>
        
        <el-table-column prop="name" label="所属正单" width="240" sortable align="center"></el-table-column>
        
        <el-table-column prop="name" label="货品照片" width="240" sortable align="center">
          <template slot-scope="scope">
            <div>
              <p class="table_action_span" @click="openpicdia(scope.row)">查看</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="name" label="定责描述" width="240" sortable align="center"></el-table-column>

      </el-table>
    </div>

    <el-dialog :visible.sync="dialogVisible" width="30%" :before-close="handleClose">
      <div class="titlecals">查看图片</div>
      <div align="center">
        <img src="http://file.xczhihui.com/1559207715235.jpg">
      </div>
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
      tabList: [], //table数据
      time1: [],
      name: "",
      dialogVisible: false
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {
    handleClose() {
      this.dialogVisible = false;
    },

    openpicdia() {
      this.dialogVisible = true;
    },
    // 查询按钮
    searchFun() {},

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

