<template>
  <div class="auxiliarymaterials">
    <div>
      <ul class="informationBox">
        <li>
          <span class="span_width">领用单号：</span>
          <span>{{objData.recipientsNo}}</span>
        </li>
        <li>
          <span class="span_width">领用状态：</span>
          <span>{{objData.recipientsStatus}}</span>
        </li>
        <li>
          <span class="span_width">领用数量：</span>
          <span>{{objData.recipientsNum}}</span>
        </li>
        <li>
          <span class="span_width">合同号：</span>
          <span>{{objData.contractSerialNumber}}</span>
        </li>
        <li>
          <span class="span_width">申请人：</span>
          <span>{{objData.applyName}}</span>
        </li>
        <li>
          <span class="span_width">审批人：</span>
          <span>{{objData.auditName}}</span>
        </li>
        <li>
          <span class="span_width">申请时间：</span>
          <span>{{objData.applyTime}}</span>
        </li>
      </ul>
    </div>
    <div class="m-top20">
      <div class="table-width lvs attribute">
        <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
          <el-table-column align="center" prop="storageName" label="所属仓库" width="200" sortable></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编号" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityModel" label="商品型号" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityModel" label="商品规格" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityName" label="商品名称" width="200"></el-table-column>
          <el-table-column align="center" prop="applyNum" label="商品数量" width="200"></el-table-column>
          <el-table-column align="center" prop="recipientsNum" label="领用数量" width="200"></el-table-column>
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
    <!-- <div class="m-top20">
      <el-steps :space="300" :active="1" finish-status="success">
        <el-step title="提交申请"></el-step>
        <el-step title="仓库审批"></el-step>
        <el-step title="申请通过"></el-step>
      </el-steps>
    </div> -->
  </div>
</template>
<script>
import {
  installationRecipientsDetails,
  listCommodity
} from "api/entrepotSet/stockrequisitioned/stockcollar";
import pagination from "@/views/components/pagination";
export default {
  props: ["recipientsId"],
  components: {
    pagination
  },
  data() {
    return {
      tableData: [], //列表
      objData: {}, //详情标头
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0 //总条数
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData() {
      let data = {
        recipientsId: this.recipientsId
      };
      //查询领用详情
      installationRecipientsDetails(data)
        .then(res => {
          this.objData = res.data;
        })
        .catch(error => {
          console.error("查询领用详情", error);
        });

      //领用详情中商品列表
      listCommodity(data)
        .then(res => {
          this.tableData = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("领用详情中商品列表", error);
        });
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
    }
  }
};
</script>
<style lang="scss" scoped>
.auxiliarymaterials {
  .informationBox {
    display: flex;
    flex-wrap: wrap;
    li {
      width: 33%;
      display: flex;
      align-items: center;
      margin: 5px 0;
    }
  }
  .span_width {
    min-width: 80px;
    text-align: right;
  }
  .applicationreason {
    display: flex;
  }
  .btn_style {
    display: flex;
    flex-direction: row-reverse;
  }
}
</style>
