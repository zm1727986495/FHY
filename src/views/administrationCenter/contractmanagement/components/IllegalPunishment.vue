<template>
  <div v-loading="loading">
    <div class="moduleHeader clearfix" v-if="!shortkey && header">
      <div class="title fl">违规审核</div>
      <div class="btnList fr">
        <el-button class="button-96" :size="btnSize" @click="handleInsertIllegalBill('ruleForm')" :loading="loadingBtn">生成违规单</el-button>
      </div>
    </div>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="130px" :size="size" class="ruleForm">
      <el-row :gutter="gutter">
        <el-col :span="span">
          <el-form-item label="违规处罚类型" v-if="!shortkey">
            <el-select v-model="ruleForm.illegalType" :disabled="!header" @change="clearForm('ruleForm')">
              <el-option v-for="item in illegalTypeList" :value="item.id" :key="item.id" :label="item.dictName" :disabled="item.id==237 || item.id==238"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label="违规等级" prop="illegalLevel">
            <el-select v-model="ruleForm.illegalLevel">
              <el-option v-for="item in illegalLevelList" :value="item.id" :key="item.id" :label="item.dictName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="illegalPrice" v-if="ruleForm.illegalType == 233">
        <el-row :gutter="gutter" >
          <el-col :span="span">
            <el-form-item label="合同金额">
              <el-input v-model="ruleForm.contractMoney" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="少收金额">
              <el-input v-model.trim="ruleForm.fewTakeMonye" clearable placeholder="请输入少收金额" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="正确折后金额" prop="rightDiscountMoney">
              <el-input v-model.trim="ruleForm.rightDiscountMoney" clearable placeholder="请输入正确折后金额" @blur="calShortageMoney"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="gutter" >
          <el-col :span="span">
            <el-form-item>
              <template slot="label">
                <el-checkbox v-model="ruleForm.illegalBillDetails[0].isChecked">店&nbsp;&nbsp;&nbsp;长</el-checkbox>
              </template>
              <el-input v-model="ruleForm.illegalBillDetails[0].punishName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="扣减金额">
              <el-input v-model.trim="ruleForm.illegalBillDetails[0].delPerformance" clearable placeholder="请输入扣减金额"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="gutter" >
          <el-col :span="span">
            <el-form-item>
              <template slot="label">
                <el-checkbox v-model="ruleForm.illegalBillDetails[1].isChecked" :disabled="!ruleForm.illegalBillDetails[1].punishId">销售员</el-checkbox>
              </template>
              <el-input v-model="ruleForm.illegalBillDetails[1].punishName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="扣减金额">
              <el-input v-model.trim="ruleForm.illegalBillDetails[1].delPerformance" clearable placeholder="请输入扣减金额"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="gutter" >
          <el-col :span="span">
            <el-form-item>
              <template slot="label">
                <el-checkbox v-model="ruleForm.illegalBillDetails[2].isChecked" :disabled="!ruleForm.illegalBillDetails[2].punishId">设计师</el-checkbox>
              </template>
              <el-input v-model="ruleForm.illegalBillDetails[2].punishName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="扣减金额">
              <el-input v-model.trim="ruleForm.illegalBillDetails[2].delPerformance" clearable placeholder="请输入扣减金额"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="gutter" >
          <el-col :span="span">
            <el-form-item label="店面业绩">
              <el-input v-model.trim="ruleForm.storePerformance" clearable placeholder="请输入店面业绩"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="16">
            <el-form-item label="应收折扣明细公式">
              <el-input v-model="ruleForm.formula" clearable placeholder="请输入应收折扣明细公式"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="illegalOther" v-if="ruleForm.illegalType && ruleForm.illegalType != 233">
        <el-row :gutter="gutter" >
          <el-col :span="span" v-if="ruleForm.illegalType == 234 || ruleForm.illegalType == 235">
            <el-form-item label="违规天数">
              <el-input v-model="ruleForm.illegalDays" clearable placeholder="请输入违规天数"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="设计师">
              <el-input v-model="ruleForm.illegalBillDetails[2].punishName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="设计师罚款">
              <el-input v-model="ruleForm.illegalBillDetails[2].delPerformance" clearable placeholder="请输入罚款金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span" v-if="ruleForm.illegalType == 236">
            <el-form-item label="清单多下/少下">
              <el-select v-model="ruleForm.punishType" clearable>
                <el-option v-for="item in listError" :value="item.code" :key="item.code" :label="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="gutter" v-if="ruleForm.illegalType">
        <el-col :span="24" class="smallTextarea">
          <el-form-item label="违规描述">
            <el-input v-model="ruleForm.illegalDescribe" clearable placeholder="请输入违规描述" type="textarea"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="illegalListing unsortable m-bottom20" v-if="ruleForm.illegalType == 236 && ruleForm.punishType">
      <div class="moduleHeader">
        <div class="title">违规清单</div>
      </div>
      <div class="m-bottom10">
        <el-button class="button-96" :size="btnSize" @click="addProduct()">添加商品</el-button>
<!--        <el-button class="button-96" :size="btnSize" @click="deleteProduct()">删除</el-button>-->
      </div>
      <div class="table_list">
        <el-table border :data="tableDataNew" @selection-change="selectionChangePunish" max-height="300">
          <el-table-column type="index" align="center" width="50" fixed="left"></el-table-column>
          <el-table-column label="商品编码" prop="commodityCode" align="center" fixed="left" width="170" show-overflow-tooltip>
            <template slot-scope="scope">
              <div>
                <el-tooltip placement="right" visible-arrow><!--v-if="scope.row.illegalTypeId == 234 || scope.row.illegalTypeId == 235 || scope.row.illegalTypeId == 238"-->
                  <div slot="content" class="tips tipFon">
                    <p class="operaItems" @click="handleDelete(scope.row)">删除</p>
                  </div>
                  <img :src="spot" alt="" class="attributesTips">
                </el-tooltip>
                <p class="operation">{{ scope.row.commodityCode }}</p>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="商品名称" prop="commodityName" align="center" show-overflow-tooltip width="230"></el-table-column>
          <el-table-column label="型号" prop="commodityModel" align="center" show-overflow-tooltip width="150"></el-table-column>
          <el-table-column prop="commodityWide" label="宽" align="center" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.commodityWide" :size="tableSize" placeholder="宽" @blur="getsku(scope.row)"></el-input>
            </template>
          </el-table-column>-->
          <el-table-column prop="commodityHigh" label="高" align="center" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.commodityHigh" :size="tableSize" placeholder="高" @blur="getsku(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="commodityLong" label="深" align="center" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.commodityLong" :size="tableSize" placeholder="深" @blur="getsku(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="commodityLong" label="深" align="center" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.commodityThick" :size="tableSize" placeholder="厚" @blur="getsku(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="单价" prop="commodityPrice" align="center"></el-table-column>
          <el-table-column :label="ruleForm.punishType == 2 ? '少下数量' : '多下数量'" prop="num" align="center" width="120">
            <template slot-scope="scope">
              <el-input v-model="scope.row.num" placeholder="数量" :size="tableSize" @blur="getsku(scope.row)"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="ruleForm.punishType == 2 ? '少下数量金额' : '多下数量金额'" prop="price" align="center" width="120"></el-table-column>
          <el-table-column label="设计师罚款" prop="punishMoney" align="center" width="120" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.punishMoney" :size="tableSize" placeholder="设计师罚款" @blur="calPunishMoneyTotal"></el-input>
            </template>
          </el-table-column>
          <el-table-column label="备注" prop="remarks" align="center" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.remarks" :size="tableSize" placeholder="备注"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>
    <el-dialog title="商品列表" :visible.sync="productDialog" width="90%" custom-class="selectCommodity customDialogTitle" top="2vh" :append-to-body="true">
      <select-commodity @selectionChange="selectionChange" ref="selectedCommodities" :select-list="selectList" v-if="productDialog"></select-commodity>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectProductConfirm">确 定</el-button>
        <el-button @click="productDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import spot from '@/assets/images/spot.png';
  import IllegalListingTable from '@/views/administrationCenter/contractmanagement/components/IllegalListingTable';
  import selectCommodity from '@/views/components/selectCommodity';
  import { listBaseDict, getStoreLeader, getUUID, getGoodsSKUId } from 'api/pulicJava';
  import { insertCommoditySku } from 'api/entrepotSet/stockManagement/stockPending/stockPending';
  import { insertIllegalBill, getIllegalBill, updateIllegalBill } from 'api/administrationCenter/contractmanagement/contractmanagement';
  import { sum } from '@/utils/pubilcFn';
  export default {
    components: {
      IllegalListingTable,
      selectCommodity
    },
    props: {
      shortkey: {
        type: Boolean,
        default() {
          return false
        }
      },
      header: {
        type: Boolean,
        default: () => true
      },
      illegalInfo: {
        default() {
          return {}
        }
      },
      edit: {
        type: Boolean,
        default: () => false
      }
    },
    mounted() {
      this.getBaseDict();
      this.getIllegalLevelList();
      if (!this.edit) {
        if (this.illegalInfo.illegalType) {
          this.ruleForm.illegalType = this.illegalInfo.illegalType;
          let uuidParams = {
            serialNumber: 'VO'
          };
          getUUID(uuidParams)
            .then(response => {
              this.ruleForm.illegalBillSn = response.data;
            })
            .catch(error => {
              console.log('views/administrationcenter/components/IllegalPunishment.vue-getUUID:' + error);
            })
        }
        this.getStoreLeader();
        setTimeout(() => {
          this.ruleForm.contractMoney = this.contractDetails.contractMoney;
          this.ruleForm.illegalBillDetails[1].punishId = this.orderDetails.salesmanId;
          this.ruleForm.illegalBillDetails[1].punishName = this.orderDetails.salesmanName;
          this.ruleForm.illegalBillDetails[2].punishId = this.orderDetails.designer;
          this.ruleForm.illegalBillDetails[2].punishName = this.orderDetails.designerName;
        },200);
      } else {
        this.ruleForm.illegalType = '';
        this.handleEdit();
      }
    },
    data() {
      return {
        loadingBtn: false,
        spot,
        span: 8,
        gutter: 20,
        tableSize: 'mini',
        illegalBillSn: '', // 违规单号
        illegalTypeList: [
          // { id: '1', dictName: '价格违规' },
          // { id: '2', dictName: '工期超期' },
          // { id: '3', dictName: '晚交单处罚' },
          // { id: '4', dictName: '清单处罚' },
          // { id: '5', dictName: '返点违规' },
          // { id: '6', dictName: '款未清超期违规' }
        ],
        illegalLevelList: [
          // { id: '1', dictName: '2018年7折以上' },
          // { id: '2', dictName: '2018年7折以下65折以上（不含7）' }
        ],
        listError: [
          { code: 1, value: '清单多下' },
          { code: 2, value: '清单少下' }
        ],
        ruleForm: {
          contractMoney: '',
          illegalType: 233,
          illegalLevel: '',
          fewTakeMonye: '', // 少收金额
          rightDiscountMoney: '', // 正确折后金额
          illegalBillDetails: [
            {
              jobType: 1, // 店长，
              punishId: '',
              punishName: '',
              delPerformance: '', // 扣减金额
              isChecked: false
            },
            {
              jobType: 3, // 销售员，
              punishId: '',
              punishName: '',
              delPerformance: '',
              isChecked: false
            },
            {
              jobType: 2, // 设计师，
              punishId: '',
              punishName: '',
              delPerformance: '',
              isChecked: false
            }
          ],
          illegalDays: '', // 违规天数
          punishType: '', // 处罚类型，1、清单多下、2、清单少下
          storePerformance: '', // 店面业绩
          formula: '', // 应收折扣明细公式
          illegalDescribe: '' // 违规描述
        },
        rules: {
          fewTakeMonye: [
            { required: true, message: '请输入金额', trigger: 'blur' }
          ],
          rightDiscountMoney: [
            { required: true, message: '请输入金额', trigger: 'blur' }
          ],
          illegalLevel: [
            { required: true, message: '请选择违规等级', trigger: 'change' }
          ]
        },
        datas: [],
        selectList: {
          selectedCommodities: [], // 选中的商品 可不传
          height: '350px', // 设置表格高度 可不传（弹出层最好传下）
          isDialog: true, // 是否为弹出层（不传默认为页面）
          priceStrategyId: '', // 价格策略
          brandId: 0,
          commodityCategoryId: 0,
          disabled: true
        },
        productDialog: false,
        selectedProducts: [],
        selectedProductsPunish: [],
        isSuccess: false,
        loading: false
      };
    },
    methods: {
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      },
      clearValidate(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].clearValidate();
        }
      },
      // 根据门店获取店长
      getStoreLeader() {
        let params = {
          storeId: this.$route.query.storeId
        };
        getStoreLeader(params)
          .then(response => {
            this.ruleForm.illegalBillDetails[0].punishId = response.data.userId;
            this.ruleForm.illegalBillDetails[0].punishName = response.data.name;
          })
          .catch(error => {
            console.log('views/administrationcenter/contractmanagement/IllegalPbunishment:getStoreLeader' + error)
          })
      },
      // 基础字典查询（违规处罚类型）
      getBaseDict() {
        let params1 = {
          dataType: 'ILLEGAL_TYPE'
        }
        listBaseDict(params1)
          .then(response => {
            this.illegalTypeList = response.data;
          })
          .catch(error => {
            console.log('views/administrationcenter/contractmanagement/IllegalPbunishment:getBaseDict-ILLEGAL_TYPE' + error)
          })
      },
      // 获取违规等级
      getIllegalLevelList() {
        this.illegalLevelList = [];
        let params2 = {
          dataType: 'ILLEGAL_LEVEL'
        };
        if (this.ruleForm.illegalType == 233) {
          params2.belongId = 233;
        } else {
          delete params2.belongId
        }
        listBaseDict(params2)
          .then(response => {
            this.illegalLevelList = response.data;
          })
          .catch(error => {
            console.log('views/administrationcenter/contractmanagement/IllegalPbunishment:getBaseDict-ILLEGAL_LEVEL' + error)
          })
      },
      // 点击添加商品
      addProduct() {
        this.productDialog = true;
        if (this.orderDetails.brand) {
          this.selectList.brandId = this.orderDetails.brand.brandId;
        }
        if (this.orderDetails.category) {
          this.selectList.commodityCategoryId = this.orderDetails.category.commodityCategoryId;
        }
        this.selectList.storeId = this.orderDetails.storeId;
        this.selectList.priceStrategyId = this.orderDetails.priceStrategyId;
        // this.selectList.selectedCommodities = this.commodityIds;
      },
      // 选择商品
      selectProductConfirm() {
        if (this.selectedProducts.length) {
          this.selectedProducts.forEach(item => {
            let paramsGetSku = {
              commoditySeriesId: item.seriesId,
              commodityColourId: item.colourId,
              commodityMaterialId: item.materialId,
              commodityId: item.commodityId,
              commodityWide: item.commodityWide,
              commodityHigh: item.commodityHigh,
              commodityLong: item.commodityLong,
              commodityThick: item.commodityThick,
              commodityNumber: item.commodityNumber
            };
            getGoodsSKUId(paramsGetSku)
              .then(resGet => {
                if (resGet.data && resGet.data.commoditySKUId) {
                  item.commoditySKUId = resGet.data.commoditySKUId;
                  this.datas.push(item);
                } else {
                  insertCommoditySku(paramsGetSku)
                    .then(resAdd => {
                      item.commoditySKUId = resAdd.data;
                      this.datas.push(item);
                    })
                    .catch(error => {
                      console.log('通用接口新增skuid-transfer.vue')
                    })
                }
              })
              .catch(error => {
                console.log('根据颜色、系列、材质、商品id生成skuid' + error);
              });
          })
          this.productDialog = false;
        } else {
          this.$message.warning('请选择商品');
        }
      },
      // 删除商品
      deleteProduct() {
        if (!this.selectedProductsPunish.length) {
          this.$message.warning('请选择要删除的商品');
          return;
        }
      },
      // 选择商品 复选框
      selectionChange(val) {
        this.selectedProducts = val;
      },
      // 选择商品 少选
      selectionChangePunish(val) {
        this.selectedProductsPunish = val;
      },
      // 点击生成违规单
      handleInsertIllegalBill(formName) {
        let uuidParams = {
          serialNumber: 'VO'
        };
        getUUID(uuidParams)
          .then(response => {
            this.ruleForm.illegalBillSn = response.data;
          })
          .catch(error => {
            console.log('views/administrationcenter/components/IllegalPunishment.vue-getUUID:' + error);
          })
        this.$confirm('确定生成违规单?', '提示', {
          type: 'warning'
        }).then(() => {
          this.insertIllegalBillSubmit(formName);
        }).catch(() => {});
      },
      // 生成违规单
      insertIllegalBillSubmit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let illegalBillDetails = [];
            if (this.ruleForm.illegalType == 233) {
              illegalBillDetails = this.ruleForm.illegalBillDetails.filter(item => {
                return item.isChecked;
              })
              if (!illegalBillDetails.length) {
                this.$message.error('请选择处罚人');
                return;
              }
            } else {
              illegalBillDetails = this.ruleForm.illegalBillDetails.filter((item,index) => {
                return index == 2;
              })
            }
            this.loadingBtn = true;
            let params = {
              ...this.ruleForm,
              illegalBillDetails,
              illegalBillCommodities: this.illegalBillCommodities,
              orderId: this.$route.query.orderId
            };
            if (this.edit) {
              params.illegalBillId = this.illegalInfo.illegalBillId
            }
            let fn = this.edit ? updateIllegalBill : insertIllegalBill;
            fn(params)
              .then(response => {
                if (response.status == 200) {
                  this.isSuccess = true;
                  this.$emit('successFn', this.isSuccess);
                  this.ruleForm.illegalType = 233;
                  this.clearForm('ruleForm');
                  this.$message.success('操作成功');
                } else {
                  let message = response.message || '操作失败';
                  this.$message.error(message);
                  this.isSuccess = false;
                  this.$emit('successFn', this.isSuccess);
                }
                this.loadingBtn = false;
              })
              .catch(error => {
                if (this.edit) {
                  this.isSuccess = false;
                  this.$emit('successFn', this.isSuccess);
                }
                this.loadingBtn = false;
                console.log('views/administrationcenter/contractmanagement/components/IllegalPunishment.vue:insertIllegalBillSubmit' + error)
              })
          } else {
            return false;
          }
        });
      },
      // 切换处罚类型，清除验证
      clearForm(formName) {
        this.selectList.brandId = this.orderDetails.brand.brandId;
        this.selectList.commodityCategoryId = this.orderDetails.category.commodityCategoryId;
        this.selectList.priceStrategyId = this.orderDetails.priceStrategyId;
        this.ruleForm.fewTakeMonye = ''; // 少收金额
        this.ruleForm.rightDiscountMoney = ''; // 正确折后金额
        this.ruleForm.illegalBillDetails.forEach(item => {
          item.isChecked = false;
          item.delPerformance = '';
        });
        this.ruleForm.illegalLevel = '';
        this.ruleForm.illegalDays = ''; // 违规天数
        this.ruleForm.punishType = ''; // 处罚类型，1、清单多下、2、清单少下
        this.ruleForm.storePerformance = ''; // 店面业绩
        this.ruleForm.formula = ''; // 应收折扣明细公式
        this.ruleForm.illegalDescribe = ''; // 违规描述
        this.clearValidate(formName);
        this.datas = [];
        this.getIllegalLevelList();
      },
      // 编辑回显
      handleEdit() {
        this.loading = true;
        let params = {
          illegalBillId: this.illegalInfo.illegalBillId,
          illegalType: this.illegalInfo.illegalType
        };
        getIllegalBill(params)
          .then(response => {
            this.loading = false;
            if (response.status == 200) {
              let illegalInfo = {
                illegalType: Number(this.illegalInfo.illegalType),
                illegalLevel: Number(response.data.illegalLevel),
                contractMoney: response.data.contractMoney, // 合同金额
                fewTakeMonye: response.data.fewTakeMonye, // 少收金额
                rightDiscountMoney: response.data.rightDiscountMoney, // 正确折后金额
                illegalDays: response.data.illegalDays, // 违规天数
                punishType: response.data.punishId, // 处罚类型，1、清单多下、2、清单少下
                storePerformance: response.data.storePerformance, // 店面业绩
                formula: response.data.formula, // 应收折扣明细公式
                illegalDescribe: response.data.illegalDescribe, // 违规描述
                illegalBillDetails: [
                  {
                    jobType: 1, // 店长，
                    punishId: '',
                    punishName: '',
                    delPerformance: '', // 扣减金额
                    ibdId: '',
                    isChecked: false
                  },
                  {
                    jobType: 3, // 销售员，
                    punishId: '',
                    punishName: '',
                    delPerformance: '',
                    ibdId: '',
                    isChecked: false
                  },
                  {
                    jobType: 2, // 设计师，
                    punishId: '',
                    punishName: '',
                    delPerformance: '',
                    ibdId: '',
                    isChecked: false
                  }
                ]
              }
              if (response.data.illegalBillDetailVOList && response.data.illegalBillDetailVOList.length) {
                response.data.illegalBillDetailVOList.forEach(item => {
                  if (item.jobType == 1) { // 店长
                    illegalInfo.illegalBillDetails[0].punishId = item.managerId;
                    illegalInfo.illegalBillDetails[0].punishName = item.managerName;
                    illegalInfo.illegalBillDetails[0].delPerformance = item.managerDelPerformance;
                    illegalInfo.illegalBillDetails[0].isChecked = true;
                    illegalInfo.illegalBillDetails[0].ibdId = item.ibdId;
                  }
                  if (item.jobType == 2) { // 设计师
                    illegalInfo.illegalBillDetails[2].punishId = item.designerId;
                    illegalInfo.illegalBillDetails[2].punishName = item.designerName;
                    illegalInfo.illegalBillDetails[2].delPerformance = item.designerNameDelPerformance;
                    illegalInfo.illegalBillDetails[2].isChecked = true;
                    illegalInfo.illegalBillDetails[2].ibdId = item.ibdId;
                  }
                  if (item.jobType == 3) { // 销售
                    illegalInfo.illegalBillDetails[1].punishId = item.salesmanId;
                    illegalInfo.illegalBillDetails[1].punishName = item.salesmanName;
                    illegalInfo.illegalBillDetails[1].delPerformance = item.salesmanNameDelPerformance;
                    illegalInfo.illegalBillDetails[1].isChecked = true;
                    illegalInfo.illegalBillDetails[1].ibdId = item.ibdId;
                  }
                })
              }
              Object.assign(this.ruleForm, illegalInfo);
            }
          })
          .catch(error => {
            this.loading = false;
            console.log('views/administrationcenter/contractmanagement/components/IllegalPunishment.vue:handleEdit' + error)
          })
      },
      // 删除商品
      handleDelete(row) {
        let index = this.datas.indexOf(row);
        this.datas.splice(index, 1);
      },
      // 计算设计师罚款总钱 - 清单违规
      calPunishMoneyTotal() {
        let punishMoneyTotal = 0;
        this.datas.forEach(item => {
          punishMoneyTotal += Number(item.punishMoney) || 0;
          this.ruleForm.illegalBillDetails[2].delPerformance = punishMoneyTotal;
        })
      },
      // 计算正确折后金额
      calShortageMoney() {
        if (this.ruleForm.rightDiscountMoney) {
          if (Number(this.ruleForm.rightDiscountMoney)) {
            this.ruleForm.fewTakeMonye = (this.ruleForm.contractMoney - this.ruleForm.rightDiscountMoney).toFixed(2);
          } else {
            this.$message.error('请输入正确的金额');
            this.ruleForm.rightDiscountMoney = '';
          }
        }
      },
      // 生成skuid
      getsku(row) {
        let paramsGetSku = {
          commoditySeriesId: row.seriesId,
          commodityColourId: row.colourId,
          commodityMaterialId: row.materialId,
          commodityId: row.commodityId,
          commodityWide: row.commodityWide,
          commodityHigh: row.commodityHigh,
          commodityLong: row.commodityLong,
          commodityThick: row.commodityThick,
          commodityNumber: row.commodityNumber
        };
        getGoodsSKUId(paramsGetSku)
          .then(resGet => {
            if (resGet.data && resGet.data.commoditySKUId) {
              row.commoditySKUId = resGet.data.commoditySKUId;
              this.savePurchaseList();
            } else {
              insertCommoditySku(paramsGetSku)
                .then(resAdd => {
                  row.commoditySKUId = resAdd.data;
                  this.savePurchaseList();
                })
                .catch(error => {
                  console.log('通用接口新增skuid-transfer.vue')
                })
            }
          })
          .catch(error => {
            console.log('根据颜色、系列、材质、商品id生成skuid' + error);
          });
      }
    },
    computed: {
      commodityIds() {
        let arr = [];
        if (this.datas.length) {
          this.datas.forEach(item => {
            arr.push(item.commodityId);
          })
        }
        return arr;
      },
      tableDataNew() {
        let newArr = [];
        if (this.datas.length) {
          this.datas.forEach(item => {
            item.commodityPrice = item.commodityPrice ? Number(item.commodityPrice) : 0;
            let price = 0;
            price += sum(item.valuationMethodValue, item.commodityWide, item.commodityHigh, item.commodityLong, item.num, item.commodityPrice, item.nonStandardParameter, item.discountRate, 1);
            item.price = price;
            newArr.push(item)
          })
        }
        return newArr;
      },
      // 清单处罚商品参数
      illegalBillCommodities() {
        let arr = [];
        if (this.datas.length) {
          this.datas.forEach(item => {
            arr.push({
              commoditySKUId: item.commoditySKUId,
              commodityId: item.commodityId,
              punishType: this.ruleForm.punishType,
              onePrice: item.commodityPrice,
              num: Number(item.num) || 0,
              punishAt: this.ruleForm.illegalBillDetails[2].punishId,
              punishMoney: Number(item.punishMoney) || 0,
              remarks: item.remarks
            })
          })
        }
        return arr;
      },
      ...mapGetters([
        'contractDetails',
        'orderDetails',
        'size',
        'btnSize'
      ])
    }
  };
</script>
<style scoped>
  .el-checkbox{
    font-weight: 700 !important;
  }
</style>
