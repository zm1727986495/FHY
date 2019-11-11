<template>
    <div class="applypage">
      <!-- 导航栏 -->
      <div class="head_nav">
        <breadcrumb :navList="navList"></breadcrumb>
      </div>


      <el-card>

        <div class="iconBox">
          <i class="Icon"></i>
          <span>申请信息</span>
        </div>

        <div class="ordertitle">
          <!-- 订单详情 -->
          <orderdetail></orderdetail>
          <!-- 合同详情 -->
          <contractdetails></contractdetails>


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

            <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="150px" class="formclass">
              <div class="infoform">
                <div class="infoform_item">
                  <el-form-item label="电话" prop="name">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
                <div class="infoform_item">
                  <el-form-item label="外部推荐人" prop="name">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="infoform">
                <div class="infoform_item">
                  <el-form-item label="职位" prop="name">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
                <div class="infoform_item">
                  <el-form-item label="所属公司" prop="name">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="infoform">
                <div class="infoform_item">
                  <el-form-item label="级别" prop="name">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
                <div class="infoform_item">
                  <el-form-item label="银行卡号" prop="name">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="infoform">
                <div class="infoform_item">
                  <el-form-item label="外购台面" prop="name">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
                <div class="infoform_item">
                  <el-form-item label="外购提成" prop="name">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="infoform">
                <div class="infoform_item">
                  <el-form-item label="欧派金额" prop="name">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
                <div class="infoform_item">
                  <el-form-item label="欧派提成" prop="name">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
              </div>

              <div class="infoform">
                <div class="infoform_item">
                  <el-form-item label="返点金额" prop="name">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
                <div class="infoform_item">
                  <el-form-item label="带单数" prop="name">
                    <el-input v-model="ruleForm.name" style="width:50%"></el-input>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
        </div>
        <!-- table表格 -->
        <div class="table_list lvs attribute m-top20">

          <el-table
            border
            :row-class-name="tableRowClassName"
            :row-style="tableBodycolor"
            :data="tabList"
            style="width: 100%;">
            <el-table-column
              prop="name"
              label="序号"
              width="80" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="房间号"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="产品款型"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="名称款型"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="型号"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="数量"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="单价"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="非标系数"
              width="240" sortable align="center">
            </el-table-column>

            <el-table-column
              prop="name"
              label="计价方式"
              width="240" sortable align="center">
            </el-table-column>
            
          </el-table>    

        </div>


        <div class="bottom_btnlist">
            <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
            <el-button @click="submitForm('ruleForm')">取 消</el-button>
        </div>
      </el-card>  


    </div>
  
</template>
<script>

import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";


import orderdetail from "@/views/order/components/orderdetail";
import contractdetails from "@/views/order/components/contractdetails";

import spot from '@/assets/images/spot.png';
export default {
    components: {
      breadcrumb,
      pagination,
      orderdetail,
      contractdetails

  },
  // name: 'brandmanagement',
  data() {
    return {
      navList: [],//头部面包屑
      currentPage:1,
      pageSize:10,
      total:100,
      tabList:[],

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
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          alert('submit!');
        } else {
          console.log('error submit!!');
          return false;
        }
      });
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

}


</style>

