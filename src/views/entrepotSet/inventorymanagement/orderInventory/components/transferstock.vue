<template>
  <div class="shopdetail">
    <el-dialog title="转移商品详情" width="900px" :visible.sync="outerVisible" custom-class="customDialogTitle" :before-close="handleClose">
      <!-- <ul class="transfer">
        <li>
          <span class="fw">所属仓库</span>
          <span>北京大兴仓</span>
        </li>
        <li>
          <span class="fw">转移订单号查询</span>
          <span><el-input v-model="textcontent" placeholder="请输入内容" size="small"></el-input></span>
        </li>
      </ul> -->
      <!-- <div class="titlecals">库取单</div> -->
      <div class="table_list lvs attribute m-top10">
        <el-table border style="width: 100%" :row-class-name="tableRowClassName"
          :data="tableData" @selection-change="handleSelectionChange">
          <el-table-column align="center" type="selection" fixed></el-table-column>
          <el-table-column align="center" prop="commodityName" label="商品名称" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="librariesTakeNumber" label="库取单号" sortable width="200"></el-table-column>
          <el-table-column align="center" prop="commodityModel" label="商品型号" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" width="200"></el-table-column>
          <el-table-column align="center" prop="commodityModel" label="商品类型" width="200"></el-table-column>
          <el-table-column align="center" prop="status" label="商品属性" width="200"></el-table-column>
          <el-table-column align="center" prop="getStorageType" label="计量单位" width="200"></el-table-column>
          <el-table-column align="center" prop="inventoryNumber" label="数量" width="200"></el-table-column>
          <el-table-column align="center" prop="inventoryNumbers" label="转移数量" width="200">
            <template slot-scope="scope">
              <div>
                <el-input type="number" v-model.number="scope.row.inventoryNumbers" 
                  min="0" :max="scope.row.inventoryNumber" placeholder="请输入转移数量" size="small">
                </el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="regionName" label="货位" width="200"></el-table-column>
          <el-table-column align="center" prop="libraryOfAge" label="库龄" width="200"></el-table-column>
          <el-table-column align="center" prop="getStorageType" label="入库时间" width="200"></el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitbtn">提 交</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  librariesTakeSingle,//订单库存-货位分配-库取单
  transferTheGoods,//订单库存-转备货
} from "api/entrepotSet/inventorymanagement/orderInventory/orderInventory";
export default {
  components: {

  },
  props: {
    orderId: Number,
    outerVisible: Boolean,
    outerVisibleFun: Function
  },
  data() {
    return {
      tableSelectList: [],
      textcontent: "",
      check: false,
      tableData: [],
      storage: "",
      orderids: this.orderId,//订单id
    };
  },
  mounted() {
    librariesTakeSingle({orderId: this.orderids}).then(res =>{
      if(res.status == 200){
        this.tableData = res.data;
      }
    }).catch(err =>{
      console.log("订单库存:订单库存-货位分配-库取单 src/views/entrepotSet/inventorymanagement/orderInventory/components/transferstock");
    })
  },
  methods: {
    selectproving(){
      if(this.tableSelectList.length > 1){
        this.$message({
          message: '只能选择一个订单',
          type: 'warning'
        });
        return false
      } else if (this.tableSelectList.length < 1){
        this.$message({
          message: '请选择订单',
          type: 'warning'
        });
        return false
      }
      return true
    },
    submitbtn(){
      if(this.selectproving()){
        let obj = this.tableSelectList[0]
        let objdata = {
          inventoryNumber: obj.inventoryNumbers || 0,
          relLibrariesTakeCommodityId: obj.relLibrariesTakeCommodityId,
          skuGoodsId: obj.skuGoodsId,
          purchaseOrderId: obj.purchaseOrderId,
        }
        transferTheGoods(objdata).then(res =>{
          if(res.status == 200){
            this.$message.success("转备货成功");
            this.handleClose()
          }
        }).catch(err =>{
          console.log("订单库存:订单库存-货位分配-库取单 src/views/entrepotSet/inventorymanagement/orderInventory/components/transferstock");
        })
      }
    },
    handleSelectionChange(val){
      this.tableSelectList = val;
    },
    handleClose() {
      this.$emit("outerVisibleFun");
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
  }
};
</script>
<style lang="scss" scoped>
.shopdetail{
  .titlecals{
    top: 0;
  }
  .sure {
    display: flex;
    justify-content: center;
  }
  .transfer {
    li {
      display: flex;
      font-size: 16px;
      align-items: center;
      margin-bottom: 20px;
      .fw{
        width: 120px;
        text-align: right;
        display: block;
      }
      span{
        margin-right: 20px;
      }
    }
  }
}
</style>
