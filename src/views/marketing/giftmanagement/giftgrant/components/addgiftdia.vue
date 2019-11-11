<template>
  <!-- 添加礼品的弹窗 -->
  <div class="addgift_dia">
    <el-dialog title="添加礼品" custom-class="customDialogTitle" :visible.sync="addgift_vis" width="65%" :before-close="handleClose">
      <el-row :gutter="10" class="queryForm">
        <el-col :span="5">
          <el-input placeholder="商品编码/商品名称" v-model.trim="queryForm.names" size="medium"></el-input>
        </el-col>
        <el-col :span="5">
          <el-select v-model="queryForm.commodityColourId" clearable placeholder="选择颜色" size="medium" filterable>
            <el-option
              v-for="item in optionsList1"
              :key="item.id"
              :label="item.dictName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select v-model="queryForm.commodityMaterialId" clearable placeholder="选择材质" size="medium" filterable>
            <el-option
              v-for="item in optionsList2"
              :key="item.id"
              :label="item.dictName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="5">
          <el-select v-model="queryForm.commoditySeriesId" clearable placeholder="选择系列" size="medium" filterable>
            <el-option
              v-for="item in optionsList3"
              :key="item.id"
              :label="item.dictName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-button type="warning" size="medium" @click="searchFun">查询</el-button>
        </el-col>
      </el-row>
      <el-tabs type="border-card" @tab-click="tabclickH">
        <el-tab-pane label="门店礼品" class="table_list lvs attribute" name="0">
          <el-table
            border
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange"
            :data="tabList"
          >
            <el-table-column type="selection" width="40" :selectable="selectable"></el-table-column>
            <el-table-column prop="commodityCode" align="center" label="产品编码" sortable></el-table-column>
            <el-table-column prop="commodityName" align="center" label="产品名称" sortable></el-table-column>
            <el-table-column prop="availableAmount" align="center" label="价格" sortable></el-table-column>
            <el-table-column prop="commodityUnit" align="center" label="单位" sortable></el-table-column>
            <el-table-column prop="receivableNumber" align="center" label="可用数量" sortable></el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="仓库礼品" class="table_list lvs attribute" name="1">
          <el-table
            border
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange"
            :data="tabList"
            style="width:100%"
          >
            <el-table-column type="selection" width="40" :selectable="selectable"></el-table-column>
            <el-table-column prop="commodityCode" align="center" label="产品编码" sortable></el-table-column>
            <el-table-column prop="commodityName" align="center" label="产品名称" sortable></el-table-column>
            <el-table-column prop="availableAmount" align="center" label="价格" sortable></el-table-column>
            <el-table-column prop="commodityUnit" align="center" label="单位" sortable></el-table-column>
            <el-table-column prop="receivableNumber" align="center" label="可用数量" sortable></el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
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
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addgift">确定</el-button>
        <el-button @click="handleClose">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import {
  storeInventorySamplePage, //门店礼品
  storeStagingSamplePage //仓库礼品
} from "api/order/giftmanagement/giftmanagement";
import {
  listBaseDict //字典  dataType
} from "api/order/order/order";

export default {
  props: ["addgift_vis", "storeId", "disabedArr"],
  components: {
    pagination
  },
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      tabList: [],
      elsectVal: [], //勾选的商品
      tagName: "0", //tag切换
      queryForm: {}, //查询条件
      optionsList1: [], //颜色
      optionsList2: [], //系列
      optionsList3: [] //材质,
    };
  },
  mounted() {
    this.getListData();
    this.listBaseDictFun("COMMODITY_COLOR"); //颜色
    this.listBaseDictFun("COMMODITY_SERIES"); //系列
    this.listBaseDictFun("COMMODITY_MATERIAL"); //材质
  },
  methods: {
    //查询按钮点击事件
    searchFun() {
      this.currentPage = 1;
      this.getListData();
    },
    //查询方法
    getListData() {
      let data = {
        ...this.queryForm,
        storeId: this.storeId,
        page: this.currentPage,
        limit: this.pageSize
      };
      if (this.tagName == "0") {
        //tag 等于 0  门店礼品
        storeInventorySamplePage(data).then(res => {
          this.tabList = res.data.rows;
          this.total = res.data.total;
        });
      } else {
        //tag 等于 1  门店礼品
        storeStagingSamplePage(data).then(res => {
          this.tabList = res.data.rows;
          this.total = res.data.total;
        });
      }
    },

    //字典获取颜色等下拉框内容
    listBaseDictFun(dataType) {
      let data = {
        dataType: dataType
      };
      listBaseDict(data).then(res => {
        switch (dataType) {
          case "COMMODITY_COLOR":
            this.optionsList1 = res.data;
            break;

          case "COMMODITY_SERIES":
            this.optionsList2 = res.data;
            break;

          case "COMMODITY_MATERIAL":
            this.optionsList3 = res.data;
            break;
        }
      });
    },

    handleClose() {
      this.$emit("addgift-clo");
    },
    addgift() {
      if (this.elsectVal.length) {
        this.$emit("addgift", this.elsectVal, this.tagName);
      } else {
        this.$message.warning("请勾选商品");
      }
    },

    //tag切换
    tabclickH(e) {
      this.tagName = e.name;
      this.getListData();
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
    },
    // 是否可选
    selectable(row, index) {
      if (this.disabedArr.some(item => item == row.commodityCode)) {
        return false;
      } else {
        return true;
      }
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>

