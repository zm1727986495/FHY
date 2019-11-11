<template>
  <div class="stockallocation">
    <!-- 导航栏 -->
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <!-- {{checkboxs}}
    {{numbers}} -->
    <el-card>
      <div class="titlecals">采购单</div>
      <ul class="selecthuoqu m-top10">
        <li class="allocationclas">
          <el-button type="primary" size="medium" @click.stop="changehw">选择货区货位</el-button>
          <!-- 选择货区 -->
          <allocationstock :storageIds="storageIds" :numbers="numbers" :checkboxs="checkboxs"
            :isShow="isShow" class="allocationbox" @closeallocation="closeallocation">
          </allocationstock>
        </li>
      </ul>
      <!-- 定制品 -->
      <div class="orderList">
        <el-checkbox class="m-left10 m-bottom10" v-model="Allelection" v-if="dataList.length!==0" @change="checkAll">全选</el-checkbox>
        <div v-for="(item,index) in dataList" :key="index">
          <div class="order_item m-bottom" v-if="item.unpackingDataVOS.length!==0">
            <div class="item_header">
              <el-checkbox class="m-left10" v-model="item.checked" @change="checkfather(index)"></el-checkbox>
              <div class="purchase">
                <span class="span_title">采购单号：</span>
                <span>{{item.purchaseNumber}}</span>
              </div>
            </div>
            <div class="item_body">
              <div class="item_div">
                <ul>
                  <li><span>名称</span></li>
                  <li><span>数量</span></li>
                  <li class="item_tiele textAl"><div class="li_detail1">详情</div></li>
                </ul>
                <ul v-for="(pro,i) in item.unpackingDataVOS" :key="i">
                  <li><span class="li_pro">
                    <el-checkbox @change="checkChild(index,i)" v-model="pro.checked">{{pro.unpackingName}}</el-checkbox>
                    </span></li>
                  <li><span class="li_pro">{{pro.inventoryNumberSum}}</span></li>
                  <li class="item_tiele">
                    <div class="li_detail2" v-for="(attr,k) in pro.storageSiteVOS" :key="k">
                      <div class="details">
                          <el-checkbox @change="detilcheck(index, i, k)" v-model="attr.checked"> {{attr.siteCode}}</el-checkbox>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- 商品 -->
      <div>
        <div class="titlecals">成品列表</div>
        <el-table border ref="multipleTable" :row-class-name="tableRowClassName" @select="selectfun" 
          @select-all="selectall" :data="shoplist" @selection-change="handleSelectionChange">
          <el-table-column type="selection" align="center" fixed width="55"></el-table-column>
          <el-table-column align="center" prop="purchaseNumber" label="采购单号" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="commodityName" label="名称" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="categoryName" label="商品分类" width="120" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="regionName" label="货位" width="140" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="inventoryNumber" label="数量" width="80"></el-table-column>
        </el-table>
      </div>
      
      <!-- 分配到的新货区货位 -->
      <div class="boxmar lvs">
        <div class="titlecals">新定制品货区货位</div>
        <el-table border :row-class-name="tableRowClassName" ref="datassss" :data="regionSlist">
          <el-table-column align="center" prop="purchaseNumber" label="采购单号"></el-table-column>
          <el-table-column align="center" prop="unpackingName" label="商品名称"></el-table-column>
          <el-table-column align="center" prop="regionSiteName" label="货区货位"></el-table-column>
          <el-table-column align="center" prop="inventoryNumber" label="数量"></el-table-column>
        </el-table>
      </div>
      <div>
        <div class="titlecals">新商品货区货位</div>
        <el-table border ref="tabledatass" :row-class-name="tableRowClassName" :data="tableSelectList2">
          <el-table-column align="center" prop="purchaseNumber" label="采购单号"></el-table-column>
          <el-table-column align="center" prop="commodityName" label="名称" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="categoryName" label="商品分类"></el-table-column>
          <el-table-column align="center" prop="regionName" label="货位" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="inventoryNumber" label="数量"></el-table-column>
        </el-table>
      </div>
      <div class="disfle">
        <div></div>
        <div>
          <el-button @click="closekhdia" size="medium">取消</el-button>
          <el-button type="primary" size="medium" :loading="loadingBtn" @click="submitbtn">提交</el-button>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import allocationstock from "../stockingstock/components/allocationstock";
import breadcrumb from "@/views/components/breadcrumb";
import { listStoragePurchaseOrderSite, editInventoryPurchasePackageDetail } from "api/entrepotSet/inventorymanagement/orderInventory/orderInventory";
import { error, log } from "util";
export default {
  components:{
    breadcrumb,
    allocationstock,
  },
  data() {
    return {
      regionSlist: [],//采购单集合
      shoplist: [],//商品集合
      tableSelectList: [],//商品选中
      tableSelectList2: [],//分配后的商品集合
      shoplists: {
        siteNumberList: [],//要添加的定制品货位与数量
        tempList: [],//要修改的定制品货位与数量
        inventoryGoodsList: [],//分配新的货位商品
        allotGoodsList: [],//分配过的货位商品
      },//存放每次操作的商品集合
      changeshoplist: [],//存放选中商品
      storageIds: this.$route.query.storageId,
      isShow: false,
      navList: [],
      dataList: [],
      tableData: [],
      orderId: this.$route.query.orderId,
      numbers: 0,//选择商品的总数量
      checkboxs: false,//是否勾选多个商品
      loadingBtn:false
    };
  },
  mounted() {
    this.navList = this.$route.meta;
    this.gerlistOrder();

    let that = this
    document.addEventListener("click", function(e) {
      if (e.target.className.indexOf("allocationclas") === -1) {
        that.isShow = false;
      }
    });
  },
  methods: {
    // 全选
    checkAll(val) {
      let arr = [];
      this.dataList.forEach(item => {
        arr.push(item)
      })
      console.log(arr)
    },
    selectall(selection) {
      this.shoplist.forEach(item=>{
        if(item.inventoryNumber == 0){
          this.$message.warning("商品数量不能为0");
          this.$refs.multipleTable.clearSelection();
        }
      })
    },
    // 单选判断只能勾选相同仓库
    selectfun(selection, row) {
      if(row.inventoryNumber == 0){
        this.$message.warning("商品数量不能为0");
        this.$refs.multipleTable.toggleRowSelection(row);
      }
    },
    // 成品数据选中
    handleSelectionChange(val) {
      this.tableSelectList = val
    },
    // 提交分配货区货位
    submitbtn(){
      // this.tableSelectList.length == 0
      if(this.regionSlist.length == 0 && this.tableSelectList2.length == 0){
        this.$message.warning("请分配货区货位");
        return false
      }
      let data = {
        siteNumberList: [],//要添加的定制品货位与数量
        tempList: [],//要修改的定制品货位与数量
        inventoryGoodsList: [],//分配新的货位商品
        allotGoodsList: [],//分配过的货位商品
      }
      //要添加的定制品货位与数量
      this.regionSlist.forEach(item =>{
        let obj = {
          // inventoryPurchasePackageDetailId: item.inventoryPurchasePackageDetailId,
          inventoryPurchasePackageId: item.inventoryPurchasePackageId,
          regionId: item.regionId,
          siteId: item.siteId,
          storageId: item.storageId,
          inventoryStatus: 1,
          inventoryNumber: item.inventoryNumber,
        }
        data.siteNumberList.push(obj)
      })
      //要修改的定制品货位与数量
      this.dataList.forEach(item =>{
        item.unpackingDataVOS.forEach(itm =>{
          itm.storageSiteVOS.forEach((datas) =>{
            let obj = {
              inventoryPurchasePackageDetailId: datas.inventoryPurchasePackageDetailId,
              inventoryPurchasePackageId: itm.inventoryPurchasePackageId,
              inventoryNumber: datas.inventoryNumber,
              inventoryStatus: 1,
            }
            if(datas.change){
              data.tempList.push(obj)
            }
          })
        })
      })
      if(this.shoplist && this.shoplist.length != 0){
        this.shoplist.forEach(item =>{
          if(item.change){
            let obj = {
              storagePurchaseOrderId: item.storagePurchaseOrderId,//库存采购单id
              inventoryGoodsId: item.inventoryGoodsId,//库存商品ID
              storageId: item.storageId,
              regionId: item.regionId,
              siteId: item.siteId,
              skuGoodsId: item.skuGoodsId,
              inventoryNumber: item.inventoryNumber,
              inventoryType: item.inventoryType,
              availableAmount: item.availableAmount,
              costing: item.costing,
              storeId: item.storeId,
              piece: item.piece,
            }
            data.inventoryGoodsList.push(obj)
          }
        })
      }
      this.tableSelectList2.forEach(item =>{
        let obj = {
          storagePurchaseOrderId: item.storagePurchaseOrderId,//库存采购单id
          inventoryGoodsId: item.inventoryGoodsId,//库存商品ID
          storageId: item.storageId,
          regionId: item.regionId,
          siteId: item.siteId,
          skuGoodsId: item.skuGoodsId,
          inventoryNumber: item.inventoryNumber,
          inventoryType: item.inventoryType,
          availableAmount: item.availableAmount,
          costing: item.costing,
          storeId: item.storeId,
          piece: item.piece,
        }
        data.allotGoodsList.push(obj)
      })
      console.log(data);
      this.loadingBtn = true;
      editInventoryPurchasePackageDetail(data).then(res => {
        console.log(res);
        if(res.status == 200){
          this.$message.success("操作成功!")
          this.loadingBtn = false;
          this.$router.push({path: "/inventorymanagement/orderInventory"})
        }else{
          this.loadingBtn = false;
        }
      }).catch(error => {
        this.loadingBtn = false;
        console.error("获取备货列表", error);
      });
    },
    // 点击详情勾选
    detilcheck(index, i, k){
      this.dataList[index].unpackingDataVOS[i].checked = this.dataList[index].unpackingDataVOS[i].storageSiteVOS.every(item => {
        return item.checked;
      });
    },
    //点击子选框
    checkChild(index, i) {
      let flag = this.dataList[index].unpackingDataVOS.every(item => {
        return item.checked;
      });
      this.dataList[index].checked = flag;
      this.dataList[index].unpackingDataVOS[i].storageSiteVOS.forEach(item =>{
        item.checked = this.dataList[index].unpackingDataVOS[i].checked
      })
    },
    // 选择获取货位 获取分配数量
    changehw(){
      this.changeshoplist = []
      this.numbers = 0//勾选所有商品数量
      let num = 0;//是否只勾选了一个商品
      // 添加订制品集合
      this.dataList.forEach(item =>{
        item.unpackingDataVOS.forEach(itm =>{
          itm.storageSiteVOS.forEach(val =>{
            if(val.checked){
              val.change = true;
              this.numbers = this.numbers + val.inventoryNumber;
              num++
            }
          })
        })
      })
      // 商品集合
      this.tableSelectList.forEach(item =>{
        num++
        this.numbers = this.numbers + item.inventoryNumber;
      })
      this.checkboxs = num > 1;
      if(this.numbers == 0){
        this.$message.error("请选择商品")
      }else{
        this.isShow = !this.isShow;
      }
    },
    // 触发分配货区货位
    closeallocation(val) {
      console.log(this.shoplist);
      // val.regionId//货区id
      // val.siteId//货位id
      // val.numberval//要分配的数量
      console.log(val,"===================");
      // 定制品数据
      this.dataList.forEach(item =>{
        item.unpackingDataVOS.forEach(itm =>{
          let obj = {}
          let num = 0;
          itm.storageSiteVOS.forEach(datas =>{
            if(datas.checked){
              if(!this.checkboxs){
                num = val.numberval
              }else{
                num = num + datas.inventoryNumber
              }
              obj = {//要添加的定制品货位与数量
                purchaseNumber: item.purchaseNumber,//采购单号
                inventoryPurchasePackageId: itm.inventoryPurchasePackageId,//库存采购单包ID
                inventoryPurchasePackageDetailId: datas.inventoryPurchasePackageDetailId,//库存采购单包ID明细
                regionId: val.regionId,//货区id
                siteId: val.siteId,//货位id
                storageId: val.storageId,//货位id
                regionSiteName: val.regionSiteName,//货区货位
                unpackingName: itm.unpackingName,//商品名称
                unpackingId: itm.unpackingId,//商品id
                inventoryStatus: 1,//库存状态（1 可用）
                inventoryNumber: num,//库存数量
              }
            }
          })
          if(num > 0){
            if(this.regionSlist.length > 0){
              this.regionSlist.forEach(items =>{
                // 判断采购单号、包id、货区货位id一致 数量递增
                if(item.purchaseNumber == items.purchaseNumber && 
                  itm.inventoryPurchasePackageId == items.inventoryPurchasePackageId && 
                  items.regionId == val.regionId && items.siteId == val.siteId) {
                    items.inventoryNumber = items.inventoryNumber + num
                }
              })
              let deng = this.regionSlist.every(items =>{
                // 判断采购单号、包id、货区货位id一致 数量递增
                return item.purchaseNumber != items.purchaseNumber || 
                itm.inventoryPurchasePackageId != items.inventoryPurchasePackageId || 
                items.regionId != val.regionId || items.siteId != val.siteId
              })
              if(deng){
                this.regionSlist.push(obj)
              }
            }else{
              this.regionSlist.push(obj)
            }
          }
        })
      })

      // 操作原列表
      let numinp = val.numberval
      // 勾选一个的时候
      this.dataList.forEach(item =>{
        item.unpackingDataVOS.forEach(itm =>{
          itm.storageSiteVOS.forEach((datas) =>{
            if(datas.checked){
              if(!this.checkboxs){
                datas.inventoryNumber = datas.inventoryNumber - numinp
              }else{
                datas.inventoryNumber = 0
              }
            }
          })
        })
      })

      // 商品数据
      if(!this.checkboxs && this.tableSelectList[0].inventoryNumber < val.numberval){
        console.log("111111");
        this.$message.warning("请输入正确数量")
      }else{
        console.log("222222");
        let num =0;
        this.tableSelectList.forEach(item =>{
          let inventoryGoodsswait = this.tableSelectList2.some(itms =>{
            return item.inventoryGoodsId == itms.inventoryGoodsId && item.skuGoodsId == itms.skuGoodsId &&
            item.regionId == itms.regionId && item.siteId == itms.siteId
          })
          if(inventoryGoodsswait){
            this.tableSelectList2.forEach(itms =>{
              if(item.inventoryGoodsId == itms.inventoryGoodsId){
                if(!this.checkboxs){
                  itms.inventoryNumber+=val.numberval
                  item.inventoryNumber = item.inventoryNumber - val.numberval
                }else{
                  itms.inventoryNumber+=item.inventoryNumber
                  item.inventoryNumber = 0
                }
                item.change = true
              }
            })
          }else{
            if(!this.checkboxs){
              this.tableSelectList2.push({
                ...item,inventoryNumber: val.numberval,
                regionId: val.regionId,//货区id
                siteId: val.siteId,//货位id
                storageId: val.storageId,//货位id
                regionName: val.regionSiteName,//货区货位
              })
              item.inventoryNumber = item.inventoryNumber - val.numberval
            }else{
              this.tableSelectList2.push({
                ...item,
                regionId: val.regionId,//货区id
                siteId: val.siteId,//货位id
                storageId: val.storageId,//货位id
                regionName: val.regionSiteName,//货区货位
              })
              item.inventoryNumber = 0
            }
            item.change = true
            // this.tableSelectList.forEach(item =>{
              
            // })
          }
        })
      }
      console.log(this.shoplist);
      
      this.$refs.multipleTable.clearSelection();
      this.isShow = false;
    },
    //父复选框
    checkfather(idx) {
      this.dataList[idx].unpackingDataVOS.forEach(item =>{
        item.checked = this.dataList[idx].checked
        item.storageSiteVOS.forEach(itm =>{
          itm.checked = item.checked
        })
      })

      // console.log(this.$refs['tabledatass'+idx]);
    },
    closekhdia(){
      this.$router.push({path: "/inventorymanagement/orderInventory"});
    },
    //初始化订单采购单数据
    gerlistOrder() {
      let data = {
        orderId: this.orderId
      };
      listStoragePurchaseOrderSite(data).then(res => {
        this.shoplist = res.data.goodsList
        this.dataList = res.data.packageList.map(item => {
          if(!item.unpackingDataVOS){
            item.unpackingDataVOS = []
          }
          item.unpackingDataVOS = item.unpackingDataVOS.map(attr => {
            attr.storageSiteVOS = attr.storageSiteVOS.map(val =>{
              return { checked: false, ...val }
            })
            return { checked: false, cargoList: [], ...attr };
          });
          return { checked: false, ...item };
        });
      }).catch(error => {
        console.error("订单采购单的货区货位", error);
      });
    },
    orderData() {
      //处理货区货位数据
      let ary = [];
      this.dataList.forEach(item => {
        if (item.checked) {
          //处理采购下包的数据
          let obj = {};
          let asy = [];
          obj.storagePurchaseOrderId = item.storagePurchaseOrderId;
          obj.deliveryNumber = item.deliveryNumber;
          if (item.unpackingDataVOS.length !== 0) {
            let DataVOtotal = 0; //包总数量
            item.unpackingDataVOS.forEach(attr => {
              let DataVOSum = 0; //包数量
              let sto = [];
              let os = {};
              os.inventoryPurchasePackageId = attr.inventoryPurchasePackageId;
              attr.storageSiteVOS.forEach(key => {
                sto.push({
                  inventoryPurchasePackageDetailId:
                    key.inventoryPurchasePackageDetailId,
                  inventoryNumber: key.inventoryNumber
                });
                DataVOSum += key.inventoryNumber;
              });
              os.storageSiteVOS = sto;
              os.outboundNumber = DataVOSum;
              DataVOtotal += os.outboundNumber;
              asy.push(os);
            });
            obj.deliveryNumber = DataVOtotal;
            obj.unpackingDataVOS = asy;
          } else {
            //处理采购下商品的数据
            let GoodsVOSum = 0; //商品总数量
            let invent = [];
            item.inventoryGoodsVOS.forEach(attr => {
              invent.push({
                inventoryGoodsId: attr.inventoryGoodsId,
                inventoryNumber: attr.inventoryNumber
              });
              GoodsVOSum += attr.inventoryNumber;
            });
            obj.commoditySKUVOS = invent;
            obj.deliveryNumber = GoodsVOSum;
          }
          ary.push(obj);
        }
      });
      console.log(ary);

      return ary;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  },
  computed: {
    Allelection: {
      get() {
        let str = this.dataList.every(item => {
          return item.checked;
        });
        return str;
      },
      set(val) {
        this.dataList.forEach(item => {
          item.checked = val;
          item.unpackingDataVOS.forEach(attr => {
            attr.checked = item.checked;
            attr.storageSiteVOS.forEach(sta =>{
              sta.checked = attr.checked
            })
          });
        });
      }
    },
  },
};
</script>
<style lang="scss" scoped>
.stockallocation {
  .m-bottom10{
    margin-bottom: 10px;
  }
  .titlecals{
    top: 0;
  }
  .purchase {
    min-width: 400px;
  }
  .conetBox {
    padding: 0 20px;
  }
  .details {
    display: flex;
    width: 100%;
    padding: 10px;
    text-align: center;
    .left {
      width: 150px;
      text-align: center;
      color: #409eff;
    }
    .center {
      width: 100%;
      text-align: center;
      color: #409eff;
    }
    .right {
      width: 100px;
      text-align: left;
      color: #409eff;
    }
  }
  .item_header {
    > span {
      width: 80px;
    }
    background-color: #F5F7FA;
    height: 50px;
    line-height: 50px;
    display: flex;
    flex-wrap: nowrap;
    div {
      // width: 25%;
      .span_title {
        font-weight: bold;
      }
    }
  }
  .orderList {
    font-size: 14px;
    // max-height: 710px;
    .order_item {
      width: 100%;
      border: 1px solid #EBEEF5;

      .item_body {
        max-height: 400px;
        overflow-y: auto;
        overflow-x: auto;
        .item_div {
          display: flex;
          flex-wrap: nowrap;
          ul {
            border-right: 1px solid #EBEEF5;
            .item_tiele {
              height: calc(100% - 90px);
            }
            .textAl {
              display: flex;
              align-items: center;
            }
          }
          li {
            border-bottom: 1px solid #EBEEF5;
            &:last-of-type{
              border: none;
            }
          }
          span {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 80px;
            height: 30px;
          }
          .li_detail1 {
            display: flex;
            justify-content: center;
            align-items: center;
            flex: 1;
          }
          .li_pro {
            display: flex;
            width: 150px;
            text-align: center;
          }
          .li_detail2 {
            min-width: 150px;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }
  .boxmar{
    margin: 20px 0px;
  }
  .selecthuoqu{
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
  }
  .allocationclas {
    position: relative;
    .allocationbox {
      z-index: 999;
      position: absolute;
      top: 50px;
      left: 50%;
      transform: translateX(-50%);
    }
  }
  .disfle{
    display: flex;
    justify-content: space-between;
  }
}
</style>
