<template>
  <div class="setofsets">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div>
        <div class="titlecals">组套列表</div>
        <div>
          <el-button size="small" class="button-96 m-top5" @click="addProduct">新增</el-button>
          <el-button size="small" class="button-96 m-top5" @click="deleteFn">删除</el-button>
          <el-button size="small" class="button-96 m-top5" @click="sumsetsFn">组套</el-button>
        </div>
        <div class="table_list lvs attribute m-top10">
          <el-table border @selection-change="handleSelectionChange" :row-class-name="tableRowClassName" :data="tableData" :max-height="maxHeight">
            <el-table-column align="center" type="selection" fixed="left"></el-table-column>
            <el-table-column align="center" prop="storageName" label="所属仓库" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="commodityCode" label="商品编码" sortable width="150" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="commodityName" label="商品名称" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="specification" label="商品规格" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="innerNumber" label="商品数量" width="200">
              <template slot-scope="scope">
                <div>
                  <el-input size="small" @input="quantityFn(scope.row)" v-model="scope.row.innerNumber"></el-input>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="regionSite" label="所在货位" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="inventoryNumber" label="货位数量" width="200"></el-table-column>
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

      <!-- ******* -->
      <div class="m-top50">
        <div class="titlecals">成套列表</div>
        <div class="allocationclas  m-top10">
          <el-button size="small" class="button-96 m-bottom10" @click.stop="butGroupAction">货位分配</el-button>
          <!-- 选择货区 -->
          <allocationstock
            :storageIds="storageIds"
            :numbers="numbers"
            :checkboxs="checkboxs"
            :isShow="isShow"
            class="allocationbox"
            @closeallocation="closeallocation"
          ></allocationstock>
        </div>
        <div class="table_list lvs attribute component">
          <el-table border style="width: 100%" :row-class-name="tableRowClassName" :data="tableList">
            <el-table-column align="center" type="selection"></el-table-column>
            <el-table-column align="center" prop="commodityCode" label="商品编码" sortable width="150"></el-table-column>
            <el-table-column align="center" prop="commodityName" label="商品名称" width="150" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" label="颜色" width="150">
              <template slot-scope="scope">
                <div>
                  <el-select v-model="scope.row.commodityColourId" placeholder="请选择">
                    <el-option
                      v-for="item in scope.row.colorList"
                      :key="item.colourId"
                      :label="item.colourName"
                      :value="item.colourId"
                    ></el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="receiptsNum" label="系列" width="150">
              <template slot-scope="scope">
                <div>
                  <el-select v-model="scope.row.commoditySeriesId" placeholder="请选择">
                    <el-option
                      v-for="item in scope.row.seriesList"
                      :key="item.seriesId"
                      :label="item.seriesName"
                      :value="item.seriesId"
                    ></el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="receiptsNum" label="材质" width="150">
              <template slot-scope="scope">
                <div>
                  <el-select v-model="scope.row.commodityMaterialId" placeholder="请选择">
                    <el-option
                      v-for="item in scope.row.materialList"
                      :key="item.materialId"
                      :label="item.materialName"
                      :value="item.materialId"
                    ></el-option>
                  </el-select>
                </div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="brand_name" label="品牌" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="category_name" label="品类" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="commodityModel" label="型号" width="150" show-overflow-tooltip></el-table-column>
          </el-table>
        </div>
      </div>
    </el-card>


    <!-- 新增 -->
    <newproduct v-if="dialogVisible" :dialogVisible='dialogVisible' @closeBox='closeBox' @getData='getData'></newproduct>
    <div class="foot_btn_box">
      <el-button type="primary" @click="submission" :loading="loadingBtn">提 交</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import storageassignment from "./storageassignment";
import newproduct from "./newproduct";
import pagination from "@/views/components/pagination";
import allocationstock from "./allocationstock";
import breadcrumb from "@/views/components/breadcrumb";
import selectCommodity from "@/views/components/selectCommodity";
import { mapGetters } from "vuex";
import { listStockUpGoodsByPage,saveStackDetail } from "api/entrepotSet/inventorymanagement/stockingstock/stockingstock";
import {
  listCommodityColour, // 商品颜色查询
  listCommoditySeries, // 商品系列查询
  listCommodityMaterial // 商品材质查询
} from "api/administrationCenter/stockmanagement/index";
import { getGoodsSKUId } from "api/entrepotSet/stockManagement/stockPending/stockPending";
export default {
  components: {
    storageassignment,
    pagination,
    allocationstock,
    breadcrumb,
    selectCommodity,
    newproduct
  },
  data() {
    return {
      navList:[],
      loadingBtn:false,
      dialogVisible:false,
      tableList: [], //成套列表
      tableData: [], //组套列表
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
      commodityList:[],//选择商品勾选
      tableSelectList: [],
      productList: {
        selectedCommodities: [], // 选中的商品 可不传 即 已有的table中的商品
        height: "350px", // 设置表格高度 可不传（弹出层最好传下）
        isDialog: true, // 是否为弹出层（不传默认为页面）
        isShow: true
      },
      contentText: "",
      isShow: false,
      num: 1, //数量
      checked: false,
      checkboxs: false,
      numbers: 0,
      storageIds: this.$route.query.storageId
    }
  },
  mounted() {
    this.navList = this.$route.meta;
    let that = this;
    document.addEventListener("click", function(e) {
      if (e.target.className.indexOf("allocationclas") === -1) {
        that.isShow = false;
      }
    });
    this.getData()
  },
  computed: {
    ...mapGetters(["maxHeight"])
  },
  methods: {
    // 获取列表
    getData(arr = []) {
      let { skuGoodsIds } = this.$route.query;
      if(arr.length!=0){
        skuGoodsIds = arr.join(',')
      }
      
      // let ary = [];
      // if(arr.length){
      //   ary = [...arr,...skuGoodsIds.split(',')];
      // }else{
      //   ary = skuGoodsIds.split(',');
      // }
      let data = {
        storageId:this.$route.query.storageId,
        skuGoodsIds: skuGoodsIds,
        page: this.currentPage,
        limit: this.pageSize
      };
      listStockUpGoodsByPage(data)
        .then(res => {
          if (res.status == 200) {
            this.tableData = res.data.rows;
            this.total = res.data.total;
            this.dialogVisible = false;
          }
        })
        .catch(error => {
          console.error("获取列表", error);
        });
    },
    //组套
    sumsetsFn(){
      let colorId = this.tableSelectList.map(item=>{
        return item.colourId;
      })
      let colors = Math.max.apply(null, colorId) == Math.min.apply(null, colorId);
      if(!colors){
        this.$message.error('商品颜色不同!')
        return
      }

      // let commodityId = this.tableSelectList.map(item=>{
      //   return item.commodityId
      // }).join('+');

      let commodityModels = this.tableSelectList.map(item=>{
        return item.commodityModel
      })
      let colourNames = this.tableSelectList.map(item=>{
        return item.colourName
      })
      let commoditySizes = this.tableSelectList.map(item=>{
        return item.innerNumber
      }).join(',');
      let data = {
        colourNames:"'"+colourNames.join(',')+"'",
        commoditySizes,
        commodityId:this.tableSelectList[0].commodityId,
        priceStrategyId:this.tableSelectList[0].priceStrategyId,
        itemNumber:this.tableSelectList[0].commodityNumber,
        commodityCode:this.tableSelectList[0].commodityCode,
        findCommodityModels:"'"+commodityModels.join('+')+"'",
        commodityModels:commodityModels.join('+'),
        budgetId:0
      }
      saveStackDetail(data).then(res=>{
        if(res.status == 200){
          console.log(res);
        }else{
          this.$message.error(res.message);
          
        }
      }).catch(error=>{
        console.error('组套',error);
      })
    },
    //新增
    addProduct(){
      this.dialogVisible = true;
    },
    //关闭新增弹框
    closeBox(){
      this.dialogVisible = false;
    },
    //组套列表删除
    deleteFn(){
      this.tableSelectList.forEach(item =>{
        this.tableData = this.tableData.filter(attr =>{
          return item.inventoryGoodsId != attr.inventoryGoodsId;
        })
      })
    },
    //输入数量input
    quantityFn(row) {
      row.innerNumber = row.innerNumber.replace(/[^\d]/g, "");
      if (row.innerNumber > row.inventoryNumber) {
        row.innerNumber = row.inventoryNumber;
      }
    },
    // 选择商品 勾选
    selectionChange(val) {
      this.commodityList = val;
    },
    //选择商品确定
    selectProductConfirm(){
      if(this.tableList.length > 1){
        this.$message.error('只能选择一个商品!')
        return
      }
      if(this.commodityList.length > 1){
        this.$message.error('只能勾选一个!')
      }else if(this.commodityList.length < 1){
        this.$message.error('当前没有勾选')
      }else{
        this.commodityList.forEach(item => {
          let data = {
            commodityId: item.commodityId
          };
          let p1 = new Promise((resolve, reject) => {
            listCommodityColour(data).then(attr => {
              resolve(attr);
            });
          });

          let p2 = new Promise((resolve, reject) => {
            listCommoditySeries(data).then(attr => {
              resolve(attr);
            });
          });

          let p3 = new Promise((resolve, reject) => {
            listCommodityMaterial(data).then(attr => {
              resolve(attr);
            });
          });

          Promise.all([p1, p2, p3]).then(res => {
            this.tableList.push({
              purchaseNumber: item.cancelNumber,
              inventoryNumber: 0,
              colorList: res[0].data,
              seriesList: res[1].data,
              materialList: res[2].data,
              commodityColourId:'',
              commoditySeriesId:'',
              ...item
            });
          });
          this.commodityDialog = false;
        });
      }
    },
    //提交
    submission(){
      let data = {};
      // this.tableList.forEach(item=>{
      //     data = {
      //       commodityId:item.commodityId,
      //       colourNames:item.commodityName,
      //       commodityModels:item.commodityModels,
      //       commoditySizes,
      //       itemNumber:item.commodityNumber,
      //       findCommodityModels:item.findCommodityModels,
      //       commodityCode:item.commodityCode
      //     }
      // })
    },
    //取消
    cancel(){
      this.$router.go(-1)
    },
    
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //点击分配货位
    butGroupAction() {
      this.isShow = !this.isShow;
    },
    closeallocation(val) {},
    //勾选
    handleSelectionChange(val) {
      this.tableSelectList = val;
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getData()
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getData()
    }
  }
};
</script>
<style lang="scss" scoped>
.setofsets{
  .foot_btn_box {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .titlecals{
    top: 0;
  }
  .component {
    // padding: 0 30px;
    position: relative;
  }
  .allocationclas {
    position: relative;
    button {
      // margin-left: 20px;
    }
    .allocationbox {
      z-index: 999;
      position: absolute;
      top: 35px;
      left: 70px;
      transform: translateX(-50%);
    }
}
}
//-------------
</style>
