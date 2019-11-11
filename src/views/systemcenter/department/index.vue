<template>
  <div class="departmentindex">
    <div class="head_nav">
      <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="search_box">
        <div class="search_item">
          <el-input @keyup.enter.native="searchFun" v-model="searchForm.groupCode" class="width-100" placeholder="输入部门名称/部门编码"></el-input>
        </div>

        <div class="search_item">
          <el-date-picker v-model="time" class="width-100" style="width:100%" type="daterange" range-separator="至" 
          start-placeholder="开始时间" end-placeholder="结束时间" value-format="yyyy-MM-dd" format="yyyy-MM-dd" @change="timeChange"
          ></el-date-picker>
        </div>

        <div class="search_item">
          <el-button class="button-fc" type="warning" size="medium" @click="searchFun">查询</el-button>
          <el-button class="el-button--medium" type="primary" size="medium" @click="resetFun">重置</el-button>
        </div>
        <div class="search_item"></div>
      </div>

      <div class="h-width"></div>

      <!-- 按钮   -->
      <div class="btn_list_1">
        <el-button v-if="btnJurisdiction['department_addp']" size="small" class="button-96" @click="adddepartment()">新增部门</el-button>
        <el-button v-if="btnJurisdiction['department_editt']" size="small" class="button-96" @click="editdepartment()">编辑</el-button>
        <el-button v-if="btnJurisdiction['department_ddel']" size="small" class="button-96" @click="deldepartment()">删除</el-button>
      </div>

      <!-- table表格 -->
      <div class="table_list lvs attribute m-top20">
        <el-table
          border
          :row-class-name="tableRowClassName"
          @selection-change="handleSelectionChange"
          :data="tabList"
          style="width: 100%;"
        >
          <el-table-column type="selection" width="40" fixed='left'></el-table-column>

          <el-table-column prop="serveGroupName" label="部门名称" width="240" sortable align="center">
            <template slot-scope="scope">
              <div>
                <p
                  class="table_action_span"
                  @click="opendetail(scope.row)"
                >{{scope.row.serveGroupName}}</p>
              </div>
            </template>
          </el-table-column>

          <el-table-column prop="brandName" label="品牌" width="240" sortable align="center" show-overflow-tooltip></el-table-column>

          <el-table-column prop="categoryName" label="品类" width="240" sortable align="center" show-overflow-tooltip></el-table-column>

          <el-table-column prop="storeName" label="关联门店" width="240" sortable align="center" show-overflow-tooltip></el-table-column>

          <el-table-column prop="groupTypeName" label="类型" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="serveUserName" label="管理员" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="createTime" label="创建时间" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="createName" label="创建人" width="240" sortable align="center"></el-table-column>

          <el-table-column prop="remark" label="备注" width="240" sortable align="center" show-overflow-tooltip></el-table-column>
        </el-table>

        <!-- 分页 -->
        <div class="pagination_wrap">
          <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
        </div>
      </div>
    </el-card>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import spot from "@/assets/images/spot.png";
import {
  listServeGroup, //获取列表
  deleteServeGroup //删除部门
} from "@/api/systemcenter/department";
export default {
  components: {
    breadcrumb,
    pagination
  },
  data() {
    return {
      btnJurisdiction: JSON.parse(this.$loca.getItem("element")),//按钮权限
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      spot, //操作图片
      navList: [], //头部面包屑
      time: [], //时间选择器
      elsectVal: [], //选中框
      tabList: [], //table数据
      searchForm: {} //查询条件
    };
  },

  // mounted() {
  //   // 头部面包屑
  //   this.navList = this.$route.meta;
  //   this.searchFun();
  // },
  activated(){
    // 头部面包屑
    this.navList = this.$route.meta;
    this.searchFun();
  },
  // deactivated () {
  //     this.$destroy(true)
  // },
  methods: {
    //查询方法
    searchFun() {
      this.currentPage = 1;
      this.getListFun();
    },
    //查询方法
    getListFun() {
      let data = {
        ...this.searchForm,
        page: this.currentPage,
        limit: this.pageSize
      };
      listServeGroup(data)
        .then(res => {
          this.tabList = res.data.rows;
          this.total = res.data.total;
        })
        .catch(error => {
          console.log(
            "\viewssystemcenterdepartmentindex   获取部门列表" + error
          );
        });
    },

    //重置方法
    resetFun() {
      this.searchForm = {},
      this.time = [];
      this.searchFun();      
    },

    //查看部门
    opendetail(obj) {
      this.$router.push({
        path: "/department/adddepartment",
        query: {
          serveGroupId: obj.serveGroupId,
          showbtn:1,  //查看页面隐藏提交按钮和添加人员按钮
        }
      });
    },

    //添加部门
    adddepartment() {
      this.$router.push({
        path: "/department/adddepartment"
      });
    },

    //编辑部门
    editdepartment() {
      if (this.elsectVal.length == 0) {
        this.$message.warning("请选择要编辑的部门");
      } else if (this.elsectVal.length > 1) {
        this.$message.warning("一次只能编辑修改一个部门");
      } else {
        this.$router.push({
          path: "/department/adddepartment",
          query: {
            serveGroupId: this.elsectVal[0].serveGroupId
          }
        });
      }
    },

    // 删除部门
    deldepartment() {
      if (this.elsectVal.length == 0) {
        this.$message.warning("请选择要删除的部门");
      } else {
        let data = {
          serveGroupIds: this.elsectVal.map(item => {
            return item.serveGroupId;
          })
        };
        //弹框提示
        this.$confirm("是否删除信息?", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        })
          .then(() => {
            deleteServeGroup(data)
              .then(res => {
                if (res.status == "200") {
                  this.$message.success("删除信息成功");
                  this.searchFun();
                }
              })
              .catch(error => {
                console.log("views/systemcenter/department/index" + error);
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

    //时间选择器改变事件
    timeChange() {
      this.searchForm.createStartTime = this.time ? this.time[0] : "";
      this.searchForm.createEndTime = this.time ? this.time[1] : "";
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //多选内容改变
    handleSelectionChange(val) {
      this.elsectVal = val;
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getListFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getListFun();
    }
  }
};
</script>
<style scoped lang='scss'>
.departmentindex {
  .search_box {
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;
  }
  .search_item {
    width: calc(((94vw - 250px)) / 4);
    margin-bottom: 20px;
    cursor: pointer;
    position: relative;
    display: flex;
    flex-wrap: nowrap;
    align-items: center;

    .fontMore {
      color: #d0cfcf;
    }
  }
  .search_item_btn {
    display: block;
    width: 200px;
    margin: 0 auto;
  }

  .btn_list_1 {
    margin: 15px 0px;
    display: flex;
    flex-wrap: wrap;
    > button {
      margin: 5px;
    }
  }
}
</style>

