<template>
  <!-- 审核推荐人 -->
  <div class="examine">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <el-form :model="ruleForm" label-width="150px" class="formclass">
        <div class="iconBox m-bottom40">
          <i class="Icon"></i>
          <span>推荐人信息</span>
        </div>
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="公司">
              <el-input v-model="ruleForm.companyName"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="推荐人姓名">
              <el-input v-model="ruleForm.referrerName"></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="联系电话">
              <el-input v-model="ruleForm.phone"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="推荐人身份证号">
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
            <el-form-item label="外部推荐人类型">
              <el-select
                v-model="ruleForm.outsidetReferrerType"
                placeholder="请选择类型"
                class="width-100"
              >
                <el-option label="家装工长" value="0"></el-option>
                <el-option label="家装设计师" value="1"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="户名">
              <el-input v-model="ruleForm.accountName"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="岗位">
              <el-input v-model="ruleForm.position"></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="账号">
              <el-input v-model="ruleForm.accountNumber"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="开户行">
              <el-input v-model="ruleForm.openingBank"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="选择品牌" prop="brandId">
              <el-select v-model="ruleForm.brandId" placeholder="请选择品牌" class="width-100">
                <el-option label="品牌1" value="0"></el-option>
                <el-option label="品牌2" value="1"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="imginfo">
          <el-form-item label="身份证复印件">
            <ul class="flex_box">
              <li v-for="(file,index) in fileList1" :key="index">
                <img :src="file.fileUrl" alt class="flex_box_img">
              </li>
            </ul>
          </el-form-item>
        </div>
        <div class="imginfo">
          <el-form-item label="银行卡复印件">
            <ul class="flex_box">
              <li v-for="(file,index) in fileList2" :key="index">
                <img :src="file.fileUrl" alt class="flex_box_img">
              </li>
            </ul>
          </el-form-item>
        </div>
        <div class="imginfo">
          <el-form-item label="名片印件">
            <ul class="flex_box">
              <li v-for="(file,index) in fileList3" :key="index">
                <img :src="file.fileUrl" alt class="flex_box_img">
              </li>
            </ul>
          </el-form-item>
        </div>
        <div class="imginfo">
          <el-form-item label="推荐协议">
            <ul class="flex_box">
              <li v-for="(file,index) in fileList4" :key="index">
                <img :src="file.fileUrl" alt class="flex_box_img">
              </li>
            </ul>
          </el-form-item>
        </div>
      </el-form>

      <div class="formclass_bot">
        <div class="iconBox m-bottom40">
          <i class="Icon"></i>
          <span>审核信息</span>
        </div>
        <el-form
          :model="ruleForm2"
          :rules="rules2"
          ref="ruleForm2"
          label-width="150px"
          class="formclass_bot"
        >
          <el-form-item label="审核意见" prop="remark">
            <el-input v-model="ruleForm2.remark" type="textarea"></el-input>
          </el-form-item>

          <div class="bottom_btnlist">
            <el-button type="primary" @click="submitForm('ruleForm2',2)">通 过</el-button>
            <el-button type="primary" @click="submitForm('ruleForm2',3)">驳 回</el-button>
            <el-button @click="backFun">返 回</el-button>
          </div>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script>
import {
  getReferrer, //获取推荐人信息
  addReferrerCheckLog, //添加审核记录
  updateReferrerStatus //修改信息表审核状态
} from "@/api/administrationCenter/outrecommender/outrecommender";

import pagination from "../../../components/pagination";
import breadcrumb from "../../../components/breadcrumb";
import spot from "@/assets/images/spot.png";
export default {
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      navList: [], //头部面包屑
      ruleForm: {},
      fileList1: [],
      fileList2: [],
      fileList3: [],
      fileList4: [],
      ruleForm2: {},
      rules2: {
        remark: [{ required: true, message: "请输入审核信息", trigger: "blur" }]
      },
      imageUrl: ""
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.referrerId = this.$route.query.referrerId;
    this.ruleForm2.referrerId = this.$route.query.referrerId;
    this.ruleForm2.operateType = "审核";
    if (this.referrerId) {
      this.getrecommenderInfo();
    }
  },
  methods: {
    //根据推荐人id获取推荐人信息
    getrecommenderInfo() {
      let data = {
        referrerId: this.referrerId
      };
      getReferrer(data).then(res => {
        this.ruleForm = res.data;
        this.ruleForm.brandId = String(this.ruleForm.brandId);
        this.ruleForm.jobState = String(this.ruleForm.jobState);

        let arr1 = this.ruleForm.accessoryList.filter(item => {
          return item.dataSourceEnum == "IdCopiesImg";
        });
        this.fileList1 = arr1;
        console.log("---");
        console.log(this.fileList1);
        

        let arr2 = this.ruleForm.accessoryList.filter(item => {
          return item.dataSourceEnum == "BankcardCopiesImg";
        });
        this.fileList2 = arr2;

        let arr3 = this.ruleForm.accessoryList.filter(item => {
          return item.dataSourceEnum == "VCardCopiesImg";
        });
        this.fileList3 = arr3;

        let arr4 = this.ruleForm.accessoryList.filter(item => {
          return item.dataSourceEnum == "ProtocolImg";
        });
        this.fileList4 = arr4;
      });
    },

    //提交审核信息
    submitForm(formName, val) {
      this.ruleForm2.operateResult = val;
      this.$refs[formName].validate(valid => {
        if (valid) {
          console.log(this.ruleForm2);
          addReferrerCheckLog(this.ruleForm2).then(res => {
            if (res.status == 200) {
              this.$message.success("记录审核信息成功");
              this.updataStatus();
            } else {
              this.$message.error("记录审核信息失败");
            }
          });
        } else {
          this.$message.error("请检查填写信息");
          return false;
        }
      });
    },

    //修改状态
    updataStatus() {
      let data = {
        referrerId: this.ruleForm2.referrerId,
        referrerStatus: this.ruleForm2.operateResult
      };

      updateReferrerStatus(data).then(res => {
        if (res.status == 200) {
          this.$message.success("修改审核信息成功");
          this.$router.push({
            path: "auditlist"
          });
        } else {
          this.$message.error("修改审核信息失败");
        }
      });
    },

    //取消按钮
    backFun() {
      this.$router.go(-1);
    },

    handleAvatarSuccess() {},
    beforeAvatarUpload() {}
  }
};
</script>
<style scoped lang='scss'>
.examine {
  .formclass {
    width: 75%;
    .infoform {
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      .infoform_item {
        width: 50%;
      }
    }
    .imginfo {
      .flex_box {
        display: flex;
        flex-wrap: wrap;
        .flex_box_img {
          margin: 5px 5px;
          display: inline;
          width: 160px;
          height: 100px;
        }
      }
    }
  }
  .bottom_btnlist {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    // border: 1px solid red;
  }
  .formclass_bot {
    width: 95%;
  }
}
</style>

