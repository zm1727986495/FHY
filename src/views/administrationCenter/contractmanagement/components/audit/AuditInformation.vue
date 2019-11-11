<template>
  <div class="tableBox auditInformation">
    <div class="moduleHeader clearfix m-bottom10">
      <div class="fl" v-if="auditType == 2">
        <label class="label fl">采购合同号</label>
        <div class="fl">
          <el-input v-model="contractDetails.purchaseContractCode" clearable placeholder="请输入采购合同号" size="mini"></el-input>
        </div>
        <el-button class="button-96 fl m-left10" style="margin-top: 2px" :size="btnSize" @click="savePurchaseOrder" v-if="btn_saveNumber" :loading="loadingBtn">保存</el-button>
      </div>
      <div class="btnList fr">
        <el-button class="button-96" :size="btnSize" @click="superEdit" :disabled="isSuperEdit" v-if="btn_isSuperEdit">超级编辑</el-button>
        <el-button class="button-96" :size="btnSize" @click="handleSplitOrder" :disabled="isCanSplitOrder" v-if="auditType == 2 && btn_splitOrder" :loading="loadingBtn">拆单</el-button>
        <el-button class="button-96" :size="btnSize" @click="handlePass" v-if="auditType == 1 && btn_infoPass" :disabled="contractDetails.auditStatus == 1">通过</el-button>
        <el-button class="button-96" :size="btnSize" @click="executePass" v-if="auditType == 2 && btn_placeOrderCompleted" :disabled="(!isCanSplitOrder || contractDetails.isSignOrder == 1) && !isSuperEdit">下单完成</el-button>
        <el-button class="button-96" :size="btnSize" @click="handleReject" :disabled="(isCanSplitOrder || (contractDetails.auditStatus == 1 && auditType == 1)) && !isSuperEdit" v-if="btn_infoRefuse">整单驳回</el-button>
      </div>
    </div>
    <el-tabs type="border-card" v-model="tabActive" class="auditInformation">
      <el-tab-pane label="采购合同" name="4" v-if="contractDetails.isSplitOrder == 1 && auditType == 2">
        <PurchaseContract v-if="tabActive == 4"></PurchaseContract>
      </el-tab-pane>
      <el-tab-pane label="采购单列表" name="3" v-if="contractDetails.isSplitOrder == 1 && auditType == 2">
        <PurchaseListTable v-if="tabActive == 3"></PurchaseListTable>
      </el-tab-pane>
      <el-tab-pane label="库取单" name="5" v-if="contractDetails.isSplitOrder == 1 && auditType == 2 && !isSampleSingle">
        <WarehouseListTable v-if="tabActive == 5"></WarehouseListTable>
      </el-tab-pane>
      <el-tab-pane label="商品信息" name="2">
        <commodity v-if="tabActive == 2" :auditType="auditType"></commodity>
      </el-tab-pane>
      <el-tab-pane label="自有商品" name="6" v-if="!isSampleSingle">
        <CommodityPrivate v-if="tabActive == 6"></CommodityPrivate>
      </el-tab-pane>
      <el-tab-pane label="礼品" name="7" v-if="!isSampleSingle">
        <GiftTable v-if="tabActive == 7"></GiftTable>
      </el-tab-pane>
      <el-tab-pane label="合同附件" name="8" v-if="!isSampleSingle">
        <Appendix v-if="tabActive == 8"></Appendix>
      </el-tab-pane>
<!--      <el-tab-pane label="合同款清详情" name="9" v-if="!isSampleSingle">-->
<!--        <ContractPaymentDetails v-if="tabActive == 9"></ContractPaymentDetails>-->
<!--      </el-tab-pane>-->
      <el-tab-pane label="收退款详情" name="1" v-if="!isSampleSingle">
        <ReceiveRefundDetails v-if="tabActive == 1"></ReceiveRefundDetails>
      </el-tab-pane>
    </el-tabs>
    <!--驳回弹出层-->
    <el-dialog title="提示" :visible.sync="dialogReject" append-to-body custom-class="customDialogTitle" :close-on-click-modal="false">
      <el-alert title="当前合同信息不符合规定，不予通过" class="customAlert" type="error" show-icon :closable="false"></el-alert>
      <el-form :model="rejectForm" :rules="rules" ref="rejectForm" label-width="100px">
        <el-form-item label="驳回原因">
          <el-input v-model="rejectForm.rejectReason" type="textarea" placehoder="请输入驳回原因"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="rejectFormSubmit('rejectForm')" :loading="loadingBtn">确 定</el-button>
        <el-button @click="dialogReject = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--审核通过弹出层-->
    <el-dialog title="提示" :visible.sync="dialogPass" append-to-body custom-class="customDialogTitle" :close-on-click-modal="false">
      <el-alert title="合同信息已审核无误，无违规操作" class="customAlert" type="success" show-icon :closable="false"></el-alert>
      <el-form :model="passForm" :rules="rules" ref="passForm" label-width="80px">
        <el-form-item label="备注">
          <el-input v-model="passForm.remarks" type="textarea" placehoder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="passFormSubmit" :loading="loadingBtn">确 定</el-button>
        <el-button @click="dialogPass = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import commodity from '@/views/administrationCenter/contractmanagement/components/commodity';
  import ReceiveRefundDetails from '@/views/administrationCenter/contractmanagement/components/ReceiveRefundDetails';
  import PurchaseListTable from '@/views/administrationCenter/contractmanagement/components/PurchaseListTable';
  import Appendix from '@/views/administrationCenter/contractmanagement/components/Appendix';
  import ContractPaymentDetails from '@/views/administrationCenter/contractmanagement/components/ContractPaymentDetails';
  import GiftTable from '@/views/administrationCenter/contractmanagement/components/GiftTable';
  import CommodityPrivate from '@/views/administrationCenter/contractmanagement/components/CommodityPrivate';
  import WarehouseListTable from '@/views/administrationCenter/contractmanagement/components/WarehouseListTable';
  import PurchaseContract from '@/views/administrationCenter/contractmanagement/components/PurchaseContract';
  import { splitOrder, insertPurchaseContractCode, listPurchaseOrder, executePass, dismissCustomerContract, updateCustomerContract, splitStockUpOrder } from 'src/api/administrationCenter/contractmanagement/contractmanagement';
  import { getUUID } from 'api/pulicJava';
  export default {
    name: 'AuditInformation',
    components: {
      commodity,
      ReceiveRefundDetails,
      PurchaseListTable,
      Appendix,
      ContractPaymentDetails,
      GiftTable,
      CommodityPrivate,
      WarehouseListTable,
      PurchaseContract
    },
    props: {
      auditType: {
        default: '1'
      }
    },
    created() {
      this.initBtnElements();
      // console.log(this.contractDetails.purchaseContractCode,this.orderDetails.brand,this.orderDetails.category)
      if (!this.contractDetails.purchaseContractCode && this.orderDetails.brand && this.orderDetails.brand.brandId && this.orderDetails.category && this.orderDetails.category.commodityCategoryId) {
        this.getCustomerContractCode();
      }
      // if (this.contractDetails.isSplitOrder !== undefined) {
      //   this.tabActive = this.setTabActive;
      // }
      // if (this.auditType == 1) {
      //   this.tabActive = '2';
      // }
    },
    data() {
      return {
        loadingBtn: false,
        code: '',
        btn_infoPass: false,
        btn_infoRefuse: false,
        btn_placeOrderCompleted: false,
        btn_splitOrder: false,
        btn_saveNumber: false,
        btn_isSuperEdit: false, // 是否是超级编辑
        columnAlign: 'center',
        size: 'small',
        btnSize: 'mini',
        rejectTypeList: [
          { code: 1, value: '整单驳回' },
          { code: 2, value: '图纸驳回' },
          { code: 3, value: '违规' }
        ],
        tabActive: '4',
        params: {
          accessoryId: ''
        },
        purchaseNumber: '', // 采购合同号
        contractId: this.$route.query.contractId,
        orderId: this.$route.query.orderId,
        ruleForm: {
          suggestion: ''
        },
        rejectForm: {
          rejectType: [],
          rejectReason: ''
        },
        passForm: {
          contractNo: '',
          remarks: ''
        },
        rules: {
          suggestion: [
            { required: true, message: '请输入审批意见', trigger: 'blur' }
          ],
          rejectType: [
            { required: true, message: '请选择', trigger: 'change' }
          ]
        },
        dialogReject: false,
        dialogPass: false
      }
    },
    methods: {
      // 获取按钮权限
      initBtnElements() {
        let element = JSON.parse(this.$loca.getItem('element'));
        this.btn_infoPass = element['auditContract:btn_infoPass']; // 信息审核-通过
        this.btn_infoRefuse = element['auditContract:btn_infoRefuse']; // 信息审核-整单驳回
        this.btn_placeOrderCompleted = element['placeOrderContract:btn_placeOrderCompleted']; // 下单完成
        this.btn_splitOrder = element['placeOrderContract:btn_splitOrder']; // 拆单
        this.btn_saveNumber = element['placeOrderContract:btn_saveNumber']; // 保存采购合同号
        this.btn_isSuperEdit = element['placeOrderContract:btn_superEdit']; // 是否是超级编辑
      },
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 驳回弹出层
      handleReject() {
        this.dialogReject = true;
      },
      // 驳回弹出层确认
      rejectFormSubmit(formName){
        this.loadingBtn = true;
        let params = {
          customerContractId: Number(this.contractId),
          orderId: this.orderId,
          auditType: Number(this.auditType)
        };
        dismissCustomerContract(params)
          .then(response => {
            if (response.status == 200) {
              this.$message.success('操作成功');
              this.dialogReject = false;
              this.$router.go(-1);
            } else {
              this.$message.error(response.message || '操作失败');
            }
            this.loadingBtn = false;
          })
          .catch(error => {
            this.loadingBtn = false;
            console.log('views/administrationCenter/contractmanagement/components/audit/AuditInformation:dialogReject' + error);
          });
      },
      // 通过弹出层
      handlePass() {
        this.dialogPass = true;
      },
      // 通过弹出层确认
      passFormSubmit() {
        this.loadingBtn = true;
        let params = {
          customerContractId: Number(this.contractId),
          orderId: this.orderId,
          auditType: Number(this.auditType),
          auditStatus: 1,
          auditOpinion:this.passForm.remarks
        };
        updateCustomerContract(params)
          .then(response => {
            if (response.status == 200) {
              this.$message.success('操作成功');
              this.dialogReject = false;
              this.goBack();
            } else {
              this.$message.error(response.message || '操作失败');
            }
            this.loadingBtn = false;
          })
          .catch(error => {
            this.loadingBtn = false;
            console.log('views/administrationCenter/contractmanagement/components/audit/AuditInformation:passFormSubmit' + error);
          });
      },
      // 保存采购合同号
      savePurchaseOrder() {
        if (!this.contractDetails.purchaseContractCode) {
          this.$message.warning('请输入采购合同号');
        } else {
          let params = {
            purchaseContractCode: this.contractDetails.purchaseContractCode,
            customerContractId: this.$route.query.contractId,
            orderId: this.orderId
          };
          insertPurchaseContractCode(params)
            .then(response => {
              if (response.message == 'success') {
                this.$message.success('保存成功');
              } else {
                this.$message.error(response.message || '采购合同号保存失败');
              }
            })
            .catch(error => {
              console.log('views/administrationcenter/contractmanagement/components/audit/AuditInformation.vue:savePurchaseOrder' + error)
            })
        }
      },
      // 点击拆单
      handleSplitOrder() {
        this.$confirm('确认拆单?', '提示', {
          type: 'warning'
        }).then(() => {
          this.splitOrder();
        }).catch(() => {});
      },
      // 拆单
      splitOrder() {
        let params = {
          orderId: Number(this.orderId),
          customerContractId: Number(this.contractId),
          stockUpPurchaseOrderId: Number(this.contractId),
          purchaseContractCode: this.contractDetails.purchaseContractCode
        };
        // 定制品拆单，采购合同号不能为空
        if (this.orderDetails.orderGoodsType == 2) {
          if (!params.purchaseContractCode) {
            this.$message.error('请输入采购合同号');
          } else {
            this.loadingBtn = true;
            insertPurchaseContractCode(params)
              .then(response => {
                if (response.message == 'success') {
                  this.splitOrderConfirm(params);
                } else {
                  this.$message.error(response.message || '采购合同号保存失败');
                }
              })
              .catch(error => {
                console.log('views/administrationcenter/contractmanagement/components/audit/AuditInformation.vue:splitOrder' + error)
              })
          }
        } else {
          this.loadingBtn = true;
          insertPurchaseContractCode(params)
            .then(response => {
              if (response.message == 'success') {
                this.splitOrderConfirm(params);
              } else {
                this.$message.error(response.message || '采购合同号保存失败');
              }
            })
            .catch(error => {
              console.log('views/administrationcenter/contractmanagement/components/audit/AuditInformation.vue:splitOrder' + error)
            })
        }
      },
      // 拆单提交
      splitOrderConfirm(params) {
        let fn = this.$route.query.billType == 2 ? splitStockUpOrder : splitOrder;
        fn(params)
          .then(response => {
            if (response.message == 'success') {
              this.$message.success('拆单成功');
              this.contractDetails.isSplitOrder = 1;
              this.getPurchaseOrderList();
            } else {
              this.$message.error(response.message || '拆单失败');
            }
            this.loadingBtn = false;
          })
          .catch(error => {
            this.loadingBtn = false;
            console.log('views/administrationcenter/contractmanagement/components/audit/AuditInformation.vue-splitOrder:' + error)
          })
      },
      // 下单完成
      executePass() {
        this.$confirm('确认下单完成?', '提示', {
          type: 'warning'
        }).then(() => {
          let params = {
            customerContractId: Number(this.contractId),
            orderId: this.orderId
          };
          executePass(params)
            .then(response => {
              if (response.message == 'success') {
                this.contractDetails.isSignOrder = 1;
                this.tablesData.purchaseStatus = 2;
                this.$message.success('操作成功');
                this.getPurchaseOrderList();
              } else {
                this.$message.error(response.message || '操作失败');
              }
            })
            .catch(error => {
              console.log('views/administrationCenter/contractmanagement/components/audit/AuditInformation-executePass:' + error);
            });
        }).catch(() => {});
      },
      // 获取采购单列表
      getPurchaseOrderList() {
        let params = {
          customerContractId: Number(this.contractId)
        }
        listPurchaseOrder(params)
          .then(response => {
            if (response.data && response.data.length && response.data[0]) {
              this.$store.dispatch('SET_PURCHASE_ORDER_LIST', response.data);
            }
          })
          .catch(error => {
            console.log('合同管理/商品信息 views/administrationCenter/contractmanagement/components/audit/AuditInformation-getPurchaseOrderList:' + error);
          });
      },
      // 返回
      goBack() {
        this.$router.go(-1);
      },
      // 生成采购单编码
      getCustomerContractCode() {
        let brandId = this.orderDetails.brand.brandId;
        let categoryId = this.orderDetails.category.commodityCategoryId;
        let abbreviate = this.orderDetails.abbreviate || '';
        let uuidParams = {
          serialNumber: ''
        };
        if ((brandId == 1 && categoryId == 1000033) || brandId == 2 || brandId == 3 || brandId == 4) { // 不自动生成
        } else if (brandId == 1 && categoryId == 1000026){
          // uuidParams.serialNumber = 'Y';
        } else {
          uuidParams.serialNumber = 'PR';
        }
        getUUID(uuidParams)
          .then(response => {
            if ((brandId == 1 && categoryId == 1000033) || brandId == 2 || brandId == 3 || brandId == 4) { // 欧派橱柜、顾家、诗尼曼、梦天不自动生成
              this.code = '';
            } else if (brandId == 1 && categoryId == 1000026){ // 欧派衣柜不自动生成
              // this.code = abbreviate + response.data;
            } else {
              this.code = response.data;
            }
            this.contractDetails.purchaseContractCode = this.code;
          });
      },
      // 超级编辑
      superEdit() {
        this.$confirm('此操作有可能造成本订单数据紊乱，请慎用！', '提示', {
          confirmButtonText: '继续',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.contractDetails.isSuperEdit = 1;
        }).catch(() => {});
      }
    },
    computed: {
      ...mapGetters([
        'contractDetails',
        'orderDetails',
        'tablesData'
      ]),
      // 判断是否是上样单
      isSampleSingle() {
        return this.$route.query.contractType == 2;
      },
      setTabActive() {
        if (this.contractDetails.isSplitOrder == 1 && this.auditType == 2) {
          return '4';
        } else {
          return '2';
        }
      },
      // 判断拆单按钮是否可点
      isCanSplitOrder() {
        return this.contractDetails.isSplitOrder == 1;
      },
      // 是否是超级编辑
      isSuperEdit() {
        return this.contractDetails.isSuperEdit == 1;
      }
    },
    watch: {
      'contractDetails.isSplitOrder': function(val) {
        if (val == 1 && this.auditType == 2) {
          this.tabActive = '4';
        } else {
          this.tabActive = '2';
        }
      }
    }
  };
</script>
