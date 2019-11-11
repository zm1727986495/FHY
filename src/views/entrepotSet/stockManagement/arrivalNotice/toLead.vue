<template>
  <div>
    <div>
      <el-form
        :model="bindInfo"
        :rules="rules"
        ref="ruleForm"
        label-width="120px"
        class="form_class"
      >
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="到货单号" prop="arrivalNoticeCode">
              <el-input v-model="bindInfo.arrivalNoticeCode"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="品牌" prop="brandId">
              <el-select clearable filterable v-model="bindInfo.brandId" placeholder="请选择">
                <el-option
                  v-for="item in brandList"
                  :key="item.brandId"
                  :label="item.brandName"
                  :value="item.brandId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="品类" prop="categoryId">
              <el-select clearable filterable v-model="bindInfo.categoryId" placeholder="请选择">
                <el-option
                  v-for="item in categoryList"
                  :key="item.commodityCategoryId"
                  :label="item.categoryName"
                  :value="item.commodityCategoryId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="入货仓库" prop="storageId">
              <el-select clearable filterable v-model="bindInfo.storageId" placeholder="请选择">
                <el-option
                  v-for="item in warehouseList"
                  :key="item.storageId"
                  :label="item.storageName"
                  :value="item.storageId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="商场码" prop="market">
              <el-input v-model="bindInfo.market" placeholder="商场码" style="width:100%"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="到货方式" prop="type">
              <el-radio v-model="bindInfo.type" label="0">自提</el-radio>
              <el-radio v-model="bindInfo.type" label="1">非自提</el-radio>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div>
            <el-form-item>
              <el-button size="small" class="button-96" @click="selectTemplate">选择模板</el-button>
              <span>模板名称： {{templateName}}</span>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <el-form-item label="上传到货单" prop="uploadText">
            <div class="uploads">
              <div class="uploadarrival m-right20">
                <el-input v-model="bindInfo.uploadText" disabled></el-input>
              </div>
              <div class="browse">
                <el-upload
                  multiple
                  class="upload-demo"
                  action="string"
                  accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  :http-request="uploadSectionFile"
                  :before-upload="beforeAvatarUpload"
                >
                  <!-- accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" -->
                  <el-button size="small" class="button-96">浏览</el-button>
                </el-upload>
                <el-button :loading="loading" size="small" class="button-96 m-left10" @click="uploading">上传</el-button>
              </div>
            </div>
          </el-form-item>
        </div>
      </el-form>
    </div>
    <el-dialog
      append-to-body
      title="模板下载"
      :visible.sync="down"
      width="900px"
      custom-class="customDialogTitle"
    >
      <download
        :bindInfo="bindInfo"
        :isShow="false"
        ref="download"
        v-if="down"
        :checklist="checklist"
      ></download>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="confirmFun">确 定</el-button>
        <el-button @click="down = false">取 消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import {
  listCompanyByAll,
  listBrand,
  listCategory,
  getStorageList,
  importArrivalNotice,
  importArrivalNoticeGuJia,
  getByArrivalNoticeCode
} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";

import download from "./downLoad";
import { put } from "@/utils/pubilcFn";
export default {
  components: {
    download
  },
  data() {
    return {
      supplierList: [], //供应商
      bindInfo: {
        uploadText: "",
        type: "1"
      },
      loading: false, //加载中
      brandList: [], //品牌
      categoryList: [], //品类
      warehouseList: [], //入货仓库
      brand: "",
      upLoadList: "",
      rules: {
        uploadText: [
          { required: true, message: "请上传文件", trigger: "blur" }
        ],
        arrivalNoticeCode: [
          { required: true, message: "请输入到货单", trigger: "blur" }
        ],
        supplierId: [
          { required: true, message: "请选择供应商", trigger: "change" }
        ],
        brandId: [{ required: true, message: "请选择品牌", trigger: "change" }],
        categoryId: [
          { required: true, message: "请选择品类", trigger: "change" }
        ],
        storageId: [
          { required: true, message: "请选择仓库", trigger: "change" }
        ],
        market: [{ required: false, message: "请输入商场码", trigger: "blur" }],
        type: [{ required: true, message: "请选择到货方式", trigger: "change" }]
      },
      lengs: "",
      down: false, //选择模板弹框
      checklist: true, //状态
      templateArr: [],
      templateName: ""
    };
  },
  created() {
    this.getSupplier();
    this.getBrand();
    this.getCategory();
    this.getWarehouse();
  },
  mounted() {},
  methods: {
    //获取供应商
    getSupplier() {
      let data = {
        companyType: "0"
      };
      listCompanyByAll(data)
        .then(res => {
          this.supplierList = res.data;
        })
        .catch(error => {
          console.error("获取供应商", error);
        });
    },
    //获取品牌
    getBrand() {
      listBrand()
        .then(res => {
          this.brandList = res.data;
        })
        .catch(error => {
          console.error("获取品牌", error);
        });
    },
    //获取品类
    getCategory() {
      listCategory()
        .then(res => {
          this.categoryList = res.data;
        })
        .catch(error => {
          console.error("获取品类", error);
        });
    },
    //获取仓库
    getWarehouse() {
      getStorageList()
        .then(res => {
          this.warehouseList = res.data;
        })
        .catch(error => {
          console.error("获取仓库", error);
        });
    },
    //上传接口
    importgoods() {
      this.loading = true;
      let data = {
        ...this.bindInfo,
        type: this.bindInfo.type,
        fileUrl: this.upLoadList,
        aogId: this.templateArr[0].aogId
      };
      if (this.bindInfo.brandId == 2) {
        importArrivalNoticeGuJia(data)
          .then(res => {
            if (res.status == 200) {
              this.loading = false;
              this.$router.push({
                path: "message",
                query: {
                  arrivalNoticeId: String(res.data.arrivalNoticeId),
                  supplierId: String(this.bindInfo.supplierId),
                  brandId: String(this.bindInfo.brandId),
                  categoryId: String(this.bindInfo.categoryId),
                  aogId: this.templateArr[0].aogId,
                  brandId: this.bindInfo.brandId,
                  storageId: this.bindInfo.storageId
                }
              });
            } else {
              this.loading = false;
              this.$message.error(res.message);
            }
          })
          .catch(error => {
            this.loading = false;
            console.error("导入顾家", error);
          });
      } else {
        importArrivalNotice(data)
          .then(res => {
            if (res.status == 200) {
              this.loading = false;
              this.$router.push({
                path: "message",
                query: {
                  arrivalNoticeId: String(res.data.arrivalNoticeId),
                  supplierId: String(this.bindInfo.supplierId),
                  brandId: String(this.bindInfo.brandId),
                  categoryId: String(this.bindInfo.categoryId),
                  aogId: this.templateArr[0].aogId,
                  storageId: this.bindInfo.storageId
                }
              });
            } else {
              this.loading = false;
              this.$message.error(res.message);
            }
          })
          .catch(error => {
            this.loading = false;
            console.error("上传到货单", error);
          });
      }
    },
    //上传跳转
    uploading() {
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          let data = {
            arrivalNoticeCode: this.bindInfo.arrivalNoticeCode
          };
          getByArrivalNoticeCode(data).then(res => {
            if (res.status == 200) {
              this.importgoods();
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          this.$message.error("检查填写信息");
          return false;
        }
      });
    },
    //选择模板
    selectTemplate() {
      if (!this.bindInfo.brandId) {
        this.$message.error("还没有选择品牌");
      } else if (!this.bindInfo.categoryId) {
        this.$message.error("还没有选择品类");
      } else {
        this.down = true;
      }
    },
    //模板弹框确认
    confirmFun() {
      if (this.$refs.download.choseArr.length < 1) {
        this.$message.warning("只少勾选一个模板!");
        this.down = true;
      } else if (this.$refs.download.choseArr.length > 1) {
        this.$message.warning("只能勾选一个模板!");
        this.down = true;
      } else {
        this.templateArr = this.$refs.download.choseArr;
        this.templateName = this.$refs.download.choseArr[0].aogName;
        this.down = false;
      }
    },
    //上传文件
    uploadSectionFile(res) {
      put(res).then(data => {
        this.upLoadList = data.url;
        this.bindInfo.uploadText = data.name.substring(this.lengs);
      });
    },
    //上传之前
    beforeAvatarUpload(file) {
      this.lengs = String(file.lastModified).length;
      // const isxls =
      //   file.type == "application/vnd.ms-excel" ||
      //   file.type ==
      //     "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
      const isLt2M = file.size / 1024 / 1024 < 100;

      // if (!isxls) {
      //   // this.$message.error("上文件只能是 xls 格式!");
      //   return isxls;
      // }
      if (!isLt2M) {
        this.$message.error("上文件大小不能超过 100MB!");
        return isLt2M;
      }
    }
  }
};
</script>
<style scoped lang='scss'>
.uploads {
  display: flex;
}
.browse {
  display: flex;
  align-items: center;
}
.form_class {
  width: 90%;
  .infoform {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .infoform_item {
      width: 50%;
    }
  }
}
.el-upload-list--text {
  display: none;
}
.uploadarrival {
  width: 217px;
  display: inline-block;
}
.clearfloat:after {
  display: block;
  clear: both;
  content: "";
  visibility: hidden;
  height: 0;
}
.clearfloat {
  zoom: 1;
}
.formList {
  width: 100%;
}
.formList > li > span {
  display: flex;
  min-width: 100px;
  flex-direction: row-reverse;
  align-items: center;
}
.formList > li {
  width: 50%;
  float: left;
  margin-bottom: 20px;
  display: flex;
  /* justify-content: center;
        align-items: center; */
}
.formList > li:nth-last-child(1) {
  width: 100%;
}
</style>
