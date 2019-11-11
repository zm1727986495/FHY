<template>
  <div class="price_box">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <div class="cost_content">
      <!-- 左边的查询卡片 -->
      <el-card class="m-bottom TreeStyl">
        <div class="warp_list">
          <div class="head_search">
            <el-input placeholder size="medium" v-model="searchtext" maxlength="50"></el-input>
          </div>
          <div class="head_btn m-left10">
            <el-button class="button-fc" type="warning" size="medium" @click="organizationSearh">查询</el-button>
          </div>
        </div>
        <el-tree
          ref="tree"
          :data="categorys"
          :props="defaultProps"
          @node-click="cateClick"
          :filter-node-method="filterNode"
          node-key="id"
        ></el-tree>
      </el-card>
      <!-- 查询卡片 -->
      <el-card class="m-bottom20">
        <div class="m-bottom20">
          <el-row :gutter="10" class="queryForm">
            <el-col :span="6">
              <el-input
                v-model.trim="formInline.priceStrategyName"
                @keyup.enter.native='onSearch()'
                clearable
                placeholder="价格策略名称"
                size="medium"
              ></el-input>
            </el-col>
            <el-col :span="6">
              <el-date-picker
                v-model="searchData"
                type="daterange"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                size="medium"
                @change="dataChange('formInline',$event)"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
              ></el-date-picker>
            </el-col>
            <el-col :span="6">
              <el-select v-model="formInline.status" clearable placeholder="选择状态" size="medium">
                <el-option
                  v-for="item in stateList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-col>
            <el-col :span="6">
              <el-input
                placeholder="创建人姓名"
                v-model="formInline.createName"
                size="medium"
                maxlength="50"
              ></el-input>
            </el-col>
            <el-col :span="24" class="center">
              <el-button type="warning" class="button-fc" @click="onSearch" size="medium">查询</el-button>
              <el-button type="primary" @click="resetFun" size="medium">重置</el-button>
            </el-col>
          </el-row>
        </div>
        <div>
          <div class="price-btn-list m-bottom20">
            <el-button v-if="btnJurisdiction.priceguard_Add" size="small" class="button-96" @click="addFun">新增价格策略</el-button>
            <el-button v-if="btnJurisdiction.priceguard_Modify" size="small" class="button-96" @click="editFun">修改</el-button>
            <el-button v-if="btnJurisdiction.priceguard_Enable" size="small" class="button-96" @click="releaseFun">启用</el-button>
            <el-button v-if="btnJurisdiction.priceguard_Prohibit" size="small" class="button-96" @click="recallFun">停用</el-button>
            <el-button v-if="btnJurisdiction.priceguard_Delete" size="small" class="button-96" @click="deleteFun">删除</el-button>
          </div>
          <div class="table_list">
            <el-table
              border
              :row-class-name="tableRowClassName"
              :data="tableData"
              style="width: 100%"
              @selection-change="handleSelectionChange"
            >
              <el-table-column type="selection" width="55" align="center"></el-table-column>
              <el-table-column prop="type" label="价格类型" width="180" align="center">
                <template slot-scope="scope">
                  <div>
                    <p v-if="scope.row.type==0">标准销售价</p>
                    <p v-if="scope.row.type==1">渠道销售价</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column prop="priceStrategyName" label="策略单名称" width="200" align="center">
                <template slot-scope="scope">
                  <div>
                    <p
                      class="operation table_action_span"
                      @click="clickStrategy(scope.row)"
                    >{{scope.row.priceStrategyName}}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="companyName"
                show-overflow-tooltip
                label="公司"
                width="150"
                align="center"
              ></el-table-column>
              <el-table-column prop="createTime" label="创建日期" width="220" align="center"></el-table-column>
              <el-table-column prop="createName" label="创建人" width="150" align="center"></el-table-column>
              <el-table-column prop="status" label="状态" width="120" align="center">
                <template slot-scope="scope">
                  <div>
                    <p v-if="scope.row.status == 0">停用</p>
                    <p v-if="scope.row.status == 1">启用</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column
                prop="validityTime"
                label="有效期"
                width="220"
                :formatter="formatter"
                show-overflow-tooltip
                align="center"
              ></el-table-column>
              <el-table-column
                prop="remarks"
                align="center"
                label="备注"
                width="220"
                show-overflow-tooltip
              ></el-table-column>
            </el-table>
          </div>
          <div class="pagination_wrap">
            <pagination
              background
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
    <!-- popTan: 控制弹出框的显示 datapop：弹出框的字段数据 如果判断为true 代表为新增 不是 传入 formInline对象 dateDate: 时间 a  -->

    <popPop
      :title="randomTitle"
      v-if="popTan"
      :id="straId"
      :datapop="this.dateDate.length == 0 ? {}  : this.objList"
      :dateDate="dateDate"
      :arr="arr"
      :organId="organId"
      @list_data="getList"
      @data-change="dataChange"
      @submint-change="submintChange"
      @edit-id="editId"
    />
  </div>
</template>
<script>
import spot from "@/assets/images/spot.png";
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import popPop from "./components/popPop";

import {
  addPriceTactics,
  listPriceStrategy,
  listStore,
  formInlinetrategyById,
  deletePriceStrategy,
  inlistStore, // 价格策略下的门店列表
  editPriceStrategyStatus // 发布撤回功能
} from "api/price/price";

import {
  listCategory, // 获取品类
  listBrand, // 获取品牌
  listClassify,
  listCommodity,
  listBaseDict, //字典查询
  listOrganization // 组织机构
} from "api/pulicJava";
import { install } from "vuex";

export default {
  data() {
    return {
      // 按钮权限***********
      btnJurisdiction:JSON.parse(this.$loca.getItem("element")),
      navList: [], //导航标签
      spot,
      // 查询条件搜索
      formInline: {
        priceStrategyName: "",
        createName: "",
        status: ""
      },
      objList: {},
      searchData: [], // 查询时间查询
      defaultProps: {
        children: "children",
        label: "label"
      },
      searchtext: "",
      categorys: [],
      // 条件
      stateList: [{ value: "1", label: "启用" }, { value: "0", label: "停用" }], // 状态条件

      tableData: [], // 价格策略表格数据
      elsectVal: [], // table表单 勾选属性
      gridData: [], // 门店列表table数据

      // 弹出框的名字
      randomTitle: " ",
      dateDate: [], // 时间搜索
      straId: 0,
      popTan: false,
      // 修改价格策略

      //分页
      total: 10, // 总数
      pageSize: 20, // 单页条数
      currentPage: 1, // 当前页
      arr: [],
      organId: "" //组织机构ID
    };
  },
  activated(){
    // 头部面包屑
    this.navList = this.$route.meta;
    this.getMechanism();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;

  //   this.getMechanism();
  // },
  methods: {
    //点击树
    cateClick(val) {
      console.log(val);
      this.organId = val.id;
      this.arr = [];
      this.recursion(val);
      // this.formInline.organizationIds = this.arr.join(",");
      this.formInline.organizationIds = val.id
      this.$refs.tree.filter("");
      this.getList();
    },
    //递归拿数据
    recursion(val) {
      if (Object.prototype.toString.call(val) == "[object Object]") {
        this.arr.push(val.id);
        this.recursion(val.children);
      } else if (Object.prototype.toString.call(val) == "[object Array]") {
        val.forEach(item => {
          this.arr.push(item.id);
          this.recursion(item.children);
        });
      }
    },
    //树过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //获取机构
    getMechanism() {
      // 获取组织机构
      listOrganization({}).then(res => {
        this.categorys = res.data;
        // this.recursion(res.data[0]);
        // this.formInline.organizationIds = this.arr.join(",");
        // this.getList();
      });
    },
    //树查询
    organizationSearh() {},
    editId(id) {
      this.straId = id;
    },
    // 弹出框的取消 -- 子组件触发
    submintChange(item) {
      this.popTan = false; // 关闭弹出框
    },
    // 增加价格策略按钮 -- 增加按钮
    addFun() {
      if (!this.organId) {
        this.$message.error("请选择组织机构！");
        return;
      }
      if (this.elsectVal.length != 0) {
        this.$message({ message: "请取消所选价格策略", type: "warning" });
        return;
      }
      this.popTan = true;
      this.randomTitle = "新增价格策略"; // 修改弹出框名字
      this.dateDate = [];
    },
    // 修改价格策略 -- 修改按钮
    editFun() {
      // toFixed
      if (this.elsectVal.length == 0 || this.elsectVal.length > 1) {
        this.$message({
          message: "没有选择价格策略或所选多于一个",
          type: "warning"
        });
        return;
      } else {
        this.randomTitle = "修改价格策略"; // 修改弹出框名字

        this.objList = this.elsectVal[0]; // formInline 等于选中的Row,只有一个
        this.straId = this.elsectVal[0].priceStrategyId;
        console.log(
          this.elsectVal[0].priceStrategyId,
          "this.elsectVal[0].priceStrategyId"
        );
        console.log(this.straId, "this.straId123");

        // // 控制时间
        this.dateDate[0] = this.formInline.startTime
          ? this.formInline.startTime.split(" ")[0]
          : "";
        this.dateDate[1] = this.formInline.endTime
          ? this.formInline.endTime.split(" ")[0]
          : "";

        this.popTan = true;
      }
    },

    // 时间的数据处理
    dataChange(type, dates) {
      if (type == "formInline") {
        this.formInline.startTime = this.searchData ? this.searchData[0] : "";
        this.formInline.endTime = this.searchData ? this.searchData[1] : "";
      } else if (type == "pop") {
        this.dateDate = dates;
      }
    },
    // 销售价格维护表格选项发生变化事件
    handleSelectionChange(val) {
      this.elsectVal = val;
      console.log(val, "valll");
    },
    // 表格行样式
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    // 查询
    onSearch() {
      this.currentPage = 1;
      this.getList();
    },

    // 重置
    resetFun() {
      // 条件搜索
      this.formInline.priceStrategyName = ""; // 价格策略名称
      // 时间搜索
      this.searchData = [];
      this.formInline.startTime = "";
      this.formInline.endTime = "";
      this.formInline.status = ""; // 选择状态
      this.formInline.createName = ""; // 创建人姓名
      // this.$refs.selTree.clearHandle(); // 组织结构
    },

    sizeChange(val) {
      // 改变条数方法
      this.currentPage = 1;
      this.pageSize = val;
      this.getList();
    },
    currentChange(val) {
      // 翻页方法
      this.currentPage = val;
      this.getList();
    },

    // 获取 价格策略表格数据
    getList() {
      let data = {
        // ...this.formInline,
        priceStrategyName: this.formInline.priceStrategyName,
        createName: this.formInline.createName,
        status: this.formInline.status,
        orgId: this.formInline.organizationIds,
        page: this.currentPage,
        limit: this.pageSize
      };
      listPriceStrategy(data)
        .then(res => {
          this.total = res.data.total;
          this.tableData = res.data.rows;
        })
        .catch(error => {
          console.log("销售价格 销售价格维护 views/price/price", error);
        });
    },

    // 有效时间
    formatter(row, column) {
      let startTime = row.startTime
        ? row.startTime
            .split(" ")[0]
            .split("-")
            .join("/")
        : row.startTime;
      let endTime = row.endTime
        ? row.endTime
            .split(" ")[0]
            .split("-")
            .join("/")
        : row.endTime;
      return startTime + "~" + endTime;
    },

    // 点击表格的单元格
    clickStrategy(row) {
      this.$router.push({
        path: "strateDetails",
        query: {
          priceStrategyId: row.priceStrategyId,
          organizationId: row.organizationId
        }
      });
    },

    // 启用操作按钮
    releaseFun() {
      if (this.elsectVal.length == 0) {
        this.$message({ message: "请选择价格策略", type: "warning" });
        return;
      }

      // var flag = this.elsectVal.every(item => {
      //   return item.status !== "1";
      // });
      // // flag == true 所选策略均不是已发布状态
      // if (!flag) {
      //   this.$message({ message: "所选策略有处于已发布状态", type: "warning" });
      //   return;
      // }

      this.$confirm("是否确定启用价格策略?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.reCalland(1);
          this.getList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },

    // 停用操作按钮
    recallFun() {
      if (this.elsectVal.length == 0) {
        this.$message({ message: "请选择价格策略", type: "warning" });
        return;
      }
      this.$confirm("是否确定停用价格策略?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.reCalland(0);
          this.getList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    },
    // 启用和停用功能
    reCalland(status) {
      let priceStrategyIds = this.elsectVal.map(item =>
        Number(item.priceStrategyId)
      );

      let data = {
        priceStrategyIds,
        status
      };
      // toFixed
      editPriceStrategyStatus(data)
        .then(res => {
          if (res.status == 200) {
            if (status == 1) {
              this.$message({
                message: "启用价格策略成功",
                type: "success"
              });
            } else if (status == 0) {
              this.$message({
                message: "停用价格策略成功",
                type: "success"
              });
            }
          } else {
            this.$message.error(res.message);
          }
        })
        .catch(error => {
          console.log("销售价格 启用价格策略 views/price/price", error);
        });
    },
    deleteFun() {
      // 删除操作按钮
      if (this.elsectVal.length == 0) {
        this.$message({ message: "请选择价格策略", type: "warning" });
        return;
      }
      var flag = this.elsectVal.every(function(item, index, array) {
        return item.status !== "1";
      });
      // flag == true 所选策略均不是已发布状态
      if (!flag) {
        this.$message({
          message: "所选价格策略含有已发布的价格策略",
          type: "warning"
        });
        return;
      }

      this.$confirm("是否确删除价格策略?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          let priceStrategyIds = this.elsectVal.map(item =>
            Number(item.priceStrategyId)
          );

          let data = {
            priceStrategyIds
          };

          deletePriceStrategy(data)
            .then(res => {
              if (res.status == 200) {
                this.$message({
                  message: "删除价格策略成功",
                  type: "success"
                });
                this.getList();
              } else {
                this.$message.error(res.message);
              }
            })
            .catch(error => {
              console.log("销售价格 销售价格维护 views/price/price", error);
            });
          this.currentPage = 1;
          this.getList();
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消操作"
          });
        });
    }
  },
  components: {
    breadcrumb,
    popPop,
    pagination
  }
};
</script>
<style scoped lang="scss">
.price_box {
  .warp_list {
    display: flex;
  }
  .cost_content {
    display: flex;
    flex-wrap: nowrap;
    align-items: flex-start;
    justify-content: space-between;
    .TreeStyl {
      min-width: 300px;
      margin-right: 16px;
      height: calc(100vh - 145px);
      overflow-y: auto;
      min-height: 600px;
    }
  }
}
</style>





