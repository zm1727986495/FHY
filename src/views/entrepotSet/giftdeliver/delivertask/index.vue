<template>
  <div class="delivertask">
    <!-- 礼品派送管理列表页 -->
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="search_box">
        <div class="search_item">
          <el-input @keyup.enter.native="searchFun" v-model="searchForm.commodityGroup" class="width-100" placeholder="物品名称/领用编号"></el-input>
        </div>

        <div class="search_item">
          <el-date-picker v-model="time" class="width-100" style="width:100%" type="daterange" range-separator="至"
            start-placeholder="申请开始时间" end-placeholder="申请结束时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd" @change="timeChange"></el-date-picker>
        </div>

        <div class="search_item">
          <el-select class="width-100" clearable filterable v-model="searchForm.status" clearable placeholder="请选择汇报状态">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>

        <div class="search_item">
          <el-button class="button-fc" type="warning" size="medium" @click="searchFun">查询</el-button>
          <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
        </div>
      </div>

      <div class="h-width"></div>

      <!-- 按钮   -->
      <div class="btn_list_1">
        <el-button size="small" class="button-96" v-if="btnJurisdiction['delivertask_export']" @click="exportFun">导出</el-button>
        <el-button size="small" class="button-96" v-if="btnJurisdiction['delivertask_hui']" @click="opentask">派送任务汇报</el-button>
      </div>

      <!-- 礼品汇报日志 -->
      <addreportdia :visible="addreportdia_vis" v-if="addreportdia_vis" :giftSendId="giftSendId" 
      :isShow="isShow" @close_addreport="closeAll" @closeok_add="closeokAdd"></addreportdia>

      <!-- 查看任务 -->
      <taskdetaildia :visible="taskdetail_vis" v-if="taskdetail_vis" :giftSendId="giftSendId"   @close_task="closeAll"></taskdetaildia>

      <!-- table表格 -->
      <div class="table_list lvs attribute m-top20">
        <el-table
          border
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
          :data="tabList"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="40" fixed='left'></el-table-column>

          <el-table-column prop="takeSendNumber" label="任务派送编号" width="240" sortable align="center">
            <template slot-scope="scope">
              <div>
                <p
                  class="table_action_span"
                  @click="detail1(scope.row)"
                >{{scope.row.takeSendNumber}}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="reportContent" label="汇报日志" width="240" sortable align="center">
            <template slot-scope="scope">
              <div>
                <p class="table_action_span" @click="detail2(scope.row)">查看</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="状态" width="240" sortable align="center">
            <template slot-scope="scope">
              <!-- 0未送 1已送 -->
              <div>
                <p v-if="scope.row.status == '0' ">未送达</p>
                <p v-if="scope.row.status == '1' ">已送达</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="leaderName" label="派送组长" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="workerName" label="派送工人" width="240" sortable align="center"></el-table-column>

          <el-table-column
            prop="secondWorkerName"
            label="借调工人"
            width="240"
            sortable
            align="center"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column prop="sendCarNumber" label="派送车牌" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="driverPhone" label="派送人电话" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="remark" label="备注" width="240" sortable align="center"></el-table-column>
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
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import addreportdia from "./components/addreportdia";
import taskdetaildia from "./components/taskdetaildia";
import spot from "@/assets/images/spot.png";
import module from "../../../../../config/index";

import {
  listGiftSend //获取列表
} from "api/entrepotSet/giftdeliver/giftdeliver";

export default {
  components: {
    breadcrumb,
    addreportdia,
    taskdetaildia,
    pagination
  },
  data() {
    return {
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),//按钮权限
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      spot, //操作图片
      navList: [], //头部面包屑
      time: [], //时间选择器
      elsectVal: [], //选中框
      tabList: [], //table数据
      searchForm: {}, //查询条件
      giftSendId: "", //礼品申请id
      isShow: true, //派送任务汇报弹框是否新增
      options: [
        {
          //1已送达 2未送达
          value: "1",
          label: "已送达"
        },
        {
          value: "0",
          label: "未送达"
        }
      ], //查询下拉框选项
      addreportdia_vis: false, //添加礼品汇报日志弹框是否显示
      taskdetail_vis: false //查看任务弹框是否显示
    };
  },

  activated(){
    // 头部面包屑
    this.navList = this.$route.meta;
    this.searchFun();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  //   this.searchFun();
  // },
  methods: {
    //导出
    exportFun() {
      if (this.elsectVal.length) {
        let ids = this.elsectVal
          .map(item => {
            return item.giftSendId;
          })
          .join(",");

        let str =
          module.dev.proxyTable["/api"].target +
          "/api/pc/giftSend/exportGiftSend?giftSendIds=" +
          ids;
        console.log(str + "下载地址");

        window.location.href = str;
      } else {
        this.$message.warning("您没有勾选数据");
      }
    },
    // 添加汇报日志
    opentask() {
      if (this.elsectVal.length == "0") {
        this.$message.warning("请勾选数据");
      } else if (this.elsectVal.length > 1) {
        this.$message.warning("只能勾选一条数据");
      } else {
        this.giftSendId = this.elsectVal[0].giftSendId;
        this.addreportdia_vis = true;
        this.isShow = true;
      }
    },
    detail1(row) {
      this.giftSendId = row.giftSendId;
      this.taskdetail_vis = true;
    },

    //查看汇报日志   没有修改功能 
    detail2(row) {
      this.giftSendId = row.giftSendId;
      this.addreportdia_vis = true;
      this.isShow = false;
    },

    //关闭弹框
    closeAll() {
      this.addreportdia_vis = false;
      this.taskdetail_vis = false;
      this.isShow = false;
    },

    closeokAdd() {
      this.addreportdia_vis = false;
      this.searchFun();
    },

    timeChange() {
      this.searchForm.applyStartTime = this.time ? this.time[0] : "";
      this.searchForm.applyEndTime = this.time ? this.time[0] : "";
    },

    searchFun() {
      this.currentPage = 1;
      this.getListFun();
    },
    /**
     * 查询方法
     *  */
    getListFun() {
      let data = {
        ...this.searchForm,
        page: this.currentPage,
        limit: this.pageSize
      };
      listGiftSend(data).then(res => {
        this.tabList = res.data.rows;
        this.total = res.data.total;
      });
    },

    //重置按钮
    resetFun() {
      this.searchForm = {};
      this.time = [];
      this.searchFun();
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
.delivertask {
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
  .search_item_btn {
    display: block;
    width: 200px;
    margin: 0 auto;
  }

  .btn_list_1 {
    margin: 15px 0px;
    display: flex;
    flex-wrap: wrap;
    > button {
      margin: 5px;
    }
  }
}
</style>

