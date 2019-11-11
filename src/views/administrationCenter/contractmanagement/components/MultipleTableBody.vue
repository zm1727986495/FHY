<template>
  <div>
    <div v-for="(item,index) in datas" :key="item.index" class="table_list">
      <p class="tableHeader">
        <span>{{ item.classifyName }}</span>
      </p>
      <ul class="multipleTableHeader" v-for="(info,idx) in item.products" :key="info.orderCommodityId"
          :class="[{ bt1: idx == 0 }, { hoverRow: hoverCommodityId == (info.commoditySKUId + info.commodityId + idx) }, { currentRow: currentCommodityId == (info.commoditySKUId + info.commodityId + idx) }]" @mouseenter="rowMouseenter(info,idx)" @mouseleave="rowMouseleave(info)" @click="rowClick(info,idx)">
        <li>{{ idx + 1 }}</li>
        <li>{{ info.roomCode + info.roomName }}</li>
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
        <li v-if="isFinished">{{ info.itemNumber }}</li>
        <li v-if="isFinished">
          <el-tooltip :content="info.commodityModel" :placement="placement" :open-delay="openDelay">
            <el-link type="info" :underline="false">{{ info.commodityModel }}</el-link>
          </el-tooltip>
        </li>
        <li v-if="isUnFinished">{{ info.series }}</li>
        <li v-if="isUnFinished">{{ info.material }}</li>
        <li>
          <el-tooltip :content="info.colour" :placement="placement" :open-delay="openDelay">
            <el-link type="info" :underline="false">{{ info.colour }}</el-link>
          </el-tooltip>
        </li>
        <li>{{ info.onePrice }}</li>
        <li>{{ info.commodityUnit }}</li>
        <li>{{ info.valuationMethod }}</li>
        <li>{{ info.nonStandardParameter }}</li>
        <li>{{ info.amount }}</li>
        <li>{{ info.originalPrice | money }}</li>
        <li>{{ info.discountRate }}</li>
        <li>{{ info.discountPrice | money }}</li>
        <li class="commodityNumber">
          <el-tooltip :content="info.remarks" :placement="placement" :open-delay="openDelay">
            <el-link type="info" :underline="false">{{ info.remarks }}</el-link>
          </el-tooltip>
        </li>
        <li>{{ info.brandName }}</li>
        <li>{{ info.categoryName }}</li>
        <li>{{ info.width }}</li>
        <li>{{ info.high }}</li>
        <li>{{ info.deep }}</li>
        <li>{{ info.thick }}</li>
        <li>{{ info.commodityCode }}</li>
      </ul><!-- :class="{ bt1: idx === 0 }"-->
      <ul class="multipleTableHeader multipleTableAmount" v-if="item.products && item.products.length && !routedata">
        <li>总计：{{ item.totalPrice | money }}</li>
      </ul>
      <TableBody :datas="item.classifyLevel" v-if="item.classifyLevel && item.classifyLevel.length"></TableBody>
    </div>
  </div>
</template>
<script>
  import spot from '@/assets/images/spot.png';
  import { mapGetters } from 'vuex';
  export default {
    name: 'TableBody',
    data() {
      return {
        routedata: this.$route.path == '/ordermm/details',
        placement: 'top',
        openDelay: 200,
        spot,
        size: 'small',
        selection: {},
        isInStorage: false,
        isInstall: false,
        checkAll: false,
        arr: [],
        allData: [],
        currentCommodityId: '', // 当前选中的
        hoverCommodityId: '' // 当前悬浮的
      }
    },
    props: {
      datas: {
        type: Array,
        default: () => []
      },
      visible: {
        type: Boolean,
        default: () => false
      }
    },
    methods: {
      // 行鼠标悬浮
      rowMouseenter(row, idx) {
        this.hoverCommodityId = row.commoditySKUId + row.commodityId + idx;
      },
      // 行鼠标离开
      rowMouseleave(row) {
        this.hoverCommodityId = '';
      },
      // 行点击
      rowClick(row, idx) {
        this.currentCommodityId = row.commoditySKUId + row.commodityId + idx;
      }
    },
    computed: {
      ...mapGetters([
        'orderDetails'
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
