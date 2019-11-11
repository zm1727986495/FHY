<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>

      <el-card class="m-bottom attribute lvs">
        <div class="search_box">
          <div class="search_item">
            <el-input placeholder="录入人" @keyup.enter.native="searchFun()" v-model="searchtext" maxlength="50" class="width-100"></el-input>
          </div>
          <div class="search_item">
            <el-select v-model="region" placeholder="请选择门店" multiple filterable collapse-tags class="head_nav_search width-100">
              <el-option v-for="item in storeOptions" :key="item.storeId" :label="item.storeName" :value="item.storeId"></el-option>
            </el-select>
          </div>
          <div class="search_item">
            <el-date-picker style="width:100%" size="medium" v-model="searchData" type="daterange" value-format="yyyy/MM/dd" format="yyyy-MM-dd" @change="datapickChange" range-separator="至" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
          </div>
          <div class="search_item">
            <el-button type="warning" class="button-fc fr" size="medium" @click="searchFun()">查询</el-button>
            <el-button type="primary" size="medium" class="el-button--medium fr" @click="resetFun">重置</el-button>
          </div>
        </div>

        <div class="h-width"></div>

        <!-- 按钮组 -->
        <div class="btn_list m-bottom10">
          <div v-for="(item,index) in actionBtnList" :key="index" >
            <el-button
            v-if="btnJurisdiction[item.codename]"
            type="default"
            size="small"
            class="button-96 m-left10 m-top5"
            @click="butGroupAction(item.type)"
            >{{item.name}}</el-button>
          </div>
        </div>


        <div class="dialog_con_box">
          <el-dialog title :visible.sync="centerDialogVisible" width="825px">
            <div class="titlecals">{{Dialogtitle}}</div>
            <div class="content_box">
              <div class="left_form">
                <div class="box_one">
                  <div class="boxselec fribox">
                    <span class="demonstration">服务时间段：</span>
                    <el-select v-model="binof.serviceTimeId" clearable slot="prepend" placeholder="请选择服务时间段">
                      <el-option v-for="item in serviceTimeIdList" :key="item.id" :label="item.dictName" :value="item.id"></el-option>
                    </el-select>
                  </div>
                  <div class="boxselec">
                    <span>服务波数：</span>
                    <div class="txtbox">
                      <el-input placeholder v-model="binof.servicePopulation" class="add_width" clearable></el-input>
                      <div class="texmar">波</div>
                    </div>
                  </div>
                </div>

                <div class="boxselec">
                  <span>服务时间：</span>
                  <div class="txtbox">
                    <el-input placeholder="请输入内容" v-model="binof.serviceTime" class="add_sj_width" clearable></el-input>
                    <div class="texmar">分钟</div>
                  </div>
                </div>
                <div class="boxselec">
                  <span>备注：</span>
                  <div class>
                    <el-input style="width:85%" type="textarea" resize="none" :rows="3" placeholder="请输入内容" maxlength="200" v-model="binof.remarks"></el-input>
                  </div>
                </div>
              </div>
            </div>

            <span slot="footer" class="dialog-footer">
              <el-button @click="centerDialogVisible = false">取 消</el-button>
              <el-button type="primary" @click="sendJava()">确 定</el-button>
            </span>
          </el-dialog>
        </div>
        <!-- </div> -->
        <!-- 表格 -->
        <div class="table_list">
          <el-table border :data="tabList" style="width: 100%;" :row-class-name="tableRowClassName">
            <el-table-column type="selection" width="40"></el-table-column>

            <el-table-column prop="createAt" label="录入人" align="center" width="200" sortable :filters="names" :filter-method="filterHandler">
              <template slot-scope="scope">
                <div>
                  <el-tooltip placement="right" visible-arrow>
                    <div slot="content" @click="passHandle(scope.row)" class="tips tipFon" v-if="scope.row.status== 0">
                      <!-- 已审批转客户 -->
                      <p class="operaItems" @click="transHandle(scope.row)">转客户</p>
                    </div>
                    <div slot="content" @click="passHandle(scope.row)" class="tips tipFon" v-else-if="scope.row.status== 1">
                      <!-- 已审批已退回 -->
                      <p class="operaItems" @click="editHandle(scope.row)">编辑</p>
                      <!-- <p class="operaItems" @click="deleteStatue(scope.row)">删除</p>
                      <p class="operaItems" @click="rehandHandle(scope.row)">重新提交</p>-->
                    </div>
                    <div slot="content" @click="passHandle(scope.row)" class="tips tipFon" v-else-if="scope.row.status== 2">
                      <p class="operaItems" @click="editHandle(scope.row)">编辑</p>
                      <!--<p class="operaItems" @click="deleteStatue(scope.row)">删除</p>-->
                    </div>
                    <img :src="spot" alt class="attributesTips" />
                  </el-tooltip>
                  <p class>{{scope.row.createAt}}</p>
                </div>
              </template>
            </el-table-column>
            <el-table-column show-overflow-tooltip prop="storeName" align="center" label="所属门店" sortable></el-table-column>
            <el-table-column show-overflow-tooltip prop="serviceTimeId" align="center" label="服务时间段" sortable></el-table-column>
            <el-table-column show-overflow-tooltip prop="serviceTime" align="center" label="服务时长" sortable></el-table-column>
            <el-table-column show-overflow-tooltip prop="servicePopulation" align="center" label="服务波数" sortable></el-table-column>
            <el-table-column show-overflow-tooltip prop="status" align="center" label="状态" sortable :filters="typess" :filter-method="filterspflags">
              <template slot-scope="scope">
                <span v-if="scope.row.status==0">未审批</span>
                <span v-else-if="scope.row.status==1">已审批</span>
                <span v-else-if="scope.row.status==2">已退回</span>
                <!--<span v-else></span>-->
              </template>
            </el-table-column>
          </el-table>
          <div class="pagination_wrap">
            <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
          </div>
        </div>
      </el-card>
    </div>
  </div>
</template>


<script>
import breadcrumb from "../../components/breadcrumb";
import spot from "@/assets/images/spot.png";
import pagination from "../../components/pagination";
import { listStoreByPresent } from "api/common/common";

import {
  querys,
  adds,
  edit,
  EditDeleteRe
} from "@/api/customermanagement/storetraffic/storetraffic.js";
import {
  listBaseDict //字典
} from "api/order/order/order";
import { getNames, Approval } from "src/utils/pubilcFn.js";
export default {
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),//按钮权限
      currentPage: 1, //当前页数
      pageSize: 20, //当前页最大条数
      total: 0, //总条数
      //头部面包屑导航
      navList: [],
      spot, //表格图片
      names: [], //筛选数据
      typess: [], //筛选数据
      tabList: [],
      //头部日期选择
      searchData: [],
      //开始结束时间
      startTime: "",
      endTime: "",
      serviceTimeIdList: [],

      //查询内容
      searchtext: "",
      //状态查询
      statuestyle: "",
      styleList: [
        { label: "全部", value: "" },
        { label: "启用", value: 1 },
        { label: "停用", value: 2 }
      ],
      //品牌类型
      brandstyle: "",
      brandList: [
        { label: "全部", value: "" },
        { label: "自营", value: 1 },
        { label: "合作商", value: 1 }
      ],
      //页面操作按钮list
      actionBtnList: [{ name: "新增客流量", style: "default", codename:'storetraffic_add',type: 1 }],
      //页面弹框
      Dialogtitle: "",
      centerDialogVisible: false,
      //弹框页面数据
      brandInfo: {},
      //选择品牌类型
      DialogbrandList: [
        { label: "自营", value: 1 },
        { label: "合作商", value: 1 }
      ],
      //imglogosrc
      imglogosrc: "",
      //文件上传
      dialogImglist: [],
      region: [],
      regionName: "",
      storeOptions: [], //所属门店
      //增加和编辑
      binof: {},

      //编辑Id
      Id: 0
    };
  },
  created() {
    this.getNames();
    this.getListData();
  },
  mounted() {
    // 头部面包屑
    this.listStoreByPresent();
    this.navList = this.$route.meta;
    this.getlistBaseDict("SERVICE_TIME");
  },
  methods: {
    //获取门店
    listStoreByPresent() {
      listStoreByPresent()
        .then(res => {
          this.storeOptions = res.data.rows;
        })
        .catch(error => {
          console.log(error + "views/customermanagement/customerquery/index");
        });
    },
    passHandle() {},
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

    getlistBaseDict(name) {
      let data = {
        dataType: name
      };
      listBaseDict(data).then(res => {
        if (res.status == "200") {
          this.serviceTimeIdList = res.data;
        } else {
          this.$message.error("查询服务时间字典错误");
        }
      });
    },

    searchFun() {
      //查询
      this.currentPage = 1;
      this.getListData();
    },

    getNames() {
      //筛选数据处理
      this.names = this.tabList.map(function(item) {
        return { text: item.name, value: item.name };
      });
      var arr;
      arr = this.tabList.map(function(item) {
        let flag = "";
        if (item.spflag == 1) {
          flag = "已审批";
        } else if (item.spflag == 2) {
          flag = "已退回";
        } else {
          flag = "未审批";
        }
        return { text: flag, value: flag };
      });
      let obj = {};
      this.spflags = arr.reduce((cur, next) => {
        obj[next.text] ? "" : (obj[next.text] = true && cur.push(next));
        return cur;
      }, []);
    },
    filterHandler(value, row, column) {
      //筛选方法调用

      const property = column["property"];
      return row[property] === value;
    },
    tableRowClassName({ row, rowIndex }) {
      //表格斑马线设置
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    filterspflags(value, row, column) {
      //筛选方法调用
      if (value == "未审批") {
        value = 0;
      } else if (value == "已审批") {
        value = 1;
      } else {
        value = 2;
      }

      const property = column["property"];
      return row[property] == value;
    },
    datapickChange(val) {
      this.startTime = this.searchData ? this.searchData[0] : "";
      this.endTime = this.searchData ? this.searchData[1]:"";
    },
    getInfos(val) {
      this.typess = Approval("status", val, "未审批", "已审批", "已退回"); //调用筛选数据处理
      this.names = getNames("createAt", val); //调用筛选数据处理
    },
    resetFun() {
      this.searchtext = "";
      this.region = [];
      this.startTime = "";
      this.endTime = "";
      this.searchData = [];
      this.searchFun();
    },

    //获取列表信息
    getListData() {
      let data = {
        storeId:JSON.parse(window.localStorage.getItem("activeStoreId")).storeId,
        createAt: this.searchtext,
        storeIds: this.region.join(","),
        createTimeStart: this.startTime, 
        createTimeEnd: this.endTime,  
        page: this.currentPage,
        limit: this.pageSize
      };

      querys(data)
        .then(res => {
          this.tabList = res.data.rows;
          this.total = res.data.total;
          this.getInfos(this.tabList);
        })
        .catch(error => {
          console.error(
            "品类管理获取列表信息接口 customermanagementstoretrafficindex",
            error
          );
        });
    },

    sendJava() {
      let fn;
      if (this.Dialogtitle == "新增客流量") {
        //确定增加
        // this.binof.status=0;
        fn = adds;
      } else {
        //确定编辑
        this.binof.storePassengerFlowId = Number(this.Id);
        fn = EditDeleteRe;
      }

      fn(this.binof)
        .then(res => {
          console.log(res);
          this.getListData();
        })
        .catch(error => {
          console.error(
            "门店客流量_新增客流量或者编辑门店客流量_查看详情 customermanagementstoretrafficindex",
            error
          );
        });
      this.centerDialogVisible = false;
      this.binof = {};
    },

    // 操作
    projectdetail(row) {},

    // 改变table头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background: #f8f8f8;border-color: #dddddd";
      }
    },
    //分页函数回调
    handleCurrentChange(val) {
      this.currentPage3 = val;
      this.getData();
    },
    //勾选函数回调
    handleSelectionChange(val) {},
    //按钮组函数
    butGroupAction(type) {
      if (type == 1) {
        //弹框
        this.addbrand();
      } 
    },
    //添加
    addbrand() {
      this.Dialogtitle = "新增客流量";
      this.binof = {};
      this.centerDialogVisible = true;
    },
    //编辑
    editHandle(row) {
      this.Dialogtitle = "编辑客流量";
      this.centerDialogVisible = true;
      this.Id = row.storePassengerFlowId;

      let data = {
        storePassengerFlowId: this.Id,
        serviceTime: row.serviceTime,
        serviceTimeId: row.serviceTimeId,
        servicePopulation: row.servicePopulation,
        remarks: row.remarks
      };
      edit(data)
        .then(res => {
          this.binof = res.data;
        })
        .catch(error => {
          console.error(
            "门店客流量_新增客流量或者编辑门店客流量_查看详情 customermanagementstoretrafficindex",
            error
          );
        });
    },
    //删除
    deleteStatue(row) {
      console.log(row);
    },
    //转客户
    transHandle(row) {
      console.log(row);
      this.$router.push({
        path: "customermanagement/customeradd",
        query: { id: row.storePassengerFlowId }
      });
    },
    //重新提交
    rehandHandle(row) {
      console.log(row);
    }
  }
};
</script>
<style scoped lang='scss'>
.m-left40 {
  margin-left: 40px;
}
.m-left8 {
  margin-left: 8px;
}
.add_width {
  width: 100px;
}
.add_sj_width {
  width: 220px;
}
.spacing {
  display: flex;
  flex-direction: row;
}

.Coom_width {
  width: 310px;
}
.Coom_widthSJ {
  width: 310px;
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
  flex-wrap: nowrap;
  width: 80%;
  margin: 0 auto;
}
.dialog_con_box .left_form {
  width: 100%;
}
.dialog_con_box .right_logo {
  width: 40%;
}
.Dialog_input_cell {
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
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
.Dialog_input_cell_input_sm {
  width: 80px;
  margin-right: 10px;
}
.right_logo .img_logo {
  width: 150px;
  height: 150px;
  margin: auto;
  background-color: #dddddd;
  overflow: hidden;
}
.right_logo .img_logo img {
  width: 100%;
}
.upload_logo {
  text-align: center;
  padding: 10px 0px;
}
.search_box {
  display: flex;
  flex-flow: row wrap;
  justify-content: space-between;
}
.search_item {
  width: calc(((94vw - 250px)) / 4);
  // margin-bottom:20px;
  cursor: pointer;
  position: relative;
  display: flex;
  flex-wrap: nowrap;
  //   justify-content: center;
  align-items: center;
  span {
    min-width: 80px;
    text-align: right;
  }
  /* margin-right: 20px; */
}
.input_befor_text {
  min-width: 80px;
  text-align: right;
}
.inner_box {
  width: 85%;
  margin: 0 auto;
  border: 1px solid red;
  .box_content {
    display: flex;
    flex-wrap: nowrap;
    height: 55px;
    border: 1px solid green;
  }
  .box_content_sp {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    border: 1px solid black;
  }
}
.box_one {
  display: flex;
  justify-content: space-between;
}
.boxselec {
  flex: 1;
  display: flex;
  align-items: center;
  margin-bottom: 20px;
  > span {
    width: 85px;
    text-align: right;
  }
  > div {
    flex: 1;
  }
  .txtbox {
    display: flex;
    align-items: center;
  }
  .texmar {
    margin-left: 5px;
  }
}

.fribox {
  margin-right: 20px;
}
</style>

