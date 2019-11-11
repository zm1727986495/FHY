<template>
  <div class="details_box">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <orderdetail></orderdetail>
    <el-card class="cardclass">
      <!-- 金额列表 -->
      <ul class="detail_card">
        <li class="green_color">
          <div class="detil_icon"></div>
          <div class="text_box">
            <p>收款金额</p>
            <p class="money_style">{{mountedata.collectMoney | fenge}}</p>
          </div>
        </li>
        <li class="red_color">
          <div class="detil_icon"></div>
          <div class="text_box">
            <p>退款金额</p>
            <p class="money_style">{{mountedata.refundableAmount | fenge}}</p>
          </div>
        </li>
        <li class="yellow_color">
          <div class="detil_icon"></div>
          <div class="text_box">
            <p>合同金额</p>
            <p class="money_style">{{mountedata.contractMoney | fenge}}</p>
          </div>
        </li>
        <!-- <li class="blue_color">
            <div class="detil_icon"></div>
            <div class="text_box">
                <p>实际合同金额</p>
                <p class="money_style">{{mountedata.actualContractMoney | fenge}}</p>
            </div>
        </li> -->
      </ul>
      <!-- 订单步骤列表 -->
      <ul class="steps_box" v-if="stepdata.length > 0">
        <li :class="{activeli: idx < sizeval}"
            v-for="(itm, idx) in stepdata"
            :key="idx">{{itm.orderProcessConfigureName}}</li>
      </ul>
    </el-card>

    <el-tabs type="border-card" v-model="defaultselectone" class="tabsclas">
      <el-tab-pane :label="item" v-for="(item, idx) in tablistone" :name="idx+''" :key="idx"></el-tab-pane>
      <!-- 附属订单、礼品、违规信息组件  (活动信息) -->
      <tablecompon :defaultselectone="defaultselectone"
                   v-if="defaultselectone == 0 || defaultselectone == 4 || defaultselectone == 17">
      </tablecompon>
      <!-- 收/退费信息、审单信息、结算信息、安装信息、 (回访信息组件、送货信息、)-->
      <div v-if="defaultselectone == 1 || defaultselectone == 7">
        <basicson :defaultselectone="defaultselectone">
        </basicson>
      </div>
      <!-- 测量设计 -->
      <surveydesign v-if="defaultselectone == 2"></surveydesign>
      <!-- 商品信息 -->
      <commodity v-if="defaultselectone == 3" :order-id="orderId"></commodity>
      <!-- 合同信息 -->
      <contractinfocompon v-if="defaultselectone == 5"></contractinfocompon>
      <!-- 申请信息 -->
      <applicainformation v-if="defaultselectone == 6"></applicainformation>

      <!-- 合同拆单/库取单 -->
      <!-- 合同拆单/采购合同 -->
      <PurchaseContract v-if="defaultselectone == 8 && purchaseOrderList.length"></PurchaseContract>
      <div class="martop" v-if="defaultselectone == 8">
        <WarehouseListTable></WarehouseListTable>
      </div>
      <!-- 返点信息 -->
      <returnpoint v-if="defaultselectone == 9"></returnpoint>
      <!-- 安装信息 -->
      <installList v-if="defaultselectone == 10"></installList>
      <!-- 售后信息 -->
      <saletaskList v-if="defaultselectone == 11"></saletaskList>
      <!-- 赔偿信息 -->
      <compensatepon v-if="defaultselectone == 12"></compensatepon>
      <!-- 订单跟进记录组件 -->
      <followuprecord v-if="defaultselectone == 15"></followuprecord>
      <!-- 基础信息组件 -->
      <basicinformation v-if="defaultselectone == 16"></basicinformation>
      <!-- 相关评价 -->
      <evaluatecompon v-if="defaultselectone == 14"></evaluatecompon>
      <!-- 附件管理 -->
      <div v-if="defaultselectone == 13">
        <accessory :orderId="orderId" :accessoryTypes="accessoryTypes"></accessory>
      </div>
    </el-tabs>
  </div>
</template>
<script>
  import breadcrumb from "@/views/components/breadcrumb";
  import orderdetail from "../../components/orderdetail";//订单信息组件
  import tablecompon from "./components/tablecompon"//切换中表格组件
  import returnpoint from "./components/returnpoint"//返点信息组件
  // import installcompon from "./components/installcompon"//安装信息组件
  import compensatepon from "./components/compensatepon"//赔偿信息组件
  import basicinformation from "./components/basicinformation"//基础信息组件
  import followuprecord from "./components/followuprecord"//订单跟进记录组件
  import evaluatecompon from "./components/evaluatecompon"//相关评价组件
  import accessory from "@/views/administrationCenter/contractmanagement/components/accessory"//附件管理组件引入
  import installList from "@/views/Installation/dispatchcenter/tasklist/index";//安装任务列表
  import saletaskList from "@/views/entrepotSet/aftermarket/repaircenter/components/saletaskList";                                     //售后任务列表
  import basicson from "./components/basicson"//收/退费信息、合同审核、结算信息、送货信息、安装信息、回访信息组件
  import surveydesign from "./components/surveydesign"//测量设计
  import commodity from '@/views/administrationCenter/contractmanagement/components/commodity';//商品信息
  import contractinfocompon from "./components/contractinfocompon"//合同信息
  import applicainformation from "./components/applicainformation"//申请信息
  import WarehouseListTable from '@/views/administrationCenter/contractmanagement/components/WarehouseListTable';//库取单
  import { getOrderMoney, getRelOrderProcessHis } from 'api/order/order/orderdetails';
  import PurchaseContract from '@/views/administrationCenter/contractmanagement/components/PurchaseContract';//合同拆单
  import { listPurchaseOrder } from '@/api/administrationCenter/contractmanagement/contractmanagement';
  import { mapGetters } from "vuex"
  import {
    getCustomerContract,//查询合同基本信息
  } from 'api/order/contract/contract';
  export default {
    components: {
      breadcrumb, orderdetail, tablecompon, returnpoint, compensatepon,
      accessory, basicinformation, followuprecord, evaluatecompon,
      installList, saletaskList, basicson, surveydesign, commodity,
      contractinfocompon, applicainformation, WarehouseListTable,
      PurchaseContract,
    },
    data(){
      return {
        stepdata: [],
        sizeval: "",
        customerContractId: "",
        mountedata: {
          collectMoney: "",
          actualContractMoney: "",
          contractMoney: "",
          refundableAmount: "",
        },
        moneyval: "100000",
        orderId: this.$route.query.orderId,
        accessoryTypes: 1,
        navList: [],
        defaultselectone: 0,
        stepsdata: ["新建订单", "指派测量", "测量汇报", "指派设计", "设计汇报", "签合同", "合同审核", "合同拆单", "下单", "下单完成"],
        //第一层切换
        tablistone: [
          "附属订单", "收退费", "测量设计", "商品信息", "礼品", "合同信息", "申请信息",
          "审单信息", "合同拆单", "返点信息", "安装信息", "售后信息", "赔偿信息",
          "附件管理", "400回访评价", "订单跟进", "订单需求", "违规处罚",
        ],
      }
    },
    watch: {
      '$route':function(val){
        this.orderId = val.query.orderId
        this.startgetTing()
        
      }
    },
    created() {
      // let data = {
      //   orderId: this.orderId
      // }
      // //获取订单钱款信息
      // getOrderMoney(data).then(res => {
      //   if(res.status == 200) {
      //     this.mountedata = res.data;
      //   }
      // }).catch(error => {
      //   console.log('订单管理:订单列表 order/order/components/ordFollow.vue', error);
      // })
      // // 订单状态步骤
      // getRelOrderProcessHis(data).then(res => {
      //   if(res.status == 200) {
      //     this.stepdata = res.data.process;
      //     this.sizeval = res.data.size
      //   }
      // }).catch(error => {
      //   console.log('订单管理:订单列表 order/order/components/ordFollow.vue', error);
      // })
      // this.activecli();
      this.startgetTing()
    },
    mounted() {
      this.navList = this.$route.meta;
    },
    // activated(){
    //   this.startgetTing()
    // },
    // deactivated () {
    //   this.$destroy(true)
    // },
    filters: {
      // 千分号过滤方法
      fenge(val){
        return (val*1).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, '$1,')
      }
    },
    methods: {
      startgetTing(){
        let data = {
          orderId: this.orderId
        }
        //获取订单钱款信息
        getOrderMoney(data).then(res => {
          if(res.status == 200) {
            this.mountedata = res.data;
          }
        }).catch(error => {
          console.log('订单管理:订单列表 order/order/components/ordFollow.vue', error);
        })
        // 订单状态步骤
        getRelOrderProcessHis(data).then(res => {
          if(res.status == 200) {
            this.stepdata = res.data.process;
            this.sizeval = res.data.size
          }
        }).catch(error => {
          console.log('订单管理:订单列表 order/order/components/ordFollow.vue', error);
        })
        this.activecli();
      },
      activecli(){
        let orderId = this.orderId;
        this.$store.dispatch('SET_CONTRACT_DETAILS', {});
        getCustomerContract({orderId: orderId}).then(res =>{
          if(res.status == 200){
            // 合同id有的时候回显
            if(res.data.customerContractId){
              this.$store.dispatch('SET_CONTRACT_DETAILS', res.data);
              this.customerContractId = res.data.customerContractId;
              this.Contractfun()
            }else{
              this.$store.dispatch('SET_CONTRACT_DETAILS', {});
              this.$store.dispatch('SET_PURCHASE_ORDER_LIST', []);
              this.$message.warning("该订单没有签订合同");
            }
          }
        }).catch(error =>{
          this.$store.dispatch('SET_CONTRACT_DETAILS', {});
          this.$store.dispatch('SET_PURCHASE_ORDER_LIST', []);
          console.log('合同详情:获取合同信息 order/order/order.vue', error);
        })
      },
      Contractfun(){
        this.$store.dispatch('SET_PURCHASE_ORDER_LIST', []);
        let params = {
          customerContractId: this.customerContractId,
          billType: 1
        };
        listPurchaseOrder(params).then(response => {
          if (response.data && response.data.length && response.data[0]) {
            this.$store.dispatch('SET_PURCHASE_ORDER_LIST', response.data);
          } else {
            this.$store.dispatch('SET_PURCHASE_ORDER_LIST', []);
          }
        }).catch(error => {
          this.$store.dispatch('SET_PURCHASE_ORDER_LIST', []);
          console.log('views/administrationCenter/contractmanagement/components/contractdetails' + error);
        });
      }
    },
    computed: {
      ...mapGetters([
        'purchaseOrderList',
      ]),
    },
  }
</script>
<style lang="scss" scoped>
  .details_box{
    .tabsclas{
      min-height: 500px;
    }
    .cardclass{
      margin-bottom: 10px;
      .detail_card{
        width: 100%;
        justify-content: space-around;
        display: flex;
        .green_color{
          border: 1px solid #35961d;
          background: #f3fff1;
          color: #35961d;
          .detil_icon{
            // border: 1px solid #35961d;
            background: url("../../../../assets/images/icon_receivables.png") no-repeat center;
            background-size: 80% 85%;
          }
        }
        .red_color{
          border: 1px solid #e70404;
          background: #fff1f1;
          color: #e70404;
          .detil_icon{
            // border: 1px solid #e70404;
            background: url("../../../../assets/images/icon_refund.png") no-repeat center;
            background-size: 80% 85%;
          }
        }
        .yellow_color{
          border: 1px solid #e99904;
          background: #fefff1;
          color: #e99904;
          .detil_icon{
            // border: 1px solid #e99904;
            background: url("../../../../assets/images/icon_contract.png") no-repeat center;
            background-size: 80% 85%;
          }
        }
        .blue_color{
          border: 1px solid #008cff;
          background: #f1f4ff;
          color: #008cff;
          .detil_icon{
            // border: 1px solid #008cff;
            background: url("../../../../assets/images/icon_actual.png") no-repeat center;
            background-size: 80% 85%;
          }
        }
        li{
          border-radius: 5px;
          padding: 10px 10px;
          display: flex;
          justify-content: space-between;
          .detil_icon{
            width: 40px;
            height: 40px;
            border-radius: 50%;
            margin-right: 10px;
          }
          +li{
            margin-left: 20px;
          }
          .text_box{
            // min-width: 120px;
            display: flex;
            justify-content: space-around;
            flex-direction: column;
            .money_style{
              font-size: 20px;
            }
          }
        }
      }
    }
    .steps_box{
      width: 100%;
      margin-top: 10px;
      display: flex;
      overflow-x: auto;
      li{
        min-width: 110px;
        flex: 1;
        text-align: center;
        padding: 45px 0px 0px 0px;
        position: relative;
        color: #666666;
        &.activeli{
          &::after{
            border: 2px solid orange;
          }
          &::before{
            border: 1px solid lightgrey;
          }
        }
        &::after{
          position: absolute;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          display: block;
          content: "";
          width: 25px;
          height: 25px;
          border: 2px solid #85c229;
          border-radius: 50%;
          background: #ffffff;
          z-index: 2;
        }
        &::before{
          z-index: 1;
          position: absolute;
          top: 26px;
          left: -50%;
          display: block;
          content: "";
          width: 100%;
          height: 0;
          border: 1px dashed lightgrey;
        }
      }
      :first-of-type{
        &::before{
          display: none;
        }
      }
    }
    .titlecals{
      top: 0;
      margin-bottom: 20px;
    }
    .martop{
      margin-top: 20px;
    }
  }
</style>
