<template>
  <div>
    <el-dialog
      title="商品列表"
      :visible.sync="dialogVisible"
      width="1000px"
      :before-close="handleClose"
      custom-class="customDialogTitle"
      top="20px"
    >
      <div class="head_list">
        <div class="input-vw">
          <el-input
            placeholder="订单号/合同号/采购合同号/商品名称/货位码"
            v-model="bindInfo.commodityName"
            size="medium"
            class="width-100"
          ></el-input>
        </div>
        <div class="input-vw">
          <el-select
            :disabled="true"
            v-model="bindInfo.storageId"
            placeholder="所属仓库"
            size="medium"
            class="width-100"
          >
            <el-option
              v-for="item in warehouseList"
              :key="item.storageId"
              :label="item.storageName"
              :value="item.storageId"
            ></el-option>
          </el-select>
        </div>
        <div class="input-vw">
          <el-select v-model="bindInfo.billType" placeholder="商品类型" size="medium" class="width-100">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <div class="input-vw">
          <div class="btnsList">
            <el-button type="warning" class="button-fc" size="medium" @click="searchFun">查询</el-button>
            <el-button type="primary" size="medium" @click="ResetFn">重置</el-button>
          </div>
        </div>
        <div class="input-vw"></div>
      </div>
      <div class="table_list lvs attribute">
        <el-table
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
          :data="tableData"
          ref="multipleTable"
        >
          <el-table-column align="center" type="selection" fixed></el-table-column>
          <el-table-column align="center" prop="storageName" label="所属仓库" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="commodityName" label="商品名称" width="200">
            <template slot-scope="scope">
              <div class="process_name">
                <div>
                  <p class="borrow" v-if="scope.row.ids==0" @click="borrow">借</p>
                </div>
                <p @click="tradenameFun(scope.row)" class="nameFun">{{scope.row.process_name}}</p>
                <div>
                  <p class="tradename" v-if="scope.row.ids==0">滞</p>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" width="200"></el-table-column>
          <el-table-column align="center" prop="specification" label="商品规格" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityModel" label="商品型号" width="200"></el-table-column>
          <el-table-column align="center" prop="brandName" label="商品品牌" width="200"></el-table-column>
          <el-table-column align="center" prop="classifyName" label="商品分类" width="200"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="商品品类" width="200"></el-table-column>
          <el-table-column align="center" prop="materialName" label="商品材质" width="200"></el-table-column>
          <el-table-column align="center" prop="colourName" label="商品颜色" width="200"></el-table-column>
          <el-table-column align="center" prop="status" label="商品属性" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityUnit" label="计量单位" width="200"></el-table-column>
          <el-table-column align="center" prop="libraryOfAge" label="库龄" width="200"></el-table-column>
          <el-table-column align="center" prop="availableInventory  " label="可用库存" width="200"></el-table-column>
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="determineFn">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import { listGoodsByPage } from "api/entrepotSet/inventorymanagement/stockingstock/stockingstock";
import { getStorageList } from "api/entrepotSet/stockManagement/stockPending/stockPending";
export default {
  props: ["dialogVisible", "isT",'storageId'],
  components: {
    pagination
  },
  data() {
    return {
      tableData: [], //列表数据
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
      bindInfo: {
        storageId:this.storageId,
      }, //查询条件
      isFlag: false, //是否是相同仓库
      options: [],
      tableSelectList: [],
      warehouseList: []
    };
  },
  mounted() {
    this.getData();
    this.getList();
  },
  methods: {
    //获取备货列表
    getData() {
      let data = {
        ...this.bindInfo,
        usable:1,
        page: this.currentPage,
        limit: this.pageSize
      };
      if (this.isT) {
        data.categoryId = 999998;
      }
      listGoodsByPage(data)
        .then(res => {
          if (res.status == 200) {
            this.tableData = res.data.rows;
            this.total = res.data.total;
          }
        })
        .catch(error => {
          console.error("获取备货列表", error);
        });
    },
    //获取仓库
    getList() {
      getStorageList()
        .then(res => {
          if (res.status == 200) {
            this.warehouseList = res.data;
          }
        })
        .catch(error => {
          console.error("获取所属仓库", error);
        });
    },
    //确定按钮
    determineFn() {
      let arr = [];
      this.tableSelectList.forEach(item => {
        arr.push(item.storageId);
      });
      let isFlag = Math.max.apply(null, arr) == Math.min.apply(null, arr);

      if (isFlag) {
        this.handleClose();
        this.$emit("newlyAdded", this.tableSelectList);
      } else {
        this.$message.error("仓库不同!");
      }
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
      this.getData();
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getData();
    },
    //关闭弹框
    handleClose() {
      this.$emit("closeFn");
    },
    //查询
    searchFun() {
      this.getData();
    },
    //重置
    ResetFn() {
      this.bindInfo = {};
    }
  }
};
</script>
<style lang="scss" scoped>
.head_list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.input-vw {
  width: calc(((60vw - 220px)) / 4);
  margin-bottom: 20px;
  float: left;
  position: relative;
  display: flex;
  align-items: center;
}
</style>
