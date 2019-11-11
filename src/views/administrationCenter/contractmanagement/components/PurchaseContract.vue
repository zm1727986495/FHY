<template>
  <div>
    <div class="moduleHeader clearfix">
      <div class="title fl">采购合同</div>
      <span class="fl m-left20" v-if="routedata">{{ contractDetails.purchaseContractCode }}</span>
      <span class="fr m-left20" v-if="routedata">拆单时间：{{ contractDetails.splitOrderTime }}</span>
      <span class="fr m-left20" v-if="routedata">拆单人：{{ contractDetails.splitOrderAt }}</span>
      <div class="btnList fr" v-if="!routedata">
        <el-button class="button-96" :size="btnSize" @click="addTab" v-if="btn_addPurchaseOrder" :disabled="contractDetails.isSignOrder == 1 && !isSuperEdit && !status">新增采购单</el-button>
        <el-button class="button-96" :size="btnSize" @click="delTab" v-if="btn_addPurchaseOrder" :disabled="getAllCommodities.length > 0">删除采购单</el-button>
        <el-button class="button-96" :size="btnSize" @click="showListingDialog" v-if="btn_punish">清单处罚</el-button>
      </div>
    </div>
    <div class="btnList m-bottom10" v-if="!routedata">
      <el-button v-for="(item,index) in actionBtnList" :size="btnSize" class="button-96" @click="butGroupAction(item.url,item.type)" :key="index" :disabled="(tablesData.isExecute == 1  || contractDetails.isSignOrder == 1) && !isSuperEdit && !status" v-if="item.isHashAuthority&&(!item.isShow) && purchaseOrderList.length > 0" :loading="loadingBtn">{{item.name}}</el-button>
    </div>
    <div class="tabsBox" v-if="purchaseOrderList.length > 0">
      <el-tabs type="border-card" v-model="tabActive" @tab-click="tabClick" v-loading="loading">
        <el-tab-pane :label="item.purchaseNumber ? item.purchaseNumber : '采购单'+ (index + 1)" :name="'采购单'+ (index + 1)" v-for="(item,index) in purchaseOrderList" :key="index" :purchaseOrderId="item.purchaseOrderId" :tabIndex="index">
          <PurchaseTable @changeMoney="changeMoney" :setQuery="setQuery" :status="status" v-if="tabActive == '采购单'+ (index + 1)"></PurchaseTable>
        </el-tab-pane>
      </el-tabs>
    </div>
    <el-dialog title="清单处罚" :visible.sync="listingPunishmentDialog" width="1024px" class="customDialogTitle">
      <IllegalPunishment :illegalInfo="illegalInfo" :shortkey="true" v-if="listingPunishmentDialog" ref="listingPunishment" @successFn="successFn"></IllegalPunishment>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="listingPunishmentSubmit('ruleForm')">确 定</el-button>
        <el-button @click="listingPunishmentDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="商品列表" :visible.sync="productDialog" width="1024px" class="selectCommodity customDialogTitle" top="1vh">
      <select-commodity @selectionChange="selectionChange" ref="selectedCommodities" :select-list="selectList" v-if="productDialog"></select-commodity>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addProductConfirm" :loading="loadingBtn">确 定</el-button>
        <el-button @click="productDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <el-dialog title="选择采购单" :visible.sync="purchaseListDialog" class="customDialogTitle">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" :size="size" class="ruleForm">
        <el-form-item label="采购单名称" prop="transferPurchaseOrderId">
          <el-select v-model="ruleForm.transferPurchaseOrderId">
            <el-option v-for="item,index in purchaseOrderList" :label="item.purchaseNumber ? item.purchaseNumber : '采购单'+ (index + 1)" :value="item.purchaseOrderId" :key="item.purchaseOrderId" :disabled="item.purchaseOrderId == purchaseOrderId || item.purchaseStatus == 2"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectPurchaseList('ruleForm')" :loading="loadingBtn">确 定</el-button>
        <el-button @click="purchaseListDialog = false">取 消</el-button>
      </div>
    </el-dialog>
    <MoveToWarehouseDialog ref="moveToWarehouseDialog" v-if="moveSelectRow.visible" :visible="moveSelectRow.visible" @close="close" @confirm="moveToConfirm" :datas="moveSelectRow"></MoveToWarehouseDialog>
    <el-dialog title="新增采购单" :visible.sync="purchaseAddDialog" class="customDialogTitle">
      <el-form :model="ruleFormNew" :rules="rules" ref="ruleFormNew" label-width="100px" :size="size" class="ruleForm">
        <el-form-item label="采购单号" prop="purchaseNumber">
          <el-input v-model.tirm="ruleFormNew.purchaseNumber" clearable placeholder="请输入采购单号"></el-input>
        </el-form-item>
        <el-form-item label="房间" prop="roomId">
          <el-select v-model="ruleFormNew.roomId" clearable filterable>
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
    <!-- 组套弹框 -->
    <el-dialog :visible.sync="starkShow" class="customDialogTitle selectCommodity" title="成品列表" width="80%" :close-on-click-modal="false" top="3vh">
      <stark class="starkOrder" v-if="starkShow" ref="starkRef" :priceStrategyId="orderDetails.priceStrategyId" :storeId="orderDetails.storeId" @success="successFnStark"></stark>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addStark" :loading="loadingBtn">确 定</el-button>
        <el-button @click="starkShow = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import spot from '@/assets/images/spot.png';
  import PurchaseTable from '@/views/administrationCenter/contractmanagement/components/PurchaseTable';
  import IllegalPunishment from '@/views/administrationCenter/contractmanagement/components/IllegalPunishment';
  import selectCommodity from '@/views/components/selectCommodity';
  import MoveToWarehouseDialog from '@/views/administrationCenter/contractmanagement/components/MoveToWarehouseDialog';
  import stark from '@/views/order/budgetdetailed/stark.vue';
  import { getAllData, calPrice, sum } from '@/utils/pubilcFn';
  import { listCommoditySeries, listCommodityMaterial, listCommodityColour } from '@/api/administrationCenter/stockmanagement/index';
  import { getUUID, listCompanyByParam } from 'api/pulicJava';
  import { insertLibrariesTake, updatePurchaseOrder, getPurchaseOrder, insertPurchaseOrderCommodity, listPurchaseOrder, insertPurchaseOrder, transferPurchaseOrderCommodity, updatePurchaseOrderCommodity, stockUpPurchaseComplete, deletePurchaseOrder, insertPurchaseContractCode } from '@/api/administrationCenter/contractmanagement/contractmanagement';
  import { heavyLoadPurchaseData } from '@/api/administrationCenter/purchaseOrderAccountCheck/index'
  export default {
    name: 'PurchaseContract',
    components: {
      PurchaseTable,
      IllegalPunishment,
      selectCommodity,
      MoveToWarehouseDialog,
      stark
    },
    props:{
      status:{
        type:Boolean,
        default:false
      },
      setQuery:{
        type:Boolean,
        default:true
      }
    },
    created() {
      // 对账的状态
      if(this.status){
        this.actionBtnList[5].isShow=true;
      }
      if(this.purchaseOrderList.length){
        this.purchaseOrderId = this.purchaseOrderList[0].purchaseOrderId;
        this.getPurchaseOrder();
      }
      this.initBtnElements();
    },
    data() {
      return {
        isDelTab: false, // 是否是删除采购单
        isAddTab: false, // 是否是新增采购单
        loading: false,
        loadingBtn: false,
        btn_addPurchaseOrder: false,
        btn_punish: false,
        routedata: this.$route.path == '/ordermm/details',
        size: 'medium',
        btnSize: 'mini',
        spot,
        closeOnClickModal: false,
        closeOnPressEscape: false,
        actionBtnList: [
          { name: '添加商品', style: 'default', url: '', type: 1, isHashAuthority: false },
          { name: '保存', style: 'default', url: '', type: 2, isHashAuthority: false },
          { name: '组套', style: 'default', url: '', type: 6, isHashAuthority: false },
          { name: '移动', style: 'default', url: '', type: 3, isHashAuthority: false },
          { name: '删除', style: 'default', url: '', type: 4, isHashAuthority: false },
          { name: '执行完成', style: 'default', url: '', type: 5, isHashAuthority: false }
        ],
        tabActive: '采购单1', // 选中选项卡
        tabIndex: 0,
        listingPunishmentDialog: false, // 清单违规
        illegalInfo: {
          illegalType: 236
        },
        selectList: { // 选择商品参数
          selectedCommodities: [], // 选中的商品 可不传
          height: '350px', // 设置表格高度 可不传（弹出层最好传下）
          isDialog: true, // 是否为弹出层（不传默认为页面）
          brandId: 0,
          commodityCategoryId: 0,
          priceStrategyId: '',
          disabled: true
        },
        priceStrategyId: '',
        companyList: [], // 品牌品类下的供应商
        starkShow: false, // 组套弹框
        purchaseOrderId: '', // 采购单号
        purchaseListDialog: false, // 移动采购单弹出层
        productDialog: false, // 选择商品弹窗
        purchaseAddDialog: false, // 新增采购单
        selectedProducts: [], // 选择的商品-采购单内选中的
        selectedProductsConfirm: [], // 采购单新增商品
        allProducts: [], // 所有商品,
        orderCommodity: [],
        orderCommodityNew: [],
        classifyNames: '',
        withholdData: [], // 暂存数据
        inRoadData: [], // 在途数据
        sampleData: [], // 样品数据
        withholdVisible: false, // 暂存弹窗
        inRoadVisible: false, // 在途弹窗
        sampleVisible: false, // 样品弹窗
        ruleFormNew: { // 新增采购单
          roomId: '', // 房间
          companyId: '', // 供应商
          purchaseNumber: '' // 采购单号
        },
        ruleForm: {
          transferPurchaseOrderId: '' // 移动选中采购单
        },
        rules: {
          transferPurchaseOrderId: [
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
        inputMoney:'',
        statusChange:0,
        updateObj:{}
      }
    },
    methods: {
      changeMoney(val){
        this.tablesData.statusChange = 1;
        this.inputMoney=val;
      },
      // 获取按钮权限
      initBtnElements() {
        let element = JSON.parse(this.$loca.getItem('element'));
        this.btn_addPurchaseOrder = this.status?true:element['placeOrderContract:btn_addPurchaseOrder']; // 新增采购单
        this.btn_punish = this.status?true:element['placeOrderContract:btn_punish']; // 清单处罚
        this.actionBtnList[0].isHashAuthority = this.status?true:element['placeOrderContract:btn_addCommodity'];// 新增商品
        this.actionBtnList[1].isHashAuthority = this.status?true:element['placeOrderContract:btn_savePurchseOrder'];// 保存采购单
        this.actionBtnList[2].isHashAuthority = this.status?true:element['placeOrderContract:btn_stack'];// 组套
        this.actionBtnList[3].isHashAuthority = this.status?true:element['placeOrderContract:btn_move'];// 移动商品
        this.actionBtnList[4].isHashAuthority = this.status?true:element['placeOrderContract:btn_delete'];// 删除商品
        this.actionBtnList[5].isHashAuthority = this.status?true:element['placeOrderContract:btn_completed'];// 执行完成
      },
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
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
            console.log('view/administrationCenter/contractmanagement/components/PurchaseContrat.vue-getUUID:' + error);
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
      // 新增采购单
      addTab() {
        this.ruleFormNew.roomId = '';
        this.ruleFormNew.companyId = '';
        this.ruleFormNew.purchaseNumber = '';
        this.resetForm('ruleFormNew');
        this.$confirm('确定要新增采购单?', '提示', {
          type: 'warning'
        }).then(() => {
          this.getCompanyList();
          this.isDelTab = false;
          this.isAddTab = true;
          // this.getUUID();
          this.ruleFormNew.purchaseNumber = this.contractDetails.purchaseContractCode;
          this.purchaseAddDialog = true;
        }).catch(() => { });
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
                if (response.status == 200 && !isNaN(Number(response.message))) {
                  this.$message.success('添加成功');
                  this.purchaseAddDialog = false;
                  if(this.status){
                    let params = {
                      customerContractId: this.$route.query.contractId,
                      orderId: this.$route.query.orderId,
                      purchaseNumber: this.ruleFormNew.purchaseNumber,
                      isInstall: this.status ? this.updateObj.isInstall : this.tablesData.isInstall,
                      isStorage: this.status ? this.updateObj.isStorage : this.tablesData.isStorage,
                      purchaseOrderId: response.message,
                      purchaseContractCode: this.contractDetails.purchaseContractCode,
                      status: 1
                    };
                    // let fn = this.$route.query.billType == 2 ? stockUpPurchaseComplete : updatePurchaseOrder;
                    updatePurchaseOrder(params).then(response => {
                      // if (response.message == 'success') {
                      //   this.$message.success('执行成功');
                      //   this.tablesData.purchaseStatus = 2;
                      //   this.tablesData.isExecute = 1;
                      // } else {
                      //   this.$message.error(response.message || '操作失败');
                      // }
                      this.loadingBtn = false;
                    }).catch(error => {
                      this.loadingBtn = false;
                      console.log('views/administrationCenter/contractmanagement/components/PurchaseContract.vue-completed:' + error);
                    })
                  }
                  this.getPurchaseOrderList();
                } else {
                  this.$message.error(response.message || '新增失败');
                }
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
      // 删除采购单
      delTab() {
        this.$confirm('确定删除当前采购单?', '提示', {
          type: 'warning'
        }).then(() => {
          this.isDelTab = true;
          this.isAddTab = false;
          let params = {
            purchaseOrderId: this.purchaseOrderId
          };
          deletePurchaseOrder(params)
            .then(response => {
              if (response.status == 200) {
                this.$message.success('删除成功');
                this.getPurchaseOrderList();
              } else {
                this.$message.error(response.message || '删除失败');
              }
            })
            .catch(error => {
              console.log('view/administrationCenter/contractmanagement/components/PurchaseContrat.vue:delTab' + error);
            })
        }).catch(() => { });
      },
      // 按钮组函数
      butGroupAction(url, type) {
        if (this.$store.getters.tablesData.orderCommodity) {
          this.selectedProducts = getAllData(this.$store.getters.tablesData.orderCommodity, true);
        }
        if (type == 1) { // 添加商品
          this.addProduct();
        } else if (type == 2) { // 保存
          if (this.$store.getters.tablesData.orderCommodity) {
            this.allProducts = getAllData(this.$store.getters.tablesData.orderCommodity);
          }
          if (!this.isOnFocus) {
            this.savePurchaseList();
          }
        } else if (type == 3) { // 移动
          this.handleMove();
        } else if (type == 4) { // 删除
          this.deleteProduct();
        } else if (type == 6){ // 组套
          this.priceStrategyId = this.orderDetails.priceStrategyId;
          this.starkShow = true;
        } else {
          if (this.$store.getters.tablesData.orderCommodity) {
            this.allProducts = getAllData(this.$store.getters.tablesData.orderCommodity);
          }
          this.completed();
        }
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
      // 获取采购单数据
      getPurchaseOrder(val) {
        this.loading = true;
        this.$store.dispatch('QUERY_TABLEDATA', {});
        this.allProducts = [];
        this.orderCommodityNew = [];
        this.classifyNames = '';
        let params = {
          purchaseOrderId: this.purchaseOrderId,
          contractType: this.$route.query.contractType
        };
        getPurchaseOrder(params)
          .then(response => {
            if (response.data.orderCommodity && response.data.orderCommodity.length) {
              response.data.orderCommodity[0].isShow = true;
              this.selectAll(response.data.orderCommodity, false);
              this.orderCommodity = response.data.orderCommodity;
              calPrice(response.data.orderCommodity, 1);
            } else {
              response.data.orderCommodity = [];
              this.orderCommodity = [];
            }
            response.data.purchaseOrderId = this.purchaseOrderId;
            if (!response.data.purchaseNumber) {
              response.data.purchaseNumber = this.contractDetails.purchaseContractCode || '';
            }
            response.data.statusChange = 0;
            this.inputMoney = "";
            response.data.tabIndex = this.tabIndex;
            this.$store.dispatch('QUERY_TABLEDATA', response.data);
            this.loading = false;
            // if(val){
            //   if(this.status){
            //     this.completed();
            //   }
            // }
            this.updateObj = Object.assign({},response.data);
          })
          .catch(error => {
            this.$store.dispatch('QUERY_TABLEDATA', {});
            this.loading = false;
            console.log('views/administrationcenter/contractmanagement/components/PurchaseContract.vue:getPurchaseOrder' + error)
          })
      },
      // 拿到的树结构合并
      mergeData(datas) {
        if (datas.length) {
          datas.forEach(item => {
            this.classifyNames = this.classifyNames + item.classifyName + '-';
            if (item.classifyLevel && item.classifyLevel.length) {
              this.mergeData(item.classifyLevel);
            } else {
              let newProduct = [];
              if (item.products && item.products.length) {
                item.products.forEach(pItem => {
                  pItem.checked = false;
                  pItem.colourId = Number(pItem.colourId);
                  pItem.materialId = Number(pItem.materialId);
                  pItem.seriesId = Number(pItem.seriesId);
                  const params = {
                    commodityId: pItem.commodityId
                  };
                  const p1 = new Promise(resolve => {
                    listCommoditySeries(params)
                      .then(response => {
                        // pItem.seriesList = response.data;
                        resolve(response)
                      })
                      .catch(error => {
                        console.log('根据商品获取系列：' + error);
                      });
                  });
                  const p2 = new Promise(resolve => {
                    listCommodityMaterial(params)
                      .then(response => {
                        // pItem.materialList = response.data;
                        resolve(response)
                      })
                      .catch(error => {
                        console.log('根据商品获取材质：' + error);
                      });
                  });
                  const p3 = new Promise(resolve => {
                    listCommodityColour(params)
                      .then(response => {
                        // pItem.colorList = response.data;
                        resolve(response)
                      })
                      .catch(error => {
                        console.log('根据商品获取颜色：' + error);
                      });
                  });
                  Promise.all([p1, p2, p3]).then(res => {
                    pItem.seriesList = res[0].data;
                    pItem.materialList = res[1].data;
                    pItem.colorList = res[2].data;
                  });
                  newProduct.push(pItem)
                })
              }
              const obj = {
                classifyNames: this.classifyNames,
                products: newProduct
              };
              this.orderCommodityNew.push(obj);
              this.classifyNames = '';
            }
          })
        }
      },
      // 切换采购单
      tabClick(val, event) {
        this.purchaseOrderId = val.$attrs.purchaseOrderId;
        this.tabIndex = val.$attrs.tabIndex;
        this.getPurchaseOrder();
      },
      // 清单处罚
      showListingDialog() {
        this.listingPunishmentDialog = true;
      },
      // 点击添加商品
      addProduct() {
        this.productDialog = true;
        this.selectedProductsConfirm = [];
        if (this.orderDetails.brand) {
          this.selectList.brandId = this.orderDetails.brand.brandId;
        }
        if (this.orderDetails.category) {
          this.selectList.commodityCategoryId = this.orderDetails.category.commodityCategoryId;
        }
        this.selectList.storeId = this.orderDetails.storeId;
        this.selectList.priceStrategyId = this.orderDetails.priceStrategyId;
      },
      // 确定添加商品
      addProductConfirm() {
        let purchaseOrderCommodities = [];
        let selectedProductsPrice = 0;
        if (this.selectedProductsConfirm.length) {
          this.selectedProductsConfirm.forEach(item => {
            selectedProductsPrice += sum(item.valuationMethodValue, item.commodityWide, item.commodityHigh, item.commodityLong, 1, item.costPrice, item.nonStandardParameter, 1, item.coefficient);
            purchaseOrderCommodities.push({
              colourId: item.colourId,
              seriesId: item.seriesId,
              materialId: item.materialId,
              commodityId: item.commodityId,
              width: item.commodityWide,
              high: item.commodityHigh,
              deep: item.commodityLong,
              thick: item.commodityThick,
              commodityNumber: item.commodityNumber,
              itemNumber: item.itemNumber,
              amount: 1,
              onePrice: item.commodityPrice || '',
              costPrice: item.costPrice || '',
              priceUnit: item.commodityUnit || '',
              productionTime: item.constructionPeriod || '',
              nonStandardParameter: item.nonStandardParameter ? Number(item.nonStandardParameter) : 1.000,
              coefficient: item.coefficient || ''
            })
          });
          let params = {
            purchaseOrderId: this.purchaseOrderId,
            settlementMoney: this.getPurchaseOrderPrice + selectedProductsPrice,
            purchaseOrderCommodities: this.getAllCommodities.concat(purchaseOrderCommodities),
            roomId: this.tablesData.roomId,
            budgetRoomId: this.tablesData.budgetRoomId
          };
          if (params.purchaseOrderId) {
            this.loadingBtn = true;
            insertPurchaseOrderCommodity(params)
              .then(response => {
                this.productDialog = false;
                this.loadingBtn = false;
                this.$message.success('添加成功');
                this.getPurchaseOrder();
              })
              .catch(error => {
                this.loadingBtn = false;
                console.log('view/administrationCenter/contractmanagement/components/PurchaseContrat.vue:-addProductConfirm:' + error);
              })
          } else {
            console.log('没有purchaseOrderId');
          }
        } else {
          this.$message.error('请选择要添加的商品');
        }
      },
      // 点击删除
      deleteProduct() {
        if (!this.selectedProducts.length) {
          this.$message.error('请选择要删除的商品');
          return;
        }
        this.$confirm('确定要删除?', '提示', {
          type: 'warning'
        }).then(() => {
          let purchaseOrderCommodities = [];
          this.selectedProducts.forEach(item => {
            purchaseOrderCommodities.push({
              purchaseOrderCommodityId: Number(item.purchaseOrderCommodityId),
              isDelete: 1
            })
          });
          let params = {
            purchaseOrderCommodities,
            reduceMoney: this.getSelectedCommodityPrice,
            purchaseOrderId: this.purchaseOrderId
          }
          updatePurchaseOrderCommodity(params)
            .then(response => {
              if (response.status == 200) {
                this.$message.success('删除成功');
                this.getPurchaseOrder();
              } else {
                this.$message.error(response.message || '删除失败');
              }
            })
            .catch(error => {
              console.log('views/administrationCenter/contractmanagement/components/PurchaseContract.vue:deleteProduct' + error);
            });
        }).catch(() => { });
      },
      // 选择商品 复选框
      selectionChange(val) {
        this.selectedProductsConfirm = val;
      },
      // 移动商品
      handleMove() {
        if (!this.selectedProducts.length) {
          this.$message.error('请选择要移动的商品');
          return;
        }
        this.resetForm('ruleForm');
        this.ruleForm.transferPurchaseOrderId = '';
        this.purchaseListDialog = true;
      },
      // 移动商品确定
      selectPurchaseList(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.loadingBtn = true;
            let params = {
              purchaseOrderId: this.purchaseOrderId,
              transferPurchaseOrderId: this.ruleForm.transferPurchaseOrderId,
              purchaseOrderCommodities: this.getSelectedCommodityIds,
              reduceMoney: this.getSelectedCommodityPrice
            };
            let num = 0;
            transferPurchaseOrderCommodity(params)
              .then(response => {
                if (response.status == 200) {
                  this.purchaseListDialog = false;
                  this.$message.success('操作成功');
                  this.getPurchaseOrder();
                } else {
                  this.$message.error(response.message || '操作失败');
                }
                this.loadingBtn = false;
              })
              .catch(error => {
                this.loadingBtn = false;
                console.log('views/administrationCenter/contractmanagement/components/PurchaseContract.vue:selectPurchaseList' + error);
              });
          } else {
            return false;
          }
        });
      },
      // 保存采购单
      savePurchaseList() {
        let allData = getAllData(this.tablesData.orderCommodity);
        let errorData = [];
        for (let i = 0; i < allData.length; i++) {
          if (!allData[i].width || !allData[i].high || !allData[i].deep || !allData[i].amount || (!allData[i].lineNumber) && this.orderDetails.brand.brandId == 2) {
            errorData.push(allData[i]);
          }
          if (allData[i].width == '' || allData[i].width == null) {
            this.$message.error('请输入宽度');
            break;
          }
          if (allData[i].high == '' || allData[i].high == null) {
            this.$message.error('请输入高度');
            break;
          }
          if (allData[i].deep == '' || allData[i].deep == null) {
            this.$message.error('请输入厚度');
            break;
          }
          if (allData[i].amount == '' || allData[i].amount == null) {
            this.$message.error('请输入数量');
            break;
          }
          if ((allData[i].lineNumber == '' || allData[i].lineNumber == null) && this.orderDetails.brand.brandId == 2) {
            this.$message.error('请输入行号');
            break;
          }
        }
        if (errorData.length) {
          // this.$message.error('请完善信息再保存');
        } else {
          this.loadingBtn = true;
          let finalMoney = this.tablesData.settlementMoney;
          if(this.status){
            if(this.getAllCommodities.length==0){
              finalMoney = this.tablesData.statusChange == 1 ? this.inputMoney : this.tablesData.settlementMoney;
            } else {
              finalMoney = this.tablesData.statusChange == 1 ? this.inputMoney : this.getPurchaseOrderPrice;
            }
          }
          var params = {
              settlementMoney: finalMoney,
              purchaseOrderId: this.purchaseOrderId,
              isInstall: this.tablesData.isInstall,
              purchaseNumber: this.tablesData.purchaseNumber,
              isStorage: this.tablesData.isStorage,
              purchaseOrderCommodities: this.getAllCommodities,
              roomId: this.tablesData.roomId,
              budgetRoomId: this.tablesData.budgetRoomId
          };
          insertPurchaseOrderCommodity(params)
            .then(response => {
              if(response.status==200){
                this.productDialog = false;
                this.$message.success('保存成功');
                this.purchaseOrderList[this.tabIndex].purchaseNumber = this.tablesData.purchaseNumber;
                if (this.status){
                  heavyLoadPurchaseData({
                    purchaseOrderBatchDataId:Number(this.$route.query.purchaseOrderBatchDataId),
                    money:String(finalMoney),
                    purchaseOrderNumber:this.tablesData.purchaseNumber,
                    dataSource:Number(this.$route.query.dataSource),
                    purchaseOrderBatchId:Number(this.$route.query.purchaseOrderBatchId)
                  }).then(res=>{

                  }).catch(err=>{
                    console.log(err)
                  })
                }
                this.getPurchaseOrder();
                // this.inputMoney="";
              }else{
                this.$message.error(response.message || '保存失败');
              }
              this.loadingBtn = false;
            })
            .catch(error => {
              this.loadingBtn = false;
              console.log('view/administrationCenter/contractmanagement/components/PurchaseContrat.vue:savePurchaseList' + error);
            })
        }
      },
      // 执行完成
      completed() {
        if (!this.getAllCommodities.length) {
          if(!this.status){
            this.$message.error('采购单没有商品，不能执行完成');
          }else{
            if (!this.contractDetails.purchaseContractCode) {
              this.$message.error('请输入采购合同号');
              return;
            }
            if (!this.tablesData.purchaseNumber) {
              this.$message.error('请输入采购单号');
              return;
            }
            this.loadingBtn = true;
            let params2 = {
              settlementMoney: this.getPurchaseOrderPrice,
              purchaseOrderId: this.purchaseOrderId,
              isInstall: this.status ? this.updateObj.isInstall : this.tablesData.isInstall,
              purchaseNumber: this.status ? this.updateObj.purchaseNumber : this.tablesData.purchaseNumber,
              isStorage: this.status ? this.updateObj.isStorage : this.tablesData.isStorage,
              purchaseOrderCommodities: this.getAllCommodities,
              roomId: this.status ? this.updateObj.roomId : this.tablesData.roomId,
              budgetRoomId: this.status ? this.updateObj.budgetRoomId : this.tablesData.budgetRoomId
            };
            insertPurchaseOrderCommodity(params2)
              .then(response => {
                let params = {
                  customerContractId: this.$route.query.contractId,
                  orderId: this.$route.query.orderId,
                  purchaseNumber: this.status ? this.updateObj.purchaseNumber : this.tablesData.purchaseNumber,
                  isInstall: this.status ? this.updateObj.isInstall : this.tablesData.isInstall,
                  isStorage: this.status ? this.updateObj.isStorage : this.tablesData.isStorage,
                  purchaseOrderId: this.purchaseOrderId,
                  purchaseContractCode: this.contractDetails.purchaseContractCode,
                  status: 1
                };
                // let fn = this.$route.query.billType == 2 ? stockUpPurchaseComplete : updatePurchaseOrder;
                updatePurchaseOrder(params).then(response => {
                  if (response.message == 'success') {
                    this.$message.success('执行成功');
                    this.tablesData.purchaseStatus = 2;
                    this.tablesData.isExecute = 1;
                  } else {
                    this.$message.error(response.message || '操作失败');
                  }
                  this.loadingBtn = false;
                }).catch(error => {
                  this.loadingBtn = false;
                  console.log('views/administrationCenter/contractmanagement/components/PurchaseContract.vue-completed:' + error);
                })
              })
              .catch(error => {
                this.loadingBtn = false;
                console.log('view/administrationCenter/contractmanagement/components/PurchaseContrat.vue:savePurchaseList' + error);
              });
            // 执行完成之前默认保存采购合同号
            this.savePurchaseOrder();
          }
        } else {
          if (!this.contractDetails.purchaseContractCode) {
            this.$message.error('请输入采购合同号');
            return;
          }
          if (!this.tablesData.purchaseNumber) {
            this.$message.error('请输入采购单号');
            return;
          }
          let allData = getAllData(this.tablesData.orderCommodity);
          let errorData = [];
          for (let i = 0; i < allData.length; i++) {
            if (!allData[i].width || !allData[i].high || !allData[i].deep || !allData[i].amount || (!allData[i].lineNumber) && this.orderDetails.brand.brandId == 2) {
              errorData.push(allData[i]);
            }
            if (allData[i].width == '' || allData[i].width == null) {
              this.$message.error('请输入宽度');
              break;
            }
            if (allData[i].high == '' || allData[i].high == null) {
              this.$message.error('请输入高度');
              break;
            }
            if (allData[i].deep == '' || allData[i].deep == null) {
              this.$message.error('请输入厚度');
              break;
            }
            if (allData[i].amount == '' || allData[i].amount == null) {
              this.$message.error('请输入数量');
              break;
            }
            if ((allData[i].lineNumber == '' || allData[i].lineNumber == null) && this.orderDetails.brand.brandId == 2) {
              this.$message.error('请输入行号');
              break;
            }
          }
          if (errorData.length) {
          } else {
            this.loadingBtn = true;
            let params2 = {
              settlementMoney: this.getPurchaseOrderPrice,
              purchaseOrderId: this.purchaseOrderId,
              isInstall: this.status ? this.updateObj.isInstall : this.tablesData.isInstall,
              purchaseNumber: this.status ? this.updateObj.purchaseNumber : this.tablesData.purchaseNumber,
              isStorage: this.status ? this.updateObj.isStorage : this.tablesData.isStorage,
              purchaseOrderCommodities: this.getAllCommodities,
              roomId: this.status ? this.updateObj.roomId : this.tablesData.roomId,
              budgetRoomId: this.status ? this.updateObj.budgetRoomId : this.tablesData.budgetRoomId
            };
            insertPurchaseOrderCommodity(params2)
              .then(response => {
                let params = {
                  customerContractId: this.$route.query.contractId,
                  orderId: this.$route.query.orderId,
                  purchaseNumber: this.status ? this.updateObj.purchaseNumber : this.tablesData.purchaseNumber,
                  isInstall: this.status ? this.updateObj.isInstall : this.tablesData.isInstall,
                  isStorage: this.status ? this.updateObj.isStorage : this.tablesData.isStorage,
                  purchaseOrderId: this.purchaseOrderId,
                  purchaseContractCode: this.contractDetails.purchaseContractCode,
                  status: 1
                };
                // let fn = this.$route.query.billType == 2 ? stockUpPurchaseComplete : updatePurchaseOrder;
                updatePurchaseOrder(params).then(response => {
                  if (response.message == 'success') {
                    this.$message.success('执行成功');
                    this.tablesData.purchaseStatus = 2;
                    this.tablesData.isExecute = 1;
                  } else {
                    this.$message.error(response.message || '操作失败');
                  }
                  this.loadingBtn = false;
                }).catch(error => {
                  this.loadingBtn = false;
                  console.log('views/administrationCenter/contractmanagement/components/PurchaseContract.vue-completed:' + error);
                })
              })
              .catch(error => {
                this.loadingBtn = false;
                console.log('view/administrationCenter/contractmanagement/components/PurchaseContrat.vue:savePurchaseList' + error);
              });
            // 执行完成之前默认保存采购合同号
            this.savePurchaseOrder();
          }
        }
      },
      // 加入库取弹窗关闭
      close() {
        this.$store.dispatch('MOVETO_WAREHOUSE', {});
      },
      // 保存采购合同号
      savePurchaseOrder() {
        if (!this.contractDetails.purchaseContractCode) {
          this.$message.error('请输入采购合同号');
        } else {
          let params = {
            purchaseContractCode: this.contractDetails.purchaseContractCode,
            customerContractId: this.$route.query.contractId,
            orderId: this.$route.query.orderId
          };
          insertPurchaseContractCode(params)
            .then(response => {
              if (response.message == 'success') {
              } else {
                this.$message.error(response.message || '采购合同号保存失败');
              }
            })
            .catch(error => {
              console.log('views/administrationcenter/contractmanagement/components/audit/AuditInformation.vue:savePurchaseOrder' + error)
            })
        }
      },
      // 确定加入库取
      moveToConfirm(val) {
        insertLibrariesTake(val)
          .then(response => {
            this.$refs.moveToWarehouseDialog.loadingBtn = false;
            this.$message.success('操作成功');
            this.isDelTab = false;
            this.isAddTab = false;
            this.getPurchaseOrder();
            this.close();
          })
          .catch(error => {
            this.$refs.moveToWarehouseDialog.loadingBtn = false;
            console.log('view/administrationCenter/contractmanagement/components/PurchaseContrat.vue' + error);
          })
      },
      // 生成违规单
      listingPunishmentSubmit(formName) {
        this.$refs.listingPunishment.insertIllegalBillSubmit(formName);
      },
      // 成功或失败回调
      successFn(val) {
        if (val) {
          this.listingPunishmentDialog = false;
        }
      },
      // 获取采购单列表
      getPurchaseOrderList(val) {
        this.$store.dispatch('SET_PURCHASE_ORDER_LIST', []);
        let params = {
          customerContractId: this.$route.query.contractId,
          contractType: this.$route.query.contractType,
          StockUpPurchaseOrderId: this.customerContractId
        };
        listPurchaseOrder(params)
          .then(response => {
            if (response.data && response.data.length && response.data[0]) {
              this.$store.dispatch('SET_PURCHASE_ORDER_LIST', response.data);
              if (this.purchaseOrderList.length == 1 || this.isDelTab) {
                this.tabIndex = 0;
                this.tabActive = '采购单1';
                this.purchaseOrderId = response.data[0].purchaseOrderId;
              }
              if (val) {
                this.tabIndex = response.data.length - 1;
                this.tabActive = '采购单' + (response.data.length);
                this.purchaseOrderId = val;
              }
              this.getPurchaseOrder(1);
            } else {
              this.$store.dispatch('SET_PURCHASE_ORDER_LIST', []);
            }
          })
          .catch(error => {
            this.$store.dispatch('SET_PURCHASE_ORDER_LIST', []);
            console.log('views/administrationCenter/contractmanagement/components/PurchaseContract.vue:getPurchaseOrderList' + error);
          });
      },
      // 添加组套商品
      addStark(){
        this.$refs.starkRef.confirm();
      },
      // 组套成功的回调
      successFnStark(result) {
        if (result) {
          this.starkShow = false;
        }
        this.loadingBtn = false;
      },
      addStarkCommodityId(item){
        let selectedProductsPrice = sum(item.valuationMethodValue, 1, 1, 1, 1, item.costPrice, item.nonStandardParameter || 1.000, 1, item.coefficient || 1);
        let newCommodity = [];
        newCommodity.push({
          orderCommodityId: item.purchaseOrderCommodityId,
          commodityId: Number(item.newCommodityId) || Number(item.commodityId),
          commoditySkuId: item.commoditySkuId,
          lineNumber: item.lineNumber,
          width: 1,
          high: 1,
          deep: 1,
          thick: 1,
          colourId: Number(item.colourId),
          seriesId: item.seriesId,
          materialId: item.materialId,
          commodityNumber: item.itemNumber,
          itemNumber: item.itemNumber,
          amount: 1,
          onePrice: item.sellingPrice,
          costPrice: item.costPrice,
          priceUnit: item.commodityUnit || '套',
          nonStandardParameter: Number(item.nonStandardParameter) || 1.000,
          coefficient: item.coefficient || 1,
          valuationMethodValue: item.valuationMethodId || '5'
        });
        let params = {
          settlementMoney: this.getPurchaseOrderPrice + selectedProductsPrice,
          purchaseOrderId: this.purchaseOrderId,
          isInstall: this.tablesData.isInstall,
          purchaseNumber: this.tablesData.purchaseNumber,
          isStorage: this.tablesData.isStorage,
          purchaseOrderCommodities: this.getAllCommodities.concat(newCommodity),
          roomId: this.tablesData.roomId,
          budgetRoomId: this.tablesData.budgetRoomId
        };
        if (params.purchaseOrderId) {
          insertPurchaseOrderCommodity(params)
            .then(response => {
              this.$message.success('添加组套商品成功');
              this.getPurchaseOrder();
            })
            .catch(error => {
              console.log('view/administrationCenter/contractmanagement/components/PurchaseContrat.vue:-insertPurchaseOrderCommodity:' + error);
            })
        } else {
          console.log('没有purchaseOrderId')
        }
      }
    },
    computed: {
      ...mapGetters([
        'moveSelectRow',
        'tablesData',
        'purchaseOrderList',
        'orderDetails',
        'roomList',
        'contractDetails',
        'stackList',
        'isOnFocus'
      ]),
      // 获取选中商品的价钱
      getSelectedCommodityPrice() {
        let price = 0;
        let selectedProducts = getAllData(this.tablesData.orderCommodity, true);
        selectedProducts.forEach(item => {
          price += sum(item.valuationMethodValue, item.width, item.high, item.deep, item.amount, item.costPrice, item.nonStandardParameter, 1, item.coefficient);
        });
        return price.toFixed(2);
      },
      // 保存获取所有的商品
      getAllCommodities() {
        let arr = [];
        let allProducts = [];
        if (this.tablesData.orderCommodity && this.tablesData.orderCommodity.length) {
          allProducts = getAllData(this.tablesData.orderCommodity);
        } else {
          allProducts = getAllData(this.orderCommodity);
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
              amount: item.amount,
              onePrice: item.onePrice,
              costPrice: item.costPrice,
              priceUnit: item.commodityUnit,
              nonStandardParameter: item.nonStandardParameter ? Number(item.nonStandardParameter) : 1.000,
              coefficient: item.coefficient,
              roomId: item.roomId,
              remarks: item.remarks
            })
          });
        }
        return arr;
      },
      // 获取所有选择商品的id （移动和删除需要）
      getSelectedCommodityIds() {
        let arr = [];
        this.selectedProducts.forEach(item => {
          arr.push({
            purchaseOrderCommodityId: item.purchaseOrderCommodityId
          })
        });
        return arr;
      },
      // 计算总价钱（总计）
      getPurchaseOrderPrice() {
        let price = 0;
        let allProducts = [];
        if (this.tablesData.orderCommodity && this.tablesData.orderCommodity.length) {
          allProducts = getAllData(this.tablesData.orderCommodity);
        } else {
          allProducts = getAllData(this.orderCommodity);
        }
        if (allProducts.length) {
          allProducts.forEach(info => {
            price += sum(info.valuationMethodValue, info.width, info.high, info.deep, info.amount, info.costPrice, info.nonStandardParameter, 1, info.coefficient);
          });
        }
        return price;
      },
      // 是否是超级编辑
      isSuperEdit() {
        return this.contractDetails.isSuperEdit == 1;
      }
    },
    watch: {
      stackList(item) {
        if(item.length != 0){
          this.addStarkCommodityId(item);
        }
      },
      purchaseOrderList(val) {
        if (val.length && !this.isAddTab && !this.isDelTab) {
          this.purchaseOrderId = this.purchaseOrderList[0].purchaseOrderId;
          this.getPurchaseOrder();
        }
      }
    }
  }
</script>
