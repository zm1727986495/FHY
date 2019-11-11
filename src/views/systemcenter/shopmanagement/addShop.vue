<template>
  <div class="wrapper storeForm">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <el-card class="box-card" shadow="always" v-loading="loading">
        <el-form :model="ruleForm" ref="ruleForm" :rules="rules" :label-width="formLabelWidth" :size="size" class="ruleForm">
          <el-collapse v-model="activeNames" class="customCollapse">
            <el-collapse-item title="基本信息" name="1">
              <el-row :gutter="gutter">
                <el-col :span="span">
                  <el-form-item label="门店名称" prop="storeName">
                    <el-input v-model.trim="ruleForm.storeName" clearable placeholder="请输入门店名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="对应组织结构" prop="organizationName">
                    <el-input v-model="ruleForm.organizationName" placeholder="请选择组织结构" readonly clearable @focus="selectOrganization"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="内部名称">
                    <el-input v-model.trim="ruleForm.internalName" clearable placeholder="请输入内部名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="简称" prop="abbreviate">
                    <el-input v-model.trim="ruleForm.abbreviate" clearable placeholder="请输入简称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="fullSpan">
                  <el-form-item label="门店地址">
                    <div class="clearfix">
                      <div class="fl addressLeft">
                        <el-col :span="areaSpan">
                          <el-form-item>
                            <el-select v-model="ruleForm.provinceId" @change="provinceChange" placeholder="省" >
                              <el-option v-for="item in provinceList" :key="item.provinceid" :value="item.provinceid" :label="item.province"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="areaSpan">
                          <el-form-item>
                            <el-select v-model="ruleForm.cityId" @change="cityChange" placeholder="市">
                              <el-option v-for="item in cityList" :key="item.city" :value="item.cityid" :label="item.city"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                        <el-col :span="areaSpan">
                          <el-form-item>
                            <el-select v-model="ruleForm.areaId" placeholder="县">
                              <el-option v-for="item in areaList" :key="item.area" :value="item.areaid" :label="item.area"></el-option>
                            </el-select>
                          </el-form-item>
                        </el-col>
                      </div>
                      <div class="fl addressRight">
                        <el-form-item>
                          <el-input v-model.trim="ruleForm.address" clearable placeholder="请输入详细地址"></el-input>
                        </el-form-item>
                      </div>
                    </div>
                  </el-form-item>
                </el-col>
<!--                <el-col :span="span">-->
<!--                  <el-form-item label="地址类别" prop="addressType">-->
<!--                    <el-select v-model="ruleForm.addressType" placeholder="请选择地址类别" clearable>-->
<!--                      <el-option v-for="item in addressType" :key="item.code" :label="item.value" :value="item.code"></el-option>-->
<!--                    </el-select>-->
<!--                  </el-form-item>-->
<!--                </el-col>-->
                <el-col :span="span">
                  <el-form-item label="联系电话">
                    <el-input v-model.trim="ruleForm.storePhone" clearable placeholder="请输入联系电话"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="对应建材城/百货">
                    <el-select v-model="ruleForm.companyId" filterable placeholder="对应建材城/百货" clearable>
                      <el-option v-for="item in companyList" :label="item.companyName" :value="item.companyId" :key="item.companyId"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="是否可签订合作订单" prop="isSignOrder" label-width="170px">
                    <el-checkbox v-model="ruleForm.isSignOrder">是</el-checkbox>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="所属摊位">
                    <el-row v-for="(booth, index) in ruleForm.booths" :key="index" class="booth-row">
                      <el-col :span="19">
                        <el-form-item>
                          <el-input v-model="booth.boothName" clearable placeholder="请输入摊位"></el-input>
                        </el-form-item>
                      </el-col>
                      <el-col :span="5" class="opeList">
                        <span class="ope plus" @click="addDomain"></span>
                        <span class="ope minus" @click="removeDomain(booth)" v-if="ruleForm.booths.length > 1 && index > 0"></span>
                      </el-col>
                    </el-row>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="其他信息" name="2">
              <el-row :gutter="gutter">
                <el-col :span="span">
                  <el-form-item label="网点类型">
                    <el-select v-model="ruleForm.websiteType" placeholder="请选择网点类型">
                      <el-option v-for="item in websiteTypeList" :label="item.dictName" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="门店级别" prop="websiteLevel">
                    <el-select v-model="ruleForm.websiteLevel" placeholder="请选择门店级别">
                      <el-option v-for="item in websiteLevelList" :label="item.dictName" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="营业状态">
                    <el-select v-model="ruleForm.status" placeholder="请选择营业状态">
                      <el-option v-for="item in statusList" :label="item.dictName" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="营业时间" class="businessTime">
                    <el-time-picker class="timerPicker"
                                    is-range
                                    v-model="ruleForm.businessTime"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    placeholder="选择时间范围"
                                    value-format="HH:mm"
                                    format="HH:mm">
                    </el-time-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="关联品牌" prop="brandName">
                    <el-input v-model="ruleForm.brandName" placeholder="请选择品牌" readonly clearable @focus="selectBrand"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="关联品类" prop="categoryName">
                    <el-input v-model="ruleForm.categoryName" placeholder="请选择品类" readonly clearable @focus="selectCategory"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="开店日期">
                    <el-date-picker
                      v-model="ruleForm.openTime"
                      type="date"
                      value-format="yyyy-MM-dd HH:mm:ss"
                      :picker-options="pickerOptions"
                      placeholder="请选择日期">
                    </el-date-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="货品类型" prop="goodsType">
                    <el-select v-model="ruleForm.goodsType" placeholder="请选择">
                      <el-option v-for="item in goodsTypeList" :key="item.code" :label="item.value" :value="item.code"></el-option>
                    </el-select>
                  </el-form-item>
                </el-col>
<!--                <el-col :span="span">-->
<!--                  <el-form-item label="订单渠道" prop="selectedChannels">-->
<!--                    <el-select v-model="ruleForm.selectedChannels" multiple collapse-tags>-->
<!--                      <el-option v-for="item in channelList" :value="item.id" :key="item.id" :label="item.dictName">-->
<!--                        <span style="float: left">{{ item.dictName }}</span>-->
<!--                        <span style="float: right" v-if="defaultChannel.defaultValue == item.id">默认值</span>-->
<!--                      </el-option>-->
<!--                    </el-select>-->
<!--                  </el-form-item>-->
<!--                </el-col>-->
                <el-col :span="span">
                  <el-form-item label="订单来源" required>
                    <el-col :span="12">
                      <el-form-item prop="storeSourcePid">
                        <el-select v-model="ruleForm.storeSourcePid" @change="storeSourceChange" multiple collapse-tags>
                          <el-option v-for="item in storeSourcePidList" :key="item.storeSourceId" :value="item.storeSourceId" :label="item.sourceName">
                            <span style="float: left">{{ item.sourceName }}</span>
                            <span style="float: right" v-if="defaultSource.defaultValue == item.storeSourceId">默认值</span>
                          </el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                    <el-col :span="12" v-if="storeSourceIdList.length">
                      <el-form-item prop="storeSourceId">
                        <el-select v-model="ruleForm.storeSourceId">
                          <el-option v-for="item in storeSourceIdList" :key="item.storeSourceId" :value="item.storeSourceId" :label="item.sourceName"></el-option>
                        </el-select>
                      </el-form-item>
                    </el-col>
                  </el-form-item>
                </el-col>
              </el-row>
            </el-collapse-item>
            <el-collapse-item title="门店描述" name="3">
              <el-form-item label-width="0">
                <el-input v-model="ruleForm.remark" type="textarea" placeholder="请输入门店描述"></el-input>
              </el-form-item>
            </el-collapse-item>
            <el-collapse-item title="设置微信" name="4">
              <el-row :gutter="gutter">
                <el-col :span="span">
                  <el-form-item label="是否微信显示" prop="isWxName">
                    <el-radio-group v-model="ruleForm.isWxName">
                      <el-radio v-for="item in isWxNameList" :label="item.code" :key="item.code">{{ item.value }}</el-radio>
                    </el-radio-group>
                  </el-form-item>
                </el-col>
                <el-col :span="span">
                  <el-form-item label="微信显示名称" prop="showWxName">
                    <el-input v-model.trim="ruleForm.showWxName" clearable placeholder="请输入微信显示名称"></el-input>
                  </el-form-item>
                </el-col>
                <el-col :span="fullSpan">
                  <el-form-item label="门店LOGO">
                    <el-upload
                      list-type="picture-card"
                      class="avatar-uploader"
                      action="string"
                      :accept="accept"
                      :http-request="uploadLogo"
                      :file-list="fileListLogo"
                      :on-remove="removeLogo"
                      :on-preview="previewImg">
<!--                      <img v-if="ruleForm.accessory[0].fileUrl" :src="ruleForm.logoImgUrl" class="avatar">-->
                      <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
                <el-col :span="fullSpan">
                  <el-form-item label="门店轮播图">
                    <el-upload
                      list-type="picture-card"
                      class="avatar-uploader"
                      action="string"
                      :accept="accept"
                      :http-request="uploadSwiper"
                      :file-list="fileListSwiper"
                      :on-remove="removeSwiper"
                      :on-preview="previewImg">
                      <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                  </el-form-item>
                </el-col>
              </el-row>
              <div class="uploadTip">仅支持JPG、JPEG、BMP、PNG格式，文件小于10M（建议使用镂空白色图像，最佳尺寸126*45px）</div>
            </el-collapse-item>
            <el-collapse-item title="选择人员" name="5" v-if="storeId">
              <div class="m-bottom15">
                <el-button class="button-96" @click="handleAdd" :size="btnSize">新增</el-button>
                <el-button class="button-96" @click="handleDelete(1)" :size="btnSize">删除</el-button>
                <el-button class="button-96" @click="setStoreManager" :size="btnSize">设为店长</el-button>
              </div>
              <div class="table_list">
                <el-table border :data="storeUserVO" @selection-change="memberSelectionChange" :row-class-name="tableRowClassName" :row-key="getRowKeysT" :max-height="maxHeight">
                  <el-table-column align="center" type="selection" width="50" :reserve-selection="true"></el-table-column>
                  <el-table-column align="center" type="index" width="50"></el-table-column>
                  <el-table-column align="center" prop="username" label="人员姓名" sortable>
                    <template slot-scope="scope">
                      <div>
                        <el-tooltip placement="right" visible-arrow >
                          <div slot="content" class="tips tipFon">
                            <p @click="handleDelete(0,scope.row)" class="operaItems">删除</p>
                          </div>
                          <img :src="spot" alt="" class="attributesTips">
                        </el-tooltip>
                        <p class="operation">{{scope.row.name}}</p>
                      </div>
                    </template>
                  </el-table-column>
                  <el-table-column prop="username" label="账户" align="center" show-overflow-tooltip sortable></el-table-column>
                  <el-table-column align="center" prop="mobilePhone" label="联系方式" sortable></el-table-column>
                  <el-table-column align="center" prop="belongToStore" label="所属部门" sortable></el-table-column>
                  <el-table-column align="center" prop="job" label="岗位" sortable></el-table-column>
                  <el-table-column align="center" prop="isLeader" label="是否店长" sortable>
                    <template slot-scope="scope">
                      <span>{{ scope.row.isLeader == 1 ? '是' : '否' }}</span>
                    </template>
                  </el-table-column>
                </el-table>
                <div class="pagination_wrap">
                  <pagination
                    :current-page="currentPage"
                    :pageSize="pageSize"
                    :total="total"
                    @sizeChange="sizeChange"
                    @currentChange="currentChange">
                  </pagination>
                </div>
              </div>
            </el-collapse-item>
          </el-collapse>
        </el-form>
        <div class="center m-top20">
          <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
          <el-button @click="goBack">返 回</el-button>
        </div>
      </el-card>
    </div>
    <!--新增人员-->
    <el-dialog title="新增人员" :visible.sync="dialogFormVisible" width="80%" custom-class="customDialogTitle" top="2vh">
      <el-container v-loading="loading">
        <el-aside width="220px" class="m-right10">
          <el-input v-model="filterText" placeholder="组织名称" :size="size"></el-input>
          <div style="max-height: 400px; overflow-y: auto" class="m-top10">
            <el-tree style="font-size: 14px;"
                     :data="organizationTree"
                     :filter-node-method="filterNode"
                     :default-expand-all="true"
                     :highlight-current="true"
                     :expand-on-click-node="false"
                     ref="organizationTree"
                     node-key="id"
                     @node-click="nodeClick">
            </el-tree>
          </div>
        </el-aside>
        <el-main>
          <div class="queryForm">
            <el-form :inline="true" :model="queryForm" :size="size">
              <el-form-item>
                <el-input v-model.trim="queryForm.names" clearable placeholder="人员编号 姓名 账户"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="warning" class="button-fc" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table_list">
            <el-table ref="userTableDialog" :data="memberListDialog" border @selection-change="dialogMemberSelectionChange" :row-class-name="tableRowClassName" max-height="400" :row-key="getRowKeys">
              <el-table-column type="selection" width="55" align="center" :reserve-selection="true"></el-table-column>
              <el-table-column prop="number" label="人员编号" align="center" sortable show-overflow-tooltip sortable></el-table-column>
              <el-table-column prop="name" label="人员姓名" align="center" show-overflow-tooltip sortable></el-table-column>
              <el-table-column prop="username" label="账户" align="center" show-overflow-tooltip sortable></el-table-column>
              <el-table-column prop="mobilePhone" label="联系方式" align="center" show-overflow-tooltip sortable></el-table-column>
              <el-table-column prop="job" label="岗位" align="center" show-overflow-tooltip sortable></el-table-column>
            </el-table>
            <div class="pagination_wrap">
              <pagination
                :current-page="currentPageD"
                :pageSize="pageSizeD"
                :total="totalD"
                @sizeChange="sizeChangeD"
                @currentChange="currentChangeD">
              </pagination>
            </div>
          </div>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addMemberConfirm">确定</el-button>
        <el-button @click="dialogFormVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--关联品牌弹出层-->
    <el-dialog title="关联品牌" :visible.sync="brandDialogVisible" width="540px" custom-class="customDialogTitle">
      <div class="dialogBody">
        <el-transfer
          filterable
          v-model="brands"
          filter-placeholder="请输入品牌名称"
          :props="{ key: 'brandId',label: 'brandName'}"
          :data="brandList"
          :titles="['品牌列表', '已选品牌']">
        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectBrandConfirm">确 定</el-button>
        <el-button @click="brandDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--关联品类弹出层-->
    <el-dialog title="关联品类" :visible.sync="categoryDialogVisible" width="540px" custom-class="customDialogTitle">
      <div class="dialogBody">
        <el-transfer
          filterable
          v-model="category"
          filter-placeholder="请输入品类名称"
          :props="{ key: 'commodityCategoryId',label: 'categoryName'}"
          :data="categoryList"
          :titles="['品类列表', '已选品类']">
        </el-transfer>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="selectCategoryConfirm">确 定</el-button>
        <el-button @click="categoryDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>
    <!--组织机构弹出层-->
    <organizationdia
      :visible="organizationDialogVisible"
      v-if="organizationDialogVisible"
      :defaultOpenArr="defaultOpenArr"
      @close_org="closetree"
    ></organizationdia>
    <!--图片预览-->
    <el-dialog :visible.sync="dialogVisible">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import breadcrumb from '@/views/components/breadcrumb';
  import pagination from '@/views/components/pagination';
  import organizationdia from '@/views/systemcenter/department/components/organizationdia';
  import { mapGetters } from 'vuex';
  import { getStore, listUserInfo, insertStore, updateStore, listStoreUserInfo, insertStoreUser, deleteStoreUser, updateStoreUser, listStoreSource } from '@/api/systemcenter/storemanagement';
  import { listProvince, listCity, listAreas, listCategory, listCompanyByAll, listOrganization, listBrand, listBaseDict, listParentOrganizedId, getUUID } from 'api/pulicJava';
  import { removeAccessoryImg } from '@/api/order/recommender/recommender';
  import { put } from "@/utils/pubilcFn";
  import spot from '@/assets/images/spot.png';
  export default {
    components: {
      breadcrumb,
      pagination,
      organizationdia
    },
    data() {
      const checkWxName = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入微信显示名称'));
        }
      };
      const checkLogo = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请上传门店LOGO'));
        }
      };
      const checkSwiperImg = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请上传门店轮播图'));
        }
      };
      return {
        spot,
        span: 12,
        areaSpan: 8,
        fullSpan: 24,
        gutter: 10,
        loading: false,
        accept: 'image/jpeg,image/jpg,image/gif,image/png,image/bmp',
        activeNames: ['1', '2', '3', '4', '5'],
        timerOptions: {
          step: '00:30'
        },
        companyList: [],
        organizationTree: [],
        organizationId: '',
        organizationName: '',
        addressType: [
          { code: 1, value: '建材城' },
          { code: 2, value: '百货' }
        ],
        websiteTypeList: [
          { code: 1, value: '家装店' },
          { code: 2, value: '综合店' }
        ],
        websiteLevelList: [
          { code: 1, value: '1级门店' },
          { code: 2, value: '2级门店' },
          { code: 3, value: '3级门店' },
          { code: 4, value: '4级门店' }
        ],
        statusList: [
          { code: 1, value: '营业中' },
          { code: 2, value: '停止营业' },
          { code: 3, value: '筹备中' }
        ],
        isWxNameList: [
          { code: 0, value: '否' },
          { code: 1, value: '是' }
        ],
        goodsTypeList: [
          { code: 1, value: '成品' },
          { code: 2, value: '定制品' }
        ],
        storeSourcePidList: [],
        storeSourceIdList: [],
        channelList: [],
        brands: [],
        category: [],
        brandList: '',
        categoryList: [],
        navList: [],
        formLabelWidth: '130px',
        storeId: this.$route.query.storeId,
        memberListDialog: [],
        currentPage: 1,
        currentPageD: 1,
        pageSize: 20,
        pageSizeD: 20,
        total: 0,
        totalD: 0,
        memberSelection: [],
        memberSelectionDialog: [],
        dialogFormVisible: false,
        organizationDialogVisible: false,
        brandDialogVisible: false,
        categoryDialogVisible: false,
        storeDialogVisible: false,
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 24 * 1000;
          }
        },
        filterText: '',
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        provinceList: [],
        cityList: [],
        areaList: [],
        areaData: [],
        propsArea: {
          label: 'areaName',
          value: 'areaId',
          children: 'cities'
        },
        queryForm: {
          names: '',
          organizationId: ''
        },
        storeUserVO: [],
        ruleForm: {
          provinceId: '',
          cityId: '',
          areaId: '',
          longitude: '',
          latitude: '',
          storeName: '',
          internalName: '',
          abbreviate: '',
          address: '',
          addressType: '',
          organizationName: '',
          organizationId: '',
          storePhone: '',
          companyName: '',
          companyId: '',
          websiteType: '',
          websiteLevel: '',
          brandName: '',
          categoryName: '',
          area: [],
          status: '',
          businessTime: '',
          booths: [{
            boothName: ''
          }],
          openTime: '',
          isWxName: 0,
          showWxName: '',
          isSignOrder: false,
          remark: '',
          goodsType: '',
          selectedChannels: [],
          storeSourcePid: [],
          storeSourceId: '',
          storeNumber: ''
        },
        defaultOpenArr: [], // 组织机构回显
        rules: {
          storeName: [
            { required: true, message: '请输入门店名称', trigger: 'blur' }
          ],
          organizationName: [
            { required: true, message: '请选择组织结构', trigger: 'change' }
          ],
          internalName: [
            { required: true, message: '请输入内部名称', trigger: 'blur' }
          ],
          abbreviate: [
            { required: true, message: '请输入简称', trigger: 'blur' }
          ],
          addressType: [
            { required: true, message: '请选择地址类别', trigger: 'change' }
          ],
          storePhone: [
            { required: true, message: '请输入联系电话', trigger: 'blur' }
          ],
          companyId: [
            { required: true, message: '请选择建材城/百货', trigger: 'change' }
          ],
          websiteType: [
            { required: true, message: '请选择网点类型', trigger: 'change' }
          ],
          websiteLevel: [
            { required: true, message: '请选择门店级别', trigger: 'change' }
          ],
          status: [
            { required: true, message: '请选择营业状态', trigger: 'change' }
          ],
          businessTime: [
            { required: true, message: '请选择营业时间', trigger: 'change' }
          ],
          categoryId: [
            { required: true, message: '请选择关联品类', trigger: 'change' }
          ],
          openTime: [
            { required: true, message: '请选择开店日期', trigger: 'change' }
          ],
          area: [
            { required: true, message: '请选择省市县', trigger: 'change' }
          ],
          address: [
            { required: true, message: '请输入详细地址', trigger: 'blur' }
          ],
          brandName: [
            { required: true, message: '请选择关联品牌', trigger: 'change' }
          ],
          categoryName: [
            { required: true, message: '请选择关联品类', trigger: 'change' }
          ],
          provinceId: [
            { required: true, message: '请选择省', trigger: 'change' }
          ],
          cityId: [
            { required: true, message: '请选择市', trigger: 'change' }
          ],
          areaId: [
            { required: true, message: '请选择县', trigger: 'change' }
          ],
          goodsType: [
            { required: true, message: '请选择货品类型', trigger: 'change' }
          ],
          selectedChannels: [
            { required: true, message: '请选择订单渠道', trigger: 'change' }
          ],
          storeSourcePid: [
            { required: true, message: '请选择订单来源', trigger: 'change' }
          ],
          storeSourceId: [
            { required: true, message: '请选择', trigger: 'change' }
          ]
        },
        newForm: {},
        dialogImageUrl: '',
        dialogVisible: false,
        fileListLogo: [],
        fileListSwiper: [],
        logoArr: [],
        swiperArr: [],
        delImgArr: []
      };
    },
    created() {
      this.getOrganization();
      this.getListCompanyByAll();
      this.getCategoryList();
      this.getBrandList();
      this.getProvince();
      this.getBaseDict('STORE_LEVEL');
      this.getBaseDict('STORE_TYPE');
      this.getBaseDict('WORK_STATUS');
      // this.getBaseDict('ORDER_CHANNEL');
      if (this.storeId) {
        this.getStoreInfo();
        this.getStoreUserInfo();
      } else {
        this.getUUID();
      }
      this.getStoreSourceList(0);
    },
    mounted() {
      this.navList = this.$route.meta;
    },
    methods: {
      currentChange(val) {
        this.currentPage = val;
        this.getStoreUserInfo();
      },
      sizeChange(val) {
        this.currentPage = 1;
        this.pageSize = val;
        this.getStoreUserInfo();
      },
      currentChangeD(val) {
        this.currentPageD = val;
        this.getUserInfoList();
      },
      sizeChangeD(val) {
        this.currentPageD = 1;
        this.pageSizeD = val;
        this.getUserInfoList();
      },
      tableRowClassName({ row, rowIndex }) {
        return rowIndex % 2 != 0 ? 'el-f0' : '';
      },
      getRowKeys(row) {
        return row.userId;
      },
      getRowKeysT(row) {
        return row.storeUserId;
      },
      // 获取门店编号
      getUUID() {
        let uuidParams = {
          serialNumber: 'S'
        }
        getUUID(uuidParams)
          .then(response => {
            this.ruleForm.storeNumber = response.data;
          })
          .catch(error => {
            console.log('views/systemcenter/shopmanagement/addshop.vue-getUUID:' + error);
          })
      },
      // 获取字典
      getBaseDict(dataType) {
        let params = {
          dataType: dataType
        }
        listBaseDict(params)
          .then(response => {
            if (dataType === 'STORE_LEVEL') {
              this.websiteLevelList = response.data;
            }
            if (dataType === 'STORE_TYPE') {
              this.websiteTypeList = response.data;
            }
            if (dataType === 'WORK_STATUS') {
              this.statusList = response.data;
            }
            if (dataType == 'ORDER_CHANNEL') {
              this.channelList = response.data;
            }
          })
          .catch(error => {
            console.log('选择商品组件：getBaseDict' + error)
          })
      },
      // 组织机构获取当前节点所有父节点
      getOrganizationParentList(organizedId) {
        let params = {
          organizedId
        }
        listParentOrganizedId(params)
          .then(response => {
            this.defaultOpenArr = response.data.split(',').map(Number).reverse();
          })
          .catch(error => {
            console.log('addShop-公共接口获取当前组织机构所有父节点')
          })
      },
      // 获取省份
      getProvince() {
        listProvince().then(res => {
          this.provinceList = res.data;
        }).catch(error => {
          console.log('添加门店:调取公共方法获取省', error)
        });
      },
      // 获取市
      getCity(id) {
        listCity({ id }).then(res => {
          this.cityList = res.data;
        }).catch(error => {
          console.log('添加门店:调取公共方法获取市', error);
        });
      },
      // 获取县
      getArea(id) {
        listAreas({ id }).then(res => {
          this.areaList = res.data;
        }).catch(error => {
          console.log('添加门店:调取公共方法获取区', error)
        });
      },
      // 获取组织机构
      getOrganization() {
        listOrganization()
          .then(response => {
            const result = response.data;
            this.organizationTree = result;
          })
          .catch(error => {
            console.log('common/listOrganization:' + error);
          });
      },
      // 获取所有的公司
      getListCompanyByAll() {
        listCompanyByAll({ companyType: 0 })
          .then(response => {
            this.companyList = response.data;
          })
          .catch(error => {
            console.log('common/listCompanyByAll:' + error);
          });
      },
      // 获取所有的品类
      getCategoryList() {
        listCategory()
          .then(response => {
            this.categoryList = response.data;
          })
          .catch(error => {
            console.log('common/listCategory:' + error);
          });
      },
      // 获取所有的品牌
      getBrandList() {
        listBrand()
          .then(response => {
            this.brandList = response.data;
          })
          .catch(error => {
            console.log('common/listBrand:' + error);
          });
      },
      removeDomain(item) {
        const index = this.ruleForm.booths.indexOf(item);
        if (index !== -1) {
          this.ruleForm.booths.splice(index, 1)
        }
      },
      addDomain() {
        this.ruleForm.booths.push({
          boothName: ''
        });
      },
      // 取消 返回上一页
      goBack() {
        this.$router.go(-1);
      },
      // 上传成功-logo
      uploadLogo(response) {
        put(response).then(data => {
          data.dataSourceEnum = 'StoreLogoImg';
          data.fileUrl = data.url;
          this.logoArr.push(data);
        });
      },
      // 上传成功-轮播图
      uploadSwiper(response) {
        put(response).then(data => {
          data.dataSourceEnum = 'StoreRotateImg';
          data.fileUrl = data.url;
          this.swiperArr.push(data);
        });
      },
      // 删除logo
      removeLogo(file) {
        this.delImg(file, 'delImgArr', 'logoArr', 'fileListLogo');
      },
      // 删除swiper
      removeSwiper(file) {
        this.delImg(file, 'delImgArr', 'swiperArr', 'fileListSwiper');
      },
      // 预览图片
      previewImg(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 选择组织结构
      selectOrganization() {
        this.organizationDialogVisible = true;
      },
      // 选择组织结构确认
      closetree(obj, arr) {
        if (obj) {
          this.ruleForm.organizationName = obj.label;
          this.ruleForm.organizationId = obj.id;
          this.defaultOpenArr = arr;
        }
        this.organizationDialogVisible = false;
      },
      // 关联品牌聚焦，显示弹出层
      selectBrand() {
        this.brandDialogVisible = true;
      },
      // 穿梭框-选择品牌确认
      selectBrandConfirm() {
        const _this = this;
        const brandNameList = [];
        if (this.brands.length) {
          _this.brandList.forEach(item => {
            _this.brands.forEach(item2 => {
              if (item.brandId == item2) {
                brandNameList.push(item.brandName);
              }
            })
          });
          this.ruleForm.brandName = brandNameList.join(',');
          this.brandDialogVisible = false;
        } else {
          this.$message.error('请选择品牌');
        }
      },
      // 关联品类聚焦，显示弹出层
      selectCategory() {
        this.categoryDialogVisible = true;
      },
      // 穿梭框-选择品类确认
      selectCategoryConfirm() {
        const _this = this;
        const categoryNameList = [];
        if (this.category.length) {
          _this.categoryList.forEach(item => {
            _this.category.forEach(item2 => {
              if (item.commodityCategoryId == item2) {
                categoryNameList.push(item.categoryName);
              }
            })
          });
          this.ruleForm.categoryName = categoryNameList.join(',');
          this.categoryDialogVisible = false;
        } else {
          this.$message.warning('请选择品类');
        }
      },
      // 弹出层检索
      onSubmit() {
        this.currentPageD = 1;
        this.getUserInfoList();
      },
      // 重置查询条件
      resetForm() {
        this.currentPageD = 1;
        this.queryForm = {
          names: '',
          organizationId: ''
        }
        this.getUserInfoList();
      },
      // 获取人员信息-弹出层
      getUserInfoList() {
        this.loading = true;
        const params = {
          names: this.queryForm.names,
          organizationId: this.queryForm.organizationId,
          page: this.currentPageD,
          limit: this.pageSizeD
        }
        listUserInfo(params)
          .then(response => {
            this.loading = false;
            this.memberListDialog = response.data.rows;
            this.totalD = response.data.total;
          })
          .catch(error => {
            this.loading = false;
            console.log('views/systemcenter/shopmanagement/addShop.vue:getUserInfoList' + error);
          });
      },
      // 节点过滤
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      // 点击节点
      nodeClick() {
        const currentNode = this.$refs.organizationTree.getCurrentNode();
        this.queryForm.organizationId = currentNode.id;
        this.currentPageD = 1;
        this.getUserInfoList();
      },
      // 勾选函数回调
      memberSelectionChange(val) {
        this.memberSelection = val;
      },
      // 勾选函数回调（弹出层）
      dialogMemberSelectionChange(val) {
        this.memberSelectionDialog = val;
      },
      // 选择省
      provinceChange(id) {
        this.ruleForm.cityId = '';
        this.ruleForm.areaId = '';
        this.getCity(id);
      },
      // 选择市
      cityChange(id) {
        this.ruleForm.areaId = '';
        this.getArea(id);
      },
      // 获取门店信息
      getStoreInfo() {
        this.loading = true;
        const params = {
          storeId: this.storeId
        }
        getStore(params)
          .then(response => {
            this.loading = false;
            const newForm = response.data;
            if (newForm.startTime && newForm.endTime) {
              newForm.businessTime = [newForm.startTime, newForm.endTime];
            } else if (newForm.startTime) {
              newForm.businessTime = [newForm.startTime, ''];
            } else if (newForm.endTime) {
              newForm.businessTime = ['', newForm.startTime];
            } else {
              newForm.businessTime = [];
            }
            newForm.isSignOrder = newForm.isTogetherOrder == 1;
            let booths = [];
            this.brands = newForm.brandId ? newForm.brandId.split(',') : [];
            this.category = newForm.categoryId ? newForm.categoryId.split(',') : [];
            newForm.provinceId = Number(newForm.provinceId);
            if (newForm.boothNumber && newForm.boothNumber.split(',').length) {
              newForm.boothNumber.split(',').forEach(item => {
                booths.push({
                  boothName: item
                })
              });
            } else {
              booths.push({
                boothName: ''
              });
            }
            if (newForm.accessories.length) {
              newForm.accessories.forEach(item => {
                item.url = item.fileUrl;
              })
              this.fileListLogo = newForm.accessories.filter(item => {
                return item.dataSourceEnum == 'StoreLogoImg';
              })
              this.fileListSwiper = newForm.accessories.filter(item => {
                return item.dataSourceEnum == 'StoreRotateImg';
              })
            }
            Object.assign(this.ruleForm, newForm);
            this.ruleForm.booths = booths;
            if (newForm.organizationId) {
              this.getOrganizationParentList(newForm.organizationId);
            }
            if (newForm.provinceId) {
              this.getCity(newForm.provinceId);
            }
            if (newForm.cityId) {
              this.getArea(newForm.cityId);
            }
            if (newForm.sourceIds && newForm.sourceIds.length) {
              let newIds = [];
              newForm.sourceIds.forEach(item => {
                newIds.push(item.id);
              })
              this.ruleForm.storeSourcePid = newIds;
              this.getStoreSourceList(newForm.sourceIds[0].id);
            } else {
              this.ruleForm.storeSourcePid = [];
            }
          })
          .catch(error => {
            this.loading = false;
            console.log('views/systemcenter/shopmanagement/addshop.vue-getStore:' + error)
          });
      },
      // 提交表单
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.delImgArr.length) {
              this.delImgArr.forEach(item => {
                removeAccessoryImg(item).then(res => {});
              });
            }
            const params = this.ruleForm;
            const boothNumber = [];
            let channels = [];
            let sourceIds = [];
            this.ruleForm.booths.forEach(item => {
              boothNumber.push(item.boothName);
            })
            // this.ruleForm.selectedChannels.forEach((item, index) => {
            //   channels.push({
            //     id: item,
            //     isMain: index === 0 ? 1 : 0
            //   })
            // })
            this.ruleForm.storeSourcePid.forEach((item, index) => {
              sourceIds.push({
                id: item,
                isMain: index === 0 ? 1 : 0
              })
            })
            params.boothNumber = boothNumber;
            params.isTogetherOrder = this.ruleForm.isSignOrder ? 1 : 0;
            params.startTime = this.ruleForm.businessTime[0];
            params.endTime = this.ruleForm.businessTime[1];
            params.brandId = this.brands.map(Number);
            params.categoryId = this.category.map(Number);
            params.storeId = this.storeId ? this.storeId : undefined;
            // params.channels = channels;
            params.sourceIds = sourceIds;
            params.storeSourceId = params.storeSourceId;
            params.accessories = [...this.fileListLogo, ...this.logoArr, ...this.fileListSwiper, ...this.swiperArr];
            delete params.isClose;
            const fn = this.storeId ? updateStore : insertStore;
            fn(params)
              .then(response => {
                if (response.status == 200) {
                  this.$message.success('保存成功');
                  if (this.storeId) {
                    // 编辑
                    this.goBack();
                  } else {
                    // 添加
                    this.storeId = response.data.storeId;
                  }
                } else if (response.status == 500) {
                  this.$message.error('保存失败');
                } else {
                  this.$message.error(response.message || '保存失败');
                }
              })
              .catch(error => {
                console.log('views/systemcenter/shopmanagement/addShop.vue:submitForm' + error);
              });
          } else {
            return false;
          }
        });
      },
      // 点击添加
      handleAdd() {
        this.queryForm = {
          names: '',
          organizationId: ''
        };
        if (this.$refs.userTableDialog !== undefined) {
          this.$refs.userTableDialog.clearSelection();
        }
        this.dialogFormVisible = true;
        this.getUserInfoList();
      },
      // 获取门店人员信息
      getStoreUserInfo() {
        const params = {
          storeId: this.storeId,
          page: this.currentPage,
          limit: this.pageSize
        }
        listStoreUserInfo(params)
          .then(response => {
            const result = response.data;
            this.storeUserVO = result.rows;
            this.total = result.total;
          })
          .catch(error => {
            console.log('store/listStoreUserInfo:' + error)
          });
      },
      // 添加门店人员
      addMemberConfirm() {
        if (!this.memberSelectionDialog.length) {
          this.$message.warning('请选择人员');
          return;
        }
        const userIdList = [];
        this.memberSelectionDialog.forEach(item => {
          userIdList.push(item.userId);
        });
        const params = {
          storeId: this.storeId,
          userIds: userIdList
        }
        insertStoreUser(params)
          .then(response => {
            this.$message.success('添加成功');
            this.dialogFormVisible = false;
            this.getStoreUserInfo();
          })
          .catch(error => {
            console.log('store/insertStoreUser:' + error)
          });
      },
      // 删除人员
      handleDelete(deleteType, row) {
        const userIdList = [];
        // deleteType 1 按钮点击 0，表格内点击
        if (deleteType) {
          if (!this.memberSelection.length) {
            this.$message.warning('请选择人员');
            return;
          }
          this.memberSelection.forEach(item => {
            userIdList.push(Number(item.storeUserId));
          });
        } else {
          userIdList.push(Number(row.storeUserId));
        }
        this.$confirm('确定删除?', '提示', {
          type: 'warning'
        }).then(() => {
          deleteStoreUser({ storeUserIds: userIdList })
            .then(response => {
              this.$message.success('删除成功');
              this.getStoreUserInfo();
            })
            .catch(error => {
              console.log('company/deleteStoreUser:' + error);
            })
        }).catch(() => {});
      },
      // 设为店长
      setStoreManager() {
        if (!this.memberSelection.length) {
          this.$message.warning('请选择人员');
          return;
        }
        if (this.memberSelection.length > 1) {
          this.$message.warning('只能选择一个人');
          return;
        }
        let params = {
          storeUserId: Number(this.memberSelection[0].storeUserId)
        }
        updateStoreUser(params)
          .then(response => {
            this.$message.success('设置成功');
            this.getStoreUserInfo();
          })
          .catch(error => {
            console.log('company/updateStoreUser:' + error);
          })
      },
      // 订单来源
      getStoreSourceList(pid) {
        let params = {
          pid
        };
        listStoreSource(params)
          .then(response => {
            if (pid === 0) {
              this.storeSourcePidList = response.data.rows;
            } else {
              this.storeSourceIdList = response.data.rows;
            }
          })
          .catch(error => {
            console.log('views/systemcenter/shopmanagement/addShop.vue:getStoreSourceList' + error);
          })
      },
      // 订单来源切换显示二级(显示第一默认值的二级)
      storeSourceChange() {
        this.ruleForm.storeSourceId = '';
        this.getStoreSourceList(this.defaultSource.defaultValue);
      },
      // 删除图片
      delImg(file, delImgArr, newImgArr, oldImgArr) {
        if (file.dataSourceId) {
          let delobj = {
            accessoryId: file.accessoryId,
            dataSourceId: file.dataSourceId,
            dataSourceEnum: file.dataSourceEnum
          };
          this[delImgArr].push(delobj);
          this[oldImgArr] = this[oldImgArr].filter(item => {
            return file.accessoryId !== item.accessoryId;
          });
        } else {
          let lengs = String(file.raw.uid).length;
          this[newImgArr] = this[newImgArr].filter(item => {
            let str = item.name.substring(0, lengs);
            return str !== String(file.raw.uid) && !item.dataSourceId;
          });
        }
      }
    },
    computed: {
      // 获取默认渠道
      // defaultChannel() {
      //   let arr = this.ruleForm.selectedChannels;
      //   if (arr.length) {
      //     arr = arr.sort((a, b) => a - b);
      //   }
      //   let defaultValue = arr.length ? arr[0] : '';
      //   return {
      //     defaultValue,
      //     arr
      //   };
      // },
      // 获取默认订单来源
      defaultSource() {
        // if (arr.length) {
        //   arr = arr.sort((a, b) => a - b);
        // }
        let defaultValue = '';
        if (this.ruleForm.storeSourcePid && this.ruleForm.storeSourcePid.length) {
          defaultValue = this.ruleForm.storeSourcePid[0];
        } else {
          defaultValue = '';
        }
        return {
          defaultValue,
          arr: this.ruleForm.storeSourcePid
        };
      },
      ...mapGetters([
        'maxHeight',
        'size',
        'btnSize'
      ])
    }
  };
</script>
<style scoped>
  .el-main{
    padding: 0 10px;
  }
  .booth-row{
    margin-bottom: 16px;
  }
  .booth-row:last-child{
    margin-bottom: 0;
  }
  .opeList{
    padding-left: 10px;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }
  .addressLeft{
    width: calc(50% - 65px);
  }
  .addressRight{
    width: calc(50% + 65px);
  }
</style>



