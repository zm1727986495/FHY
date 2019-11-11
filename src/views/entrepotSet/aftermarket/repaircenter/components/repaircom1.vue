<template>
  <div class="repaircom1">
    <!-- <el-card class="m-top20">
      <div class="search_box">
        <div class="search_item">
          <el-input v-model="searchform.appointmentName" class="width-100" placeholder="维修任务编号/预约人"></el-input>
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
            @change="dataChange"
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
        <el-table-column prop="time" label="预约时间" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="appointmentName" label="预约人" width="240" align="center"></el-table-column>

        <el-table-column prop="remakes" label="预约备注" width="240" align="center"></el-table-column>

        <el-table-column prop="installationCondition" label="维修条件" width="240" align="center">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.installationCondition==0">满足</p>
              <p v-else>不满足</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="appointmentTime" label="预约上门时间" width="240" align="center"></el-table-column>

        <el-table-column prop="againAbout" label="再约上门时间" width="240" align="center"></el-table-column>

        <el-table-column prop="doorType" label="上门类型" width="240" align="center">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.doorType==1">送装一体</p>
              <p v-else>送装分离</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="resistance" label="是否扛楼" width="240" align="center">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.resistance==1">是</p>
              <p v-else>否</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="oldHouse" label="老房改造" width="240" align="center">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.oldHouse==1">是</p>
              <p v-else>否</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="contacts" label="上门联系人" width="240" align="center"></el-table-column>

        <el-table-column prop="contactsPhone" label="联系人电话" width="240" align="center"></el-table-column>
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
import { listAppointmentDoor } from "api/Installation/dispatchcenter/dispatchcenter";

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
      searchform: {
        
      }, //头部面包屑

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
    searchFun(){
      this.currentPage = 1;
      this.getDataFun();
    },


    getDataFun() {
      let data = {
        page:this.currentPage,
        limit:this.pageSize,
        orderId: this.$route.query.orderId,
        ...this.searchform
      };
      listAppointmentDoor(data).then(res => {
        if (res.status == "200") {
          this.tabList = res.data.rows;
          this.total = res.data.total;
        }else{
          this.$message.error("获取维修日志失败")
        }
      });
    },

    // 重置按钮
    resetFun() {},

    //多选内容改变
    handleSelectionChange(val) {
      this.elsectVal = val;
    },

    // 时间的数据处理
    dataChange() {
      this.searchform.appointmentStartTime = this.time1 ? this.time1[0] : "";
      this.searchform.appointmentEndTime = this.time1 ? this.time1[1] : "";
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getDataFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getDataFun();
    }
  }
};
</script>
<style scoped lang='scss'>
.repaircom1 {
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
}
</style>

