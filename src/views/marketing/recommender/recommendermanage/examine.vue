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
                <el-option
                  v-for="item in orOptions"
                  :key="item.id"
                  :label="item.dictName"
                  :value="item.id"
                ></el-option>
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
                <el-option
                  v-for="item in brOptions"
                  :key="item.brandId"
                  :label="item.brandName"
                  :value="item.brandId"
                  clearable
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="imginfo">
          <el-form-item label="身份证复印件">
            <ul class="flex_box">
              <li v-for="(file,index) in fileList1" :key="index">
                <img :src="file.fileUrl" alt class="flex_box_img" />
              </li>
            </ul>
          </el-form-item>
        </div>
        <div class="imginfo">
          <el-form-item label="银行卡复印件">
            <ul class="flex_box">
              <li v-for="(file,index) in fileList2" :key="index">
                <img :src="file.fileUrl" alt class="flex_box_img" />
              </li>
            </ul>
          </el-form-item>
        </div>
        <div class="imginfo">
          <el-form-item label="名片印件">
            <ul class="flex_box">
              <li v-for="(file,index) in fileList3" :key="index">
                <img :src="file.fileUrl" alt class="flex_box_img" />
              </li>
            </ul>
          </el-form-item>
        </div>
        <div class="imginfo">
          <el-form-item label="推荐协议">
            <ul class="flex_box">
              <li v-for="(file,index) in fileList4" :key="index">
                <img :src="file.fileUrl" alt class="flex_box_img" />
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
            <el-button type="primary" @click="submitForm('ruleForm2',2,1)" :loading="loadingbtn">通 过</el-button>
            <el-button type="primary" @click="submitForm('ruleForm2',3,0)">驳 回</el-button>
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

import {
  getBrand //获取品牌
} from "@/api/order/recommender/recommender";
import {
  listBaseDict //字典
} from "api/order/order/order";

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import spot from "@/assets/images/spot.png";
export default {
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      loadingbtn:false,
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
      imageUrl: "",
      status: "",

      brOptions: [], //后台获取的品牌数组
      orOptions: [] //后台获取的类型数组
    };
  },

  activated(){
    // 头部面包屑
    this.navList = this.$route.meta;
    this.getBrandList();
    this.referrerId = this.$route.query.referrerId;
    this.ruleForm2.referrerId = this.$route.query.referrerId;
    if (this.referrerId) {
      this.getrecommenderInfo();
    }
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  //   this.getBrandList();
  //   this.referrerId = this.$route.query.referrerId;
  //   this.ruleForm2.referrerId = this.$route.query.referrerId;
  //   if (this.referrerId) {
  //     this.getrecommenderInfo();
  //   }
  // },
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
        this.ruleForm.outsidetReferrerType = String(
          this.ruleForm.outsidetReferrerType
        );

        let arr1 = this.ruleForm.accessoryList.filter(item => {
          return item.dataSourceEnum == "IdCopiesImg";
        });
        this.fileList1 = arr1;

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

    //获取品牌  获取推荐人类型
    getBrandList() {
      getBrand().then(res => {
        if (res.result.length == 0) {
          this.$message.error("获取品牌列表失败");
        } else {
          this.brOptions = res.result;
          
        }
      });

      //
      let data = {
        dataType: "OUTSIDET_REFERRER_TYPE"
      };
      listBaseDict(data).then(res => {
        if (res.status == "200") {
          this.orOptions = res.data;
          this.orOptions = this.orOptions.map(item => {
            return {
              dictName: item.dictName,
              id: String(item.id)
            };
          });
        } else {
          this.$message.error("获取推荐人类型失败");
        }
      });
    },

    //提交审核信息

    /**
     * 确认按钮调两个接口     addReferrerCheckLog   updateReferrerStatus
     *
     * addReferrerCheckLog   {referrerId:referrerId ,operateResult: 2：审核通过；3：驳回', }
     * updateReferrerStatus  {referrerId:referrerId ,status: 0：驳回；1：通过 }
     */
    submitForm(formName, val1, val2) {
      this.status = val2;
      this.ruleForm2.operateResult = val1;
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.updataStatus(this.ruleForm2);
          // addReferrerCheckLog(this.ruleForm2).then(res => {
          //   if (res.status == 200) {
          //     this.$message.success("记录审核信息成功");
              
          //   } else {
          //     this.$message.error("记录审核信息失败");
          //   }
          // });
        } else {
          this.$message.error("请检查填写信息");
          return false;
        }
      });
    },

    //修改状态
    updataStatus(ruleForm2) {
      let data = {
        ...ruleForm2,
        referrerId: this.ruleForm2.referrerId,
        status: this.status,
        workFlowBusinessId:this.$route.query.workFlowBusinessId
      };
      this.loadingbtn = true;
      updateReferrerStatus(data).then(res => {
        if (res.status == 200) {
          this.$message.success("修改审核信息成功");
          this.loadingbtn = false;
          // this.$router.push({
          //   path: "/recommender/recommendermanage"
          // });
          this.$router.go(-1)
        } else {
          this.loadingbtn = false;
          this.$message.error("修改审核信息失败");
        }
      }).catch(error=>{
        this.loadingbtn = false;
        console.error('修改审核信息',error);
        
      })
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
          width: 120px;
          height: 120px;
          border-radius: 8px;
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

