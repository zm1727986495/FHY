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
        <el-tab-pane label="拆单管理" name="1">
          <AuditInformation :audit-type="2" v-if="tabActive == 1"></AuditInformation>
        </el-tab-pane>
        <el-tab-pane label="图纸审核" name="2">
          <div style="position: relative">
            <div class="btnList">
              <el-button class="button-96" :size="btnSize" @click="handlePass" :disabled="contractDetails.drawingAuditStatus == 1" v-if="btn_drawingPass" :loading="loadingBtn">通过</el-button>
              <el-button class="button-96" :size="btnSize" @click="handleReject" :disabled="contractDetails.drawingAuditStatus == 2" v-if="btn_drawingReject" :loading="loadingBtn">图纸驳回</el-button>
            </div>
            <accessory :accessory-types="6" :btns="btns" :is-dialog="false" v-if="tabActive == 2"></accessory>
          </div>
        </el-tab-pane>
        <el-tab-pane label="违规审核" name="3" v-if="!isSampleSingle">
          <AuditIllegal v-if="tabActive == 3"></AuditIllegal>
        </el-tab-pane>
        <el-tab-pane label="审核记录" name="4" v-if="!isSampleSingle">
          <AuditRecords v-if="tabActive == 4"></AuditRecords>
        </el-tab-pane>
      </el-tabs>
    </div>
    <!--驳回弹出层-->
    <el-dialog title="提示" :visible.sync="dialogReject" append-to-body custom-class="customDialogTitle">
      <el-alert title="当前图纸信息不符合规定，不予通过" class="customAlert" type="error" show-icon :closable="false"></el-alert>
      <el-form :model="rejectForm" ref="rejectForm" label-width="100px">
        <el-form-item label="驳回原因">
          <el-input v-model="rejectForm.rejectReason" type="textarea" placehoder="请输入驳回原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rejectFormSubmit()">确 定</el-button>
        <el-button @click="dialogReject = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import spot from '@/assets/images/spot.png';
  import breadcrumb from "../../components/breadcrumb";
  import orderdetail from "@/views/order/components/orderdetail";
  import contractdetails from "@/views/administrationCenter/contractmanagement/components/contractdetails";
  import commodity from "@/views/administrationCenter/contractmanagement/components/commodity"
  import AuditInformation from "@/views/administrationCenter/contractmanagement/components/audit/AuditInformation"
  import AuditIllegal from "@/views/administrationCenter/contractmanagement/components/audit/AuditIllegal"
  import AuditRecords from "@/views/administrationCenter/contractmanagement/components/audit/AuditRecords"
  import accessory from "@/views/administrationCenter/contractmanagement/components/accessory";
  import { updateCustomerContract } from 'src/api/administrationCenter/contractmanagement/contractmanagement';
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
    data() {
      return {
        loadingBtn: false,
        btn_drawingPass: false,
        btn_drawingReject: false,
        spot,
        size: 'medium',
        btnSize: 'small',
        columnAlign: 'center',
        navList: [],
        btns: [4, 5, 6],
        contractId: this.$route.query.contractId,
        orderId: this.$route.query.orderId,
        tabActive: '1',
        companyList: [], // 供应商列表
        roomList: [], // 房间列表
        dialogReject: false,
        rejectForm: {
          rejectReason: ''
        }
      };
    },
    created() {
      // this.getBaseDict('COMMODITY_COLOR');
      // this.getBaseDict('COMMODITY_SERIES');
      // this.getBaseDict('COMMODITY_MATERIAL');
      this.getBaseDict('ROOM_TYPE');
      this.getCompanyList();
      this.initBtnElements();
    },
    props: [],
    mounted() {
      // 头部面包屑
      this.navList = this.$route.meta;
    },
    methods: {
      // 获取按钮权限
      initBtnElements() {
        let element = JSON.parse(this.$loca.getItem('element'));
        this.btn_drawingPass = element['placeOrderContract:btn_drawingPass']; // 图纸审核-通过
        this.btn_drawingReject = element['placeOrderContract:btn_drawingReject']; // 图纸审核-驳回
      },
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
      // 驳回弹出层
      handleReject() {
        this.dialogReject = true;
      },
      // 驳回弹出层确认
      rejectFormSubmit() {
        this.$confirm('确认驳回?', '提示', {
          type: 'warning'
        }).then(() => {
          let params = {
            customerContractId: Number(this.contractId),
            orderId: this.orderId,
            auditStatus: 2,
            drawingAuditStatus: 2
          }
          this.loadingBtn = true;
          updateCustomerContract(params)
            .then(response => {
              if (response.status == 200) {
                this.$message.success('操作成功');
                this.contractDetails.drawingAuditStatus = 2;
                this.dialogReject = false;
              } else {
                this.$message.error('操作失败');
              }
              this.loadingBtn = false;
            })
            .catch(error => {
              this.loadingBtn = false;
              console.log('views/administrationCenter/contractmanagement/audit.vue:rejectFormSubmit' + error);
            });
        }).catch(() => {});
      },
      // 通过
      handlePass() {
        this.$confirm('确认通过?', '提示', {
          type: 'warning'
        }).then(() => {
          this.loadingBtn = true;
          let params = {
            customerContractId: Number(this.contractId),
            orderId: this.orderId,
            auditStatus: 1,
            drawingAuditStatus: 1
          };
          updateCustomerContract(params)
            .then(response => {
              if (response.status == 200) {
                this.$message.success('操作成功');
                this.contractDetails.drawingAuditStatus = 1;
                this.dialogReject = false;
              } else {
                this.$message.error('操作失败');
              }
              this.loadingBtn = false;
            })
            .catch(error => {
              this.loadingBtn = false;
              console.log('views/administrationCenter/contractmanagement/audit.vue:handlePass' + error);
            });
        }).catch(() => {});
      },
      // 返回列表页
      goBack() {
        this.$router.go(-1);
      }
    },
    computed: {
      ...mapGetters([
        'contractDetails'
      ]),
      // 判断是否是上样单
      isSampleSingle() {
        return this.$route.query.contractType == 2;
      }
    }
  };
</script>
<style scoped>
  .btnList{
    position: absolute;
    right: 0;
    top: 0;
  }
</style>
