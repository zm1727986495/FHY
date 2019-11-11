<template>
  <div>
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <!-- 查询条件 -->
    <el-card>
      <div class="head_list">
        <div class="input-vw">
          <el-input
            placeholder="到货单号"
            v-model="bindInfo.arrivalNoticeCode"
            size="small"
            class="width-100"
          ></el-input>
        </div>
        <div class="input-vw">
          <div class="stock_time">
            <el-date-picker
              size="small"
              v-model="dataValue"
              type="daterange"
              range-separator="-"
              value-format="yyyy-MM-dd"
              format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              style="width:100%"
              @change="pickerFn"
            ></el-date-picker>
          </div>
        </div>
        <div class="input-vw">
          <span style="color:red;">*</span>
          <el-select size="small" class="width-100" v-model="bindInfo.brandId" placeholder="品牌">
            <el-option
              v-for="item in brandList"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId"
            ></el-option>
          </el-select>
        </div>

        <div class="input-vw">
          <span style="color:red;">*</span>
          <el-select size="small" class="width-100" v-model="bindInfo.categoryId" placeholder="品类">
            <el-option
              v-for="item in categoryList"
              :key="item.commodityCategoryId"
              :label="item.categoryName"
              :value="item.commodityCategoryId"
            ></el-option>
          </el-select>
        </div>
        <div class="input-vw">
          <span style="color:red;">*</span>
          <el-select size="small" class="width-100" filterable v-model="bindInfo.storageId" placeholder="仓库">
            <el-option
              v-for="item in warehouseList"
              :key="item.storageId"
              :label="item.storageName"
              :value="item.storageId"
            ></el-option>
          </el-select>
        </div>

        <div class="input-vw">
          <el-button type="warning" class="button-fc" size="medium" @click="searchFun">查询</el-button>
          <el-button type="primary" size="medium" @click="Reset">重置</el-button>
        </div>
        <div class="input-vw"></div>
        <div class="input-vw"></div>
      </div>
      <div class="m-bottom10">
        <el-radio-group v-model="radio">
          <el-radio label="1">成品</el-radio>
          <el-radio label="2">定制品</el-radio>
        </el-radio-group>
      </div>
    </el-card>

    <el-card class="m-top20">
      <!-- 成品 -->

      <div class="table_list lvs attribute" v-if="radio==1">
        <el-table
          id="out-table"
          border
          style="width: 100%"
          :row-class-name="tableRowClassName"
          :data="tableData"
        >
          <el-table-column align="center" prop="purchaseNumber" label="采购单号" width="200"></el-table-column>
          <el-table-column
            align="center"
            prop="commodityName"
            label="商品名称"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column
            v-if="bindInfo.brandId==2"
            align="center"
            prop="itemNumber"
            label="货号"
            width="180"
          ></el-table-column>
          <el-table-column align="center" prop="colourName" label="颜色" width="180"></el-table-column>
          <el-table-column
            align="center"
            prop="inventoryNumber"
            label="实收套"
            width="100"
            v-if="bindInfo.brandId==2"
          ></el-table-column>
          <el-table-column
            v-else
            align="center"
            prop="inventoryNumber"
            sortable
            label="数量"
            width="100"
          ></el-table-column>
          <el-table-column
            align="center"
            prop="piece"
            label="实收件"
            width="100"
            v-if="bindInfo.brandId==2"
          ></el-table-column>
          <el-table-column align="center" prop="siteCode" label="货区货位" width="180"></el-table-column>
          <el-table-column
            align="center"
            prop="commodityModel"
            label="型号"
            width="180"
            v-if="bindInfo.brandId==2"
          ></el-table-column>

          <el-table-column
            align="center"
            prop="productionOrderNo"
            label="实物生产单号"
            width="180"
            v-if="bindInfo.brandId==2"
          ></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" width="150"></el-table-column>
          <el-table-column align="center" prop="storeName" label="所属门店" width="200"></el-table-column>
          <el-table-column align="center" prop="orderNumber" label="订单号" width="200"></el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌" width="120"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类" width="120"></el-table-column>
          <el-table-column align="center" prop="storageTime" label="入库时间" width="180"></el-table-column>
          <el-table-column align="center" prop="userName" label="入库人" width="120"></el-table-column>
          <el-table-column
            align="center"
            prop="remarks"
            label="备注"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
      <!-- 定制品 -->
      <div v-if="radio==2">
        <div class="table_list lvs attribute">
          <el-table
            id="out-table"
            border
            style="width: 100%"
            :row-class-name="tableRowClassName"
            :data="pageList"
          >
            <el-table-column align="center" prop="storageName" label="所属仓库" width="200"></el-table-column>
            <el-table-column align="center" prop="purchaseNumber" label="采购单号" width="200"></el-table-column>
            <el-table-column
              v-for="(item,index) in headerList"
              align="center"
              prop="putInStorageType"
              :label="item.aogTemplateName"
              width="150"
              :key="index"
              sortable
            >
              <template slot-scope="scope">
                <div
                  v-if="scope.row.packageList[index]&&item.aogTemplateId==scope.row.packageList[index].aogTemplateId"
                >{{scope.row.packageList[index].inventoryNumber}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" label="货位" width="200">
              <template slot-scope="scope">
                <div v-for="item in scope.row.packageList">
                  <div v-for="attr in item.siteList">{{attr.siteCode}}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="arrivalNoticeCode" label="到货单号" width="200"></el-table-column>
            <el-table-column align="center" prop="storeName" label="所属门店" width="200"></el-table-column>
            <el-table-column align="center" prop="orderNumber" label="订单号" width="200"></el-table-column>
            <el-table-column align="center" prop="brandName" label="品牌" width="200"></el-table-column>
            <el-table-column align="center" prop="categoryName" label="品类" width="200"></el-table-column>
            <el-table-column align="center" prop="storageTime" label="入库时间" width="200"></el-table-column>
            <el-table-column align="center" prop="userName" label="入库人" width="200"></el-table-column>
            <el-table-column align="center" prop="remarks" label="备注" width="200"></el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>
    <div class="foot_btn_box m-top20">
      <el-button type="primary" @click="submission">导 出</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import {
  selectListPackage,
  selectGoodsByPage,
  exportListPackage
} from "api/entrepotSet/stockManagement/stockPending/stockPending";
import {
  listBrand,
  listCategory,
  getStorageList
} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import FileSaver from "file-saver";
import XLSX from "xlsx";
export default {
  components: {
    breadcrumb,
    pagination
  },
  data() {
    return {
      navList: [], //导航
      bindInfo: {}, //查询条件
      brandList: [], //品牌
      categoryList: [], //品类
      dataValue: [], //日期
      tableData: [], //列表数据
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      radio: "1",
      warehouseList: [], //仓库
      headerList: [],
      pageList: []
    };
  },
  mounted() {
    this.navList = this.$route.meta;
    this.getBrand();
    this.getCategory();
    this.getWarehouse();
  },
  methods: {
    //获取定制品列表
    getTable() {
      let { storageId, categoryId, brandId } = this.bindInfo;
      if (!brandId) {
        this.$message.error("请选择品牌");
        return;
      }
      if (!categoryId) {
        this.$message.error("请选择品类");
        return;
      }
      if (!storageId) {
        this.$message.error("请选择仓库");
        return;
      }

      let data = {
        ...this.bindInfo
      };
      selectListPackage(data)
        .then(res => {
          if (res.status == 200) {
            this.headerList = res.data.templateList;
            this.pageList = res.data.list;
          }
        })
        .catch(error => {
          console.error("获取导出列表", error);
        });
    },
    //获取成品列表
    getGoods() {
      let { storageId, categoryId, brandId } = this.bindInfo;
      if (!brandId) {
        this.$message.error("请选择品牌");
        return;
      }
      if (!categoryId) {
        this.$message.error("请选择品类");
        return;
      }
      if (!storageId) {
        this.$message.error("请选择仓库");
        return;
      }

      let data = {
        ...this.bindInfo
      };
      selectGoodsByPage(data)
        .then(res => {
          if (res.status == 200) {
            this.tableData = res.data;
          }
        })
        .catch(error => {
          console.error("获取导出成品列表", error);
        });
    },
    //获取品牌
    getBrand() {
      listBrand()
        .then(res => {
          this.brandList = res.data;
        })
        .catch(error => {
          console.error("获取品牌", error);
        });
    },
    //获取品类
    getCategory() {
      listCategory()
        .then(res => {
          this.categoryList = res.data;
        })
        .catch(error => {
          console.error("获取品类", error);
        });
    },
    //获取仓库
    getWarehouse() {
      getStorageList()
        .then(res => {
          this.warehouseList = res.data;
        })
        .catch(error => {
          console.error("获取仓库", error);
        });
    },
    //查询
    searchFun() {
      this.currentPage = 1;
      if (this.radio == 2) {
        this.getTable();
      } else {
        this.getGoods();
      }
    },
    //重置
    Reset() {
      this.bindInfo = {};
      this.dataValue = [];
    },
    //导出
    submission() {
      if (this.radio == 1) {
        var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));
        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "buffer"
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            "导出入库信息.xlsx"
          );
        } catch (e) {
          console.log(e);
        }
      } else {
        var wb = XLSX.utils.table_to_book(document.querySelector("#out-table"));

        var wbout = XLSX.write(wb, {
          bookType: "xlsx",
          bookSST: true,
          type: "buffer"
        });
        try {
          FileSaver.saveAs(
            new Blob([wbout], { type: "application/octet-stream" }),
            "导出入库信息.xlsx"
          );
        } catch (e) {
          console.log(e);
        }
      }

      return;
    },
    //取消
    cancel() {
      this.$router.go(-1);
    },
    //日期change
    pickerFn() {
      if (this.dataValue.length != 0) {
        let str =
          new Date(this.dataValue[1]).getTime() -
          new Date(this.dataValue[0]).getTime();
        if (str <= 172800000) {
          this.bindInfo.startTime = this.dataValue[0];
          this.bindInfo.endTime = this.dataValue[1];
        } else {
          this.$message.error("时间不能大于3天!");
          this.dataValue = [];
        }
      }
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
    }
  }
};
</script>
<style lang="scss" scoped>
.foot_btn_box {
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
  width: calc(((92.5vw - 250px)) / 4);
  margin-bottom: 20px;
  float: left;
  position: relative;
  display: flex;
  align-items: center;
}
.btnsList {
  width: 100%;
  display: flex;
  justify-content: center;
}
.orderList {
  font-size: 14px;
  max-height: 650px;
  overflow: auto;
  color: #909399;
  .order_item {
    width: 100%;
    border: 1px solid #ebeef5;
    .item_header {
      > span {
        width: 80px;
      }
      height: 50px;
      line-height: 50px;
      display: flex;
      flex-wrap: nowrap;
      > div {
        width: 25%;
        .span_title {
          font-weight: bold;
        }
      }
    }
    .item_body {
      max-height: 400px;
      overflow-y: auto;
      overflow-x: auto;
      .item_div {
        display: flex;
        flex-wrap: nowrap;
        ul {
          .item_tiele {
            height: calc(100% - 90px);
          }
          .textAl {
            display: flex;
            align-items: center;
          }
        }
        li {
          width: 120px;
          border-top: 1px solid #ebeef5;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-right: 1px solid #ebeef5;
        }
        .li_detail1 {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          height: 100%;
        }
        .li_pro {
          display: flex;
          width: 200px;
          height: 100%;
        }
        .li_detail2 {
          // max-width: 200px;
          display: flex;
          // justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>