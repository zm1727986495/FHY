<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

      <div class="collapse_cell_div">
        <div class="table_list">
          <el-card class="box-card">
            <div class="page_head_div border_none">
              <div class="iconBox">
                <i class="Icon"></i>
                <span>客户共享</span>
              </div>
              <span class="page_head_div_id">已选{{idlength}}个客户</span>
            </div>
            <el-table border align="center" :row-class-name="tableRowClassName" :data="tabList" style="width: 100%;">
              <el-table-column align="center" prop="wxNickname" label="微信昵称" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="customerWx" label="微信ID" width="200"></el-table-column>
              <el-table-column align="center" prop="customerId" label="客户ID" width="200"></el-table-column>
              <el-table-column align="center" prop="customerName" label="客户姓名" width="200"></el-table-column>
              <el-table-column align="center" prop="address" label="客户地址" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="customerPhone" label="客户电话" width="200"></el-table-column>
              <el-table-column align="center" prop="otherPhone" label="备用电话" width="200"></el-table-column>
              <el-table-column align="center" prop="createTime" label="创建时间" width="200" show-overflow-tooltip></el-table-column>
              <el-table-column align="center" prop="customerDesc" label="客户备注" width="200" show-overflow-tooltip></el-table-column>
            </el-table>
          </el-card>
        </div>
      </div>
      <div class="collapse_cell_div">
        <el-card class="box-card m-top20" style="width:100%">
          <div class="iconBox m-bottom10">
            <i class="Icon"></i>
            <span>共享给</span>
          </div>
          <div class="div_flex">
            <div class="collapse_input_cell_box">
              <span class="input_befor_text">所属门店：</span>
              <div class="input_after_div">
                <el-input v-model="storeName" placeholder="请输入所属门店" @focus="openDia" maxlength="50" style="width:50%"></el-input>
                <el-input v-model="transferForm.transferStoreId" placeholder="请输入所属门店" @focus="openDia" maxlength="50" style="display:none"></el-input>
              </div>
            </div>

            <div class="collapse_input_cell_box" v-if="guideVisible">
              <span class="input_befor_text">导购：</span>
              <div class="input_after_div">
                <el-select v-model="transferForm.transferStoreAtId" placeholder="请先选择门店">
                  <el-option v-for="item in userList" :key="item.userId" :label="item.name" :value="item.userId"></el-option>
                </el-select>
              </div>
            </div>
          </div>

          <div class="collapse_input_cell_box_area">
            <span class="input_befor_text">共享信息：</span>
            <div class="input_after_div">
              <el-checkbox v-model="transferForm.isSharePhone" true-label="1">客户电话</el-checkbox>
              <el-checkbox v-model="transferForm.isShareWx" true-label="1">客户微信</el-checkbox>
              <el-checkbox v-model="transferForm.isShareAddress" true-label="1">客户地址</el-checkbox>
              <el-checkbox v-model="transferForm.isShareDemand" true-label="1">客户需求</el-checkbox>
            </div>
          </div>
        </el-card>
      </div>

      <div class="foot_btn_box">
        <el-button type="primary" @click="sendJava(1)">保 存</el-button>
        <el-button type="primary" @click="sendJava(2)">提 交</el-button>
        <el-button @click="colseRoute()">取 消</el-button>
      </div>

      <!-- 门店列表弹框 -->
      <storedia :visible="store_visible" v-if="store_visible" @close_store="closeStore"></storedia>
    </div>
  </div>
</template>


<script>
import {
  listShareCustomer,
  exportCompany
} from "api/customermanagement/transfer/transfer";

import { listStorePage, listStoreUser } from "api/common/common";
import storedia from "@/views/customermanagement/myclient/components/storedia"; //门店弹框组件

import breadcrumb from "../../components/breadcrumb";
import pagination from "../../components/pagination";
export default {
  // name: 'brandmanagement',
  data() {
    return {
      //头部面包屑导航
      navList: [],
      moveStartTime: "",
      checkStartTime: "",
      brandInfo: {},
      tabList: [],
      storeList: [], //门店列表
      storeName: "",
      storeNumber: "",
      currentPage: 1,
      pageSize: 20,
      total: 1,
      selectStroe: [],

      //选中门店
      selectStroe: {},
      //门店下面人员列表
      userList: [],

      transferForm: {
        storeCustomerIds: [], //客户id
        storeCustomerTransferType: 2, //移交类型,2共享
        transferStoreId: "", //移交负责门店
        transferStoreAtId: "", //移交负责人
        isShareDemand: "", //是否共享客户需求
        isShareAddress: "", //是否共享客户地址
        isShareWx: "", //是否共享客户微信
        isSharePhone: "", //是否共享客户电话
        submitStatus: "" //是否提交
      },

      //状态查询
      statuestyle: "",
      styleList: [
        { label: "全部", value: "" },
        { label: "启用", value: 1 },
        { label: "停用", value: 2 }
      ],
      ids: null,
      idlength: 0,
      searchtext: "",
      sourceStoreId: null,
      sourceStoreAtId: null,
      isShareDemand: 0,
      isShareAddress: 0,
      isShareWx: 0,
      isSharePhone: 0,
      //弹框
      store_visible: false,
      guideVisible: false,
      //分页
      dialogcurrentPage: 1,
      dialogtotle: 100
      //查询内容
    };
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.ids = this.$route.query.id;
    this.idlength = Array.isArray(this.ids) ? this.ids.length : 1;
    this.getListData();
  },
  methods: {
    //打开门店列表弹出层
    openDia() {
      this.store_visible = true;
    },

    //关闭门店列表弹出层
    closeStore(val) {
      if (val) {
        console.log(val); //storeName  storeId
        this.storeName = val.storeName;
        this.transferForm.transferStoreId = val.storeId;
        this.transferForm = {...this.transferForm,transferStoreAtId:""};   //清空导购人选中内容
        this.store_visible = false;
        this.getStoreUser(val.storeId);
      } else {
        this.store_visible = false;
      }
    },

    //根据门店id获取门店导购人
    getStoreUser(id) {
      let data = {
        storeId: id
      };
      listStoreUser(data)
        .then(res => {
          if (res.status == "200") {
            this.guideVisible = true;
            this.userList = res.data;
          } else {
            this.$message.error("获取门店负责人失败");
          }
        })
        .catch(error => {
          console.error(
            "获取门店人员列表  -----  customermanagementcustomerqueryCustomerSharing",
            error
          );
        });
    },

    //下拉效果
    handleChange(index) {
      console.log(index);
    },
    //
    delete_tag_fun(index) {
      this.tagList.splice(index, 1);
    },

    //获取信息
    getListData() {
      let id = [];
      !Array.isArray(this.ids) ? id.push(this.ids) : (id = this.ids);
      id = id.map(item => {
        return Number(item);
      });
      listShareCustomer({
        storeCustomerIds: id.join()
      })
        .then(res => {
          this.tabList = res.data.rows;
        })
        .catch(error => {});
    },

    //getstoreList
    getstoreList() {
      let data = {
        storeName: this.storeName,
        storeNumber: this.storeNumber
        // page:this.currentPage,
        // limit:this.pageSize,
      };

      listStorePage(data)
        .then(res => {
          if (res.status == "200") {
            this.storeList = res.data.rows;
            this.total = res.data.total;
            // 后台数据返回后,手动添加一个checked属性控制选中与否
            // this.storeList.forEach(item => {
            //   item.checked = false
            // })
          }
          console.log(res);
        })
        .catch(error => {
          console.error(
            "获取门店列表  -----  customermanagementcustomerqueryCustomerSharing",
            error
          );
        });
    },
    sendJava(val) {
      if (this.transferForm.transferStoreId == "") {
        this.$message.error("请选择门店");
      } else if (this.transferForm.transferStoreAtId == "") {
        this.$message.error("请选择负责人");
      } else {
        this.transferForm.submitStatus = val;
        let id = [];
        !Array.isArray(this.ids) ? id.push(this.ids) : (id = this.ids);
        id = id.map(item => {
          return Number(item);
        });
        this.transferForm.storeCustomerIds = id;
        this.transferForm.transferStoreAtId = parseInt(
          this.transferForm.transferStoreAtId
        );
        exportCompany(this.transferForm).then(res => {
          console.log(res);
          console.log();
          if (res.status == "200") {
            //调用接口成功
            if (res.message == "success") {
              this.$message.success("共享客户成功");
              this.$router.go(-1);
            } else {
              let str = res.data.customerList.join(",");
              this.$alert("客户：" + str + "已存在", "客户重复提示", {
                confirmButtonText: "确定",
                type: "error"
              });
            }
          } else {
            this.$message.error("调用接口失败");
          }
        });
      }
    },
    // 操作
    projectdetail(row) {},

    // 改变table头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background: #f8f8f8;border-color: #dddddd";
      }
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //分页函数回调
    currentChange(val) {
      this.currentPage3 = val;
      this.getData();
    },

    sizeChange(val) {
      //页码数改变
      this.currentPage = 1;
      this.pageSize = val;
      this.getstoreList();
    },
    currentChange(val) {
      //翻页方法

      this.currentPage = val;
      this.getstoreList();
    },

    //勾选函数回调
    selectStroeChange(val) {
      this.selectStroe = val;
      if (this.selectStroe.length > 1) {
        this.$refs.multipleTable.toggleRowSelection(this.selectStroe[0]);
      }
    },

    //查询按钮点击
    searchFun() {
      this.currentPage3 = 1;
      this.getListData();
    },
    //条件查询门店页面
    addHandle() {
      this.getstoreList();
    },
    colseRoute() {
      this.$router.go(-1);
    }
  },
  components: {
    breadcrumb,
    storedia,
    pagination
  }
};
</script>
<style scoped lang='scss'>
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
.warp_head_list {
  justify-content: left;
  width: 100%;
}
.page_head_div {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 50px;
  justify-content: space-between;
  border-bottom: 1px solid #ddd;
  margin-bottom: 10px;
  width: 100%;
}
.table_edit_column {
  display: flex;
  align-items: center;
}
.table_edit_column .input_box {
  width: 20%;
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

.collapse_input_cell_box {
  width: 50%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  height: 50px;
}
.collapse_input_cell_box .input_befor_text {
  width: 8em;
}
.collapse_input_cell_box .input_after_div {
  flex: 1;
}
.table_list {
  width: 100%;
  margin-top: 10px;
}
.page_head_div_id {
  margin-right: 20px;
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
.div_flex {
  display: flex;
  flex-wrap: wrap;
}
.input_befor_text {
  width: 120px;
  text-align: right;
}
.foot_btn_box {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.collapse_input_cell_box_area .input_after_div {
  width: 88%;
}

.el-collapse-item__header {
  background-color: #dddddd;
  padding: 0 10px;
}
.table_edit_column .input_box .el-input {
  width: 60%;
}
.table_edit_column .input_box:first-child .el-input {
  width: 90%;
}
.head_nav_btn {
  flex: 1;
  text-align: right;
}
.border_none {
  border: none !important;
  margin-bottom: 0px !important;
}
</style>



