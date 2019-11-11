<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- 查询条件组 -->
      <el-card class="m-bottom20">
        <el-row :gutter="10" class="queryForm">
          <el-col :span="span">
            <el-input placeholder="品牌名称" :size="size" v-model="searchtext" maxlength="50" clearable></el-input>
          </el-col>
          <el-col :span="span">
            <el-select v-model="statuestyle" placeholder="状态" :size="size" clearable>
              <el-option
                v-for="item in styleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="span">
            <el-select v-model="brandstyle" placeholder="品牌类型" :size="size" clearable>
              <el-option
                v-for="item in brandList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-col>
          <el-col :span="span">
            <el-button @click="searchFun" type="warning" class="button-fc" :size="size">查询</el-button>
            <el-button @click="reset" type="primary" :size="size">重置</el-button>
          </el-col>
        </el-row>
      </el-card>
      <el-card class="attribute">
        <div class="m-bottom20 btnStyle">
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
        <div class="table_list">
          <!-- 表格主干 -->
          <el-table
            border
            :row-style="tableBodycolor"
            :row-class-name="tableRowClassName"
            @selection-change="handleSelectionChange"
            :data="tabList"
            :max-height="maxHeight"
          >
            <el-table-column type="selection" width="40" align="center"></el-table-column>
            <el-table-column
              prop="brandName"
              align="center"
              label="品牌名称"
              sortable
              :filters="names"
              :filter-method="filterSandler"
            >
              <template slot-scope="scope">
                <div>
                  <el-tooltip placement="right" visible-arrow>
                    <div slot="content" class="tips tipFon">
                      <p @click="editHandle(scope.row)" class="operaItems">编辑</p>
                      <p
                        @click="setStatue(scope.row,0)"
                        v-if=" scope.row.isEnable==1 "
                        class="operaItems"
                      >停用</p>
                      <p @click="setStatue(scope.row,1)" v-else class="operaItems">启用</p>
                      <p @click="seeHandle(scope.row)" class="operaItems">查看</p>
                    </div>
                    <img :src="spot" alt class="attributesTips" />
                  </el-tooltip>
                  <p class="operation">{{scope.row.brandName}}</p>
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
            <el-table-column prop="brandType" align="center" label="品牌类型" sortable>
              <template slot-scope="scope">
                <span>{{scope.row.brandType == 1 ? '合作商' : '自营'}}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column prop="contactsName" align="center" label="联系人" sortable></el-table-column>
            <el-table-column prop="phone" align="center" label="联系人电话" sortable></el-table-column>-->
          </el-table>
          <!-- 分页条 -->
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
    <!-- 弹框页面 -->
    <div class="dialog_con_box">
      <el-dialog
        :title="Dialogtitle"
        :visible.sync="centerDialogVisible"
        custom-class="customDialogTitle"
        width="40%"
      >
        <div class="content_box">
          <div class="left_form">
            <div class="Dialog_input_cell">
              <span class="Dialog_input_cell_title">品牌名称：</span>
              <div class="Dialog_input_cell_input">
                <el-input placeholder="品牌名称" v-model="brandInfo.brandName" clearable :size="size"></el-input>
              </div>
            </div>
            <div class="Dialog_input_cell">
              <span class="Dialog_input_cell_title">品牌类型：</span>
              <div class="Dialog_input_cell_input">
                <el-select
                  v-model="brandInfo.brandType"
                  placeholder="品牌类型"
                  class="width-100"
                  clearable
                  :size="size"
                >
                  <el-option
                    v-for="item in DialogbrandList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </div>
            </div>
            <div class="Dialog_input_cell lastDialog_input_cell">
              <span class="Dialog_input_cell_title">备注：</span>
              <div class="Dialog_input_cell_input">
                <el-input
                  type="textarea"
                  :rows="2"
                  placeholder="请输入内容"
                  maxlength="200"
                  resize="none"
                  v-model="brandInfo.remarks"
                  clearable
                  :size="size"
                ></el-input>
              </div>
            </div>
          </div>
          <div class="right_logo">
            <el-upload
              list-type="picture-card"
              class="upload-demo"
              action="string"
              :limit="1"
              :http-request="uploadSectionFile"
              :file-list="fileList"
              :on-remove="handleRemove"
            >
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </div>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="sendJava()">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import breadcrumb from "@/views/components/breadcrumb";
import spot from "@/assets/images/spot.png";
import pagination from "@/views/components/pagination";
import { mapGetters } from "vuex";
import {
  querys,
  addBrandn,
  isEnable,
  editBrand,
  getBrand
} from "api/productmanage/brandmanagement/brandmanagement";
import { getNames, getTypes } from "src/utils/pubilcFn.js";

import { put } from "@/utils/pubilcFn";
import ElCard from "element-ui/packages/card/src/main";
export default {
  // name: 'brandmanagement',
  components: {
    ElCard,
    breadcrumb,
    pagination
  },
  data() {
    return {
      span: 6,
      Price: {},
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      spot,
      //头部面包屑导航
      navList: [],
      names: [], //筛选数据
      selections: [], //表单复选框数据
      typess: [], //筛选数据
      tabList: [], //列表数据
      //查询内容
      searchtext: "",
      //状态查询
      statuestyle: "",
      styleList: [{ label: "启用", value: 1 }, { label: "禁用", value: 0 }],
      //品牌类型
      brandstyle: "",
      brandList: [{ label: "自营", value: 0 }, { label: "合作商", value: 1 }],
      //页面操作按钮list
      actionBtnList: [
        { name: "新增品牌", type: 1, str: "brandmanagement_Add" },
        { name: "启用", type: 2, str: "brandmanagement_Enable" },
        { name: "停用", type: 3, str: "brandmanagement_Prohibit" }
      ],
      btnJurisdiction: {},
      //页面弹框
      Dialogtitle: "",
      centerDialogVisible: false,
      brandInfo: {}, //新增品牌 编辑品牌 弹框页面数据
      //选择品牌类型
      DialogbrandList: [
        { label: "自营", value: "0" },
        { label: "合作商", value: "1" }
      ],
      //文件上传
      dialogImglist: [],
      upLoadList: [],
      fileUrl: "",
      sourceName: "",
      fileList: [],
      imgList: []
    };
  },
  activated(){
    this.getListData(); //获取列表数据
    if (!JSON.parse(this.$loca.getItem("element"))) {
      this.btnJurisdiction = {
        brandmanagement_Add: false,
        brandmanagement_Enable: false,
        brandmanagement_Prohibit: false
      };
    } else {
      this.btnJurisdiction = JSON.parse(this.$loca.getItem("element"));
    }

    // 头部面包屑
    this.navList = this.$route.meta;
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  // created() {
  //   this.getListData(); //获取列表数据
  // },
  // mounted() {
  //   if (!JSON.parse(this.$loca.getItem("element"))) {
  //     this.btnJurisdiction = {
  //       brandmanagement_Add: false,
  //       brandmanagement_Enable: false,
  //       brandmanagement_Prohibit: false
  //     };
  //   } else {
  //     this.btnJurisdiction = JSON.parse(this.$loca.getItem("element"));
  //   }

  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  // },
  methods: {
    reset() {
      this.searchtext = "";
      this.statuestyle = "";
      this.brandstyle = "";
    },
    //获取列表信息
    getListData() {
      let data = {
        names: this.searchtext, //品牌名称/联系人/联系人电话
        brandType: this.brandstyle,
        isEnable: this.statuestyle, //状态
        page: this.currentPage, //当前页
        limit: this.pageSize //分页数量
      };
      querys(data)
        .then(res => {
          this.tabList = res.data.rows;
          this.total = res.data.total;
          this.getInfos(this.tabList);
        })
        .catch(error => {
          console.log("品牌管理:获取列表信息接口", error);
        });
    },
    setStatue(val, type) {
      //设置停用 启用状态
      var strId = [];
      Array.isArray(val) ? (strId = val) : strId.push(val);
      strId = strId
        .map(item => {
          return item.brandId;
        })
        .join();
      let data = {
        ids: strId,
        dataType: "brand",
        IsEnable: type
      };
      isEnable(data)
        .then(res => {
          this.getListData(); //刷新状态后获取列表数据
          this.$message({ message: "操作成功", type: "success" });
        })
        .catch(error => {
          console.log("品类管理：停用启用接口", error);
          this.$message.error("操作失败");
        });
    },
    getInfos(val) {
      this.typess = getTypes("isEnable", val, "启用", "禁用"); //调用筛选数据处理
      this.names = getNames("brandName", val); //调用筛选数据处理
    },

    cancel() {
      this.centerDialogVisible = false;
      this.fileList = [];
    },
    sendJava() {
      if (this.Dialogtitle == "新增品牌") {
        if (this.brandstyle == "") {
          this.brandInfo.brandType = "0";
        }
        addBrandn(this.brandInfo)
          .then(res => {
            this.centerDialogVisible = false;
            this.getListData(); //获取列表数据
            this.brandInfo = {};
            this.fileList = [];
          })
          .catch(error => {
            console.log("品牌管理:新增商品", error);
          });
      } else {
        editBrand(this.brandInfo)
          .then(res => {
            this.centerDialogVisible = false;
            this.getListData(); //获取列表数据
            this.brandInfo = {};
            this.fileList = [];
          })
          .catch(error => {
            console.log("品牌管理:编辑商品", error);
          });
      }
    },
    sizeChange(val) {
      //翻页方法
      this.currentPage = 1;
      this.pageSize = val;
      this.getListData();
    },
    currentChange(val) {
      //翻页方法
      this.currentPage = val;
      this.getListData();
    },

    uplodError(err, file, fileList) {
      //图片上传失败回调
      console.log(err, file, fileList);
    },
    filterHandler(value, row, column) {
      //筛选方法调用
      value == "启用" ? (value = 1) : (value = 0);
      const property = column["property"];
      return row[property] === value;
    },
    filterSandler(value, row, column) {
      //筛选方法调用
      const property = column["property"];
      return row[property] === value;
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    // 改变table头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background: #f8f8f8;border-color: #dddddd";
      }
    },
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      // return "height: 80px"
    },
    //勾选函数回调
    handleSelectionChange(val) {
      this.selections = val;
    },
    //查询按钮点击
    searchFun() {
      this.currentPage = 1;
      this.getListData();
    },
    //按钮组函数
    butGroupAction(type) {
      if (type == 1) {
        //弹框
        this.addbrands();
      } else if (type == 2) {
        this.typeOfArray(1);
      } else if (type == 3) {
        this.typeOfArray(0);
      }
    },
    typeOfArray(type) {
      //判断是启用 禁用 是否为复选数据
      if (this.selections.length < 1) {
        this.$message.error("请勾选!");
        return;
      }
      if (this.selections.length != 0) {
        this.setStatue(this.selections, type);
        this.selections = [];
      } else {
        this.setStatue(this.tabList, type);
      }
    },
    //添加新
    addbrands(row) {
      this.brandInfo = { brandType: "0" };
      this.Dialogtitle = "新增品牌";
      this.centerDialogVisible = true;
    },
    //编辑
    editHandle(val) {
      this.brandInfo = {};
      getBrand({
        brandId: val.brandId
      })
        .then(res => {
          this.Dialogtitle = "编辑品牌";
          this.centerDialogVisible = true;
          this.brandInfo = res.data;
          this.fileList = [{ url: res.data.brandUrl }];
        })
        .catch(error => {
          console.log("品牌管理:查看品牌", error);
        });
    },
    //查看
    seeHandle(val) {
      this.$router.push({ path: "scalebrand", query: { id: val.brandId } });
    },
    //上传
    uploadSectionFile(res) {
      put(res).then(data => {
        this.imgList.push(data);
        this.brandInfo.brandUrl = data.url;
        this.sourceName = data.name;
      });
    },
    //刪除
    handleRemove(a, b) {
      let lengs = String(a.uid).length;
      this.imgList = this.imgList.filter(item => {
        let str = item.name.substring(0, lengs);
        return str !== String(a.uid);
      });
    }
  },
  computed: {
    ...mapGetters(["maxHeight", "size", "btnSize"])
  }
};
</script>
<style scoped lang='scss'>
.btnStyle {
  display: flex;
}
.head_list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.table_action_span {
  color: rgb(127, 221, 228);
  cursor: pointer;
}
.dialog_con_box .content_box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.dialog_con_box .left_form {
  width: 60%;
}
.dialog_con_box .right_logo {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40%;
}
.Dialog_input_cell {
  display: flex;
  flex-wrap: nowrap;
  height: 36px;
  margin-bottom: 10px;
}
.left_form > .lastDialog_input_cell {
  display: flex;
  flex-wrap: nowrap;
  height: 100px;
  align-items: top !important;
}
.dialog_con_box .Dialog_input_cell .Dialog_input_cell_title {
  width: 100px;
  text-align: right;
  padding-right: 10px;
  line-height: 36px;
}
.Dialog_input_cell_input {
  flex: 1;
}
.right_logo .img_logo {
  //  display: flex;
  // justify-content: center;
  // align-items: center;
  background: #ecedf0;
  overflow: hidden;
  margin-right: 20px;
  border: 1px solid #b7b9bb;
  width: 150px;
  height: 150px;
  padding: 10px 10px 25px;
  img {
    width: 100%;
    height: 100%;
  }
}
</style>

