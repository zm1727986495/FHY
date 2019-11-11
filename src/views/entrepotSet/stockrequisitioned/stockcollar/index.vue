<template>
  <div>
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="box-card">
      <!-- <stockquery></stockquery> -->
      <div class="stockquery">
        <div class="head_list">
          <div class="input-vw">
            <el-input placeholder="物品名称、领用编号" v-model="bindInfo.recipientsGroup" size="medium" class="width-100"></el-input>
          </div>
          <div class="input-vw">
            <div class="stock_time">
              <el-date-picker
                size="medium"
                v-model="dataValue"
                type="daterange"
                range-separator="-"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                style="width:100%"
                @change="dataValueFn"
              ></el-date-picker>
            </div>
          </div>
          <div class="input-vw">
            <el-select v-model="bindInfo.recipientsStatus" placeholder="领用状态" size="medium" class="width-100">
              <el-option
                v-for="item in stateList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
          <div class="input-vw">
            <el-select v-model="bindInfo.recipientsType" placeholder="申请类型" size="medium" class="width-100">
              <el-option
                v-for="item in applyList"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </div>
        </div>

        <div class="btnsList">
          <el-button class="button-fc" size="medium" @click="searchFun">查询</el-button>
          <el-button type="primary" size="medium" @click="Reset">重置</el-button>
        </div>
      </div>

      <div class="h-width"></div>
      <!-- 备货辅材列表 -->
      <div class="m-bottom10">
        <el-button v-if="btnJurisdiction.stockcollar_Export" size="small" class="button-96" @click="exportFn">导出</el-button>
        <el-button v-if="btnJurisdiction.stockcollar_Apply" size="small" class="button-96" @click="applicationFun">申请领用</el-button>
      </div>
      <div class="table-width lvs attribute">
        <el-table
          border
          style="width: 100%"
          :row-class-name="tableRowClassName"
          @selection-change="chooseDelete"
          :data="tableData"
        >
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column align="center" prop="recipientsNo" label="领用编号" width="150">
             <template slot-scope="scope">
              <div>
                <el-tooltip placement="right" visible-arrow>
                  <div slot="content" class="tips tipFon">
                    <p @click="editHandle(scope.row)" class="operaItems">查看</p>
                  </div>
                  <img :src="spot" alt class="attributesTips" />
                </el-tooltip>
                <p class="operation">{{scope.row.recipientsNo}}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="applyStatus" label="状态" width="120"></el-table-column>
          <el-table-column align="center" prop="recipientsStatus" label="领用状态" width="120"></el-table-column>
          <el-table-column align="center" prop="recipientsNum" label="领用数量" width="120"></el-table-column>
          <el-table-column align="center" prop="applyTime" label="申请时间" width="160"></el-table-column>
          <el-table-column align="center" prop="applyName" label="申请人" width="120"></el-table-column>
          <el-table-column align="center" prop="applyCause" label="申请原因" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="auditName" label="审批人" width="120"></el-table-column>
          <el-table-column align="center" prop="auditTime" label="审批时间" width="160"></el-table-column>
        </el-table>
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
    </el-card>
    <!-- 详情 -->
    <div>
      <el-dialog
        title="详情"
        :visible.sync="detailsVisible"
        width="900px"
        :before-close="handleClose"
        custom-class="customDialogTitle"
      >
        <div class="paddingl-r">
          <detailsdialog :recipientsId="recipientsId" v-if="detailsVisible"></detailsdialog>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button @click="handleClose">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import detailsdialog from "./components/detailsdialog";
import spot from "@/assets/images/spot.png";
import {
  listInstallationRecipients,
  addInstallationRecipients
} from "api/entrepotSet/stockrequisitioned/stockcollar";
import module from "../../../../../config/index";
export default {
  components: {
    breadcrumb,
    pagination,
    detailsdialog
  },
  data() {
    return {
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      navList: [], //导航条
      tableData: [], //列表数据
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      spot,
      auxiliaryVisible: false, //辅材申请弹框
      detailsVisible: false, //详情
      //领用状态
      stateList: [
        {
          name: "未领",
          id: "0"
        },
        {
          name: "已领",
          id: "1"
        }
      ],
      // 申请类型
      applyList: [
        {
          name: "备货",
          id: "1"
        },
        {
          name: "辅材",
          id: "2"
        }
      ],
      bindInfo: {}, //查询条件
      dataValue: [], //时间
      recipientsId: "",
      choseArr: [] //勾选
    };
  },
  activated(){
    this.navList = this.$route.meta;
    this.getData();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  // mounted() {
  //   this.navList = this.$route.meta;
  //   this.getData();
  // },
  methods: {
    dataValueFn(){
      this.bindInfo.startTime = this.dataValue ? this.dataValue[0] : '';
      this.bindInfo.endTime = this.dataValue ? this.dataValue[1] : '';
    },
    //查询领用列表
    getData() {
      let data = {
        ...this.bindInfo,
        page: this.currentPage,
        limit: this.pageSize
      };
      listInstallationRecipients(data)
        .then(res => {
          console.log(res);
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("查询领用列表", error);
        });
    },
    //查询
    searchFun() {
      this.getData();
    },
    //重置
    Reset() {
      this.bindInfo = {};
      this.dataValue = []
    },
    //查看
    editHandle(row) {
      this.recipientsId = row.recipientsId;
      this.detailsVisible = true;
    },
    //时间改变
    timeChange() {
      this.bindInfo.startTime = this.dataValue ? this.dataValue[0] : "";
      this.bindInfo.endTime = this.dataValue ? this.dataValue[1] : "";
    },
    //按钮申请领用
    applicationFun() {
      // if (this.choseArr.length < 1) {
      //   this.$message.error("请勾选一条!");
      // } else if (this.choseArr.length > 1) {
      //   this.$message.error("只能勾选一条!");
      // } else {
        // this.auxiliaryVisible = true;
        this.$router.push({
          path: "addcollarlist",
          // query: { recipientsNo: this.choseArr[0].recipientsNo }
        });
      // }
    },
    //导出
    exportFn() {
      if (this.choseArr.length < 1) {
        this.$message.error("你未勾选!");
        return;
      }
      let arr = [];
      this.choseArr.forEach(item => {
        arr.push(item.recipientsId);
      });
      let str =
        module.dev.proxyTable["/api"].target +
        "/api/pc/installationRecipients/exportInstallationRecipients?recipientsIds=" +
        arr.join(",");
      window.location.href = str;
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getData()
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getData()
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    chooseDelete(val) {
      console.log(val);
      this.choseArr = val;
    },
    //关闭弹框
    handleClose() {
      this.detailsVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.paddingl-r {
  padding: 0 20px;
}
.stockquery {
  .btnsList {
    display: flex;
    justify-content: center;
  }
  .head_list {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  .input-vw {
    width: calc(((92.5vw - 250px)) / 4);
    margin-bottom: 20px;
    float: left;
    position: relative;
    display: flex;
    align-items: center;
  }
}
</style>

