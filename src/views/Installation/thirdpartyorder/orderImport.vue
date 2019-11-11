<template>
  <div>
    <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
    </div>
    <el-card>
      <div class="warp_head_list">
        <div class="list_top">
          <el-input placeholder="客户合同号/客户姓名/客户电话" v-model="befoIf.orderGroup" size="medium" maxlength="50"></el-input>
          <el-select v-model="befoIf.brandId" placeholder="请选择品牌" size="medium">
              <el-option
                v-for="item in brandList" 
                :key="item.brandId"
                :label="item.brandName" 
                :value="item.brandId">
              </el-option>
          </el-select>
          <el-select v-model="befoIf.commodityCategoryId" placeholder="请选择品类" size="medium">
              <el-option
                  v-for="item in categoryList" 
                  :key="item.commodityCategoryId"
                  :label="item.categoryName" 
                  :value="item.commodityCategoryId">
              </el-option>
          </el-select>
        </div>
          <div class="head_nav_btn">
              <el-button @click="search" type="warning" class="button-fc" size="medium">查询</el-button>
              <el-button @click="resetFun" type='primary' size="medium">重置</el-button>
          </div>
      </div>
      <div class="h-width"></div>
      <div class="m-bottom10">
        <el-upload
          multiple
          class="upload-demo"
          action="/api/pc/thirdParty/addBatchImport"
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          :http-request="uploadSectionFile1"
          :before-upload='beforeUploadFn'
          :file-list="fileList"
        >
          <!-- accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" -->
          <el-button size="small" class="button-96">重导入</el-button>
        </el-upload>
      </div>
      <div class="table_list lvs attribute" v-loading='loading'>
      <el-table border :row-class-name="tableRowClassName" @selection-change="chooseDelete" :data="tableData">
        <el-table-column fixed="left" type="selection" width="40"></el-table-column>
        <el-table-column align="center" prop="companyName" label="外接品牌公司" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="brandName" label="品牌" width="120"></el-table-column>
        <el-table-column align="center" prop="categoryName" label="品类" width="120" ></el-table-column>
        <el-table-column align="center" prop="paymentMethod" label="结算方式" width="110" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="contractNumber" label="合同号" width="150"></el-table-column>
        <el-table-column align="center" prop="customerName" label="姓名" width="120"></el-table-column>
        <el-table-column align="center" prop="customerPhone" label="电话" width="120"></el-table-column>
        <el-table-column align="center" prop="address" label="地址" width="150" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="designer" label="设计师" width="100"></el-table-column>
        <el-table-column align="center" prop="installationTime" label="合同安装日期" width="160"></el-table-column>
        <el-table-column align="center" prop="number" label="件数" width="120" show-overflow-tooltip></el-table-column>
        <el-table-column align="center" prop="linearMeter" label="延米/投影面积" width="120"></el-table-column>
        <el-table-column align="center" prop="remark" label="备注" width="150" show-overflow-tooltip></el-table-column>
      </el-table>
    </div>
    <div class="pagination_wrap">
      <pagination
        :current-page="currentPage"
        :pageSize="pageSize"
        :total="total"
        @sizeChange="sizeChange"
        @currentChange="currentChange"
      ></pagination>
    </div>
    </el-card>
    <div class="btnStyle">
      <el-button type="primary" @click="submissionFn">提交</el-button>
      <el-button @click="cancel">取消</el-button>
    </div>
  </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from "@/views/components/pagination";
import { listImportOrder,addBatchImport,commitImport } from 'api/Installation/thirdpartyorder/index';
import {listBrand,listCategory} from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";
export default {
  components:{
    breadcrumb,
    pagination
  },
  data(){
    return{
      navList:[],
      tableData:[],//列表
      loading:false,//loading
      currentPage: 1, //当前页数
      pageSize: 10, //当前页最大条数
      total: 0, //总条数
      befoIf:{},//查询条件
      brandList:[],//品牌
      categoryList:[],//品类
      fileObj:{},
      fileList:[]
    }
  },
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
    this.getData();
    this.getBrand();
    this.getCategory();
  },
  methods: {
    //提交
    submissionFn(){
      let data={
        thirdImports:this.tableData
      }
      commitImport(data).then(res=>{
        if(res.status == 200){
          this.$message.success('提交成功!')
          this.$router.go(-1)
        }
      }).catch(error=>{
        console.error('第三方订单导入提交',error);
        
      })
    },
    beforeUploadFn(){
      this.fileList = [];
    },
    uploadSectionFile1(repong){
      this.fileObj=repong
      let formData = new FormData();
      formData.append('file',this.fileObj.file);
      addBatchImport(formData).then(res =>{
          if(res.status == 200){
            this.$message.success("操作成功");
            this.getData()
          }else{
            this.$message.error(res.message)
          }
      }).catch(error =>{
          this.btnLoading = false;
          console.log('第三方订单:导入', error);
      })
    },
    //获取品牌
    getBrand() {
      listBrand()
        .then(res => {
          this.brandList = res.data;
        })
        .catch(error => {
          console.error("获取品牌", error);
        });
    },
    //获取品类
    getCategory() {
      listCategory()
        .then(res => {
          this.categoryList = res.data;
        })
        .catch(error => {
          console.error("获取品类", error);
        });
    },
    //获取列表
    getData(){
      let data={
        ...this.befoIf,
        page: this.currentPage,
        limit: this.pageSize
      }
      listImportOrder(data).then(res=>{
        if(res.status == 200){
          this.tableData = res.data.rows;
          this.total = res.data.total;
        }
      }).catch(error=>{
        console.error('获取导入列表',error);
      })
    },
    //查询
    search(){
      this.getData()
    },
    //重置
    resetFun(){
      this.befoIf = {};
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    //勾选
    chooseDelete(val) {
      this.choseArr = val;
    },
    cancel(){
      this.$router.go(-1)
    },
    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
      this.getData();
    },
    //翻页方法
    currentChange(val) {
      this.currentPage = val;
      this.getData();
    }
  },
}
</script>
<style lang="scss" scoped>
.btnStyle{
  width: 100%;
  display: flex;
  margin-top:10px;
  justify-content: center;
}
.warp_head_list{
        width: 100%;
        display: flex;
        align-items: baseline;
        flex-wrap: wrap;
        .list_top{
            flex: 1;
            display: flex;
            flex-wrap: wrap;
            >div{
                margin: 10px 0px;
                padding: 0px 10px;
                width: 33%;
                >div{
                    width: 100%;
                }
            }
        }
        .head_nav_btn{
            width: 200px;
            text-align: center;
            margin-bottom: 0px;
        }
    }
</style>