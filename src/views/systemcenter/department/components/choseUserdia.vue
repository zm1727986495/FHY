<template>
  <div class="stockNumdia">
    <el-dialog title="新增人员" :visible="visible" width="80%" :before-close="handleClose" custom-class="customDialogTitle">
      <el-container style="height: 500px;" v-loading="loading">
        <el-aside width="220px" class="m-right10">
          <el-input v-model="filterText" placeholder="组织名称"></el-input>
          <el-tree style="font-size: 14px;" :data="treeData" :filter-node-method="filterNode" :default-expand-all="true" :highlight-current="true" 
          :expand-on-click-node="false" ref="tree" node-key="id" @node-click="nodeClick"></el-tree>
        </el-aside>
        <el-main>
          <div class="queryForm">
            <el-form :inline="true" :model="queryForm">
              <el-form-item>
                <el-input @keyup.enter.native='onSubmit' v-model.trim="queryForm.userGroup" clearable placeholder="人员编号/姓名/账户"></el-input>
              </el-form-item>
              <el-form-item>
                <el-button type="warning" class="button-fc" @click="onSubmit">查询</el-button>
                <el-button type="primary" @click="resetForm">重置</el-button>
              </el-form-item>
            </el-form>
          </div>
          <div class="table_list">
            <el-table ref="userTableDialog" :data="tabList" border @selection-change="diaUserSelectionChange" 
            :row-class-name="tableRowClassName" height="400px" :row-key="getRowKeys">
              <el-table-column type="selection" width="55" align="center" :reserve-selection="true"></el-table-column>
              <el-table-column prop="name" label="人员姓名" align="center" sortable show-overflow-tooltip></el-table-column>
              <el-table-column prop="mobilePhone" label="联系方式" align="center" show-overflow-tooltip sortable></el-table-column>
              <el-table-column prop="baseDictName" label="岗位" align="center" show-overflow-tooltip sortable></el-table-column>
              <el-table-column prop="basePostRankName" label="岗等" align="center" show-overflow-tooltip sortable></el-table-column>
              <el-table-column prop="basePostGradeName" label="岗级" align="center" show-overflow-tooltip sortable></el-table-column>
              <el-table-column prop="groupName" label="所属机构" align="center" show-overflow-tooltip sortable></el-table-column>
            </el-table>
            <div class="pagination_wrap">
              <pagination :current-page="currentPage" :pageSize="pageSize" :total="total" @sizeChange="sizeChange" @currentChange="currentChange"></pagination>
            </div>
          </div>
        </el-main>
      </el-container>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="handleOk">确定</el-button>
        <el-button @click="handleClose">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listOrganization, listUser, listBaseUser } from "api/pulicJava";
import pagination from "@/views/components/pagination";

export default {
  props: ["visible"],
  components: {
    pagination
  },
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 10, //总页数
      total: 0, //总条数
      loading: false, //loading加载
      filterText: "", //组织机构关键字查询
      treeData: [], //组织机构数数组
      elsectVal: [], //选中user数组
      tabList: [], //table数组
      queryForm: {}, //usertable的查询条件
      organizationId: "" //点击查询人员
    };
  },
  methods: {
    //关闭弹框
    handleClose() {
      this.$emit("close_user");
    },

    //勾选人员  关闭弹框
    handleOk() {
      if (!this.elsectVal.length) {
        this.$message.warning("请选择人员");
        return;
      }
      this.$emit("close_user", this.elsectVal,this.organizationId);
    },
    // 节点过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //节点点击
    nodeClick(data) {
      this.organizationId = data.id;
      this.currentPage = 1;
      this.listUserFun();
    },

    listUserFun() {
      let query = {
        ...this.queryForm,
        organizationId: this.organizationId,
        page: this.currentPage,
        limit: this.pageSize
      };
      listBaseUser(query).then(res => {
          if(res.status==200){
            this.tabList = res.data.rows;
            this.tabList.forEach(item=>{
              item.onlyId = item.id+""+item.organizationId;
            })
            this.total = res.data.total;
          }
        })
        .catch(error => {
        console.error("systemcenter/department/components/choseUserdia");
      });
      // listUser(query)
      //   .then(res => {
      //     if(res.status==200){
      //       this.tabList = res.data.rows;
      //       this.tabList.forEach(item=>{
      //         item.onlyId = item.id+""+item.organizationId;
      //       })
      //       this.total = res.data.total;
      //     }
      //   })
      //   .catch(error => {
      //     console.log("systemcenter/department/components/choseUserdia");
      //   });
    },

    //查询按钮
    onSubmit() {
      this.currentPage = 1;
      this.listUserFun();
    },
    //重置方法
    resetForm() {
      this.queryForm = {};
    },

    //翻页记忆
    getRowKeys(row) {
      return row.onlyId;
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },

    //多选内容改变
    diaUserSelectionChange(val) {
      this.elsectVal = val;
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.listUserFun();
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.listUserFun();
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.loading = true;
    listOrganization().then(res => {
      this.loading = false;
      this.treeData = res.data;
    });
  }
};
</script>
<style scoped lang='scss'>
.stockNumdia {
  .el-main {
    padding: 0 10px;
  }
  .btn_fotter {
    display: flex;
    margin-top: 20px;
    flex-wrap: nowrap;
    width: 100%;
    justify-content: flex-end;
  }
}
</style>

