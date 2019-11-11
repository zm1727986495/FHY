<template>
  <div>
    <div v-for="(item,index) in datas" :key="item.roomId" class="table_list">
      <ul class="multipleTableHeader multipleTableHeaderBg bt1 fw" v-if="item.isShow">
        <li class="checkAll">
          <el-checkbox v-model="checkAll" :disabled="routedata" @change="checkAllChange"></el-checkbox>
        </li>
        <li>库存数</li>
        <li v-if="orderDetails.brand.brandId == 2">行号</li>
        <li class="commodityNumber">房间</li>
        <li class="commodityNumber">名称</li>
        <li v-if="isUnFinished">型号</li>
        <li v-if="isFinished">货号</li>
        <li v-if="isFinished">规格</li>
        <li>数量</li>
        <li v-if="!routedata">成本单价</li>
        <li v-if="!routedata">成本系数</li>
        <li>非标系数</li>
        <li v-if="!routedata">采购金额</li>
        <li>计价方式</li>
        <li class="commodityNumber">备注</li>
        <li>系列</li>
        <li>材质</li>
        <li class="commodityNumber">颜色</li>
        <li>单位</li>
        <li>宽</li>
        <li>高</li>
        <li>深</li>
        <li>厚</li>
        <li>品牌</li>
        <li>品类</li>
        <li>商品编码</li>
        <li>是否入库</li>
        <li>是否安装</li>
      </ul>
      <p class="tableHeader">
        <span>{{ item.classifyName }}</span>
      </p>
      <ul class="multipleTableHeader" v-for="(info,idx) in item.products" :key="idx" :class="{ bt1: idx === 0 }">
        <li>
          <el-checkbox v-model="info.checked" :disabled="routedata && !status"></el-checkbox>
        </li>
        <li>
          <div>
            <el-tooltip placement="right" visible-arrow v-if="!setQuery||(!routedata && btn_moveTo && (!isExecute || isSuperEdit) && (info.inventoryNumber % 1 === 0 && info.inventoryNumber > 0))">
              <div slot="content" class="tips tipFon">
                <p class="operaItems" @click="handleMove(info)">加入库取</p>
              </div>
              <img :src="spot" alt="" class="attributesTips">
            </el-tooltip>
            {{ info.inventoryNumber }}
          </div>
        </li>
        <li v-if="orderDetails.brand.brandId == 2">
          <el-input v-model.trim="info.lineNumber" :disabled="(routedata || isExecute) && !isSuperEdit && !status" :size="size" placeholder="行号" @change="checkLineNumber"></el-input>
        </li>
        <!--<el-input v-model.trim="info.lineNumber" :disabled="routedata" :size="size" placeholder="行号" @change="checkLineNumber"></el-input>-->
        <li class="commodityNumber">{{ info.roomCode | emptyFormat }}{{ info.roomName | emptyFormat }}<i v-show="info.roomRemark">-</i>{{ info.roomRemark | emptyFormat }}</li>
        <li class="commodityNumber">
          <el-tooltip :content="info.commodityName" :placement="placement" :open-delay="openDelay">
            <el-link type="info" :underline="false">{{ info.commodityName }}</el-link>
          </el-tooltip>
        </li>
        <li v-if="isUnFinished">
          <el-tooltip :content="info.commodityModel" :placement="placement" :open-delay="openDelay">
            <el-link type="info" :underline="false">{{ info.commodityModel }}</el-link>
          </el-tooltip>
        </li>
        <li v-if="isFinished">{{ info.commodityNumber }}</li>
        <li v-if="isFinished">
          <el-tooltip :content="info.commodityModel" :placement="placement" :open-delay="openDelay">
            <el-link type="info" :underline="false">{{ info.commodityModel }}</el-link>
          </el-tooltip>
        </li>
        <li><el-input v-model="info.amount" :disabled="(routedata || isExecute) && !isSuperEdit && !status" :size="size" placeholder="数量" @blur="savePurchaseOrder" @focus="focusing" :readonly="loading"></el-input></li>
        <li v-if="!routedata">{{ info.costPrice }}</li>
        <li v-if="!routedata">{{ info.coefficient }}</li>
        <!-- {{ info.nonStandardParameter ? info.nonStandardParameter : 1 }} -->
        <li><el-input v-model="info.nonStandardParameter" :disabled="(routedata || isExecute) && !isSuperEdit && !status"  placeholder="非标系数" :size="size" @blur="changenonStandard(info.nonStandardParameter, index, idx)" :readonly="loading"></el-input></li>
        <li v-if="!routedata">{{ info.itemPrice | money }}</li>
        <li>{{ info.valuationMethod }}</li>
        <li class="commodityNumber"><el-input v-model="info.remarks" :disabled="(routedata || isExecute) && !isSuperEdit && !status" :size="size" placeholder="备注"></el-input></li>
        <li>{{ info.series ? info.series : '' }}</li>
        <li>{{ info.material ? info.material : '' }}</li>
        <li class="commodityNumber">
          <el-tooltip :content="info.colour ? info.colour : ''" :placement="placement" :open-delay="openDelay">
            <el-link type="info" :underline="false">{{ info.colour ? info.colour : '' }}</el-link>
          </el-tooltip>
        </li>
        <li>{{ info.commodityUnit }}</li>
        <li><el-input v-model="info.width" :disabled="(routedata || isExecute) && !isSuperEdit && !status" :size="size" placeholder="宽" @blur="getsku(info)" :readonly="loading"></el-input></li>
        <li><el-input v-model="info.high" :disabled="(routedata || isExecute) && !isSuperEdit && !status" :size="size" placeholder="高" @blur="getsku(info)" :readonly="loading"></el-input></li>
        <li><el-input v-model="info.deep" :disabled="(routedata || isExecute) && !isSuperEdit && !status" :size="size" placeholder="深" @blur="getsku(info)" :readonly="loading"></el-input></li>
        <li><el-input v-model="info.thick" :disabled="(routedata || isExecute) && !isSuperEdit && !status" :size="size" placeholder="厚" @blur="getsku(info)" :readonly="loading"></el-input></li>
        <li>{{ info.brandName }}</li>
        <li>{{ info.categoryName }}</li>
        <li>
          <el-tooltip :content="info.commodityCode" :placement="placement" :open-delay="openDelay">
            <el-link type="info" :underline="false">{{ info.commodityCode }}</el-link>
          </el-tooltip>
        </li>
        <li>{{ tablesData.isStorage == 1 ? '是' : '否' }}</li>
        <li>{{ tablesData.isInstall == 1 ? '是' : '否' }}</li>
      </ul>
      <ul class="multipleTableHeader multipleTableAmount" v-if="item.products && item.products.length && !routedata">
        <li>总计：{{ item.totalPrice | money }}</li>
      </ul>
<!--      <TableBody :status="status" :datas="item.classifyLevel" v-if="item.classifyLevel && item.classifyLevel.length"></TableBody>-->
    </div>
  </div>
</template>
<script>
  import { mapGetters, mapMutations } from 'vuex';
  import spot from '@/assets/images/spot.png';
  import { listStorageCommodity, insertPurchaseOrderCommodity, getPurchaseOrder } from 'src/api/administrationCenter/contractmanagement/contractmanagement';
  import { getGoodsSKUId } from '@/api/pulicJava';
  import { insertCommoditySku } from "api/entrepotSet/stockManagement/stockPending/stockPending";
  import { getAllData, calPrice, sum } from '@/utils/pubilcFn';
  export default {
    name: 'TableBody',
    data() {
      return {
        placement: 'top',
        openDelay: 200,
        btn_moveTo: false,
        routedata: this.$route.path == '/ordermm/details',
        spot,
        size: 'mini',
        selection: {},
        isInStorage: false,
        isInstall: false,
        checkAll: false,
        arr: [],
        allProducts: [],
        loading: false
      }
    },
    created() {
      this.initBtnElements();
    },
    // mounted(){
    //   this.savePurchaseList();
    // },
    props: {
      datas: {
        type: Array,
        default: () => []
      },
      visible: {
        type: Boolean,
        default: () => false
      },
      status:{
        type:Boolean,
        default:false
      },
      setQuery:{
        type:Boolean,
        default:true,
      }
    },
    methods: {
      // 获取按钮权限
      initBtnElements() {
        let element = JSON.parse(this.$loca.getItem('element'));
        this.btn_moveTo = element['placeOrderContract:btn_moveTo'];// 加入库取
      },
      checkAllChange(val) {
        this.checkAll = val;
        this.selectAll(this.datas, val);
      },
      // 添加初始化选中状态 false
      selectAll(datas, isChecked) {
        datas.map((item, idx) => {
          if (item.products && item.products.length) {
            item.products.map((info, index) => {
              info.checked = isChecked;
            })
          }
        })
      },
      // 更改非标系数
      changenonStandard(val,index,idx){
        if (val != '' && val != null) {
          this.datas[index].products[idx].nonStandardParameter = val.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/[^\d.]/g, "").replace(/^\./g, "").replace( /([0-9]+\.[0-9]{3})[0-9]*/,"$1");
        }
        if (val.charAt(0) == '-') {
          this.datas[index].products[idx].nonStandardParameter = '-' + this.datas[index].products[idx].nonStandardParameter;
        }
        this.loading = false;
        this.onFocus(false);
        this.savePurchaseList();
      },
      // 点击加入库取
      handleMove(val) {
        let params = {
          commoditySKUId: val.commoditySKUId
        };
        listStorageCommodity(params)
          .then(response => {
            response.data.forEach((item,index) => {
              if (index == 0) {
                item.inventorySampleBuyNum = 0;
                item.inventoryTransitBuyNum = 0;
              } else {
                item.buyNum = 0;
                item.deductedBuyNum = 0;
              }
            })
            let moveData = {
              info: val,
              visible: true,
              commoditySKUId: val.commoditySKUId,
              tableData: response.data
            }
            this.$store.dispatch('MOVETO_WAREHOUSE', moveData);
          })
          .catch(error => {
            console.log('views/administrationcenter/contractmanagement/components/PurchaseTableBody.vue:handleMove' + error)
          })

        // let moveData = {
        //   info: val,
        //   visible: true,
        //   commoditySKUId: 1,
        //   tableData: [
        //     {
        //       "inventorySample": 7,  //样品
        //       "inventoryTransit": 4,  //在途可用
        //       "skuGoodsId":1,   //商品skuid
        //       "storageName": "所有仓库", //所有仓库
        //       inventorySampleBuyNum: 0,
        //       inventoryTransitBuyNum: 0
        //     },
        //     {
        //       "storeInventory": 0,   //不显示
        //       "takeInventory": 12,   //占用
        //       "skuGoodsId": 1,   //商品skuID
        //       "available": 13,    //可用
        //       "deducted": 30,    //暂扣
        //       deductedBuyNum: 0,
        //       "storageName": "仓库一号", //仓库名称
        //       "storageId": 1,    //仓库ID,
        //       buyNum: 0
        //     },
        //     {
        //       "storeInventory": 0,   //不显示
        //       "takeInventory": 12,   //占用
        //       "skuGoodsId": 1,   //商品skuID
        //       "available": 13,    //可用
        //       "deducted": 30,    //暂扣
        //       deductedBuyNum: 0,
        //       "storageName": "仓库二号", //仓库名称
        //       "storageId": 1,    //仓库ID,
        //       buyNum: 0
        //     }
        //   ]
        // }
        // console.log(moveData)
        // this.$store.dispatch('MOVETO_WAREHOUSE', moveData);
      },
      // 校验行号是否重复
      checkLineNumber(val) {
        let allProducts = getAllData(this.tablesData.orderCommodity);
        let valArr = [];
        allProducts.forEach((item, index) => {
          if (item.lineNumber === val) {
            valArr.push(item);
            if (valArr.length > 1) {
              this.$message.error('行号唯一，不能重复');
              allProducts[index].lineNumber = '';
            }
          }
        })
      },
      // 计算价格
      calAmount() {
        // this.allProducts = getAllData(this.tablesData.orderCommodity);
        // this.tablesData.amount = this.getPurchaseOrderPrice;
        // calPrice(this.tablesData.orderCommodity, 1);
        // this.$forceUpdate();
      },
      // 获取sku
      getsku(row) {
        this.loading = true;
        let paramsGetSku = {
          commoditySeriesId: row.seriesId,
          commodityColourId: row.colourId,
          commodityMaterialId: row.materialId,
          commodityId: row.commodityId,
          commodityWide: row.width,
          commodityHigh: row.high,
          commodityLong: row.deep,
          commodityThick: row.thick,
          commodityNumber: row.commodityNumber
        };
        getGoodsSKUId(paramsGetSku)
          .then(resGet => {
            if (resGet.data && resGet.data.commoditySKUId) {
              row.commoditySKUId = resGet.data.commoditySKUId;
              this.savePurchaseList();
            } else {
              insertCommoditySku(paramsGetSku)
                .then(resAdd => {
                  row.commoditySKUId = resAdd.data;
                  this.savePurchaseList();
                })
                .catch(error => {
                  console.log('通用接口新增skuid-transfer.vue')
                })
            }
          })
          .catch(error => {
            console.log('根据颜色、系列、材质、商品id生成skuid' + error);
          });
      },
      // 改变数量-宽-高-深-厚-非标系数
      savePurchaseOrder() {
        this.onFocus(true);
        this.loading = true;
        if (this.tablesData.purchaseOrderId) {
          this.savePurchaseList();
        } else {
          console.log('没有采购单id');
        }
      },
      // 保存采购单
      savePurchaseList() {
        let params = {
          settlementMoney: this.getPurchaseOrderPrice,
          purchaseOrderId: this.tablesData.purchaseOrderId,
          isInstall: this.tablesData.isInstall,
          purchaseNumber: this.tablesData.purchaseNumber,
          isStorage: this.tablesData.isStorage,
          purchaseOrderCommodities: this.getAllCommodities,
          roomId: this.tablesData.roomId,
          budgetRoomId: this.tablesData.budgetRoomId
        };
        insertPurchaseOrderCommodity(params)
          .then(response => {
            this.getPurchaseOrder();
          })
          .catch(error => {
            console.log('view/administrationCenter/contractmanagement/components/PurchaseTableBody.vue:savePurchaseList' + error);
          })
      },
      // 获取采购单
      getPurchaseOrder() {
        let params = {
          purchaseOrderId: this.tablesData.purchaseOrderId,
          contractType: this.$route.query.contractType
        };
        getPurchaseOrder(params)
          .then(response => {
            if (response.data.orderCommodity && response.data.orderCommodity.length) {
              response.data.orderCommodity[0].isShow = true;
              this.selectAll(response.data.orderCommodity, false);
              calPrice(response.data.orderCommodity, 1);
            } else {
              response.data.orderCommodity = [];
            }
            response.data.amount = this.getPurchaseOrderPrice;
            response.data.purchaseOrderId = this.tablesData.purchaseOrderId;
            if (!response.data.purchaseNumber) {
              response.data.purchaseNumber = this.contractDetails.purchaseContractCode || '';
            }
            this.$store.dispatch('QUERY_TABLEDATA', response.data);
            this.loading = false;
            this.onFocus(false);
          })
          .catch(error => {
            this.loading = false;
            this.onFocus(false);
            console.log('views/administrationcenter/contractmanagement/components/PurchaseContract.vue:getPurchaseOrder' + error)
          })
      },
      // 获取焦点时
      focusing() {
        this.onFocus(true);
      },
      ...mapMutations({
        onFocus: 'ON_FOCUS'
      })
    },
    computed: {
      ...mapGetters([
        'tablesData',
        'orderDetails',
        'contractDetails',
        'isOnFocus'
      ]),
      getPurchaseOrderPrice() {
        let price = 0;
        let allProducts = getAllData(this.tablesData.orderCommodity);
        if (allProducts.length) {
          allProducts.forEach(info => {
            info.nonStandardParameter == null  ? info.nonStandardParameter  = 1 : null;
            price += sum(info.valuationMethodValue, info.width, info.high, info.deep, info.amount, info.costPrice, info.nonStandardParameter, 1, info.coefficient);
          });
        }
        return price;
      },
      // 是否是成品
      isFinished() {
        return this.orderDetails.orderGoodsType == 1;
      },
      // 是否是定制品
      isUnFinished() {
        return this.orderDetails.orderGoodsType == 2;
      },
      // 是否执行完成 1-执行完成
      isExecute() {
        return this.tablesData.isExecute == 1 || this.contractDetails.isSignOrder == 1;
      },
      // 是否是超级编辑
      isSuperEdit() {
        return this.contractDetails.isSuperEdit == 1;
      },
      // 保存获取所有的商品
      getAllCommodities() {
        let arr = [];
        let allProducts = [];
        if (this.tablesData.orderCommodity && this.tablesData.orderCommodity.length) {
          allProducts = getAllData(this.tablesData.orderCommodity);
        }
        if (allProducts.length) {
          allProducts.forEach(item => {
            arr.push({
              orderCommodityId: item.purchaseOrderCommodityId || '',
              commodityId: Number(item.commodityId),
              commoditySkuId: item.commoditySKUId || '',
              lineNumber: item.lineNumber || '',
              width: item.width,
              high: item.high,
              deep: item.deep,
              thick: item.thick,
              colourId: Number(item.colourId),
              seriesId: item.seriesId,
              materialId: item.materialId,
              commodityNumber: item.commodityNumber,
              amount: item.amount || '',
              onePrice: item.onePrice || '',
              costPrice: item.costPrice || '',
              priceUnit: item.commodityUnit || '',
              nonStandardParameter: item.nonStandardParameter == null || item.nonStandardParameter == '' ? '' : Number(item.nonStandardParameter),
              coefficient: item.coefficient || '',
              roomId: item.roomId,
              remarks: item.remarks || ''
            })
          });
        }
        return arr;
      }
    }
  }
</script>
