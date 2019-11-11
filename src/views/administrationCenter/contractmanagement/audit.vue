<template>
  <div class="wrapper lvs">
    <div class="apper">
      <div class="head_nav clearfix">
        <breadcrumb :navList="navList"></breadcrumb>
<!--        <el-button @click="goBack" class="fr" size="small" type="primary">返回</el-button>-->
      </div>
      <orderdetail></orderdetail>
      <contractdetails :contract-id="contractId"></contractdetails>
      <el-tabs type="border-card" v-model="tabActive" class="auditTabs">
        <el-tab-pane label="信息审核" name="1">
          <AuditInformation v-if="tabActive == 1"></AuditInformation>
        </el-tab-pane>
        <el-tab-pane label="违规审核" name="3">
          <AuditIllegal v-if="tabActive == 3"></AuditIllegal>
        </el-tab-pane>
        <el-tab-pane label="图纸审核" name="2">
          <accessory :accessory-types="6" :btns="btns" :is-dialog="false" v-if="tabActive == 2"></accessory>
        </el-tab-pane>
        <el-tab-pane label="审核记录" name="4">
          <AuditRecords v-if="tabActive == 4"></AuditRecords>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
  import spot from '@/assets/images/spot.png';
  import breadcrumb from "@/views/components/breadcrumb";
  import orderdetail from "@/views/order/components/orderdetail";
  import contractdetails from "@/views/administrationCenter/contractmanagement/components/contractdetails";
  import commodity from "@/views/administrationCenter/contractmanagement/components/commodity";
  import AuditInformation from "@/views/administrationCenter/contractmanagement/components/audit/AuditInformation";
  import AuditIllegal from "@/views/administrationCenter/contractmanagement/components/audit/AuditIllegal";
  import AuditRecords from "@/views/administrationCenter/contractmanagement/components/audit/AuditRecords";
  import accessory from "@/views/administrationCenter/contractmanagement/components/accessory";
  import { listBaseDict, listCompanyByAll } from 'api/pulicJava';
  export default {
    components: {
      breadcrumb,
      orderdetail,
      contractdetails,
      commodity,
      AuditInformation,
      AuditIllegal,
      AuditRecords,
      accessory
    },
    created() {
      this.getBaseDict('COMMODITY_COLOR');
      this.getBaseDict('COMMODITY_SERIES');
      this.getBaseDict('COMMODITY_MATERIAL');
      this.getBaseDict('ROOM_TYPE');
      this.getCompanyList();
    },
    data() {
      return {
        spot,
        size: 'medium',
        btnSize: 'small',
        columnAlign: 'center',
        navList: [],
        btns: [4, 5, 6],
        colorList: [],
        seriesList: [],
        materialList: [],
        contractId: this.$route.query.contractId,
        orderId: this.$route.query.orderId,
        tabActive: '1',
        companyList: [], // 供应商列表
        roomList: [], // 房间列表
      };
    },
    mounted() {
      // 头部面包屑
      this.navList = this.$route.meta;
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 基础字典查询（颜色、材质、系列）
      getBaseDict(dataType) {
        let params = {
          dataType: dataType
        }
        listBaseDict(params)
          .then(response => {
            response.data.forEach(item => {
              item.id = item.id + '';
            })
            if (dataType === 'COMMODITY_COLOR') {
              this.colorList = response.data;
              this.$store.dispatch('SET_COLOR_LIST', response.data);
            }
            if (dataType === 'COMMODITY_SERIES') {
              this.seriesList = response.data;
              this.$store.dispatch('SET_SERIES_LIST', response.data);
            }
            if (dataType === 'COMMODITY_MATERIAL') {
              this.materialList = response.data;
              this.$store.dispatch('SET_MATERIAL_LIST', response.data);
            }
            if (dataType === 'ROOM_TYPE') {
              this.roomList = response.data;
              this.$store.dispatch('SET_ROOM_LIST', response.data);
            }
          })
          .catch(error => {
            console.log('views/contractmanagement/audit.vue:getBaseDict' + error)
          })
      },
      // 获取供应商
      getCompanyList() {
        listCompanyByAll({ companyType: 1 })
          .then(response => {
            this.companyList = response.data;
            this.$store.dispatch('SET_COMPANY_LIST', response.data);
          })
          .catch(error => {
            console.log('views/contractmanagement/audit.vue:getCompanyList', error);
          })
      },
      // 返回列表页
      goBack() {
        this.$router.go(-1);
      }
    },
    computed: {
      // 判断是否是备货采购单
      isStockOrder() {
        return this.$route.query.billType == 2;
      }
    }
  };
</script>
