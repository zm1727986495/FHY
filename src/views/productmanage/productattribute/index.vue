<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <!-- 查询条件组 -->
      <el-card class="attribute lvs">
        <div class="head_list">
          <div class="input-vw">
            <el-input class="width-100" placeholder="属性名称" size="medium" v-model="searchtext"></el-input>
          </div>

          <div class="input-vw">
            <el-select size="medium" class="width-100" v-model="statuestyle" placeholder="选择状态">
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
        <div class="table_list lvs attribute">
          <el-table
            border
            @selection-change="handleSelectionChange"
            :data="tabList"
            :max-height="maxHeight"
            style="width: 100%;"
            :row-class-name="tableRowClassName"
          >
            <el-table-column align="center" type="selection" width="40"></el-table-column>
            <el-table-column align="center" prop="attributeName" label="属性名称" sortable>
              <template slot-scope="scope">
                <div>
                  <el-tooltip placement="right" visible-arrow>
                    <div slot="content" class="tips tipFon">
                      <p @click="editHandle(scope.row)" class="operaItems">编辑</p>
                      <p
                        v-if="scope.row.isEnable == 1"
                        @click="setStatue(scope.row,0)"
                        class="operaItems"
                      >禁用</p>
                      <p v-else @click="setStatue(scope.row,1)" class="operaItems">启用</p>
                    </div>
                    <img :src="spot" alt class="attributesTips" />
                  </el-tooltip>
                  <p class="operation">{{scope.row.attributeName}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column prop="isEnable" align="center" label="状态" sortable>
              <template slot-scope="scope">
                <span>{{scope.row.isEnable == 1 ? '启用' : '禁用'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="mode" label="属性录入方式" sortable>
              <template slot-scope="scope">
                <span>{{scope.row.mode == 1 ? '列表选择' : '手工'}}</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="attributeType" label="属性类型" sortable>
              <template slot-scope="scope">
                <span v-if="!isNaN(parseFloat(scope.row.attributeType))">数字</span>
              </template>
            </el-table-column>
            <el-table-column align="center" prop="attributeUnit" label="单位" sortable></el-table-column>
            <el-table-column align="center" prop="attributeValue" label="属性值" sortable></el-table-column>
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
    <!-- 弹框页面 -->
    <div class="dialog_con_box">
      <el-dialog :visible.sync="centerDialogVisible" width="800px">
        <div class="titlecals">{{Dialogtitle}}</div>
        <div class="content_box">
          <addAttribute
            v-if="centerDialogVisible"
            :attrdataList="attrdataList"
            :editindex="editindex"
            @getListData="getListData"
            @closeFn="closeFn"
            ref="myChild"
          ></addAttribute>
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
import pagination from "@/views/components/pagination";
import spot from "@/assets/images/spot.png";
import addAttribute from "./addAttribute";
import {
  listProvince,
  addCommodityAttribute,
  IsEnable
} from "api/productmanage/productattribute/productattribute";
import { getNames, getTypes } from "src/utils/pubilcFn.js";
import {mapGetters} from 'vuex'
export default {
  components: {
    breadcrumb,
    pagination,
    addAttribute
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 10, //当前页最大条数
      total: 0, //总条数
      //头部面包屑导航
      navList: [],
      spot, //图片
      typess: [],
      tabList: [],
      selections: [], //table选中数据
      //查询内容
      searchtext: "",
      indexVal: [], //添加属性 选中index
      //状态查询
      statuestyle: "",
      attrdataList: {},
      editindex: 0,
      styleList: [{ label: "启用", value: 1 }, { label: "禁用", value: 0 }],
      //页面操作按钮list
      actionBtnList: [
        { name: "新增属性", type: 1, str: "productattribute_Add" },
        { name: "启用", type: 2, str: "productattribute_Enable" },
        { name: "停用", type: 3, str: "productattribute_Prohibit" }
      ],
      // 按钮权限***********
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),
      //页面弹框
      Dialogtitle: "", //弹框标题
      centerDialogVisible: false //弹框show
    };
  },
  activated(){
     this.getListData();

     // 头部面包屑
    this.navList = this.$route.meta;
  },
  // deactivated () {
  //   this.$destroy(true)
  // },
  // created() {
  //   this.getListData();
  // },
  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  // },
  computed: {
    ...mapGetters(['maxHeight'])
  },
  methods: {
    cancel() {
      this.centerDialogVisible = false;
      this.$refs.myChild.dialogtabList = this.$refs.myChild.dialogtabList.map(
        item => {
          item.yes = false;
          item.no = false;
          return item;
        }
      );
    },
    //获取列表信息
    getListData(names = null, isEnable = null) {
      let data = {
        attributeName: names,
        isEnable: isEnable,
        page: this.currentPage,
        limit: this.pageSize
      };
      listProvince(data)
        .then(res => {
          this.tabList = res.data.rows;
          this.total = res.data.total;
          this.typess = getTypes("type", this.tabList, "启用", "禁用"); //调用筛选数据处理
          this.centerDialogVisible = false;
        })
        .catch(error => {
          console.error(
            "商品属性:获取列表 productmanage/productattribute/index.vue",
            error
          );
        });
    },
    currentChange(val) {
      //翻页方法
      this.currentPage = val;
      this.getListData();
    },
    typeOfArray(type) {
      //判断是启用 禁用 是否为复选数据
      if (this.selections.length == 0) {
        this.$message({
          message: "您未勾选!",
          type: "warning"
        });
        return;
      }
      if (this.selections.length != 0) {
        this.setStatue(this.selections, type);
        this.selections = [];
      } else {
        this.setStatue(this.tabList, type);
      }
    },
    sizeChange(val) {
      //翻页方法
      this.currentPage = 1;
      this.pageSize = val;
      this.getListData();
    },
    filterHandler(value, row, column) {
      //筛选方法调用
      value == "启用" ? (value = 1) : (value = 0);
      const property = column["property"];
      return row[property] === value;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
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
      this.getListData(this.searchtext, this.statuestyle);
      console.log(this.searchtext, this.statuestyle);
    },
    reset() {
      this.searchtext = this.statuestyle = "";
    },
    //按钮组函数
    butGroupAction(type) {
      if (type == 1) {
        //弹框
        this.addbrand();
      } else if (type == 2) {
        this.typeOfArray(1);
      } else if (type == 3) {
        this.typeOfArray(0);
      }
    },
    //关闭弹框
    closeFn() {
      this.centerDialogVisible = false;
    },
    sendJava() {
      //调用弹框子组件事件 提交数据
      if (this.Dialogtitle == "新增商品属性") {
        this.$refs.myChild.addAttribute();
      } else {
        this.$refs.myChild.editAttribute(this.attrdataList);
      }
      // this.getListData()
    },
    //添加新
    addbrand(row) {
      this.Dialogtitle = "新增商品属性";
      this.editindex = 0;
      this.centerDialogVisible = true;
      // addCommodityAttribute().then(res =>{

      // }).catch(error => {

      // })
    },
    //编辑
    editHandle(row) {
      this.Dialogtitle = "编辑商品属性";
      this.centerDialogVisible = true;
      this.editindex = 1;
      this.attrdataList = row;
    },
    setStatue(val, type) {
      //修改状态 启用/禁用
      var strId = [];
      Array.isArray(val) ? (strId = val) : strId.push(val);
      strId = strId
        .map(item => {
          return item.commodityAttributeId;
        })
        .join();
      let data = {
        ids: strId,
        dataType: "commodity_attribute",
        IsEnable: type
      };
      IsEnable(data)
        .then(res => {
          this.getListData(); //刷新状态后获取列表数据
          this.$message({ message: "操作成功", type: "success" });
        })
        .catch(error => {
          console.log("品类管理：停用启用接口", error);
          this.$message.error("操作失败");
        });
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
.wrapper {
  .btnbox {
    display: flex;
    justify-content: space-between;
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
}
</style>
<style>
.dialog_table table {
  width: 100%;
}
</style>

