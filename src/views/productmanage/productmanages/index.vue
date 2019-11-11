<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav" ref="topInfo">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

      <!-- 主题内容左右结构 -->
      <div class="content_body_warp">
        <!-- 查询条件组 -->

        <div class="content_body_warp_left" ref="tab">
          <div class="warp_head_list m-margin10">
            <div class="head_nav_search">
              <el-input placeholder size="medium" v-model="searchtext"></el-input>
            </div>
            <div class="head_nav_btn">
              <el-button
                @click="category"
                type="warning"
                class="left_button button-fc"
                size="medium"
              >查询</el-button>
            </div>
          </div>
          <div
            v-for="(item,index) in categorys"
            :key="index"
            @click="btnList(item,index)"
            :class="item.flag?'listTitle listTitleBg':'listTitle'"
          >
            <span>{{item.categoryName}}</span>
            <i class="el-icon-arrow-right"></i>
          </div>
        </div>

        <div class="content_body_warp_right lvs">
          <el-card class="m-bottom">
            <!-- 查询条件组 -->
            <div class="head_list">
              <div class="input-vw">
                <el-input
                  placeholder="商品名称/商品编码"
                  v-model="bindInfo.commodityGroup"
                  maxlength="50"
                  size="medium"
                >
                  <i slot="suffix" class="el-input__icon el-icon-search"></i>
                </el-input>
              </div>
              <div class="input-vw">
                <el-select
                  v-model="bindInfo.commodityClassifyId"
                  placeholder="请选择产品分类"
                  size="medium"
                  class="width-100"
                >
                  <el-option
                    v-for="item in styleList"
                    :key="item.id"
                    :label="item.classifyName"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </div>
              <div class="input-vw">
                <el-select
                  v-model="bindInfo.brandId"
                  placeholder="请选择品牌"
                  size="medium"
                  class="width-100"
                >
                  <el-option
                    v-for="item in commodityBrand"
                    :key="item.brandId"
                    :label="item.brandName"
                    :value="item.brandId"
                  ></el-option>
                </el-select>
              </div>
              <div class="input-vw">
                <el-button type="warning" class="button-fc" size="medium" @click="searchFun">查询</el-button>
                <el-button type="primary" size="medium" @click="Reset">重置</el-button>
              </div>
            </div>
          </el-card>

          <!-- 分类按钮组按钮组 -->
          <!-- <ul class="tabtop m-left20">
            <li v-for="(itm, idx) in filterBtnList" :key="idx" @click="butGroupfilter(itm.type,idx)" :class="[tabstatus===idx ? 'checkclass': '']">{{itm.name}}（{{itm.num}}）</li>
          </ul>-->
          <el-tabs v-model="activeName" type="border-card" @tab-click="handleClick">
            <el-tab-pane
              :label="item.name+`（${item.num}）`"
              :name="item.str"
              v-for="(item, index) in filterBtnList"
              :key="index"
            ></el-tab-pane>
            <!-- 按钮组 -->
            <div class="warp_head_action_btn">
              <div v-for="(item,index) in actionBtnList" :key="index">
                <el-button
                  v-if="btnJurisdiction[item.str]"
                  type="default"
                  size="small"
                  class="button-96 m-left10"
                  @click="butGroupAction(item.type)"
                >{{item.name}}</el-button>
              </div>
            </div>
            <!-- 表格 -->
            <div class="table_list" v-loading="loading">
              <!--  -->
              <el-table
                border
                :row-style="tableBodycolor"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :data="tabList"
                style="width: 100%;"
              >
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column
                  prop="productName"
                  align="center"
                  label="产品名称"
                  width="210"
                  sortable
                  :filters="names"
                  :filter-method="filterName"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <div>
                      <el-tooltip placement="right" visible-arrow>
                        <div slot="content" class="tips tipFon">
                          <p @click="editHandle(scope.row)" class="operaItems">编辑</p>
                        </div>
                        <img :src="spot" alt class="attributesTips" />
                      </el-tooltip>
                      <p class="operation">{{scope.row.productName}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="status"
                  label="状态"
                  width="200"
                  align="center"
                  sortable
                  :filters="typess"
                  :filter-method="filterHandler"
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span v-if="scope.row.status==0">在产</span>
                    <span v-else-if="scope.row.status==1">预计停产</span>
                    <span v-else>停产</span>
                  </template>
                </el-table-column>
                <!-- <el-table-column prop="productCode" label="产品编码" width="200" align="center" sortable></el-table-column> -->
                <el-table-column
                  prop="productId"
                  label="产品编码"
                  width="200"
                  align="center"
                  sortable
                  show-overflow-tooltip
                ></el-table-column>
                <!-- <el-table-column prop="productName" label="产品名称" width="200" align="center" sortable ></el-table-column> -->
                <el-table-column
                  prop="categoryName"
                  label="产品品类"
                  width="200"
                  align="center"
                  sortable
                  show-overflow-tooltip
                ></el-table-column>
                <el-table-column
                  prop="classifyName"
                  label="产品分类"
                  width="200"
                  align="center"
                  sortable
                  show-overflow-tooltip
                ></el-table-column>

                <el-table-column
                  prop="isUpperShelf"
                  label="上下架状态"
                  width="200"
                  align="center"
                  sortable
                  show-overflow-tooltip
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.isUpperShelf == 0 ? '下架' : '上架'}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="labelName"
                  label="标签"
                  width="200"
                  align="center"
                  sortable
                  show-overflow-tooltip
                ></el-table-column>
              </el-table>
            </div>
          </el-tabs>
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
      <el-dialog :visible.sync="dialogModel" width="20%">
        <div class="titlecals">{{Dialogtitle}}</div>
        <div style="text-align:center;" class="pl-20">
          <el-select v-model="selectVal" placeholder="请选择操作" class="width-100">
            <el-option
              v-for="item in selectList"
              :key="item.val"
              :label="item.label"
              :value="item.val"
            ></el-option>
          </el-select>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogModel = false">取 消</el-button>
          <el-button type="primary" @click="sendJava">确 定</el-button>
        </div>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import breadcrumb from "../../components/breadcrumb";
import pagination from "../../components/pagination";
import spot from "@/assets/images/spot.png";
import { listCategory } from "api/pulicJava";
import {
  querys,
  editStatus,
  editUpper,
  countProduct,
  listClassify,
  listBrand
} from "api/productmanage/productmanages/productmanages";
import { getNames, getTypes } from "src/utils/pubilcFn.js";
export default {
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      activeName: "all",
      Shelfstate: null,
      bindInfo: {},
      //头部面包屑导航
      navList: [],
      categorys: [], //品类数据
      spot, //图片
      id: null, //当前产品类别id
      typess: [], //筛选数据
      names: [], //筛选数据
      tabList: [], //列表数据
      currentPage: 1, //当前页数
      pageSize: 20, //当前页最大条数
      total: 0, //总条数
      checks: [], //tab单选 返回数据
      Dialogtitle: "", //弹框标题
      dialogModel: false, //弹框shows
      selectVal: "", //修改 上下架及状态数据
      selectList: [],
      commodityBrand: [],
      loading: true,
      //查询内容
      searchtext: "",
      //状态查询
      statuestyle: "",
      styleList: [],
      //过滤按钮组
      filterBtnList: [
        { name: "全部产品", type: null, num: 0, str: "all" },
        { name: "已上架", type: 1, num: 0, str: "already" },
        { name: "未上架", type: 0, num: 0, str: "not" }
      ],
      //过滤按钮激活flag
      filterbtn: 0,
      //页面操作按钮list
      actionBtnList: [
        { name: "新增产品", type: 1, str: "productmanages_Add" },
        // { name: "批量导入", type: 2 },
        { name: "批量修改状态", type: 3, str: "productmanages_modifystate" },
        { name: "批量上/下架", type: 4, str: "productmanages_Uppershelf" }
      ],
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      //ztree属性的列表
      data: [
        {
          label: "一级 1",
          children: [
            {
              label: "二级 1-1",
              children: [
                {
                  label: "三级 1-1-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 2",
          children: [
            {
              label: "二级 2-1",
              children: [
                {
                  label: "三级 2-1-1"
                }
              ]
            },
            {
              label: "二级 2-2",
              children: [
                {
                  label: "三级 2-2-1"
                }
              ]
            }
          ]
        },
        {
          label: "一级 3",
          children: [
            {
              label: "二级 3-1",
              children: [
                {
                  label: "三级 3-1-1"
                }
              ]
            },
            {
              label: "二级 3-2",
              children: [
                {
                  label: "三级 3-2-1"
                }
              ]
            }
          ]
        }
      ],
      defaultProps: {
        children: "children",
        label: "label"
      }
    };
  },
  activated(){
    this.category();
    this.getListData();
    this.getBrand();

    let topH = this.$refs.topInfo.offsetHeight;
    let tabH = this.$refs.tab;
    let height = topH + 52;
    window.onscroll = function() {
      let winscrollTop = document.documentElement.scrollTop;
      if (winscrollTop + 40 > height) {
        tabH.setAttribute("style", "top:10px !important;height:100vh;");
      } else {
        tabH.setAttribute("style", `top:${height}px !important`);
      }
    };
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  // deactivated () {
  //   this.$destroy(true)
  // },
  // created() {
  //   this.category();
  //   this.getListData();
  //   this.getBrand();
  // },
  // mounted() {
  //   let topH = this.$refs.topInfo.offsetHeight;
  //   let tabH = this.$refs.tab;
  //   let height = topH + 52;
  //   window.onscroll = function() {
  //     let winscrollTop = document.documentElement.scrollTop;
  //     if (winscrollTop + 40 > height) {
  //       tabH.setAttribute("style", "top:10px !important;height:100vh;");
  //     } else {
  //       tabH.setAttribute("style", `top:${height}px !important`);
  //     }
  //   };
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  // },
  methods: {
    handleClick(tab, event) {
      let type = this.filterBtnList.filter(item => {
        return item.str == this.activeName;
      })[0].type;
      this.butGroupfilter(type);
    },
    getBrand() {
      //获取分类
      listBrand()
        .then(res => {
          this.commodityBrand = res.data;
        })
        .catch(error => {
          console.error("获取品牌", error);
        });
    },
    category() {
      //获取产品品类
      let data = {
        categoryName: this.searchtext
      };
      listCategory(data)
        .then(res => {
          this.categorys = res.data;
          this.btnList(this.categorys[0]);
        })
        .catch(error => {
          console.error(
            "产品管理：获取商品品类公共接口 productmanage/productmanages/addproducts"
          );
        });
    },
    btnList(item, i = 0) {
      //获取品类获取列表数据
      this.categorys.forEach((attr, index) => {
        if (index == i) {
          attr.flag = true;
        } else {
          attr.flag = false;
        }
      });
      this.id = item.commodityCategoryId;
      this.getListData(null, null, null, null, this.id); //获取列表数据
      this.filterBtnList.forEach((value, index, array) => {
        value.num = 0;
      });
      this.getclassification();
      countProduct({
        commodityCategoryId: this.id
      })
        .then(res => {
          res.data.forEach((value, index, array) => {
            this.filterBtnList[index].num = value.dataSize;
          });
        })
        .catch(error => {
          console.error(
            "产品管理：获取产品商家数量 productmanage/productmanages/addproducts"
          );
        });
    },
    sendJava() {
      //批量修状态 上下架 据接口
      let data = {};
      var fn;

      if (this.checks.length == 0 || this.selectVal === "") {
        this.$message.error("你未勾选或者未选择");
        return;
      }

      if (this.Dialogtitle == "批量修改状态") {
        data.status = this.selectVal;
      } else {
        data.isUpperShelf = this.selectVal;
      }

      data.productIds = this.checks
        .map(item => {
          return item.productId;
        })
        .join();
      this.Dialogtitle == "批量修改状态" ? (fn = editStatus) : (fn = editUpper);
      fn(data)
        .then(res => {
          this.dialogModel = false;
          this.getListData(null, null, null, null, this.id);
          this.$message({ message: "操作成功", type: "success" });
          this.selectVal = "";
        })
        .catch(res => {
          console.error(
            "产品管理：修改状态 上下架 productmanage/productmanages/index"
          );
        });
    },
    filterHandler(value, row, column) {
      //筛选方法调用
      value == "预计停产" ? (value = 1) : (value = 0);
      const property = column["property"];
      return row[property] == value;
    },
    filterName(value, row, column) {
      //筛选方法调用
      const property = column["property"];
      return row[property] == value;
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    getclassification() {
      //获取分类
      listClassify({
        commodityCategoryId: this.id
      })
        .then(res => {
          this.styleList = res.data;
        })
        .catch(error => {
          console.error("获取商品分类", error);
        });
    },
    //获取列表信息
    getListData(
      names = null,
      type = null,
      barn = null,
      Upper = null,
      id = null
    ) {
      let data = {
        ...this.bindInfo,
        isUpperShelf: this.Shelfstate, //上下状态
        commodityCategoryId: id, //品类id
        page: this.currentPage, //当前页
        limit: this.pageSize //分页数量
      };
      querys(data)
        .then(res => {
          if (res.status == 200) {
            this.tabList = res.data.rows;
            this.total = res.data.total;
            this.loading = false;
            this.screenSend();
          }
        })
        .catch(error => {
          console.error(
            "产品管理:获取列表 productmanage/productmanages/index",
            error
          );
        });
    },
    screenSend() {
      this.names = getNames("productName", this.tabList); //调用筛选数据处理
      this.typess = getTypes("status", this.tabList, "在产", "预计停产"); //调用筛选数据处理
    },
    currentChange(val) {
      //翻页方法
      this.currentPage = val;
      this.getListData();
    },
    sizeChange(val) {
      //翻页方法
      this.currentPage = 1;
      this.pageSize = val;
      this.getListData();
    },

    // 改变table头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background: #f8f8f8;border-color: #dddddd";
      }
    },
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      // return "height: 80px";
    },
    //分页函数回调
    handleCurrentChange(val) {
      this.currentPage3 = val;
      this.getData();
    },
    //勾选函数回调
    handleSelectionChange(val) {
      this.checks = val;
    },
    //查询按钮点击
    searchFun() {
      this.currentPage = 1;
      this.getListData();
    },
    Reset() {
      //重置
      this.beforIn = {};
    },
    //filterbun
    butGroupfilter(type) {
      this.Shelfstate = type;
      if (type == 0) {
        this.getListData(null, null, null, null, this.id);
      } else if (type == 1) {
        this.getListData(null, null, null, null, this.id);
      } else {
        this.getListData(null, null, null, null, this.id);
      }
    },
    //按钮组函数
    butGroupAction(type) {
      if (type == 1) {
        //页面跳转
        this.addbrand();
      } else if (type == 2) {
      } else if (type == 3) {
        this.eidStatus(0);
      } else {
        this.eidStatus(1);
      }
    },
    eidStatus(index) {
      //批量修改 状态 上下架弹框展示数据
      if (index == 0) {
        this.Dialogtitle = "批量修改状态";
        this.selectList = [
          { label: "预计停产", val: 1 },
          { label: "在产", val: 0 },
          { label: "停产", val: 2 }
        ];
      } else {
        this.Dialogtitle = "批量上/下架";
        this.selectList = [
          { label: "下架", val: 0 },
          { label: "上架", val: 1 }
        ];
      }
      this.dialogModel = true;
    },

    //添加新
    addbrand() {
      let data = {
        ...this.bindInfo,
        isUpperShelf: this.Shelfstate,
        commodityCategoryId: this.id
      };
      this.$router.push({ path: "addproducts", query: data });
    },
    //编辑
    editHandle(row) {
      console.log(row);
      this.$router.push({
        path: "editproducts",
        query: { productId: row.productId, commodityCategoryId: this.id }
      });
    },
    //编辑
    setStatue(row, type) {
      console.log(row);
      this.$router.push({ path: "scalegoods", query: { id: row.id } });
    },
    //查看
    seeHandle(row) {
      console.log(row);
      this.$router.push({ path: "scalebrand", query: { id: row.id } });
    }
  }
};
</script>
<style scoped lang='scss'>
.listTitleBg {
  background: #409eff;
  color: #fff;
}
.head_list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.input-vw {
  width: calc(((92.5vw - 490px)) / 4);
  margin-bottom: 20px;
  float: left;
  position: relative;
  display: flex;
  align-items: center;
  div {
    flex: 1;
  }
}
.left_button {
  margin-left: 10px;
}
.productHeader {
  width: 15vh;
}
.pagination_wrap {
  text-align: center;
  height: 50px;
  /* line-height: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
}
.content_body_warp {
  display: flex;
  flex-wrap: nowrap;
  position: relative;
}
.table_list {
  width: 100%;
}
.content_body_warp .content_body_warp_left {
  position: fixed;
  width: 230px;
  height: calc(100vh - 106px);
  z-index: 1;
  padding: 0px;
  border: 1px solid #dddddd;
  margin-right: 10px;
  border-radius: 4px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
  overflow-y: auto;
  transition: top 0.2s;
}
.content_body_warp .content_body_warp_right {
  flex: 1;
  overflow-x: hidden;
  margin-left: 240px;
}
.table_action_span {
  color: rgb(127, 221, 228);
  cursor: pointer;
}

.dialog_con_box {
}
.dialog_con_box .content_box {
  display: flex;
  flex-wrap: wrap;
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
.warp_head_action_btn {
  display: flex;
}

.toggle_box {
  border-top: 1px solid #dddddd;
  padding-top: 10px;
}
.table_style {
  overflow-x: scroll;
}
.warp_head_list {
  padding: 10px 0;
}
</style>
<style>
.dialog_table table {
  width: 100%;
}
.listTitle {
  height: 40px;
  line-height: 40px;
  color: #666;
  cursor: pointer;
  border-bottom: 1px solid #ebeef5;
  font-size: 13px;
  font-weight: 500;
  outline: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0px 15px;
}
.listTitle_icon {
  float: right;
  margin: 0 8px 0 auto;
  font-weight: 300;
  color: #303133;
  cursor: pointer;
  font-family: element-icons !important;
  speak: none;
  font-style: normal;
  font-variant: normal;
  text-transform: none;
  line-height: 1;
  vertical-align: baseline;
  display: inline-block;
  -webkit-font-smoothing: antialiased;
}
.listTitle_icon:before {
  content: "\E604";
  box-sizing: inherit;
}
</style>

