<template>
  <div>
    <el-dialog title="成品列表" :visible.sync="dialogVisible" width="50%" :before-close="handleClose" custom-class="customDialogTitle">
      <div class="table_list lvs attribute">
        <el-table border @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" :data="tableData">
          <el-table-column align="center" type="selection" fixed="left"></el-table-column>
          <el-table-column align="center" prop="storageName" label="所属仓库" sortable width="150"></el-table-column>
          <el-table-column align="center" prop="statusStr" label="库存状态" width="100">
            <template slot-scope="scope">
              <div class="typeBg">
                <p v-if="scope.row.inventoryStatus==1">正常</p>
                <p v-if="scope.row.inventoryStatus==2">严重不足</p>
                <p v-if="scope.row.inventoryStatus==3">库存过少</p>
                <p v-if="scope.row.inventoryStatus==4">库存过多</p>
                <p v-if="scope.row.inventoryStatus==5">严重过多</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="commodityNumber" label="货号" width="180" show-overflow-tooltip></el-table-column>
          
          <el-table-column align="center" prop="commodityModel" label="商品型号" width="180" show-overflow-tooltip></el-table-column>
          <el-table-column
            align="center"
            prop="commodityName"
            label="商品名称"
            width="180"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div class="process_name">
                <div>
                  <!-- <p class="borrow" v-if="scope.row.ids==0">借</p> -->
                </div>
                <!-- <el-button type="text" class="table_action_span" @click="tradenameFun(scope.row)" style="width: 100px; text-overflow: ellipsis;overflow: hidden;">{{scope.row.commodityName}}</el-button> -->
                <div
                  style="width:150px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;"
                >{{scope.row.commodityName}}</div>
                <div>
                  <p class="tradename" v-if="scope.row.status==2||scope.row.status==3">滞</p>
                </div>
              </div>
            </template>
          </el-table-column>
          
          <el-table-column align="center" prop="brandName" label="品牌" width="120"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类" width="120"></el-table-column>
          <el-table-column align="center" prop="classifyName" label="商品分类" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="materialName" label="商品材质" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="colourName" label="商品颜色" width="150" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="commodityUnit" label="计量单位" width="120"></el-table-column>
          <el-table-column align="center" prop="status" label="商品属性" width="120">
            <template slot-scope="scope">
              <div>
                <p v-if="scope.row.status==1">正常</p>
                <p v-if="scope.row.status==2">严重呆滞品</p>
                <p v-if="scope.row.status==3">呆滞品</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="libraryOfAge" label="库龄" width="100"></el-table-column>
          <el-table-column align="center" prop="theActualInventory" label="实际库存" width="120"></el-table-column>
          <el-table-column align="center" prop="newProductAvailableInventory" label="新品可用库存" width="120"></el-table-column>
          <el-table-column align="center" prop="takeInventory" label="占用库存" width="120"></el-table-column>
          <el-table-column align="center" prop="inventoryIsDeducted" label="暂扣库存" width="120"></el-table-column>
          <el-table-column align="center" prop="storeInventory" label="门店暂存数量" width="120"></el-table-column>
          <el-table-column align="center" prop="inventorySample" label="样品库存" width="120"></el-table-column>
          <el-table-column align="center" prop="costing" label="移动平均价" width="120"></el-table-column>
          <el-table-column align="center" prop="seriousUpperLimit" label="库存上限" width="150"></el-table-column>
          <el-table-column align="center" prop="warningLowerLimit" label="库存下限" width="150"></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" width="160"></el-table-column>
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
        <el-button type="primary" @click="submissionFn">确 定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { listGoodsByPage } from "api/entrepotSet/inventorymanagement/stockingstock/stockingstock";
import pagination from "@/views/components/pagination";
export default {
  components:{
    pagination
  },
  props:['dialogVisible'],
  data(){
    return {
      tableData: [],//获取列表数据
      tableSelectList: [], //勾选
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    //获取备货列表
    getData() {
      let data = {
        storageId:this.$route.query.storageId,
        text:this.$route.query.commodityNumber,
        page: this.currentPage,
        limit: this.pageSize
      };
      listGoodsByPage(data).then(res => {
          if(res.status == 200){
            this.tableData = res.data.rows;
            this.total = res.data.total;
          }
        }).catch(error => {
          console.error("获取备货列表", error);
        });
    },
    //确定
    submissionFn(){
      if(this.tableSelectList.length == 0){
        this.$message.error('当前没有勾选!')
        return
      }
      let isPiece = this.tableSelectList.every(item=>{
        return item.commodityUnit == '件' || item.commodityUnit == '个';
      });
      if(!isPiece){
        this.$message.error('当前单位有不是件或者个!')
        return
      }
      let arr = this.tableSelectList.map(item=>{
        return String(item.skuGoodsId)
      })
      
      let ary = this.$route.query.skuGoodsIds.split(',');
      let removal = [...new Set([...arr,...ary])];
      this.$emit('getData',removal)
    },
    //关闭
    handleClose(){
      this.$emit('closeBox')
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    handleSelectionChange(val){
      this.tableSelectList = val;
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

</style>