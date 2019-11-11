<template>
  <div class="wrapper" ref="wapp">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- 查询条件组 -->
      <el-card class="attribute lvs">
        <div class="head_list">
          <div class="input-vw">
            <el-input
              placeholder="品牌名称/联系人/联系人电话"
              size="medium"
              v-model="searchtext"
              class="width-100"
            ></el-input>
          </div>
          <div class="input-vw">
            <el-select v-model="statuestyle" size="medium" placeholder="请选择状态" class="width-100">
              <el-option
                v-for="item in styleList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </div>
          <div class="input-vw">
            <el-button type="warning" class="button-fc" size="medium" @click="searchFun">查询</el-button>
            <el-button type="primary" size="medium" @click="reset">重置</el-button>
          </div>
          <div class="input-vw"></div>
        </div>
        <div class="h-width"></div>
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
        <!--  -->
        <el-table
          :row-style="tableBodycolor"
          @selection-change="handleSelectionChange"
          :data="tabList"
          style="width: 100%;"
          border
          :row-class-name="tableRowClassName"
        >
          <el-table-column type="selection" width="40"></el-table-column>
          <el-table-column
            prop="categoryName"
            align="center"
            label="品类名称"
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
                    >禁用</p>
                    <p @click="setStatue(scope.row,1)" v-else class="operaItems">启用</p>
                    <!-- <p @click="setModel(scope.row)" class="operaItems">设置模板</p> -->
                  </div>
                  <img :src="spot" alt class="attributesTips" />
                </el-tooltip>
                <p class="operation">{{scope.row.categoryName}}</p>
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
          <el-table-column prop="brandtype" align="center" label="关联属性" sortable>
            <template slot-scope="scope">
              <span class="table_action_span" @click="seeConnect(scope.row)">查看属性</span>
            </template>
          </el-table-column>
          <el-table-column prop="remarks" label="描述" align="center" sortable></el-table-column>
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
      </el-card>
    </div>
    <!-- 弹框页面 新增-->
    <div class="attributValue">
      <el-dialog :visible.sync="centerDialogVisible" width="70%">
        <div class="titlecals">{{Dialogtitle}}</div>
        <div class="content_box">
          <shuttleManiac ref="mychild" v-if="DestroyIncomeStatistics" :category="category"></shuttleManiac>
          <div style="width:100%;height:20px"></div>
          <div class="Dialog_input_cell lastDialog_input_cell" style="align-items: top !important;">
            <span class="Dialog_input_cell_title">备注：</span>
            <div class="Dialog_input_cell_input">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                maxlength="200"
                resize="none"
                v-model="brandInfo"
              ></el-input>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="subFn()">保 存</el-button>
          <el-button @click="centerDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 弹框页面 编辑-->
    <div class="attributValue">
      <el-dialog :visible.sync="EdiuStatistics" width="70%">
        <div class="titlecals">{{Dialogtitle}}</div>
        <div class="content_box">
          <ediu ref="edius" :getTabVal="getTabVal" v-if="eiduModel"></ediu>
          <div style="width:100%;height:20px"></div>
          <div class="Dialog_input_cell lastDialog_input_cell" style="align-items: top !important;">
            <span class="Dialog_input_cell_title">备注：</span>
            <div class="Dialog_input_cell_input">
              <el-input
                type="textarea"
                :rows="3"
                placeholder="请输入内容"
                maxlength="200"
                resize="none"
                v-model="brandInfo"
              ></el-input>
            </div>
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="subFns()">保 存</el-button>
          <el-button @click="EdiuStatistics = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 模板弹框 -->
    <div class="dialog_con_box">
      <el-dialog :visible.sync="modelDialogVisible" width="40%">
        <div class="titlecals">商品导入模板</div>
        <div class="content_box">
          <el-table
            :header-cell-style="tableHeaderColor"
            :row-style="tableBodycolor"
            :data="tabList"
            style="width: 100%;"
            border
          >
            <el-table-column prop="phone" label="excel字段名">
              <template slot-scope="scope">
                <el-input placeholder v-model="scope.row.name" maxlength="50"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="phone" label="系统字段名"></el-table-column>
            <el-table-column prop="phone" label="字段类型"></el-table-column>
            <el-table-column prop="phone" label="是否必填" width="200">
              <template slot-scope="scope">
                <el-select v-model="scope.row.ismust" placeholder="请选择品牌类型">
                  <el-option label="是" value="1"></el-option>
                  <el-option label="否" value="2"></el-option>
                </el-select>
              </template>
            </el-table-column>

            <el-table-column prop="phone" label="描述" max-width="200">
              <template slot-scope="scope">
                <el-input placeholder v-model="scope.row.note" maxlength="50"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </div>

        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="modelDialogVisible = false">保 存</el-button>
          <el-button @click="modelDialogVisible = false">取 消</el-button>
        </span>
      </el-dialog>
    </div>

    <!-- 关联属性 -->
    <div class="dialog_con_box">
      <el-dialog :visible.sync="connectDialogVisible" width="40%">
        <div class="titlecals">商品导入模板</div>
        <seeAttribute :getAtter="getAtter" v-if="connectDialogVisible"></seeAttribute>
      </el-dialog>
    </div>
  </div>
</template>


<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import {
  querys,
  attribute,
  IsEnable
} from "api/productmanage/classifymanage/classifymanage";
import spot from "@/assets/images/spot.png";
import shuttleManiac from "./shuttleManiac";
import ediu from "./ediu";
import seeAttribute from "./seeAttribute";
import { getNames, getTypes } from "src/utils/pubilcFn.js";
export default {
  components: {
    breadcrumb,
    pagination,
    shuttleManiac,
    seeAttribute,
    ediu
  },
  // name: 'brandmanagement',
  data() {
    return {
      names: [], //筛选品类数据
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 0, //总条数
      //头部面包屑导航
      category: [], //品类属性数据
      navList: [],
      getAtter: [], //查看关联属性
      selections: [], //表单复选数据
      CategoryId: 0, //品类属性id
      isSelection: 0, //品类状态
      spot,
      typess: [], //筛选数据
      tabList: [], //列表数据
      //品牌/联系人/联系dian'hua
      searchtext: null,
      //状态查询1
      statuestyle: "",
      styleList: [{ label: "启用", value: 1 }, { label: "禁用", value: 0 }],
      //品牌类型
      brandstyle: "",
      getTabVal: [], //编辑选中数据
      EdiuStatistics: false, //编辑
      DestroyIncomeStatistics: true,
      //页面操作按钮list
      actionBtnList: [
        { name: "新增品类", type: 1, str: "classifymanage_Add" },
        { name: "启用", type: 2, str: "classifymanage_Enable" },
        { name: "停用", type: 3, str: "classifymanage_Prohibit" }
      ],
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      //页面弹框
      Dialogtitle: "",
      eiduModel: true, //编辑组件 刷新状态
      centerDialogVisible: false,
      //模板页面弹框
      modelDialogVisible: false,
      //关联属性
      connectDialogVisible: false,
      //弹框页面数据
      brandInfo: "",
      //选择品牌类型
      DialogbrandList: [
        { label: "自营", value: 1 },
        { label: "合作商", value: 1 }
      ],
      //imglogosrc
      imglogosrc: "",
      //文件上传
      dialogImglist: []
    };
  },
  activated(){
    this.getListData(); //获取列表数据
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  // deactivated () {
  //   this.$destroy(true)
  // },
  // created() {
  //   this.getListData(); //获取列表数据
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  // },
  methods: {
    reset() {
      this.statuestyle = "";
      this.searchtext = "";
    },
    filterHandler(value, row, column) {
      //筛选方法调用
      value == "启用" ? (value = 1) : (value = 0);
      const property = column["property"];
      return row[property] == value;
    },
    filterSandler(value, row, column) {
      //筛选方法调用
      const property = column["property"];
      return row[property] === value;
    },
    getInfos() {
      //获取筛选数据
      this.names = getNames("categoryName", this.tabList);
      this.typess = getTypes("isEnable", this.tabList, "启用", "禁用"); //调用筛选数据处理
    },
    subFn() {
      //弹框提交
      if (this.$refs.mychild.shttle == "") {
        this.$message.warning("品类名称不能为空!");
        return;
      }
      this.centerDialogVisible = false;
      this.$refs.mychild.addPost(this.brandInfo); //调用子组件方法
      this.getListData(); //获取列表数据
      this.DestroyIncomeStatistics = false;
      this.$nextTick(() => {
        this.DestroyIncomeStatistics = true;
      });
    },
    getListData() {
      //获取列表信息
      let data = {
        categoryName: this.searchtext,
        isEnable: this.statuestyle,
        page: this.currentPage,
        limit: this.pageSize
      };
      querys(data)
        .then(res => {
          this.tabList = res.data.rows;
          this.total = res.data.total;
          this.getInfos();
        })
        .catch(error => {
          console.log("品类管理获取列表信息接口", error);
        });
    },
    subFns() {
      this.$refs.edius.ediuPost();
      this.EdiuStatistics = false;
    },
    attributes(id = 0, selection = 0, type = 0) {
      //获取属性调用数据方法
      let data = {
        commodityCategoryId: id,
        isSelection: selection
      };
      attribute(data)
        .then(res => {
          this.category = res.data;
          this.getAtter = res.data;
          if (type == 0) {
            this.centerDialogVisible = true;
          }
        })
        .catch(error => {
          console.log("品类管理获取属性接口", error);
        });
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
      // return "height: 80px"
    },
    //分页函数回调
    handleCurrentChange(val) {
      this.currentPage3 = val;
      this.getData();
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
        this.addbrand();
      } else if (type == 2) {
        this.typeOfArray(1);
        //页面跳转
      } else if (type == 3) {
        this.typeOfArray(0);
      }
    },
    typeOfArray(type) {
      //判断是启用 禁用 是否为复选数据
      if (this.selections.length < 1) {
        this.$message.error("请勾选");
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
    addbrand(row) {
      this.Dialogtitle = "新增品类";
      this.$nextTick(() => {
        this.attributes(); //获取属性方法
      });
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //编辑
    editHandle(val) {
      this.Dialogtitle = "编辑品类";
      this.getTabVal = val;
      this.eiduModel = false;
      this.$nextTick(res => {
        this.eiduModel = true;
      });
      this.EdiuStatistics = true;
    },
    //启用 停用
    setStatue(val, type) {
      var strId = [];
      Array.isArray(val) ? (strId = val) : strId.push(val);
      strId = strId
        .map(item => {
          return item.commodityCategoryId;
        })
        .join();
      let data = {
        ids: strId,
        dataType: "commodity_category",
        IsEnable: type
      };
      IsEnable(data)
        .then(res => {
          //设置停用 启用状态
          this.getListData(); //刷新状态后获取列表数据
          this.$message({ message: "操作成功", type: "success" });
        })
        .catch(error => {
          console.log("品类管理：停用启用接口");
          this.$message.error("操作失败");
        });
    },
    //查看
    setModel(row) {
      console.log(row);
      this.modelDialogVisible = true;
    },
    //查看关联属性
    seeConnect(val) {
      this.category = val;
      console.log(val);
      this.connectDialogVisible = true;
      this.attributes(val.commodityCategoryId, 1, 1);
    }
  }
};
</script>
<style scoped lang="scss">
.btnStyle {
  display: flex;
}
.head_list {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.input-vw {
  width: calc(((92.5vw - 250px)) / 4);
  margin-bottom: 20px;
  float: left;
  position: relative;
  display: flex;
  align-items: center;
  div {
    flex: 1;
  }
}
.content_box {
  padding: 0 20px;
}
.btnbox {
  display: flex;
  > div {
    flex: 1;
  }
  .btn-right {
    flex: 1.5;
    text-align: right;
  }
}
.pagination_wrap {
  text-align: center;
  height: 50px;
  /* line-height: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
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

.Dialog_input_cell {
  display: flex;
  flex-wrap: nowrap;
  height: 50px;
  width: 100%;
  align-items: center;
}
.lastDialog_input_cell {
  display: flex;
  flex-wrap: nowrap;
  height: 100px;
  align-items: top !important;
}
.dialog_con_box .Dialog_input_cell .Dialog_input_cell_title {
  width: 100px;
  text-align: right;
  padding-right: 10px;
}
.Dialog_input_cell_input {
  flex: 1;
  display: flex;
  flex-wrap: nowrap;
}
.dialog_table_box {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
}
.dialog_table_box .dialog_left_table {
  width: 45%;
}
.dialog_table_box .dialog_right_table {
  width: 45%;
}
.dialog_mid_table {
  text-align: center;
}
.dialog_table_head {
  display: flex;
  height: 40px;
  align-items: center;
  justify-content: space-between;
  padding: 0px 10px;
  background-color: #dddddd;
}
</style>

