<template>
  <div v-loading="loading">
    <div class="moduleHeader clearfix">
      <div class="title fl m-right40">库取单号：{{ listLibrariesTakeInfo.librariesTakeNumber }}</div>
      <div class="fl" v-if="!routedata">
        <label class="label fl">单号备注：</label>
        <div class="fl">
          <el-input v-model.tirm="listLibrariesTakeInfo.numberExplain" clearable placeholder="请输入单号备注" size="mini" :disabled="isCompleted && !isSuperEdit"></el-input>
        </div>
      </div>
      <div class="btnList fr" v-if="!routedata">
        <el-button class="button-96" :size="btnSize" @click="showListingDialog" v-if="btn_punish">清单处罚</el-button>
        <el-button class="button-96" :size="btnSize" @click="handleSave" v-if="btn_saveWarehosue" :disabled="isCompleted && !isSuperEdit" :loading="loadingBtnSave">保存</el-button>
        <el-button class="button-96" :size="btnSize" @click="completed" v-if="btn_completedWarehosue" :disabled="isCompleted && !isSuperEdit" :loading="loadingBtn">执行完成</el-button>
      </div>
    </div>
    <div class="table_list unsortable">
      <el-table border :data="productdata" ref="multipleTable" :max-height="maxHeight">
        <el-table-column type="index" align="center" width="50" fixed="left"></el-table-column>
        <el-table-column label="库取数量" prop="number" align="center" width="120" fixed="left">
          <template slot-scope="scope">
            <div>
              <el-tooltip placement="right" visible-arrow v-if="!isCompleted || isSuperEdit">
                <div slot="content" class="tips tipFon">
                  <p @click="handleCancel(scope.row)" class="operaItems">取消库取</p>
                </div>
                <img :src="spot" alt="" class="attributesTips">
              </el-tooltip>
              <p class="operation">{{scope.row.number}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="商品名称" prop="commodityName" align="center" width="250" show-overflow-tooltip></el-table-column>
        <el-table-column label="单价" prop="costing" align="center" width="140" show-overflow-tooltip v-if="!routedata"></el-table-column>
        <el-table-column label="金额总计" prop="costingTotal" align="center" width="140" show-overflow-tooltip v-if="!routedata"></el-table-column>
        <el-table-column label="规格" prop="commodityModel" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="货号" prop="commodityNumber" align="center" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column label="颜色" prop="commodityColourName" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="宽" prop="commodityWide" align="center" width="100"></el-table-column>
        <el-table-column label="高" prop="commodityHigh" align="center" width="100"></el-table-column>
        <el-table-column label="深" prop="commodityLong" align="center" width="100"></el-table-column>
        <el-table-column label="厚" prop="commodityThick" align="center" width="100"></el-table-column>
        <el-table-column label="商品编码" prop="commodityCode" align="center" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column label="备注" prop="remark" align="center" width="250" show-overflow-tooltip></el-table-column>
<!--        <el-table-column label="数量" prop="number" align="center" width="120"></el-table-column>-->
      </el-table>
    </div>
    <el-dialog title="清单处罚" :visible.sync="listingPunishmentDialog" width="1024px" class="customDialogTitle" :close-on-click-modal="false" :close-on-press-escape="false">
      <IllegalPunishment :illegalInfo="illegalInfo" :shortkey="true" v-if="listingPunishmentDialog" ref="listingPunishment" @successFn="successFn"></IllegalPunishment>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="listingPunishmentSubmit('ruleForm')" :loading="loadingBtn">确 定</el-button>
        <el-button @click="listingPunishmentDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择采购单" :visible.sync="purchaseListDialog" class="customDialogTitle" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :size="size" class="ruleForm">
        <el-form-item label="采购单名称" prop="purchaseOrderId">
          <el-select v-model="ruleForm.purchaseOrderId">
            <el-option v-for="item,index in purchaseOrderList" :label="item.purchaseNumber ? item.purchaseNumber : '采购单'+ (index + 1)" :value="item.purchaseOrderId" :key="item.purchaseOrderId" :disabled="item.purchaseStatus == 2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="cancelConfirm('ruleForm')" :loading="loadingBtn">确 定</el-button>
        <el-button @click="purchaseListDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="新增采购单" :visible.sync="purchaseAddDialog" class="customDialogTitle" :close-on-click-modal="false" :close-on-press-escape="false">
      <el-form :model="ruleFormNew" :rules="rules" ref="ruleFormNew" label-width="100px" :size="size" class="ruleForm">
        <el-form-item label="采购单号" prop="purchaseNumber">
          <el-input v-model.tirm="ruleFormNew.purchaseNumber" clearable placeholder="请输入采购单号"></el-input>
        </el-form-item>
        <el-form-item label="房间" prop="roomId">
          <el-select v-model="ruleFormNew.roomId">
            <el-option v-for="item,index in roomList" :label="item.dictName" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="companyId">
          <el-select v-model="ruleFormNew.companyId" clearable filterable>
            <el-option v-for="item,index in companyList" :label="item.companyName" :value="item.companyId" :key="item.companyId"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addTabConfirm('ruleFormNew')" :loading="loadingBtn">确 定</el-button>
        <el-button @click="purchaseAddDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import spot from '@/assets/images/spot.png';
  import IllegalPunishment from '@/views/administrationCenter/contractmanagement/components/IllegalPunishment';
  import { mapGetters } from 'vuex';
  import { listLibrariesTake } from 'api/order/contract/contract';
  import { cancelLibrariesTake, insertPurchaseOrder, listPurchaseOrder, getLibrariesTake, saveLibrariesRemarkCode, executeLibrariesTake } from 'api/administrationCenter/contractmanagement/contractmanagement';
  import { getUUID, listCompanyByParam } from 'api/pulicJava';
  export default {
    name: 'WarehouseListTable',
    components: {
      IllegalPunishment
    },
    data() {
      return {
        loadingBtn: false,
        loadingBtnSave: false, // 保存按钮loading
        btnSize: 'mini',
        btn_punish: false,
        btn_saveWarehosue: false,
        btn_completedWarehosue: false,
        routedata: this.$route.path == '/ordermm/signcontract' || this.$route.path == '/ordermm/details',
        spot,
        loading: true,
        libraries_take_number: '',
        listingPunishmentDialog: false,
        productdata: [],
        illegalInfo: {
          illegalType: 236
        },
        row: {},
        companyList: [], // 品牌品类下的供应商
        purchaseListDialog: false, // 选择采购单
        purchaseAddDialog: false, // 新增采购单
        ruleForm: {
          purchaseOrderId: '' // 移动选中采购单
        },
        ruleFormNew: { // 新增采购单
          roomId: '', // 房间
          companyId: '', // 供应商
          purchaseNumber: '' // 采购单号
        },
        rules: {
          purchaseOrderId: [
            { required: true, message: '请选择采购单', trigger: 'change' }
          ],
          roomId: [
            { required: true, message: '请选择房间', trigger: 'change' }
          ],
          companyId: [
            { required: true, message: '请选择供应商', trigger: 'change' }
          ],
          purchaseNumber: [
            { required: true, message: '请输入采购单号', trigger: 'blur' }
          ]
        },
        listLibrariesTakeInfo: {
          librariesTakeId: '',
          librariesTakeNumber: '',
          numberExplain: '',
          status: ''
        },
        librariesTakeNumber: ''
      }
    },
    created() {
      this.initBtnElements();
      this.getData();
      this.getLibrariesTake();
    },
    methods: {
      // 获取按钮权限
      initBtnElements() {
        let element = JSON.parse(this.$loca.getItem('element'));
        this.btn_punish = element['placeOrderContract:btn_punish']; // 清单处罚
        this.btn_saveWarehosue = element['placeOrderContract:btn_saveWarehosue'];// 库取单保存
        this.btn_completedWarehosue = element['placeOrderContract:btn_completedWarehosue'];// 库取单-执行完成
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      },
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 生成采购单编码
      getUUID() {
        let uuidParams = {
          serialNumber: 'PO'
        };
        getUUID(uuidParams)
          .then(response => {
            this.ruleFormNew.purchaseNumber = response.data;
          })
          .catch(error => {
            console.log('view/administrationCenter/contractmanagement/components/WarehouselistTable.vue-getUUID:' + error);
          })
      },
      // 新增采购单-供应商
      getCompanyList() {
        let paramsNew = {
          companyType: 1,
          brandId: this.orderDetails.brand.brandId,
          commodityCategoryId: this.orderDetails.category.commodityCategoryId
        };
        listCompanyByParam(paramsNew)
          .then(response => {
            this.companyList = response.data;
          })
          .catch(error => {
            console.log('获取品牌品类下的供应商', error);
          })
      },
      // 获取库取单列表
      getData() {
        this.loading = true;
        listLibrariesTake({ orderId: this.$route.query.orderId }).then(res => {
          this.loading = false;
          if (res.status == 200) {
            // if (res.data.length) {
            //   this.libraries_take_number = res.data[0].libraries_take_number;
            // }
            this.productdata = res.data;
            this.$emit("productfun", this.productdata)
          }
        }).catch(error => {
          this.loading = false;
          console.log('库取单:获取库取单列表接口 src/views/administrationCenter/contractmanagement/components/WarehouseListTable.vue', error);
        })
      },
      // 确定新增采购单
      addTabConfirm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loadingBtn = true;
            let params = {
              customerContractId: this.$route.query.contractId,
              orderId: this.$route.query.orderId,
              ...this.ruleFormNew,
              purchaseContractCode: this.contractDetails.purchaseContractCode
            };
            insertPurchaseOrder(params)
              .then(response => {
                this.$message.success('新增采购单成功');
                this.purchaseAddDialog = false;
                this.getPurchaseOrderList();
                this.loadingBtn = false;
              })
              .catch(error => {
                this.loadingBtn = false;
                console.log('views/administrationCenter/contractmanagement/components/PurchaseContract.vue:addTabConfirm' + error);
              });
          } else {
            return false;
          }
        });
      },
      // 获取采购单列表
      getPurchaseOrderList() {
        let params = {
          customerContractId: this.$route.query.contractId,
          contractType: this.$route.query.contractType
        };
        listPurchaseOrder(params)
          .then(response => {
            if (response.data && response.data.length && response.data[0]) {
              this.$store.dispatch('SET_PURCHASE_ORDER_LIST', response.data);
            }
          })
          .catch(error => {
            console.log('views/administrationCenter/contractmanagement/components/PurchaseContract.vue:getPurchaseOrderList' + error);
          });
      },
      // 点击取消库取
      handleCancel(row) {
        this.row = row;
        if(this.routedata){
          this.confirmSubmit();
        } else {
          this.ruleForm.purchaseOrderId = '';
          let availablePurchaseOrderList = [];
          if (this.purchaseOrderList.length) {
            availablePurchaseOrderList = this.purchaseOrderList.filter(item => {
              return item.purchaseStatus != 2;
            })
          }
          if (availablePurchaseOrderList.length) {
            this.purchaseListDialog = true;
          } else {
            this.$confirm('没有可选采购单无法进行取消库取操作，是否新增采购单?', '提示', {
              confirmButtonText: '是',
              cancelButtonText: '否',
              type: 'warning'
            }).then(() => {
              this.getCompanyList();
              this.ruleFormNew.roomId = '';
              this.ruleFormNew.companyId = '';
              this.ruleFormNew.purchaseNumber = '';
              this.resetForm('ruleFormNew');
              this.purchaseAddDialog = true;
              this.ruleFormNew.purchaseNumber = this.contractDetails.purchaseContractCode;
              // this.getUUID();
            }).catch(() => {});
          }
        }
      },
      // 确定取消库取
      cancelConfirm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.confirmSubmit();
          } else {
            return false;
          }
        })
      },
      confirmSubmit() {
        this.$confirm('确定取消库取?', '提示', {
          type: 'warning'
        }).then(() => {
          this.loadingBtn = true;
          let occupyType = '';
          if (this.row.inventoryType == '可用') {
            occupyType = 1;
          }
          if (this.row.inventoryType == '暂扣') {
            occupyType = 2;
          }
          if (this.row.inventoryType == '样品') {
            occupyType = 4;
          }
          if (this.row.inventoryType == '在途') {
            occupyType = 3;
          }
          let params = {
            occupyType: occupyType,
            librariesTakeType: 2,
            orderId: this.$route.query.orderId,
            purchaseOrderId: this.ruleForm.purchaseOrderId,
            commoditySKUId: this.row.skuGoodsId,
            num: this.row.number
          };
          params.relLibrariesTakeCommodityIdS =  this.row.id.split(',').map(Number);
          cancelLibrariesTake(params)
            .then(response => {
              if (response.status == 200) {
                this.$message.success('取消成功');
                this.purchaseListDialog = false;
                this.getData();
              } else {
                this.$message.error(response.message || '取消失败');
              }
              this.loadingBtn = false;
            })
            .catch(error => {
              this.loadingBtn = false;
              console.log('views/contractmanagement/components/WarehouseListTable.view-cancelConfirm:' + error);
            })
          }).catch(() => {});
      },
      // 点击清单处罚
      showListingDialog() {
        this.listingPunishmentDialog = true;
      },
      // 生成违规单
      listingPunishmentSubmit(formName) {
        this.loadingBtn = true;
        this.$refs.listingPunishment.insertIllegalBillSubmit(formName);
      },
      // 成功或失败回调
      successFn(val) {
        if (val) {
          this.listingPunishmentDialog = false;
        }
        this.loadingBtn = false;
      },
      // 获取库取单
      getLibrariesTake() {
        getLibrariesTake({ orderId: this.$route.query.orderId })
          .then(res => {
            if (res.data && res.data.librariesTakeId) {
              this.listLibrariesTakeInfo = res.data;
              this.librariesTakeNumber = res.data.librariesTakeNumber;
            } else {
              getUUID({ serialNumber: 'WO' })
                .then(response => {
                  this.librariesTakeNumber = response.data;
                })
                .catch(error => {
                  console.log('公共获取编码-getUUID:' + error);
                })
            }
          })
          .catch(error => {
            console.log('views/administrationcenter/contractmanagement/components/MoveToWarehouseDialog.vue-moveToWareHouseListConfirm:' + error);
          })
      },
      // 保存单号备注
      handleSave() {
        this.loadingBtnSave = true;
        let params = {
          orderId: this.$route.query.orderId,
          ...this.listLibrariesTakeInfo
        };
        if (!this.listLibrariesTakeInfo.librariesTakeId) {
          params.librariesTakeNumber = this.librariesTakeNumber;
        }
        saveLibrariesRemarkCode(params)
          .then(response => {
            if (response.status == 200) {
              this.$message.success('保存成功');
              if (!this.listLibrariesTakeInfo.librariesTakeId) {
                this.getLibrariesTake();
              }
            } else {
              this.$message.success('保存失败');
            }
            this.loadingBtnSave = false;
          })
          .catch(error => {
            this.loadingBtnSave = false;
            console.log('views/administrationcenter/contractmanagement/components/MoveToWarehouseDialog.vue-handleSave:' + error);
          })
      },
      // 点击执行完成
      completed() {
        if (!this.listLibrariesTakeInfo.librariesTakeId) {
          this.$message.error('没有库取单，不能执行完成');
        } else {
          this.$confirm('确定执行完成?', '提示', {
            type: 'warning'
          }).then(() => {
            this.loadingBtn = true;
            let params = {
              librariesTakeId: this.listLibrariesTakeInfo.librariesTakeId
            };
            executeLibrariesTake(params)
              .then(response => {
                if (response.status == 200) {
                  this.$message.success('操作成功');
                  this.listLibrariesTakeInfo.status = 2;
                } else {
                  this.$message.error('操作失败');
                }
                this.loadingBtn = false;
              })
              .catch(error => {
                this.loadingBtn = false;
                console.log('views/administrationcenter/contractmanagement/components/MoveToWarehouseDialog.vue-completed:' + error);
              })
          }).catch(() => {});
        }
      }
    },
    computed: {
      ...mapGetters([
        'maxHeight',
        'size',
        'purchaseOrderList',
        'roomList',
        'contractDetails',
        'orderDetails'
      ]),
      // 是否执行完成 =2 是
      isCompleted() {
        return this.listLibrariesTakeInfo.status == 2;
      },
      // 是否是超级编辑
      isSuperEdit() {
        return this.contractDetails.isSuperEdit == 1;
      }
    }
  }
</script>

