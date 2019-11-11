<template>
  <div>
    <div class="moduleHeader moduleHeaderBorder purchaseOrder">
      <div class="clearfix">
        <div class="fl m-right10">
          <label class="label fl" style="width: 65px;">采购单号</label>
          <div class="fl" style="width: 200px;">
            <el-input v-model="tablesData.purchaseNumber" :disabled="((routedata || isExecute) && !isSuperEdit && !status)" placeholder="请输入采购单号" size="mini" @blur="changePurchaseNumber"></el-input>
          </div>
<!--          <span class="line fl">-</span>-->
<!--          <div class="fl" style="width: 50px">-->
<!--            <el-input v-model="tablesData.smallNumber" placeholder="01" size="small"></el-input>-->
<!--          </div>-->
        </div>
        <div class="fl m-right10" v-if="!routedata">
          <div class="fl m-right10">
            <label class="label">是否入库：</label>
            <el-radio-group v-model="tablesData.isStorage">
              <el-radio :label="item.code" v-for="item in radioList" :key="item.code" :disabled="(isExecute && !isSuperEdit && !status)">{{item.value}}</el-radio>
            </el-radio-group>
          </div>
          <div class="fl">
            <label class="label">是否安装：</label>
            <el-radio-group v-model="tablesData.isInstall">
              <el-radio :label="item.code" v-for="item in radioList" :key="item.code" :disabled="(isExecute && !isSuperEdit && !status)">{{item.value}}</el-radio>
            </el-radio-group>
          </div>
        </div>
        <div class="fl">
          <div class="fl m-right10 companyName">供应商：{{ tablesData.companyName }}</div>
          <div class="fl cDanger" v-if="!routedata">
            <span class="fl">总计：</span>
            <span class="" @click="changeMoney" v-if="!showIpt">{{ tablesData.settlementMoney | money }}</span>
            <el-input @focus="onFocus" @input="inputMoney" v-model="allMoney" v-if="showIpt" clearable class="ipts fl" size="mini"></el-input>
          </div>
        </div>
        <div class="fr">
          采购单状态：
          <span v-if="tablesData.purchaseStatus == 1">待执行</span>
          <span v-else-if="tablesData.purchaseStatus == 2">执行完成</span>
          <span v-else-if="tablesData.purchaseStatus == 3">对账中</span>
          <span v-else-if="tablesData.purchaseStatus == 4">对账完成</span>
          <span v-else-if="tablesData.purchaseStatus == 5">结算中</span>
          <span v-else-if="tablesData.purchaseStatus == 6">结算完成</span>
        </div>
      </div>
    </div>
    <div class="tableBox tableBoxMax">
      <div class="purchaseTable multipleTable">
        <PurchaseTableBody :setQuery="setQuery" :status="status" :datas="tablesData.orderCommodity" v-if="tablesData.orderCommodity && tablesData.orderCommodity.length"></PurchaseTableBody>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import spot from '@/assets/images/spot.png';
  import PurchaseTableBody from '@/views/administrationCenter/contractmanagement/components/PurchaseTableBody';
  import { savePurchaseOrderNumber } from '@/api/administrationCenter/contractmanagement/contractmanagement';
  export default {
    name: 'PurchaseTable',
    components: {
      PurchaseTableBody
    },
    props:{
      status:{
        type:Boolean,
        default:false,
      },
      setQuery:{
        type:Boolean,
        default:true,
      }
    },
    data() {
      return {
        placement: 'top',
        openDelay: 200,
        routedata: this.$route.path == '/ordermm/details',
        size: 'medium',
        btnSize: 'small',
        spot,
        checkAll: false,
        radioList: [
          { code: 1, value: '是' },
          { code: 0, value: '否' }
        ],
        // allMoney:10,
        allMoney:0,
        showIpt:false
      }
    },
    watch: {
      "tablesData.statusChange"(val){
        if(val==0){
          this.showIpt=false;
        }
      }
    },
    computed: {
      ...mapGetters([
        'tablesData',
        'contractDetails',
        'purchaseOrderList'
      ]),
      // 是否执行完成或者下单完成 1-执行完成
      isExecute() {
        return this.tablesData.isExecute == 1 || this.contractDetails.isSignOrder == 1;
      },
      // 是否是超级编辑
      isSuperEdit() {
        return this.contractDetails.isSuperEdit == 1;
      }
    },
    methods: {
      onFocus(){
        this.$emit("changeMoney",this.allMoney)
      },
      inputMoney(val){
        this.allMoney = val.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/[^\d.]/g, "").replace(/^\./g, "").replace( /([0-9]+\.[0-9]{2})[0-9]*/,"$1");
        if (val.charAt(0) == '-') {
          this.allMoney = '-' + this.allMoney;
        }
        this.$emit("changeMoney",this.allMoney)
      },
      changeMoney(){
        if(this.status){
          if(this.tablesData.settlementMoney==null){
            this.allMoney="0.00";
          }else{
            this.allMoney=this.tablesData.settlementMoney.toFixed(2)
          }
          this.showIpt=true;
        }
      },
      // 保存采购单号
      changePurchaseNumber() {
        if (this.tablesData.purchaseNumber && this.tablesData.purchaseOrderId) {
          let params = {
            purchaseOrderId: this.tablesData.purchaseOrderId,
            purchaseNumber: this.tablesData.purchaseNumber
          }
          savePurchaseOrderNumber(params)
            .then(response => {
              if (response.message == 'success') {
                this.purchaseOrderList[this.tablesData.tabIndex].purchaseNumber = this.tablesData.purchaseNumber;
                this.$message.success('保存成功');
              } else {
                this.$message.error(response.message || '操作失败');
              }
            })
        }
      }
    }
  }
</script>
<style scoped>
  .line{
    padding: 0 5px;
  }
  .ipts{
    width: 150px;
  }
</style>
