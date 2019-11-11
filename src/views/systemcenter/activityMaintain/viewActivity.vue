<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <el-card>
        <el-collapse v-model="activeNames" class="customCollapse">
            <el-form :status-icon="true" :size="size" label-position="left" class="viewForm" label-width="100px">
              <el-collapse-item title="活动基本信息" name="1" class="textIndent">
                <el-col :span="span">
                  <el-form-item label="活动名称：">
                    {{ activityInfo.activityName }}
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="活动期限：" class="serveDate">
                    {{ activityInfo.startTime | date }} - {{ activityInfo.endTime | date }}
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="活动类型：">
                    {{ activityInfo.activityType == 0 ? '品牌' : '门店' }}
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="公众号展示：">
                    {{ activityInfo.isPublic == 1 ? '是' : '否' }}
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="公众号仅显示图文详情：" label-width="170px">
                    {{ activityInfo.isImageText == 1 ? '是' : '否' }}
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="小程序展示：">
                    {{ activityInfo.isMiniApp == 1 ? '是' : '否' }}
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="小程序仅显示图文详情：" label-width="170px">
                    {{ activityInfo.isImageText == 1 ? '是' : '否' }}
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="分享描述：">
                    {{ activityInfo.sharingDescription }}
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="适用门店：">
                    {{ activityInfo.storeName }}
                  </el-form-item>
                </el-col>
              </el-collapse-item>
              <el-collapse-item title="活动图片" name="2" class="textIndent">
                <el-form-item label="分享缩略图：">
                  <div class="imgList clearfix">
                    <div class="imgItem fl" :style="{ backgroundImage:'url('+ item.accessoryUrl +')' }" v-for="item,index in activityInfo.sharingThumbnails" :key="index"></div>
                  </div>
                </el-form-item>
                <el-form-item label="封面缩略图：">
                  <div class="imgList clearfix">
                    <div class="imgItem fl" :style="{ backgroundImage:'url('+ item.accessoryUrl+ ')' }" v-for="item,index in activityInfo.miniAppCover" :key="index"></div> <!--  :style="{ backgroundImage:'url('+ activityInfo.posterImg +')' }" -->
                  </div>
                </el-form-item>
                <el-form-item label="轮播图：">
                  <div class="imgList clearfix">
                    <div class="imgItem fl" :style="{ backgroundImage:'url('+ item.accessoryUrl +')' }" v-for="item,index in activityInfo.miniAppLoop" :key="index"></div>
                  </div>
                </el-form-item>
                <el-form-item label="图文详情：">
                  <p v-html="activityInfo.imageText"></p>
                </el-form-item>
              </el-collapse-item>
              <el-collapse-item title="优惠类型" name="3">
                <div class="table_list">
                  <el-table border :data="activityInfo.activityRuleList" :row-class-name="tableRowClassName">
                    <el-table-column align="center" type="index"></el-table-column>
                    <el-table-column align="center" label="类型" sortable show-overflow-tooltip width="200">
                      <template slot-scope="scope">
                        <p v-if="scope.row.ruleType == 0">满减</p>
                        <p v-else-if="scope.row.ruleType == 1">折扣</p>
                        <p v-else-if="scope.row.ruleType == 2">加价购</p>
                        <p v-else-if="scope.row.ruleType == 3">一口价</p>
                        <p v-else-if="scope.row.ruleType == 4">赠礼品</p>
                        <p v-else-if="scope.row.ruleType == 5">套餐</p>
                        <p v-else-if="scope.row.ruleType == 6">品牌联动</p>
                        <p v-else>-</p>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="ruleName" label="自定义名称" sortable show-overflow-tooltip>
                      <template slot-scope="scope">
                        <el-button type="text" @click="handleEditRules(scope.row)">{{ scope.row.ruleName }}</el-button>
                      </template>
                    </el-table-column>
  <!--                  <el-table-column align="center" prop="ruleContent"  label="规则内容" sortable show-overflow-tooltip></el-table-column>-->
                    <el-table-column align="center" prop="brandName"  label="使用品牌" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="categoryName"  label="适用品类" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="remarks" label="备注" sortable show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </el-collapse-item>
              <el-collapse-item title="优惠规则互斥信息" name="4">
                <div class="table_list">
                  <el-table border :data="activityInfo.activityRuleList" :row-class-name="tableRowClassName">
                    <el-table-column align="center" type="index"></el-table-column>
                    <el-table-column align="center" prop="ruleType" label="类型" sortable show-overflow-tooltip width="200">
                      <template slot-scope="scope">
                        <p v-if="scope.row.ruleType == 0">满减</p>
                        <p v-else-if="scope.row.ruleType == 1">折扣</p>
                        <p v-else-if="scope.row.ruleType == 2">加价购</p>
                        <p v-else-if="scope.row.ruleType == 3">一口价</p>
                        <p v-else-if="scope.row.ruleType == 4">赠礼品</p>
                        <p v-else-if="scope.row.ruleType == 5">套餐</p>
                        <p v-else-if="scope.row.ruleType == 6">品牌联动</p>
                        <p v-else>-</p>
                      </template>
                    </el-table-column>
                    <el-table-column align="center" prop="ruleName" label="自定义名称" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="mutexName"  label="互斥优惠规则" sortable show-overflow-tooltip></el-table-column>
                    <el-table-column align="center" prop="remarks" label="备注" sortable show-overflow-tooltip></el-table-column>
                  </el-table>
                </div>
              </el-collapse-item>
            </el-form>
        </el-collapse>
      </el-card>
    </div>
    <!--添加优惠类型-->
    <el-dialog title="查看规则" :visible.sync="rulesDialogVisibleAdd" width="80%" custom-class="customDialogTitle" top="5vh" :close-on-click-modal="false">
      <div class="dialogBody" v-loading="loading">
        <el-form :model="rulesModel" ref="rulesModel" :label-width="formLabelWidthDialog" :size="size" class="rulesDialogForm viewForm clearfix" disabled>
          <el-col :span="dialogSpan">
            <el-form-item label="规则类型" prop="ruleType">
              <el-select v-model="rulesModel.ruleType" clearable>
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
                <el-select v-model="rulesModel.ruleTypeDetail" clearable>
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
              <el-form-item label="加价购类型" prop="ruleTypeDetail">
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
                <el-select v-model="rulesModel.ruleTypeDetail" clearable>
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
              <el-button class="button-96" :size="btnSize" v-if="showAddRuleBtn">添加规则</el-button>
              <el-button class="button-96" :size="btnSize" v-if="!showAddProduct">添加商品</el-button>
            </el-form-item>
          </el-col>
          <!--显示表格-->
          <el-col :span="fullSpan">
            <!--规则表格-->
            <div class="table_list form-item-table tableMaxHeightDialog unsortable" v-if="showAddRuleBtn">
              <el-table border :data="ruleTable" :row-class-name="tableRowClassName">
                <el-table-column align="center" label="操作" width="100" v-if="showAddChildBtn">
                  <template slot-scope="scope">
                    <div>
                      <el-tooltip placement="right" visible-arrow>
                        <div slot="content" class="tips tipFon">
                          <el-popover placement="bottom" trigger="click" width="800" v-if="showAddChildBtn">
                            <el-table :data="scope.row.childProductList" border :size="tableSize">
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
            <div class="table_list form-item-table tableMaxHeightDialog unsortable" v-if="showRangeSelect.tableFlag">
              <el-table border :data="selectedProductTable" :row-class-name="tableRowClassName" key="selectedProductTable">
                <el-table-column align="center" label="操作" width="50" v-if="showAddChildBtn">
                  <template slot-scope="scope">
                    <div>
                      <el-tooltip placement="right" visible-arrow>
                        <div slot="content" class="tips tipFon">
                          <el-popover placement="bottom" trigger="click" width="800" v-if="showAddChildBtn">
                            <el-table :data="scope.row.childProductList" border :size="tableSize">
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
                <el-col :span="4" v-for="item in rulesModel.brandList" :key="item.brandId">
                  <el-checkbox :label="item.brandId" :key="item.brandId" name="brands">{{ item.brandName }}</el-checkbox>
                </el-col>
              </el-checkbox-group>
            </el-form-item>
          </el-col>
          <el-col :span="fullSpan">
            <el-form-item label="参与品类" prop="categoryId">
              <el-checkbox-group v-model="rulesModel.categoryId">
                <el-col :span="4" v-for="item in rulesModel.categoryList" :key="item.commodityCategoryId">
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
    </el-dialog>
  </div>
</template>
<script>
  import breadcrumb from '@/views/components/breadcrumb'
  import pagination from '@/views/components/pagination';
  import spot from '@/assets/images/spot.png';
  import { getActivity, getActivityRuleDetails } from 'src/api/administrationCenter/sysParamsSetting/activityMaintain';
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
    components: {
      breadcrumb,
      pagination
    },
    data() {
      return {
        spot,
        navList: [],
        span: 8,
        btnSize: 'small',
        activityRuleId: '',
        dialogSpan: 11,
        fullSpan: 24,
        querySpan: 3,
        size: 'medium',
        tableSize: 'small',
        formLabelWidthDialog: '140px',
        activeNames: ['1', '2', '3', '4'],
        activityRuleList: [],
        activityInfo: {},
        rulesDialogVisibleAdd: false,
        loading: true,
        dialogLoading: false,
        rulesTypeList,
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
          brandList: [],
          categoryList: [],
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
      };
    },
    created() {
      this.getData();
    },
    methods: {
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      goBack() {
        this.$router.go(-1);
      },
      // 获取活动详情
      getData() {
        let params = {
          activityId: this.$route.query.activityId
        }
        getActivity(params)
          .then(response => {
            this.activityInfo = response.data;
          })
          .catch(error => {
            console.log('activity/getActivity:' + error);
          });
      },
      // 优惠类型-点击编辑按钮
      handleEditRules(row) {
        this.loading = true;
        this.rulesModel.activityRuleId = row.activityRuleId;
        this.isAdd = 0;
        this.rulesDialogVisibleAdd = true;
        const params = {
          activityRuleId: row.activityRuleId,
          ruleType: row.ruleType,
          priceStrategyId: this.activityInfo.priceStrategyId
        }
        this.ruleTable = [];
        this.selectedProductTable = [];
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
            this.rulesModel.brandList = result.brandList;
            this.rulesModel.categoryList = result.categoryList;
            result.brandList.forEach(item => {
              this.rulesModel.brandId.push(item.brandId);
            })
            result.categoryList.forEach(item => {
              this.rulesModel.categoryId.push(item.commodityCategoryId);
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
                    price: item.price + ''
                  };
                  if (item.details) {
                    selectedProductTable.childProductList = [];
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
            console.log('administratiocenter/sysParamsSetting/activityMaintain/viewActivity.vue:handleEditRules' + error)
          })
      }
    },
    computed: {
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
  };
</script>


