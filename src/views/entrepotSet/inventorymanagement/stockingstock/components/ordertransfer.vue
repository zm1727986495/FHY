<template>
  <div class="ordertransfer">
    <el-dialog :visible.sync="outerVisible" width="800px" title="转移商品详情" class="customDialogTitle" :before-close="handleClose">
      <div>
        <div class="scarchtopclas">
          <el-input v-model="textcontent" placeholder="转移订单号查询" size="medium" style="width:30%;"></el-input>
          <div><el-button @click="searchfun" type="warning" class="button-fc" size="medium">查询</el-button></div>
        </div>
        <div>
          <div class="table_list lvs attribute">
            <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableData">
              <el-table-column align="center" type="selection" fixed></el-table-column>
              <el-table-column align="center" prop="commodityName" label="商品名称" sortable width="200"></el-table-column>
              <el-table-column align="center" prop="receiptsType" label="商品编码" width="200"></el-table-column>
              <el-table-column align="center" prop="getStorageType" label="商品型号" width="200"></el-table-column>
              <el-table-column align="center" prop="categoryName" label="商品品类" width="200"></el-table-column>
              <el-table-column align="center" prop="materialName" label="商品材质" width="200"></el-table-column>
              <el-table-column align="center" prop="colourName" label="商品颜色" width="200"></el-table-column>
              <el-table-column align="center" prop="inventoryType" label="库存类型" width="200">
                <template slot-scope="scope">
                  <div v-if="scope.row.inventoryType == 1">新品可用</div>
                  <div v-if="scope.row.inventoryType == 2">占用</div>
                  <div v-if="scope.row.inventoryType == 3">二次可用</div>
                  <div v-if="scope.row.inventoryType == 4">暂扣</div>
                  <div v-if="scope.row.inventoryType == 5">门店暂存</div>
                  <div v-if="scope.row.inventoryType == 6">样品</div>
                </template>
              </el-table-column>
              <el-table-column align="center" prop="regionName" label="货区" width="200"></el-table-column>
              <el-table-column align="center" prop="inventoryNumber" label="库存数量" width="200"></el-table-column>
              <el-table-column align="center" prop="driver" label="转移数量" width="200">
                <template slot-scope="scope">
                  <div><el-input v-model="scope.row.driver" min="0" type="number" size='mini'></el-input></div>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="subminbtn">提 交</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { getStockUpGoodsById, changeOrder } from "api/entrepotSet/inventorymanagement/stockingstock/stockingstock";
import { listStoragePurchaseOrderByPage } from "api/entrepotSet/inventorymanagement/orderInventory/orderInventory";

export default {
  props: {
    orderstoragedata: Object,
    outerVisible: Boolean,
    outerVisibleFun: Function
  },
  data() {
    return {
      orderId: "",
      textcontent: "",
      check: false,
      tableData: [{}],
      storage: "",
      datas: this.orderstoragedata
    };
  },
  mounted() {
    let data = {
      skuGoodsId: this.datas.skuGoodsId,
      storageId: this.datas.storageId,
    }
    getStockUpGoodsById(data).then(res =>{
      if(res.status == 200){
        this.tableData = res.data;
      }
    }).catch(err =>{
      console.log("订单库存:备货库存-转订单 src/views/entrepotSet/inventorymanagement/orderInventory/components/transferstock");
    })
  },
  methods: {
    subminbtn(){
      if(this.orderId === ""){
        this.$message.error("要转移的订单不能为空");
        return false;
      }
      let inventoryGoodsList = []
      let allotGoodsList = []
      this.tableData.forEach(item =>{
        let obj1 = {
          storageId: item.storageId,//仓库id
          regionId: item.regionId,//货区id
          siteId: item.siteId,//货位id
          skuGoodsId: item.skuGoodsId,//sku商品id
          inventoryNumber: item.driver ? item.driver : 0,//库存数量
          inventoryType: 2,//库存类型
        }
        let obj2 = {
          inventoryGoodsId: item.inventoryGoodsId,//库存商品id
          inventoryNumber: item.inventoryNumber - obj1.inventoryNumber,
        }
        inventoryGoodsList.push(obj1)
        allotGoodsList.push(obj2)
      })
      let data = {
        orderId: this.orderId,
        inventoryGoodsList: inventoryGoodsList,
        allotGoodsList: allotGoodsList
      }
      changeOrder(data).then(res => {
        if(res.status == 200){
          
        }
      }).catch(error => {
        console.error("转订单提交", error);
      });
    },
    searchfun(){
      // if(this.textcontent == ""){
      //   this.$message.error("请输入要转移的订单");
      //   return false
      // }
      let data = {
        text: this.textcontent,
      };
      listStoragePurchaseOrderByPage(data).then(res => {
        if(res.status == 200){
          if(res.data.rows.length < 1){
            this.$message.warning("未查询到此订单！");
          }else{
            this.$message.success("查询订单成功！");
            this.orderId = res.data.rows[0].orderId
          }
          // this.tableData = res.data.rows;
        }
      }).catch(error => {
        console.error("订单库存列表", error);
      });
    },
    handleClose() {
      this.$emit("outerVisibleFun");
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    determination() {
      this.innerVisible = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.ordertransfer{
  .scarchtopclas{
    display: flex;
    justify-content: space-between;
    margin-bottom: 20px;
  }
  .sure {
    display: flex;
    justify-content: center;
  }
  .storage {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 40px;
  }
  .available {
    border-bottom: 1px solid #e6e6e6;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .transferquantity {
    border: 1px solid #e6e6e6;
    height: 80px;
  }
  .transfer {
    display: flex;
    flex-wrap: wrap;
    margin-top: 10px;
    li {
      width: 30%;
      line-height: 40px;
      display: flex;
      font-size: 16px;
    }
  }
}
</style>
