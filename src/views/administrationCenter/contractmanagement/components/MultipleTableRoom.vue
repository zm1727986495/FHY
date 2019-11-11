<template>
  <div class="tableBox" v-loading="loading">
<!--    <el-button type="primary" size="small" class="m-bottom10" v-print="'#printContentRoom'">打印1</el-button>-->
    <div class="roomTable" id="printContentRoom">
      <h2 class="printTitle">购货合同附件清单</h2>
      <div style="border: 1px solid #333" class="m-bottom15">
        <ul class="printHead">
          <li>
            <span class="itemLabel">网点：</span>
            <span class="itemValue">{{ orderDetails.storeName }}</span>
          </li>
          <li>
            <span class="itemLabel">日期：</span>
            <span class="itemValue">{{ contractDetails.signingTime }}</span>
          </li>
          <li>
            <span class="itemLabel">合同号：</span>
            <span class="itemValue">{{ contractDetails.contractSerialNumber }}</span>
          </li>
        </ul>
        <ul class="printHead">
          <li>
            <span class="itemLabel">姓名：</span>
            <span class="itemValue">{{ orderDetails.customerName }}</span>
          </li>
          <li>
            <span class="itemLabel">电话：</span>
            <span class="itemValue">{{ orderDetails.customerPhone }}</span>
          </li>
          <li class="address">
            <span class="itemLabel">地址：</span>
            <span class="itemValue">{{ orderDetails.address }}</span>
          </li>
        </ul>
        <ul class="printHead">
          <li>
            <span class="itemLabel">设计师：</span>
            <span class="itemValue">{{ orderDetails.designerName }}</span>
          </li>
          <li>
            <span class="itemLabel">设计师电话：</span>
            <span class="itemValue">{{ orderDetails.designerPhone }}</span>
          </li>
        </ul>
      </div>
      <div v-for="(item,index) in datas" :key="index">
        <table style="width: 100%;">
          <thead v-if="index == 0">
            <tr>
              <th :style="{ width: columnW1 + 'px' }">序号</th>
              <th :style="{ width: columnW2 + 'px' }">分类</th>
              <th :style="{ width: columnW3 + 'px' }">商品名称</th>
              <th :style="{ width: columnW4 + 'px' }" v-if="isFinished">货号</th>
              <th :style="{ width: columnW5 + 'px' }" v-if="isFinished">规格</th>
              <th :style="{ width: columnW6 + 'px' }">颜色</th>
              <th :style="{ width: columnW7 + 'px' }" v-if="isUnFinished">宽</th>
              <th :style="{ width: columnW8 + 'px' }" v-if="isUnFinished">高</th>
              <th :style="{ width: columnW9 + 'px' }" v-if="isUnFinished">厚</th>
              <th :style="{ width: columnW10 + 'px' }">数量</th>
              <th :style="{ width: columnW11 + 'px' }">单价</th>
              <th :style="{ width: columnW12 + 'px' }" v-if="isUnFinished">系数</th>
              <th :style="{ width: columnW13 + 'px' }" v-if="isUnFinished">折扣率</th>
              <th :style="{ width: columnW14 + 'px' }">价格</th>
              <th :style="{ width: columnW15 + 'px' }">备注</th>
            </tr>
          </thead>
          <tr v-if="group == 2 && (orderDetails.category.commodityCategoryId === 1000026 || (orderDetails.category.commodityCategoryId === 1000033 && datasRoom.length > 1))" class="tableTitle">
            <td :colspan="2">房间号：{{ item.roomCode + 1 }}</td>
            <td :colspan="isUnFinished ? 11 : 8">房间备注：{{ item.roomRemark }}</td>
          </tr>
          <tr v-else class="tableTitle">
            <td :colspan="isUnFinished ? 13 : 10">分类名称：{{ item.classifyName }}</td>
          </tr>
          <tr v-for="(info,idx) in item.orderCommodities" :key="info.orderCommodityId" :class="[{ bt1: idx == 0 }, { hoverRow: hoverCommodityId == info.orderCommodityId }, { currentRow: currentCommodityId == info.orderCommodityId }]" @mouseenter="rowMouseenter(info)" @mouseleave="rowMouseleave(info)" @click="rowClick(info)">
            <td :style="{ width: columnW1 + 'px' }">{{ idx + 1 }}</td>
            <td :style="{ width: columnW2 + 'px' }">{{ info.classifyName }}</td> <!--分类-->
            <td :style="{ width: columnW3 + 'px' }">{{ info.commodityName }}</td>
            <td :style="{ width: columnW4 + 'px' }" v-if="isFinished">{{ info.itemNumber }}</td>
            <td :style="{ width: columnW5 + 'px' }" v-if="isFinished">{{ info.commodityModel }}</td>
            <td :style="{ width: columnW6 + 'px' }">{{ info.colour }}</td>
            <td :style="{ width: columnW7 + 'px' }" v-if="isUnFinished">{{ info.width }}</td>
            <td :style="{ width: columnW8 + 'px' }" v-if="isUnFinished">{{ info.high }}</td>
            <td :style="{ width: columnW9 + 'px' }" v-if="isUnFinished">{{ info.thick }}</td>
            <td :style="{ width: columnW10 + 'px' }">{{ info.amount }}</td>
            <td :style="{ width: columnW11 + 'px' }">{{ info.onePrice }}</td>
            <td :style="{ width: columnW12 + 'px' }" v-if="isUnFinished">{{ info.nonStandardParameter }}</td>
            <td :style="{ width: columnW13 + 'px' }" v-if="isUnFinished">{{ info.discountRate }}</td>
            <td :style="{ width: columnW14 + 'px' }">{{ info.discountPrice | money }}</td>
            <td :style="{ width: columnW15 + 'px' }" v-html="info.remarks"></td>
          </tr>
        </table>
        <p class="roomTableAmount">小计：{{ item.totalPriceActivity | money }}</p>
      </div>
      <ul class="printFoot m-top10">
        <li>
          <span class="itemLabel">采用价格：</span>
          <span class="itemValue">{{ orderDetails.priceStrategyName }}</span>
        </li>
        <li>
          <span class="itemLabel">合同金额：</span>
          <span class="itemValue">{{ contractDetails.contractMoney }}</span>
        </li>
        <li>
          <span class="itemLabel">促销活动：</span>
          <span class="itemValue">{{ contractDetails.activityName }}</span>
        </li>
        <li style="width: 100%;">
          <span class="itemLabel">合同金额备注：</span>
          <span class="itemValue">{{ contractDetails.contractMoneyRemark }}</span>
        </li>
        <li>
          <span class="itemLabel">顾客认可后签名：</span>
          <span class="itemValue"></span>
        </li>
        <li>
          <span class="itemLabel">经办人签名：</span>
          <span class="itemValue"></span>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
  import { listOrderCommodity, listOrderCommodityByRoom } from '@/api/administrationCenter/contractmanagement/contractmanagement';
  import { sum } from '@/utils/pubilcFn';
  import { mapGetters } from 'vuex';
  export default {
    props: ['orderId','group'],
    mounted() {
        this.getData();
    },
    data() {
      return {
        columnW1: 30, // 序号
        columnW2: 100, // 分类
        columnW3: 150, // 名称
        columnW4: 100, // 货号
        columnW5: 100, // 规则
        columnW6: 150, // 颜色
        columnW7: 40, // 宽
        columnW8: 40, // 高
        columnW9: 40, // 厚
        columnW10: 40, // 数量
        columnW11: 70, // 单价
        columnW12: 50, // 系数
        columnW13: 40, // 折扣率
        columnW14: 70, // 价格
        columnW15: 150, // 备注
        datas: [],
        datasRoom: [],
        loading: true,
        placement: 'top',
        openDelay: 200,
        currentCommodityId: '', // 当前选中的
        hoverCommodityId: '' // 当前悬浮的,
      }
    },
    methods: {
      getData() {
        let params = {
          orderId: this.orderId ? this.orderId : this.$route.query.orderId,
          showType: this.group,
          customerContractId: this.contractId ? this.contractId : this.$route.query.contractId
        };
        listOrderCommodityByRoom(params)
          .then(response => {
            this.loading = false;
            // 橱柜-一个房间按分类，多个房间按房间
            let dataType = '';
            if (this.orderDetails.category.commodityCategoryId === 1000033) {
              dataType = 'orderBudgetRooms';
              this.datasRoom = response.data[dataType];
              if (response.data[dataType] && response.data[dataType].length > 1) { // 多个房间
                this.setPrice(response.data[dataType]);
              } else { // 1个房间
                this.loading = true;
                let paramsD = {
                  ...params,
                  showType: 1
                }
                this.getDataD(paramsD);
              }
            } else {
              dataType = params.showType == 2 ? 'orderBudgetRooms' : 'commodityClassifyVOS';
              this.setPrice(response.data[dataType]);
            }
          })
          .catch(error => {
            this.loading = false;
            console.log('合同管理/商品信息 views/administrationCenter/contractmanagement/components/audit/MultipleTableRoom:' + error);
          });
      },
      // 行鼠标悬浮
      rowMouseenter(row) {
        this.hoverCommodityId = row.orderCommodityId;
      },
      // 行鼠标离开
      rowMouseleave(row) {
        this.hoverCommodityId = '';
      },
      // 行点击
      rowClick(row) {
        this.currentCommodityId = row.orderCommodityId;
      },
      // 橱柜-按分类重新调用接口
      getDataD(params) {
        listOrderCommodityByRoom(params)
          .then(response => {
            this.loading = false;
            let dataType = 'commodityClassifyVOS';
            this.setPrice(response.data[dataType]);
          })
          .catch(error => {
            this.loading = false;
            console.log('合同管理/商品信息 views/administrationCenter/contractmanagement/components/audit/MultipleTableRoom:' + error);
          });
      },
      // 接口请求出来计算价格
      setPrice(datas) {
        if (datas && datas.length) {
          datas.forEach(item => {
            let totalPrice = 0;
            let totalPriceActivity = 0;
            if (item.orderCommodities.length) {
              item.orderCommodities.forEach(info => {
                info.onePirceFinal = sum(info.valuationMethodValue, info.width, info.high, info.deep, info.amount, info.onePrice, info.nonStandardParameter, info.discountRate, 1);
                totalPrice += Number(sum(info.valuationMethodValue, info.width, info.high, info.deep, info.amount, info.onePrice, info.nonStandardParameter, info.discountRate, 1));
                totalPriceActivity += Number(info.discountPrice);
              })
            }
            item.totalPrice = totalPrice;
            item.totalPriceActivity = totalPriceActivity;
          });
          this.datas = datas;
        }
      }
    },
    computed: {
      ...mapGetters([
        'orderDetails',
        'contractDetails'
      ]),
      // 是否是成品
      isFinished() {
        return this.orderDetails.orderGoodsType == 1;
      },
      // 是否是定制品
      isUnFinished() {
        return this.orderDetails.orderGoodsType == 2;
      }
    }
  }
</script>
<style scoped>
  .roomTable{
    font-size: 12px;
  }
  .roomTable th, .roomTable td {
    border: 1px solid #333;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    text-align: center;
    height: 30px;
    border-collapse: collapse;
  }
  .roomTable table td {
    padding: 0 5px;
  }
  .roomTable table .tableTitle td {
    text-align: left;
  }
  .roomTable .roomTableAmount {
    height: 30px;
    line-height: 30px;
    padding-left: 10px;
    color: #F56C6C;
    border: 1px solid #333;
    border-top: none;
  }
  .printHead {
    line-height: 28px;
    display: flex;
    flex-wrap: wrap;
    border-bottom: 1px solid #333;
  }
  .printHead li {
    padding: 0 15px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    width: 25%;
    border-right: 1px solid #333;
  }
  .printHead .address{
    width: 50%;
  }
  .printHead:last-child {
    border-bottom: none;
  }
  .printHead li:last-child {
    border-right: none;
  }
  .printFoot {
    line-height: 30px;
    display: flex;
    flex-wrap: wrap;
  }
  .printFoot li {
    width: 33.3%;
  }
  .itemLabel {
    font-weight: bold;
  }
  .printTitle {
    font-size: 22px;
    text-align: center;
    margin-bottom: 20px;
  }
</style>
