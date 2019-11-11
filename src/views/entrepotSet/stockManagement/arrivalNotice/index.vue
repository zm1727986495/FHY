<template>
  <div>
    <div class="head_nav" ref="topInfo">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="head_list">
        <div class="input-vw">
          <el-input
            placeholder="到货单号/采购合同号/采购单号"
            @keyup.enter.native='searchFun()'
            v-model.trim="bindInfo.text"
            size="medium"
            class="width-100"
          ></el-input>
        </div>
        <div class="input-vw">
          <div class="stock_time">
            <el-date-picker
              size="medium"
              v-model="dataValue"
              type="daterange"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:100%"
              @change="timeChange"
            ></el-date-picker>
          </div>
        </div>
        <div class="input-vw">
          <el-select filterable v-model="bindInfo.storageId" placeholder="所属仓库" size="medium" class="width-100">
            <el-option
              v-for="item in stateList"
              :key="item.storageId"
              :label="item.storageName"
              :value="item.storageId"
            ></el-option>
          </el-select>
        </div>
        <div class="input-vw">
          <el-select v-model="bindInfo.status" placeholder="状态" size="medium" class="width-100">
            <el-option
              v-for="item in statusList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </div>
        <div>
          <div class="btnsList">
            <el-button type="warning" class="button-fc" size="medium" @click="searchFun" :loading='loading'>查询</el-button>
            <el-button type="primary" size="medium" @click="Reset">重置</el-button>
          </div>
        </div>
      </div>

      <div class="h-width"></div>
      <div>
        <div class="m-bottom10">
          <el-button v-if="btnJurisdiction.arrivalNotice_Arrival" size="small" class="button-96" @click="toLead">导入到货清单</el-button>
          <el-button v-if="btnJurisdiction.arrivalNotice_Edit" size="small" class="button-96" @click="edits">编辑</el-button>
          <el-button v-if="btnJurisdiction.arrivalNotice_Tempdown" size="small" class="button-96" @click="downLoad">模板下载</el-button>
          <el-button v-if="btnJurisdiction.arrivalNotice_Tovoid" size="small" class="button-96" @click="tovoid">作废</el-button>
        </div>
        <div class="table_list lvs attribute" v-loading="loading">
          <el-table
            border
            :row-class-name="tableRowClassName"
            @selection-change="chooseDelete"
            :data="tableData"
            :max-height="maxHeight"
          >
            <el-table-column type="selection" width="40"></el-table-column>
            <el-table-column align="center" prop="arrivalNoticeCode" label="到货单号" width="150">
              <template slot-scope="scope">
                <div>
                  <p class="table_action_span" @click="detailsFn(scope.row)">{{scope.row.arrivalNoticeCode}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="type" label="到货方式" width="80">
              <template slot-scope="scope">
                <div>{{scope.row.type == 0 ? '自提' : '非自提'}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="状态" width="80">
              <template slot-scope="scope">
                <p v-if="scope.row.status==0">待提交</p>
                <p v-if="scope.row.status==1">已提交</p>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="brandName" label="品牌" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="categoryName" label="品类" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="storageName" label="入库仓库" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="username" label="导入人" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="cardNum" label="司机车辆" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="deliveryDate" label="发货日期" width="160"></el-table-column>
            <el-table-column align="center" prop="createTime" label="导入时间" width="160"></el-table-column>
            <el-table-column align="center" prop="stevedoreName" label="装卸人" width="100"></el-table-column>
            <el-table-column align="center" prop="isDelete" label="作废" width="80">
              <template slot-scope="scope">
                <div>{{scope.row.isDelete==1?'已作废':''}}</div>
              </template>
            </el-table-column>
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
      </div>
    </el-card>

    <el-dialog :visible.sync="dialogVisible" width="760px">
      <div class="titlecals">导入到货清单</div>
      <ToLead></ToLead>
    </el-dialog>
    <el-dialog :visible.sync="down" width="900px">
      <div class="titlecals">模板下载</div>
      <DownLoad v-if="down" :isShow="true"></DownLoad>
    </el-dialog>
  </div>
</template>
<script>
import ToLead from "./toLead";
// import Edit from "./edit";
import { mapGetters } from "vuex";
import DownLoad from "./downLoad";
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import {
  listArrivalNoticeByPage,
  deleteArrivalNotice
} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import { getStorageList } from "api/entrepotSet/stockManagement/stockPending/stockPending";
export default {
  components: {
    ToLead,
    // Edit,
    DownLoad,
    breadcrumb,
    pagination
  },
  data() {
    return {
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      loading:true,
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
      bindInfo: {}, //查询条件
      dataValue: [], //查询条件时间
      dialogVisible: false, //导入到货清单
      down: false, //模板下载
      navList: [],
      choseArr: [], //勾选数据
      tableData: [], //列表
      stateList: [], //仓库列表
      statusList: [
        {
          name: "待提交",
          id: "0"
        },
        {
          name: "已提交",
          id: "1"
        }
      ]
    };
  },
  computed: {
    ...mapGetters(["maxHeight"])
  },
  // mounted() {
  //   this.navList = this.$route.meta;
  //   this.getData();
  //   this.getWarehouse();
  // },
  activated(){
    this.navList = this.$route.meta;
    this.getData();
    this.getWarehouse();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  methods: {
    //获取仓库
    getWarehouse() {
      getStorageList()
        .then(res => {
          this.stateList = res.data;
        })
        .catch(error => {
          console.error("获取所属仓库", error);
        });
    },
    //获取列表
    getData() {
      let data = {
        ...this.bindInfo,
        page: this.currentPage,
        limit: this.pageSize
      };
      this.loading = true;
      listArrivalNoticeByPage(data)
        .then(res => {
          if(res.status == 200){
            this.tableData = res.data.rows;
            this.total = res.data.total;
            this.loading = false;
          }else{
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          console.error(error, "获取列表");
        });
    },
    //显示模板下载
    downLoad() {
      this.down = true;
    },
    //详情
    detailsFn(row) {
      this.$router.push({
        path: "edit",
        query: {
          arrivalNoticeId: String(row.arrivalNoticeId),
          supplierId: String(row.supplierId),
          brandId: String(row.brandId),
          categoryId: String(row.categoryId),
          aogId: String(row.aogId),
          isShow: 0
        }
      });
    },
    //编辑
    edits() {
      if (this.choseArr.length < 1) {
        this.$message.warning("您未勾选!");
      } else if (this.choseArr.length > 1) {
        this.$message.warning("只能勾选一个!");
      } else {
        if (this.choseArr[0].isDelete == 1) {
          this.$message.warning("已经作废!");
          return;
        }
        if (this.choseArr[0].status == 1) {
          this.$message.warning("已提交不能编辑");
          return;
        }
        this.$router.push({
          path: "edit",
          query: {
            arrivalNoticeId: String(this.choseArr[0].arrivalNoticeId),
            supplierId: String(this.choseArr[0].supplierId),
            brandId: String(this.choseArr[0].brandId),
            categoryId: String(this.choseArr[0].categoryId),
            aogId: String(this.choseArr[0].aogId),
            isShow: 1
          }
        });
      }
    },
    //导入到货清单
    toLead() {
      this.dialogVisible = true;
    },
    //作废
    tovoid() {
      if (this.choseArr.length < 1) {
        this.$message.warning("您未勾选!");
      } else if (this.choseArr.length > 1) {
        this.$message.warning("只能勾选一个!");
      } else {
        if (this.choseArr[0].isDelete == 1) {
          this.$message.warning("已经作废!");
          return;
        }
        if(this.choseArr[0].status == 1){
          this.$message.error('已经提交不能作废!')
          return
        }
        this.$confirm("是否作废本条信息?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            let data = {
              arrivalNoticeId: this.choseArr[0].arrivalNoticeId
            };
            deleteArrivalNotice(data).then(res => {
              if(res.status == 200){
                this.getData();
              }
            })
              .catch(error => {
                console.error("", error);
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      }
    },
    //勾选
    chooseDelete(val) {
      this.choseArr = val;
    },
    filterHandler(value, row, column) {
      const property = column["property"];
      return row[property] === value;
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //处理时间
    timeChange() {
      this.bindInfo.startTime =
        this.dataValue.length !== 0 ? this.dataValue[0] : "";
      this.bindInfo.endTime =
        this.dataValue.length !== 0 ? this.dataValue[1] : "";
    },
    //查询
    searchFun() {
      this.currentPage = 1;
      this.getData();
    },
    //重置
    Reset() {
      this.bindInfo = {};
      this.dataValue = [];
      this.getData();
      this.currentPage = 1;
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getData();
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getData();
    }
  }
};
</script>
<style lang='scss' scoped>
.btnsList {
  width: 100%;
  display: flex;
  justify-content: center;
}
.head_list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.input-vw {
  width: calc(((100vw - 250px)) / 5);
  // margin-bottom: 20px;
  float: left;
  position: relative;
  display: flex;
  align-items: center;
}
</style>
