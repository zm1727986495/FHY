<template>
  <el-form class="pieinstallationlist">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card class="box-card">
      <div class="m-bottom">
        <div class="iconBox">
          <i class="Icon"></i>
          <span v-if="installationType ==1">安装任务派单</span>
          <span v-else>维修任务派单</span>
        </div>
      </div>

      <!-- 多选组织机构 -->
      <organcheckdia :isType='true' :title='title' :visible="checkorg_visible" v-if="checkorg_visible" :defaultArrF="defaultArrF" :userListF="userListF" @close_org="closeCheckOrg"></organcheckdia>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="form_class">
        <!-- 第一排 -->
        <div class="infoform">
          <!-- <div class="infoform_item"> -->
          <!-- <el-form-item label="上门安装时间：" prop="firstInstallationTime">
              <el-date-picker
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                v-model="ruleForm.firstInstallationTime"
                style="width: 100%;"
              ></el-date-picker>
          </el-form-item>-->
          <!-- </div> -->
          <div class="infoform_item"></div>
        </div>
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="上门类型：" prop="designateType">
              <el-radio-group v-model="ruleForm.designateType">
                <el-radio label="1">送装一体</el-radio>
                <el-radio label="2">送装分离</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <!-- <div class="infoform_item" v-if="ruleForm.designateType==2">
            <el-form-item label="装车时间：" prop="truckLodingTime">
              <el-date-picker
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                v-model="ruleForm.truckLodingTime"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </div>-->

          <!-- prop="logisticsDeliveryTime" -->
          <div class="infoform_item" v-if="ruleForm.designateType==2">
            <el-form-item label="物流派送时间：">
              <el-date-picker
                type="datetime"
                placeholder="选择日期"
                value-format="yyyy-MM-dd HH:mm:ss"
                format="yyyy-MM-dd HH:mm:ss"
                v-model="ruleForm.logisticsDeliveryTime"
                style="width: 100%;"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="infoform_item" v-if="ruleForm.designateType==2">
            <el-form-item label="填写物流公司：">
              <!-- <el-select v-model="ruleForm.logisticsId" placeholder="请选择" class="width-100">
                <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>-->
              <el-input v-model="ruleForm.logisticsName"></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <!-- <div class="infoform_item"> -->
            <!-- <el-form-item label="出库仓库：" prop="storageId">
              <el-select v-model="ruleForm.storageId" placeholder="请选择出库仓库" class="width-100">
                <el-option
                  v-for="(item,index) in warehouseList"
                  :key="index"
                  :label="item.storageName"
                  :value="item.storageId"
                ></el-option>
              </el-select>
            </el-form-item> -->
          <!-- </div> -->
          <div class="infoform_item">
            <el-form-item label="上门联系人：" prop="contacts">
              <el-input v-model="ruleForm.contacts" placeholder="请输入上门联系人"></el-input>
            </el-form-item>
          </div>

          <div class="infoform_item">
            <el-form-item label="联系电话：" prop="contactsPhone">
              <el-input v-model="ruleForm.contactsPhone" placeholder="请输入联系电话"></el-input>
            </el-form-item>
          </div>
        </div>

        <!-- 第四排 -->
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="司机姓名：">
              <el-input v-model="ruleForm.driver" placeholder="请输入司机电话"></el-input>
            </el-form-item>
          </div>

          <div class="infoform_item">
            <el-form-item label="司机电话：">
              <el-input v-model="ruleForm.driverPhone" placeholder="请输入司机电话"></el-input>
            </el-form-item>
          </div>

          <div class="infoform_item">
            <el-form-item label="派车车牌号：">
              <el-input v-model="ruleForm.licensePlateNumber" placeholder="请输入派车车牌号"></el-input>
            </el-form-item>
          </div>
        </div>

        <!-- 第三排 -->
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="选择组长：">
              <el-select v-model="ruleForm.region2" clearable placeholder="请选择组长" class="width-100">
                <el-option v-for="item in getdesOptions" :key="item.userId" :label="item.name" :value="item.userId"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="选择工人：">
              <el-select v-model="ruleForm.region3" clearable multiple collapse-tags placeholder="请选择工人" class="width-100">
                <el-option v-for="item in workerOptions" :key="item.userId" :label="item.name" :value="item.userId"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="借调工人：">
              <el-input v-model="workerStr" @focus="openCheckOrgan"></el-input>
            </el-form-item>
          </div>
        </div>

        <!-- 第五排 -->
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="是否扛楼：" prop="resistance">
              <el-radio-group v-model="ruleForm.resistance">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="老房改造：" prop="oldHouse">
              <el-radio-group v-model="ruleForm.oldHouse">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="信息：">
              <el-checkbox-group v-model="whetherPushUserStatus">
                <el-checkbox label="派单后给客户推送派单信息"></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </div>
        </div>
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="单元柜/延米数量：">
              <el-input v-model="ruleForm.elementNumber" placeholder="请输入单元柜/延米数量"></el-input>
            </el-form-item>
          </div>

          <div class="infoform_item">
            <el-form-item label="预约上门时间：" prop="appointmentTime">
              <el-date-picker v-model="ruleForm.appointmentTime" type="datetime" placeholder="选择日期时间" style="width:100%"></el-date-picker>
            </el-form-item>
          </div>

          <div class="infoform_item"></div>
        </div>
        <div class="infoform">
          <el-form-item label="上传图纸照片:">
            <el-upload multiple list-type="picture-card" class="upload-demo" action="string" :accept="accept"
              :http-request="uploadSectionFile" :file-list="fileList" :on-remove="handleRemove">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="infoform">
          <el-form-item label="上门备注:" class="width-100">
            <el-input type="textarea" v-model="ruleForm.remake" resize="none"></el-input>
          </el-form-item>
        </div>
      </el-form>

      <!-- 采购单号 -->
      <procurOrder ref="procurOrder"></procurOrder>

      <!-- 库取单 -->
      <procurlibrary></procurlibrary>
    </el-card>

    <div class="btn">
      <el-button type="primary" @click="submission" :loading="loadingbtn">确 定</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </el-form>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import organcheckdia from "@/views/Installation/dispatchcenter/components/organcheckdia"; //组织机构--多选
import procurOrder from "./procurOrder";
import procurlibrary from "./procurlibrary";
import { put } from "@/utils/pubilcFn";
import { getUUID } from "api/pulicJava"; //生成编码

import {
  listServeUser,
  listUserByType,
  designateInstallationDetails,
  addDesignateInstallation,
  listLibrariesTake,
  listServeUserByLoginAt
} from "api/Installation/dispatchcenter/dispatchcenter";
import { log } from "util";

export default {
  components: {
    breadcrumb,
    procurOrder,
    organcheckdia, //多选组织机构
    procurlibrary
  },
  data() {
    return {
      navList: [],
      ruleForm: {
        designateType: "1", //上门类型
      },
      title:'选取借调工人',
      defaultArrF:[],//借调工人组件的组织机构回显  
      userListF:[],//借调工人组件的工人回显
      workerStr: "", //工人字符串
      installationType: "",
      whetherPushUserStatus: false,
      loadingbtn:false,
      rules: {
        logisticsName: [
          { required: true, message: "请输入物流公司", trigger: "blur" }
        ],
        storageName: [
          { required: true, message: "请输入仓库", trigger: "blur" }
        ],
        driver: [
          { required: true, message: "请输入司机姓名", trigger: "blur" }
        ],
        licensePlateNumber: [
          { required: true, message: "请输入车牌号", trigger: "blur" }
        ],
        driverPhone: [
          { required: true, message: "请输入司机电话", trigger: "blur" }
        ],
        storageId: [
          { required: true, message: "请输入出库仓库", trigger: "change" }
        ],
        contacts: [
          { required: true, message: "请输入上门联系人", trigger: "change" }
        ],
        contactsPhone: [
          { required: true, message: "请输入联系电话", trigger: "change" }
        ],
        name3: [
          { required: true, message: "请输入派车车牌号", trigger: "change" }
        ],
        elementNumber: [
          { required: true, message: "请输入单元柜数量", trigger: "change" }
        ],
        region: [
          { required: true, message: "请选择出库仓库", trigger: "change" }
        ],
        region2: [{ required: true, message: "请选择组长", trigger: "change" }],
        region3: [{ required: true, message: "请选择工人", trigger: "change" }],
        region4: [
          { required: true, message: "请选择借调工人", trigger: "change" }
        ],
        designateType: [
          { required: true, message: "请选择上门类型", trigger: "change" }
        ],
        firstInstallationTime: [
          {
            required: true,
            message: "请选择上门安装日期",
            trigger: "change"
          }
        ],
        truckLodingTime: [
          {
            required: true,
            message: "请选择装车日期",
            trigger: "change"
          }
        ],
        logisticsTime: [
          {
            required: true,
            message: "请选择物流配送时间",
            trigger: "change"
          }
        ],
        appointmentTime: [
          {
            required: true,
            message: "请选择预约上门日期",
            trigger: "change"
          }
        ],
        truckLodingTime: [
          {
            required: true,
            message: "请选择装车时间",
            trigger: "change"
          }
        ],
        logisticsDeliveryTime: [
          {
            required: true,
            message: "请选择物流派送时间",
            trigger: "change"
          }
        ],
        resistance: [
          { required: true, message: "请选择是否扛楼", trigger: "change" }
        ],
        oldHouse: [
          { required: true, message: "请选择老房改造", trigger: "change" }
        ],
        remake: [{ required: true, message: "请填备注", trigger: "blur" }]
      },
      accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",
      getdesOptions: [], //组长的下拉内容   
      workerOptions: [], //工人的下拉内容   
      organ_visible: false, //组织机构树是否显示
      checkorg_visible: false, //多选组织机构是否显示
      fileList: [], //文件上传
      imgArr: [] //文件上传
    };
  },
  mounted() {
    this.navList = this.$route.meta;
    this.getdesignateDetails(); //回显信息
    this.listUserByTypeFun('B1'); //获取组长和工人   2组长 3工人
    this.listUserByTypeFun('A'); //获取组长和工人   2组长 3工人
    this.installationType = this.$route.query.installationType;
  },
  methods: {
    //获取组长  工人
    listUserByTypeFun(id){
      let data = {
        userType:id
      }
      listUserByType(data).then(res=>{
        if(id == "B1"){
          this.getdesOptions = res.data;
        }else{
          this.workerOptions = res.data;
        }
      })
    },
    //文件删除操作
    handleRemove(file, fileList) {
      let lengs = String(file.raw.uid).length;
      this.imgArr = this.imgArr.filter(item => {
        let str = item.name.substring(0, lengs);
        return str !== String(file.raw.uid);
      });
    },
    //文件成功操作  //addAccessory编辑的新增接口
    uploadSectionFile(res) {
      put(res).then(data => {
        this.imgArr.push(data);
      });
    },

    //获取回显信息  installationOrderId
    getdesignateDetails() {
      let data = {
        installationOrderId: this.$route.query.installationOrderId
      };
      designateInstallationDetails(data).then(res => {
        if (res.status == "200") {
          if(res.data){
            this.ruleForm = res.data;
            this.ruleForm.resistance = this.ruleForm.resistance.toString();
            this.ruleForm.oldHouse = this.ruleForm.oldHouse.toString();
          }
        } else {
          this.$message.error("获取信息失败");
        }
      });
    },

    //打开多选组织机构弹框
    openCheckOrgan() {
      this.checkorg_visible = true;
    },
    //关闭多选组织机构弹框
    closeCheckOrg(Arr,defArr) {
      if (Arr) {
        this.defaultArrF = defArr;
        this.userListF = Arr;
        let nameArr = Arr.map(item => {
          return item.name;
        });
        let str = nameArr.join(",");
        this.workerStr = str; //给页面input框赋值所选人员的姓名

        this.ruleForm.designateInstallationUsers = [];
        Arr.forEach(item => {
          this.ruleForm.designateInstallationUsers.push({
            designateType: "3",
            userId: item.id
          });
        });
      }
      this.checkorg_visible = false;
    },

    //确定
    submission() {
      let arr = [];
      this.$refs.procurOrder.dataList.forEach(item => {
        arr.push({
          purchaseOrderId: item.purchaseOrderId
        });
      });
      //处理上传文件
      if (this.imgArr.length >= 1) {
        let fileArr = this.imgArr.map(item => {
          return { fileUrl: item.url };
        });
        this.ruleForm.designateInstallationPics = fileArr;
      }

      //处理上传文件

      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          this.ruleForm.whetherPushUserStatus = this.whetherPushUserStatus ? "1": "0"; //处理是否推送给客户
          
          if(!this.ruleForm.designateInstallationUsers){
            this.ruleForm.designateInstallationUsers = [];
          }
          //组长 
          if(this.ruleForm.region2){
            let data1 = { designateType: "1", userId: this.ruleForm.region2 };  
            this.ruleForm.designateInstallationUsers.push(data1);
          }

          //工人
          if(this.ruleForm.region3){
            var data2 = this.ruleForm.region3.map(item=>{
              return { designateType: "2", userId: item}
            })
            this.ruleForm.designateInstallationUsers = this.ruleForm.designateInstallationUsers.concat(data2);
          }
          if(this.ruleForm.designateInstallationUsers.length==0){
            this.$message.warning('组长，工人，借调工人至少选择一个');
            return;
          };

          this.ruleForm.designateOutLibraryIds = [];
          this.ruleForm.designateOutLibraryIds = this.ruleForm.designateOutLibraryVOS == null ? [] : this.ruleForm.designateOutLibraryVOS.map(item => {
                  return item.designateOutLibraryId;
                });
          this.ruleForm.installationOrderId = this.$route.query.installationOrderId;
          this.ruleForm.purchaseOrderDTOS = arr;
          //生成编码
          this.loadingbtn = true;
          new Promise((resolve, reject) => {
            if (this.$route.query.installationType == "1") {
              getUUID({ serialNumber: "IT" }).then(res => {
                resolve(res);
              });
            } else {
              getUUID({ serialNumber: "MA" }).then(res => {
                resolve(res);
              });
            }
          }).then(res => {
            this.ruleForm.designateInstallationNumber = res.data;
            addDesignateInstallation(this.ruleForm).then(res => {
              if (res.status == "200") {
                this.$message.success("指派任务成功");
                this.$router.go(-1);
                this.loadingbtn = false;
              }else{
                this.loadingbtn = false;
              }
            });
          });
        } else {
          this.loadingbtn = false;
          this.$message.error("请检查填写信息是否遗漏");
          return false;
        }
      });
    },
    //取消
    cancel() {
      this.$router.go(-1);
    }
  }
};
</script>
<style lang="scss" scoped>
.pieinstallationlist {
  .form_class {
    width: 95%;
    margin: 0 auto;
    .infoform {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      .infoform_item {
        width: 30%;
      }
    }
  }
  .btn {
    margin-top: 20px;
    display: flex;
    justify-content: center;
  }
}
</style>
