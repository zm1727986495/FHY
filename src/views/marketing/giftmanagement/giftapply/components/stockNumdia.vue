<template>
  <!-- 新增礼品申请页面的礼品库存数弹出框 -->
  <div class="stockNumdia">
    <el-dialog title="填写领用数量" :visible="visible" width="950px" :before-close="closeFn"
    custom-class="customDialogTitle" :close-on-press-escape="false" :close-on-click-modal="false">
      <div class="search_item_list table_list lvs attribute">
        <el-table border :row-class-name="tableRowClassName" :data="rowObj.HtmlDTOList">
          <el-table-column prop="commodityName" align="center" label="商品名称" sortable></el-table-column>
          <el-table-column prop="storageName" align="center" label="所属仓库" sortable></el-table-column>
          <!-- <el-table-column prop="siteCode" align="center" label="货位编号" sortable></el-table-column> -->
          <el-table-column prop="inventoryNumber" align="center" label="数量" sortable></el-table-column>
          <el-table-column width="200px" prop="receiveNumber" align="center" label="申请领用数量" sortable>
            <template slot-scope="scope">
              <el-input-number v-model="scope.row.receiveNumber" :min="0" :max="scope.row.inventoryNumber"></el-input-number>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="btn_fotter">
        <el-button @click="handleClose" type="primary">确 定</el-button>
        <el-button @click="closeFn">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    return {
      dest:[],
    };
  },
  methods: {
    closeFn(){
      this.$emit('close_num')
    },
    //关闭验证
    handleClose() {
      //item.inventoryNumber  数量  item.receiveNumber    申请数量
      let sum = 0;
      this.rowObj.HtmlDTOList.forEach(item => {
        sum = Number(item.receiveNumber) + sum*1;
      });
      this.rowObj.number = sum;
      // console.log("this.rowObj.inventoryGoodsDTOList后台返回的弹出框的根据货区货位展示的tablist");
      // console.log(this.rowObj.inventoryGoodsDTOList);
      // console.log("this.rowObj.HtmlDTOList处理后的根据仓库在页面展示用的tablist");
      // console.log(this.rowObj.HtmlDTOList);
      let actualArr = this.rowObj.HtmlDTOList.map(item=>{
        return item.receiveNumber;
      });
      this.rowObj.HtmlDTOList.forEach((item,index)=>{
        this.deductionFun(actualArr[index],item);
      })
      this.$emit("close_num");
      // console.log("-----this.rowObj.HtmlDTOList----------");
      // console.log(this.rowObj.HtmlDTOList);
      // console.log('-------this.rowObj.inventoryGoodsDTOList------');
      // console.log(this.rowObj.inventoryGoodsDTOList);
    },
    /**
     * 参数  
     * actuals   要扣减的数量
     * datas     数据
     */
    //扣减库存的方法 
    deductionFun(actuals,datas){
      datas.data.forEach(item=>{
        if(actuals > item.inventoryNumber){
          actuals = actuals - item.inventoryNumber;
          item.receiveNumber = item.inventoryNumber;
        }else {
          item.receiveNumber = actuals;
          actuals = 0;
        }
      })
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  },
  props: ["visible", "rowObj"],
  //初始化数据
  mounted(){
    let arr = this.rowObj.inventoryGoodsDTOList
    // console.log("this.rowObj.inventoryGoodsDTOList");
    // console.log(this.rowObj.inventoryGoodsDTOList);
    var map = {},
    dest = [];
    for(var i = 0; i < arr.length; i++){
        var ai = arr[i];
        if(!map[ai.storageId]){
            dest.push({
              commodityName:ai.commodityName,  //商品名称
              storageName:ai.storageName,      //仓库名称
              storageId: ai.storageId,         //仓库id
              receiveNumber:ai.receiveNumber,
              data: [ai]
            });
            map[ai.storageId] = ai;
        }else{
            for(var j = 0; j < dest.length; j++){
                var dj = dest[j];
                if(dj.storageId == ai.storageId){
                    dj.data.push(ai);
                    break;
                }
            }
        }
    }
    this.dest = dest;
    dest.forEach(item=>{
      let inventorysum = 0;
      let receivesum = 0;
      item.data.forEach((itemchild,index)=>{
        inventorysum = itemchild.inventoryNumber*1+inventorysum*1;
        receivesum = itemchild.receiveNumber*1+receivesum*1;
      })
      item.inventoryNumber = inventorysum;
      item.receiveNumber = receivesum;
    })
    this.$set(this.rowObj,'HtmlDTOList',dest)
  },
};
</script>
<style scoped lang='scss'>
.stockNumdia {
  .btn_fotter {
    display: flex;
    margin-top: 20px;
    flex-wrap: nowrap;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>

