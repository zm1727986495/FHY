<template>
  <div class="reportJournaldia">
    <el-dialog title="安装汇报日志" :visible.sync="visible" width="60%" :before-close="handleClose" custom-class="customDialogTitle">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="formclass">
        <el-form-item label="安装结果" prop="installationResult">
          <el-radio v-model="ruleForm.installationResult" :disabled="isDisabled" label="1">未完成</el-radio>
          <el-radio v-model="ruleForm.installationResult" :disabled="isDisabled" label="2">已完成</el-radio>
        </el-form-item>

        <el-form-item label="安装定位">
          <el-input v-model="ruleForm.address" disabled></el-input>
        </el-form-item>

        <el-form-item label="安装前照片" required>
          <ul v-if="isDisabled" class="imgList">
            <li v-for="(item,index) in fileList1" :key='index'>
              <img :src="item.url">
            </li>
          </ul>
          <el-upload multiple v-if="!isDisabled" list-type="picture-card" class="upload-demo" action="string" :accept="accept" 
          :http-request="uploadSectionFile1" :file-list="fileList1" :on-remove="handleRemove1">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="安装后照片" required>
          <ul v-if="isDisabled" class="imgList">
            <li v-for="(item,index) in fileList2" :key='index'>
              <img :src="item.url">
            </li>
          </ul>
          <el-upload multiple v-if="!isDisabled" list-type="picture-card" class="upload-demo" action="string" :accept="accept" 
          :http-request="uploadSectionFile2" :file-list="fileList1" :on-remove="handleRemove1">
            <i class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-form-item>

        <el-form-item label="是否改制" prop="isRemould">
          <el-radio v-model="ruleForm.isRemould" :disabled="isDisabled" label="1">是</el-radio>
          <el-radio v-model="ruleForm.isRemould" :disabled="isDisabled" label="2">否</el-radio>
        </el-form-item>

        <!-- <el-form-item label="是否异常" prop="isAbnormal">
          <el-radio v-model="ruleForm.isAbnormal" label="1">是</el-radio>
          <el-radio v-model="ruleForm.isAbnormal" label="2">否</el-radio>
        </el-form-item> -->

        <el-form-item label="是否带回货品" prop="isCommodityLead">
          <el-radio v-model="ruleForm.isCommodityLead" :disabled="isDisabled" label="1">是</el-radio>
          <el-radio v-model="ruleForm.isCommodityLead" :disabled="isDisabled" label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="未完成原因" v-if="ruleForm.installationResult=='1'">
          <el-radio v-model="ruleForm.unfinishedCause" :disabled="isDisabled" label="1">客户</el-radio>
          <el-radio v-model="ruleForm.unfinishedCause" :disabled="isDisabled" label="2">材料</el-radio>
          <el-radio v-model="ruleForm.unfinishedCause" :disabled="isDisabled" label="3">安装</el-radio>
          <el-radio v-model="ruleForm.unfinishedCause" :disabled="isDisabled" label="4">设计</el-radio>
          <el-radio v-model="ruleForm.unfinishedCause" :disabled="isDisabled" label="5">销售</el-radio>
          <el-radio v-model="ruleForm.unfinishedCause" :disabled="isDisabled" label="6">货少</el-radio>
          <el-radio v-model="ruleForm.unfinishedCause" :disabled="isDisabled" label="7">货坏</el-radio>
        </el-form-item>

        <el-form-item label="是否允许退货" prop="isRetreat">
          <el-radio v-model="ruleForm.isRetreat" :disabled="isDisabled" label="1">是</el-radio>
          <el-radio v-model="ruleForm.isRetreat" :disabled="isDisabled" label="2">否</el-radio>
        </el-form-item>

        <el-form-item label="是否收费" prop="chargeType">
          <el-radio v-model="ruleForm.chargeType" :disabled="isDisabled" label="1">是</el-radio>
          <el-radio v-model="ruleForm.chargeType" :disabled="isDisabled" label="2">否</el-radio>
        </el-form-item>

        <!-- reportRemake -->
        <el-form-item label="汇报内容">
          <el-input v-model="ruleForm.reportContent" type="textarea"></el-input>
        </el-form-item>

        <!-- <el-form-item label="备注">
          <el-input v-model="ruleForm.reportRemake" type="textarea"></el-input>
        </el-form-item> -->
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="addreport" :loading="loadingBtn">提 交</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  listStorage,
  editInstallationReportContent, //添加安装任务
  installationReportDetails //安装任务回显
} from "@/api/entrepotSet/aftermarket/repairtask/repairtask";

import { put } from "@/utils/pubilcFn";

import {
  removeAccessoryImg, //删除图片
  addAccessory //新增图片
} from "@/api/order/recommender/recommender";

export default {
  props: ["visible", "designateInstallationId", "installationOrderId","isReport"],

  data() {
    return {
      ruleForm: {},
      loadingBtn:false,
      rules: {
        installationResult: [
          { required: true, message: "请选择安装结果", trigger: "change" }
        ],
        address: [{ required: true, message: "请输入地址", trigger: "blur" }],
        isRemould: [
          { required: true, message: "请选择是否改制", trigger: "change" }
        ],
        // isAbnormal: [
        //   { required: true, message: "请选择是否异常", trigger: "change" }
        // ],
        isCommodityLead: [
          { required: true, message: "请选择是否带回商品", trigger: "change" }
        ],
        isRetreat: [
          { required: true, message: "请选择是否可退", trigger: "change" }
        ],
        chargeType: [
          { required: true, message: "请选择是否收费", trigger: "change" }
        ],
        unfinishedCause: [
          {
            type: "array",
            required: true,
            message: "请至少未完成原因",
            trigger: "change"
          }
        ],

        reportContent: [
          { required: true, message: "请输入地址", trigger: "blur" }
        ]
      },
      isDisabled: false,//是否禁用   编辑时候禁用所有输入内容

      fileList1: [],
      imgArr1: [],

      fileList2: [],
      imgArr2: [],

      accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",


      delImgArr: []
    };
  },
  mounted() {
    this.getInfo();
    if(this.isReport == "1"||this.isReport == "0"){
      this.isDisabled = false;
    }else{
      this.isDisabled = true;
    }
  }, 

  methods: {
    //根据id回显信息
    getInfo() {
      let data = {
        designateInstallationId: this.designateInstallationId
      };
      installationReportDetails(data).then(res => {
        if (res.status == "200") {
          if (res.data == null) {
            this.ruleForm = {};
          } else {
            this.ruleForm = res.data;
            this.ruleForm.installationResult = this.ruleForm.installationResult
              ? this.ruleForm.installationResult.toString()
              : "";
            this.ruleForm.isRemould = this.ruleForm.isRemould
              ? this.ruleForm.isRemould.toString()
              : "";
            this.ruleForm.isCommodityLead = this.ruleForm.isCommodityLead
              ? this.ruleForm.isCommodityLead.toString()
              : "";
            // this.ruleForm.isAbnormal = this.ruleForm.isAbnormal
            //   ? this.ruleForm.isAbnormal.toString()
            //   : "";
            this.ruleForm.chargeType = this.ruleForm.chargeType
              ? this.ruleForm.chargeType.toString()
              : "";
            this.ruleForm.isRetreat = this.ruleForm.isRetreat
              ? this.ruleForm.isRetreat.toString()
              : "";
            this.ruleForm.unfinishedCause = this.ruleForm.unfinishedCause
              ? this.ruleForm.unfinishedCause.toString()
              : "";
            this.ruleForm.address = this.ruleForm.locationAddress;
            if (this.ruleForm.installationBeforPic.length > 0) {
              this.fileList1 = this.ruleForm.installationBeforPic.map(item => {
                return {
                  ...item,
                  url: item.fileUrl
                };
              });
              console.log(this.fileList1);
            }

            if (this.ruleForm.installationAfterPic.length > 0) {
              this.fileList2 = this.ruleForm.installationAfterPic.map(item => {
                return {
                  ...item,
                  url: item.fileUrl
                };
                console.log(this.fileList2);
              });
            }
          }
        }
      });
    },

    uploadSectionFile1(res) {
      put(res).then(data => {
        this.imgArr1.push(data);
      });
    },

    uploadSectionFile2(res) {
      put(res).then(data => {
        this.imgArr2.push(data);
      });
    },

    //文件删除1
    handleRemove1(file, fileList) {
      if (file.dataSourceId) {
        //console.log("旧图片删除");
        let delobj = {
          accessoryId: file.accessoryId,
          dataSourceId: file.dataSourceId,
          dataSourceEnum: file.dataSourceEnum
        };
        this.delImgArr.push(delobj);
      } else {
        //console.log("新增图片删除");
        let lengs = String(file.raw.uid).length;
        this.imgArr1 = this.imgArr1.filter(item => {
          let str = item.name.substring(0, lengs);
          return str !== String(file.raw.uid);
        });
      }
    },

    //文件删除2
    handleRemove2(file, fileList) {
      if (file.dataSourceId) {
        //console.log("旧图片删除");
        let delobj = {
          accessoryId: file.accessoryId,
          dataSourceId: file.dataSourceId,
          dataSourceEnum: file.dataSourceEnum
        };
        this.delImgArr.push(delobj);
      } else {
        //console.log("新增图片删除");
        let lengs = String(file.raw.uid).length;
        this.imgArr2 = this.imgArr2.filter(item => {
          let str = item.name.substring(0, lengs);
          return str !== String(file.raw.uid);
        });
      }
    },

    handleClose() {
      this.$refs["ruleForm"].resetFields();
      this.fileList1 = [];
      this.fileList2 = [];
      this.$emit("close_rep");
    },
    addreport() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          if (this.isReport == "1") {
            //待汇报  新增数据
            if (this.imgArr1.length == 0 || this.imgArr2.length == 0) {
              this.$message.error("请上传图片");
              return;
            }
            this.ruleForm.installationBeforPic = this.imgArr1.map(item => {
              return {
                fileUrl: item.url,
                sourceName: item.name
              };
            });

            this.ruleForm.installationAfterPic = this.imgArr2.map(item => {
              return {
                fileUrl: item.url,
                sourceName: item.name
              };
            });
          } else {
            if (this.imgArr1.length > 0) {
              this.imgArr1
                .map(item => {
                  return {
                    fileUrl: item.url,
                    sourceName: item.name
                  };
                })
                .forEach(item => {
                  console.log(item);
                  let query = {
                    dataSourceEnum: "InstallationBeforPic",
                    dataSourceId: this.ruleForm.designateInstallationId,
                    ...item
                  };
                  addAccessory(query).then(res => {});
                });
            }

            

            if (this.imgArr2.length > 0) {
              this.imgArr2
                .map(item => {
                  return {
                    fileUrl: item.url,
                    sourceName: item.name
                  };
                })
                .forEach(item => {
                  console.log(item);
                  let query = {
                    dataSourceEnum: "InstallationAfterPic",
                    dataSourceId: this.ruleForm.designateInstallationId,
                    ...item
                  };
                  addAccessory(query).then(res => {});
                });
            }

            if (this.delImgArr.length > 0) {
              //有删除旧图片
              console.log("有删除旧图片");
              this.delImgArr.forEach(item => {
                removeAccessoryImg(item).then(res => {});
              });
            }
            delete this.ruleForm.installationBeforPic;
            delete this.ruleForm.installationAfterPic;
          }
          this.ruleForm.installationOrderId = this.installationOrderId;
          this.ruleForm.designateInstallationId = this.designateInstallationId;
          this.ruleForm.isReport = this.isReport;
          this.loadingBtn = true;
          editInstallationReportContent(this.ruleForm).then(res => {
            if (res.status == "200") {
              this.$message.success("汇报成功");
              this.loadingBtn = false;
              this.$refs["ruleForm"].resetFields();
              this.$emit("close_rep_ok");
            }else{
              this.loadingBtn = false;
            }
          }).catch(error=>{
            this.loadingBtn = false;
            console.error(error);
          })
        } else {
          this.$message.error("检查填写信息");
          return false;
        }
      });
    }
  }
};
</script>
<style scoped lang='scss'>
.reportJournaldia {
  .imgList{
    display: flex;
    flex-wrap: wrap; 
    img{
      width: 100px;
      height: 100px;
      margin-right: 15px;
      margin-bottom: 10px; 
    }
  }
}
</style>

