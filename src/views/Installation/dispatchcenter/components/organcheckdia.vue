<template>
  <!-- 预约上门弹出框 -->
  <div class="organizationdia">
    <el-dialog :title="title" :visible="visible" width="850px" :before-close="handleClose" custom-class="customDialogTitle">
      <div class="content_box">
        <div>
          <el-input v-model="filterText" placeholder="组织名称"></el-input>

          <el-tree 
            ref="tree" 
            show-checkbox 
            :data="treeData" 
            :filter-node-method="filterNode" 
            node-key="id" 
            :props="defaultProps"
            :expand-on-click-node="false" 
            :default-checked-keys="defaultArr" 
            :highlight-current="true" 
            :check-strictly="true" 
            @check-change="nodeData"></el-tree>
        </div>
        <div class="userList">
          <el-select v-if="isType" v-model="userListIds" filterable multiple placeholder="请选择借调工人" style='width:500px'>
            <el-option v-for="item in checkList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          <el-select v-else v-model="userListId" filterable :placeholder="title" style='width:500px'>
            <el-option v-for="item in checkList" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
          
          <!-- <el-checkbox-group v-model="userList">
            <el-checkbox class="userItem" :label="item" v-for="(item,index) in checkList" :key="index">{{item.name}}</el-checkbox>
          </el-checkbox-group> -->
        </div>
      </div>

      <div class="dialog-footer">
        <el-button type="primary" size="mini" @click="handleok">确 定</el-button>
        <el-button size="mini" @click="handleClose">取消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import {
  listOrganizationStaff // 获取组织人员
} from "api/entrepotSet/duty/index";
import { listOrganization } from "api/pulicJava";

export default {
  props: ["visible","defaultArrF","userListF","isType",'title'],
  components: {
    breadcrumb,
    pagination
  },
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      treeData: [],
      objArr: [],
      filterText:"",
      list:[],
      checkList: [], //人员列表
      userList:[],//传递到父组件的user对象
      userListIds:[],//id集合
      userListId:'',
      defaultArr:[],//选中的组织机构id集合
    };
  },
  mounted() {
    this.defaultArr = this.defaultArrF;

    if(this.defaultArrF.length>0){
      this.defaultArrF.forEach(item => {
        // 获取组织人员
        let data = {
          organizationId: item
        };
        listOrganizationStaff(data)
          .then(res => {
            if (res.status == 200) {
              this.checkList = this.checkList.concat(res.data.staff);
            }
          })
          .catch(error => {
            console.log("获取组织人员", error);
          });
      });
    }

    this.userListIds = this.userListF.map(item => {
      return item.id
    })
    listOrganization().then(res => {
      this.treeData = res.data;
    });
  },

  methods: {
    //获取选中的组织机构
    nodeData(data, isTrue) {
      this.defaultArr =  this.$refs['tree'].getCheckedNodes().map(item=>{
        return item.id
      });
      
      if (isTrue) {
        this.objArr.push(data);
      } else {
        this.objArr = this.objArr.filter(item => {
          return item.id != data.id;
        });
      }
    },

    // 节点过滤
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    handleok() {
      if(this.isType){
        if (this.userListIds.length == 0) {
          this.$message.warning("您没有选择借调工人");
        } else {
          this.userList = [];
          this.userListIds.forEach(item=>{
            this.checkList.forEach(attr=>{
              if(item==attr.id){
                this.userList.push(attr)
              }
            })
          })
          this.$emit("close_org", this.userList , this.defaultArr);
        }
      }else{
        if(!this.userListId){
          this.$message.warning("您没有选择借调工人");
        }else{
          this.$emit('singleFn',this.userListId,this.checkList)
        }
      }
    },
    handleClose() {
      this.$emit("close_org");
    }
  },
  watch: {
    objArr: function() {
      let ids = this.objArr.map(item => {
        return item.id;
      });
      this.userListIds = [];
      this.checkList = [];
      ids.forEach(item => {
        // 获取组织人员
        let data = {
          organizationId: item
        };
        listOrganizationStaff(data)
          .then(res => {
            if (res.status == 200) {
              this.checkList = this.checkList.concat(res.data.staff);
            }
          })
          .catch(error => {
            console.log("获取组织人员", error);
          });
      });
    },
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>
<style scoped lang='scss'>
.organizationdia {
  .dialog-footer {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
  .content_box {
    display: flex;
    max-height: 500px;
    overflow-y: auto;
    flex-wrap: nowrap;
    justify-content: space-between;
    .userList {
      min-width: 180px;
      .userItem {
        display: block;
        margin-bottom: 6px;
      }
    }
  }
}
</style>

