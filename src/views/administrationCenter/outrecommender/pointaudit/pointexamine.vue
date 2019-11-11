<template>
    <div class="applypage">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>


      <el-card>

        

        <div class="ordertitle">
          <!-- 订单详情 -->
          <orderdetail></orderdetail>
          <!-- 合同详情 -->
          <contractdetails></contractdetails>
        </div>
        <div class="iconBox m-left20">
          <i class="Icon"></i>
          <span>申请信息</span>
        </div>
       
        <div class="applyinfo">
          <div class="applyinfo_header">
            <div class="header_item">
              <span>申请单号:</span>
              <el-input></el-input>
            </div>
            <div class="header_item">
              <span>申请类型:</span>
              <el-input></el-input>
            </div>
            <div class="header_item">
              <span>审批人:</span>
              <el-input></el-input>
            </div>
          </div>
          <div class="applyinfo_body">

            <el-form label-width="150px" class="formclass">
              <div class="infoform">
                <div class="infoform_item">
                  <el-form-item label="电话">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
                <div class="infoform_item">
                  <el-form-item label="外部推荐人">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="infoform">
                <div class="infoform_item">
                  <el-form-item label="职位">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
                <div class="infoform_item">
                  <el-form-item label="所属公司">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="infoform">
                <div class="infoform_item">
                  <el-form-item label="级别">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
                <div class="infoform_item">
                  <el-form-item label="银行卡号">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="infoform">
                <div class="infoform_item">
                  <el-form-item label="外购台面">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
                <div class="infoform_item">
                  <el-form-item label="外购提成">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="infoform">
                <div class="infoform_item">
                  <el-form-item label="欧派金额">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
                <div class="infoform_item">
                  <el-form-item label="欧派提成">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="infoform">
                <div class="infoform_item">
                  <el-form-item label="返点金额">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
                <div class="infoform_item">
                  <el-form-item label="带单数">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
              </div>
              <div class="infoform">
                <div class="width-100">
                  <el-form-item label="备注">
                    <el-input v-model="ruleForm.name" style="width:85%" type="textarea"></el-input>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
        </div>

        <div class="iconBox m-left20">
          <i class="Icon"></i>
          <span>审核意见</span>
        </div>
        <div class="ideainfo m-top20">
          <el-input type="textarea"></el-input>
        </div>

        <div class="iconBox m-left20 m-top20">
          <i class="Icon"></i>
          <span>附件管理</span>
        </div>

        <div class="upload_file m-top20">
          <el-upload
            class="upload-demo"
            action="https://jsonplaceholder.typicode.com/posts/"
            :on-preview="handlePreview"
            :on-remove="handleRemove"
            :before-remove="beforeRemove"
            multiple
            :limit="3"
            :on-exceed="handleExceed"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </div>

        <div class="iconBox m-left20 m-top20">
          <i class="Icon"></i>
          <span>流程图</span>
        </div>
        <div class="img_img m-top20">
          图片.jpg

        </div>

        <div class="iconBox m-left20 m-top20">
          <i class="Icon"></i>
          <span>审核记录</span>
        </div>


        <div class="table_list lvs attribute m-top20">
          <el-table
              border
              :row-style="tableBodycolor"
              :row-class-name="tableRowClassName"
              :data="tabList"
              style="width: 100%;">
              <el-table-column prop="name1" align="center" label="操作人" sortable></el-table-column>
              <el-table-column prop="name2" align="center" label="操作" sortable></el-table-column>
              <el-table-column prop="name3" align="center" label="操作时间" sortable ></el-table-column>
              <el-table-column prop="name5" align="center" label="操作结果" sortable></el-table-column>
              <el-table-column prop="name6" align="center" label="备注" sortable></el-table-column>
          </el-table>

        </div>
        

        <div class="bottom_btnlist">
            <el-button type="primary" @click="submitForm('ruleForm')">转交下一步</el-button>
            <el-button type="primary" @click="backurl">驳回</el-button>
            <el-button @click="backurl">返回</el-button>
        </div>
      </el-card>  

       <!-- 导出 -->
      <subnext
      :visible = "subnext_vis" 
      @close_subnext = "subnextclose"        
      @subnext_ok = "subnextok"
      ></subnext>


    </div>
  
</template>
<script>

import pagination from '../../../components/pagination';
import breadcrumb from "../../../components/breadcrumb";
import orderdetail from "../../../order/components/orderdetail";
import contractdetails from "../../../order/components/contractdetails";
import subnext from "./subnext";                   //变更记录条件

import spot from '@/assets/images/spot.png';
export default {
    components: {
      breadcrumb,
      pagination,
      orderdetail,
      contractdetails,
      subnext    //下一步

  },
  // name: 'brandmanagement',
  data() {
    return {
      navList: [],//头部面包屑
      currentPage:1,
      pageSize:10,
      total:100,
      tabList:[],
      fileList:[],
      subnext_vis:false,   //下一步弹框

      ruleForm: {
        name: '',
        region: '',
        date1: '',
        date2: '',
        delivery: false,
        type: [],
        resource: '',
        desc: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        region: [
          { required: true, message: '请选择活动区域', trigger: 'change' }
        ],
        date1: [
          { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        ],
        date2: [
          { type: 'date', required: true, message: '请选择时间', trigger: 'change' }
        ],
        type: [
          { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
        ],
        resource: [
          { required: true, message: '请选择活动资源', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写活动形式', trigger: 'blur' }
        ]
      },
      
      
    };
  },
  
  mounted() {
    // 头部面包屑
    this.navList = this.$route.meta;
  },
  methods: {

    backurl(){
      this.$router.go(-1);
    },

    submitForm(formName) {
      this.subnext_vis = true;
    },
    subnextclose(){
      this.subnext_vis = false;
    },   
    subnextok(){
      this.subnext_vis = false;
    },

    //文件upload

    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleExceed(files, fileList) {
      this.$message.warning(`当前限制选择 3 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${ file.name }？`);
    },
    


    //表格斑马线设置
    tableRowClassName({row, rowIndex}) {
        return rowIndex%2 != 0 ? 'el-f0' : '';
    },

    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
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
    },
    
  }
};
</script>
<style scoped lang='scss'>
.applypage{
  .applyinfo{
    .applyinfo_header{
      margin-top: 25px;
      display: flex;
      flex-wrap: nowrap;
      justify-content: space-between;
      .header_item{
        // width: 200px;
        display: flex;
        flex-wrap: nowrap;
        // border: 1px solid red;
        height: 20px;
        justify-content: center;
        align-items: center;
        text-align: right;
        span{
          min-width: 100px;
          justify-content: center;
          align-items: center;
        }
      }
    }
    .applyinfo_body{
      width: 95%;
      margin: 20px auto;
      // border: 1px solid red;

      .infoform{
        display: flex;
        flex-wrap: nowrap;
        justify-content: space-between;
        .infoform_item{
          width: 50%;
          el-input{
            width: 50%;
          }
        }
      
      }
    }

  }
  .bottom_btnlist{
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    // border: 1px solid red;
  }
  .ordertitle{
    margin: 10px 0;
  }
  
  .upload_file{
    padding:20px 20px;
    border: 1px  solid #E4E4E4;
    border-radius: 4px; 
  }
  .img_img{
    line-height: 200px;
    text-align: center;
    height: 200px;
    width: 100%;
    border: 1px solid #E4E4E4;
  }

}


</style>

