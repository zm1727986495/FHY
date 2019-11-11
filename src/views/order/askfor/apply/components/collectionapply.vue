<template>
  <div class="collectionapply">
    <div class="clo_content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="content_row">
          <div>
            <el-form-item label="收款类型" prop="type1">
              <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="收款方式" prop="type2">
              <el-select v-model="ruleForm.region" placeholder="请选择活动区域">
                <el-option label="区域一" value="shanghai"></el-option>
                <el-option label="区域二" value="beijing"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>

        <div class="content_row">
          <div>
            <el-form-item label="合同金额" prop="name">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="客户编号">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="content_row">
          <div>
            <el-form-item label="家装合同号">
              <el-input v-model="ruleForm.name"></el-input>
            </el-form-item>
          </div>
          <div>
            <el-form-item label="上传附件">
              <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    multiple
                    :limit="3"
                    :file-list="fileList"
                >
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
          </div>
        </div>

        <el-form-item label="备注">
          <el-input type="textarea" v-model="ruleForm.textarea"></el-input>
        </el-form-item>
      </el-form>
    </div>

    <div class="app_text">
      <span>上传附件：</span>
      <el-upload
        class="upload-demo"
        action="https://jsonplaceholder.typicode.com/posts/"
        multiple
        :limit="3"
        :file-list="fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
      </el-upload>
    </div>

    <div class="btn_btn">
      <el-button
        type="primary"
        size="medium"
        class="reset_btn m-left20"
        @click="submitForm('ruleForm')"
      >申 请</el-button>
      <el-button type="info" size="medium" class="reset_btn m-left20">取 消</el-button>
    </div>
  </div>
</template>
<script>
import pagination from "../../../../components/pagination";
import breadcrumb from "../../../../components/breadcrumb";
export default {
  components: {
    breadcrumb,
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      currentPage: 1, //当前页数
      pageSize: 20, //总页数
      total: 100, //总条数
      num: "",
      fileList:[],
      textarea: "",
      ruleForm: {},
      rules: {
        type1: [
          { required: true, message: "请选择收款类型", trigger: "change" }
        ],
        type2: [
          { required: true, message: "请选择收款方式", trigger: "change" }
        ],
        name: [
            { required: true, message: '请输入合同金额', trigger: 'blur' },
        ],
      }
    };
  },

  mounted() {},
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    //翻页方法
    sizeChange(val) {
      this.currentPage = 1;
      this.pageSize = val;
    },

    //翻页方法
    currentChange(val) {
      this.currentPage = val;
    },

    // 改变tablebody颜色
    tableBodycolor({ row, rowIndex }) {
      return "height: 80px";
    },

    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    }
  }
};
</script>
<style scoped lang='scss'>
.collectionapply {
  .clo_content {
    width: 80%;
    margin: 0 auto;
    .content_row {
      display: flex;
      flex-wrap: nowrap;
      > div {
        width: 50%;
      }
    }
  }
  .app_text {
    margin-top: 10px;
    display: flex;
    flex-wrap: nowrap;
    span {
      text-align: right;
      min-width: 80px;
      margin-left: 10px;
    }
  }
  .btn_btn {
    width: 200px;
    margin: 10px auto;
  }
}
</style>

