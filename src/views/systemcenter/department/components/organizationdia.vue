<template>
  <!-- 组织机构弹出框 -->
  <div class="organizationdia">
    <el-dialog
      title="组织机构"
      :visible="visible"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="medium"></el-input>
      <div class="treeBox m-top10">
        <el-tree
          v-loading="loading"
          :data="treeData"
          node-key="id"
          :default-expanded-keys="innerOpenArr"
          :current-node-key="choseVal"
          :props="defaultProps"
          highlight-current
          @node-click="nodeData"
          :filter-node-method="filterNode"
          ref="tree"
        ></el-tree>
      </div>
      <div class="dialog-footer" slot="footer">
        <el-button type="primary" @click="handleok">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { listOrganization } from "api/pulicJava";
import { log } from "util";
import { setTimeout } from "timers";
import {
    listOrganizationByPresent, // 备货查询组织结构接口
} from 'api/administrationCenter/stockmanagement/index'; // 备货采购订单的组织机构

export default {
  /**
   * visible         是否显示
   * defaultOpenArr  默认展开的数组   在二次点开时候  或者回显页面时
   */
  props: ["visible", "defaultOpenArr"], //defaultOpenArr  默认展开数组  visible  是否显示
  data() {
    return {
      defaultProps: {
        children: "children",
        label: "label"
      },
      treeData: [], //接口查出的tree数据
      obj: {}, //点中的对象
      choseVal: "", //回显时  高亮选中的对象
      loading: true, //loading加载
      innerOpenArr: [], //通过递归获取到选中展开的组织机构的数组
      allTreeObj: [], //通过递归获取到选中的组织机构所有对象
      filterText: ''
    };
  },
  mounted() {
    //调取组织机构树
    new Promise((resolve, reject) => {
      if(this.$route.path == "/stockmanagement/addpurchase") {
        listOrganizationByPresent().then(res => {
          this.treeData = res.data;
          this.loading = false;
          this.recursionObj(this.treeData);
        });
      }else {
        listOrganization().then(res => {
          this.treeData = res.data;
          this.loading = false;
          this.recursionObj(this.treeData);
        });
      }
    }).then(
      //选中传入的最后一个对象
      (this.obj = this.allTreeObj.filter(item => {
        return (item.id = this.choseVal);
      })[0])
    );
    //回显组织机构  高亮选中的对象
    this.choseVal = this.defaultOpenArr[this.defaultOpenArr.length - 1];

    //不能直接修改父组件传递过来的值  所以接受父组件的默认展开数组后重新赋值，页面回显
    this.innerOpenArr = this.defaultOpenArr;
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    //节点点击事件
    nodeData(nodeObj, node) {
      this.obj = nodeObj; //将点击的节点赋值给一个对象  把对象传递出去
      this.innerOpenArr = []; //将默认展开的数组清空
      this.recursion(node); //并且递归做成新的数组
    },

    //递归取选中的数组    这个数组就是默认展开的数组
    recursion(val) {
      if (val.parent instanceof Object) {
        this.innerOpenArr.push(val.data.id);
        this.recursion(val.parent);
      }
    },

    //递归将组织机构树返回的数据做成对象数组   allTreeObj
    recursionObj(treeArr) {
      if (treeArr != null) {
        treeArr.forEach(item => {
          this.allTreeObj.push(item);
          this.recursionObj(item.children);
        });
      }
    },

    //确认按钮  传出对象  传出默认选中的数组
    handleok() {
      this.innerOpenArr = this.innerOpenArr.sort(function(a, b) {
        return a - b;
      }); //将取出的数组进行倒叙排序
      this.$emit("close_org", this.obj, this.innerOpenArr); //obj为传出的对象     innerOpenArr为
    },

    //关闭组织机构
    handleClose() {
      this.$emit("close_org");
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  }
};
</script>
<style scoped>
  .treeBox{
    max-height: 350px;
    overflow-y: auto;
  }
</style>

