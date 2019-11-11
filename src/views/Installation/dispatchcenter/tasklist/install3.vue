<template>
  <div class="repaircom4">
    <!-- <el-card class="m-top20">
      <div class="search_box">
        <div class="search_item">
          <el-input v-model="name" class="width-100" placeholder="安装任务编号/任务编号、员工编号、电话"></el-input>
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

        <el-table-column prop="updateTime" label="汇报时间" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="isReport" label="状态" width="240" sortable align="center">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.isReport == 1">待汇报</p>
              <p v-if="scope.row.isReport == 2">已汇报</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="installationResult" label="任务结果" width="240" sortable align="center">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.installationResult == 1">未完成</p>
              <p v-if="scope.row.installationResult == 2">完成</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="unfinishedCause" label="未完成原因" width="240" sortable align="center">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.unfinishedCause == 1">客户</p>
              <p v-if="scope.row.unfinishedCause == 2">材料</p>
              <p v-if="scope.row.unfinishedCause == 3">安装</p>
              <p v-if="scope.row.unfinishedCause == 4">设计</p>
              <p v-if="scope.row.unfinishedCause == 5">销售</p>
              <p v-if="scope.row.unfinishedCause == 6">货少</p>
              <p v-if="scope.row.unfinishedCause == 7">货坏</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="reportName" label="汇报人" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="mobilePhone" label="电话" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="postName" label="职务" width="240" sortable align="center">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.postName == 1">组长</p>
              <p v-if="scope.row.postName == 2">工人</p>
              <p v-if="scope.row.postName == 3">借调人员</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="reportContent" label="汇报内容" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="isRemould" label="是否改制" width="240" sortable align="center">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.isRemould == 1">是</p>
              <p v-if="scope.row.isRemould == 2">否</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column
          prop="predictInstallationTime"
          label="开始安装时间"
          width="240"
          sortable
          align="center"
        ></el-table-column>

        <el-table-column prop="locationAddress" label="定位信息" width="240" sortable align="center"></el-table-column>

        <el-table-column
          prop="installationBeforPic"
          label="安装前照片"
          width="240"
          sortable
          align="center"
        >
          <template slot-scope="scope">
            <p class="table_action_span" @click="picPreview(scope.row.installationBeforPic)">图片预览</p>
          </template>
        </el-table-column>

        <el-table-column
          prop="installationAfterPic"
          label="安装后照片"
          width="240"
          sortable
          align="center"
        >
          <template slot-scope="scope">
            <p class="table_action_span" @click="picPreview(scope.row.installationAfterPic)">图片预览</p>
          </template>
        </el-table-column>

        <el-table-column prop="installReportPic" label="安装汇报照片" width="240" sortable align="center">
          <template slot-scope="scope">
            <p class="table_action_span" @click="picPreview(scope.row.installReportPic)">图片预览</p>
          </template>
        </el-table-column>

        <el-table-column prop="isCommodityLead" label="带回货品" width="240" sortable align="center">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.isCommodityLead == 1">是</p>
              <p v-if="scope.row.isCommodityLead == 2">否</p>
            </div>
          </template>
        </el-table-column>

        <!-- 1是 2否 , -->
        <el-table-column prop="chargeType" label="收费类型" width="240" sortable align="center">
          <template slot-scope="scope">
            <div>
              <p v-if="scope.row.chargeType == 1">是</p>
              <p v-if="scope.row.chargeType == 2">否</p>
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="chargeMoney" label="收费金额" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="chargeWay" label="收费方式" width="240" sortable align="center"></el-table-column>

        <el-table-column prop="reportRemake" label="备注" width="240" sortable align="center"></el-table-column>
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
import { listInstallationReport } from "api/Installation/dispatchcenter/dispatchcenter";

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
      time1: [],
      name: "",
      dialogVisible: false,
      
      pic_vis: false, //照片是否显示
      picList: [] //照片
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.getDataFun();
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


    getDataFun() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize,
        orderId: this.$route.query.orderId,
        ...this.searchform
      };
      listInstallationReport(data).then(res => {
        if (res.status == "200") {
          this.tabList = res.data.rows;
          this.total = res.data.total;
        } else {
          this.$message.error("获取维修工作汇报日志失败");
        }
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
.repaircom4 {
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
      margin: 0 15px 10px 0;
    }
  }
}
</style>

