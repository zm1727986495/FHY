<template>
  <div class="nolibrarylist">
    <div class="head_nav" ref="topInfo">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <div>
      <el-card id="nolibrarylist" class="box-card">
        <!-- 信息头 -->
        <information  @getData="getData" ref="information"></information>

        <!-- 选择货区货位 -->
        <div class="assignment">
          <!-- <div class="warp_action">
            <div class="warp_head_action_btn">
              <el-select style="width:130px;" size="small" v-model="regionId" placeholder="请选择货区">
                <el-option
                  v-for="item in arealocation"
                  :key="item.regionId"
                  :label="item.regionName"
                  :value="item.regionId"
                ></el-option>
              </el-select>
              <el-input style="width:200px;margin-left:5px;" size="small" v-model.trim="CargoStr"></el-input>
              <el-button style="margin-left:5px;" type="primary" size="mini" @click="locationFun">确定</el-button>
            </div>
          </div> -->

          <!-- 领用 -->
          <collaruse class="m-top10" ref="collaruse" v-if="isFlag==4||isFlag==9"></collaruse>

          <!-- 包列表 -->
          <procurement v-else ref="procurement" :isShow="true"></procurement>
        </div>
      </el-card>
    </div>
    <div class="btn">
      <!-- <el-button type="danger" @click="printing">打 印</el-button> -->
      <el-button type="danger" v-print="'#nolibrarylist'">打 印</el-button>
      <el-button type="primary" @click="handleok" :loading="loadingbtn">出 库</el-button>
      <el-button @click="handleClose">取 消</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import information from "./components/information";
import procurement from "./components/procurement";
import collaruse from "./components/collaruse";
import pagination from "@/views/components/pagination";
import { getTreeById } from "api/entrepotSet/locationcargoarea/index";
import { outbound,deliveryRecipientsGoods,deliveryConfirmation } from "api/entrepotSet/outgoingManagement/outgoingManagement";
import { getUUID } from "api/pulicJava";
import { checkSiteOrAddSite } from "api/entrepotSet/stockManagement/stockPending/stockPending";
import { mapGetters } from "vuex";
export default {
  components: {
    breadcrumb,
    information,
    pagination,
    procurement,
    collaruse
  },
  data() {
    return {
      navList: [],
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      isShow: false, //点击显示货区
      indexs: 0, //点击货区状态
      arealocation: [], //货区列表
      isFlag: "", //
      regionId: "", //货区
      CargoStr: "", //货位
      loadingbtn: false
    };
  },
  created() {
    this.isFlag = this.$route.query.outboundType;
  },
  mounted() {
    this.navList = this.$route.meta;
  },
  computed: {
    ...mapGetters(["id"])
  },
  methods: {
    //打印
    printing() {},
    //获取货区
    getData(obj) {
      let data = {
        storageId: this.$route.query.storageId,
        theStaging: 2
      };
      getTreeById(data)
        .then(res => {
          if (res.status == 200 && res.data.length !== 0) {
            this.arealocation = res.data;
          }
        })
        .catch(error => {
          console.error("获取货区", error);
        });
    },
    //货位分配按钮
    butGroupAction() {
      if (this.arealocation.length !== 0) {
        this.isShow = true;
      }
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    areaFun(i) {
      this.indexs = i;
      this.CargoStr = "";
    },
    //选择货位
    locationFun() {
      // let { regionId, regionName } = this.arealocation[this.indexs];
      let regionName = this.arealocation.filter(item => {
        return this.regionId == item.regionId;
      });
      if (!this.regionId) {
        this.$message.error("当前没有选择货区");
        return;
      }
      if (!this.CargoStr) {
        this.$$message.error("当前没有选择货位!");
        return;
      }
      let data = {
        regionId: this.regionId,
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
              siteCode: res.data.siteCode,
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
      if (this.isFlag == 4 || this.isFlag == 9) {
        let { choseArr, tableData } = this.$refs.collaruse;
        choseArr.forEach(attr => {
          this.$refs.collaruse.tableData = tableData.map(item => {
            if (attr.inventoryGoodsId == item.inventoryGoodsId) {
              if (item.applyNumber && item.applyNumber != 0) {
                item.regionSite =
                  this.arealocation[this.indexs].regionName +
                  " " +
                  obj.siteCode;
                item.regionId = this.arealocation[this.indexs].regionId;
                item.siteId = obj.siteId;
                item.flag = true;
              }
            }
            return item;
          });
        });
      } else {
        let flag = this.$refs.procurement.dataList.every(item => {
          return !item.checked;
        });
        if (flag) {
          this.$message.error("当前没有勾选!");
          return;
        }
        this.$refs.procurement.dataList.forEach(item => {
          if (item.checked) {
            if(item.unpackingDataVOS.length!=0){
              item.unpackingDataVOS.forEach(attr => {
                if (attr.unpackingName && attr.unpackingName != 0) {
                  attr.storageSiteVOS = [
                    {
                      regionName: this.arealocation[this.indexs].regionName,
                      siteCode: obj.siteCode,
                      regionId: this.arealocation[this.indexs].regionId,
                      siteId: obj.siteId,
                      flag: true
                    }
                  ];
                }
              });
            }

            if(item.inventoryGoodsVOS.length!=0){
              item.inventoryGoodsVOS.forEach(attr=>{
                attr.regionSite = this.arealocation[this.indexs].regionName +' '+obj.siteCode;
                attr.regionId = this.arealocation[this.indexs].regionId;
                attr.siteId = obj.siteId
              })
            }
          }
        });
      }

      this.isShow = false;
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
    },
    sendJava() {},
    //关闭货区
    closearea() {
      this.isShow = false;
    },
    //提交
    handleok() {
      let {outboundOrderId,outboundType,sourceCode,orderId} = this.$route.query;
      let {expectedArrivalDate,pickUpTime,driver,licensePlateNumber,receivingPeople,receivingPeoplePhone} = this.$refs.information.bindInfo;
      let data = {
        outboundOrderId, //出库单ID
        outboundStatus: 2, //出库状态
        outboundType,
        sourceCode,
        remarks: this.$refs.information.textarea, //备注
        accountingDate: expectedArrivalDate,
        pickUpTime,
        driver,
        receivingPeopleCar:licensePlateNumber,
        receivingPeople,
        receivingPeoplePhone,
        orderId
      };
      console.log(data);
      
      this.loadingbtn = true;
      if (this.isFlag == 4 || this.isFlag == 9) {
        let { tableData } = this.$refs.collaruse;
        if (tableData.length == 0) {
          this.$message.error("当前无数据!");
          return;
        }
        let arr = [];
        tableData.forEach(item => {
          if (item.flag) {
            if (item.applyNumber == "") {
              return;
            }
            arr.push({
              inventoryGoodsId: item.inventoryGoodsId, //库存商品ID
              storageId: this.$refs.information.obj.storageId, //仓库ID
              regionId: item.regionId, //货区ID
              siteId: item.siteId, //货位ID
              skuGoodsId: item.skuGoodsId, //sku商品id
              inventoryType: 1, //库存类型
              inventoryStatus: 4, //库存状态
              number: item.inventoryNumber //出库数量
            });
          }
        });
        data.goodsList = arr;
      } else {
        let { dataList } = this.$refs.procurement;
        if (dataList.length == 0) {
          this.$message.error("当前无数据!");
          return;
        }
        // 处理出库商品数据
        let arr = [];
        dataList.forEach(item => {
          if (item.inventoryGoodsVOS.length !== 0) {
            item.inventoryGoodsVOS.forEach(attr => {
              if (attr.flag) {
                if (attr.inventoryNumber == 0) {
                  return;
                }
                arr.push({
                  inventoryGoodsId: attr.inventoryGoodsId, //库存商品ID
                  storageId: this.$refs.information.obj.storageId, //仓库ID
                  regionId: attr.regionId, //货区ID
                  siteId: attr.siteId, //货位ID
                  skuGoodsId: attr.skuGoodsId, //sku商品id
                  inventoryType: 1, //库存类型
                  inventoryStatus: 4, //库存状态
                  number: attr.inventoryNumber //出库数量
                });
              }
            });
          }
        });
        // 处理库存订单数据
        let ary = [];
        dataList.forEach(item => {
          if (item.unpackingDataVOS.length !== 0) {
            item.unpackingDataVOS.forEach(attr => {
              if (attr.storageSiteVOS[0].flag) {
                if (attr.inventoryNumberSum == 0) {
                  return;
                }
                ary.push({
                  storagePurchaseOrderId: item.storagePurchaseOrderId, //库存采购单ID
                  storageId: this.$refs.information.obj.storageId, //仓库ID
                  status: 3, //状态
                  regionId: attr.storageSiteVOS[0].regionId, //货区ID
                  siteId: attr.storageSiteVOS[0].siteId, //货位ID
                  storageNumber: item.inventoryNumberSum //库存数量
                });
              }
            });
          }

          if(item.inventoryGoodsVOS.length!=0){
            item.inventoryGoodsVOS.forEach(attr=>{
              arr.push({
                inventoryGoodsId: attr.inventoryGoodsId, //库存商品ID
                storageId: this.$refs.information.obj.storageId, //仓库ID
                regionId: attr.regionId, //货区ID
                siteId: attr.siteId, //货位ID
                skuGoodsId: attr.skuGoodsId, //sku商品id
                inventoryType: 1, //库存类型
                inventoryStatus: 4, //库存状态
                number: attr.inventoryNumber //出库数量
              })
            })
          }
        });

        data.storagePurchaseOrderList = ary;
        data.goodsList = arr;
      }

      console.log(data);
      
      if(this.isFlag  == 4 || this.isFlag == 9){
        deliveryRecipientsGoods(data).then(res=>{
          if (res.status == 200) {
            // this.$router.push({ path: "outofstock" });
            this.$router.go(-1)
            this.$message.success('出库成功!')
            this.loadingbtn = false;
          }else{
            this.loadingbtn = false;
          }
        }).catch(error => {
          this.loadingbtn = false;
          console.error("待出库确认", error);
        })
      }else{
        deliveryConfirmation(data).then(res=>{
          if (res.status == 200) {
            // this.$router.push({ path: "outofstock" });
            this.$router.go(-1)
            this.$message.success('出库成功!')
            this.loadingbtn = false;
          }else{
            this.loadingbtn = false;
          }
        }).catch(error => {
          this.loadingbtn = false;
          console.error("待出库确认", error);
        })
      }
      // outbound(data).then(res => {
      //   if (res.status == 200) {
      //     this.$router.push({ path: "outofstock" });
      //     this.$message.success('出库成功!')
      //     this.loadingbtn = false;
      //   }else{
      //     this.loadingbtn = false;
      //   }
      // }).catch(error => {
      //   this.loadingbtn = false;
      //   console.error("待出库确认", error);
      // })
    },
    //取消
    handleClose() {
      this.$router.go(-1);
    },
    //关闭货位
    cancel() {
      this.isShow = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.nolibrarylist {
  position: relative;
  .box-card {
    min-height: 400px;
  }
  .btn {
    display: flex;
    justify-content: center;
    padding: 20px 0;
  }
  // 货区
  .assignment {
    position: relative;
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
      right: 0;
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
    .warp_action {
      float: right;
      // width: 300px;
      .warp_head_action_btn {
        display: flex;
        // flex-direction: row-reverse;
        align-items: center;
        border: none;
      }
    }
  }
}
</style>
