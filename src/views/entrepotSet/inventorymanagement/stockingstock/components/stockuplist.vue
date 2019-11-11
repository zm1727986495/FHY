<template>
  <div class="stockuplist">
    <!-- 查询 -->
    <div class="btn-list">
      <div v-for="(item,index) in btnList" :key="index">
        <el-button
          size="small"
          class="button-96"
          :class="{'allocationclas': item.type == 6}"
          v-if="btnJurisdiction[item.jurisdiction]"
          @click="butGroupAction(item.type)"
        >{{item.name}}</el-button>
      </div>
    </div>
    <!-- 列表 -->
    <div class="m-top10">
      <div class="stockupform">
        <div class="table_list lvs attribute" v-loading='loading'>
          <el-table
            border
            style="width: 100%"
            :max-height="maxHeight"
            @select="selectfun"
            @select-all="selectall"
            @selection-change="handleSelectionChange"
            :row-class-name="tableRowClassName"
            :data="tableData"
            ref="multipleTable"
          >
            <el-table-column align="center" type="selection" fixed="left"></el-table-column>
            <el-table-column align="center" prop="storageName" label="所属仓库" sortable width="120" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="commodityNumber" label="货号" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="commodityModel" label="商品型号" width="140" show-overflow-tooltip></el-table-column>
            <!-- <el-table-column align="center" prop="commodityName" label="商品名称" width="180" show-overflow-tooltip>
              <template slot-scope="scope">
                <div class="process_name">
                  <div style="width:150px;overflow: hidden;text-overflow:ellipsis;white-space: nowrap;">{{scope.row.commodityName}}</div>
                  <div>
                    <p class="tradename" v-if="scope.row.status==2||scope.row.status==3">滞</p>
                  </div>
                </div>
              </template>
            </el-table-column> -->
            <el-table-column align="center" prop="commodityName" label="商品名称" width="140" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="colourName" label="商品颜色" width="140" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="classifyName" label="商品分类" width="140" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="commodityUnit" label="计量单位" width="80"></el-table-column>
            <el-table-column align="center" prop="newProductAvailableInventory" label="实际库存" width="80"></el-table-column>
            <el-table-column align="center" prop="newProductAvailableInventory" label="新品可用库存" width="110">
              <template slot-scope="scope">
                <div class="table_action_span" @click="detailfun(scope.row, 1)">{{scope.row.newProductAvailableInventory}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="takeInventory" label="占用库存" width="80">
              <template slot-scope="scope">
                <div class="table_action_span" @click="detailfun(scope.row, 2)">{{scope.row.takeInventory}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="inventoryIsDeducted" label="暂扣库存" width="80">
              <template slot-scope="scope">
                <div class="table_action_span" @click="detailfun(scope.row, 4)">{{scope.row.secondaryAvailableStock}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="storeInventory" label="门店暂存数量" width="110">
              <template slot-scope="scope">
                <div class="table_action_span" @click="detailfun(scope.row, 5)">{{scope.row.storeInventory}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="inventorySample" label="样品库存" width="80">
              <template slot-scope="scope">
                <div class="table_action_span" @click="detailfun(scope.row, 6)">{{scope.row.inventorySample}}</div>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="costing" label="移动平均价" width="100"></el-table-column>
            <el-table-column align="center" prop="seriousUpperLimit" label="库存上限" width="80"></el-table-column>
            <el-table-column align="center" prop="warningLowerLimit" label="库存下限" width="80"></el-table-column>
            <el-table-column align="center" prop="commodityCode" label="商品编码" width="120" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="brandName" label="品牌" width="100"></el-table-column>
            <el-table-column align="center" prop="categoryName" label="品类" width="100" show-overflow-tooltip></el-table-column>
            <el-table-column align="center" prop="libraryOfAge" label="库龄" width="80"></el-table-column>
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
        <!-- 详情 -->
        <div>
          <el-dialog :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
            <div class="titlecals">详情</div>
            <tradenassembly :shopdata="shopdata"></tradenassembly>
            <span slot="footer" class="dialog-footer">
              <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
          </el-dialog>
        </div>
        <!-- 借货 -->
        <div>
          <el-dialog :visible.sync="borrowVisible" width="50%" :before-close="handleClose">
            <div class="titlecals">借货</div>
            <borrowDialog></borrowDialog>
            <span slot="footer" class="dialog-footer">
              <el-button @click="borrowVisible = false">取 消</el-button>
            </span>
          </el-dialog>
        </div>
        <!-- 表格内查看详情组件 -->
        <div>
          <stockdia v-if="isStock" :dialogVisible="isStock" :fromdata="fromdata" :indexs="indexs" @closebox="closebox"></stockdia>
        </div>
      </div>
    </div>
    <!-- 拆件 -->
    <div>
      <detachableparts
        v-if="outerVisible"
        :skuGoodsId="skuGoodsId"
        :storageId="storageId"
        :outerVisible="outerVisible"
        @outerVisibleFun="outerVisibleFun"
      ></detachableparts>
    </div>
    <!-- 组套 -->
    <div>
      <!-- <setofsets v-if="setofsetsVisible" ref="setofsets" :outerVisible="setofsetsVisible" @outerVisibleFun="outerVisibleFun"></setofsets> -->
    </div>
    <!-- 货位分配 -->
    <div v-if="isFlag">
      <allocationDialog :isFlag="isFlag" :idlist="idlist" :storageIds="storageIds" @cancalfun="cancalfun"></allocationDialog>
    </div>
    <!-- 转订单 -->
    <div v-if="isOrder">
      <ordertransfer :orderstoragedata="orderstoragedata" :outerVisible="isOrder" @outerVisibleFun="outerVisibleFun"></ordertransfer>
    </div>
  </div>
</template>
<script>
import detachableparts from "./detachableparts";
import setofsets from "./setofsets";
import allocationstock from "./allocationstock";
import allocationDialog from "./allocationDialog";
import ordertransfer from "./ordertransfer";
import pagination from "@/views/components/pagination";
import tradenassembly from "./tradenassembly";
import borrowDialog from "./borrowDialog";
import stockdia from "../dialogfile/stockdia";
import { mapGetters } from "vuex";
import { listGoodsByPage } from "api/entrepotSet/inventorymanagement/stockingstock/stockingstock.js";
import module from "../../../../../../config/index.js";
export default {
  components: {
    detachableparts,
    setofsets,
    allocationstock,
    allocationDialog,
    ordertransfer,
    stockdia,
    borrowDialog,
    tradenassembly,
    pagination
  },
  props:['bindInfo'],
  data() {
    return {
      idlist: "", //货位分配接口参数传递
      storageIds: "", //仓库id
      tableSelectList: [], //选中列表
      shopdata: "", //商品详情组件参数
      fromdata: {}, //查看表格详情组件需要的字段
      loading:true,
      btnList: [
        { name: "导出", type: 0, jurisdiction: "stockingstock_export" },
        { name: "拆件", type: 1, jurisdiction: "stockingstock_dismantle" },
        { name: "组套", type: 2, jurisdiction: "stockingstock_stack" },
        {
          name: "货位分配",
          type: 3,
          jurisdiction: "stockingstock_distribution"
        },
        { name: "转订单", type: 4, jurisdiction: "stockingstock_transferorder" }
      ],
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      tableData: [],//列表
      outerVisible: false, //拆件
      setofsetsVisible: false, //组套
      isShow: false, //货位分配
      isOrder: false, //转订单
      isFlag: false,
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
      skuGoodsId: "", //skuID
      storageId: "", //仓库ID
      dialogVisible: false, //详情
      borrowVisible: false,//借货
      isActual: false,
      isStock: false,
      indexs: 0,
      orderId: "",
      orderstoragedata: {}
    };
  },
  computed: {
    ...mapGetters(["maxHeight"])
  },
  mounted() {
    this.getData();
  },
  methods: {
    selectproving() {
      if (this.tableSelectList.length > 1) {
        this.$message.warning("只能选择一个订单");
        return false;
      } else if (this.tableSelectList.length < 1) {
        this.$message.warning("请选择订单");
        return false;
      }
      return true;
    },
    //获取备货列表
    getData(obj = {},type) {
      if(type==1){
        this.currentPage = 1;
      }
      let data = {
        ...obj,
        page: this.currentPage,
        limit: this.pageSize
      };
      this.loading = true;
      listGoodsByPage(data)
        .then(res => {
          if(res.status==200){
            this.tableData = res.data.rows;
            this.total = res.data.total;
            this.loading = false;
          }else{
            this.loading = false;
          }
        })
        .catch(error => {
          this.loading = false;
          console.error("获取备货列表", error);
        });
    },
    //点击按钮组
    butGroupAction(type) {
      if(type != 0){
        if (!this.changefun()) {
          return false;
        }
      }
      if (type == 0) {
        console.log("导出");
        let str = module.dev.proxyTable["/api"].target + "/api/pc/stockUpGoods/exportStockUpGoods";
        window.location.href = str;
      } else if (type == 1) {
        //拆件***********************
        if (this.selectproving()) {
          this.outerVisible = true;
          this.storageId = this.tableSelectList[0].storageId;
          this.skuGoodsId = this.tableSelectList[0].skuGoodsId;
        }
      } else if (type == 2) {
        //组套**********************
        let commodityNumber = this.tableSelectList[0].commodityNumber; //货号
        let commodityUnit = []; // 单位
        let ary = []; //仓库
        let arr = []; //skuGoodsId
        let numList = [];
        this.tableSelectList.forEach(item => {
          arr.push(item.skuGoodsId);
          ary.push(item.storageId);
          numList.push(item.commodityNumber)
        });
        let isNumber = this.tableSelectList.every(item=>{
          return commodityNumber == item.commodityNumber
        });
        let flag = Math.max.apply(null, ary) == Math.min.apply(null, ary);
        let isPiece = this.tableSelectList.every(item=>{
          return item.commodityUnit == '件' || item.commodityUnit == '个';
        });
        
        if(!flag){
          this.$message.error('当前仓库不同!')
          return
        }
        if(!isNumber){
          this.$message.error('当前货号不同!')
          return
        }
        if(!isPiece){
          this.$message.error('当前单位有不是件或者个!')
          return
        }


        this.$router.push({path:'setofsets',query:{
          skuGoodsIds:arr.join(','),
          storageId: ary[0],
          commodityNumber:numList[0],
        }})

      } else if (type == 3) {
        // 货位分配********************
        if(this.tableSelectList.length > 1){
          this.$message.error('只能勾选一个！')
          return
        }
        let strdata = [];
        this.tableSelectList.forEach(itm => {
          strdata.push(itm.skuGoodsId);
        });
        this.idlist = strdata.join(',');
        this.storageIds = this.tableSelectList[0].storageId;
        this.isFlag = true;
      } else if (type == 4) {
        // 转订单***********************
        if (this.selectproving()) {
          // this.isOrder = true;
          this.$router.push({
            path: "transferorder",
            query: {
              skuGoodsId: this.tableSelectList[0].skuGoodsId,
              storageId: this.tableSelectList[0].storageId,
              
            }
          });
        }
      }
    },
    changefun() {
      if (this.tableSelectList.length === 0) {
        this.$message({
          message: "请选择备货单",
          type: "warning"
        });
        return false;
      } else {
        return true;
      }
    },
    selectall(selection) {
      // for (var i = 0; i < selection.length - 1; i++) {
      //   if (selection[i].storageId !== selection[i + 1].storageId) {
      //     this.$message.warning("请选择相同仓库的订单");
      //     this.$refs.multipleTable.clearSelection();
      //   }
      // }
      console.log(this.tableSelectList);
    },
    // 单选判断只能勾选相同仓库
    selectfun(selection, row) {
      // if (this.tableSelectList.length > 1) {
      //   let data = this.tableSelectList.every(item => {
      //     return item.storageId === row.storageId;
      //   });
      //   console.log(data);
      //   if (!data) {
      //     this.$message.warning("请选择相同仓库的订单");
      //     this.$refs.multipleTable.toggleRowSelection(row);
      //   }
      // }
    },
    handleSelectionChange(val) {
      // console.log(val,222222)
      this.tableSelectList = val;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getData(this.bindInfo);
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getData(this.bindInfo);
    },
    //点击商品名称内容
    tradenameFun(data) {
      this.shopdata = data.skuGoodsId;
      this.dialogVisible = true;
    },
    //关闭货位分配弹框
    cancalfun() {
      this.isFlag = false;
    },
    //关闭弹框
    handleClose() {
      this.dialogVisible = false;
    },
    //点击列表借
    borrow() {
      this.borrowVisible = true;
    },
    // 表格内查看内容
    detailfun(data, index) {
      let fromdata = {
        storageId: data.storageId,
        skuGoodsId: data.skuGoodsId,
        inventoryType: index
      };
      this.fromdata = fromdata;
      this.indexs = index;
      this.isStock = true;
    },
    closebox() {
      this.isActual = false;
      this.isStock = false;
    },
    //关闭弹窗
    outerVisibleFun() {
      this.outerVisible = false;
      this.setofsetsVisible = false;
      this.isOrder = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.stockuplist {
  .btn-list {
    position: relative;
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
    > div {
      margin: 5px;
    }
  }
  .stockupform {
    .nameFun {
      cursor: pointer;
    }
    .process_name {
      display: flex;
      justify-content: space-around;
      align-items: center;
      > p {
        flex: 1;
      }
      > div {
        width: 25px;
      }
    }
    .tradename {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #990000;
      color: #fff;
      line-height: 20px;
      text-align: center;
    }
    .borrow {
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: #ffa847;
      color: #fff;
      line-height: 20px;
      text-align: center;
      cursor: pointer;
    }
    .labelicon {
      padding: 2px 0px;
      background: red;
      color: #ffffff;
      font-size: 12px;
      position: relative;
      width: 130px;
    }
    .labelI::after {
      display: block;
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-right: 15px solid transparent;
      border-left: 16px solid transparent;
      border-bottom: 10px solid #ff0000;
      bottom: 9px;
      right: -20px;
      transform: rotate(90deg);
    }
    .labelicon2 {
      padding: 2px 0px;
      background: #ffa847;
      color: #ffffff;
      font-size: 12px;
      position: relative;
      width: 130px;
    }
    .labelI2::after {
      display: block;
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-right: 15px solid transparent;
      border-left: 16px solid transparent;
      border-bottom: 10px solid #ffa847;
      bottom: 9px;
      right: -20px;
      transform: rotate(90deg);
    }
    .labelicon4 {
      padding: 2px 0px;
      background: #1abc9c;
      color: #ffffff;
      font-size: 12px;
      position: relative;
      width: 130px;
    }
    .labelI4::after {
      display: block;
      content: "";
      position: absolute;
      width: 0;
      height: 0;
      border-right: 15px solid transparent;
      border-left: 16px solid transparent;
      border-bottom: 10px solid #1abc9c;
      bottom: 9px;
      right: -20px;
      transform: rotate(90deg);
    }
    .typeBg {
      display: flex;
      justify-content: center;
    }
  }
}
</style>
