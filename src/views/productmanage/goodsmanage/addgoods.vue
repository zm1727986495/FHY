<template>
  <div class="wrapper addgodds">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- <div class='newHeader'>新增商品</div> -->
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="新增商品" name="first"></el-tab-pane>
        <!-- <el-card class="m-bottom"> -->
        <div class="iconBox">
          <i class="Icon"></i>
          <span>基本信息</span>
        </div>
        <div class="information">
          <div class="collapse_cell_div">
            <div class="collapse_input_cell_box">
              <span class="input_befor_text">
                <span class="colorRed">*</span>商品名称：
              </span>
              <div class="input_after_div">
                <el-input placeholder v-model="bindInfo.commodityName" maxlength="50" size="medium"></el-input>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">
                <span class="colorRed">*</span>商品编码：
              </span>
              <div class="input_after_div">
                <el-input v-model="bindInfo.commodityCode"></el-input>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <!-- <span class="input_befor_text" style="text-align:left;">是否上架：</span> -->
              <span class="colorRed">*</span>是否上架：
              <div class="input_after_div">
                <el-radio v-model="isSell" label="1">是</el-radio>
                <el-radio v-model="isSell" label="0">否</el-radio>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">
                <span class="colorRed">*</span>商品品牌：
              </span>
              <div class="input_after_div">
                <el-select v-model="bindInfo.brandId" placeholder="商品品牌">
                  <el-option
                    v-for="item in styleList"
                    :key="item.value"
                    :label="item.brandName"
                    :value="item.brandId"
                  ></el-option>
                </el-select>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">
                <span class="colorRed">*</span>商品品类：
              </span>
              <div class="input_after_div">
                <el-select
                  @change="categoryFn"
                  v-model="bindInfo.commodityCategoryId"
                  placeholder="商品品类"
                >
                  <el-option
                    v-for="item in category"
                    :key="item.commodityCategoryId"
                    :label="item.categoryName"
                    :value="item.commodityCategoryId"
                  ></el-option>
                </el-select>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <div class="input_after_div">
                <el-checkbox v-model="isInsert" label="是否入库"></el-checkbox>
                <el-checkbox v-model="isUnpack" label="是否拆包"></el-checkbox>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">
                <span class="colorRed">*</span>商品分类：
              </span>
              <div class="input_after_div">
                <el-cascader
                  :options="options"
                  :props="props"
                  v-model="bindInfo.commodityClassifyIds"
                  :disabled="isCascader"
                ></el-cascader>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">
                <span class="colorRed">*</span>供应商：
              </span>
              <div class="input_after_div">
                <el-select filterable v-model="bindInfo.supplierId" placeholder="供应商">
                  <el-option
                    v-for="(item,index) in suppliers"
                    :key="index"
                    :label="item.companyName"
                    :value="item.companyId"
                  ></el-option>
                </el-select>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <!-- <span class="input_befor_radio">是否共享产品库：</span>
              <div class="input_after_div">
                <el-radio v-model="isShare" label="1">是</el-radio>
                <el-radio v-model="isShare" label="0">否</el-radio>
              </div>-->
            </div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">
                <span class="colorRed">*</span>商品状态：
              </span>
              <div class="input_after_div">
                <el-select v-model="bindInfo.status" placeholder="商品状态">
                  <el-option
                    v-for="item in commodityStatus"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">
                <span class="colorRed">*</span>计价方式：
              </span>
              <div class="input_after_div">
                <el-select v-model="bindInfo.valuationMethod" placeholder="计价方式">
                  <el-option
                    v-for="item in valuation"
                    :key="item.id"
                    :label="item.dictName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>

            <div class="collapse_input_cell_box"></div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">商品型号：</span>
              <div class="input_after_div">
                <el-input
                  placeholder="商品型号"
                  v-model="bindInfo.commodityModel"
                  maxlength="50"
                  size="medium"
                ></el-input>
              </div>
            </div>

            <div class="collapse_input_cell_box contentbox" style="width:50%">
              <span class>宽：</span>
              <div class="input_after_div">
                <el-input
                  placeholder
                  v-model="bindInfo.commodityWide"
                  maxlength="50"
                  size="medium"
                  onkeypress="return( /[\d\.]/.test(String.fromCharCode(event.keyCode) ) )"
                ></el-input>
              </div>
              <span class="mm-left3">高：</span>
              <div class="input_after_div">
                <el-input
                  placeholder
                  v-model="bindInfo.commodityHigh"
                  maxlength="50"
                  size="medium"
                  onkeypress="return( /[\d\.]/.test(String.fromCharCode(event.keyCode) ) )"
                ></el-input>
              </div>
              <span class="mm-left3">深：</span>
              <div class="input_after_div">
                <el-input
                  placeholder
                  v-model="bindInfo.commodityLong"
                  maxlength="50"
                  size="medium"
                  onkeypress="return( /[\d\.]/.test(String.fromCharCode(event.keyCode) ) )"
                ></el-input>
              </div>
              <span class="mm-left3">厚：</span>
              <div class="input_after_div">
                <el-input
                  placeholder
                  v-model="bindInfo.commodityThick"
                  maxlength="50"
                  size="medium"
                  onkeypress="return( /[\d\.]/.test(String.fromCharCode(event.keyCode) ) )"
                ></el-input>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">单位：</span>
              <div class="input_after_div">
                <el-input
                  placeholder="单位"
                  v-model="bindInfo.commodityUnit"
                  maxlength="50"
                  size="medium"
                ></el-input>
              </div>
            </div>


            <div class="collapse_input_cell_box">
              <span class="input_befor_text">产品标签：</span>
              <div class="input_after_div m-top10">
                <el-tag
                  :key="tag"
                  v-for="tag in dynamicTags"
                  closable
                  :disable-transitions="false"
                  @close="handleClose(tag)"
                >
                  <span>{{tag}}</span>
                </el-tag>
                <el-input
                  style="width:90px;"
                  class="input-new-tag"
                  v-if="inputVisible"
                  v-model="inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm"
                  @blur="handleInputConfirm"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small" @click="showInput">+ 新增标签</el-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 商品属性 -->
        <div class="page_head_div"></div>
        <attributelist :show="false" ref="attributelist"></attributelist>

        <!-- 自定义属性 -->
        <div v-if="attributeName.length!=0">
          <div class="page_head_div"></div>
          <div class="iconBox">
            <i class="Icon"></i>
            <span>自定义属性</span>
          </div>
        </div>
        <div class="collapsebox">
          <div class="collapse_cell_div" v-for="(attr,index) in attributeName" :key="index">
            <div class="collapse_input_cell_box" v-if="attr.mode==1">
              <span class="input_befor_text">{{attr.attributeName}}：</span>
              <div class="input_after_div">
                <el-select v-model="attr.select">
                  <el-option
                    v-for="item in attr.detaileds"
                    :key="item.commodityAttributeDetailedId"
                    :label="item.attributeValue"
                    :value="item.commodityAttributeDetailedId"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="collapse_input_cell_box" v-else>
              <span class="input_befor_text">{{attr.attributeName}}：</span>
              <div class="input_after_div">
                <el-input
                  placeholder
                  v-model.number="attr.val"
                  maxlength="50"
                  v-if="attr.attributeType==0"
                  onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"
                ></el-input>
                <el-input placeholder v-model="attr.val" maxlength="50" v-else></el-input>
                <span v-if="attr.attributeType==0">{{attr.attributeUnit}}</span>
              </div>
            </div>
          </div>
        </div>
        <!-- 图片 -->
        <div class="page_head_div"></div>
        <div class="iconBox">
          <i class="Icon"></i>
          <span>商品图片</span>
        </div>
        <div class="contentBox">
          <div class="collapse_cell_div uploadBox" v-for="(item,index) in upLoadList" :key="index">
            <div class="ImgBox">
              <img :src="item.fileUrl" alt />
            </div>
            <div class="setPicture">
              <p class="co" v-if="item.isMain==1">商品主图</p>
              <p @click="principal(index)" v-else>设为主图</p>
              <p @click="Deletepictures(index)">删除图片</p>
            </div>
          </div>
          <div class="upload_box upBox">
            <el-upload
              list-type="picture-card"
              class="upload-demo"
              action="string"
              :http-request="uploadSectionFile"
              :file-list="fileList"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>

        <!-- 描述 -->
        <div class="page_head_div"></div>
        <div class="iconBox">
          <i class="Icon"></i>
          <span>商品描述</span>
        </div>
        <div class="collapse_cell_div">
          <ueditor ref="richText" v-if="uemodel"></ueditor>
        </div>

        <!-- </el-card> -->
      </el-tabs>
      <div class="foot_btn_box">
        <el-button type="primary" @click="submission" :loading="loadingbtn">提 交</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </div>
  </div>
</template>


<script>
import breadcrumb from "../../components/breadcrumb";
import Tinymce from "../../../components/Tinymce";
import ueditor from "../../components/ueditor";
import attributelist from "./attributelist";
import { listBaseDict } from "api/common/common";
import {
  addCommodity,
  editAccessoryImg,
  listCommodityPrice,
  listCategory,
  listCompanyByAll,
  listBrand,
  ListCommodityAttribute,
  listClassify
} from "api/productmanage/goodsmanage/goodsmanage";
import { put } from "@/utils/pubilcFn";

export default {
  components: {
    breadcrumb,
    Tinymce,
    ueditor,
    attributelist
  },
  data() {
    return {
      loadingbtn:false,
      //树
      options: [],
      props: {
        label: "classifyName",
        value: "id",
        children: "children"
      },
      num: 1,
      //头部面包屑导航
      navList: [],
      inputValue: "", //商品标签
      activeName: "first",
      //第一块
      isUnpack: false,
      isInsert: false,
      isShare: "",
      isSell: "",
      //文件上传
      upLoadList: [],
      TechnologyList: [], //工艺图片
      //商品品类
      category: [],
      styleList: [],
      valuation: [], //计价方式
      commodityStatus: [
        { label: "在产", value: 1 },
        { label: "停产", value: 2 },
        { label: "预计停产", value: 3 }
      ],
      suppliers: [],
      //查询内容
      bindInfo: {},
      dynamicTags: [],
      inputVisible: false,
      ruleForm: {},
      Picture: [],
      classification: [],
      attributeName: [],
      uemodel: true,
      //状态查询
      dialogVisible: false,
      fileList: [],
      isCascader: true
    };
  },
  created() {
    this.uemodel = false;
    this.$nextTick(() => {
      this.uemodel = true;
    });
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.acquisition();
    this.getStore();
    this.getBrand();
    this.getValuation();
    // this.getAttribute();
    // this.getclassification();
  },
  methods: {
    //获取计价方式
    getValuation() {
      let data = {
        dataType: "VALUATION_METHOD"
      };
      listBaseDict(data)
        .then(res => {
          this.valuation = res.data;
        })
        .catch(error => {
          console.error("获取计价方式", error);
        });
    },
    //点击品类
    categoryFn() {
      this.getclassification(this.bindInfo.commodityCategoryId);
      this.getAttribute(this.bindInfo.commodityCategoryId);
      this.isCascader = false;
    },
    //获取商品属性
    getAttribute(commodityCategoryId) {
      let data = {
        commodityCategoryId
      };
      ListCommodityAttribute(data)
        .then(res => {
          this.attributeName = res.data.map(item => {
            item.val = "";
            item.select = "";
            item.ary = [];
            return item;
          });
          console.log(this.attributeName);
        })
        .catch(error => {
          console.error("获取商品属性", error);
        });
    },
    //获取商品分类
    getclassification(commodityCategoryId) {
      listClassify({
        commodityCategoryId
      })
        .then(res => {
          this.options = res.data;
        })
        .catch(error => {
          console.error("获取商品分类", error);
        });
    },
    //品牌
    getBrand() {
      listBrand()
        .then(res => {
          this.styleList = res.data;
        })
        .catch(error => {
          console.error("获取品牌", error);
        });
    },
    //获取供应商
    getStore() {
      listCompanyByAll({ companyType: 1 })
        .then(res => {
          this.suppliers = res.data;
        })
        .catch(error => {
          console.error("获取门店", error);
        });
    },
    //获取品类
    acquisition() {
      listCategory({})
        .then(res => {
          this.category = res.data;
        })
        .catch(error => {
          console.error("获取品类", error);
        });
    },
    //设为主图
    principal(details) {
      this.upLoadList.map((item, index) => {
        if (index == details) {
          item.isMain = 1;
        } else {
          item.isMain = 0;
        }
      });
    },
    //商品图片上传
    uploadSectionFile(res) {
      put(res).then(data => {
        this.upLoadList.push({
          fileUrl: data.url,
          isMain: 0,
          sourceName: data.name
        });
      });
    },
    //删除商品图片
    Deletepictures(details) {
      this.upLoadList = this.upLoadList.filter((item, index) => {
        return details !== index;
      });
    },
    //工艺图片上传
    upTechnologyFile(res) {
      put(res).then(data => {
        this.TechnologyList.push({
          fileUrl: data.url,
          sourceName: data.name
        });
      });
    },
    //删除工艺图片
    Deletepic(details) {
      this.TechnologyList = this.TechnologyList.filter((item, index) => {
        return details !== index;
      });
    },
    //提交
    submission() {
      let {
        commodityName,
        commodityModel,
        commodityClassifyIds,
        brandId,
        supplierId,
        commodityCategoryId,
        commodityCode,
        status,
        valuationMethod
      } = this.bindInfo; //结构赋值
      // 验证
      if (!commodityName) {
        this.$message.error("商品名称不能为空!");
      } else if (!commodityCode) {
        this.$message.error("商品编码不能为空!");
      } else if (!commodityClassifyIds) {
        this.$message.error("商品分类不能为空!");
      } else if (!brandId) {
        this.$message.error("商品品牌不能为空!");
      } else if (!commodityCategoryId) {
        this.$message.error("商品品类不能为空!");
      } else if (!status) {
        this.$message.error("商品状态不能为空");
      } else if (!supplierId) {
        this.$message.error("供应商不能为空!");
      } else if (!this.isSell) {
        this.$message.error("请选择是否上架!");
      } else if (!valuationMethod) {
        this.$message.error("请选择计价方式!");
      } else {
        let ary = [],
          arr = [];
        this.attributeName.forEach((item, index) => {
          if (item.val || item.select) {
            arr.push(item.fieldName);
          }
          if (item.mode == 0) {
            if (item.val) {
              ary.push(item.val);
            }
          } else {
            if (item.select) {
              ary.push(item.select);
            }
          }
        });
        let {
          itemNumber, //货号
          colorsIds, //颜色
          materialIds, //材质
          seriesIds //系列
        } = this.$refs.attributelist; //结构赋值商品属性
        let data = {
          ...this.bindInfo,
          isWarehousing: this.isInsert ? 1 : 0,
          isUnpacking: this.isUnpack ? 1 : 0,
          isSharedProducts: this.isShare,
          labelId: this.dynamicTags.join(","),
          isUpperShelf: this.isSell,
          processImgUrls: this.TechnologyList, //工艺图片
          pics: this.upLoadList, //图片
          commodityDescribe: this.$refs.richText.getUEContent(), //商品描述
          columnName: arr.join(","),
          columnValue: ary.join(","),
          itemNumber, //货号
          colours: colorsIds.join(","), //颜色
          materials: materialIds.join(","), //材质
          series: seriesIds.join(",") //系列
        };
        console.log(data);
        this.loadingbtn = true;
        addCommodity(data)
          .then(res => {
            if(res.status==200){
              if (res.message == "true") {
                this.$message.error("商品编码已经存在!");
              } else {
                this.$message.success("添加成功!");
                this.bindInfo = {};
                this.$router.push("goodsmanage");
              }
              this.loadingbtn = false;
            }else{
              this.$message.error('提交失败!')
              this.loadingbtn = false;
            }
          })
          .catch(error => {
            this.loadingbtn = false;
            console.error("新增商品  productmanagegoodsmanageaddgoods", error);
          });
      }
    },
    //取消
    cancel() {
      this.$router.go(-1);
    },
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      //添加标签方法组
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    handleClose(tag) {
      //添加标签方法组
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    }
  }
};
</script>
<style scoped lang="scss">
.colorRed {
  color: red;
}
.mm-left3 {
  margin-left: 3px;
}
.el-select {
  width: 80%;
}
.el-cascader {
  width: 80%;
}
.upImgBox {
  width: 94px;
  height: 94px;
  line-height: 102px;
  img {
    width: 100%;
    height: 100%;
  }
}
.contentBox {
  display: flex;
  flex-direction: row;
  margin-top: 10px;
  .collapse_cell_div {
    background: #ecedf0;
    overflow: hidden;
    padding: 10px 0;
    display: block;
    margin-right: 20px;
    border: 1px solid #b7b9bb;
    padding: 10px;
    .setPicture {
      display: flex;
      justify-content: space-between;
      p {
        cursor: pointer;
        color: #006ec6;
      }
      .co {
        color: red;
      }
    }
    .ImgBox {
      width: 150px;
      height: 120px;
      display: flex;
      margin-bottom: 10px;
      justify-content: center;
      align-items: center;
      img {
        width: 100%;
        height: 100%;
      }
    }
  }
}

.page_head_div {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 50px;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
}

.setPicture {
  display: flex;
  justify-content: center;
  align-items: center;
}
.pagination_wrap {
  text-align: center;
  height: 50px;
  /* line-height: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.collapsebox {
  // padding: 0px -10px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  .collapse_cell_div {
    width: 33%;
    display: flex;
    overflow: hidden;
    flex-wrap: wrap;
    padding: 10px 0;
  }
  .collapse_input_cell_box {
    width: 100%;
  }
  .input_befor_text {
    width: 120px;
    text-align: right;
  }
}
.collapse_cell_div {
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  padding: 10px 0;
}
.collapse_cell_div .ImgBox {
  width: 100%;
  display: flex;
  margin-bottom: 10px;
}
.collapse_input_cell_box {
  display: flex;
  flex-wrap: nowrap;
}
.collapse_input_cell_box_area {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  margin-top: 10px;
}
.collapse_input_cell_box_area .input_after_div {
  width: 84%;
}
.el-input {
  flex: 1;
  width: 80%;
}
.information {
  .collapse_input_cell_box {
    width: 33%;
  }
}
.collapse_input_cell_box {
  width: 49.5%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  // height: 50px;
  padding: 10px 10px;
}
.collapse_input_cell_box .input_befor_text {
  width: 6em;
}
.collapse_input_cell_box .input_befor_radio {
  width: 8em;
}
.collapse_input_cell_box .input_after_div {
  flex: 1;
}
.input_befor_text {
  width: 95px;
  text-align: right;
}
.foot_btn_box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
<style>
.el-collapse-item__header {
  background-color: #dddddd;
  padding: 0 10px;
}
</style>



