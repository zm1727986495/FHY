<template>
  <div>
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div>
        <div class="head_list">
          <div class="input-vw">
            <el-input
              placeholder="名称/仓库名称/负责人"
              v-model="bindInfo.text"
              size="medium"
              class="width-100"
            ></el-input>
          </div>

          <div class="input-vw">
            <el-date-picker
              style="width:100%"
              v-model="dataValue"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              @change="warehousingType"
              value-format="yyyy-MM-d"
              format="yyyy-MM-dd"
            ></el-date-picker>
          </div>
          <div class="input-vw">
            <el-select v-model="bindInfo.status" placeholder="订单类型" size="medium" class="width-100">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
            </el-select>
          </div>
          <div class="input-vw">
            <div class="btnsList">
              <el-button type="warning" class="button-fc" size="medium" @click="searchFun">查询</el-button>
              <el-button type="primary" size="medium" @click="Reset">重置</el-button>
            </div>
          </div>
        </div>
      </div>
      <div class="h-width"></div>
      <div>
        <div class="btnList">
          <el-button v-if="btnJurisdiction.warningSet_Add" size="small" class="button-96" @click="operation(0)">新增</el-button>
          <el-button v-if="btnJurisdiction.warningSet_Edit" size="small" class="button-96" @click="operation(1)">编辑</el-button>
          <el-button v-if="btnJurisdiction.warningSet_Delete" size="small" class="button-96" @click="batchdeletion">删除</el-button>
        </div>
        <div class="table_list lvs attribute">
          <el-table
            border
            style="width: 100%"
            :row-class-name="tableRowClassName"
            @selection-change="chooseDelete"
            :data="tableData"
          >
            <el-table-column align="center" type="selection" fixed></el-table-column>
            <el-table-column align="center" prop="strategyName" label="名称"></el-table-column>
            <el-table-column align="center" prop="storageName" label="仓库"></el-table-column>
            <el-table-column align="center" prop="status" label="状态">
              <template slot-scope="scope">
                <div>
                  <p v-if="scope.row.status==0">停用</p>
                  <p v-if="scope.row.status==1">启用</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="userName" label="创建人"></el-table-column>
            <el-table-column align="center" prop="createTime" label="创建时间"></el-table-column>
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
      </div>
    </el-card>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import {
  listStorageWarningStrategyByPage,
  deleteAllStorageWarningStrategy
} from "api/entrepotSet/warningSet/index.js";
export default {
  components: {
    breadcrumb,
    pagination
  },
  data() {
    return {
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      navList: [], //导航
      bindInfo: {}, //查询条件
      dataValue: [], //时间查询条件
      tableData: [], //列表数据
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      choseArr: [], //勾选
      options: [
        {
          name: "启用",
          id: 1
        },
        {
          name: "停用",
          id: 0
        }
      ]
    };
  },
  // mounted() {
  //   this.navList = this.$route.meta;
  //   this.getData();
  // },
  activated(){
    this.navList = this.$route.meta;
    this.getData();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  methods: {
    /**
     * 获取仓库预警策略列表
     * @method
     * getData
     */
    getData() {
      let data = {
        ...this.bindInfo,
        page: this.currentPage,
        limit: this.pageSize
      };
      listStorageWarningStrategyByPage(data)
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("获取仓库预警策略列表", error);
        });
    },
    /**
     * 新增和编辑
     * @method
     * operation
     *
     * 区分是编辑还是新增
     * @param val
     */
    operation(val) {
      if (val == 0) {
        //新增
        this.$router.push({ path: "addedlist" });
      } else {
        //编辑
        if (this.choseArr.length > 1) {
          this.$message.warning("只能勾选一条!");
        } else if (this.choseArr.length < 1) {
          this.$message.warning("只少勾选一条!");
        } else {
          this.$router.push({
            path: "editedlist",
            query: { strategyId: this.choseArr[0].strategyId }
          });
        }
      }
    },
    /**
     * 批量删除
     * @method
     * batchdeletion
     */
    batchdeletion() {
      this.$confirm("是否删除信息?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let arr = [];
          this.choseArr.forEach(item => {
            arr.push(item.strategyId);
          });
          let data = {
            strategyIdList: arr
          };

          deleteAllStorageWarningStrategy(data)
            .then(res => {
              console.log(res);
              if (res.status == 200) {
                this.$message.success("删除成功!");
                this.getData();
              }
            })
            .catch(error => {
              console.error("批量删除", error);
            });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    /**
     * 时间查询条件change事件
     * @method
     * warehousingType
     */
    warehousingType() {
      this.bindInfo.startTime = this.dataValue ? this.dataValue[0] : "";
      this.bindInfo.endTime = this.dataValue ? this.dataValue[1] : "";
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
    },
    //勾选
    chooseDelete(val) {
      this.choseArr = val;
    },
    //查询
    searchFun() {
      this.getData();
    },
    //重置
    Reset() {
      this.bindInfo = {};
      this.dataValue = [];
    }
  }
};
</script>
<style scoped lang='scss'>
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
.btnList {
  margin-bottom: 20px;
}
</style>
