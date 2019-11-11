<template>
<el-row>
  <el-col :span="24">
    <el-button type="primary" v-if="groupManager_menu" @click="update">保存</el-button>
  </el-col>
  <el-col :span="24" class="m-top20">
    <el-radio v-model="radios" :label="0">本人</el-radio>
    <el-radio v-model="radios" :label="1">本组织</el-radio>
    <el-radio v-model="radios" :label="2">组织</el-radio>
    <div v-if="radios==2">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" class="m-top20"></el-input>
      <el-tree class="filter-tree" :data="treeData" show-checkbox node-key="id" highlight-current :props="defaultProps" :filter-node-method="filterNode" ref="menuTree" @node-click="getNodeData" default-expand-all>
      </el-tree>
    </div>
  </el-col>
</el-row>

</template>
<script>
// import {
//   fetchTree,
// } from 'api/admin/menu/index';
import {
  page,
} from 'api/admin/element/index';
import {
  getUserGroup,
  editRoleGroup,
  fetchTree
} from 'api/admin/group/index';
import {
  getRoleGroup
} from 'api/admin/groupType/index';

import {
  removeElementAuthority,
  addElementAuthority,
  getElementAuthority,
  modifyMenuAuthority,
  getMenuAuthority
} from 'api/admin/group/index';
import { mapGetters } from 'vuex';
export default {
  name: 'menu',
  props: {
    groupId: {
      default: '1'
    }
  },
  data() {
    return {
      filterText: '',
      list: null,
      total: null,
      listQuery: {
        name: undefined
      },
      treeData: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      groupManager_menu: false,
      groupManager_element: false,
      radios:0,
      //   currentId: -1
    }
  },
  watch: {
    filterText(val) {
      this.$refs.menuTree.filter(val);
    },
    radios(val){
      console.log(val)
      if(val==2){
        this.watchTree();
      }
    }
  },
  created() {
    this.groupManager_menu = this.elements['groupManager:menu'];
    this.groupManager_element = this.elements['groupManager:element'];
    this.initAuthoritys();
  },
  computed: {
    ...mapGetters([
      'elements'
    ])
  },
  methods: {
    getList() {
      fetchTree({
        groupType:4
      }).then(data => {
        this.treeData = data;
        this.initAuthoritys();
      });
    },
    watchTree(){
      fetchTree({
        groupType:4
      }).then(data => {
        this.treeData = data;
        this.initAuthoritys2();
      });
      
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    getNodeData(data) {
      
    },
    update() {
      if(this.radios==2){
        let nodes = this.$refs.menuTree.getCheckedKeys();
        console.log(nodes)
        editRoleGroup({
          groupType:this.radios,
          groupId:nodes,
          userId:[this.groupId],
          editType:0,
        }).then(res=>{
          if(res.status==500){
            this.$message({
              message: '保存失败',
              type: 'error'
            });
          }else if(res.status==200){
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }
          this.$emit("closeAuthorityDialog")
        })
      }else{
        editRoleGroup({
          groupType:this.radios,
          userId:[this.groupId],
        }).then(res=>{
          if(res.status==500){
            this.$message({
              message: '保存失败',
              type: 'error'
            });
          }else if(res.status==200){
            this.$message({
              message: '保存成功',
              type: 'success'
            });
          }
          this.$emit("closeAuthorityDialog")
        })
      }
     
    },
    checked(id,data,newArr){
      data.map((item,idx)=>{
        if(item.id==id){
          if(item.children==null || item.children.length == 0 ){
            newArr.push(item.id)
          }
        }else{
          if(item.children!=null&&item.children.length !=0 ){
              this.checked(id,item.children,newArr)
          }
        }
      })
    },
    initAuthoritys() {
      getRoleGroup({
        ruleId:this.groupId
      }).then(res=>{
        this.radios=res.data.ruleType;
        let newArr=[];
        res.data.list.map((item,idx)=>{
          this.checked(item,this.treeData,newArr)
        })
        this.$refs.menuTree.setCheckedKeys(newArr);
      })
    },
    initAuthoritys2() {
      getRoleGroup({
        ruleId:this.groupId
      }).then(res=>{
        let newArr=[];
        res.data.list.map((item,idx)=>{
          this.checked(item,this.treeData,newArr)
        })
        this.$refs.menuTree.setCheckedKeys(newArr);
      })
    }
  }
}
</script>
