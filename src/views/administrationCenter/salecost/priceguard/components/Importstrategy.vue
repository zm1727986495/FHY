<template>
  <div class="Importpage">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="cost-btn-list">
        <el-button size="small" class="button-96" @click="exportFun">导出</el-button>

        <el-upload
          action="/api/pc/commodityPriceImport/addBatchImport"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          class="upload-demo"
          multiple
          :headers="headers"
          :data="obj"
          :show-file-list="false"
          :before-upload="beforeUploat"
          :on-success="uploadSuccess"
          style="display:inline-block;margin-left:10px"
        >
          <el-button class="button-96" size="small">重新上传</el-button>
        </el-upload>
      </div>
      <div class="table_list lvs attribute m-top20">
        <el-table
          border
          :row-class-name="tableRowClassName"
          :data="tableData"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="commodityCode" label="商品编码" align="center" sortable></el-table-column>
          <el-table-column prop="commodityName" label="商品名称" align="center"></el-table-column>
          <el-table-column prop="sellingPrice" label="销售价" sortable align="center"></el-table-column>
          <el-table-column prop="status" label="状态" align="center">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.row.status==0">失败</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column prop="cause" label="失败原因" align="center"></el-table-column>
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
    </el-card>
    <div class="foot_btn_box">
      <el-button @click="cancel">返 回</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import { listFailImportByPage } from "api/administrationCenter/salecost/priceguard/priceguard";
import { getToken } from "utils/auth";
import module from "../../../../../../config/index"; //导出文件
export default {
  components: {
    breadcrumb,
    pagination
  },
  data() {
    return {
      navList: [],
      elsectVal: [],
      tableData: [{}],
      obj: {},
      headers: {
        Authorization: getToken()
      },
      //分页
      total: 0, // 总数
      pageSize: 20, // 单页条数
      currentPage: 1 // 当前页
    };
  },
  mounted() {
    this.navList = this.$route.meta;
    this.getData();
  },
  methods: {
    //获取列表
    getData() {
      let data = {
        organizationId: this.$route.query.organizationId,
        priceStrategyId: this.$route.query.priceStrategyId
      };
      listFailImportByPage(data)
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("获取失败列表", error);
        });
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选函数回调
    handleSelectionChange(val) {
      this.elsectVal = val;
    },
    //导出
    exportFun() {
      let str =
        module.dev.proxyTable["/api"].target +
        "/api/pc/commodityPriceImport/exportCommodityPrice?" +
        "organizationId=" +
        this.$route.query.organizationId +
        "&priceStrategyId=" +
        this.$route.query.priceStrategyId +
        "&token=" +
        getToken();
      window.location.href = str;
    },
    //导入之前
    beforeUploat(file) {
      this.obj.organizationId = this.$route.query.organizationId;
      this.obj.priceStrategyId = this.$route.query.priceStrategyId;
    },
    uploadSuccess(file) {
      if (file.status == 200) {
        this.getData();
      }
    },
    //返回按钮
    cancel() {
      this.$router.go(-1);
    },
    // 改变条数方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getCostPrice(data);
    },
    // 翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getCostPrice(data);
    }
  }
};
</script>
<style lang="scss" scoped>
.Importpage {
  .foot_btn_box {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .cost-btn-list {
    display: flex;
    flex-wrap: nowrap;
  }
}
</style>
