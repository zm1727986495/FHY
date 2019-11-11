<template>
  <div class="reference">
    <el-card>
      <div class="titlecals">推荐人信息</div>
      <el-form :model="ruleForm" ref="ruleForm" label-width="150px" class="formclass">
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="公司">
              <el-input v-model="ruleForm.companyName"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="推荐人姓名" prop="referrerName">
              <el-input v-model="ruleForm.referrerName"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="联系电话" prop="phone">
              <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="推荐人身份证号" prop="idCard">
              <el-input v-model="ruleForm.idCard"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="状态">
              <el-radio v-model="ruleForm.jobState" label="1">在职</el-radio>
              <el-radio v-model="ruleForm.jobState" label="2">离职</el-radio>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="外部推荐人类型" prop="outsidetReferrerType">
              <el-select v-model="ruleForm.outsidetReferrerType" placeholder="请选择类型" class="width-100" clearable>
                <el-option v-for="item in orOptions" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="户名" prop="accountName">
              <el-input v-model="ruleForm.accountName"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="岗位" prop="position">
              <el-input v-model="ruleForm.position"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="账号" prop="accountNumber">
              <el-input v-model="ruleForm.accountNumber"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="开户行" prop="openingBank">
              <el-input v-model="ruleForm.openingBank"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="选择品牌" prop="brandId">
              <el-select v-model="ruleForm.brandId" placeholder="请选择品牌" class="width-100">
                <el-option v-for="item in brOptions" :key="item.brandId" :label="item.brandName" :value="item.brandId" clearable></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="imginfo">
          <el-form-item label="身份证复印件" required>
            <el-upload
              class="avatar-uploader"
              :data="uptoken"
              list-type="picture-card"
              :action="action"
              :accept="accept"
              :on-remove="handleRemove1"
              :on-error="handError"
              :file-list="fileList1"
              :on-success="handleAvatarSuccess1"
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="imginfo">
          <el-form-item label="银行卡复印件" required>
            <el-upload
              class="avatar-uploader"
              :data="uptoken"
              list-type="picture-card"
              :action="action"
              :accept="accept"
              :on-remove="handleRemove2"
              :on-error="handError"
              :file-list="fileList2"
              :on-success="handleAvatarSuccess2"
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="imginfo">
          <el-form-item label="名片附件" required>
            <el-upload
              class="avatar-uploader"
              :data="uptoken"
              list-type="picture-card"
              :action="action"
              :accept="accept"
              :on-remove="handleRemove3"
              :on-error="handError"
              :file-list="fileList3"
              :on-success="handleAvatarSuccess3"
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="imginfo">
          <el-form-item label="推荐协议" required>
            <el-upload
              class="avatar-uploader"
              :data="uptoken"
              list-type="picture-card"
              :action="action"
              :accept="accept"
              :on-remove="handleRemove4"
              :on-error="handError"
              :file-list="fileList4"
              :on-success="handleAvatarSuccess4"
              :before-upload="beforeAvatarUpload"
            >
              <i class="el-icon-plus"></i>
            </el-upload>
          </el-form-item>
        </div>

        <!-- <div class="bottom_btnlist">
          <el-button type="primary" @click="submitForm()">提 交</el-button>
          <el-button @click="backFun">取 消</el-button>
        </div> -->
      </el-form>
    </el-card>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import spot from "@/assets/images/spot.png";
import { getUpToken } from "@/utils/auth";
import {
  listBaseDict //字典
} from "api/order/order/order";
import {
  listReferrerByPage, //查询
  addBrand, //添加推荐人
  getReferrer, //查看推荐人信息
  editReferrer, //编辑外部推荐人
  removeAccessoryImg, //删除图片
  addAccessory, //新增图片
  getBrand //获取品牌
} from "@/api/order/recommender/recommender";
export default {
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      navList: [], //头部面包屑
      ruleForm: {
        accessoryList: [],
        referrerName: "",
        phone: "",
        idCard: "",
        position: "",
        accountNumber: "",
        openingBank: "",
        outsidetReferrerType: "",
        brandId: "",
      },
      uptoken: {
        //上传参数
        token: "",
        key: ""
      },
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      imgShow: "http://file.xczhihui.com/", //文件上传域名
      action: "http://up-z2.qiniup.com",
      accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",
      brOptions: [], //后台获取的品牌数组
      orOptions: [], //后台获取的类型数组
      referrerId: this.recommendid
    };
  },
  props: {
    recommendid:{
      type: String,
      default: ""
    }
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.uptoken.token = getUpToken();
    this.getBrandList();
    // this.referrerId = this.$route.query.referrerId;
    console.log(this.referrerId);
    if (this.referrerId !== '') {
      this.$message.info("请修改推荐人信息");
      this.getrecommenderInfo();
    }
  },
  methods: {
    checking(){
      if(this.ruleForm.referrerName === ""){
        this.$message.error("请输入推荐人姓名");
        return false
      }
      if(this.ruleForm.phone === ""){
        this.$message.error("请输入联系电话");
        return false
      }
      if(this.ruleForm.idCard === ""){
        this.$message.error("请输入推荐人身份证号");
        return false
      }
      if(this.ruleForm.accountName === ""){
        this.$message.error("请输入户名");
        return false
      }
      if(this.ruleForm.position === ""){
        this.$message.error("请输入岗位");
        return false
      }
      if(this.ruleForm.accountNumber === ""){
        this.$message.error("请输入账号");
        return false
      }
      if(this.ruleForm.openingBank === ""){
        this.$message.error("请输入开户行");
        return false
      }
      if(this.ruleForm.outsidetReferrerType === ""){
        this.$message.error("请选择推荐人类型");
        return false
      }
      if(this.ruleForm.brandId === ""){
        this.$message.error("请选择品牌");
        return false
      }
      if (this.fileList1.length == 0) {
        this.$message.error("请上传身份证复印件");
        return false;
      }
      if (this.fileList2.length == 0) {
        this.$message.error("请上传银行卡复印件");
        return false;
      }
      if (this.fileList3.length == 0) {
        this.$message.error("请上传名片附件");
        return false;
      }
      if (this.fileList4.length == 0) {
        this.$message.error("请上传推荐协议");
        return false;
      }
      return true
    },
    //获取品牌  获取推荐人类型
    getBrandList() {
      getBrand().then(res => {
        if (res.result.length == 0) {
          this.$message.error("获取品牌列表失败");
        } else {
          this.brOptions = res.result;
        }
      });
      let data = {
        dataType: "OUTSIDET_REFERRER_TYPE"
      };
      listBaseDict(data).then(res => {
        if (res.status == "200") {
          this.orOptions = res.data;
        } else {
          this.$message.error("获取推荐人类型失败");
        }
      });
    },
    //根据推荐人id获取推荐人信息
    getrecommenderInfo() {
      let data = {
        referrerId: this.referrerId
      };
      getReferrer(data).then(res => {
        this.ruleForm = res.data;
        this.ruleForm.brandId = String(this.ruleForm.brandId);
        this.ruleForm.jobState = String(this.ruleForm.jobState);

        console.log(this.ruleForm.accessoryList);
        let arr1 = this.ruleForm.accessoryList.filter(item => {
          return item.dataSourceEnum == "IdCopiesImg";
        });
        this.fileList1 = arr1.map(item => {
          return {
            ...item,
            url: item.fileUrl
          };
        });
        let arr2 = this.ruleForm.accessoryList.filter(item => {
          return item.dataSourceEnum == "BankcardCopiesImg";
        });
        this.fileList2 = arr2.map(item => {
          return {
            ...item,
            url: item.fileUrl
          };
        });

        let arr3 = this.ruleForm.accessoryList.filter(item => {
          return item.dataSourceEnum == "VCardCopiesImg";
        });
        this.fileList3 = arr3.map(item => {
          return {
            ...item,
            url: item.fileUrl
          };
        });

        let arr4 = this.ruleForm.accessoryList.filter(item => {
          return item.dataSourceEnum == "ProtocolImg";
        });
        this.fileList4 = arr4.map(item => {
          return {
            ...item,
            url: item.fileUrl
          };
        });

        console.log("过滤");
        console.log(this.fileList1);
        JSON.parse(JSON.stringify(this.fileList1).replace(/fileUrl/g, "url"));
      });
    },

    // 发送按钮
    submitForm() {
      this.ruleForm.referrerStatus = 1; //根据按钮代表的状态  选择保存还是提交
      if(this.checking()){
        if (this.referrerId !== '') {
          delete this.ruleForm.accessoryList;
          console.log(this.ruleForm);
          // 修改推荐人信息
          editReferrer(this.ruleForm).then(res => {
            if (res.status == 200) {
              this.$message.success("修改推荐人信息成功");
              this.$router.push({
                path: "recommendermanage"
              });
            } else {
              this.$message.error("修改失败");
            }
          });
        } else {
          //添加推荐人
          this.addfileList(); //处理文件
          return new Promise((rev,rej)=>{
            addBrand(this.ruleForm).then(res => {
              if (res.status == 200) {
                this.$message.success("添加推荐人成功");
                rev(res.data)
              } else {
                this.$message.error("添加推荐人失败");
              }
            });
          })
        }
      }
    },

    //新增推荐人处理文件信息
    addfileList() {
      console.log(this.fileList1);

      let arr1 = this.fileList1.map(file => {
        return {
          dataSourceEnum: "IdCopiesImg",
          fileUrl: this.imgShow + file.response.key
        };
      });

      let arr2 = this.fileList2.map(file => {
        return {
          dataSourceEnum: "BankcardCopiesImg",
          fileUrl: this.imgShow + file.response.key
        };
      });

      let arr3 = this.fileList3.map(file => {
        return {
          dataSourceEnum: "VCardCopiesImg",
          fileUrl: this.imgShow + file.response.key
        };
      });

      let arr4 = this.fileList4.map(file => {
        return {
          dataSourceEnum: "ProtocolImg",
          fileUrl: this.imgShow + file.response.key
        };
      });

      this.ruleForm.accessoryList = [];
      this.ruleForm.accessoryList = this.ruleForm.accessoryList.concat(arr1);
      this.ruleForm.accessoryList = this.ruleForm.accessoryList.concat(arr2);
      this.ruleForm.accessoryList = this.ruleForm.accessoryList.concat(arr3);
      this.ruleForm.accessoryList = this.ruleForm.accessoryList.concat(arr4);
      console.log(this.ruleForm.accessoryList);
    },

    //取消按钮
    backFun() {
      this.$router.go(-1);
    },
    //文件上传前操作
    beforeAvatarUpload(file) {
      //console.log(this.imgShow+file.lastModified+".jpg");
      this.uptoken.key = `${file.lastModified}.jpg`;
    },
    //文件删除操作
    handleRemove1(file, fileList) {
      if (this.referrerId !== '') {
        let data = {
          accessoryId: file.accessoryId,
          dataSourceId: file.dataSourceId,
          dataSourceEnum: file.dataSourceEnum
        };
        removeAccessoryImg(data).then(res => {
          if (res.status == "200") {
            this.$message.success("删除图片成功");
          } else {
            this.$message.error("删除图片失败");
          }
        });
      } else {
        this.fileList1 = fileList;
      }
    },
    handleRemove2(file, fileList) {
      if (this.referrerId !== '') {
        let data = {
          accessoryId: file.accessoryId,
          dataSourceId: file.dataSourceId,
          dataSourceEnum: file.dataSourceEnum
        };
        removeAccessoryImg(data).then(res => {
          if (res.status == "200") {
            this.$message.success("删除图片成功");
          } else {
            this.$message.error("删除图片失败");
          }
        });
      } else {
        this.fileList2 = fileList;
      }
    },
    handleRemove3(file, fileList) {
      if (this.referrerId !== '') {
        let data = {
          accessoryId: file.accessoryId,
          dataSourceId: file.dataSourceId,
          dataSourceEnum: file.dataSourceEnum
        };
        removeAccessoryImg(data).then(res => {
          if (res.status == "200") {
            this.$message.success("删除图片成功");
          } else {
            this.$message.error("删除图片失败");
          }
        });
      } else {
        this.fileList3 = fileList;
      }
    },
    handleRemove4(file, fileList) {
      if (this.referrerId !== '') {
        let data = {
          accessoryId: file.accessoryId,
          dataSourceId: file.dataSourceId,
          dataSourceEnum: file.dataSourceEnum
        };
        removeAccessoryImg(data).then(res => {
          if (res.status == "200") {
            this.$message.success("删除图片成功");
          } else {
            this.$message.error("删除图片失败");
          }
        });
      } else {
        this.fileList4 = fileList;
      }
    },

    //文件上传失败
    handError(err) {
      this.$message.error("文件上传失败，可尝试退出登录重新操作");
    },

    //文件成功操作  //addAccessory编辑的新增接口
    handleAvatarSuccess1(res, file, fileList) {
      if (this.referrerId !== '') {
        // 编辑
        let data = {
          dataSourceEnum: "IdCopiesImg",
          dataSourceId: this.referrerId,
          fileUrl: this.imgShow + res.key
        };
        addAccessory(data).then(res => {
          console.log(res);
          if (res.status == "200") {
            this.$message.success("图片上传成功");
          } else {
            this.$message.error("图片上传失败");
          }
        });
      } else {
        // 新增
        this.fileList1 = fileList;
      }
    },
    handleAvatarSuccess2(res, file, fileList) {
      if (this.referrerId !== '') {
        let data = {
          dataSourceEnum: "BankcardCopiesImg",
          dataSourceId: this.referrerId,
          fileUrl: this.imgShow + res.key
        };
        addAccessory(data).then(res => {
          console.log(res);
          if (res.status == "200") {
            this.$message.success("图片上传成功");
          } else {
            this.$message.error("图片上传失败");
          }
        });
      } else {
        this.fileList2 = fileList;
      }
    },
    handleAvatarSuccess3(res, file, fileList) {
      if (this.referrerId !== '') {
        let data = {
          dataSourceEnum: "VCardCopiesImg",
          dataSourceId: this.referrerId,
          fileUrl: this.imgShow + res.key
        };
        addAccessory(data).then(res => {
          console.log(res);
          if (res.status == "200") {
            this.$message.success("图片上传成功");
          } else {
            this.$message.error("图片上传失败");
          }
        });
      } else {
        this.fileList3 = fileList;
      }
    },
    handleAvatarSuccess4(res, file, fileList) {
      if (this.referrerId !== '') {
        let data = {
          dataSourceEnum: "ProtocolImg",
          dataSourceId: this.referrerId,
          fileUrl: this.imgShow + res.key
        };
        addAccessory(data).then(res => {
          console.log(res);
          if (res.status == "200") {
            this.$message.success("图片上传成功");
          } else {
            this.$message.error("图片上传失败");
          }
        });
      } else {
        this.fileList4 = fileList;
      }
    }
  }
};
</script>
<style scoped lang='scss'>
.reference {
  .formclass {
    padding: 10px 50px;
    .infoform {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      .infoform_item {
        width: 40%;
      }
    }
    .imginfo {
    }

    .bottom_btnlist {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      // border: 1px solid red;
    }
  }
  .titlecals{
      top: 0;
  }
}
</style>

