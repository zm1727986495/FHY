<template>
  <div class="addrecommender">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>

    <el-card class="lvs cards">
      <!-- 客户基本信息 -->
      <div class="bordermodel">
        <div class="iconBox m-bottom">
                      <i class="Icon"></i>
                      <span>上样信息</span>
                  
        </div>

        <!-- 上样信息的表单集合 -->
        <sampleform ref="sampleform" @brand_change="brandChange" @commodity_change="commodityChange"
                    @goods_change="goodsChange"></sampleform>

        <!-- 表格 -->
        <roomtable ref="roomtable" :brandId="brandId" :commodityCategoryId="commodityCategoryId"></roomtable>

        <!-- 地址弹框 -->
        <el-dialog
          title="地址管理"
          :visible.sync="dialogVisible"
          width="50%">
          <div>
            <addresselection ref="adddatas" :customerId="customerId" v-if="dialogVisible"></addresselection>
          </div>
          <span slot="footer" class="dialog-footer">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="subminaddchange">确 定</el-button>
                </span>
        </el-dialog>
        <!-- 地址弹框 -->
        <el-dialog
          title="地址管理"
          :visible.sync="orderdialogVisible"
          width="50%">
          <div>
            <addresselection ref="orderadddatas" :customerId="customerId" v-if="orderdialogVisible"></addresselection>
          </div>
          <span slot="footer" class="dialog-footer">
                    <el-button @click="orderdialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="ordersubminaddchange">确 定</el-button>
                </span>
        </el-dialog>

        <!-- 客户信息地址 -->
        <el-dialog
          title=""
          :visible.sync="mapDialogVisible"
          width="50%"
          v-if="mapDialogVisible">
          <div class="titlecals" style="margin-left:15px">地图定位</div>

          <baidu-map class="map"
                     :center="center"
                     :zoom="15"
                     :keyboard="true"
                     @moving="syncCenterAndZoom"
                     @moveend="syncCenterAndZoom"
                     @zoomend="syncCenterAndZoom"
                     @click="getClickInfo"
                     :scroll-wheel-zoom="true"
                     :double-click-zoom=false>
            <bm-navigation anchor="BMAP_ANCHOR_TOP_RIGHT"></bm-navigation>
            <!-- v-on:keyup.enter="mapEnter()" v-on:keyup.38="mapEnter" v-on:keyup.40="mapEnter"    -->
            <bm-control>
              <bm-auto-complete v-model="keyword" :sugStyle="{zIndex: 999999}">
                <input type="text" v-model="mapText" placeholder="请输入搜索关键字" class="serachinput">
              </bm-auto-complete>
            </bm-control>
            <bm-local-search :keyword="keyword" :auto-viewport="true" @infohtmlset="infohtmlsets"
                             style="display:none"></bm-local-search>
          </baidu-map>
          <div slot="footer" style="margin-top: 0px;">
            <Button @click="cancel" type="ghost" style="width: 60px;height: 36px;">取消</Button>
            <Button type="primary" style="width: 60px;height: 36px;" @click="confirm">确定</Button>
          </div>
        </el-dialog>

      </div>
      <!-- 附件管理 -->
      <div v-if="isAudit || isDetail" style="marginTop: 10px;">
        <div class="iconBox m-bottom" v-if="fileList && fileList.length != 0">
          <i class="Icon"></i>
          <span>附件管理</span>
        </div>
        <ul class="el-upload-list el-upload-list--text downlists" v-if="fileList && fileList.length != 0">
          <li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in fileList" :key="index">
            <a class="el-upload-list__item-name">
              <i class="el-icon-document"></i> {{ item.name }}
            </a>
            <a :href="urls" download class="el-icon-download pointer" @click="downPic(item)"></a>
          </li>
        </ul>
      </div>

      <div v-else style="marginTop: 10px;">
        <div class="iconBox m-bottom">
          <i class="Icon"></i>
          <span>附件管理</span>
        </div>
        <el-upload
          list-type="text"
          class="upload-demo"
          action="string"
          :http-request="uploadSectionFile"
          :file-list="fileList"
          :on-remove="handleRemove"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <!-- 审批意见组件 -->
      <auditopinion v-if="isAudit" ref="auditcomponent"></auditopinion>
    </el-card>
    <div class="btn_center" v-if="isAudit" style="marginBottom: 20px;marginTop: 20px;">
      <el-button type="primary" :size="size" class="reset_btn m-left20" @click="auditFun('invoice')" :loading="btnLoading">确 定</el-button>
      <el-button :size="size" class="reset_btn m-left20" @click="cancle('sampleForm')">取 消</el-button>
    </div>
    <div class="bottom_btnlist" v-else>
      <el-button type="primary" @click="submitForm('sampleForm',0)" v-if="!isDetail" :loading="btnLoading">保 存</el-button>
      <el-button type="primary" @click="submitForm('sampleForm',4)" v-if="!isDetail" :loading="btnLoading">提 交
      </el-button>
      <el-button @click="cancle('sampleForm')">取 消</el-button>
    </div>
  </div>
</template>
<script>

  import pagination from "@/views/components/pagination";
  import breadcrumb from "@/views/components/breadcrumb";
  import addresselection from '../../../components/addresselection';
  import roomtable from './components/roomtable';
  import sampleform from "../components/sampleform";
  import auditopinion from "@/views/components/components/components/auditopinion"; // 审核意见
  import {put, getBuffer} from "@/utils/pubilcFn";
  import {getUpToken} from "@/utils/auth";
  import {
    removeAccessoryImg, //删除图片
    addAccessory, //新增图片
  } from "@/api/order/recommender/recommender";
  import {
    editSample, // 修改样品
    addSample, // 新增上样
    getSample, // 查看样品详情
    auditSample, // 上样审核
  } from 'api/administrationCenter/samplemanagement/index';
  import {
    baiduMap,
    getUUID
  } from 'src/api/pulicJava.js';

  export default {
    components: {
      breadcrumb,
      pagination,
      addresselection,
      sampleform,
      roomtable,
      auditopinion, // 审核意见
    },
    // name: 'addSample',
    data() {
      return {
        brandId: '', // 品牌
        commodityCategoryId: '', // 品类
        companyId: '', // 供应商

        size: 'medium',
        btnLoading: false, // 按钮的loading Flag
        isAudit: false,
        navList: [],  //头部面包屑
        orderNumber: '', // UUId
        storeList: [], // 获取门店列表
        isEdit: false, // 是否是编辑页
        isView: false,
        isDetail: false, // 是否是详情页
        btnSize: 'small',
        labelPosition: 'right',
        readonly: true,
        searchData: [], //  预计上样日期
        sample: {
          num: '', // 申请单号
          date: '',
          store: '', // 申请店面
          maps: '', // 地址
          applicant: '', // 申请人
          customerPhone: '', //  申请人电话
          type: '', //  上样类型
          measure: 1, // 是否需要测量
          desc: '', // 上样描述
        },// 上样信息
        // 条件
        typeList: [],  // 上样类型
        maps: '',//地图信息
        mapDialogVisible: false,
        // ordermaps:'',//订单信息地图信息
        buildingNumber: '',//楼号
        unitNumber: '',//单元
        roomNumber: '',//室
        orderbuildingNumber: '',//楼号
        orderunitNumber: '',//单元
        orderroomNumber: '',//室
        // orderdialogVisible: false,//订单信息地址列表按钮
        customerId: 0,
        dialogVisible: false,
        orderdialogVisible: false,//订单信息地址列表按钮
        //百度地图
        mapText: '',
        center: {lng: 116.404, lat: 39.915},//经纬度
        ordercenter: {lng: 116.404, lat: 39.915},//经纬度
        zoom: 15,
        maps: '',//地图信息
        ordermaps: '',//订单信息地图信息
        // mapDialogVisible: false,
        ordermapDialogVisible: false,
        keyword: '',
        xqdataid: "",
        xqdatas: {},
        xqtabledata: [],
        // 上传
        fileList: [],
        imgArr: [],
        delImgArr: [],
        rules: {
          name: [
            {required: true, message: '请输入活动名称', trigger: 'blur'},
            {min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur'}
          ],
          region: [
            {required: true, message: '请选择活动区域', trigger: 'change'}
          ],
          date1: [
            {type: 'date', required: true, message: '请选择日期', trigger: 'change'}
          ],
          date2: [
            {type: 'date', required: true, message: '请选择时间', trigger: 'change'}
          ],
          type: [
            {type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change'}
          ],
          resource: [
            {required: true, message: '请选择活动资源', trigger: 'change'}
          ],
          desc: [
            {required: true, message: '请填写活动形式', trigger: 'blur'}
          ]
        },
      };
    },

    // activated(){
    //   if (this.$route.path == "/samplemanagement/editsample") { // 上样修改
    //     this.readonly = false;
    //     this.isEdit = true;
    //     this.getSample();
    //   } else if (this.$route.path == "/samplemanagement/addsample") { // 上样新增
    //     this.readonly = false;
    //   } else if (this.$route.path == "/samplemanagement/auditupsample") { // 上样审核
    //     this.readonly = true;
    //     this.isAudit = true;
    //   } else if (this.$route.path == "/samplemanagement/viewupsample") { // 上样详情
    //     this.readonly = false;
    //     this.isDetail = true;
    //     this.getSample();
    //   }

    //   // 头部面包屑
    //   this.navList = this.$route.meta;
    // },
    // deactivated () {
    //     this.$destroy(true)
    // },

    created() {
      if (this.$route.path == "/samplemanagement/editsample") { // 上样修改
        this.readonly = false;
        this.isEdit = true;
        this.getSample();
      } else if (this.$route.path == "/samplemanagement/addsample") { // 上样新增
        this.readonly = false;
      } else if (this.$route.path == "/samplemanagement/auditupsample") { // 上样审核
        this.readonly = true;
        this.isAudit = true;
      } else if (this.$route.path == "/samplemanagement/viewupsample") { // 上样详情
        this.readonly = false;
        this.isDetail = true;
        this.getSample();
      }


    },

    mounted() {
      // 头部面包屑
      this.navList = this.$route.meta;
    },
    methods: {
      // 品类
      commodityChange(val, isExit) {

        this.commodityCategoryId = val; // 品类
        this.$refs.roomtable.orderBudgetDTOList = [];
      },
      // 品牌
      brandChange(val, isExit) {

        this.brandId = val; // 品牌
        this.$refs.roomtable.orderBudgetDTOList = [];
      },
      goodsChange(val) {
        this.$confirm('是否确定重新选择订单货品类型?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$refs.roomtable.productList.goodsType = val;
          this.$refs.roomtable.orderBudgetDTOList = [];
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });
        });
      },

      // 审核
      auditFun() {
        if (this.$refs.auditcomponent.audit.operationStatus == 2 && !this.$refs.auditcomponent.audit.rejectionReasons) { // 如果是驳回
          this.$message.warning("请填写审批意见");
          return;
        }

        if (!this.$refs.auditcomponent.audit.operationStatus) {
          this.$message.warning("请选择审核状态");
          return;
        }

        // sampleResult 0待审核 1审核通过 2驳回 3审核中
        this.btnLoading = true;
        let data = {
          sampleId: this.$route.query.sampleId, //  上样ID
          sampleResult: this.$refs.auditcomponent.audit.operationStatus, //     操作状态 1 通过 2驳回
          approveOpinion: this.$refs.auditcomponent.audit.rejectionReasons, //    驳回原因
          orderId: this.$route.query.orderId,
          orderNumber: this.$route.query.orderNumber,
        }
        auditSample(data).then(res => {
          if (res.status == 200) {
            this.$message.success("操作成功");
            this.btnLoading = false;
            this.$router.push("/samplemanagement/upsample");
          }
        }).catch(err => {
          this.btnLoading = false;
          console.log('申请:开票申请管理 总申请 components/components/application/components/invoiceapply.vue', err);
        })
      },

      // 文件成功操作  //addAccessory编辑的新增接口
      uploadSectionFile(res) {
        put(res).then(data => {
          this.imgArr.push(data);
          // console.log(this.imgArr,"this.imgArr 52366");

        });
      },

      // 上样回显信息
      getSample() {
        let data = {
          sampleId: this.$route.query.sampleId,
          orderId: this.$route.query.orderId,
        };
        getSample(data).then(res => {
          if (res.status == 200) {
            this.fileList = res.data.accessoryList;
            this.fileList = this.fileList.map(item => {
              return {
                ...item,
                name: item.sourceName,
                url: item.fileUrl
              }
            })
            this.orderNumber = res.data.orderNumber;
          }
        }).catch(error => {
          console.log('样品管理:表单 信息回显 views/administrationCenter/samplemanagement/components/sampleform.vue', error);
        })
      },

      // 文件删除操作
      handleRemove(file, fileList) {
        if (file.accessoryId) {
          //console.log("旧图片删除");
          let delobj = {
            accessoryId: file.accessoryId,
            dataSourceId: file.dataSourceId,
            dataSourceEnum: file.dataSourceEnum
          };
          this.delImgArr.push(delobj);
          console.log(file, this.delImgArr, "file delImgArr");
        } else {
          let lengs = String(file.raw.uid).length;
          this.imgArr = this.imgArr.filter(item => {
            let str = item.name.substring(0, lengs);
            return str !== String(file.raw.uid);
          });
        }
      },
      enlargePic(item) {
        this.dialogImageUrl = item.fileUrl;
        this.dialogVisible = true;
      },
      downPic(item) {
        getBuffer(item.sourceName).then(res => {
          this.urls = res;
        });
      },

      // 确定按钮
      submitForm(formName, type) {
        if (this.$refs.roomtable.orderBudgetDTOList.length == 0) { // 必须有商品
          this.$message.warning("请添加房间和商品");
          return;
        }

        let flag = this.$refs.roomtable.orderBudgetDTOList.every(item => { // 每个房间的商品集合大于0
          return item.orderCommodityDTOList.length > 0;
        })

        if (!flag) {
          this.$message.warning("请添加房间和商品");
          return;
        }

        let flagRoom = this.$refs.roomtable.orderBudgetDTOList.every(item => { // 每个房间的商品集合大于0
          return item.roomId;
        })

        if (!flagRoom) {
          this.$message.warning("请选择房间");
          return;
        }


        this.$refs.sampleform.$refs[formName].validate((valid) => {
          if (valid) {
            let sampleFile = this.imgArr.map(file => {
              return {
                fileUrl: file.url,
                sourceName: file.name
              };
            });

            this.btnLoading = true;
            if (this.isEdit) { // 如果是编辑页面 新增修改页面的修改
              if (this.delImgArr.length > 0) {
                //有删除旧图片
                console.log("有删除旧图片", this.delImgArr);
                this.delImgArr.forEach(item => {
                  removeAccessoryImg(item).then(res => {
                  });
                });
              }

              // this.imgArr.forEach(item => {
              //     if (!item.accessoryId) {
              //         let data = {
              //             dataSourceId: this.$route.query.sampleId,
              //             sourceName: item.name,
              //             fileUrl: item.url,
              //             dataSourceEnum: "OrderApplyRefund"
              //         };
              //         addAccessory(data).then(res => {}).catch(error => {
              //             console.error("新增图片", error);
              //         });
              //     }
              // });

            }


            let data = {

              // 新增
              // orderNumber: this.orderNumber,
              status: type, // 保存还是提交 根据传入的参数判断
              sampleResult: type, // 保存还是提交 根据传入的参数判断
              storeId: this.$refs.sampleform.sample.storeId,     // 申请店面
              address: this.$refs.sampleform.sample.address,     // 店面地址
              brandId: this.$refs.sampleform.sample.brandId,     // 品牌
              commodityCategoryId: this.$refs.sampleform.sample.commodityCategoryId,     // 品类 产品类别
              orderGoodsType: this.$refs.sampleform.sample.orderGoodsType,     // 订单货品类型
              applicant: this.$refs.sampleform.sample.applicant,//  申请人
              applicantId: this.$refs.sampleform.sample.applicantId,     //  申请人id
              applicantPhone: this.$refs.sampleform.sample.customerPhone,     //  申请人电话
              pushSampleType: this.$refs.sampleform.sample.type,     //上样类型
              sampleExpectChangeTime: this.$refs.sampleform.sample.searchData,     //  预计上样时间
              isNeedMeasure: this.$refs.sampleform.sample.measure,     //  是否需要测量
              approverId: this.$refs.sampleform.sample.approval,     //  审批人ID
              sampleRemark: this.$refs.sampleform.sample.desc,     //上样描述
              // orderRemark:  this.$refs.sampleform.sample.desc,     // 备注
              orderBudgetDTOList: this.$refs.roomtable.orderBudgetDTOList,
              sampleFile,
            };
            data.applicantPhone = this.$refs.sampleform.sample.customerPhone;

            if (this.isEdit) {
              data.orderId = this.$route.query.orderId;
              // 编辑
              data.sampleId = this.$route.query.sampleId;
              data.orderId = this.$route.query.orderId;

              editSample(data).then(res => {
                if (res.status = 200) {
                  this.$message.success("操作成功");
                  this.btnLoading = false;
                  this.$router.push("/samplemanagement/upsample");
                }
              }).catch(error => {
                this.btnLoading = false;
                console.log(error, '订单管理:根据客户姓名获取客户信息 order/justOrder/addJustOrder.vue');
              })
            } else {
              getUUID({serialNumber: 'US'}).then(res => {
                if (res.status == 200) {
                  data.orderNumber = res.data;

                  addSample(data).then(res => {
                    if (res.status = 200) {
                      this.$message.success("操作成功");
                      this.btnLoading = false;
                      this.$router.push("/samplemanagement/upsample");
                    }
                  }).catch(error => {
                    this.btnLoading = false;
                    console.log(error, '订单管理:根据客户姓名获取客户信息 order/justOrder/addJustOrder.vue');
                  })
                }
              })
            }
            // console.log(JSON.stringify(data),"data 555555555");
          } else {
            return false;
          }
        });
      },
      // 取消按钮
      cancle() {
        this.$router.push("/samplemanagement/upsample")
      },


      //弹出地图框
      maplocation() {
        this.mapDialogVisible = true
      },

      addressaler() {
        this.dialogVisible = true;
      },

      // 提交勾选地址列表
      subminaddchange() {
        let addarr = this.$refs.adddatas.selections
        if (addarr === undefined) {
          this.$message({
            message: '请选择地址信息',
            type: 'warning'
          });
          return false;
        }
        if (addarr.length > 1) {
          this.$message({
            message: '只能选择一个地址信息',
            type: 'warning'
          });
        } else if (addarr.length === 0) {
          this.$message({
            message: '请选择地址信息',
            type: 'warning'
          });
        } else {
          this.dialogVisible = false;
          let datas = {
            customerAddressId: addarr[0].customerAddressId
          }

          getCustomerAddress(datas).then(res => {

            if (res.status == 200) {
              this.khaddressdata = {
                provinceId: parseInt(res.data.provinceId),//省
                cityId: parseInt(res.data.cityId),//市
                areaId: parseInt(res.data.areaId),//区
                longitude: res.data.longitude + "",//经度
                latitude: res.data.latitude + "",//纬度
                address: res.data.address,//地址
              }
              let adddata = res.data.address
              this.maps = adddata.substring(0, adddata.indexOf("#"));
              this.buildingNumber = this.addsplicfun(adddata)[0];
              this.unitNumber = this.addsplicfun(adddata)[1];
              this.roomNumber = this.addsplicfun(adddata)[2];
            }
          }).catch(error => {
            console.log(error, '订单管理:根据客户姓名获取客户信息 order/justOrder/addJustOrder.vue');
          })

        }
      },
      ordersubminaddchange() {
        let addarr = this.$refs.orderadddatas.selections
        if (addarr === undefined) {
          this.$message({
            message: '请选择地址信息',
            type: 'warning'
          });
          return false;
        }
        if (addarr.length > 1) {
          this.$message({
            message: '只能选择一个地址信息',
            type: 'warning'
          });
        } else if (addarr.length === 0) {
          this.$message({
            message: '请选择地址信息',
            type: 'warning'
          });
        } else {
          this.dialogVisible = false;
          let datas = {
            customerAddressId: addarr[0].customerAddressId
          }
          // console.log(datas,"地址详情请求");
          getCustomerAddress(datas).then(res => {
            if (res.status == 200) {
              this.ddaddressdata = {
                provinceId: parseInt(res.data.provinceId),//省
                cityId: parseInt(res.data.cityId),//市
                areaId: parseInt(res.data.areaId),//区
                longitude: res.data.longitude + "",//经度
                latitude: res.data.latitude + "",//纬度
                address: res.data.address,//地址
              }
              let adddata = res.data.address
              this.ordermaps = adddata.substring(0, adddata.indexOf("#"));
              this.orderbuildingNumber = this.addsplicfun(adddata)[0];
              this.orderunitNumber = this.addsplicfun(adddata)[1];
              this.orderroomNumber = this.addsplicfun(adddata)[2];
            }
          }).catch(error => {
            console.log(error, '订单管理:根据客户姓名获取客户信息 order/justOrder/addJustOrder.vue');
          })

        }
      },
      syncCenterAndZoom(e) {

      },
      // 订单信息
      ordersyncCenterAndZoom(e) {

      },
      //地图点击事件
      getClickInfo(e) {
        // console.log(e,12);
        this.center.lng = e.point.lng
        this.center.lat = e.point.lat
      },
      //点击所搜索红点
      infohtmlsets(poi) {
        this.center = {};
        this.center.lat = poi.point.lat;
        this.center.lng = poi.point.lng;
      },
      //取消
      cancel() {
        this.mapDialogVisible = false
      },
      //地图确认按钮
      confirm() {
        this.$emit('map-confirm', this.center)
        // console.log(this.center);
        baiduMap(this.center.lng, this.center.lat).then(res => {
          this.mapData = res;
          let str = "";
          str += this.mapData.formatted_address + this.mapData.sematic_description + "#" + this.buildingNumber + "#" + this.unitNumber + "#" + this.roomNumber;
          this.khaddressdata = {
            provinceId: parseInt(this.mapData.addressComponent.adcode.substring(0, 2) + "0000"),//省
            cityId: parseInt(this.mapData.addressComponent.adcode.substring(0, 4) + "00"),//市
            areaId: parseInt(this.mapData.addressComponent.adcode),//区
            longitude: this.center.lng + "",//经度
            latitude: this.center.lat + "",//纬度
            address: str,//地址
          }
          this.maps = this.mapData.formatted_address + this.mapData.sematic_description;
          this.center = res.location;
          // console.log(this.maps);
        }).catch(error => {
          console.log(error)
        })
        this.mapDialogVisible = false
      },

      handleChange(file, fileList) {
        this.fileList = fileList.slice(-3);
      },
      //订单信息地址取消
      ordercancel() {
        this.ordermapDialogVisible = false
      },

    }
  };
</script>
<style scoped lang='scss'>
  .cards {
    .bordermodel {
      .textitle {
        display: flex;
        justify-content: space-between;
        font-size: 14px;

        .titlecals {
          top: 0px;
          padding: 20px 0px;
        }
      }

      .samplefrom {
        .el-form-item__label {
          font-weight: 400;
          white-space: nowrap;
        }

        .demo-form-inline {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;

          > div {
            width: 40%;
          }
        }

        .input_100 {
          width: 100% !important;
        }
      }
    }
  }

  .titlecals {
    margin: 0 20px;
  }

  .bottom_btnlist {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    // border: 1px solid red;
  }


  .map {
    width: 100%;
    height: 400px;

  }


</style>

