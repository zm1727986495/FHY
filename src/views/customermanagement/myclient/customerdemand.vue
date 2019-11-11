<template>
  <div class="wrapper">
    <div class="apper">
      <div class="head_nav">
        <!-- 导航栏 -->
        <breadcrumb :navList="navList"></breadcrumb>
      </div>
      <el-card class="box-card">
        <div class="iconBox">
          <i class="Icon"></i>
          <span>客户信息</span>
        </div>

        <table class="tab_class">
          <tr>
            <td>
              <span class="befor_text_bold">客户姓名：</span>
              {{userInfo.customerName}}
            </td>
            <td colspan="2">
              <span class="befor_text_bold">性别：</span>
              <span v-if="userInfo.customerSex=='1'">男</span>
              <span v-if="userInfo.customerSex=='2'">女</span>
            </td>
          </tr>
          <tr>
            <td>
              <span class="befor_text_bold">客户电话：</span>
              {{userInfo.customerPhone}}
            </td>
            <td colspan="2">
              <span class="befor_text_bold">备用电话：</span>
              {{userInfo.otherPhone}}
            </td>
          </tr>
          <tr>
            <td>
              <span class="befor_text_bold">年龄段：</span>
              {{userInfo.ageGroupName}}
            </td>
            <td>
              <span class="befor_text_bold">所属门店：</span>
              {{userInfo.storeName}}
            </td>
            <td>
              <span class="befor_text_bold">负责人：</span>
              {{userInfo.liableName}}
            </td>
          </tr>
          <tr v-if="userInfo.map">
            <td>
              <span class="befor_text_bold">客户来源：</span>
              {{userInfo.map.customerSourcePname}}
            </td>
            <td v-if="userInfo.map.customerSourcePid == '2'">
              <span class="befor_text_bold">推荐人：</span>
              {{userInfo.map.insideRefereeName}}
            </td>
            <td v-if="userInfo.map.customerSourcePid == '3'">
              <span class="befor_text_bold">外部推荐人：</span>
              {{userInfo.map.externalRefereeName}}
            </td>
            <td v-if="userInfo.map">
              <div v-if="userInfo.map.customerSourcePid == '2'">
                <span class="befor_text_bold">推荐门店：</span>
                {{userInfo.map.insideRecommendStoreName}}
              </div>
            </td>
          </tr>
        </table>
      </el-card>
      <el-card class="box-card m-top20">
        <div class="iconBox">
          <i class="Icon"></i>
          <span>需求内容</span>
        </div>
        <div class="collapse_cell_div m_lef2vw">
          <div class="collapse_input_cell_box">
            <span class="input_befor_text">房屋类型：</span>
            <div class="input_after_div">
              <el-radio v-model="form.housingTypeId" label="1">新房</el-radio>
              <el-radio v-model="form.housingTypeId" label="2">老房</el-radio>
            </div>
          </div>
          <div class="collapse_input_cell_box">
            <span class="input_befor_text">房屋户型：</span>
            <div class="input_after_div">
              <el-select v-model="form.housingBuildTypeId" placeholder="-请选择户型-" class="wid_28vw">
                <el-option
                  v-for="item in styleList1"
                  :key="item.id"
                  :label="item.dictName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="collapse_input_cell_box">
            <span class="input_befor_text">交房日期：</span>
            <div class="input_after_div">
              <el-date-picker
                class="wid_28vw"
                v-model="form.handoverDate"
                type="datetime"
                value-format="yyyy-MM-dd  HH:mm:ss"
                placeholder="-选择日期-"
              ></el-date-picker>
            </div>
          </div>
          <div class="collapse_input_cell_box">
            <span class="input_befor_text">预计装修时间：</span>
            <div class="input_after_div wid_28vw">
              <el-date-picker
                class="wid_28vw"
                v-model="form.estimatedDecorationTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="-选择日期-"
              ></el-date-picker>
            </div>
          </div>
          <div class="collapse_input_cell_box">
            <span class="input_befor_text">房屋总面积：</span>
            <div class="input_after_div">
              <el-select
                v-model="form.totalAreaOfHousingId"
                placeholder="-请选择房屋总面积-"
                class="wid_28vw"
              >
                <el-option
                  v-for="item in styleList3"
                  :key="item.id"
                  :label="item.dictName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="collapse_input_cell_box">
            <span class="input_befor_text">房屋装修面积：</span>
            <div class="input_after_div">
              <el-select
                v-model="form.decoratedHousingAreaId"
                placeholder="-请选择房屋装修面积-"
                class="wid_28vw"
              >
                <el-option
                  v-for="item in styleList3"
                  :key="item.id"
                  :label="item.dictName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>
          <div class="collapse_input_cell_box">
            <span class="input_befor_text">装修进度：</span>
            <div class="input_after_div">
              <el-select
                v-model="form.decorationProgressId"
                placeholder="-请选择房屋装修进度-"
                class="wid_28vw"
              >
                <el-option
                  v-for="item in styleList4"
                  :key="item.id"
                  :label="item.dictName"
                  :value="item.id"
                ></el-option>
              </el-select>
            </div>
          </div>

          <div class="collapse_input_cell_box">
            <span class="input_befor_text">装修完成时间：</span>

            <div class="input_after_div">
              <el-date-picker
                class="wid_28vw"
                v-model="form.finishingTimeOfDecoration"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="-选择日期-"
              ></el-date-picker>
            </div>
          </div>
          <div class="collapse_input_cell_box">
            <span class="input_befor_text">意向产品：</span>
            <div class="input_after_div">
              <el-checkbox-group v-model="form.projectId">
                <el-checkbox
                  v-for="item in styleList5"
                  :key="item.id"
                  :label="item.id"
                >{{item.dictName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="collapse_input_cell_box">
            <span class="input_befor_text">意向风格：</span>
            <div class="input_after_div">
              <el-checkbox-group v-model="form.styletId">
                <el-checkbox
                  v-for="item in styleList6"
                  :key="item.id"
                  :label="item.id"
                >{{item.dictName}}</el-checkbox>
              </el-checkbox-group>
            </div>
          </div>
          <div class="collapse_input_cell_box_area m-top20">
            <span class="input_befor_text">备注：</span>
            <div class="input_after_div">
              <el-input type="textarea" v-model="form.remarks" maxlength="50"></el-input>
            </div>
          </div>
        </div>

        <div class="foot_btn_box m-top20">
          <el-button type="primary" @click="addDemand">保 存</el-button>
          <el-button @click="backClient">取 消</el-button>
        </div>
      </el-card>
    </div>
  </div>
</template>


<script>
import breadcrumb from "../../components/breadcrumb";
import {
  getCustomerInfo, //编辑客户_获取客户信息
  insertCustomerDemand,
  getCustomerDemand,
  updateCustomerDemand //客户需求_编辑/删除
} from "api/customermanagement/myclient/myclient";
import { listBaseDict //字典
} from "api/order/order/order";
export default {
  // name: 'brandmanagement',
  data() {
    return {
      //头部面包屑导航
      navList: [],
      //手风琴效果展开
      userInfo: {},
      form: {
        customerId: "", //客户id
        customerDemandId: "", //客户需求id
        housingTypeId: "", //房屋类型,
        housingBuildTypeId: "", //房屋户型,
        handoverDate: "", //交房日期,
        estimatedDecorationTime: "", //预计装修时间,
        totalAreaOfHousingId: "", //房屋总面积,
        decoratedHousingAreaId: "", //装修房屋面积,
        decorationProgressId: "", //装修进度,
        finishingTimeOfDecoration: "", //装修完成时间,
        projectId: [], //意向产品,
        styletId: [], //意向风格,
        remarks: "" //备注
      },
      styleList: [
        { age: "19-30", val: 1 },
        { age: "30-40", val: 2 },
        { age: "40以上", val: 3 }
      ],

      styleList1: [],
      styleList2: [],
      styleList3: [],
      styleList4: [],
      styleList5: [],
      styleList6: [],
      statuestyle: ""
    };
  },
  mounted() {
    // 头部面包屑
    this.getUserInfo();
    this.navList = this.$route.meta;
    if (this.$route.query.customerDemandId == undefined) {
      //新增客户需求
    } else {
      //有客户需求id    根据客户需求id查询信息进行回显
      this.getCustomerinfo();
    }
    //获取客户需求的字典内容
    this.getlistBaseDict("HOUSING_BUILD_TYPE"); //房屋户型 字典      //styleList1  房屋户型
    this.getlistBaseDict("HOUSING_AREA"); //房屋面积 装修面积 字典    //styleList3  房屋装修面积
    this.getlistBaseDict("DECORATION_PROGRESS"); //装修进度 字典     //styleList4  装修进度
    this.getlistBaseDict("DEMAND_PRODUCT"); //意向产品 字典          //styleList5  产品
    this.getlistBaseDict("DEMAND_STYLE"); //意向风格 字典            //styleList6  风格
  },
  methods: {
    //获取客户需求
    getlistBaseDict(typeName) {
      console.log("获取字典内容");
      let data = {
        dataType: typeName
      };
      listBaseDict(data).then(res => {
        if (res.status == "200") {
          switch (typeName) {
            case "HOUSING_BUILD_TYPE":
              this.styleList1 = res.data;
              break;

            case "HOUSING_AREA":
              this.styleList3 = res.data;
              break;

            case "DECORATION_PROGRESS":
              this.styleList4 = res.data;
              break;

            case "DEMAND_PRODUCT":
              this.styleList5 = res.data;
              break;

            case "DEMAND_STYLE":
              this.styleList6 = res.data;
              break;
          }
        } else {
          this.$message.error("获取客户需求内容失败");
        }
      });
    },

    //获取客户信息
    getUserInfo() {
      console.log("1");
      let query = {
        storeCustomerId: this.$route.query.id
      };
      getCustomerInfo(query)
        .then(res => {
          console.log(res);
          this.userInfo = res.data;
        })
        .catch(error => {
          console.error(
            "编辑客户_获取客户信息  customermanagementmyclientindex",
            error
          );
        });
    },

    //查询客户需求内容   进行回显
    getCustomerinfo() {
      let query = {
        customerDemandId: this.$route.query.customerDemandId
      };
      getCustomerDemand(query)
        .then(res => {
          this.form.housingTypeId = res.data.housingTypeId.toString();
          this.form.housingBuildTypeId = res.data.housingBuildTypeId;
          this.form.handoverDate = res.data.handoverDate;
          this.form.estimatedDecorationTime = res.data.estimatedDecorationTime;
          this.form.totalAreaOfHousingId = res.data.totalAreaOfHousingId;
          this.form.decoratedHousingAreaId = res.data.decoratedHousingAreaId;
          this.form.decorationProgressId = res.data.decorationProgressId;
          this.form.finishingTimeOfDecoration =
            res.data.finishingTimeOfDecoration;
          this.form.projectId = res.data.productId.split(",");
          this.form.projectId = this.form.projectId.map(Number);
          this.form.styletId = res.data.styletId.split(",");
          this.form.styletId = this.form.styletId.map(Number);
          this.form.remarks = res.data.remarks;
          console.log("housingBuildTypeId" + res.data.housingBuildTypeId);
        })
        .catch(error => {
          console.error(
            "获取客户需求  customermanagementmyclientcustomerdemand",
            error
          );
        });
    },

    //添加/修改需求
    addDemand() {
      if (this.$route.query.customerDemandId == undefined) {
        //新增客户需求
        this.form.customerId = parseInt(this.$route.query.customerId);
        this.form.storeCustomerId = parseInt(this.$route.query.id);
        let data = this.form;
        data.housingTypeId = parseInt(data.housingTypeId);
        data.projectId = data.projectId.map(Number);
        data.styletId = data.styletId.map(Number);

        insertCustomerDemand(data)
          .then(res => {
            if (res.status == "200") {
              this.$message.success("添加客户需求成功");
              //添加成功返回客户需求列表页
              this.$router.push({
                path: "clientinformation",
                query: {
                  id: this.$route.query.id,
                  customerId: this.$route.query.customerId
                }
              });
            } else {
              this.$message.error("添加客户需求失败");
            }
          })
          .catch(error => {
            console.error(
              "添加客户需求  customermanagementmyclientcustomerdemand",
              error
            );
          });
      } else {
        let data = this.form;
        data.customerDemandIds = [];
        data.customerDemandIds.push(this.$route.query.customerDemandId);
        data.housingTypeId = parseInt(data.housingTypeId);
        data.projectId = data.projectId.map(Number);
        data.styletId = data.styletId.map(Number);
        console.log(data);
        updateCustomerDemand(data)
          .then(res => {
            if (res.status == "200") {
              this.$message.success("修改需求成功");
              this.backClient();
            } else {
              this.$message.success("修改需求失败");
            }
          })
          .catch(error => {
            console.error(
              "编辑  customermanagementmyclientcustomerdemand",
              error
            );
          });
      }
    },
    //取消按钮退回客户信息页面
    backClient() {
      this.$router.push({
        path: "clientinformation",
        query: {
          id: this.$route.query.id
        }
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

    //获取列表信息
    getListData() {
      let _this = this;
      let url = "";

      //待备案
      url = baseURL + "/company/project/getStayRecordProjectList2";

      let data = {
        pc_id: "", //项目类型
        company_name: "", //项目施工单位
        create_start: "", //创建起始时间
        create_end: "", //创建结束时间
        searchtext: "",
        currPage: this.currentPage3, //分页信息
        pageSize: 10 //显示数量
      };
      $.ajax({
        url: url,
        type: "POST",
        // contentType:"application/json",
        data: data,
        success: function(res) {
          console.log(res);
          if (res.code == 0) {
            _this.tabList = res.page.list;

            _this.totle = res.page.totalCount;
          } else {
            alert(res.msg);
            return;
          }
        },
        error: function(err) {}
      });
    },

    // 操作
    projectdetail(row) {},

    // 改变table头部颜色
    tableHeaderColor({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return "background: #f8f8f8;border-color: #dddddd";
      }
    },
    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },
    //分页函数回调
    handleCurrentChange(val) {
      this.currentPage3 = val;
      this.getData();
    },
    //勾选函数回调
    handleSelectionChange(val) {},

    //查询按钮点击
    searchFun() {
      this.currentPage3 = 1;
      this.getListData();
    },
    //新增商品页面
    addHandle() {
      this.$router.push({ path: "choseproducts" });
    }
  },
  components: {
    breadcrumb
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
  justify-content: space-between;
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
  width: 96%;
  display: flex;
  flex-wrap: nowrap;
  align-items: center;
  span {
    width: 110px;
  }
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
  text-align: right;
  font-weight: bold;
  .nust_tips {
    color: red;
  }
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
</style>
<style>
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
.m_lef2vw {
  margin-left: 2vw;
}
.wid_28vw {
  width: 28.8vw !important;
}
table tr td {
  width: 33%;
  height: 48px;
  border: solid #ebeef5;
  border-width: 0px 1px 1px 0px;
  padding-left: 10px;
}
.tab_class {
  margin-top: 30px;
  margin-bottom: 30px;
  border: solid #ebeef5;
  border-radius: 5px;
  border-width: 1px 0px 0px 1px;
  width: 95%;
  margin-left: 2.5%;
}
</style>



