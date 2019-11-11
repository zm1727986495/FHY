<template>
  <div class="faillist">
    <div class="purchase m-bottom10">
      <!-- <div class="iconBox">
        <i class="Icon"></i>
        <span>失败列表</span>
      </div> -->
      <div class="titlecals">失败列表</div>
      <el-button size="mini" class="button-96 m-left10" @click="exportFn">导出</el-button>
    </div>
      <div class="table-width lvs attribute">
        <el-table border :row-class-name="tableRowClassName" :data="tableData">
          <el-table-column align="center" prop="arrivalNoticeCode" label="到货单号"></el-table-column>
          <el-table-column align="center" prop="purchaseNumber" label="采购单号"></el-table-column>
          <el-table-column align="center" prop="createTime" label="导入时间" sortable></el-table-column>
          <el-table-column align="center" prop="createName" label="导入人"></el-table-column>
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
</template>
<script>
import {listArrivalNoticeFailureByPage} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
import module from "../../../../../../config/index"; //导出文件
import pagination from "@/views/components/pagination";
export default {
  components:{
    pagination
  },
  data(){
    return{
      tableData:[],
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    exportFn(){
      let str =
        module.dev.proxyTable["/api"].target +
        "/api/pc/arrivalNotice/exportArrivalNoticeFailure?" +
        "arrivalNoticeId="+this.$route.query.arrivalNoticeId;
      window.location.href = str;
    },
    getData(){
      let data = {
        page:this.currentPage,
        limit:this.pageSize,
        arrivalNoticeId:this.$route.query.arrivalNoticeId
      }
      listArrivalNoticeFailureByPage(data).then(res=>{
        if(res.status == 200){
          this.tableData = res.data.rows;
          this.total = res.data.total;
        }
      })
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
  },
}
</script>
<style lang="scss" scoped>
.faillist{
  padding:0 10px; 
  .titlecals{
    top:0;
    padding-top: 2px;
  }
}
.purchase {
  display: flex;
  // align-items: center;
}
</style>