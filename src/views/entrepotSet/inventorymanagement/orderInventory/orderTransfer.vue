<template>
  <div>
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <el-card class="box-card">
      <div class="headerStyle">采购单</div>
      <!-- 选择货区货位 -->
      <div class="btnStyle">
        <div >
            <el-button
              v-for="(item,index) in actionBtnList"
              :key="index"
              :type="item.style"
              size="small"
              class="button-96"
              style="margin:10px 20px 0 0;"
              @click="butGroupAction(item.type)"
            >{{item.name}}</el-button>
        </div>
        <div class="quantity" v-if="isFlag">
            <div class="areaorlocation">
              <ul class="areaStyle">
                <li
                  v-for="(item,index) in arealocation"
                  :class="indexs==index?'areabg':''"
                  :key="index"
                  @click="areaFun(index)"
                >{{item.regionName}}</li>
              </ul>
              <ul class="location">
                <div class="input_numbers">
                  <span>数量：</span>
                  <el-input-number :disabled="isNums" size="small" v-model="Cargonum"></el-input-number>
                </div>

                <div class="cargo">
                  <span>货位：</span>
                  <el-input style="width:67%;" size="small" v-model="CargoStr"></el-input>
                </div>

                <div class="btn">
                  <el-button type="primary" size="mini" @click="locationFun">确定</el-button>
                  <el-button size="mini" @click="cancellationFn">取消</el-button>
                </div>
              </ul>
            </div>
        </div>
      </div>
      <!-- 包 -->
      <div class="orderList m-top10" v-if="packageList.length!=0">
        <div v-for="(item,idx) in packageList">
          <div>
            <div class="order_item m-bottom">
              <div class="item_header multipleTableHeaderBg">
                <el-checkbox class="m-left10" v-model="item.checked" @change="packageChange(idx)"></el-checkbox>
                <div class="purchase">
                  <span class="span_title">采购单号：</span>
                  <span>{{item.purchaseNumber}}</span>
                </div>
              </div>
              <div class="item_body">
                <div class="item_div">
                  <ul>
                    <li>名称</li>
                    <li>数量</li>
                    <li>转移数量</li>
                    <li class="item_tiele textAl li_detail1">详情</li>
                  </ul>
                  <ul v-for="(pro,i) in item.unpackingDataVOS" :key="i">
                    <li>
                      <el-checkbox
                        :disabled="pro.isDisabled"
                        v-model="pro.isName"
                      >{{pro.unpackingName}}</el-checkbox>
                    </li>
                    <li>{{pro.inventoryNumberSum}}</li>
                    <li>
                      <el-input
                        size="mini"
                        :disabled="pro.isDisabled"
                        v-model="pro.transferTheNumber"
                        @input="transferFn"
                      ></el-input>
                    </li>
                    <li class="item_tiele">
                      <div class="li_detail2" v-for="(attr,k) in pro.storageSiteVOS" :key="k">{{attr.regionSiteName}} {{attr.num?'数量:':''}}{{attr.num}}</div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 商品 -->
      <div class="table_list lvs attribute m-top10" v-if="goodsList.length!=0">
        <el-table
          border
          style="width: 100%"
          @selection-change="handleSelectionChange"
          :row-class-name="tableRowClassName"
          :data="goodsList"
        >
          <el-table-column align="center" type="selection"></el-table-column>
          <el-table-column align="center" prop="commodityName" show-overflow-tooltip label="商品名称"></el-table-column>
          <el-table-column align="center" prop="inventoryNumber" label="数量"></el-table-column>
          <el-table-column align="center" label="转移数量">
            <template slot-scope="scope">
              <div>
                <el-input
                  @input="numberFn(scope.row)"
                  size="small"
                  v-model="scope.row.transferTheNumber"
                ></el-input>
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" label="货位">
            <template slot-scope="scope">
              <div v-for="item in scope.row.driver">
                
              </div>
            </template>
          </el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类"></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码"></el-table-column>
        </el-table>
      </div>

     
      <!-- 库取 -->
      <div class="headerStyle" v-if="librariesList.length!=0">库取商品</div>
      <div class="table_list lvs attribute m-top10" v-if="librariesList.length!=0">
        <el-table
          ref="multipleTable"
          border
          style="width: 100%"
          @selection-change="librariesListChange"
          :row-class-name="tableRowClassName"
          :data="librariesList"
        >
          <el-table-column align="center" type="selection"></el-table-column>
          <!-- <el-table-column align="center" prop="purchaseNumber" show-overflow-tooltip label="采购单号"></el-table-column> -->
          <el-table-column align="center" prop="commodityName" show-overflow-tooltip label="商品名称"></el-table-column>
          <el-table-column align="center" prop="brandName" label="品牌"></el-table-column>
          <el-table-column align="center" prop="categoryName" label="品类"></el-table-column>
          <el-table-column align="center" prop="commodityCode" label="商品编码" show-overflow-tooltip></el-table-column>
          <el-table-column align="center" prop="inventoryNumber" label="数量"></el-table-column>
          <el-table-column align="center" label="转移数量">
            <template slot-scope="scope">
              <div>
                <el-input
                  @input="libraryFn(scope.row)"
                  size="small"
                  v-model.number="scope.row.transferTheNumber"
                ></el-input>
              </div>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-card>
    <div class="foot_btn_box">
      <el-button type="primary" @click="submission" :loading="loadingbtn">提 交</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import {
  listStoragePurchaseOrderSite, //订单库存-转备货
  transferTheGoods, //订单库存-货位分配-库取单
  listOrderGoodsSite
} from "api/entrepotSet/inventorymanagement/orderInventory/orderInventory";
import { checkSiteOrAddSite } from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { getTreeById } from "api/entrepotSet/locationcargoarea/index";
export default {
  components: {
    breadcrumb
  },
  data() {
    return {
      loadingbtn:false,
      navList: [],
      packageList: [], //包
      goodsList: [], //商品
      pruList: [], //采购单商品
      brandId: "", //品牌
      purchaseList: [], // 勾选采购单
      librariesChangeList: [], // 勾选库取单
      goodsChangeList: [], //商品勾选
      librariesList: [], //库取商品
      actionBtnList: [
        { name: "选择货区货位", style: "default", type: 1 },
        { name: "删除", style: "default", type: 2 }
      ],
      isFlag: false, //选择货区货位显示
      isNumber: false, //验证数量
      num: "",
      indexs: 0, //点击状态
      arealocation: [], //货区货位列表
      isNums: false, //判断数量
      Cargonum: 0, //数量
      CargoStr: "", //货位
      quantitative: 0, //判断数量是否超出
      isCore: false //货位判断
    };
  },
  created() {
    this.brandId = this.$route.query.brandId;
  },
  mounted() {
    this.navList = this.$route.meta;
    // this.getData();
    this.getTable();
    this.getTree();
  },
  methods: {
    //货区货位列表数据
    getTree() {
      getTreeById({
        storageId: this.$route.query.storageId,
        theStaging: 0
      })
        .then(res => {
          if (res.status == 200) {
            this.arealocation = res.data;
          }
        })
        .catch(error => {
          console.error("获取货区", error);
        });
    },
    //点击货区
    areaFun(i) {
      this.indexs = i;
      this.CargoStr = "";
    },
    //按钮组
    butGroupAction(type) {
      this.quantitative = 0;
      //type==1选择货区  or type==0删除
      if (type == 1) {

        this.Cargonum = 0;
        let sum = 0;
        let num = 0;
        
        this.purchaseList.forEach(item=>{
          this.goodsList.forEach(attr=>{
            if(item.skuGoodsId == attr.skuGoodsId){
              sum+=attr.transferTheNumber*1;
              num ++;
            }
          })
        });

      this.packageList.forEach(item => {
        item.unpackingDataVOS.forEach(attr=>{
          if(attr.isName){
            sum+=attr.transferTheNumber*1;
            num ++;
          }
        })
      });
      
      this.isNums = num > 1;
      this.Cargonum = sum;
        // if (this.purchaseList.length > 1) {
        //   this.purchaseList.forEach(key => {
        //     this.pruList.forEach(item => {
        //       if (key.skuGoodsId == item.skuGoodsId) {
        //         sum += item.transferTheNumber;
        //       }
        //     });
        //   });
        //   this.Cargonum = sum;
        //   this.isNums = true;
        // } else {
        //   this.packageList.forEach(item => {
        //     item.unpackingDataVOS.forEach(attr=>{
        //       if(attr.isName){
        //         sum+=attr.transferTheNumber
        //       }
        //     })
        //   });
        //   this.Cargonum = sum;
        //   this.isNums = false;
        // }

        // if (!this.Cargonum) {
        //   this.$message.error("当前没有转移数量!");
        //   return;
        // }
        this.isFlag = !this.isFlag;
      } else {
        this.goodsList.forEach(item => {
          item.driver = item.driver.filter(attr => {
            return !attr.isT;
          });
        });
      }
    },
    //点击货位
    locationFun() {
      let { regionId, regionName } = this.arealocation[this.indexs];
      let data = {
        regionId,
        siteCode: this.CargoStr,
        storageId: this.$route.query.storageId,
        status: 0,
        userId: this.id
      };
      checkSiteOrAddSite(data)
        .then(res => {
          if (res.status == 200) {
            let obj = {
              regionSiteName: regionName + " " + res.data.siteCode,
              regionId: res.data.regionId,
              siteId: res.data.siteId
            };
            this.locatFn(obj);
          }
        })
        .catch(error => {
          console.error("新增货位", error);
        });
    },
    //选择货位
    locatFn(obj) {

      // 
      if (this.isNums) {
        // 包分配货位
        this.packageList.forEach(item=>{
          item.unpackingDataVOS.forEach(attr=>{
            if(attr.isName){
              attr.storageSiteVOS = [];
              attr.storageSiteVOS.push({
                regionSiteName: obj.regionSiteName,
                num: attr.transferTheNumber,
                regionId: obj.regionId,
                siteId: obj.siteId,
                isT: false
              })
            }
          })
        });


        // 商品分配货位
        this.purchaseList.forEach(item=>{
          this.goodsList.forEach(attr=>{
            if(item.skuGoodsId==attr.skuGoodsId){
              attr.driver = [];
              attr.driver.push({
                regionSiteName: obj.regionSiteName,
                num: attr.transferTheNumber,
                regionId: obj.regionId,
                siteId: obj.siteId,
                isT: false
              })
            }
          })
        });
        // 库取分配货位


      } else {

        // 包
        this.packageList.forEach(item=>{
          item.unpackingDataVOS.forEach(attr=>{
            if(attr.isName){
              attr.storageSiteVOS.push({
                regionSiteName: obj.regionSiteName,
                num: attr.transferTheNumber,
                regionId: obj.regionId,
                siteId: obj.siteId,
                isT: false
              });
            }
          });
        });

        // 商品分配货位
        this.purchaseList.forEach(item=>{
          this.goodsList.forEach(attr=>{
            if(item.skuGoodsId == attr.skuGoodsId){
              attr.driver.push({
                regionSiteName: obj.regionSiteName,
                num: attr.transferTheNumber,
                regionId: obj.regionId,
                siteId: obj.siteId,
                isT: false
              });
            }
          });
        });


      }

      this.isFlag = false;
      this.CargoStr = "";
    },
    
    //获取采购单商品
    getTable() {
      let data = {
        orderId: this.$route.query.orderId
      };
      listOrderGoodsSite(data).then(res => {
          if (res.status == 200) {
            if (res.data.goodsList) {
              this.goodsList = res.data.goodsList.map(item => {
                return {
                  ...item,
                  transferTheNumber: "",
                  driver: []
                };
              });
            }
            if (res.data.packageList) {
             this.packageList = res.data.packageList.map(item => {
                item.unpackingDataVOS = item.unpackingDataVOS.map(attr => {
                  attr.storageSiteVOS = attr.storageSiteVOS.map(item=>{
                    return {regionSiteName:item.siteCode}
                  })
                  return {
                    ...attr,
                    isName: false,
                    isDisabled: false,
                    transferTheNumber: ""
                  };
                });
                item.checked = false;
                return item;
              });
            }
            if (res.data.librariesGoodsList) {
              this.librariesList = res.data.librariesGoodsList.map(item => {
                return {
                  ...item,
                  transferTheNumber: ""
                };
              });
            }
          }
        })
        .catch(error => {
          console.error("获取采购单商品", error);
        });
    },
    packageChange(index){
      this.packageList[index].unpackingDataVOS.forEach(item=>{
        item.isName=this.packageList[index].checked
      })
    },
    //数量
    numberFn(row) {
      this.goodsList.forEach(item => {
        if (item.storagePurchaseOrderId == row.storagePurchaseOrderId) {
          if (row.transferTheNumber > item.inventoryNumber) {
            this.$message.error("数量超出");
            item.transferTheNumber = item.inventoryNumber;
          }
        }
      });
    },
    //转移数量
    transferFn(row) {
      this.packageList.forEach(attr => {
        attr.unpackingDataVOS.forEach(item => {
          if (item.isName) {
            if (item.inventoryNumberSum < item.transferTheNumber) {
              this.$message.error("转移数量大于数量");
              item.transferTheNumber = item.inventoryNumberSum;
            }
          }
        });
      });
    },
    libraryFn(row) {
      this.librariesList.forEach(item => {
        if (item.inventoryGoodsId == row.inventoryGoodsId) {
          if (row.transferTheNumber > item.inventoryNumber) {
            this.$message.error("数量超出");
            item.transferTheNumber = item.inventoryNumber;
          }
        }
      });
    },
    //包change
    packetParent() {
      let flag = this.packageList.every(attr => {
        return attr.unpackingDataVOS.every(item => {
          return !item.isName;
        });
      });
      if (flag) {
        this.packageList.forEach(attr => {
          attr.unpackingDataVOS.forEach(item => {
            item.isDisabled = false;
          });
        });
      } else {
        this.packageList.forEach(attr => {
          attr.unpackingDataVOS.forEach(item => {
            if (item.isName) {
              item.isDisabled = false;
            } else {
              item.isDisabled = true;
            }
          });
        });
      }
    },
    //提交
    submission() {
      let purchasePackageList = []; //包集合
      let inventoryGoodsList = [];
      let allotGoodsList = [];
      let { storageId } = this.$route.query;
      // 包
      if (this.packageList.length != 0) {
        let CagoList = [];
        let purchaseOrderId = "";
        this.packageList.forEach(item => {
          item.unpackingDataVOS.forEach(attr => {
            if (attr.isName) {
              let num =
                attr.inventoryNumberSum * 1 - attr.transferTheNumber * 1;
              if (!attr.transferTheNumber && attr.transferTheNumber == 0) {
                // this.$message.error("没有填包的转移数量!");
                return;
              }
              purchaseOrderId = item.purchaseOrderId;
              purchasePackageList.push({
                inventoryNumber: num,
                transferTheNumber: attr.transferTheNumber,
                inventoryPurchasePackageId: attr.inventoryPurchasePackageId,
                purchasePackageDetailList: attr.storageSiteVOS
              });
            }
          });
        });

        if (purchaseOrderId && this.purchaseList.length == 0) {
          this.$message.error("没有选择采购单商品");
          return;
        }
        if (this.purchaseList.length != 0) {
          if (this.purchaseList[0].purchaseOrderId != purchaseOrderId) {
            this.$message.error("包采购单号和采购单商品不同!");
            return;
          }
          let flag = this.purchaseList.every(item => {
            return !item.driver.length;
          });
          if (flag) {
            this.$message.error("没有选择货区货位!");
            return;
          }
        }

        this.purchaseList.forEach(item => {
          item.driver.forEach(attr => {
            inventoryGoodsList.push({
              storageId,
              skuGoodsId: item.skuGoodsId,
              regionId: attr.regionId,
              siteId: attr.siteId,
              inventoryStatus: 1,
              inventoryNumber: item.transferTheNumber,
              purchaseOrderId: item.purchaseOrderId
            });
          });
        });

        this.librariesChangeList.forEach(item => {
          if (!item.transferTheNumber && item.transferTheNumber == 0) {
            return;
          }
          inventoryGoodsList.push({
            storageId,
            skuGoodsId: item.skuGoodsId,
            regionId: item.regionId,
            siteId: item.siteId,
            inventoryStatus: 1,
            inventoryNumber: item.transferTheNumber
          });
        });
      }

      // 商品
      if (this.goodsChangeList.length != 0) {
        this.goodsChangeList.forEach(item => {
          if (!item.transferTheNumber && item.transferTheNumber == 0) {
            this.$message.error("有转移数量为0或者空!");
            return;
          }
          inventoryGoodsList.push({
            storageId,
            skuGoodsId: item.skuGoodsId,
            regionId: item.regionId,
            siteId: item.siteId,
            inventoryStatus: 1,
            inventoryNumber: item.transferTheNumber,
            purchaseOrderId: item.purchaseOrderId
          });

          let num = item.inventoryNumber - item.transferTheNumber;
          allotGoodsList.push({
            transferTheNumber: item.transferTheNumber,
            skuGoodsId: item.skuGoodsId,
            inventoryNumber: num,
            inventoryGoodsId: item.inventoryGoodsId,
            purchaseOrderId: item.purchaseOrderId ? item.purchaseOrderId : 0,
            type: item.type,
            relLibrariesTakeCommodityId: item.relLibrariesTakeCommodityId
          });
        });
      }

      if (inventoryGoodsList.length == 0) {
        this.$message.error("当前没有要转移的订单");
        return;
      }
      let data = {
        purchasePackageList,
        inventoryGoodsList,
        allotGoodsList
      };
      console.log(data);
      this.loadingbtn = true;
      transferTheGoods(data).then(res => {
          if (res.status == 200) {
            this.$message.success("提交成功！");
            this.loadingbtn = false;
            this.$router.go(-1);
          }else{
            this.$message.error('提交失败!')
            this.loadingbtn = false;
          }
        }).catch(error => {
          this.loadingbtn = false;
          console.error("订单转备货提交", error);
        });
    },
    cancellationFn(){
      this.isFlag = false;
    },
    //取消
    cancel() {
      this.$router.go(-1);
    },
    //勾选
    handleSelectionChange(val) {
      this.goodsChangeList = val;
    },
    //勾选库取
    librariesListChange(val) {
      this.librariesChangeList = val;
    },
    //勾选采购单商品
    purchaseCommity(val) {
      this.purchaseList = val;
      if (this.purchaseList.length > 1) {
        this.$refs.multipleTable.toggleRowSelection(this.purchaseList[0]);
      }
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style lang="scss" scoped>
.headerStyle {
  font-size: 18px;
  font-weight: 500;
  color: #006ec7;
  margin: 15px 15px 0px;
  position: relative;

  &::after {
    content: "";
    display: block;
    width: 4px;
    height: 15px;
    background: #006ec7;
    position: absolute;
    left: -16px;
    top: 50%;
    border-radius: 5px;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
  }
}
.btnStyle{
  position: relative;
}
.foot_btn_box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.orderList {
  font-size: 14px;
  // max-height: 650px;
  // overflow: auto;
  color: #909399;
  .order_item {
    width: 100%;
    border: 1px solid #ebeef5;
    .item_header {
      > span {
        width: 80px;
      }
      height: 50px;
      line-height: 50px;
      display: flex;
      flex-wrap: nowrap;
      > div {
        width: 25%;
        .span_title {
          font-weight: bold;
        }
      }
    }
    .item_body {
      max-height: 200px;
      overflow-y: auto;
      overflow-x: auto;
      .item_div {
        display: flex;
        flex-wrap: nowrap;
        ul {
          .item_tiele {
            height: calc(100% - 120px);
          }
          .textAl {
            display: flex;
            align-items: center;
          }
        }
        li {
          width: 180px;
          border-top: 1px solid #ebeef5;
          height: 40px;
          line-height: 40px;
          text-align: center;
          border-right: 1px solid #ebeef5;
        }
        .li_detail1 {
          display: flex;
          justify-content: center;
          align-items: center;
          flex: 1;
          height: 100%;
        }
        .li_pro {
          display: flex;
          width: 200px;
          height: 100%;
        }
        .li_detail2 {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}

.close {
  display: flex;
  flex-direction: row-reverse;
  padding: 0 10px;
  span {
    cursor: pointer;
  }
}
.areabg {
  background: #a2a2a2 !important;
}
.bk {
  border-bottom: 1px solid #ebeef5;
}
.quantity {
  width: 300px;
  position: absolute;
  background: #333333;
  z-index: 2;
  top: 45px;
  left: 0;
  color: #fff;
  border-radius: 4px;
}

.input_numbers {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
}
.reportloss {
  width: 150px;
  position: absolute;
  background: #333333;
  z-index: 2;
  right: -17px;
  top: 46px;
  color: #fff;
  border-radius: 4px;
}

.areaorlocation {
  display: flex;
  width: 100%;
}
.areaStyle {
  width: 35%;
  border-top: 1px solid #ebeef5;
  border-right: 1px solid #ebeef5;
  overflow-y: auto;
  max-height: 130px;

  &::-webkit-scrollbar {
    width: 10px;
    height: 1px;
    border-radius: 10px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background: #c5c5c5;
  }
  li {
    width: 100%;
    height: 30px;
    line-height: 30px;
    border-bottom: 1px solid #ebeef5;
    cursor: pointer;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  li:last-child {
    border-bottom: none;
  }
}
.location {
  width: 65%;

  .cargo {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 10px;
    span {
      min-width: 45px;
    }
  }

  .btn {
    display: flex;
    justify-content: center;
    margin: 10px 0;
  }
}
.warp_head_action_btn {
  display: flex;
  flex-direction: row-reverse;
  align-items: center;
  border: none;
  position: relative;
}
</style>