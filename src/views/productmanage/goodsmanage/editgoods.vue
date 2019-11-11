<template>
  <div class="wrapper addgodds lvs">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- <div class='newHeader'>新增商品</div> -->
      <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
        <el-tab-pane label="编辑商品" name="first"></el-tab-pane>
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
                <el-input
                  placeholder
                  v-model="bindInfo.commodity_name"
                  maxlength="50"
                  size="medium"
                ></el-input>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">
                <span class="colorRed">*</span>商品编码：
              </span>
              <div class="input_after_div">
                <el-input v-model="bindInfo.commodity_code"></el-input>
              </div>
            </div>

            <!-- <div class="collapse_input_cell_box">
              <span class="input_befor_radio">是否共享产品库：</span>
              <div class="input_after_div">
                <el-radio v-model="isShare" label="1">是</el-radio>
                <el-radio v-model="isShare" label="0">否</el-radio>
              </div>
            </div>-->

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">
                <span class="colorRed">*</span>是否上架：
              </span>
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
                <el-select v-model="bindInfo.brand_id" placeholder="商品品牌">
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
                <el-select @change="categoryFn" v-model="bindInfo.category_id" placeholder="商品品类">
                  <el-option
                    v-for="(item,index) in category"
                    :key="index"
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
                  v-model="bindInfo.relCommodityClassifies"
                  :props="props"
                  @change="cascaderChange"
                ></el-cascader>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">
                <span class="colorRed">*</span>供应商：
              </span>
              <div class="input_after_div">
                <el-select filterable v-model="bindInfo.supplier_id" placeholder="供应商">
                  <el-option
                    v-for="(item,index) in suppliers"
                    :key="index"
                    :label="item.companyName"
                    :value="item.companyId"
                  ></el-option>
                </el-select>
              </div>
            </div>

            <div class="collapse_input_cell_box"></div>

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
                <el-select v-model="bindInfo.valuation_method" placeholder="计价方式">
                  <el-option
                    v-for="item in valuation"
                    :key="item.id"
                    :label="item.dictName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
            </div>

            <!-- <div class="collapse_input_cell_box">
              <span class="input_befor_text">工期：</span>
              <div class="input_after_div">
                <el-input
                  placeholder
                  v-model.number="bindInfo.construction_period"
                  maxlength="50"
                  size="medium"
                  onkeypress="return( /[\d]/.test(String.fromCharCode(event.keyCode) ) )"
                ></el-input>
                <span class="input_after_day">天</span>
              </div>
            </div>-->

            <div class="collapse_input_cell_box"></div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">商品型号：</span>
              <div class="input_after_div">
                <el-input
                  placeholder="商品型号"
                  v-model="bindInfo.commodity_model"
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
                  v-model="bindInfo.commodity_wide"
                  maxlength="50"
                  size="medium"
                  onkeypress="return( /[\d\.]/.test(String.fromCharCode(event.keyCode) ) )"
                ></el-input>
              </div>
              <span class="mm-left3">高：</span>
              <div class="input_after_div">
                <el-input
                  placeholder
                  v-model="bindInfo.commodity_high"
                  maxlength="50"
                  size="medium"
                  onkeypress="return( /[\d\.]/.test(String.fromCharCode(event.keyCode) ) )"
                ></el-input>
              </div>
              <span class="mm-left3">深：</span>
              <div class="input_after_div">
                <el-input
                  placeholder
                  v-model="bindInfo.commodity_long"
                  maxlength="50"
                  size="medium"
                  onkeypress="return( /[\d\.]/.test(String.fromCharCode(event.keyCode) ) )"
                ></el-input>
              </div>
              <span class="mm-left3">厚：</span>
              <div class="input_after_div">
                <el-input
                  placeholder
                  v-model="bindInfo.commodity_thick"
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
                  v-model="bindInfo.commodity_unit"
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
                >{{tag}}</el-tag>
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
        <attributelist :show="true" :bindInfo="bindInfo" ref="attributelist"></attributelist>

        <!-- 自定义属性 -->
        <div class="page_head_div"></div>
        <div class="iconBox">
          <i class="Icon"></i>
          <span>自定义属性</span>
        </div>
        <div class="collapsebox">
          <div class="collapse_cell_div" v-for="(attr,index) in attrList" :key="index">
            <div class="collapse_input_cell_box" v-if="attr.mode==1">
              <span class="input_befor_text">{{attr.attributeName}}：</span>
              <div class="input_after_div">
                <el-select v-model="attr.select" placeholder>
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
              <p @click="Deletepictures(index,item.accessoryId)">删除图片</p>
            </div>
          </div>
          <div class="upload_box upBox">
            <el-upload
              list-type="picture-card"
              class="avatar-uploader"
              action="string"
              :http-request="uploadSectionFile"
              :file-list="fileList"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>

        <div class="page_head_div"></div>
        <div class="iconBox">
          <i class="Icon"></i>
          <span>商品描述</span>
        </div>
        <div class="collapse_cell_div">
          <ueditor ref="richText" v-if="uemodel"></ueditor>
        </div>
       
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
import pagination from "../../components/pagination";
import attributelist from "./attributelist";
import { listBaseDict } from "api/common/common";
import { put } from "@/utils/pubilcFn";
import {
  editCommodity,
  listCommodityPrice,
  listCategory,
  listCompanyByAll,
  listBrand,
  ListCommodityAttribute,
  getBrand,
  removeAccessoryImg,
  listClassify,
  addAccessory,
  listPriceStrategy
} from "api/productmanage/goodsmanage/goodsmanage";
export default {
  components: {
    breadcrumb,
    Tinymce,
    ueditor,
    pagination,
    attributelist
  },
  data() {
    return {
      loadingbtn:false,
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
      //第一块
      isUnpack: false,
      isInsert: false,
      isShare: "",
      isSell: "",
      category: [],
      activeName: "first",
      //文件上传
      upLoadList: [],
      TechnologyList: [], //工艺图片
      tabList: [],
      styleList: [],
      valuation: [],
      commodityStatus: [
        { label: "在产", value: 1 },
        { label: "停产", value: 2 },
        { label: "预计停产", value: 3 }
      ],
      suppliers: [],

      //分页
      currentPage: 1, //当前页数
      pageSize: 20, //当前页最大条数
      total: 0, //总条数
      //查询内容
      searchtext: "",
      bindInfo: {},
      dynamicTags: [],
      inputVisible: false,
      ruleForm: {},
      processPicture: {},
      Picture: [],
      attrList: [],
      classification: [],
      uemodel: true,
      fileList: []
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
    this.getclassification(this.$route.query.commodityCategoryId);
    this.getEdit();
    this.getBrand();
    this.acquisition();
    this.getStore();
    this.getValuation();
    // this.getCommodityPrice();
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
    handleClick() {},
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    getCommodityPrice() {
      //商品价格
      let data = {
        priceStrategyName: this.searchtext,
        page: this.currentPage,
        limit: this.pageSize
      };
      listPriceStrategy(data)
        .then(res => {
          console.log(res);
          this.tabList = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.error("商品价格", error);
        });
    },
    // 编辑获取商品数据
    getEdit() {
      let data = {
        commodityId: this.$route.query.id
      };
      getBrand(data)
        .then(res => {
          this.bindInfo = res.data;
          this.bindInfo.relCommodityClassifies =
            res.data.relCommodityClassifies;

          this.bindInfo.category_id = String(res.data.category_id);
          this.bindInfo.itemNumber = res.data.item_number;
          this.bindInfo.brand_id = String(res.data.brand_id);
          this.isInsert = res.data.is_warehousing == "1" ? true : false;
          this.isUnpack = res.data.is_unpacking == "1" ? true : false;
          this.isSell = String(res.data.is_upper_shelf);
          this.isShare = String(res.data.is_shared_products);
          this.upLoadList = res.data.accessories;
          this.TechnologyList = res.data.commodityTechnologyImgs;
          this.dynamicTags = res.data.labels.map(item => {
            if (item.label_name) {
              return item.label_name;
            }
          });
          this.$refs.richText.setUEContent(res.data.commodity_describe);

          this.attrList = res.data.commodityCategoryColumn.map(item => {
            if (item.mode == 0) {
              for (let key in res.data.commodityExtend) {
                if (res.data.commodityExtend.hasOwnProperty(key)) {
                  if (item.fieldName == key) {
                    this.$set(item, "val", res.data.commodityExtend[key]);
                  }
                }
              }
            } else {
              for (let key in res.data.commodityExtend) {
                if (res.data.commodityExtend.hasOwnProperty(key)) {
                  if (item.fieldName == key) {
                    this.$set(item, "select", res.data.commodityExtend[key]);
                  }
                }
              }
            }
            return item;
          });
        })
        .catch(error => {
          console.error("查看商品", error);
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
      let data = {
        companyType: 1
      };
      listCompanyByAll(data)
        .then(res => {
          this.suppliers = res.data;
        })
        .catch(error => {
          console.error("获取门店", error);
        });
    },
    //选择品类change事件
    categoryFn() {
      this.getclassification(this.bindInfo.category_id);
    },
    getclassification(commodityCategoryId) {
      //获取商品分类
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
    Deletepictures(details, id) {
      this.upLoadList = this.upLoadList.filter((item, index) => {
        return details !== index;
      });
      if (id !== undefined) {
        let data = {
          dataSourceId: this.$route.query.id,
          dataSourceEnum: "CommodityImg",
          accessoryId: id
        };
        removeAccessoryImg(data)
          .then(res => {
            console.log(res);
          })
          .catch(error => {
            console.error("删除图片", error);
          });
      }
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
    Deletepic(details, id) {
      this.TechnologyList = this.TechnologyList.filter((item, index) => {
        return details !== index;
      });
      if (id !== undefined) {
        let data = {
          dataSourceId: this.$route.query.id,
          dataSourceEnum: "CommodityTechnologyImg",
          accessoryId: id
        };
        removeAccessoryImg(data)
          .then(res => {
            console.log(res);
          })
          .catch(error => {
            console.error("删除图片", error);
          });
      }
    },

    //提交
    submission() {
      this.upLoadList.forEach(item => {
        if (!item.accessoryId) {
          let data = {
            dataSourceId: this.$route.query.id,
            sourceName: item.sourceName,
            fileUrl: item.fileUrl,
            isMain: item.isMain,
            dataSourceEnum: "CommodityImg"
          };
          addAccessory(data)
            .then(res => {})
            .catch(error => {
              console.error("新增图片", error);
            });
        }
      });
      this.TechnologyList.forEach(item => {
        if (!item.accessoryId) {
          let data = {
            dataSourceId: this.$route.query.id,
            sourceName: item.sourceName,
            fileUrl: item.fileUrl,
            isMain: item.isMain,
            dataSourceEnum: "CommodityTechnologyImg"
          };
          addAccessory(data)
            .then(res => {})
            .catch(error => {
              console.error("新增图片", error);
            });
        }
      });

      let ary = [],
        arr = [];
      this.attrList.forEach((item, index) => {
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
        commodity_name,
        commodity_code,
        relCommodityClassifies,
        brand_id,
        category_id,
        status,
        supplier_id,
        valuation_method
      } = this.bindInfo;
      if (!commodity_name) {
        this.$message.error("商品名称不能为空!");
        return;
      }
      if (!commodity_code) {
        this.$message.error("商品编码不能为空!");
        return;
      }
      if (!relCommodityClassifies) {
        this.$message.error("商品分类不能为空!");
        return;
      }
      if (!brand_id) {
        this.$message.error("商品品牌不能为空!");
        return;
      }
      if (!category_id) {
        this.$message.error("商品品类不能为空!");
        return;
      }
      if (!status) {
        this.$message.error("商品状态不能为空");
        return;
      }
      if (!supplier_id) {
        this.$message.error("供应商不能为空!");
        return;
      }
      if (!this.isSell) {
        this.$message.error("请选择是否上架!");
        return;
      }
      if (!valuation_method) {
        this.$message.error("请选择计价方式!");
        return;
      }
      let {
        itemNumber, //货号
        colorsIds, //颜色
        materialIds, //材质
        seriesIds //系列
      } = this.$refs.attributelist; //结构赋值商品属性
      let data = {
        itemNumber, //货号
        colours: colorsIds.join(","), //颜色
        materials: materialIds.join(","), //材质
        series: seriesIds.join(","), //系列
        commodityName: this.bindInfo.commodity_name,
        commodityId: this.bindInfo.commodity_id,
        commodityModel: this.bindInfo.commodity_model,
        commodityCategoryId: this.bindInfo.category_id,
        brandId: this.bindInfo.brand_id,
        status: this.bindInfo.status,
        valuationMethod: this.bindInfo.valuation_method,
        commodityUnit: this.bindInfo.commodity_unit,
        commodityLong: this.bindInfo.commodity_long,
        commodityWide: this.bindInfo.commodity_wide,
        commodityHigh: this.bindInfo.commodity_high,
        commodityThick: this.bindInfo.commodity_thick,
        supplierId: this.bindInfo.supplier_id,
        constructionPeriod: this.bindInfo.construction_period,
        processName: this.bindInfo.process_name,
        processThickness: this.bindInfo.process_thickness,
        baseMaterial: this.bindInfo.base_material,
        veneer: this.bindInfo.veneer,
        processExplain: this.bindInfo.process_explain,
        processRemarks: this.bindInfo.process_remarks,
        commodityClassifyIds: this.bindInfo.relCommodityClassifies,
        commodityCode: this.bindInfo.commodity_code,
        isWarehousing: this.isInsert ? 1 : 0,
        isUnpacking: this.isUnpack ? 1 : 0,
        isSharedProducts: this.isShare,
        labelId: this.dynamicTags.join(","),
        isUpperShelf: this.isSell,
        commodityDescribe: this.$refs.richText.getUEContent(), //商品描述
        columnName: arr.join(","),
        columnValue: ary.join(",")
      };
      this.loadingbtn = true;
      editCommodity(data)
        .then(res => {
          if(res.status==200){
            this.$router.push("goodsmanage");
            this.$message({
              message: "添加成功",
              type: "success"
            });
            this.bindInfo = {};
            this.loadingbtn = false;
          }else{
            this.$message.error(res.message)
            this.loadingbtn = false;
          }
        })
        .catch(error => {
          this.loadingbtn = false;
          console.error("新增商品  productmanagegoodsmanageaddgoods", error);
        });
    },
    //取消
    cancel() {
      this.$router.go(-1);
    },
    //商品分类
    cascaderChange(value) {
      console.log(value);
    },
    //新增标签
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //添加标签方法组
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    //添加标签方法组
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getCommodityPrice();
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getCommodityPrice();
    },
    //查询按钮点击
    searchFun() {
      this.currentPage = 1;
      this.getCommodityPrice();
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
.information {
  .collapse_input_cell_box {
    width: 33%;
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
  display: flex;
  align-items: center;
  justify-content: center;
}
.collapsebox {
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
.collapse_input_cell_box {
  width: 50%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  // height: 50px;
  padding: 10px 10px;
}
.collapse_input_cell_box .input_befor_text {
  width: 6em;
  text-align: right;
}
.collapse_input_cell_box .input_befor_radio {
  width: 8em;
}
.collapse_input_cell_box .input_after_div {
  flex: 1;
}
.table_list {
  width: 100%;
  margin-top: 10px;
}
.head_nav_search_t {
  margin-right: 20px;
  display: flex;
  align-items: center;
  width: 90%;
  padding: 0;
}
.head_nav_select_t {
  margin-right: 20px;
  display: flex;
  align-items: center;
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



