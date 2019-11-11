<template>
  <div class="repaircom0">
    <!-- 步骤条 -->
    <tepsLine :dayNumber="dayNumber"></tepsLine>

    <!-- 照片预览弹框 -->
    <picPreviewDia :visible="pic_vis" :picList="picList" @close_pic="closeAll"></picPreviewDia>

    <!-- table表格 -->
    <div class="table_list lvs attribute">
      <el-table border :data="tabList" :row-class-name="tableRowClassName" style="width: 100%;">
        <el-table-column
          prop="designateInstallationNumber"
          label="任务编号"
          width="240"
          sortable
          align="center"
        ></el-table-column>

        <el-table-column prop="appointmentTime" label="任务上门时间" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="customerName" label="上门联系人" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="customerPhone" label="上门联系电话" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="source" label="来源" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="isReport" label="状态" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="appointmentRemake" label="上门备注" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="deliveryNumber" label="派货数量" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="designateSource" label="维修单类型" width="240" sortable align="center"></el-table-column>

        <el-table-column
          prop="designateInstallationTime"
          label="指派维修次数"
          width="240"
          sortable
          align="center"
        ></el-table-column>

        <el-table-column prop="reportName" label="日志汇报人姓名" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="reportContent" label="日志内容" width="240" sortable align="center"></el-table-column>

        <el-table-column
          prop="predictInstallationTime"
          label="预计维修日期"
          width="240"
          sortable
          align="center"
        ></el-table-column>

        <el-table-column
          prop="firstInstallationTime"
          label="首次派工维修日期"
          width="240"
          sortable
          align="center"
        ></el-table-column>

        <el-table-column prop="assignedCADImg " label="维修图" width="240" sortable align="center">
          <template slot-scope="scope">
            <p class="table_action_span" @click="picPreview(scope.row.assignedCADImg)">图片预览</p>
          </template>
        </el-table-column>

        <el-table-column prop="contractMoney" label="合同金额" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="name" label="派单员" width="240" sortable align="center"></el-table-column>
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
import tepsLine from "@/views/entrepotSet/aftermarket/repaircenter/components/tepsLine"//步骤条
import {
  listInstallJobs,
  installDay
} from "api/Installation/dispatchcenter/dispatchcenter";

export default {
  components: {
    breadcrumb,
    picPreviewDia,
    tepsLine,
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
      dayNumber:"", //天数
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.searchFun();
    this.getinstallDay();
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

    getinstallDay() {
      let data = {
        orderId: this.$route.query.orderId
      };

      installDay(data).then(res => {
        console.log(res);
        this.dayNumber = res.data.day;
      });
    },

    // 查询按钮
    searchFun() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        orderId: this.$route.query.orderId,
        ...this.searchform
      };
      listInstallJobs(data).then(res => {
        if (res.status == "200") {
          this.tabList = res.data.rows;
          this.total = res.data.total;
        } else {
          this.$message.error("获取维修任务失败");
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
.repaircom0 {
  .btn_inline {
    display: inline-block;
    cursor: pointer;
    background: #fff;
    color: #fff;
    -webkit-appearance: none;
    text-align: center;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    outline: 0;
    margin: 0;
    -webkit-transition: 0.1s;
    transition: 0.1s;
    font-weight: 500;
    padding: 8px 20px;
    font-size: 14px;
    border-radius: 4px;
    margin-right: 2px;
    background-color: #409eff;
    border-color: #409eff;
  }
}
</style>

