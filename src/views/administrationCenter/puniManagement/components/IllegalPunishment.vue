<template>
  <div class="illeagalInput">
    <div class="moduleHeader clearfix" v-if="!shortkey && header">
      <div class="title fl">违规审核</div>
      <div class="btnList fr">
      </div>
    </div>
    <el-form :model="ruleForm" ref="ruleForm" label-width="130px" :size="size" class="ruleForm">
      <el-row :gutter="gutter" v-if="!shortkey">
        <el-col :span="span">
          <el-form-item label="违规处罚类型">
            <el-select v-model="ruleForm.illegalType" readonly @change="clearForm('ruleForm')">
              <el-option v-for="item in illegalTypeList" :value="item.id" :key="item.id"
                         :label="item.dictName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="span">
          <el-form-item label="违规等级">
            <el-select v-model="ruleForm.illegalLevel" readonly>
              <el-option v-for="item in illegalLevelList" :value="item.id" :key="item.id"
                         :label="item.dictName"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <div class="illegalPrice" v-if="ruleForm.illegalType == 233 || ruleForm.illegalType == 237 || ruleForm.illegalType == 238">
        <!-- 款未清超期行 -->
        <el-row :gutter="gutter" v-if="ruleForm.illegalType == 238">
          <el-col :span="span">
            <el-form-item label="合同金额">
              <el-input readonly v-model="ruleForm.contractMoney" placeholder="合同金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="签合同日期" prop="fewTakeMonye">
              <el-date-picker
                v-model="ruleForm.signingTime"
                type="datetime"
                placeholder="签合同日期" readonly>
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="款清日期" prop="rightDiscountMoney">
              <el-date-picker
                v-model="ruleForm.settlementTime"
                type="datetime"
                placeholder="款清日期" readonly>
              </el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 返点行 -->
        <el-row :gutter="gutter" v-if="ruleForm.illegalType == 237">
          <el-col :span="span">
            <el-form-item label="合同金额">
              <el-input readonly v-model="ruleForm.contractMoney" placeholder="合同金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="返点金额" prop="fewTakeMonye">
              <el-input-number
                class="width-100"
                :controls="false"
                v-model="ruleForm.fewTakeMonye"
                :precision="2" readonly
                :min="0" placeholder="返点金额"
              ></el-input-number>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="正确返点金额" prop="rightDiscountMoney">
              <el-input readonly v-model="ruleForm.rightDiscountMoney" placeholder="正确返点金额"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 价格违规行 -->
        <el-row :gutter="gutter" v-if="ruleForm.illegalType == 233">
          <el-col :span="span">
            <el-form-item label="合同金额">
              <el-input v-model="ruleForm.contractMoney" readonly placeholder="合同金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="少收金额" prop="fewTakeMonye">
              <el-input v-model="ruleForm.fewTakeMonye" readonly placeholder="少收金额"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="正确折后金额" prop="rightDiscountMoney">
              <el-input readonly v-model="ruleForm.rightDiscountMoney" placeholder="正确折后金额"></el-input>

              <!-- <el-input v-model.trim="ruleForm.rightDiscountMoney" clearable placeholder="请输入正确折后金额" readonly></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>

        <!-- 店长 -->
        <el-row :gutter="gutter">
          <el-col :span="span">
            <el-form-item label="店长" prop="punishName">
              <el-input v-model="manager.managerName" placeholder="店长名称" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="扣减业绩额">
              <el-input readonly v-model="manager.managerDelPerformance" placeholder="扣减业绩额"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 销售员 -->
        <el-row :gutter="gutter">
          <el-col :span="span">
            <el-form-item label="销售员">
              <el-input v-model="sales.salesmanName" placeholder="销售名称" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="扣减业绩额">
              <el-input readonly v-model="sales.salesmanNameDelPerformance" placeholder="扣减业绩额"></el-input>
              <!-- <el-input v-model="ruleForm.illegalBillDetailVOList[0].salesmanNameDelPerformance" clearable placeholder="请输入扣减业绩额" readonly></el-input> -->
            </el-form-item>
          </el-col>
        </el-row>
        <!-- 设计师 -->
        <el-row :gutter="gutter">
          <el-col :span="span">
            <el-form-item label="设计师">
              <el-input v-model="designer.designerName" placeholder="设计师名称" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="扣减业绩额">
              <el-input readonly v-model="designer.designerNameDelPerformance" placeholder="扣减业绩额"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="gutter">
          <el-col :span="span">
            <el-form-item label="店面业绩">
              <el-input v-model.trim="ruleForm.storePerformance" clearable placeholder="请输入店面业绩" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="应收折扣明细公式">
              <el-input v-model="ruleForm.formula" clearable placeholder="请输入应收折扣明细公式" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span"
                  v-if="ruleForm.illegalType == 234 || ruleForm.illegalType == 235 || ruleForm.illegalType == 238">
            <el-form-item label="违规天数">
              <el-input v-model="ruleForm.illegalDays" clearable placeholder="请输入违规天数" readonly></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <div class="illegalOther"
           v-if="ruleForm.illegalType && (ruleForm.illegalType != 233 && ruleForm.illegalType != 238 && ruleForm.illegalType != 237)">
        <el-row :gutter="gutter">
          <el-col :span="span" v-if="ruleForm.illegalType == 234 || ruleForm.illegalType == 235">
            <el-form-item label="违规天数">
              <el-input v-model="ruleForm.illegalDays" clearable placeholder="请输入违规天数" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="设计师" v-if="ruleForm.illegalType == 236">
              <el-input v-model="ruleForm.listingPunishName" placeholder="设计师名称" readonly></el-input>
            </el-form-item>
            <el-form-item label="设计师" v-else>
              <el-input v-model="ruleForm.punishName" placeholder="设计师名称" readonly></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="span">
            <el-form-item label="设计师罚款">
              <el-input-number readonly v-model="ruleForm.punishMoney" placeholder="罚款金额"></el-input-number>
              <!-- <el-input v-model="ruleForm.illegalBillDetailVOList[0].delPerformance" clearable placeholder="请输入罚款金额" readonly></el-input> -->
            </el-form-item>
          </el-col>
          <el-col :span="span" v-if="ruleForm.illegalType == 236 && false">
            <el-form-item label="清单多下/少下">
              <el-select v-model="ruleForm.punishType" readonly>
                <el-option v-for="item in listError" :value="item.code" :key="item.code"
                           :label="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </div>
      <el-row :gutter="gutter" v-if="ruleForm.illegalType">
        <el-col :span="24" class="smallTextarea">
          <el-form-item label="违规描述">
            <el-input v-model="ruleForm.illegalDescribe" clearable placeholder="请输入违规描述" type="textarea"
                      readonly></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="illegalListing unsortable m-bottom10" v-if="ruleForm.illegalType == 236">
      <!-- <div class="moduleHeader">
        <div class="title">违规清单</div>
      </div> -->
      <div class="iconBox m-bottom">
        <i class="Icon"></i>
        <span>违规清单</span>
      </div>
      <!-- <div class="cost-btn-list">
           <el-button size="small" class="button-96" @click="addProduct">新增</el-button>
           <el-button size="small" class="button-96" @click="deleteFun">删除</el-button>
         </div> -->

      <div class="table_list m-top20">
        <el-table
          border
          :row-class-name="tableRowClassName"
          :data="ruleForm.illegalBillCommodityVOS"
        >
          <el-table-column type="index" width="55" align="center" fixed="left"></el-table-column>
          <el-table-column prop="commodityCode" label="商品编码" width="140" align="center" sortable show-overflow-tooltip></el-table-column>
          <el-table-column prop="commodityName" label="商品名称" width="240" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="brandName" label="品牌" width="120" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="categoryName" label="品类" width="120" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="commodityModel" label="型号" width="120" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="commoditySeriesName" label="系列" width="140" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="commodityMaterialName" label="材质" width="240" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="commodityColourName" label="颜色" width="240" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="commodityUnit" label="单位" width="240" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column prop="commodityWide" label="宽" width="100" align="center"></el-table-column>
          <el-table-column prop="commodityHigh" label="高" width="100" align="center"></el-table-column>
          <el-table-column prop="commodityLong" label="深" width="100" align="center"></el-table-column>
          <el-table-column prop="commodityThick" label="厚" width="100" align="center"></el-table-column>
          <el-table-column prop="valuationMethod" label="计价方式" width="100" align="center"></el-table-column>
          <el-table-column prop="sellingPrice" label="单价" width="120" align="center"></el-table-column>
<!--          <el-table-column label="非标系数" width="100" align="center"></el-table-column>-->
          <el-table-column prop="num" label="数量" width="100" align="center"></el-table-column>
          <el-table-column prop="sellingPrice" label="原价" width="120" align="center"></el-table-column>
<!--          <el-table-column label="折扣率" width="12" align="center"></el-table-column>-->
          <el-table-column prop="remarks" width="240" label="备注" align="center"></el-table-column>
        </el-table>
        <!-- <el-table border :data="datas" >
          <el-table-column label="商品名称" prop="commodityName" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="产品款型" prop="roomName" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="名称款式" prop="roomName" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="型号" prop="commodityModel" align="center" show-overflow-tooltip></el-table-column>
          <el-table-column label="单价" prop="commodityPrice" align="center"></el-table-column>
          <el-table-column :label="ruleForm.punishType == 2 ? '少下数量' : '多下数量'" prop="classify_name" align="center" width="110">
            <template slot-scope="scope">
              <el-input v-model="scope.row.num" placeholder="数量" :size="tableSize"></el-input>
            </template>
          </el-table-column>
          <el-table-column :label="ruleForm.punishType == 2 ? '少下数量金额' : '多下数量金额'" prop="classify_name" align="center" width="120"></el-table-column>
          <el-table-column label="备注" prop="classify_name" align="center" width="200" show-overflow-tooltip>
            <template slot-scope="scope">
              <el-input v-model="scope.row.remarks" :size="tableSize" placeholder="备注"></el-input>
            </template>
          </el-table-column>
        </el-table> -->
      </div>
    </div>

    <el-dialog
      title="商品列表"
      custom-class="customDialogTitle"
      :visible.sync="productDialog"
      width="1024px"
      class="selectCommodity"
      :append-to-body="true"
    >
      <select-commodity
        @selectionChange="selectionChange"
        ref="selectedCommodities"
        :select-list="productList"
        v-if="productDialog"
      ></select-commodity>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectProductConfirm">确 定</el-button>
        <el-button @click="productDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex';
  import IllegalListingTable from '@/views/administrationCenter/contractmanagement/components/IllegalListingTable';

  import {listBaseDict, getStoreLeader} from 'api/pulicJava';
  import selectCommodity from "@/views/components/selectCommodity";

  import {
    getIllegalBill, // 回显信息
  } from 'api/administrationCenter/puniManagement/punish';
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

    },
    created() {
      this.getIllegalBill();
      this.getBaseDict(); // 获取违规类型 违规等级
      //   this.getStoreLeader();
    },
    data() {
      return {
        readonly: true,
        manager: {
          managerName: '',
          managerDelPerformance: 0
        },
        sales: {
          salesmanName: '',
          salesmanNameDelPerformance: 0
        },
        designer: {
          designerName: '',
          designerNameDelPerformance: 0
        },
        ruleForm: {
          // illegalType: 233,
          illegalLevel: '',
          // contractMoney: this.$store.getters.contractDetails.contractMoney,
          fewTakeMonye: '', // 少收金额
          rightDiscountMoney: '', // 正确折后金额
          illegalBillDetails: [
            {
              jobType: 1, // 店长，
              punishId: '',
              punishName: '',
              delPerformance: '', // 扣减业绩额
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
        span: 8,
        gutter: 20,
        size: 'medium',
        btnSize: 'small',
        tableSize: 'small',
        illegalTypeList: [
          //   { id: '1', dictName: '价格违规' },  233
          //   { id: '2', dictName: '工期超期' }, 234
          //   { id: '3', dictName: '晚交单处罚' }, 235
          //   { id: '4', dictName: '清单处罚' }, 236
          //   { id: '5', dictName: '返点违规' }, 237
          //   { id: '6', dictName: '款未清超期违规' } 238
        ],
        illegalLevelList: [
          //   { id: '1', dictName: '2018年7折以上' },
          //   { id: '2', dictName: '2018年7折以下65折以上（不含7）' }
        ],
        listError: [
          {code: 1, value: '清单多下'},
          {code: 2, value: '清单少下'}
        ],
        // 商品
        productDialog: false,
        productList: {
          selectedCommodities: [], // 选中的商品 可不传 即 已有的table中的商品
          height: "350px", // 设置表格高度 可不传（弹出层最好传下）
          isDialog: true // 是否为弹出层（不传默认为页面）
        },
        selectedProducts: [], // 选择商品
        tabList: [], //  // 表格数据
        elsectVal: [], // table表单 勾选属性

        datas: [],
      };
    },
    methods: {
      // 回显信息
      getIllegalBill() {
        let data = {
          illegalBillId: this.$route.query.illegalBillId,
          illegalType: this.$route.query.illegalType,
        };

        getIllegalBill(data).then(res => {
          if (res.status == 200) {
            this.ruleForm = res.data;
            this.ruleForm.illegalLevel = Number(this.ruleForm.illegalLevel);
            this.ruleForm.illegalType = Number(this.ruleForm.illegalType);

            if (this.ruleForm.illegalBillDetailVOList && this.ruleForm.illegalBillDetailVOList.length != 0) {
              this.ruleForm.illegalBillDetailVOList.forEach(item => {
                if (item.jobType == 1) { // 门店
                  this.manager = {
                    managerName: item.managerName,
                    managerDelPerformance: item.managerDelPerformance,
                  }
                }
                if (item.jobType == 3) { // 销售员
                  this.sales = {
                    salesmanName: item.salesmanName,
                    salesmanNameDelPerformance: item.salesmanNameDelPerformance,
                  }
                }
                if (item.jobType == 2) { // 设计师
                  this.designer = {
                    designerName: item.designerName,
                    designerNameDelPerformance: item.designerNameDelPerformance,
                  }
                }
              })
            }
          }
        }).catch(error =>
          console.log('views/administrationcenter/puniManagement/components/IllegalPbunishment:getStoreLeader' + error)
        )
      },
      //   基础字典查询（违规处罚类型、违规等级）
      getBaseDict() {
        let params1 = {
          dataType: 'ILLEGAL_TYPE'
        }
        let params2 = {
          dataType: 'ILLEGAL_LEVEL',
          belongId: 233
        }
        listBaseDict(params1)
          .then(response => {
            this.illegalTypeList = response.data;
          })
          .catch(error => {
            console.log('views/administrationcenter/contractmanagement/IllegalPbunishment:getBaseDict-ILLEGAL_TYPE' + error)
          })
        listBaseDict(params2)
          .then(response => {
            this.illegalLevelList = response.data;
          })
          .catch(error => {
            console.log('views/administrationcenter/contractmanagement/IllegalPbunishment:getBaseDict-ILLEGAL_LEVEL' + error)
          })
      },
      // 删除
      deleteFun() {
        let arr = [];
        this.elsectVal.forEach(item => {
          arr.push(item.costPriceId);
        });
        let data = {
          costPriceIds: arr,
          organizationId: this.formInline.organizationId
        };
        deleteCostPrice(data).then(res => {
          if (res.status == 200) {
            this.$message.success("删除成功!");
          }
        }).catch(error => {
          console.error("删除成本价", error);
        });
      },
      // 点击添加商品
      addProduct() {
        if (this.elsectVal.length > 0) {
          this.$message({
            message: '请勿选择商品',
            type: 'warning'
          });
          return;
        }
        this.productDialog = true;
        this.productList.selectedCommodities = this.commodityIds;
      },
      // 选择商品 复选框
      selectionChange(val) {
        this.selectedProducts = val;
      },
      // 选择商品
      selectProductConfirm() {
        if (this.selectedProducts.length) {
          this.selectedProducts.forEach(item => {
            this.tabList.push(item);
          })

          this.productDialog = false;
        } else {
          this.$message.warning('请选择商品');
        }
      },
      // 表格斑马线设置
      tableRowClassName({row, rowIndex}) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 表格勾选函数回调
      handleSelectionChange(val) {
        this.elsectVal = val;
      },
      // 切换处罚类型，清除验证
      clearForm(formName) {
        // let newRuleForm = {
        //   fewTakeMonye: '', // 少收金额
        //   rightDiscountMoney: '', // 正确折后金额
        //   illegalBillDetails: [
        //     {
        //       jobType: 1, // 店长，
        //       punishId: '',
        //       punishName: '',
        //       delPerformance: '', // 扣减业绩额
        //       isChecked: false
        //     },
        //     {
        //       jobType: 3, // 销售员，
        //       punishId: '',
        //       punishName: '',
        //       delPerformance: '',
        //       isChecked: false
        //     },
        //     {
        //       jobType: 2, // 设计师，
        //       punishId: '',
        //       punishName: '',
        //       delPerformance: '',
        //       isChecked: false
        //     }
        //   ],
        //   illegalDays: '', // 违规天数
        //   punishType: '', // 处罚类型，1、清单多下、2、清单少下
        //   storePerformance: '', // 店面业绩
        //   formula: '', // 应收折扣明细公式
        //   illegalDescribe: '' // 违规描述
        // }
        // Object.assign(this.ruleForm, newRuleForm);
        // // this.clearValidate(formName);
        // this.datas = [];
      }
    },
    computed: {
      commodityIds() {
        let arr = [];
        this.tabList.forEach(item => {
          arr.push(item.commodityId);
        })
        return arr;
      },
      ...mapGetters([
        'contractDetails',
        'orderDetails'
      ])
    }
  };
</script>
<style scoped lang="scss">
  .el-checkbox {
    font-weight: 700 !important;
  }
</style>

<style lang="scss">
  .illeagalInput {
    .el-input-number {
      .el-input__inner {
        text-align: left;
      }
    }
  }
</style>

