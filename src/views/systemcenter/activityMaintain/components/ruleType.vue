<template>
  <div class="ruleType">
    <div class="m-bottom20">
      <el-button v-for="(item,index) in actionBtnList" :type="item.style" class="button-96" @click="butGroupAction(item.url,item.type)" :key="index" :size="btnSize">{{item.name}}</el-button>
    </div>
    <div class="table_list unsortable" v-loading="tableLoading">
      <el-table border :data="activityRuleList" :row-class-name="tableRowClassName">
        <el-table-column align="center" label="序号" width="100">
          <template slot-scope="scope">
            <div>
              <el-tooltip placement="right" visible-arrow>
                <div slot="content" class="tips tipFon">
                  <p @click="handleEditRules(scope.row)" class="operaItems">编辑</p>
                  <p @click="handleDeleteRules(scope.row)" class="operaItems">删除</p>
                </div>
                <img :src="spot" alt="" class="attributesTips">
              </el-tooltip>
              <p class="operation">{{scope.$index + 1}}</p>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ruleType" label="类型" width="110">
          <template slot-scope="scope">
            <span v-if="scope.row.ruleType == 0">满减</span>
            <span v-else-if="scope.row.ruleType == 1">折扣</span>
            <span v-else-if="scope.row.ruleType == 2">加价购</span>
            <span v-else-if="scope.row.ruleType == 3">一口价</span>
            <span v-else-if="scope.row.ruleType == 4">赠礼品</span>
            <span v-else-if="scope.row.ruleType == 5">套餐</span>
            <span v-else-if="scope.row.ruleType == 6">品牌联动</span>
            <span v-else>-</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="ruleName" label="自定义名称" width="200" show-overflow-tooltip>
          <template slot-scope="scope">
            <el-button type="text" @click="handleEditRules(scope.row, 1)">{{ scope.row.ruleName }}</el-button>
          </template>
        </el-table-column>
<!--        <el-table-column align="center" prop="ruleContent" label="规则内容" width="300" show-overflow-tooltip></el-table-column>-->
        <el-table-column align="center" prop="brandName" label="适用品牌" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="categoryName" label="适用品类" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="remarks" label="备注" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <!--添加优惠类型-->
    <el-dialog :title="rulesTitle + '规则'" :visible.sync="rulesDialogVisibleAdd" width="80%" custom-class="customDialogTitle" top="5vh" :close-on-click-modal="false">
      <div class="dialogBody" v-loading="loading">
        <el-form :model="rulesModel" :disabled="isView" :rules="rules" ref="rulesModel" :label-width="formLabelWidthDialog" :size="size" class="rulesDialogForm ruleForm clearfix">
          <el-col :span="dialogSpan">
            <el-form-item label="规则类型" prop="ruleType">
              <el-select v-model="rulesModel.ruleType" clearable @change="clearForm('ruleType')" :disabled="!isAdd">
                <el-option v-for="item in rulesTypeList" :label="item.ruleName" :value="item.ruleType" :key="item.ruleType"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="dialogSpan">
            <el-form-item label="规则名称" prop="ruleName">
              <el-input v-model.trim="rulesModel.ruleName" clearable placeholder="请输入规则名称"></el-input>
            </el-form-item>
          </el-col>
          <!-- 满减-0 -->
          <el-col :span="fullSpan" v-if="rulesModel.ruleType === 0">
            <el-col :span="dialogSpan">
              <el-form-item label="满减类型" prop="ruleTypeDetail">
                <el-select v-model="rulesModel.ruleTypeDetail" clearable @change="clearForm" :disabled="!isAdd">
                  <el-option v-for="item in fullReductionList" :label="item.value" :value="item.code" :key="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="dialogSpan" v-if="rulesModel.ruleTypeDetail === 1">
              <el-form-item label="规则" required>
                <el-col :span="4" class="line">每满</el-col>
                <el-col :span="8">
                  <el-form-item prop="fullPrice">
                    <el-input v-model.trim="rulesModel.fullPrice"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="3" class="line">减</el-col>
                <el-col :span="8">
                  <el-form-item prop="reducePrice">
                    <el-input v-model.trim="rulesModel.reducePrice"></el-input>
                  </el-form-item>
                </el-col>
              </el-form-item>
            </el-col>
          </el-col>
          <!--折扣-1-->
          <el-col :span="dialogSpan" v-if="rulesModel.ruleType == 1">
            <el-form-item label="规则" required>
              <el-col :span="8">
                <el-form-item prop="discount">
                  <el-input v-model.trim="rulesModel.discount"></el-input>
                </el-form-item>
              </el-col>
              <el-col :span="4" class="line">折</el-col>
            </el-form-item>
          </el-col>
          <!--加价购-2-->
          <el-col :span="fullSpan" v-if="rulesModel.ruleType == 2">
            <el-col :span="dialogSpan">
              <el-form-item label="加价购类型" prop="ruleTypeDetail" @change="clearForm">
                <el-select v-model="rulesModel.ruleTypeDetail" clearable>
                  <el-option v-for="item in raisePriceTypeList" :label="item.value" :value="item.code" :key="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="dialogSpan" class="smallTextarea">
              <el-form-item label="规则说明" prop="ruleContent">
                <el-input v-model="rulesModel.ruleContent" type="textarea" placeholder="请输入规则说明"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <!--赠礼品-4-->
          <el-col :span="fullSpan" v-if="rulesModel.ruleType == 4">
            <el-col :span="dialogSpan">
              <el-form-item label="赠礼品类型" prop="ruleTypeDetail">
                <el-select v-model="rulesModel.ruleTypeDetail" clearable @change="clearForm" :disabled="!isAdd">
                  <el-option v-for="item in giftTypeList" :label="item.value" :value="item.code" :key="item.code"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="dialogSpan" class="smallTextarea">
              <el-form-item label="规则说明" prop="ruleContent">
                <el-input v-model="rulesModel.ruleContent" type="textarea" placeholder="请输入规则说明"></el-input>
              </el-form-item>
            </el-col>
          </el-col>
          <!--品牌联动-6-->
          <el-col :span="dialogSpan" class="smallTextarea" v-if="rulesModel.ruleType == 6">
            <el-form-item label="规则" prop="ruleContent">
              <el-input v-model="rulesModel.ruleContent" type="textarea" placeholder="请输入规则"></el-input>
            </el-form-item>
          </el-col>
          <!--显示添加商品和添加规则按钮-->
          <el-col :span="fullSpan" v-if="showRangeSelect.flag">
            <el-form-item label="参加规则商品范围">
              <!-- 满减-满减-->
              <el-button class="button-96" @click="handleAddRules" :size="btnSize" v-if="showAddRuleBtn">添加规则</el-button>
              <el-button class="button-96" @click="handleAddProducts(undefined,0)" :size="btnSize" v-if="!showAddProduct">添加商品</el-button>
            </el-form-item>
          </el-col>
          <!--显示表格-->
          <el-col :span="fullSpan">
            <!--规则表格-->
            <div class="table_list form-item-table unsortable" v-if="showAddRuleBtn">
              <el-table border :data="ruleTable" :row-class-name="tableRowClassName" max-height="250">
                <el-table-column align="center" label="操作" width="100" v-if="showAddChildBtn || !isView">
                  <template slot-scope="scope">
                    <div>
                      <el-tooltip placement="right" visible-arrow>
                        <div slot="content" class="tips tipFon">
                          <p @click="handleRemove(scope.$index,ruleTable)" class="operaItems" v-if="!isView">移除</p>
                          <p @click="handleAddProducts(scope.$index,1)" class="operaItems" v-if="showAddChildBtn && !isView">添加商品</p>
                          <el-popover placement="bottom" trigger="click" width="800" v-if="showAddChildBtn">
                            <el-table :data="scope.row.childProductList" border :size="tableSize" max-height="300">
                              <el-table-column align="center" label="操作" width="50" v-if="!isView">
                                <template slot-scope="scopeChild">
                                  <div>
                                    <el-tooltip placement="right" visible-arrow>
                                      <div slot="content" class="tips tipFon">
                                        <p @click="handleRemove(scopeChild.$index,scopeChild.row.childProductList)" class="operaItems">移除</p>
                                      </div>
                                      <img :src="spot" alt="" class="attributesTips">
                                    </el-tooltip>
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column align="center" prop="commodityName" label="商品名称"></el-table-column>
                              <el-table-column align="center" prop="category_name" label="品类"></el-table-column>
                              <el-table-column align="center" prop="commodityPrice" label="价格"></el-table-column>
                              <el-table-column align="center" prop="activityPrice" label="活动价" min-width="120" v-if="childShowActivityPrice">
                                <template slot-scope="childScope">
                                  <el-input v-model.trim="childScope.row.activityPrice" placeholder="活动价" :size="tableSize"></el-input>
                                </template>
                              </el-table-column>
                            </el-table>
                            <el-badge class="item" slot="reference">
                              <p class="operaItems">查看商品</p>
                            </el-badge>
                          </el-popover>
                        </div>
                        <img :src="spot" alt="" class="attributesTips">
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="price" label="规则金额">
                  <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.price" :size="tableSize" clearable placeholder="请输入规则金额"></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="reducePrice" label="减金额" v-if="rulesModel.ruleType === 0 && rulesModel.ruleTypeDetail === 0">
                  <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.reducePrice" :size="tableSize" clearable placeholder="请输入满减金额"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
            <!--商品表格-->
            <div class="table_list form-item-table unsortable" v-if="showRangeSelect.tableFlag">
              <el-table border :data="selectedProductTable" :row-class-name="tableRowClassName" key="selectedProductTable" max-height="300">
                <el-table-column align="center" label="操作" width="50" v-if="showAddChildBtn || !isView" fixed="left">
                  <template slot-scope="scope">
                    <div>
                      <el-tooltip placement="right" visible-arrow>
                        <div slot="content" class="tips tipFon">
                          <p @click="handleRemove(scope.$index,selectedProductTable)" class="operaItems" v-if="!isView">移除</p>
                          <p @click="handleAddProducts(scope.$index,1)" class="operaItems" v-if="showAddChildBtn && !isView">添加商品</p>
                          <el-popover placement="bottom" trigger="click" width="800" v-if="showAddChildBtn">
                            <el-table :data="scope.row.childProductList" border :size="tableSize">
                              <el-table-column align="center" label="操作" width="50" v-if="!isView">
                                <template slot-scope="childScope">
                                  <div>
                                    <el-tooltip placement="right" visible-arrow>
                                      <div slot="content" class="tips tipFon">
                                        <p @click="handleRemove(childScope.$index,scope.row.childProductList)" class="operaItems">移除</p>
                                      </div>
                                      <img :src="spot" alt="" class="attributesTips">
                                    </el-tooltip>
                                  </div>
                                </template>
                              </el-table-column>
                              <el-table-column align="center" prop="commodityName" label="商品名称"></el-table-column>
                              <el-table-column align="center" prop="category_name" label="品类"></el-table-column>
                              <el-table-column align="center" prop="commodityPrice" label="价格"></el-table-column>
                              <el-table-column align="center" prop="activityPrice" label="活动价" min-width="120" v-if="childShowActivityPrice">
                                <template slot-scope="childScope">
                                  <el-input v-model.trim="childScope.row.activityPrice" placeholder="活动价" :size="tableSize"></el-input>
                                </template>
                              </el-table-column>
                            </el-table>
                            <el-badge class="item" slot="reference">
                              <p class="operaItems">查看商品</p>
                            </el-badge>
                          </el-popover>
                        </div>
                        <img :src="spot" alt="" class="attributesTips">
                      </el-tooltip>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="commodityCode" label="商品编码" width="120" show-overflow-tooltip></el-table-column>
                <el-table-column align="center" prop="commodityName" label="商品名称" min-width="150" show-overflow-tooltip></el-table-column>
<!--                <el-table-column align="center" prop="brand_name" label="品牌" width="110"></el-table-column>-->
                <el-table-column align="center" prop="category_name" label="品类" min-width="120"></el-table-column>
                <el-table-column align="center" prop="classifyName" label="分类" min-width="200" show-overflow-tooltip></el-table-column>
                <!--<el-table-column align="center" prop="category_name" label="系列" width="110"></el-table-column>-->
                <el-table-column align="center" prop="commodityWide" label="宽" width="80" v-if="rulesModel.ruleType == 5"></el-table-column>
                <el-table-column align="center" prop="commodityHigh" label="高" width="80" v-if="rulesModel.ruleType == 5"></el-table-column>
                <el-table-column align="center" prop="commodityLong" label="深" width="80" v-if="rulesModel.ruleType == 5"></el-table-column>
                <el-table-column align="center" prop="commodityThick" label="厚" width="80" v-if="rulesModel.ruleType == 5"></el-table-column>
                <el-table-column align="center" prop="commodityPrice" label="单价" min-width="120" v-if="rulesModel.ruleType == 5"></el-table-column>
                <el-table-column align="center" label="数量" min-width="120" v-if="rulesModel.ruleType == 5">
                  <template slot-scope="scope">
                    <el-input v-model.number="scope.row.dataSize" placeholder="数量" :size="tableSize" @change="changeDataSize(scope.row,scope.$index)"></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="commodityPrice" label="价格" min-width="120" v-if="rulesModel.ruleType != 5"></el-table-column>
                <el-table-column align="center" prop="originalPrice" label="原价" min-width="120" v-if="rulesModel.ruleType == 5"></el-table-column>
                <el-table-column align="center" prop="price" label="规则金额" min-width="120" v-if="rulesModel.ruleType == 2 && rulesModel.ruleTypeDetail === 0">
                  <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.price" placeholder="规则金额" :size="tableSize"></el-input>
                  </template>
                </el-table-column>
                <el-table-column align="center" prop="activityPrice" :label="rulesModel.ruleType == 3 ? '一口价': '活动价'" min-width="120" fixed="right" v-if="showActivityPrice">
                  <template slot-scope="scope">
                    <el-input v-model.trim="scope.row.activityPrice" :placeholder="rulesModel.ruleType == 3 ? '一口价': '活动价'" :size="tableSize"></el-input>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-col>
          <!--显示套餐的计算-->
          <el-col :span="fullSpan" class="packageInfo" v-if="rulesModel.ruleType === 5">
            <el-form-item label="套餐价格">
              <el-col :span="6">
                <span class="priceInfo m-right10">原价：{{ calMealPrice.originalPriceTotal }}</span>
                <span class="priceInfo">现价：{{ calMealPrice.activityPriceTotal }}</span>
              </el-col>
              <el-col :span="6">
                <el-form-item label-width="0" style="display: inline-block;">
                  <el-checkbox v-model="rulesModel.packageExtraDiscount"></el-checkbox>
                </el-form-item>
                <span>超出部分：</span>
                <el-form-item label-width="0" style="display: inline-block; width: 70px;">
                  <el-input v-model="rulesModel.discount"></el-input>
                </el-form-item>
                <span>折</span>
              </el-col>
              <el-col :span="10">
                <el-form-item label="是否整单互斥" prop="isThisListMutex">
                  <el-radio-group v-model="rulesModel.isThisListMutex">
                    <el-radio :label="item.code" v-for="item in radioList" :key="item.code">{{item.value}}</el-radio>
                  </el-radio-group>
                </el-form-item>
              </el-col>
            </el-form-item>
          </el-col>
          <el-col :span="fullSpan">
            <el-form-item label="参与活动品牌" prop="brandId">
              <el-checkbox-group v-model="rulesModel.brandId">
                <el-col :span="4" v-for="item in selectedInfo.brandList" :key="item.brandId">
                  <el-checkbox :label="item.brandId" :key="item.brandId" name="brands">{{ item.brandName }}</el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="fullSpan">
            <el-form-item label="参与品类" prop="categoryId">
              <el-checkbox-group v-model="rulesModel.categoryId">
                <el-col :span="4" v-for="item in selectedInfo.categoryList" :key="item.commodityCategoryId">
                  <el-checkbox :label="item.commodityCategoryId" name="categories">{{ item.categoryName }}</el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="fullSpan">
            <el-form-item label="备注">
              <el-input v-model="rulesModel.remarks" type="textarea" placeholder="请输入备注"></el-input>
            </el-form-item>
          </el-col>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer" v-if="!isView">
        <el-button type="primary" @click="submitRules('rulesModel')">保 存</el-button>
        <el-button @click="rulesDialogVisibleAdd = false">取 消</el-button>
      </div>
    </el-dialog>
    <!-- 商品列表-->
    <el-dialog title="商品列表" :visible.sync="productDialog" width="90%" custom-class="customDialogTitle" :close-on-click-modal="false" top="2vh">
      <select-commodity v-if="productDialog" @selectionChange="selectionChange" ref="selectedCommodities" :select-list="selectList"></select-commodity>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectProduct">确 定</el-button>
        <el-button @click="productDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import selectCommodity from '@/views/components/selectCommodity';
  import spot from '@/assets/images/spot.png';
  import { sum } from 'src/utils/pubilcFn';
  import { listActivityRule, addActivityRule, getActivityRuleDetails, delActivityRule } from 'src/api/administrationCenter/sysParamsSetting/activityMaintain';
  const rulesTypeList = [
    {
      ruleType: 0,
      ruleName: '满减'
    },
    {
      ruleType: 1,
      ruleName: '折扣'
    },
    {
      ruleType: 2,
      ruleName: '加价购'
    },
    {
      ruleType: 3,
      ruleName: '一口价'
    },
    {
      ruleType: 4,
      ruleName: '赠礼品'
    },
    {
      ruleType: 5,
      ruleName: '套餐'
    },
    {
      ruleType: 6,
      ruleName: '品牌联动'
    }
  ];
  export default {
    name: 'ruleType',
    components: {
      selectCommodity
    },
    data() {
      return {
        isView: false,
        tableLoading: true,
        loading: false,
        defaultNum: 1,
        activityId: '',
        activityRuleId: '',
        span: 12,
        dialogSpan: 11,
        fullSpan: 24,
        querySpan: 3,
        spot,
        size: 'medium',
        btnSize: 'small',
        tableSize: 'small',
        formLabelWidth: '170px',
        formLabelWidthDialog: '140px',
        canPublish: false, // 是否可以发表，仅控制发布按钮状态
        rulesDialogVisible: false,
        rulesDialogVisibleAdd: false,
        productDialog: false,
        productSelection: [],
        navList: [],
        tabActive: 'basicInfo',
        rulesTypeList,
        actionBtnList: [
          { name: '新增规则', style: 'default', url: '', type: 1 }
        ],
        radioList: [
          { code: 1, value: '是' },
          { code: 0, value: '否' }
        ],
        fullReductionList: [
          { code: 0, value: '满减' },
          { code: 1, value: '每满减' }
        ],
        raisePriceTypeList: [
          { code: 0, value: '按收款金额' },
          { code: 1, value: '按商品' }
        ],
        giftTypeList: [
          { code: 0, value: '满赠' },
          { code: 1, value: '买赠' }
        ],
        activityRuleList: [],
        selectedProductTable: [], // 商品表格
        selectedProductTableChild: [], // 子级table
        ruleTable: [],
        ruleType: '',
        childRuleType: '',
        parentTableIndex: '',
        isAdd: 1, // 1、添加 0、编辑
        rulesTitle: '新增',
        rulesModel: {
          activityRuleId: '',
          ruleType: '',
          brandId: [],
          categoryId: [],
          remarks: '',
          ruleName: '',
          packageExtraDiscount: false,
          discount: 0,
          fullPrice: '',
          reducePrice: '',
          ruleTypeDetail: '',
          ruleContent: '',
          commodityIds: [],
          isThisListMutex: false
        },
        rules: {
          ruleType: [
            { required: true, message: '请选择规则类型', trigger: 'change' }
          ],
          ruleName: [
            { required: true, message: '请输入规则名称', trigger: 'blur' }
          ],
          brandId: [
            { type: 'array', required: true, message: '请选择品牌', trigger: 'change' }
          ],
          categoryId: [
            { type: 'array', required: true, message: '请选择品类', trigger: 'change' }
          ],
          ruleTypeDetail: [
            { required: true, message: '请选择类型', trigger: 'change' }
          ],
          discount: [
            { required: true, message: '请输入折扣', trigger: 'blur' }
          ],
          ruleContent: [
            { required: true, message: '请输入规则说明', trigger: 'blur' }
          ],
          fullPrice: [
            { required: true, message: '请输入金额', trigger: 'blur' }
          ],
          reducePrice: [
            { required: true, message: '请输入金额', trigger: 'blur' }
          ],
          isThisListMutex: [
            { required: true, message: '请选择', trigger: 'change' }
          ]
        },
        selectList: {
          selectedCommodities: [], // 选中的商品id 可不传
          brandList: [], // 品牌数组 可不传（不传默认为全部品牌）
          categoryList: [], // 品类数组 可不传（不传默认为全部品类）
          priceStrategyId: '', // 价格策略 不是必填
          height: '350px', // 设置表格高度 可不传（弹出层最好传下）
          isDialog: true, // 是否为弹出层（不传默认为页面）
          goodsType: '' // 1成品 2 定制品
        }
      }
    },
    created() {
      if (this.selectedInfo.activityId != '' && this.selectedInfo.activityId != null && this.selectedInfo.activityId != undefined) {
        this.activityId = this.selectedInfo.activityId;
        this.getActivityRuleList();
      }
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
      clearSelection(tableName, selectionArray) {
        if (selectionArray.length) {
          this.$refs[tableName].clearSelection();
        }
      },
      // 斑马线
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      // 按钮组函数
      butGroupAction(url, type) {
        if (type === 1) {
          // 新增规则
          this.addRules();
        }
      },
      // 取消 返回上一页
      goBack() {
        this.$router.go(-1);
      },
      // 新增规则-按钮点击
      addRules() {
        this.isView = false;
        this.isAdd = 1;
        this.rulesTitle = '新增';
        this.clearAllForm();
        this.rulesDialogVisibleAdd = true;
      },
      // 优惠类型弹框表格内删除
      handleRemove(index, tableData) {
        tableData.splice(index, 1);
      },
      // 获取优惠规则列表
      getActivityRuleList() {
        this.tableLoading = true;
        const params = {
          activityId: this.activityId
        }
        listActivityRule(params)
          .then(response => {
            this.activityRuleList = response.data;
            this.tableLoading = false;
          })
          .catch(error => {
            this.tableLoading = false;
            console.log('活动-addActivity.vue-listActivityRule:' + error);
          });
      },
      // 切换规则类型 清空验证和表单
      clearForm(args) {
        if (args == 'ruleType') {
          this.rulesModel.ruleTypeDetail = '';
        }
        this.selectedProductTable = [];
        this.ruleTable = [];
        this.clearValidate('rulesModel');
      },
      // 清空表单
      clearAllForm() {
        const newRulesModel = {
          ruleType: '',
          brandId: [],
          categoryId: [],
          remarks: '',
          ruleName: '',
          packageExtraDiscount: false,
          discount: 0,
          fullPrice: '',
          reducePrice: '',
          ruleTypeDetail: '',
          ruleContent: '',
          commodityIds: [],
          isThisListMutex: false
        }
        Object.assign(this.rulesModel, newRulesModel);
        this.resetForm('rulesModel');
        this.ruleTable = [];
        this.selectedProductTable = [];
      },
      // 优惠类型-点击编辑按钮
      handleEditRules(row, isView) {
        this.isView = isView == 1;
        this.rulesTitle = isView == 1 ? '查看' : '编辑';
        this.loading = true;
        this.rulesModel.activityRuleId = row.activityRuleId;
        this.isAdd = 0;
        this.clearAllForm();
        this.rulesDialogVisibleAdd = true;
        const params = {
          activityRuleId: row.activityRuleId,
          ruleType: row.ruleType,
          priceStrategyId: this.selectedInfo.priceStrategyId
        }
        getActivityRuleDetails(params)
          .then(response => {
            this.loading = false;
            const result = response.data;
            this.rulesModel.ruleType = result.ruleType;
            this.rulesModel.ruleTypeDetail = result.ruleTypeDetail;
            this.rulesModel.ruleName = result.ruleName;
            this.rulesModel.ruleContent = result.ruleContent;
            this.rulesModel.remarks = result.remarks;
            this.rulesModel.discount = result.discount;
            result.brandList.forEach(item => {
              this.rulesModel.brandId.push(item.brandId + '');
            })
            result.categoryList.forEach(item => {
              this.rulesModel.categoryId.push(item.commodityCategoryId + '');
            })
            // 表格回显
            if (result.details && result.details.length) {
              result.details.forEach(item => {
                this.selectedProductTable.push({
                  activityPrice: item.activityPrice + '',
                  category_name: item.categoryName,
                  classifyName: item.classifyName,
                  commodityId: item.commodityId,
                  commodityCode: item.commodityCode,
                  commodityHigh: item.commodityHigh,
                  commodityLong: item.commodityLong,
                  commodityModel: item.commodityModel,
                  commodityName: item.commodityName,
                  commodityThick: item.commodityThick,
                  commodityWide: item.commodityWide,
                  dataSize: item.dataSize + '',
                  commodityPrice: item.sourcePrice,
                  originalPrice: item.sourcePrice,
                  price: item.price + ''
                })
              })
            }
            if (result.preferentialType && result.preferentialType.length) {
              if (result.ruleType == 0) {
                if (result.ruleTypeDetail == 0) {
                  // 满减-满减
                  result.preferentialType.forEach(item => {
                    let ruleObj = {
                      reducePrice: item.reducePrice ? item.reducePrice + '' : item.reduceRrice + '',
                      price: item.fullPrice + ''
                    };
                    this.ruleTable.push(ruleObj);
                  })
                } else {
                  // 满减-每满减
                  let newPreferentialType = result.preferentialType[0];
                  this.rulesModel.reducePrice = newPreferentialType.reduceRrice ? newPreferentialType.reduceRrice + '' : 0;
                  this.rulesModel.fullPrice = newPreferentialType.fullPrice ? newPreferentialType.fullPrice + '' : 0;
                }
              } else if (result.ruleType == 4 && result.ruleTypeDetail == 0) {
                // 赠礼品-满赠
                result.preferentialType.forEach(item => {
                  let ruleObj = {
                    price: item.price + ''
                  };
                  if (item.details) {
                    ruleObj.childProductList = [];
                    if (item.details.length) {
                      item.details.forEach(item2 => {
                        ruleObj.childProductList.push({
                          activityPrice: item2.activityPrice + '',
                          category_name: item2.categoryName,
                          classifyName: item2.classifyName,
                          commodityId: item2.commodityId,
                          commodityCode: item2.commodityCode,
                          commodityHigh: item2.commodityHigh,
                          commodityLong: item2.commodityLong,
                          commodityModel: item2.commodityModel,
                          commodityName: item2.commodityName,
                          commodityThick: item2.commodityThick,
                          commodityWide: item2.commodityWide,
                          dataSize: item2.dataSize + '',
                          commodityPrice: item2.sourcePrice,
                          originalPrice: item2.sourcePrice,
                          price: item.price + ''
                        })
                      })
                    }
                  }
                  this.ruleTable.push(ruleObj);
                })
              } else {
                result.preferentialType.forEach(item => {
                  let selectedProductTable = {
                    activityPrice: item.activityPrice + '',
                    category_name: item.categoryName,
                    classifyName: item.classifyName,
                    commodityId: item.commodityId,
                    commodityCode: item.commodityCode,
                    commodityHigh: item.commodityHigh,
                    commodityLong: item.commodityLong,
                    commodityModel: item.commodityModel,
                    commodityName: item.commodityName,
                    commodityThick: item.commodityThick,
                    commodityWide: item.commodityWide,
                    dataSize: item.dataSize + '',
                    commodityPrice: item.sourcePrice,
                    originalPrice: item.sourcePrice,
                    price: item.price + '',
                    childProductList: []
                  };
                  if (item.details) {
                    if (item.details.length) {
                      item.details.forEach(item2 => {
                        selectedProductTable.childProductList.push({
                          activityPrice: item2.activityPrice + '',
                          category_name: item2.categoryName,
                          classifyName: item2.classifyName,
                          commodityId: item2.commodityId,
                          commodityCode: item2.commodityCode,
                          commodityHigh: item2.commodityHigh,
                          commodityLong: item2.commodityLong,
                          commodityModel: item2.commodityModel,
                          commodityName: item2.commodityName,
                          commodityThick: item2.commodityThick,
                          commodityWide: item2.commodityWide,
                          dataSize: item2.dataSize + '',
                          commodityPrice: item2.sourcePrice,
                          originalPrice: item2.sourcePrice,
                          price: item.price + ''
                        })
                      })
                    }
                  }
                  this.selectedProductTable.push(selectedProductTable);
                })
              }
            }
            // 单独设置套餐
            if (result.ruleType === 5) {
              this.rulesModel.isThisListMutex = result.preferentialType.isThisListMutex == 1;
              if (result.preferentialType.excessDiscount) {
                this.rulesModel.discount = result.preferentialType.excessDiscount;
                this.rulesModel.packageExtraDiscount = true;
              } else {
                this.rulesModel.discount = 0;
                this.rulesModel.packageExtraDiscount = false;
              }
              result.preferentialType.details.forEach(item => {
                this.selectedProductTable.push({
                  activityPrice: item.activityPrice + '',
                  category_name: item.categoryName,
                  classifyName: item.classifyName,
                  commodityCode: item.commodityCode,
                  commodityHigh: item.commodityHigh,
                  commodityLong: item.commodityLong,
                  commodityModel: item.commodityModel,
                  commodityName: item.commodityName,
                  commodityThick: item.commodityThick,
                  commodityWide: item.commodityWide,
                  dataSize: item.dataSize + '',
                  originalPrice: item.sourcePrice
                })
              })
            }
          })
          .catch(error => {
            this.loading = false;
            console.log('administratiocenter/sysParamsSetting/activityMaintain/components/ruleType.vue:handleEditRules' + error)
          })
      },
      // 优惠类型-点击删除按钮
      handleDeleteRules(row) {
        this.$confirm('确定删除该优惠类型?', '提示', {
          type: 'warning'
        }).then(() => {
          const params = {
            activityRuleId: row.activityRuleId
          }
          delActivityRule(params)
            .then(response => {
              this.$message.success('删除成功');
              this.getActivityRuleList();
            })
            .catch(error => {
              console.log('administratiocenter/sysParamsSetting/addActivity.vue-删除优惠类型-handleDeleteRules:' + error)
            })
        }).catch(() => {});
      },
      // 选择商品-点击复选框
      selectionChange(val) {
        this.productSelection = val;
      },
      // 商品列表弹出层-确定
      selectProduct() {
        const selectedProduct = this.productSelection;
        if (!selectedProduct.length) return;
        if (this.rulesModel.ruleType === 4 && this.rulesModel.ruleTypeDetail === 0) {
          // 赠礼品-满赠 是直接在规则里添加商品
          selectedProduct.forEach(item => {
            this.ruleTable[this.parentTableIndex].childProductList.push(item);
          })
        } else if (this.rulesModel.ruleType === 5) {
          selectedProduct.forEach((item, index) => {
            this.selectedProductTable.push(item);
          })
          this.selectedProductTable.forEach((item, index) => {
            if (!item.dataSize) {
              this.$set(this.selectedProductTable[index], 'dataSize', 1);
              const originalPrice = sum(item.valuation_method_value, item.commodityWide, item.commodityHigh, item.commodityLong, this.selectedProductTable[index].dataSize, item.commodityPrice, 1);
              this.$set(this.selectedProductTable[index], 'originalPrice', originalPrice);
            }
          })
        } else {
          selectedProduct.forEach(item => {
            item.childProductList = [];
            if (this.parentTableIndex != null && this.parentTableIndex != undefined) {
              this.selectedProductTable[this.parentTableIndex].childProductList.push(item);
            } else {
              this.selectedProductTable.push(item);
            }
          })
        }
        this.productDialog = false;
      },
      // 添加规则
      handleAddRules() {
        // ruleType： 0 满减 4 赠礼品
        const params = {
          fullPrice: '',
          reducePrice: '',
          childProductList: []
        }
        this.ruleTable.push(params);
      },
      // 优惠类型弹框点击添加商品和添加规则
      handleAddProducts(parentTableIndex, isChild) {
        this.selectList.priceStrategyId = this.selectedInfo.priceStrategyId;
        this.selectList.brandList = this.selectedInfo.brandList;
        this.selectList.categoryList = this.selectedInfo.categoryList;
        this.selectList.selectedCommodities = [];
        this.parentTableIndex = parentTableIndex;
        if (isChild) {
          this.selectList.selectedCommodities = this.getChildCommodityIds;
        } else {
          this.selectList.selectedCommodities = this.getCommodityIds;
        }
        this.productDialog = true;
      },
      // 套餐修改数量，计算价钱
      changeDataSize(row, index) {
        row.originalPrice = sum(row.valuation_method_value, row.commodityWide, row.commodityHigh, row.commodityLong, row.dataSize, row.commodityPrice, 1);
        Object.assign(this.selectedProductTable[index], row);
      },
      // 添加编辑优惠类型提交
      submitRules(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const fullPrices = [];
            const reducePrices = [];
            let discount = 0;
            const details = [];
            let tableData = [];
            if (this.rulesModel.ruleType == 0) {
              // 满减-满减
              if (this.rulesModel.ruleTypeDetail == 0) {
                this.ruleTable.forEach(item => {
                  fullPrices.push(item.price);
                  reducePrices.push(item.reducePrice);
                })
              }
            }
            // 套餐设置价格
            if (this.rulesModel.ruleType == 5) {
              discount = this.rulesModel.packageExtraDiscount ? Number(this.rulesModel.discount) : 0;
            } else {
              discount = Number(this.rulesModel.discount);
            }
            if (this.rulesModel.ruleType == 4 && this.rulesModel.ruleTypeDetail === 0) {
              tableData = this.ruleTable;
            } else {
              tableData = this.selectedProductTable;
            }
            tableData.forEach(item => {
              const commodityObj = {
                commodityId: item.commodityId,
                dataSize: item.dataSize,
                sourcePrice: this.rulesModel.ruleType == 5 ? item.originalPrice : item.commodityPrice,
                activityPrice: item.activityPrice ? Number(item.activityPrice) : 0,
                price: item.price ? Number(item.price) : 0,
                preferential: []
              }
              if (item.childProductList && item.childProductList.length) {
                item.childProductList.forEach(item => {
                  commodityObj.preferential.push({
                    commodityId: item.commodityId,
                    sourcePrice: item.commodityPrice,
                    activityPrice: item.activityPrice ? Number(item.activityPrice) : 0
                  })
                })
              }
              details.push(commodityObj);
            })
            const params = {
              ...this.rulesModel,
              activityId: Number(this.activityId),
              brandId: this.rulesModel.brandId.map(Number),
              categoryId: this.rulesModel.categoryId.map(Number),
              commodityIds: this.getCommodityIds,
              isThisListMutex: this.rulesModel.isThisListMutex ? 1 : 0,
              reducePrice: Number(this.rulesModel.reducePrice),
              fullPrice: Number(this.rulesModel.fullPrice),
              fullPrices: fullPrices.map(Number),
              reducePrices: reducePrices.map(Number),
              discount,
              details
            }
            if (this.isAdd) {
              delete params.activityRuleId;
            }
            addActivityRule(params)
              .then(response => {
                this.$message.success('操作成功');
                this.rulesDialogVisibleAdd = false;
                this.getActivityRuleList();
              })
              .catch(error => {
                console.log('administratiocenter/sysParamsSetting/addActivity.vue-添加编辑优惠类型-submitRules:' + error)
              })
          } else {
            return false;
          }
        });
      }
    },
    computed: {
      ...mapGetters([
        'selectedInfo'
      ]),
      // 显示添加规则按钮
      showAddRuleBtn() {
        const params = this.rulesModel;
        return (params.ruleType === 0 && params.ruleTypeDetail === 0) || (params.ruleType === 4 && params.ruleTypeDetail === 0)
      },
      // 显示添加商品按钮
      showAddProduct() {
        const params = this.rulesModel;
        return params.ruleType === 4 && params.ruleTypeDetail === 0;
      },
      // 显示参加规则商品范围
      showRangeSelect() {
        let flag = false;
        let tableFlag = false;
        const params = this.rulesModel;
        if (params.ruleType === 0 || params.ruleType === 2 || params.ruleType === 4) {
          // 满减、加价购、赠礼品
          flag = params.ruleTypeDetail !== '';
          if (params.ruleType === 4) {
            tableFlag = params.ruleTypeDetail === 1;
          } else {
            tableFlag = params.ruleTypeDetail !== '';
          }
        } else if (params.ruleType == 6) {
          flag = false;
          tableFlag = false;
        } else {
          flag = params.ruleType !== '';
          tableFlag = params.ruleType !== '';
        }
        return {
          flag,
          tableFlag
        };
      },
      // 显示活动价字段
      showActivityPrice() {
        // 套餐、一口价、加价购（按收款金额）
        const params = this.rulesModel;
        return params.ruleType === 5 || params.ruleType === 3 || (params.ruleType === 2 && params.ruleTypeDetail == 0)
      },
      // 表格内操作是否显示添加商品和查看商品
      showAddChildBtn() {
        const params = this.rulesModel;
        return (params.ruleType === 2 && params.ruleTypeDetail === 1) || params.ruleType === 4;
      },
      // 获取商品列表中所有的商品id
      getCommodityIds() {
        const ids = [];
        this.selectedProductTable.forEach(item => {
          ids.push(item.commodityId);
        })
        return ids;
      },
      // 获取商品列表中所有的商品id
      getChildCommodityIds() {
        const ids = [];
        const params = this.rulesModel;
        let tableType = 'selectedProductTable';
        if (params.ruleType === 4 && params.ruleTypeDetail === 0) {
          tableType = 'ruleTable';
        } else {
          tableType = 'selectedProductTable';
        }
        if (this[tableType][this.parentTableIndex].childProductList && this[tableType][this.parentTableIndex].childProductList.length) {
          this[tableType][this.parentTableIndex].childProductList.forEach(item => {
            ids.push(item.commodityId);
          })
        }
        return ids;
      },
      // 计算套餐价格
      calMealPrice() {
        let originalPriceTotal = 0;
        let activityPriceTotal = 0;
        this.selectedProductTable.forEach(item => {
          originalPriceTotal += item.originalPrice;
          const activityPrice = Number(item.activityPrice) || 0;
          activityPriceTotal += activityPrice;
        })
        return {
          originalPriceTotal,
          activityPriceTotal
        }
      },
      // 添加子商品显示活动价字段
      childShowActivityPrice() {
        return this.rulesModel.ruleType === 2;
      }
    }
  }
</script>
