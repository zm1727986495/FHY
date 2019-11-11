<template>
<!-- 审核记录弹出框 -->
  <div class="examine_dia">
        <el-dialog
          title=""
          :visible.sync="visible"
          width="50%"
          :before-close="handleClose">
          <div class="titlecals">审核记录</div>

          <div class="table_list lvs attribute m-top20">
            <el-table
                border
                :row-style="tableBodycolor"
                :row-class-name="tableRowClassName"
                @selection-change="handleSelectionChange"
                :data="tabList"
                style="width: 100%;">
                <el-table-column type="selection" width="40"></el-table-column>
                <el-table-column prop="name1" align="center" label="操作人" sortable></el-table-column>
                <el-table-column prop="name2" align="center" label="操作" sortable></el-table-column>
                <el-table-column prop="name3" align="center" label="操作时间" sortable ></el-table-column>
                <el-table-column prop="name5" align="center" label="操作结果" sortable></el-table-column>
                <el-table-column prop="name6" align="center" label="备注" sortable></el-table-column>
            </el-table>
          </div>

          <!-- 分页 -->
          <div class="pagination_wrap">
              <pagination
                  :current-page="currentPage"
                  :pageSize="pageSize"
                  :total="total"
                  @sizeChange="sizeChange"
                  @currentChange="currentChange">
              </pagination>
          </div>

              
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="handleClose">取 消</el-button>
            <el-button type="primary" @click="selectok">确 定</el-button>
          </span>

        </el-dialog>
    </div>
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";


import {
  getNames,
} from 'src/utils/pubilcFn.js';
export default {
  props:["visible"],
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
        tabList:[],
        elsectVal:[],
        // 分页
        currentPage: 1,//当前页数
        pageSize: 20,//总页数
        total: 100,//总条数
    };
  },
  
  methods: {
      //关闭回调函数
      handleClose(){
        this.$emit("close_examin")
      },


      //确认按钮
      selectok(){
        this.$emit("examin_ok")
      },

      //表格斑马线设置
      tableRowClassName({row, rowIndex}) {
          return rowIndex%2 != 0 ? 'el-f0' : '';
      },

      // 改变tablebody颜色
      tableBodycolor({ row, rowIndex }) {
        return "height: 80px";
      },

      //勾选函数回调
      handleSelectionChange(val) {
        this.elsectVal = val;
      },

      // 单页条数改变方法
      sizeChange(val) {
          this.currentPage = 1;
          this.pageSize = val;
        //   this.getListData();
      },

      // 翻页方法
      currentChange(val) {
          this.currentPage = val;
        //   this.getListData();
      },

      
  }
};
</script>
<style scoped lang='scss'>



</style>

