<template>
  <div class="prolist">
    <div class="apper">
      <div class="searchtitle"></div>

      <div class="search_box">
        <div class="search_item">
          <el-input
            class="width-100"
            placeholder="商品名称/商品编码"
            v-model="searchForm.text"
            maxlength="50"
            style="display:inline-block;flex:1"
          ></el-input>
        </div>

        <div class="search_item">
          <el-select class="width-100" v-model="searchForm.brandId" placeholder="品牌">
            <el-option
              v-for="item in brandList"
              :key="item.brandId"
              :label="item.brandName"
              :value="item.brandId"
            ></el-option>
          </el-select>
        </div>

        <div class="search_item">
          <el-select class="width-100" v-model="searchForm.commodityCategoryId" placeholder="品类">
            <el-option
              v-for="item in categoryList"
              :key="item.commodityCategoryId"
              :label="item.categoryName"
              :value="item.commodityCategoryId"
            ></el-option>
          </el-select>
        </div>

        <div class="search_item">
          <el-button class="button-fc" type="warning" size="medium" @click="searchFun">查询</el-button>
          <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
        </div>
      </div>

      <div class="table_list lvs attribute">
        <el-table
          border
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
          :data="tabList"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column prop="storageName" label="所属仓库" width="240" sortable align="center"></el-table-column>
          <el-table-column prop="inventoryStatus" label="库存状态" width="240" sortable align="center">
            <template slot-scope="scope">
              <div class="typeBg">
                <p v-if="scope.row.inventoryStatus==1" class="labelicon4 labelI4">正常</p>
                <p v-if="scope.row.inventoryStatus==2" class="labelicon labelI">严重不足</p>
                <p v-if="scope.row.inventoryStatus==3" class="labelicon labelI">库存过少</p>
                <p v-if="scope.row.inventoryStatus==4" class="labelicon2 labelI2">库存过多</p>
                <p v-if="scope.row.inventoryStatus==5" class="labelicon labelI">严重过多</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column
            prop="commodityName"
            label="商品名称"
            width="240"
            sortable
            align="center"
            show-overflow-tooltip
          ></el-table-column>

          <el-table-column prop="commodityCode" label="商品编码" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="specification" label="商品规格" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="commodityModel" label="商品型号" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="classifyName" label="商品类型" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="materialName" label="商品材质" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="colourName" label="商品颜色" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="status" label="商品属性" width="240" sortable align="center">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.row.status==1">正常</p>
                <p v-if="scope.row.status==2">严重呆滞品</p>
                <p v-if="scope.row.status==3">呆滞品</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="commodityUnit" label="计量单位" width="240" sortable align="center"></el-table-column>

          <el-table-column
            prop="theActualInventory"
            label="实际库存"
            width="240"
            sortable
            align="center"
          ></el-table-column>

          <el-table-column prop="regionName" label="货区货位" width="240" sortable align="center"></el-table-column>
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

      <div class="subclick">
        <el-button class="el-button--medium" type="primary" size="medium" @click="subclick">确 认</el-button>
      </div>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import {
  listStockUpGoodsByPage, //备货库存查询列表
  listStore,
  listBrand,
  listCategory
} from "api/entrepotSet/allocationmanage/tobeallocated/tobeallocated";
import { mapMutations } from "vuex";

import spot from "@/assets/images/spot.png";
export default {
  props: ["theWarehousingId", "bringUpTheLibraryId"],

  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      spot, //操作图片
      navList: [], //头部面包屑

      elsectVal: [], //选中框
      tabList: [], //table数据
      brandList: [], //品牌
      categoryList: [], //品类
      searchForm: {} //查询条件
    };
  },
  mounted() {
    this.searchFun();
    this.getBrand();
    this.getCategory();
  },

  methods: {
    ...mapMutations(["SET_PROLIST"]),
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
    // 查询按钮
    searchFun() {
      let data = {
        ...this.searchForm,
        storageId: this.bringUpTheLibraryId,
        page: this.currentPage,
        limit: this.pageSize
      };
      listStockUpGoodsByPage(data).then(res => {
        this.tabList = res.data.rows;
        this.total = res.data.total;
      });
    },

    // 重置按钮
    resetFun() {
      this.searchForm = {};
    },

    //  提交按钮
    subclick() {
      if (this.theWarehousingId == this.bringUpTheLibraryId) {
        this.$message.warning("调入仓和调出仓不能相同");
        return;
      }
      if (this.elsectVal.length == 0) {
        this.$message.error("请先勾选商品");
      } else if (
        this.theWarehousingId == "" ||
        this.bringUpTheLibraryId == ""
      ) {
        this.$message.error("请填写仓库信息");
      } else {
        this.$router.push({
          path: "chosepro",
          query: {
            theWarehousingId: this.theWarehousingId,
            bringUpTheLibraryId: this.bringUpTheLibraryId
          }
        });
      }
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getListData();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getListData();
    },

    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
      this.SET_PROLIST(val);
      console.log(this.elsectVal);
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  },
  watch: {
    bringUpTheLibraryId: function() {
      this.searchFun();
    }
  }
};
</script>
<style scoped lang='scss'>
.prolist {
  .queryStyle {
    display: flex;
    justify-content: center;
  }
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
    span {
      min-width: 80px;
      text-align: right;
    }
    .fontMore {
      color: #d0cfcf;
    }
  }
  .subclick {
    width: 10%;
    margin: 20px auto;
  }
  .labelicon {
    padding: 2px 0px;
    background: red;
    color: #ffffff;
    font-size: 12px;
    position: relative;
    width: 130px;
  }
  .labelI::after {
    display: block;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 16px solid transparent;
    border-bottom: 10px solid #ff0000;
    bottom: 9px;
    right: -20px;
    transform: rotate(90deg);
  }
  .labelicon2 {
    padding: 2px 0px;
    background: #ffa847;
    color: #ffffff;
    font-size: 12px;
    position: relative;
    width: 130px;
  }
  .labelI2::after {
    display: block;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 16px solid transparent;
    border-bottom: 10px solid #ffa847;
    bottom: 9px;
    right: -20px;
    transform: rotate(90deg);
  }
  .labelicon3 {
    padding: 2px 0px;
    background: #999999;
    color: #ffffff;
    font-size: 12px;
    position: relative;
    width: 130px;
  }
  .labelI3::after {
    display: block;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 16px solid transparent;
    border-bottom: 10px solid #999999;
    bottom: 9px;
    right: -20px;
    transform: rotate(90deg);
  }
  .labelicon4 {
    padding: 2px 0px;
    background: #1abc9c;
    color: #ffffff;
    font-size: 12px;
    position: relative;
    width: 130px;
  }
  .labelI4::after {
    display: block;
    content: "";
    position: absolute;
    width: 0;
    height: 0;
    border-right: 15px solid transparent;
    border-left: 16px solid transparent;
    border-bottom: 10px solid #1abc9c;
    bottom: 9px;
    right: -20px;
    transform: rotate(90deg);
  }
  .typeBg {
    display: flex;
    justify-content: center;
  }
}
</style>

