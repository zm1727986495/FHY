<template>
  <div class="basicInfo" v-loading="loading">
    <el-form :model="basicModel" :rules="rules" ref="basicModel" :label-width="formLabelWidth" class="ruleForm clearfix">
      <el-col :span="span">
        <el-form-item label="活动名称" prop="activityName">
          <el-input v-model="basicModel.activityName" clearable placeholder="请输入活动名称" :size="size"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="活动类型" prop="activityType">
          <el-select v-model="basicModel.activityType" placeholder="请选择活动类型" :size="size">
            <el-option v-for="item in activityTypeList" :label="item.value" :value="item.code"
                       :key="item.code"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="活动开始日期" prop="startTime">
          <el-date-picker
            :size="size"
            v-model="basicModel.startTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="活动开始日期">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="活动结束日期" prop="endTime">
          <el-date-picker
            :size="size"
            v-model="basicModel.endTime"
            type="date"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="活动结束日期">
          </el-date-picker>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="分享描述" prop="sharingDescription">
          <el-input v-model="basicModel.sharingDescription" clearable placeholder="请输入分享描述内容" :size="size"></el-input>
        </el-form-item>
      </el-col>
      <el-col class="block"></el-col>
      <el-col :span="span">
        <el-form-item label="公众号展示" prop="isPublic">
          <el-radio-group v-model="basicModel.isPublic">
            <el-radio :label="item.code" v-for="item in radioList" :key="item.code">{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="公众号仅显示图文详情" prop="isImageText">
          <el-radio-group v-model="basicModel.isImageText">
            <el-radio :label="item.code" v-for="item in radioList" :key="item.code">{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="小程序展示" prop="isMiniApp">
          <el-radio-group v-model="basicModel.isMiniApp">
            <el-radio :label="item.code" v-for="item in radioList" :key="item.code">{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="小程序仅显示图文详情" prop="isMiniImageText">
          <el-radio-group v-model="basicModel.isMiniImageText">
            <el-radio :label="item.code" v-for="item in radioList" :key="item.code">{{item.value}}</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="fullSpan">
        <el-form-item label="分享缩略图">
          <el-upload
            list-type="picture-card"
            class="avatar-uploader"
            action="string"
            :http-request="uploadSuccessShareImg"
            :accept="accept"
            :file-list="sharingThumbnails"
            :on-remove="removeImgShare"
            :limit="coverImgMaxNum"
            :on-preview="previewImg">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="fullSpan">
        <el-form-item label="封面大图">
          <el-upload
            list-type="picture-card"
            class="avatar-uploader"
            action="string"
            :http-request="uploadSuccessCoverImg"
            :accept="accept"
            :file-list="miniAppCover"
            :on-remove="removeImgCover"
            :limit="shareImgMaxNum"
            :on-preview="previewImg">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="fullSpan">
        <el-form-item label="门店轮播图">
          <el-upload
            list-type="picture-card"
            class="avatar-uploader"
            action="string"
            :http-request="uploadSuccessLoopImg"
            :accept="accept"
            :file-list="miniAppLoop"
            :on-remove="removeImgLoop"
            :limit="loopImgMaxNum"
            :on-preview="previewImg">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
      </el-col>
      <el-col :span="fullSpan" class="richText">
        <el-form-item label="图文详情">
          <ueditor ref='richText'></ueditor>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="适用范围" prop="storeId">
          <el-select v-model="basicModel.storeId" multiple placeholder="请选择门店" :size="size" filterable>
            <el-option v-for="item in storeList" :key="item.storeId" :label="item.storeName" :value="item.storeId"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="适用品牌" prop="brandId">
          <el-select v-model="basicModel.brandId" multiple placeholder="请选择品牌" :size="size">
            <el-option v-for="item in brandList" :key="item.brandId" :label="item.brandName" :value="item.brandId"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="适用品类" prop="categoryId">
          <el-select v-model="basicModel.categoryId" multiple placeholder="请选择品类" :size="size">
            <el-option v-for="item in categoryList" :key="item.commodityCategoryId" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="span">
        <el-form-item label="价格策略" prop="priceStrategyId">
          <el-select v-model="basicModel.priceStrategyId" placeholder="请选择品类" :size="size">
            <el-option v-for="item in priceStrategyList" :key="item.priceStrategyId" :label="item.priceName" :value="item.priceStrategyId"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-form>
    <!--预览图片-->
    <el-dialog :visible.sync="dialogVisible" class='box'>
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import { mapGetters } from 'vuex';
  import { getFileType, put } from 'src/utils/pubilcFn';
  import { listCategory, listBrand, listStore, addAccessory, removeAccessory, listPriceStrategy, getUUID } from 'api/pulicJava';
  import { addActivity, editActivity, getActivity } from 'src/api/administrationCenter/sysParamsSetting/activityMaintain';
  import ueditor from '@/views/components/ueditor';
  export default {
    name: 'basicInfo',
    components: {
      ueditor
    },
    data() {
      return {
        loading: false,
        navList: [],
        activityId: '',
        shareImgMaxNum: 10,
        loopImgMaxNum: 5,
        coverImgMaxNum: 10,
        accept: 'image/jpeg,image/jpg,image/gif,image/png,image/bmp',
        dialogImageUrl: '',
        dialogVisible: false,
        span: 12,
        fullSpan: 24,
        size: 'medium',
        formLabelWidth: '170px',
        pickerOptions: {
          disabledDate(time) {
            return time.getTime() < Date.now() - 3600 * 24 * 1000;
          }
        },
        storeList: [],
        brandList: [],
        brandList2: [],
        categoryList: [],
        categoryList2: [],
        priceStrategyList: [],
        activityTypeList: [
          { code: 0, value: '品牌' },
          { code: 1, value: '门店' }
        ],
        radioList: [
          { code: 1, value: '是' },
          { code: 0, value: '否' }
        ],
        activityInfo: {},
        sharingThumbnails: [],
        miniAppCover: [],
        miniAppLoop: [],
        sharingThumbnailsNew: [],
        miniAppCoverNew: [],
        miniAppLoopNew: [],
        basicModel: {
          activityName: '',
          activityType: '',
          startTime: '',
          endTime: '',
          sharingDescription: '',
          isPublic: '',
          isMiniApp: '',
          isImageText: '',
          isMiniImageText: '',
          imageText: '',
          storeId: [],
          brandId: [],
          categoryId: [],
          priceStrategyId: '',
          activityCode: ''
        },
        rules: {
          activityName: [
            { required: true, message: '请输入活动名称', trigger: 'blur' }
          ],
          activityType: [
            { required: true, message: '请选择活动类型', trigger: 'change' }
          ],
          startTime: [
            { required: true, message: '请选择活动开始时间', trigger: 'change' }
          ],
          endTime: [
            { required: true, message: '请选择活动结束时间', trigger: 'change' }
          ],
          sharingDescription: [
            { required: true, message: '请输入分享描述内容', trigger: 'blur' }
          ],
          isPublic: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          isImageText: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          isMiniApp: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          isImageTextMiniApp: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          isMiniImageText: [
            { required: true, message: '请选择', trigger: 'change' }
          ],
          imageText: [
            { required: true, message: '请输入图文详情', trigger: 'change' }
          ],
          storeId: [
            { required: true, message: '请选择适用范围', trigger: 'change' }
          ],
          brandId: [
            { required: true, message: '请选择适用品牌', trigger: 'change' }
          ],
          categoryId: [
            { required: true, message: '请选择适用品类', trigger: 'change' }
          ],
          priceStrategyId: [
            { required: true, message: '请选择价格策略', trigger: 'change' }
          ]
        }
      }
    },
    created() {
      this.getStoreList();
      this.getBrandList();
      this.getCategoryList();
      this.getPriceStrategyList();
      if (this.selectedInfo.activityId != '' && this.selectedInfo.activityId != null && this.selectedInfo.activityId != undefined) {
        this.activityId = this.selectedInfo.activityId;
        setTimeout(() => {
          this.getActivityInfo();
        }, 0)
      } else {
        this.getUUID();
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
      // 获取所有的门店
      getStoreList() {
        listStore()
          .then(response => {
            this.storeList = response.data;
          })
          .catch(error => {
            console.log('common/listStore:' + error)
          })
      },
      // 获取所有的品牌
      getBrandList() {
        listBrand()
          .then(response => {
            this.brandList = response.data;
          })
          .catch(error => {
            console.log('common/listBrand:' + error)
          })
      },
      // 获取所有的品类
      getCategoryList() {
        listCategory()
          .then(response => {
            this.categoryList = response.data;
          })
          .catch(error => {
            console.log('common/listCategory:' + error)
          })
      },
      // 获取价格策略列表
      getPriceStrategyList() {
        listPriceStrategy()
          .then(response => {
            this.priceStrategyList = response.data;
          })
          .catch(error => {
            console.log('administratiocenter/activityMaintain/components/basicInfo.vue-添加修改活动基本信息-getPriceStrategyList', error);
          })
      },
      // 图片上传成功-分享缩略图
      uploadSuccessShareImg(res) {
        put(res).then(data => {
          this.sharingThumbnailsNew.push({
            dataSourceEnum: 'sharingThumbnails',
            fileUrl: data.url,
            fileType: getFileType(data.name),
            isMain: 0,
            sourceName: data.name
          });
        });
      },
      // 图片上传成功-封面大图
      uploadSuccessCoverImg(res) {
        put(res).then(data => {
          this.miniAppCoverNew.push({
            dataSourceEnum: 'miniAppCover',
            fileUrl: data.url,
            fileType: getFileType(data.name),
            isMain: 0,
            sourceName: data.name
          });
        });
      },
      // 图片上传成功-门店轮播图
      uploadSuccessLoopImg(res) {
        put(res).then(data => {
          this.miniAppLoopNew.push({
            dataSourceEnum: 'miniAppLoop',
            fileUrl: data.url,
            fileType: getFileType(data.name),
            isMain: 0,
            sourceName: data.name
          });
        });
      },
      // 图片删除移除-分享缩略图
      removeImgShare(file, fileList) {

      },
      // 图片删除移除-门店轮播图
      removeImgLoop(file, fileList) {

      },
      // 图片删除移除-封面大图
      removeImgCover(file, fileList) {

      },
      // 图片预览
      previewImg(file) {
        this.dialogImageUrl = file.url;
        this.dialogVisible = true;
      },
      // 获取活动编号
      getUUID() {
        let uuidParams = {
          serialNumber: 'A'
        }
        getUUID(uuidParams)
          .then(response => {
            this.basicModel.activityCode = response.data;
          })
          .catch(error => {
            console.log('views/systemcenter/activityMaintain/components/basicInfo.vue-getUUID:' + error);
          })
      },
      // 保存活动-添加活动基本信息
      submitActivity(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const params = {
              ...this.basicModel,
              activityId: this.activityId,
              brandId: this.basicModel.brandId.map(Number),
              categoryId: this.basicModel.categoryId.map(Number),
              imageText: this.$refs.richText.getUEContent()
            };
            let fn = this.activityId ? editActivity : addActivity;
            let statusText = this.activityId ? '编辑' : '添加';
            fn(params)
              .then(response => {
                if (!this.activityId) {
                  this.activityId = response.data;
                  this.selectedInfo.activityStatus = 0;
                }
                this.$message.success(statusText + '成功');
                this.brandList2 = this.brandList.filter(item => this.basicModel.brandId.some(ele => ele == item.brandId));
                this.categoryList2 = this.categoryList.filter(item => this.basicModel.categoryId.some(ele => ele == item.commodityCategoryId));
                this.selectedInfo.brandList = this.brandList2;
                this.selectedInfo.categoryList = this.categoryList2;
                this.selectedInfo.priceStrategyId = this.basicModel.priceStrategyId;
                this.selectedInfo.activityId = this.activityId;
                this.sharingThumbnailsNew.forEach(item => {
                  item.dataSourceId = this.activityId;
                  addAccessory(item)
                    .then(response => {})
                    .catch(error => {
                      console.log('administratiocenter/sysParamsSetting/addActivity.vue-添加修改活动基本信息-上传图片-submitActivity:' + error);
                    });
                })
                this.miniAppCoverNew.forEach(item => {
                  item.dataSourceId = this.activityId;
                  addAccessory(item)
                    .then(response => {})
                    .catch(error => {
                      console.log('administratiocenter/sysParamsSetting/addActivity.vue-添加修改活动基本信息-上传图片-submitActivity:' + error);
                    });
                })
                this.miniAppLoopNew.forEach(item => {
                  item.dataSourceId = this.activityId;
                  addAccessory(item)
                    .then(response => {})
                    .catch(error => {
                      console.log('administratiocenter/sysParamsSetting/addActivity.vue-添加修改活动基本信息-上传图片-submitActivity:' + error);
                    });
                })
              })
              .catch(error => {
                console.log('administratiocenter/sysParamsSetting/addActivity.vue-添加修改活动基本信息-submitActivity:' + error);
              });
          } else {
            return false;
          }
        });
      },
      // 获取活动基本信息
      getActivityInfo() {
        this.loading = true;
        const params = {
          activityId: this.activityId
        };
        getActivity(params)
          .then(response => {
            this.$refs.richText.setUEContent(response.data.imageText);
            this.activityInfo = response.data;
            var brandIdArr = [];
            var categoryIdArr = [];
            var storeIdArr = [];
            if (response.data.brandId) {
              brandIdArr = response.data.brandId.split(',');
            }
            if (response.data.commodityCategoryId) {
              categoryIdArr = response.data.commodityCategoryId.split(',');
            }
            if (response.data.storeId) {
              storeIdArr = response.data.storeId.split(',');
            }
            let newBasicModel = {
              activityName: response.data.activityName,
              activityType: Number(response.data.activityType),
              startTime: response.data.startTime,
              endTime: response.data.endTime,
              sharingDescription: response.data.sharingDescription,
              isPublic: response.data.isPublic,
              isMiniApp: response.data.isMiniApp,
              isImageText: response.data.isImageText,
              isMiniImageText: response.data.isMiniImageText,
              imageText: response.data.imageText,
              storeId: storeIdArr.map(Number),
              brandId: brandIdArr,
              categoryId: categoryIdArr,
              priceStrategyId: Number(response.data.priceStrategyId), //1653
              activityStatus: response.data.activityStatus,
              activityCode: response.data.activityCode
            }
            Object.assign(this.basicModel, newBasicModel);
            setTimeout(() => {
              this.brandList2 = this.brandList.filter(item => brandIdArr.some(ele => ele == item.brandId));
              this.categoryList2 = this.categoryList.filter(item => categoryIdArr.some(ele => ele == item.commodityCategoryId));
              let selectedInfo = {
                brandList: this.brandList2,
                categoryList: this.categoryList2,
                priceStrategyId: response.data.priceStrategyId, // 1653
                activityId: this.activityId,
                activityStatus: response.data.activityStatus
              };
              this.$store.dispatch('SET_SELECTED_INFO', selectedInfo);
            }, 0);
            response.data.sharingThumbnails.forEach(item => {
              this.sharingThumbnails.push({
                name: item.sourceName,
                url: item.accessoryUrl,
                accessoryId: item.accessoryId,
                accessoryUrl: item.accessoryUrl,
                sourceName: item.sourceName,
                isMain: item.isMain
              })
            })
            response.data.miniAppCover.forEach(item => {
              this.miniAppCover.push({
                name: item.sourceName,
                url: item.accessoryUrl,
                accessoryId: item.accessoryId,
                accessoryUrl: item.accessoryUrl,
                sourceName: item.sourceName,
                isMain: item.isMain
              })
            })
            response.data.miniAppLoop.forEach(item => {
              this.miniAppLoop.push({
                name: item.sourceName,
                url: item.accessoryUrl,
                accessoryId: item.accessoryId,
                accessoryUrl: item.accessoryUrl,
                sourceName: item.sourceName,
                isMain: item.isMain
              })
            })
            this.loading = false;
          })
          .catch(error => {
            this.loading = false;
            console.log('administratiocenter/sysParamsSetting/activityMaintain/components/basicInfo.vue-getActivityInfo:' + error);
          });
      }
    },
    computed: {
      ...mapGetters([
        'selectedInfo'
      ])
    }
  }
</script>
