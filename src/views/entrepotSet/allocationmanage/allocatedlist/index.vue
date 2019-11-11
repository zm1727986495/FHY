<template>
  <div class="wrapper">
    <div class="apper">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

      <!-- 按钮组 -->
      <el-card>
        <!-- table表格 -->
        <div class="table_list lvs attribute">
          <el-table border :row-class-name="tableRowClassName" :max-height="maxHeight" :data="tabList" style="width: 100%;">
            <el-table-column prop="transfersNumber" label="调拨单号" width="140" align="center">
              <template slot-scope="scope">
                <div>
                  <p class="table_action_span" @click="allocationdetail(scope.row)">{{scope.row.transfersNumber}}</p>
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="status" label="状态" width="100" align="center">
              <template slot-scope="scope">
                <div>
                  <p v-if="scope.row.status==1">调拨中</p>
                  <p v-if="scope.row.status==2">调拨完成</p>
                  <!-- <p v-if="scope.row.status==3">调拨完成</p> -->
                </div>
              </template>
            </el-table-column>

            <el-table-column prop="transfersCar" label="调拨车辆" width="120" align="center" show-overflow-tooltip></el-table-column>

            <el-table-column prop="transfersDriver" label="司机" width="100" align="center"></el-table-column>

            <el-table-column prop="userName" label="发起人" width="100" align="center"></el-table-column>

            <el-table-column prop="departmentName" label="发起部门" width="140" align="center" show-overflow-tooltip></el-table-column>

            <el-table-column prop="createTime" label="发起时间" width="160" align="center"></el-table-column>
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

      <!-- </el-card> -->
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import spot from "@/assets/images/spot.png";
import {
  transfersByPage //获取所有的调拨列表
} from "api/entrepotSet/allocationmanage/tobeallocated/tobeallocated";
import {mapGetters} from 'vuex'
export default {
  components: {
    breadcrumb,
    pagination
  },
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      spot, //操作图片
      navList: [], //头部面包屑
      tabList: [] //table数据
    };
  },
  computed: {
    ...mapGetters(['maxHeight'])
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
    //查询按钮获取
    getListFun() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize
      };
      transfersByPage(data).then(res => {
        if(res.status == 200){
          this.tabList = res.data.rows;
          this.total = res.data.total;
        }
      });
    },

    //跳转详情
    allocationdetail(row) {
      this.$router.push({
        path: "createallocated",
        query: { nums: 0, transfersId: row.transfersId }
      });
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
  height: 55px;
  float: left;
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

