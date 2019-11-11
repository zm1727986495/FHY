<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- <div class='newHeader'>产品基本信息</div> -->
      <el-tabs v-model="activeName" type="border-card">
        <el-tab-pane label="产品基本信息" name="first"></el-tab-pane>
        <!-- <el-card class="m-bottom"> -->
        <div>
          <div class="iconBox">
            <i class="Icon"></i>
            <span>基本信息</span>
          </div>
          <div class="collapse_cell_div">
            <div class="collapse_input_cell_box">
              <span class="input_befor_text">产品名称：</span>
              <div class="input_after_div">
                <el-input placeholder v-model="beforIn.productName" maxlength="50"></el-input>
              </div>
            </div>
            <div class="collapse_input_cell_box">
              <span class="input_befor_text">产品型号：</span>
              <div class="input_after_div">
                <el-input placeholder="产品型号" v-model="beforIn.productModel" maxlength="50"></el-input>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">产品品牌：</span>
              <div class="input_after_div">
                <el-select v-model="brandVal" filterable placeholder="请选择产品品牌">
                  <el-option
                    v-for="item in brandData"
                    :key="item.brandId"
                    :label="item.brandName"
                    :value="item.brandId"
                  ></el-option>
                </el-select>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">产品品类：</span>
              <div class="input_after_div">
                <el-select @change="categoryFn" v-model="categoryVal" placeholder="请选择商品分类">
                  <el-option
                    v-for="item in categorys"
                    :key="item.commodityCategoryId"
                    :label="item.categoryName"
                    :value="item.commodityCategoryId"
                  ></el-option>
                </el-select>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">产品分类：</span>
              <div class="input_after_div">
                <el-cascader
                  :disabled="isCascader"
                  style="width:80%"
                  :options="options"
                  :props="props"
                  v-model="beforIn.commodityClassifyIds"
                ></el-cascader>
              </div>
            </div>

            <div class="collapse_input_cell_box">
              <span class="input_befor_text">供应商：</span>
              <div class="input_after_div">
                <el-select v-model="supplierId" placeholder="供应商">
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
              <span class="input_befor_text">产品状态：</span>
              <div class="input_after_div">
                <el-select v-model="statusVal" placeholder="请选择产品状态">
                  <el-option
                    v-for="item in status"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="collapse_input_cell_box">
              <span class="input_befor_text">产品标签：</span>
              <div class="input_after_div">
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
            <div class="collapse_input_cell_box">
              <span class="input_befor_text">是否上架：</span>
              <div class="input_after_div">
                <el-radio v-model="isSell" label="1">是</el-radio>
                <el-radio v-model="isSell" label="2">否</el-radio>
              </div>
            </div>
          </div>
        </div>
        <div class="page_head_div"></div>
        <div class="iconBox">
          <i class="Icon"></i>
          <span>选择商品</span>
        </div>
        <div class="collapse_cell_div">
          <!-- 查询条件组 -->
          <div class="warp_head_list">
            <div class="head_nav_search_t">
              <el-input placeholder="商品名称/商品编码" v-model="searchtext" maxlength="50">
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
              </el-input>
              <div class="head_nav_btn m-left20">
                <el-button type="warning" class="button-fc" @click="searchFun">查询</el-button>
              </div>
            </div>

            <div class="head_nav_btn">
              <el-button type="primary" size="medium" @click="addHandle">添加商品</el-button>
              <el-button type="danger" size="medium" @click="removeFn">删除商品</el-button>

              <!-- 添加商品 -->
              <choseproducts
                @cancelFn="cancelFn"
                @getListData="getListData"
                :isChoseproducts="isChoseproducts"
                v-if="isChoseproducts"
                :choose="choose"
                :categoryVal="categoryVal"
                :brandVal="brandVal"
              ></choseproducts>
            </div>
          </div>
          <!-- 表格 -->
          <div class="table_list attribute">
            <!--  -->
            <el-table
              border
              @selection-change="handleSelectionChange"
              :data="tabList"
              :row-class-name="tableRowClassName"
            >
              <el-table-column fixed type="selection" align="center" width="40"></el-table-column>
              <el-table-column
                prop="commodity_name"
                align="center"
                label="商品名称"
                width="200"
                show-overflow-tooltip
              ></el-table-column>
              <el-table-column prop="commodity_code" align="center" label="商品编码" width="200"></el-table-column>
              <el-table-column prop="brand_name" align="center" label="品牌名称" width="200"></el-table-column>
              <el-table-column prop="category_name" align="center" label="品类名称" width="200"></el-table-column>
              <el-table-column prop="classify_name" align="center" label="分类名称" width="200"></el-table-column>
              <el-table-column prop="company_name" align="center" label="供应商" width="200"></el-table-column>
              <el-table-column prop="commodity_model" align="center" label="商品型号" width="200"></el-table-column>
              <el-table-column prop="status" align="center" label="状态" width="200">
                <template slot-scope="scope">
                  <span v-if="scope.row.status==0">在产</span>
                  <span v-else-if="scope.row.status==1">预计停产</span>
                  <span v-else>停产</span>
                </template>
              </el-table-column>
              <el-table-column prop="valuation_method" align="center" label="计价方式" width="200"></el-table-column>
              <el-table-column prop="commodity_long" align="center" label="长" width="200"></el-table-column>
              <el-table-column prop="commodity_wide" align="center" label="宽" width="200"></el-table-column>
              <el-table-column prop="commodity_high" align="center" label="高" width="200"></el-table-column>
              <el-table-column prop="is_warehousing" align="center" label="是否入库" width="200">
                <template slot-scope="scope">
                  <span v-if="scope.row.is_warehousing==0">否</span>
                  <span v-else>是</span>
                </template>
              </el-table-column>
              <el-table-column prop="is_unpacking" align="center" label="是否拆包" width="200">
                <template slot-scope="scope">
                  <span v-if="scope.row.is_warehousing==0">否</span>
                  <span v-else>是</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="is_participation_activities"
                align="center"
                label="是否参与活动"
                width="200"
              >
                <template slot-scope="scope">
                  <span v-if="scope.row.is_participation_activities==0">否</span>
                  <span v-else>是</span>
                </template>
              </el-table-column>
              <el-table-column prop="construction_period" align="center" label="工期" width="200"></el-table-column>
              <el-table-column prop="is_shared_products" align="center" label="是否共享产品库" width="200">
                <template slot-scope="scope">
                  <span v-if="scope.row.is_shared_products==0">否</span>
                  <span v-else>是</span>
                </template>
              </el-table-column>
              <el-table-column prop="is_upper_shelf" align="center" label="是否上架" width="200">
                <template slot-scope="scope">
                  <span v-if="scope.row.is_upper_shelf==0">否</span>
                  <span v-else>是</span>
                </template>
              </el-table-column>
              <el-table-column prop="commodity_describe" align="center" label="商品描述" width="200"></el-table-column>
              <el-table-column prop="create_time" label="创建时间" width="240" align="center"></el-table-column>
              <el-table-column prop="createName" label="创建人" width="240" align="center"></el-table-column>
              <el-table-column prop="update_time" label="修改时间" width="240" align="center"></el-table-column>
              <el-table-column prop="updateName" label="修改人" width="240" align="center"></el-table-column>
              <el-table-column prop="is_delete" label="是否删除" width="240" align="center">
                <template slot-scope="scope">
                  <span v-if="scope.row.is_delete==0">否</span>
                  <span v-else>是</span>
                </template>
              </el-table-column>
              <!-- <el-table-column
                :prop="item.fieldName"
                :label="item.title"
                width="200"
                v-for="(item,index) in tabTile"
                :key="index"
              ></el-table-column>-->
            </el-table>
            <div class="pagination_wrap">
              <pagination
                :current-page="currentPage"
                :pageSize="pageSize"
                :total="total"
                @sizeChange="sizeChange"
                @currentChange="currentChange"
              ></pagination>
            </div>
          </div>
        </div>
        <div class="page_head_div"></div>

        <div class="iconBox">
          <i class="Icon"></i>
          <span>产品图片</span>
        </div>
        <div class="contentBox">
          <div class="collapse_cell_div uploadBox" v-for="(item,index) in upLoadList" :key="index">
            <div class="ImgBox">
              <img :src="item.fileUrl" alt />
            </div>
            <div class="setPicture">
              <p class="co" v-if="item.isMain==1">产品主图</p>
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
        <div class="el-upload__tip">按住ctrl可同时批量选择多张图片上传，建议尺寸330*200px</div>
        <div class="page_head_div"></div>

        <div class="iconBox">
          <i class="Icon"></i>
          <span>产品描述</span>
        </div>
        <div class="collapse_cell_div">
          <ueditor ref="richText" v-if="uemodel"></ueditor>
        </div>
        <!-- </el-card> -->
      </el-tabs>
    </div>
    <div class="foot_btn_box">
      <el-button type="primary" @click="submission" :loading="loadingbtn">提 交</el-button>
      <el-button type="warning" @click="preservation" :loading="loadingbtn">保 存</el-button>
      <el-button @click="cancel">取 消</el-button>
    </div>
  </div>
</template>


<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import ueditor from "@/views/components/ueditor";
import choseproducts from "./choseproducts";
import {
  addProduct,
  listCommodity,
  removes,
  querysCommodity,
  listAccessoryImg,
  querys,
  getFileStream,
  listCompanyByAll,
  listClassify,
  editProduct
} from "api/productmanage/productmanages/productmanages";
import { listCategory, listBrand } from "api/pulicJava";
import { put } from "@/utils/pubilcFn";
export default {
  components: {
    breadcrumb,
    pagination,
    ueditor,
    choseproducts
  },

  data() {
    return {
      loadingbtn: false, //加载
      options: [], // 产品分类
      activeName: "first",
      props: {
        label: "classifyName",
        value: "id",
        children: "children"
      },
      beforIn: {},
      isCascader: true,
      currentPage: 1, //当前页数
      pageSize: 20, //当前页最大条数
      total: 0, //总条数
      //头部面包屑导航
      navList: [],
      isChoseproducts: false, //添加商品
      categorys: [], //产品品类 数据
      supplierId: "", //供应商
      categoryVal: "", //产品品类选中状态
      status: [
        //产品状态 数据
        { label: "在产", value: 0 },
        { label: "预计停产", value: 1 }
      ],
      statusVal: "", //产品状态 选中状态
      changSelect: [], //table change事件选中数据
      brandVal: "", //品牌选中状态
      dynamicTags: [], //添加标签数组
      inputVisible: false, //标签判断
      inputValue: "", //添加标签变量
      isShare: 1,
      isSell: "",
      //文件上传
      upLoadList: [],
      tabTile: [], //列表title数据
      tabList: [], //列表内容数据
      brandData: [], //品牌列表数据
      //查询内容
      searchtext: "",
      choose: "", //产品Id
      Picture: [],
      fileList: [],
      classification: [],
      uemodel: true,
      suppliers: [] //供应商
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
    this.category(); //获取品类
    this.brands(); //获取品牌
    this.getStore();
  },
  methods: {
    //品类change
    categoryFn() {
      this.getclassification(this.categoryVal);
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
          console.error("获取供应商", error);
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
    //产品图片上传
    uploadSectionFile(res) {
      put(res).then(data => {
        this.upLoadList.push({
          fileUrl: data.url,
          isMain: 0,
          sourceName: data.name
        });
      });
    },
    //删除产品图片
    Deletepictures(details) {
      this.upLoadList = this.upLoadList.filter((item, index) => {
        return details !== index;
      });
    },
    //提交
    submission() {
      this.added(1);
    },
    //保存
    preservation() {
      if (this.loading) {
        this.$message.error("加载中");
        return;
      }
      this.added(0);
    },
    added(type) {
      if (!this.beforIn.productName && this.beforIn.productName != 0) {
        this.$message.error("请输入产品名称!");
      } else if (!this.beforIn.productModel && this.beforIn.productModel != 0) {
        this.$message.error("请输入产品型号!");
      } else if (!this.beforIn.commodityClassifyIds&&this.beforIn.commodityClassifyIds.length == 0) {
        this.$message.error("请选择产品分类!");
      } else if (!this.brandVal && this.brandVal != 0) {
        this.$message.error("请选择品牌!");
      } else if (!this.categoryVal && this.categoryVal != 0) {
        this.$message.error("请选择品类!");
      } else {
        let data = {
          ...this.beforIn,
          commodityCategoryId: this.categoryVal,
          brandId: this.brandVal,
          status: this.statusVal,
          labelId: this.dynamicTags.join(","),
          description: this.$refs.richText.getUEContent(),
          isUpperShelf: this.isSell,
          supplierId: this.supplierId,
          pics: this.upLoadList
        };

        if ((type == 0 || type == 1) && this.choose) {
          if (type == 0) {
            this.loadingbtn = true;
          } else {
            this.$router.go(-1);
          }
          data.productId = this.choose;
         
          editProduct(data).then(res => {
            if (res.status == 200) {
              this.loadingbtn = false;
              this.$message.success("编辑成功！");
            }else{
              this.loadingbtn = false;
            }
          }).catch(error=>{
            this.loadingbtn = false;
            console.error('',error);
          })
          return;
        }
        this.loadingbtn = true;
        addProduct(data)
          .then(res => {
            if (res.status == 200) {
              this.choose = res.data.productId;
              if (type == 1) {
                this.$message.success("提交成功!");
                this.$router.push({ path: "productmanages" });
              } else {
                this.$message.success("保存成功!");
              }
              this.loadingbtn = false;
            }else{
              this.loadingbtn = false;
            }
          })
          .catch(error => {
            this.loadingbtn = false;
            console.error("产品新增", error);
          });
      }
    },
     //取消
    cancel() {
      this.$router.go(-1);
    },
    //获取分类
    getclassification(commodityCategoryId) {
      listClassify({
        commodityCategoryId
      })
        .then(res => {
          if (res.status == 200) {
            this.options = res.data;
            this.isCascader = false;
          }
        })
        .catch(error => {
          console.error("获取商品分类", error);
        });
    },
    //获取品牌
    brands() {
      listBrand()
        .then(res => {
          this.brandData = res.data;
          console.log(this.brandData, 1);
        })
        .catch(error => {
          console.error(
            "产品管理：获取品牌子件调用 productmanage/productmanages/addproducts"
          );
        });
    },
    //获取品类
    category() {
      listCategory()
        .then(res => {
          this.categorys = res.data;
        })
        .catch(res => {
          console.error(
            "产品管理：获取品类公共接口 子组件调用 productmanage/productmanages/addproducts"
          );
        });
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //获取列表信息
    getListData() {
      let data = {
        ...this.$route.query,
        productId: this.choose,
        page: this.currentPage,
        limit: this.pageSize
      };
      this.searchtext
        ? (data.commodityGroup = this.searchtext)
        : data.commodityGroup;

      querysCommodity(data)
        .then(res => {
          this.total = res.data.total;
          this.tabTile = res.data.CommodityColumn;
          this.tabList = res.data.list;
        })
        .catch(error => {
          console.error(
            "查询品类下商品属性 productmanageproductmanagesaddproducts.vue",
            error
          );
        });
    },
    //添加标签方法组
    handleClose(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    //添加标签方法组
    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getListData();
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getListData();
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
    //勾选函数回调
    handleSelectionChange(val) {
      this.changSelect = val;
    },
    //查询按钮点击
    searchFun() {
      this.currentPage3 = 1;
      this.getListData();
    },
    //新增商品页面
    addHandle() {
      if (this.choose == "") {
        this.$message.error("你当前还没有产品!");
        return;
      }
      // let data = this.$route.query;
      // this.searchtext
      //   ? (data.commodityName = this.searchtext)
      //   : data.commodityName;
      // data.productId = this.choose;
      // this.$router.push({ path: "choseproducts", query: data });
      this.isChoseproducts = true;
    },
    //关闭添加商品数据
    cancelFn() {
      this.isChoseproducts = false;
    },
    //删除商品
    removeFn() {
      if (this.changSelect.length == 0) {
        this.$message.error("请勾选后再进行操作");
        return;
      }
      let arr = this.changSelect
        .map(item => {
          return item.commodity_id;
        })
        .join(",");
      let data = {
        productId: this.choose,
        commodityIds: arr
      };
    }
  }
};
</script>
<style scoped lang="scss">
.el-select {
  width: 80%;
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

.warp_head_list {
  width: 100%;
  display: flex;
  justify-content: space-between;
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
.collapse_cell_div {
  display: flex;
  overflow: hidden;
  flex-wrap: wrap;
  padding: 10px 0;
}

.collapse_input_cell_box {
  display: flex;
  flex-wrap: nowrap;
}
.collapse_input_cell_box_area {
  width: 100%;
  display: flex;
  flex-wrap: nowrap;
  padding: 0 5%;
  height: 80px;
  align-items: center;
}
.collapse_input_cell_box_area .input_after_div {
  width: 84%;
}
.el-input {
  flex: 1;
  width: 80%;
}
.tag_span {
  cursor: pointer;
  display: inline-block;
  line-height: 1;
  white-space: nowrap;
  cursor: pointer;
  background: #fff;
  border: 1px solid #dcdfe6;
  color: #606266;
  -webkit-appearance: none;
  text-align: center;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  outline: 0;
  margin: 0;
  -webkit-transition: 0.1s;
  transition: 0.1s;
  font-weight: 500;
  padding: 12px 20px;
  font-size: 14px;
  border-radius: 4px;
  margin-right: 10px;
  position: relative;
}
.delete_tag {
  position: absolute;
  top: -8px;
  right: -8px;
  display: block;
  background-color: #ddd;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  flex-wrap: center;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}
.collapse_input_cell_box {
  width: 29%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  // height: 50px;
  padding: 0.2% 3%;
}
.collapse_input_cell_box .input_befor_text {
  width: 5em;
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
}
.head_nav_select_t {
  margin-right: 20px;
  display: flex;
  align-items: center;
}
.input_befor_text {
  width: 120px;
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



