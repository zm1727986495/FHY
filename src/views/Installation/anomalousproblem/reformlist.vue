<template>
  <div class="reformlist">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="lvs">
      <!-- 查询条件组 -->
      <div class="warp_head_list">
        <div class="list_top">
          <div class="head_nav_datapick">
            <el-input placeholder="订单号/合同号/货主/客户电话" v-model="befoIn.orderGroup" maxlength="50"></el-input>
          </div>
          <div class="head_nav_datapick">
            <el-date-picker
              v-model="searchData"
              type="daterange"
              value-format="yyyy-M-dd HH:mm:ss"
              format="yyyy-M-dd HH:mm:ss"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="timeChange"
            ></el-date-picker>
          </div>
          <div class="head_nav_select">
            <el-select v-model="befoIn.brandId" multiple placeholder="供应商">
              <el-option
                v-for="item in stateList"
                :key="item.companyId"
                :label="item.companyName"
                :value="item.companyId"
              ></el-option>
            </el-select>
          </div>
          <div class="head_nav_select">
            <el-select v-model="befoIn.status" placeholder="改制单状态">
              <el-option
                v-for="item in channelList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="head_nav_select">
            <el-input placeholder="商品名称" v-model="befoIn.commodityName"></el-input>
          </div>
          <div class="head_nav_datapick">
            <el-button @click="searchFun" class="button-fc" type="warning">查询</el-button>
            <el-button @click="resetFun" type="primary">重置</el-button>
          </div>
        </div>
      </div>
      <div class="h-width"></div>
      <div class="order-btn-list">
        <el-button v-if="btnJurisdiction.reformlist_Export" size="small" class="button-96" @click="exportFn">导出</el-button>
        <el-button v-if="btnJurisdiction.reformlist_Edit" size="small" class="button-96" @click="remarksfun">编辑</el-button>
        <el-button v-if="btnJurisdiction.reformlist_Tovoid" size="small" class="button-96" @click="invitation(2)">作废</el-button>
        <el-button v-if="btnJurisdiction.reformlist_Changed" size="small" class="button-96" @click="invitation(1)">已改</el-button>
      </div>

      <!-- 列表 -->
      <div class="order_table">
        <el-table
          border
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" align="center" width="55"></el-table-column>
          <el-table-column
            prop="designateInstallationNumber"
            align="center"
            label="任务编号"
            width="200"
            sortable
          ></el-table-column>

          <el-table-column prop="contractSerialNumber" align="center" label="合同号" width="200"></el-table-column>
          <el-table-column prop="status" align="center" label="安装单状态" width="200">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.row.status==0">未改</p>
                <p v-if="scope.row.status==1">已改</p>
                <p v-if="scope.row.status==2">作废</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="orderStatus" align="center" label="客户电话" width="200"></el-table-column>
          <el-table-column prop="dutyName" align="center" label="定责对象" width="200"></el-table-column>
          <el-table-column prop="stryppedDownNumber" align="center" label="改制板数" width="200"></el-table-column>
          <el-table-column prop="unitPrice" align="center" label="单块价格" width="200"></el-table-column>
          <el-table-column prop="materialCost" align="center" label="材料成本" width="200"></el-table-column>
          <el-table-column prop="stryppedDownMoney" align="center" label="改制费" width="200"></el-table-column>
          <el-table-column prop="stryppedDownFactory" align="center" label="改板厂" width="200"></el-table-column>
          <el-table-column
            prop="stryppedDownContent"
            align="center"
            label="改制原因"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="createName" align="center" label="创建人" width="200"></el-table-column>
          <el-table-column prop="designateCreateTime" align="center" label="创建时间" width="200"></el-table-column>
          <el-table-column prop="installationTypeName" align="center" label="安装单类型" width="200"></el-table-column>
          <el-table-column prop="reportTime" align="center" label="汇报时间" width="200"></el-table-column>
          <el-table-column prop="orderTypeName" align="center" label="订单类型" width="200"></el-table-column>
          <el-table-column prop="orderTypeName" align="center" label="改制照片" width="200">
            <template slot-scope="scope">
              <div>
                <p class="table_action_span" @click="picPreview(scope.row.stryppedPic)">查看</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="brandName" align="center" label="品牌" width="200"></el-table-column>
          <el-table-column prop="categoryName" align="center" label="品类" width="200"></el-table-column>
          <el-table-column prop="orderNumber" align="center" label="所属正单" width="200"></el-table-column>
          <el-table-column
            prop="storeName"
            align="center"
            label="门店"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column prop="contractMoney" align="center" label="合同金额" width="200"></el-table-column>
        </el-table>
      </div>
      <div class="pagination_wrap">
        <pagination
          :current-page="currentPage"
          :pageSize="pageSize"
          :total="total"
          @sizeChange="sizeChange"
          @currentChange="currentChange"
        ></pagination>
      </div>

      <!-- 编辑 -->
      <editReform
        v-if="isReform"
        :isReform="isReform"
        :stryppedDownId="stryppedDownId"
        @close="close"
      ></editReform>

      <!-- 查看图片 -->
      <picPreviewDia :visible="pic_vis" :picList="picList" @close_pic="closeAll"></picPreviewDia>
    </el-card>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import editReform from "./components/editReform";
import {
  listStryppedDownInfo,
  editStryppedDownStatus
} from "api/Installation/anomalousproblem/reformlist";
import { listCompanyByAll } from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import picPreviewDia from "@/views/components/picPreviewDia"; //图片预览
import module from "../../../../config/index";
export default {
  components: {
    breadcrumb,
    pagination,
    editReform,
    picPreviewDia
  },
  data() {
    return {
      // 按钮权限***********
      btnJurisdiction:JSON.parse(this.$loca.getItem("element")),
      searchData: [], // 创建订单时间
      orderStatus: [], // 状态搜索
      stateList: [], // 供应商
      //改制单状态
      channelList: [
        {
          name: "未改",
          id: "0"
        },
        {
          name: "已改",
          id: "1"
        },
        {
          name: "作废",
          id: "2"
        }
      ],
      befoIn: {}, //查询条件
      navList: [], //导航
      picList: [], //图片集合
      pic_vis: false, //查看图片弹框
      tableData: [], //列表
      isReform: false, //编辑弹框
      stryppedDownId: "", //改制列表ID
      tableSelectList: [], //勾选
      total: 0, // 总数
      pageSize: 10, // 单页条数
      currentPage: 1 // 当前页
    };
  },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  //   this.orderdatafun();
  //   this.getSupplier();
  // },
  activated(){
     // 头部面包屑
    this.navList = this.$route.meta;
    this.orderdatafun();
    this.getSupplier();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  methods: {
    //图片预览
    picPreview(list) {
      this.pic_vis = true;
      this.picList = list;
    },
    //获取供应商
    getSupplier() {
      let data = {
        companyType: "0"
      };
      listCompanyByAll(data)
        .then(res => {
          this.stateList = res.data;
        })
        .catch(error => {
          console.error("获取供应商", error);
        });
    },
    //编辑
    remarksfun() {
      if (this.changefun()) {
        this.stryppedDownId = this.tableSelectList[0].stryppedDownId;
        this.isReform = true;
      }
    },
    //关闭弹框
    close() {
      this.isReform = false;
    },
    closeAll() {
      this.pic_vis = false;
    },
    //作废或者修改
    invitation(type) {
      if (this.tableSelectList.length < 1) {
        this.$message.error("你未勾选!");
      } else if (this.tableSelectList.length > 1) {
        this.$message.error("只能勾选一个!");
      } else {
        /**
         * type  1已改 2作废
         */
        if (type == 1) {
          if (this.tableSelectList[0].status == 0) {
            this.tovoidFn(1, "修改");
          } else {
            this.$message.error("当前状态不能修改!");
          }
        } else {
          if (this.tableSelectList[0].status == 2) {
            this.$message.error("当前已经作废!");
            return;
          }
          this.tovoidFn(2, "作废");
        }
      }
    },
    //导出
    exportFn() {
      if (this.tableSelectList.length < 1) {
        this.$message.error("你未勾选!");
      } else {
        let arr = [];
        this.tableSelectList.forEach(item => {
          arr.push(item.stryppedDownId);
        });
        let str =
          module.dev.proxyTable["/api"].target +
          "/api/pc/stryppedDown/exportStryppedDown?stryppedDownIds=" +
          arr.join(",");

        window.location.href = str;
      }
    },
    //作废
    tovoidFn(num, str) {
      this.$confirm(`是否${str}本条信息?`, {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let data = {
            stryppedDownId: this.tableSelectList[0].stryppedDownId,
            status: num
          };
          editStryppedDownStatus(data)
            .then(res => {
              if (res.status == 200) {
                this.orderdatafun();
              }
            })
            .catch(error => {
              console.error("作废", error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    //验证
    changefun() {
      if (this.tableSelectList.length > 1) {
        this.$message({
          message: "只能选择一个订单 新增预算清单",
          type: "warning"
        });
        return false;
      } else if (this.tableSelectList.length < 1) {
        this.$message({
          message: "抱歉， 请选择订单",
          type: "warning"
        });
        return false;
      } else {
        return true;
      }
    },
    //获取改制管理列表
    orderdatafun() {
      let data = {
        ...this.befoIn,
        page: this.currentPage,
        limit: this.pageSize
      };
      listStryppedDownInfo(data)
        .then(res => {
          if (res.status == 200) {
            this.total = res.data.total;
            this.tableData = res.data.rows;
          }
        })
        .catch(error => {
          console.log("获取改制管理列表", error);
        });
    },
    //查询
    searchFun() {
      this.currentPage = 1;
      this.orderdatafun();
    },
    // 重置
    resetFun() {
      this.befoIn = {};
      this.searchData = [];
    },
    //处理时间
    timeChange() {
      this.befoIn.createStartTime =
        this.searchData.length !== 0 ? this.searchData[0] : "";
      this.befoIn.createEndTime =
        this.searchData.length !== 0 ? this.searchData[1] : "";
    },
    //勾选
    handleSelectionChange(val) {
      this.tableSelectList = val;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
    }
  }
};
</script>
<style scoped lang="scss">
.reformlist {
  .warp_head_list {
    flex-wrap: wrap;
  }
  .list_top {
    width: 100%;
    display: flex;
    align-items: center;
    flex-wrap: wrap;
  }
  .list_top {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    > div {
      margin: 10px 0px;
      padding: 0px 5px;
      width: 25%;
      > div {
        width: 100%;
      }
    }
    .fontMore {
      color: #d0cfcf;
    }
    .btnone {
      margin-left: 10px;
    }
    .head_nav_btn {
      width: 100%;
      text-align: center;
      .fontMore {
        color: #d0cfcf;
      }
      .btnone {
        margin-left: 10px;
      }
    }
  }
  .head_nav_datapick {
    width: 100%;
  }
  .order-btn-list {
    margin-top: 20px;
  }
  .order_table {
    margin-top: 20px;
    width: 100%;
  }
  .order_table .el-tooltip {
    text-align: center;
  }
  .order_table .cell {
    text-align: center;
  }
}
</style>