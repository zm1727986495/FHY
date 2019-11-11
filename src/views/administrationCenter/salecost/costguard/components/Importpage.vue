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
          action="/api/pc/commodityPriceImport/addCostmport"
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
          <el-table-column prop="costPrice" label="成本价" align="center"></el-table-column>
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
    </el-card>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import { listCostFailImportByPage } from "api/administrationCenter/salecost/costguard/costguard";
import { getToken } from "utils/auth";
import module from "../../../../../../config/index"; //导出文件
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      navList: [],
      elsectVal: [],
      tableData: [{}],
      obj: {},
      headers: {
        Authorization: getToken()
      }
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
        organizationId: this.$route.query.organizationId
      };
      listCostFailImportByPage(data)
        .then(res => {
          console.log(res);
          this.tableData = res.data.rows;
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
        "/api/pc/commodityPriceImport/exportCost?" +
        "organizationId=" +
        this.$route.query.organizationId +
        "&token=" +
        getToken();
      // str = module.dev.proxyTable["/api"].target+"/api/pc/batchImport/exportBatchImport"
      window.location.href = str;
    },
    //导入之前
    beforeUploat(file) {
      this.obj.organizationId = this.$route.query.organizationId;
    },
    uploadSuccess(file) {
      if (file.status == 200) {
        this.getData();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.Importpage {
  .cost-btn-list {
    display: flex;
    flex-wrap: nowrap;
  }
}
</style>
