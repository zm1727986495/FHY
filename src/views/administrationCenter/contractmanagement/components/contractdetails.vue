<template>
  <div class="contractdetails m-bottom15" v-if="!isSampleSingle">
    <collapsecompoent :is-show="isShow">
      <div slot="titles">合同信息</div>
      <div slot="content" class="contract">
        <ul class="customerlist">
          <li>客户合同号：{{ contractInfo.contractSerialNumber }}</li>
          <li>合同签订日期：{{ contractInfo.signingTime }}</li>
          <li>预计安装时间：{{ contractInfo.predictInstallTime }}</li>
          <li>活动：{{ contractInfo.activityName }}</li>
          <li>商品原价：{{ contractInfo.goodsOriginalPrice }}</li>
          <li>折后金额：{{ contractInfo.goodsAmount }}</li>
          <li>其他费用合计：{{ contractInfo.otherCost}}</li>
          <li>合同金额：{{ contractInfo.contractMoney }}</li>
          <li>特批折扣：{{ contractInfo.specialDiscountName }}</li>
          <li>预计工期：{{ contractInfo.predictGq }}</li>
          <li>加急工期：{{ contractInfo.urgentGq }}</li>
          <li>工期差/天：{{ getGapGq }}</li>
          <li>上传下单图日期：{{ contractInfo.uploadPlaceOrderAccessoryTime }}</li>
          <li class="block" style="width: 100%">合同金额备注：{{ contractInfo.contractMoneyRemark }}</li>
        </ul>
      </div>
    </collapsecompoent>
  </div>
</template>

<script>
  import collapsecompoent from "@/views/components/collapsecompoent";//收起展开组件
  import { mapGetters } from 'vuex';
  import { getCustomerContract, getStockUpPurchaseOrder, listPurchaseOrder } from '@/api/administrationCenter/contractmanagement/contractmanagement';
  export default {
    components: {
      collapsecompoent
    },
    props: ['contractId','orderId'],
    created() {
      this.getCustomerContract(); // 正单
    },
    data() {
      return {
        isShow: false,
        customerContractId: this.$route.query.contractId,
        contractInfo: {},
        code: ''
      }
    },
    methods: {
      // 获取合同信息
      getCustomerContract() {
        this.$store.dispatch('SET_CONTRACT_DETAILS', {});
        let _this = this;
        let params = {
          orderId: this.orderId?this.orderId:this.$route.query.orderId,
          customerContractId: this.customerContractId
        };
        getCustomerContract(params)
          .then(response => {
            if(response.status == 200) {
              response.data.contractSerialNumber = response.data.contractSerialNumber || '';
              this.contractInfo = response.data;
              let contractInfo = {
                contractMoney: response.data.contractMoney || '',
                contractSerialNumber: response.data.contractSerialNumber || '',
                auditStatus: response.data.auditStatus, // 审核状态
                isSplitOrder: response.data.isSplitOrder, // 是否拆单
                isSuperEdit: 0,
                isMain: response.data.isMain, // 1是 0否
                isSignOrder: response.data.isSignOrder, // 是否下单完成
                purchaseContractCode: response.data.purchaseContractCode || '', // 采购合同号
                splitOrderAt: response.data.splitOrderAt || '', // 拆单人
                splitOrderTime: response.data.splitOrderTime || '', // 拆单时间
                drawingAuditStatus: response.data.drawingAuditStatus || '', // 图纸审核状态
                activityName: response.data.activityName || '', // 活动
                contractMoneyRemark: response.data.contractMoneyRemark || '', // 合同金额备注
                signingTime: response.data.signingTime
              };
              this.$store.dispatch('SET_CONTRACT_DETAILS', contractInfo);
              if (response.data.isSplitOrder == 1) {
                _this.getPurchaseOrderList();
              }
            } else {
              this.$store.dispatch('SET_CONTRACT_DETAILS', contractInfo);
            }
          })
          .catch(error => {
            this.$store.dispatch('SET_CONTRACT_DETAILS', {});
            console.log('views/administrationCenter/contractmanagement/components/contractdetails' + error);
          });
      },
      // 获取备货单信息
      getStockUpPurchaseOrder() {
        this.$store.dispatch('SET_CONTRACT_DETAILS', {});
        let _this = this;
        let params = {
          StockUpPurchaseOrderId: this.customerContractId,
          customerContractId: this.customerContractId
        };
        getStockUpPurchaseOrder(params)
          .then(response => {
            response.data.contractSerialNumber = response.data.contractSerialNumber || '';
            this.contractDetails = response.data;
            let contractInfo = {
              isSplitOrder: response.data.isSplitOrder,
              purchaseContractCode: response.data.stockUpPurchaseOrderCode || '' // 采购合同号
            };
            this.$store.dispatch('SET_CONTRACT_DETAILS', contractInfo);
            if (response.data.isSplitOrder) {
              _this.getPurchaseOrderList();
            }
          })
          .catch(error => {
            this.$store.dispatch('SET_CONTRACT_DETAILS', {});
            console.log('views/administrationCenter/contractmanagement/components/contractdetails-getStockUpPurchaseOrder:' + error);
          });
      },
      // 获取采购单列表
      getPurchaseOrderList() {
        this.$store.dispatch('SET_PURCHASE_ORDER_LIST', []);
        let params = {
          customerContractId: this.customerContractId,
          contractType: this.$route.query.contractType,
          StockUpPurchaseOrderId: this.customerContractId,
          orderId: this.$route.query.orderId
        };
        listPurchaseOrder(params)
          .then(response => {
            if (response.data && response.data.length && response.data[0]) {
              this.$store.dispatch('SET_PURCHASE_ORDER_LIST', response.data);
            } else {
              this.$store.dispatch('SET_PURCHASE_ORDER_LIST', []);
            }
          })
          .catch(error => {
            this.$store.dispatch('SET_PURCHASE_ORDER_LIST', []);
            console.log('views/administrationCenter/contractmanagement/components/contractdetails' + error);
          });
      }
    },
    computed: {
      // 判断是否是上样单
      isSampleSingle() {
        return this.$route.query.contractType == 2;
      },
      ...mapGetters([
        'orderDetails',
        'contractDetails'
      ]),
      // 计算工期差:预计安装日期-签合同日期-预计工期
      getGapGq() {
        return Math.ceil((new Date(this.contractInfo.predictInstallTime).getTime() - new Date(this.contractInfo.signingTime).getTime() - this.contractInfo.predictGq * 24 * 3600 * 1000) / 24 / 60 / 60 / 1000);
      }
    }
  };
</script>

<style lang="scss" scoped>
    .contractdetails{
        .titlecals {
          top: 0;
        }
        .contract {
          padding: 10px 0px;
        }
        .customerlist{
            padding: 0 40px;
            display: flex;
            /*justify-content: space-between;*/
            flex-wrap: wrap;
            font-size: 13px;
            color: #333333;
        }
        .customerlist li {
            width: 25%;
            line-height: 30px;
        }
        .xiala{
          font-size: 14px;
          color: rgb(83, 168, 255);
          cursor: pointer;
        }
    }
</style>

