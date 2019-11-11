<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav" ref="topInfo">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- 查询条件组 -->
      <!-- 主题内容左右结构 -->
      <div class="content_body_warp">
        <div class="content_body_warp_left" ref="tab">
          <el-tree :data="treeData" :props="defaultProps" @node-click="treeClick"></el-tree>
        </div>

        <div class="content_body_warp_right">
          <el-card class="attribute">
            <div class="category">
              <p style="color:#999;">商品品类:</p>
              <div class="categoryNums">
                <p
                  v-for="(item, index) in commoDitys"
                  :key="index"
                  :class="{activeColor:activeIndex == index}"
                  class="categoryItem"
                  @click="activeType(index,item)"
                >{{item.categoryName}}</p>
              </div>
            </div>
            <div class="page_head_div"></div>
            <!-- 按钮组 -->
            <div class="m-bottom btnStyle">
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
            <div class="table_list lvs">
              <!--  -->
              <el-table
                border
                :row-style="tableBodycolor"
                @selection-change="handleSelectionChange"
                :data="tabList"
                style="width: 100%;"
                :row-class-name="tableRowClassName"
              >
                <el-table-column type="selection" width="40" align="center"></el-table-column>
                <el-table-column
                  prop="classifyName"
                  align="center"
                  label="分类名称"
                  sortable
                  :filters="names"
                  :filter-method="filterName"
                >
                  <template slot-scope="scope">
                    <div>
                      <el-tooltip placement="right" visible-arrow>
                        <div slot="content" class="tips tipFon">
                          <p @click="editHandle(scope.row)" class="operaItems">编辑</p>
                          <p @click="addbrand(scope.row)" class="operaItems">添加下级</p>
                        </div>
                        <img :src="spot" alt class="attributesTips" />
                      </el-tooltip>
                      <p class="operation">{{scope.row.classifyName}}</p>
                    </div>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="isEnable"
                  label="状态"
                  align="center"
                  sortable
                  :filters="typess"
                  :filter-method="filterHandler"
                >
                  <template slot-scope="scope">
                    <span>{{scope.row.isEnable == 1 ? '启用' : '禁用'}}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="commodityCategoryName" align="center" label="品类" sortable></el-table-column>
                <el-table-column prop="parentName" align="center" label="上级分类" sortable></el-table-column>
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
          </el-card>
        </div>
      </div>
    </div>
    <!-- 弹框页面 新增分类-->
    <div class="dialog_con_box">
      <el-dialog :visible.sync="centerDialogVisible" width="40%">
        <div class="titlecals">新增分类</div>
        <div class="content_box">
          <div class="Dialog_input_cell">
            <span class="Dialog_input_cell_title">分类名称：</span>
            <div class="Dialog_input_cell_input">
              <el-input placeholder v-model="brandInfo.classifyName" maxlength="50"></el-input>
            </div>
          </div>

          <div class="Dialog_input_cell">
            <span class="Dialog_input_cell_title">商品品类：</span>
            <div class="Dialog_input_cell_input">
              <el-select v-model="brandInfo.commodityCategoryId" placeholder="请选择状态">
                <el-option
                  v-for="item in commoDitys"
                  :key="item.commodityCategoryId"
                  :label="item.categoryName"
                  :value="item.commodityCategoryId"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="Dialog_input_cell lastDialog_input_cell" style="align-items: top !important;">
            <span class="Dialog_input_cell_title">备注：</span>
            <div class="Dialog_input_cell_input">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                maxlength="200"
                resize="none"
                v-model="brandInfo.remarks"
              ></el-input>
            </div>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addCategory()">保 存</el-button>
          <el-button @click="centerDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 弹框页面 编辑分类-->
    <div class="dialog_con_box">
      <el-dialog title :visible.sync="editDialogVisible" width="40%">
        <div class="titlecals">编辑分类</div>
        <div class="content_box">
          <div class="Dialog_input_cell">
            <span class="Dialog_input_cell_title">分类名称：</span>
            <div class="Dialog_input_cell_input">
              <el-input placeholder v-model="brandInfo.classifyName" maxlength="50"></el-input>
            </div>
          </div>
          <div class="Dialog_input_cell lastDialog_input_cell" style="align-items: top !important;">
            <span class="Dialog_input_cell_title">备注：</span>
            <div class="Dialog_input_cell_input">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                maxlength="200"
                resize="none"
                v-model="brandInfo.remarks"
              ></el-input>
            </div>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="endEdit()">保 存</el-button>
          <el-button @click="editDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 弹框页面 子分类-->
    <div class="dialog_con_box">
      <el-dialog title="编辑分类" :visible.sync="addsubDialogVisible" width="40%">
        <div class="content_box">
          <div class="Dialog_input_cell">
            <span class="Dialog_input_cell_title">分类名称：</span>
            <div class="Dialog_input_cell_input">
              <el-input placeholder v-model="brandInfo.brandname" maxlength="50"></el-input>
            </div>
          </div>

          <div class="Dialog_input_cell">
            <span class="Dialog_input_cell_title">商品品类：</span>
            <div class="Dialog_input_cell_input">
              <el-select v-model="statuestyle" placeholder="请选择状态">
                <el-option
                  v-for="item in styleList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="Dialog_input_cell lastDialog_input_cell" style="align-items: top !important;">
            <span class="Dialog_input_cell_title">备注：</span>
            <div class="Dialog_input_cell_input">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                maxlength="200"
                v-model="brandInfo.note"
              ></el-input>
            </div>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="addsubDialogVisible = false">保 存</el-button>
          <el-button @click="addsubDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import breadcrumb from "../../components/breadcrumb";
import spot from "@/assets/images/spot.png";
import pagination from "../../components/pagination";
import {
  listClassify,
  listCategory,
  listSublevel,
  addClassify,
  editClassify,
  getClassify,
  IsEnable
} from "api/productmanage/goodsclassify/goodsclassify";
import { getNames, getTypes } from "src/utils/pubilcFn.js";

export default {
  // name: 'brandmanagement',
  components: {
    breadcrumb,
    pagination
  },
  data() {
    return {
      actives: "",
      //头部面包屑导航
      navList: [],
      spot, //图片
      treeData: [],
      commoDitys: [], //商品品类数据
      typess: [], //筛选数据
      activeIndex: 0,
      styleList: [],
      statuestyle: {}, //新增分类 选中品类数据
      tabList: [], //table数据
      //分页
      currentPage: 1, //当前页数
      pageSize: 20, //当前页最大条数
      total: 10, //总条数
      //查询内容
      searchtext: "",
      names: [],
      actionBtnList: [
        { name: "新增分类", type: 1, str: "goodsclassify_Add" },
        { name: "启用", type: 2, str: "goodsclassify_Enable" },
        { name: "禁用", type: 3, str: "goodsclassify_Prohibit" }
      ],
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      commodity: [
        { commodity: "橱柜" },
        { commodity: "橱柜" },
        { commodity: "橱柜" },
        { commodity: "橱柜" },
        { commodity: "橱柜" }
      ],
      //页面弹框
      Dialogtitle: "",
      centerDialogVisible: false,
      //编辑弹框
      editDialogVisible: false,
      //添加子分类
      addsubDialogVisible: false,
      //弹框页面数据
      brandInfo: {},
      //商品分类选中数据
      activeClassify: [],
      classifyObj: {},
      //选择属性值类型选择
      DialogbrandList: [
        { label: "手工录入", value: 1 },
        { label: "从列表里选择", value: 2 }
      ],
      handleList: [],
      //tree结构 props
      defaultProps: {
        label: function(data, node) {
          return data.classifyName;
        }
      },
      dataTree: [] //产品分类树形结构数据
    };
  },
  activated(){
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
    this.listCate();
  },
  // deactivated () {
  //   this.$destroy(true)
  // },
  // created() {},
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
  //   this.listCate();
  // },
  methods: {
    addCategory() {
      //添加分类
      if (JSON.stringify(this.brandInfo) == "{}") {
        this.$message.error("请输入内容");
        return;
      }
      if (
        Object.prototype.toString.call(this.activeClassify) == "[object Object]"
      ) {
        this.brandInfo.parentId = this.activeClassify.id;
        this.activeClassify.level == null ? 1 : this.activeClassify.level + 1;
      } else {
        if (this.activeClassify.length == 0) {
          this.brandInfo.parentId = -1;
        } else {
          this.brandInfo.parentId = this.activeClassify[0].parentId;
          this.activeClassify[0].level == null
            ? 1
            : this.activeClassify[0].level + 1;
        }
      }

      addClassify(this.brandInfo)
        .then(res => {
          this.centerDialogVisible = false;
          this.$message.success("操作成功");
          this.brandInfo = {};
          this.listCate();
        })
        .catch(error => {
          console.error("产品管理 添加分类", error);
        });
    },
    listTree(id) {
      //品类列表

      listClassify({
        commodityCategoryId: id
      })
        .then(res => {
          this.treeData = res.data;
          this.activeClassify = res.data;
          if (res.data.length !== 0) {
            this.getListData(res.data[0].commodityClassifyId);
          }
        })
        .catch(error => {
          console.error("产品管理 获取分类", error);
        });
    },
    screenSend() {
      this.names = getNames("classifyName", this.tabList); //调用筛选数据处理
      this.typess = getTypes("isEnable", this.tabList, "启用", "禁用"); //调用筛选数据处理
    },
    filterName(value, row, column) {
      //筛选方法调用
      const property = column["property"];
      return row[property] == value;
    },
    getClass(val) {
      //查看分类
      getClassify({ commodityClassifyId: val.commodityClassifyId })
        .then(res => {
          this.brandInfo = res.data;
        })
        .catch(error => {
          console.log(
            "产品管理 查看分类  productmanage/goodsclassify/index",
            error
          );
        });
    },
    endEdit() {
      //编辑分类
      editClassify(this.brandInfo)
        .then(res => {
          this.editDialogVisible = false;
          this.$message({ message: "操作成功", type: "success" });
          this.brandInfo = {};
          if (!(this.activeClassify instanceof Array)) {
            this.getListData(this.activeClassify.commodityClassifyId);
          } else {
            this.getListData(this.activeClassify[0].commodityClassifyId);
          }
        })
        .catch(error => {
          console.log(
            "产品管理 编辑分类  productmanage/goodsclassify/index",
            error
          );
          this.$message.error({ message: "操作失败" });
        });
    },
    activeType(index, item) {
      //品类点击事件

      this.activeIndex = index;
      this.treeData = [];
      this.classifyObj = item;
      this.listTree(item.commodityCategoryId);
    },
    treeClick(item) {
      //商品分类tree数据类型点击返回数据
      this.getListData(item.id);
      this.activeClassify = item;
    },
    listCate() {
      listCategory()
        .then(res => {
          //获取商品 品类
          this.commoDitys = res.data;
          if (this.classifyObj.commodityCategoryId) {
            this.listTree(this.classifyObj.commodityCategoryId);
          } else {
            this.listTree(this.commoDitys[0].commodityCategoryId);
          }
        })
        .catch(error => {
          console.error("产品管理 获取商品 分类列表", error);
        });
    },
    filterHandler(value, row, column) {
      //筛选方法调用
      value == "启用" ? (value = 1) : (value = 0);
      const property = column["property"];
      return row[property] === value;
    },
    //获取列表信息
    getListData(id) {
      listSublevel({
        commodityClassifyId: id
      })
        .then(res => {
          this.tabList = res.data;
          this.screenSend();
        })
        .catch(error => {
          console.log(
            "产品管理 获取列表 productmanage/goodsclassify/index",
            error
          );
        });
    },
    // 改变table头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background: #f8f8f8;border-color: #dddddd;";
      }
    },
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      // return "height: 80px"
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
    //勾选函数回调
    handleSelectionChange(val) {
      this.handleList = val;
    },
    //勾选函数回调
    dialoghandleSelectionChange(val) {},
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //查询按钮点击
    searchFun() {
      this.currentPage3 = 1;
    },
    //按钮组函数
    butGroupAction(type) {
      this.brandInfo = {};
      if (type == 1) {
        //弹框
        this.addbrand();
      } else if (type == 2) {
        //页面跳转
        this.setStatue(1);
      } else if (type == 3) {
        this.setStatue(0);
      }
    },
    setStatue(isE) {
      //启用和禁用
      if (this.handleList.length == 0) {
        this.$message.error("当前没有勾选!");
        return;
      }
      let strId = this.handleList
        .map(item => {
          return item.commodityClassifyId;
        })
        .join();
      let data = {
        ids: strId,
        dataType: "commodity_classify",
        IsEnable: isE
      };
      IsEnable(data)
        .then(res => {
          if (res.status == 200) {
            this.getListData(this.activeClassify.id);
          }
          // if (!(this.activeClassify instanceof Array)) {
          //   this.getListData(this.activeClassify.id);
          // } else {
          //   this.getListData(this.activeClassify[0].commodityClassifyId);
          // }
        })
        .catch(error => {
          console.error("启用和禁用", error);
        });
    },
    //添加新
    addbrand(row) {
      if (row) {
        console.log(row);
        this.activeClassify = row;
      }
      this.Dialogtitle = "新增商品属性";
      this.centerDialogVisible = true;

      // this.brandInfo.commodityCategoryId =this.commoDitys[this.activeIndex].categoryName;
    },
    //编辑
    editHandle(val) {
      this.Dialogtitle = "编辑商品属性";
      this.editDialogVisible = true;
      this.getClass(val);
    },

    //添加子类
    addsubHandle(row) {
      console.log(row);
      this.addsubDialogVisible = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.btnStyle {
  display: flex;
}
.page_head_div {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 15px;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  margin-bottom: 25px;
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
}
.content_body_warp_left {
  position: fixed;
  width: 230px;
  height: calc(100vh - 106px);
  z-index: 1;
  width: 230px;
  padding: 10px;
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
.dialog_con_box .left_form {
  width: 60%;
}
.dialog_con_box .right_logo {
  width: 40%;
}
.Dialog_input_cell {
  display: flex;
  flex-wrap: nowrap;
  height: 50px;
  align-items: center;
  width: 100%;
}
.lastDialog_input_cell {
  display: flex;
  flex-wrap: nowrap;
  height: 100px;
  align-items: top !important;
}
.mr-80 {
  margin-right: 80px;
}
.dialog_con_box .Dialog_input_cell .Dialog_input_cell_title {
  width: 100px;
  text-align: right;
  padding-right: 10px;
}
.Dialog_input_cell_input {
  flex: 1;
}
.Dialog_input_cell_input .el-select {
  width: 100%;
}
.toggle_box {
  border-top: 1px solid #dddddd;
  padding-top: 10px;
}
.category p {
  /* margin: 0; */
}
.activeColor {
  color: #006ec6;
}
.category {
  width: 100%;
  display: flex;
  flex-direction: row;
  margin-top: 20px;
}
.categoryNums {
  margin: 0;
  margin-left: 10px;
  width: calc(100% - 90px);
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  flex-wrap: wrap;
}
.category .categoryNums .categoryItem {
  margin: 0 20px 10px 0;
  cursor: pointer;
}
</style>
<style>
.dialog_table table {
  width: 100%;
}
</style>

