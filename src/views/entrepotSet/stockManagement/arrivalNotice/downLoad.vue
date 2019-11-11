<template>
  <div class="downLoad">
    <div class="tempStyle">
      <div class="table-width lvs attribute">
        <el-table
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
          :data="tableData"
        >
          <el-table-column type="selection" align="center" v-if="checklist" width="55" fixed></el-table-column>
          <el-table-column align="center" label="操作" width="100" v-if="isShow">
            <template slot-scope="scope">
              <div>
                <!-- <a
                :href="downFile+'?'+'brandId='+scope.row.brandId+'&'+'categoryId='+scope.row.categoryId"
                class="table_action_span"
                >下载模板</a>-->
                <p class="table_action_span" @click="downloadtemplate(scope.row)">下载模板</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            prop="aogName"
            label="名称"
            width="200"
            sortable
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌" width="200"></el-table-column>
          <el-table-column
            align="center"
            prop="companyName"
            label="供应商"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
          <el-table-column align="center" prop="createTime" label="生效时间" width="200"></el-table-column>
          <el-table-column align="center" prop="createName" label="创建人" width="200"></el-table-column>
          <el-table-column
            align="center"
            prop="remarks"
            label="备注"
            width="200"
            show-overflow-tooltip
          ></el-table-column>
        </el-table>
      </div>
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
</template>
<script>
import pagination from "@/views/components/pagination";
import module from "../../../../../config/index.js";
import {
  listAogByPage,
  exportListAogTemplate
} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
export default {
  props: ["isShow", "checklist", "bindInfo"],
  components: {
    pagination
  },
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
      tableData: [],
      templateList: [],
      downFile: "",
      choseArr: []
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    //下载模板
    downloadtemplate(row) {
      let str =
        module.dev.proxyTable["/api"].target +
        "/api/pc/aog/exportListAogTemplate?aogId=" +
        row.aogId;

      window.location.href = str;
    },
    //获取到货模板
    getData() {
      let data = {
        page: this.currentPage,
        limit: this.pageSize
      };
      if (!this.isShow) {
        data.brandId = this.bindInfo.brandId;
        data.categoryId = this.bindInfo.categoryId;
      }
      listAogByPage(data)
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("到货模板", error);
        });
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
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    handleSelectionChange(val) {
      this.choseArr = val;
    }
  }
};
</script>
<style lang='scss' scoped>
.downLoad {
  .tempStyle {
    max-height: 400px;
    overflow-y: auto;
  }
  .btnList {
    margin-bottom: 20px;
  }
  .table_action_span {
    color: rgb(127, 221, 228);
    cursor: pointer;
  }
}
</style>