<template>
  <div class="adddepartment">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <h4 class="moduleHeader">
        <span class="title" v-if="!serveGroupId">新增部门</span>
        <span class="title" v-else>部门信息</span>
      </h4>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" class="formclass">
        <div class="wid75">
          <div class="infoform">
            <div class="infoform_item">
              <el-form-item label="类型" prop="serveType">
                <el-select v-model="ruleForm.serveType" placeholder="请选择类型" filterable class="width-100">
                  <el-option v-for="item in departmentList" :key="item.id" :label="item.dictName" :value="item.id" clearable
                  ></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="infoform_item">
              <el-form-item label="部门名称" prop="serveGroupName">
                <el-input v-model="ruleForm.serveGroupName"></el-input>
              </el-form-item>
            </div>
          </div>

          <div class="infoform">
            <div class="infoform_item">
              <el-form-item label="关联品牌" prop="brandIds">
                <el-select v-model="ruleForm.brandIds" placeholder="请选择品牌" class="width-100" filterable multiple collapse-tags>
                  <el-option v-for="item in brandList" :key="item.brandId" :label="item.brandName" :value="item.brandId" clearable></el-option>
                </el-select>
              </el-form-item>
            </div>
            <div class="infoform_item">
              <el-form-item label="关联品类" prop="commodityCategoryIds">
                <el-select v-model="ruleForm.commodityCategoryIds" placeholder="请选择品类" class="width-100" filterable multiple collapse-tags>
                  <el-option v-for="item in categoryList" :key="item.commodityCategoryId" :label="item.categoryName" :value="item.commodityCategoryId" clearable></el-option>
                </el-select>
              </el-form-item>
            </div>
          </div>

          <div class="infoform">
            <div class="infoform_item">
              <el-form-item label="关联门店" prop="storeIds">
                <el-select v-model="ruleForm.storeIds" placeholder="请选择门店" class="width-100" filterable multiple collapse-tags>
                  <el-option v-for="item in storeList" :key="item.storeId" :label="item.storeName" :value="item.storeId" clearable></el-option>
                </el-select>
              </el-form-item>
            </div>

            <div class="infoform_item">
              <el-form-item label="所属机构" class="width-100">
                <el-input v-model="organizationName" @focus="openTree" :disabled="disainput"></el-input>
                <el-input v-model="ruleForm.organizationId" style="display:none;"></el-input>
              </el-form-item>
            </div>

            <organizationdia :visible="organizationdia_vis" v-if="organizationdia_vis" :defaultOpenArr="defaultOpenArr" @close_org="closetree"></organizationdia>
          </div>

          <div class="infoform">
            <el-form-item label="备注" class="width-100">
              <el-input type="textarea" class="width-100" v-model="ruleForm.remark"></el-input>
            </el-form-item>
          </div>
        </div>
        <!-- 选择人员弹框 -->
        <choseUserdia v-if="choseUser_vis" :visible="choseUser_vis" @close_user="closeUser"></choseUserdia>

        <div v-if="serveGroupId">
          <h4 class="moduleHeader">
            <span class="title">选择人员</span>
          </h4>
          <div v-if="showbtn">
            <el-button class="button-96" size="small" @click="openUser">新增</el-button>
            <el-button class="button-96" size="small" @click="delUser">删除</el-button>
            <!-- <el-button class="button-96" size="small" @click="administratorUser">设为管理员</el-button>
            <el-button class="button-96" size="small" @click="leaderUser">设为组长</el-button> -->
          </div>
          <div class="table_list lvs attribute m-top20">
            <el-table border :data="userList" @selection-change="userSelectionChange" :row-class-name="tableRowClassName" :row-key="getRowKeysT">
              <el-table-column align="center" type="selection" width="40" :reserve-selection="true"></el-table-column>
              <el-table-column align="center" prop="name" label="人员姓名"></el-table-column>
              <el-table-column align="center" prop="mobilePhone" label="联系方式" sortable></el-table-column>
              <el-table-column align="center" prop="serveGroupName" label="所属机构"></el-table-column>
              <el-table-column align="center" prop="dictName" label="岗位"></el-table-column>
              <el-table-column align="center" prop="basePostRankName" label="岗等"></el-table-column>
              <el-table-column align="center" prop="basePostGradeName" label="岗级"></el-table-column>
              <!-- <el-table-column align="center" prop="isAdministrator" label="是否管理员">
                <template slot-scope="scope">
                  <div>
                    <p v-if="scope.row.isAdministrator == 1072">是</p>
                    <p v-else>否</p>
                  </div>
                </template>
              </el-table-column> -->
            </el-table>
            <div class="pagination_wrap">
              <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
            </div>
          </div>
        </div>

        <div :class="serveGroupId?'bottom_btnlist1 m-top5':'bottom_btnlist2 m-top5'">
          <el-button type="primary" @click="submitForm" v-if="showbtn">提交</el-button>
          <el-button @click="backFun">返回</el-button>
        </div>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import choseUserdia from "./components/choseUserdia";
import organizationdia from "./components/organizationdia";
import {
  listBaseDict //字典   BRANCH_MANAGE
} from "api/order/order/order";
import {
  addServeGroup, //添加部门
  editServeGroup, //编辑部门
  serveGroupDetails, //部门信息回显
  listServeUser, //部门人员信息回显
  addServeUser, //添加人员
  deleteServeUser, //删除人员
  editIsAdministrator //设置管理员
} from "@/api/systemcenter/department";

import {
  listStore,
  listBrand,
  listCategory,
  listOrganization
} from "api/common/common";

import spot from "@/assets/images/spot.png";

import {
  listInstallationOrder //获取列表
} from "@/api/entrepotSet/aftermarket/repaircenter/repaircenter";
export default {
  components: {
    breadcrumb,
    choseUserdia, //新增人员弹框
    organizationdia, //组织机构弹框
    pagination
  },
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      spot, //操作图片
      navList: [], //头部面包屑
      time: [], //时间选择器
      elsectVal: [], //选中框
      tabList: [{}], //table数据
      searchForm: {}, //查询条件
      serveGroupId: "", //部门id   有部门id时候   为编辑页面
      showbtn: true,
      disainput:false,
      departmentList: [], //部门数组
      propsCascader: { checkStrictly: true }, //级联选择器父子不关联
      storeList: [], //门店数组
      brandList: [], //品牌数组
      categoryList: [], //品类数组
      organizationList: [], //组织机构数组
      ruleForm: {
        brandIds: [],
        commodityCategoryIds: [],
        storeIds: [],
        organizationIdArr: []
      }, //表单
      organizationName: "", //展示在页面用的组织机构的名字
      rules: {
        serveGroupName: [
          { required: true, message: "请输入部门名称", trigger: "blur" }
        ],
        serveType: [
          { required: true, message: "请选择类型", trigger: "change" }
        ],
        brandIds: [
          { required: true, message: "请选择品牌", trigger: "change" }
        ],
        commodityCategoryIds: [
          { required: true, message: "请选择品类", trigger: "change" }
        ],
        storeIds: [
          { required: true, message: "请选择门店", trigger: "change" }
        ],
        organizationIdArr: [
          { required: true, message: "请选择所属机构", trigger: "change" }
        ]
      }, //表单验证
      choseUser_vis: false, //选择人员弹框是否显示
      organizationdia_vis: false, //组织机构弹框是否显示
      defaultOpenArr: [], //组织机构默认展开的数组
      userList: [] //页面table、
    };
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.mountedFun(); //初始化获取门店  品牌  品类
    this.serveGroupId = this.$route.query.serveGroupId; //如果有部门id 为编辑页面
    if (this.$route.query.showbtn) {
      this.showbtn = false; //是否显示功能按钮  在查看页面没有操作的按钮
    }

    //回显信息
    if (this.serveGroupId) {
      this.getBackInfo();
      this.disainput = true;
    }
  },
  methods: {
    //打开新增用户弹框
    openUser() {
      this.choseUser_vis = true;
    },

    //关闭新增用户弹框
    closeUser(val,id) {
      if (val) {
        let data = {
          serveUsers: val.map(item => {
            return { userId: item.id, name: item.name,organizationId: id, };
          }),
          serveGroupId: this.serveGroupId,
        };
        addServeUser(data).then(res => {
          if (res.status == "200") {
            this.$message.success(res.message);
            this.getUserList();
          }
        });
      }
      this.choseUser_vis = false;
    },

    //删除人员
    delUser() {
      if (this.elsectVal.length == 0) {
        this.$message.warning("您没有勾选用户");
      } else {
        let data = {
          serveUserIds: this.elsectVal.map(item => {
            return item.serveUserId;
          })
        };

        //删除提示
        this.$confirm("是否删除信息?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            //操作调接口
            deleteServeUser(data)
              .then(res => {
                if (res.status == "200") {
                  this.$message.success("删除数据成功");
                  this.getUserList();
                }
              })
              .catch(error => {
                console.log(
                  "views/systemcenter/department/adddepartment" + error
                );
              });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消操作"
            });
          });
      }
    },

    //设置管理员
    administratorUser() {
      if (this.elsectVal.length == 0) {
        this.$message.warning("您没有勾选用户");
      } else {
        let data = {
          serveUserIds: this.elsectVal.map(item => {
            return item.serveUserId;
          })
        };
        editIsAdministrator(data)
          .then(res => {
            if (res.status == "200") {
              this.$message.success("设置管理员成功");
              this.getUserList();
            }
          })
          .catch(error => {
            console.log("views/systemcenter/department/adddepartment" + error);
          });
      }
    },

    //设为组长
    leaderUser() {
      this.$message.warning("组长功能未开发");
    },

    //打开组织机构树弹框
    openTree() {
      this.organizationdia_vis = true;
    },

    //关闭组织机构树弹框
    closetree(obj, arr) {
      if (obj) {
        this.organizationName = obj.label;
        this.ruleForm.organizationId = obj.id;
        this.defaultOpenArr = arr;
      }
      this.organizationdia_vis = false;
    },

    //回显信息  有部门id
    getBackInfo() {
      let data = {
        serveGroupId: this.serveGroupId
      };
      serveGroupDetails(data)
        .then(res => {
          if (res.status == "200") {
            this.ruleForm = res.data;
            // this.ruleForm.serveType = String(this.ruleForm.serveType);

            //处理多选下拉  回显默认选中的值

            let arr1 = this.ruleForm.brands.map(item => {
              return item.brandId;
            });

            this.$set(this.ruleForm, "brandIds", arr1);

            let arr2 = this.ruleForm.commodityCategorys.map(item => {
              return item.commodityCategoryId;
            });

            this.$set(this.ruleForm, "commodityCategoryIds", arr2);

            let arr3 = this.ruleForm.stores.map(item => {
              return item.storeId;
            });

            this.$set(this.ruleForm, "storeIds", arr3);

            //处理组织机构  回显默认选中的值

            //取值maps数组的最后一个对象的key
            let keyName = Object.keys(
              this.ruleForm.maps[this.ruleForm.maps.length - 2]
            )[0];

            // 取名字
            this.organizationName = this.ruleForm.maps[
              this.ruleForm.maps.length - 2
            ][keyName];

            //取默认展开的组织机构的数组   传值到组件中

            this.ruleForm.maps.forEach(item => {
              this.defaultOpenArr.push(Number(Object.keys(item)[0]));
            });
            console.log(this.defaultOpenArr);
          }
        })
        .catch(error => {
          console.log("views/systemcenter/department/adddepartment" + error);
        });

      this.getUserList();
    },

    //获取门店人员列表
    getUserList() {
      //获取部门人员列表
      let query = {
        serveGroupId: this.serveGroupId,
        page: this.currentPage,
        limit: this.pageSize
      };
      listServeUser(query)
        .then(res => {
          this.total = res.data.total;
          this.userList = res.data.rows;
        })
        .catch(error => {
          console.log("views/systemcenter/department/adddepartment" + error);
        });
    },

    //提交
    submitForm() {
      if(this.organizationName==""){
        this.$message.warning("请选择组织机构");
        return;
      }
      this.$refs["ruleForm"].validate(valid => {
        if (valid) {
          //有部门id为编辑页面   没有为新增页面
          if (this.serveGroupId) {
            editServeGroup(this.ruleForm)
              .then(res => {
                if (res.status == "200") {
                  this.$message.success("编辑部门信息成功！");
                  this.$router.push({
                    path: "/department/department"
                  });
                }
              })
              .catch(error => {
                console.log(
                  "views/systemcenter/department/adddepartment编辑部门" + error
                );
              });
          } else {
            addServeGroup(this.ruleForm)
              .then(res => {
                if (res.status == "200") {
                  this.$message.success("添加部门成功！");
                  this.$router.push({
                    path: "/department/department"
                  });
                }
              })
              .catch(error => {
                console.log(
                  "views/systemcenter/department/adddepartment新增部门" + error
                );
              });
          }
        } else {
          this.$message.warning("请检查填写信息");
          return false;
        }
      });
    },
    //取消  退回
    backFun() {
      this.$router.go(-1);
    },

    //初始化获取门店  品牌  品类
    mountedFun() {
      //获取门店
      listStore()
        .then(res => {
          if (res.status == "200") {
            console.log(res);
            this.storeList = res.data;
            // this.ruleForm.storeIds = res.data.map(item=>{
            //   return item.storeId
            // })
          }
        })
        .catch(error => {
          console.error("views/systemcenter/department/adddepartment", error);
        });
      // 获取全部品牌
      listBrand()
        .then(res => {
          if (res.status == 200) {
            this.brandList = res.data;
          }
        })
        .catch(error => {
          console.log("views/systemcenter/department/adddepartment", error);
        });
      //获取全部品类
      listCategory()
        .then(res => {
          if (res.status == "200") {
            console.log(res);
            this.categoryList = res.data;
          }
        })
        .catch(error => {
          console.log("views/systemcenter/department/adddepartment", error);
        });

      let data = {
        dataType: "BRANCH_MANAGE"
      };

      listBaseDict(data)
        .then(res => {
          this.departmentList = res.data;
        })
        .catch(error => {
          console.log("views/systemcenter/department/adddepartment", error);
        });
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //多选内容改变
    userSelectionChange(val) {
      this.elsectVal = val;
    },

    //选中记忆
    getRowKeysT(row) {
      return row.serveUserId;
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getUserList();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getUserList();
    }
  }
};
</script>
<style scoped lang='scss'>
.adddepartment {
  .formclass {
    .infoform {
      display: flex;
      flex-wrap: nowrap;
      .infoform_item {
        width: 50%;
      }
    }
  }
  .wid75 {
    width: 75%;
  }
  .moduleHeader {
    .title {
      color: #006ec7;
    }
  }
  .bottom_btnlist1 {
    width: 100%;
    text-align: center;
  }
  .bottom_btnlist2 {
    width: 75%;
    text-align: center;
  }
}
</style>

