<template>
    <!-- 添加商品的弹窗 -->
    <div class="order_dia">
        <el-dialog
        title="选择订单"
        :visible.sync="visible"
        width="65%"
        :before-close="handleClose"  
        custom-class="customDialogTitle" >
        <div class="search_addfigt">
          <div class="inputsearch">
            <el-input placeholder="订单号/客户姓名/电话"></el-input>
          </div>
          <el-button type="primary" size="medium" class="reset_btn m-left20" @click="getOrderList">查询</el-button>
         
        </div>

        <div class="search_addfigt table_list lvs attribute m-top20">
          <el-table
              border
              :row-style="tableBodycolor"
              :row-class-name="tableRowClassName"
              @selection-change="handleSelectionChange"
              :data="tabList"
              style="width: 100%;">
              <el-table-column type="selection" width="40"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="订单编号" sortable width="120"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="订单类型" sortable width="120"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="订单货品类型" sortable width="150"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="产品品类" sortable width="120"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="合同金额" sortable width="120"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="已收金额" sortable width="120"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="客户名称" sortable width="120"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="客户电话" sortable width="120"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="备用电话" sortable width="120"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="订单地址" sortable width="120"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="销售" sortable width="120"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="测量" sortable width="120"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="设计师" sortable width="120"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="所属门店" sortable width="120"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="所属摊位" sortable width="120"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="创建订单时间" sortable width="150"></el-table-column>
              <el-table-column prop="customerPhone" align="center" label="合同签订时间" sortable width="150"></el-table-column>
          </el-table>

        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="selOrderid">确 定</el-button>
          <el-button  @click="handleClose">取 消</el-button>          
        </span>
        </el-dialog>

        
    </div>
  
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";



export default {
  props:["visible"],
  components: {
      pagination,
      
      
  },
  data() {
    return {
      tabList:[],
    
      
      
    };
  },
  
  mounted() {
   
  },
  methods: {
    //查询按钮获取订单列表
    getOrderList(){

    },


    handleClose(){
      this.$emit("orderdia-clo")
        
    },
    selOrderid(){
      this.$emit("selOrderid",1)
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
      console.log(this.elsectVal)
    },
    
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //表格斑马线设置
    tableRowClassName({row, rowIndex}) {
        return rowIndex%2 != 0 ? 'el-f0' : '';
    },
    
    
  }
};
</script>
<style scoped lang='scss'>


.order_dia{
  .search_addfigt{
    display: flex;
    flex-wrap: nowrap; 
    width: 90%;
    margin: 20px auto;
    // justify-content:space-between;
    .inputsearch{
      display: flex;
      flex-wrap: nowrap; 
      align-items: center;
      span{
        display: inline-block;
        min-width: 80px;
        text-align: right
      }
      // div{
      //   width: 100%
      // }
    }
  }
  .dialog-footer{
    margin-right:5% 
  }

}



</style>

