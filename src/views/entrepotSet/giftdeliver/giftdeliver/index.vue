<template>
  <div class="giftdeliver">
    <!-- 礼品派送管理列表页 -->
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="search_box">
        <div class="search_item">
          <el-input @keyup.enter.native="getListFun" v-model="searchForm.orderGroup" class="width-100" placeholder="物品名称/领用编号"></el-input>
        </div>

        <div class="search_item">
          <el-date-picker v-model="time" class="width-100" style="width:100%" type="daterange" range-separator="至"
            start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd" @change="timeChange"></el-date-picker>
        </div>

        <div class="search_item">
          <el-select class="width-100" clearable filterable v-model="searchForm.applyStatus" placeholder="请选择派送状态">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>

        <div class="search_item">
          <el-button class="button-fc" type="warning" size="medium" @click="getListFun">查询</el-button>
          <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
        </div>
      </div>

      <!-- 按钮   -->
      <div class="btn_list_1">
        <el-button v-if="btnJurisdiction['giftdeliv_export']" size="small" class="button-96" @click="exportFun">导出</el-button>
        <el-button v-if="btnJurisdiction['giftdeliv_add']" size="small" class="button-96" @click="opentask">指派派送任务</el-button>
      </div>

      <!-- 礼品详情 -->
      <detaildia
        :visible="detaildia_vis"
        v-if="detaildia_vis"
        :sendGiftId="sendGiftId"
        @close_detail="closeAll"
      ></detaildia>

      <!-- 指派派送任务 -->
      <delivertaskdia
        :visible="taskdia_vis"
        v-if="taskdia_vis"
        :elsectIdArr="elsectIdArr"
        @close_taskok="closeOk"
        @close_task="closeAll"
      ></delivertaskdia>

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

          <el-table-column prop="applyCode" label="领用编号" width="240" sortable align="center">
            <template slot-scope="scope">
              <div>
                <p class="table_action_span" @click="opendetail(scope.row)">{{scope.row.applyCode}}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="status" label="状态" width="240" sortable align="center">
            <template slot-scope="scope">
              <!-- 0待指派 1已送达 2未送达, -->
              <div>
                <p v-if="scope.row.status == '0' ">待指派</p>
                <p v-if="scope.row.status == '1' ">已送达</p>
                <p v-if="scope.row.status == '2' ">未送达</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="number" label="领用数量" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="storeName" label="领用门店" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="arrivalTime" label="到店时间" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="applyName" label="申请人" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="applyTime" label="申请时间" width="240" sortable align="center"></el-table-column>
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
import {
  listStoreGift //获取列表
} from "api/entrepotSet/giftdeliver/giftdeliver";
import detaildia from "./components/detaildia"; //礼品详情弹框
import delivertaskdia from "./components/delivertaskdia"; //指派派送任务
import spot from "@/assets/images/spot.png";
import module from "../../../../../config/index";
export default {
  components: {
    breadcrumb,
    detaildia, //礼品详情弹框
    delivertaskdia, //指派派送任务
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
      elsectIdArr: [], //礼品id  传给指派派送任务弹框
      sendGiftId: "", //礼品申请id
      searchForm: {
        orderGroup: "",
        applyStartTime: "",
        applyEndTime: "",
        applyStatus: ""
      }, //查询条件
      // 0待指派 1已送达 2未送达
      options: [
        {
          value: "0",
          label: "待指派"
        },
        {
          value: "1",
          label: "已送达"
        },
        {
          value: "2",
          label: "未送达"
        }
      ], //查询下拉框选项
      detaildia_vis: false, //礼品详情弹框是否显示
      taskdia_vis: false //指派派送任务弹框是否显示
    };
  },

  activated(){
    // 头部面包屑
    this.navList = this.$route.meta;
    this.listStoreGiftFun();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  //   this.listStoreGiftFun();
  // },
  methods: {
    //获取列表
    listStoreGiftFun() {
      let data = {
        ...this.searchForm,
        page: this.currentPage,
        limit: this.pageSize
      };
      listStoreGift(data)
        .then(res => {
          this.tabList = res.data.rows;
          this.total = res.data.total;
        })
        .catch(errror => {
          console.log(error + "/entrepotSet/giftdeliver/giftdeliver/index");
        });
    },
    timeChange() {
      this.searchForm.applyStartTime = this.time ? this.time[0] : "";
      this.searchForm.applyEndTime = this.time ? this.time[0] : "";
    },
    /**
     * 查询方法
     *  */
    getListFun() {
      this.currentPage = 1;
      this.listStoreGiftFun();
    },

    resetFun() {
      this.searchForm = {};
      this.time = [];
      this.getListFun();
    },

    //导出
    exportFun() {
      if (this.elsectVal.length) {
        let ids = this.elsectVal
          .map(item => {
            return item.sendGiftId;
          })
          .join(",");

        let str =
          module.dev.proxyTable["/api"].target +
          "/api/pc/giftSend/exportExportGiftSend?sendGifts=" +
          ids;
        console.log(str + "下载地址");

        window.location.href = str;
      } else {
        this.$message.warning("您没有勾选数据");
      }
    },

    //打开礼品详情弹框
    opendetail(row) {
      this.detaildia_vis = true;
      this.sendGiftId = row.sendGiftId;
    },

    //打开指派派送任务
    opentask() {
      //只有待指派的可以指派任务
      let flag = this.elsectVal.every(item => {
        return item.status == "0";
      });

      if (this.elsectVal.length == "0") {
        this.$message.warning("请勾选数据");
      } else if (flag) {
        this.elsectIdArr = this.elsectVal.map(item => {
          return { sendGiftId: item.sendGiftId };
        });
        console.log(this.elsectIdArr);
        this.taskdia_vis = true;
      } else {
        this.$message.warning("您勾选的数据有不是待指派的数据");
      }
    },

    //关闭所有弹框
    closeAll() {
      this.detaildia_vis = false;
      this.taskdia_vis = false;
    },
    //成功关闭方法
    closeOk() {
      this.detaildia_vis = false;
      this.taskdia_vis = false;
      this.getListFun();
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
      this.listStoreGiftFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.listStoreGiftFun();
    }
  }
};
</script>
<style scoped lang='scss'>
.giftdeliver {
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

