<template>
  <div class="addrecommender">
    <div class="head_nav">
      <!-- 导航栏 -->
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="formclass">
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="公司" prop="companyName">
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
              <el-input v-model="ruleForm.phone" oninput="value=value.replace(/[^\d]/g,'')"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="推荐人身份证号" prop="idCard">
              <el-input v-model="ruleForm.idCard" maxlength="18"></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="状态" prop="jobState">
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
            <!-- prop="brandId" -->
            <el-form-item label="选择品牌">
              <el-select v-model="ruleForm.brandId" placeholder="请选择品牌" class="width-100">
                <el-option v-for="item in brOptions" :key="item.brandId" :label="item.brandName" :value="item.brandId" clearable></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="imginfo">
          <el-form-item label="身份证复印件">
            <el-upload multiple list-type="picture-card" class="upload-demo" action="string" :accept="accept" 
            :http-request="uploadSectionFile1" :file-list="fileList1" :on-remove="handleRemove1">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="imginfo">
          <el-form-item label="银行卡复印件">
            <el-upload multiple list-type="picture-card" class="upload-demo" action="string" :accept="accept" 
            :http-request="uploadSectionFile2" :file-list="fileList2" :on-remove="handleRemove2">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="imginfo">
          <el-form-item label="名片附件">
            <el-upload multiple list-type="picture-card" class="upload-demo" :accept="accept" action="string" 
            :http-request="uploadSectionFile3" :file-list="fileList3" :on-remove="handleRemove3">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="imginfo">
          <el-form-item label="推荐协议">
            <el-upload multiple list-type="picture-card" class="upload-demo" action="string" :http-request="uploadSectionFile4"
              :accept="accept" :file-list="fileList4" :on-remove="handleRemove4">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>

        <div class="bottom_btnlist">
          <el-button type="primary" @click="submitForm('ruleForm',0)" v-if="!referrerId">保 存</el-button>
          <el-button type="primary" @click="submitForm('ruleForm',4)">提 交</el-button>
          <el-button @click="backFun">取 消</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { put } from "@/utils/pubilcFn";
import { getUUID } from "api/pulicJava"; //生成编码

import spot from "@/assets/images/spot.png";
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
        accessoryList: []
      },

      rules: {
        companyName: [
          { required: true, message: "请输入公司名称", trigger: "blur" }
        ],
        referrerName: [
          { required: true, message: "请输入推荐人姓名", trigger: "blur" }
        ],
        phone: [{ required: true, message: "请输入联系电话", trigger: "blur" }],
        // idCard: [
        //   { required: true, message: "请输入推荐人身份证号", trigger: "blur" }
        // ],
        // accountName: [
        //   { required: true, message: "请输入户名", trigger: "blur" }
        // ],
        // position: [{ required: true, message: "请输入岗位", trigger: "blur" }],
        // accountNumber: [
        //   { required: true, message: "请输入账号", trigger: "blur" }
        // ],
        // openingBank: [
        //   { required: true, message: "请输入开户行", trigger: "blur" }
        // ],
        // jobState : [
        //   { required: true, message: '请选择状态', trigger: 'change' }
        // ],
        // outsidetReferrerType: [
        //   { required: true, message: "请选择推荐人类型", trigger: "change" }
        // ],
        // brandId: [{ required: true, message: "请选择品牌", trigger: "change" }]
      },

      fileList1: [],
      imgArr1: [],
      fileList2: [],
      imgArr2: [],
      fileList3: [],
      imgArr3: [],
      fileList4: [],
      imgArr4: [],

      delImgArr: [],
      accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",

      referrerId: "", //推荐人id
      brOptions: [], //后台获取的品牌数组
      orOptions: [] //后台获取的类型数组
    };
  },

  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.getBrandList();
    this.referrerId = this.$route.query.referrerId;
    if (this.referrerId) {
      this.getrecommenderInfo();
    }
  },
  methods: {
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
      });
    },

    // 发送按钮
    submitForm(formName, val) {
      console.log(this.ruleForm);
      this.ruleForm.referrerStatus = val; //根据按钮代表的状态  选择保存还是提交
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.referrerId) {
            this.editfileList();
            delete this.ruleForm.accessoryList;
            console.log(this.ruleForm);
            this.ruleForm.workFlowBusinessId=this.$route.query.workFlowBusinessId
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
            // if ( this.imgArr1.length == 0 || this.imgArr2.length == 0 || this.imgArr3.length == 0 || this.imgArr4.length == 0) {
            //   this.$message.error("请上传图片");
            //   return;
            // }
            //添加推荐人
            this.addfileList(); //处理文件
            new Promise((resolve, reject) => {
              getUUID({ serialNumber: "RR" }).then(res => {
                resolve(res);
              });
            }).then(res => {
              this.ruleForm.applySn = res.data;
              addBrand(this.ruleForm).then(res => {
                if (res.status == 200) {
                  this.$message.success("添加推荐人成功");
                  this.$router.push({
                    path: "recommendermanage"
                  });
                } else {
                  this.$message.error(res.message);
                }
              });
            });
          }
        } else {
          this.$message.error("请检查填写信息");
          return false;
        }
      });
    },

    //新增推荐人处理文件信息
    addfileList() {
      let arr1 = this.imgArr1.map(file => {
        return {
          dataSourceEnum: "IdCopiesImg",
          fileUrl: file.url,
          sourceName: file.name
        };
      });

      let arr2 = this.imgArr2.map(file => {
        return {
          dataSourceEnum: "BankcardCopiesImg",
          fileUrl: file.url,
          sourceName: file.name
        };
      });

      let arr3 = this.imgArr3.map(file => {
        return {
          dataSourceEnum: "VCardCopiesImg",
          fileUrl: file.url,
          sourceName: file.name
        };
      });

      let arr4 = this.imgArr4.map(file => {
        return {
          dataSourceEnum: "ProtocolImg",
          fileUrl: file.url,
          sourceName: file.name
        };
      });

      this.ruleForm.accessoryList = [];
      this.ruleForm.accessoryList = this.ruleForm.accessoryList.concat(arr1);
      this.ruleForm.accessoryList = this.ruleForm.accessoryList.concat(arr2);
      this.ruleForm.accessoryList = this.ruleForm.accessoryList.concat(arr3);
      this.ruleForm.accessoryList = this.ruleForm.accessoryList.concat(arr4);
      console.log(this.ruleForm.accessoryList);
    },
    //编辑推荐人处理文件信息
    editfileList() {
      if (this.imgArr1.length > 0) {
        this.imgArr1
          .map(item => {
            return {
              fileUrl: item.url,
              sourceName: item.name
            };
          })
          .forEach(item => {
            let query = {
              dataSourceEnum: "IdCopiesImg",
              dataSourceId: this.referrerId,
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
            let query = {
              dataSourceEnum: "BankcardCopiesImg",
              dataSourceId: this.referrerId,
              ...item
            };
            addAccessory(query).then(res => {});
          });
      }

      if (this.imgArr3.length > 0) {
        this.imgArr3
          .map(item => {
            return {
              fileUrl: item.url,
              sourceName: item.name
            };
          })
          .forEach(item => {
            let query = {
              dataSourceEnum: "VCardCopiesImg",
              dataSourceId: this.referrerId,
              ...item
            };
            addAccessory(query).then(res => {});
          });
      }

      if (this.imgArr4.length > 0) {
        this.imgArr4
          .map(item => {
            return {
              fileUrl: item.url,
              sourceName: item.name
            };
          })
          .forEach(item => {
            let query = {
              dataSourceEnum: "ProtocolImg",
              dataSourceId: this.referrerId,
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
    },

    //取消按钮
    backFun() {
      this.$router.go(-1);
    },

    //文件删除操作
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
    handleRemove3(file, fileList) {
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
        this.imgArr3 = this.imgArr3.filter(item => {
          let str = item.name.substring(0, lengs);
          return str !== String(file.raw.uid);
        });
      }
    },
    handleRemove4(file, fileList) {
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
        this.imgArr4 = this.imgArr4.filter(item => {
          let str = item.name.substring(0, lengs);
          return str !== String(file.raw.uid);
        });
      }
    },

    //文件成功操作  //addAccessory编辑的新增接口
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

    uploadSectionFile3(res) {
      put(res).then(data => {
        this.imgArr3.push(data);
      });
    },

    uploadSectionFile4(res) {
      put(res).then(data => {
        this.imgArr4.push(data);
      });
    }

    // handleAvatarSuccess1(res, file, fileList) {
    //   if (this.referrerId) {
    //     // 编辑
    //     let data = {
    //       dataSourceEnum: "IdCopiesImg",
    //       dataSourceId: this.referrerId,
    //       fileUrl: this.imgShow + res.key
    //     };
    //     addAccessory(data).then(res => {
    //       console.log(res);
    //       if (res.status == "200") {
    //         this.$message.success("图片上传成功");
    //       } else {
    //         this.$message.error("图片上传失败");
    //       }
    //     });
    //   } else {
    //     // 新增
    //     this.fileList1 = fileList;
    //   }
    // },
    // handleAvatarSuccess2(res, file, fileList) {
    //   if (this.referrerId) {
    //     let data = {
    //       dataSourceEnum: "BankcardCopiesImg",
    //       dataSourceId: this.referrerId,
    //       fileUrl: this.imgShow + res.key
    //     };
    //     addAccessory(data).then(res => {
    //       console.log(res);
    //       if (res.status == "200") {
    //         this.$message.success("图片上传成功");
    //       } else {
    //         this.$message.error("图片上传失败");
    //       }
    //     });
    //   } else {
    //     this.fileList2 = fileList;
    //   }
    // },
    // handleAvatarSuccess3(res, file, fileList) {
    //   if (this.referrerId) {
    //     let data = {
    //       dataSourceEnum: "VCardCopiesImg",
    //       dataSourceId: this.referrerId,
    //       fileUrl: this.imgShow + res.key
    //     };
    //     addAccessory(data).then(res => {
    //       console.log(res);
    //       if (res.status == "200") {
    //         this.$message.success("图片上传成功");
    //       } else {
    //         this.$message.error("图片上传失败");
    //       }
    //     });
    //   } else {
    //     this.fileList3 = fileList;
    //   }
    // },
    // handleAvatarSuccess4(res, file, fileList) {
    //   if (this.referrerId) {
    //     let data = {
    //       dataSourceEnum: "ProtocolImg",
    //       dataSourceId: this.referrerId,
    //       fileUrl: this.imgShow + res.key
    //     };
    //     addAccessory(data).then(res => {
    //       console.log(res);
    //       if (res.status == "200") {
    //         this.$message.success("图片上传成功");
    //       } else {
    //         this.$message.error("图片上传失败");
    //       }
    //     });
    //   } else {
    //     this.fileList4 = fileList;
    //   }
    // }
  }
};
</script>
<style scoped lang='scss'>
.addrecommender {
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
    }

    .bottom_btnlist {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: center;
      // border: 1px solid red;
    }
  }
}
</style>

