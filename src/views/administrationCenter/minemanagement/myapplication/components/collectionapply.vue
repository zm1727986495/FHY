<!-- 家装代收合同申请 -->
<template>
  <div class="collectionapply">
    <div class="clo_content">
      <el-form
        :model="decoration"
        :rules="rules"
        ref="decoration"
        label-width="120px"
        class="demo-decoration" label-position="right">
  
            <el-form-item label="收款类型" prop="type">
              <el-select v-model="decoration.type" placeholder="">
                <el-option
                  v-for="item in typeList" :key="item.value"
                  :label="item.dictName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          
            <el-form-item label="家装公司" prop="company">
              <el-select v-model="decoration.company" placeholder="">
                <el-option
                  v-for="item in companyList" :key="item.value"
                  :label="item.dictName" :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>      
         
            <el-form-item label="合同金额" prop="money">
              <el-input v-model="decoration.money"></el-input>
            </el-form-item>
        
            <el-form-item label="客户编号" prop="num">
              <el-input v-model="decoration.num"></el-input>
            </el-form-item>
     
            <el-form-item label="家装合同号"  prop="contract">
              <el-input v-model="decoration.contract"></el-input>
            </el-form-item>
       
            <el-form-item label="备注"  prop="remarks">
                <el-input type="textarea" v-model="decoration.remarks"></el-input>
            </el-form-item>
      </el-form>
    </div>

    <div class="app_text">
        <div>
            <span>上传附件：</span>
            <el-upload
                class="avatar-uploader"
                :data="uptoken"
                list-type="picture-card"
                :action="action"
                :accept="accept"
                :on-remove="handleRemove"
                :on-error="handError"
                :file-list="fileList"
                :on-success="handleAvatarSuccess"
                :before-upload="beforeAvatarUpload">
                <i class="el-icon-plus"></i>
            </el-upload>
        </div>
    </div>
    
    <!-- 审批意见组件 -->
    <auditopinion v-if="isAudit"></auditopinion>


    <div class="btn_btn">
      <el-button type="primary" size="medium" @click="submitForm('decoration')">申 请</el-button>
      <el-button size="medium">取 消</el-button>
    </div>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import auditopinion from "../../components/auditopinion";

export default {
  components: {
    breadcrumb,
    pagination,
    auditopinion,
  },
  // name: 'brandmanagement',
  data() {
    return {
        isAudit: false,
        // 上传
		fileList:[], 
		imgShow: "http://file.xczhihui.com/", //文件上传域名
		action: "http://up-z2.qiniup.com",
		accept: "image/jpeg,image/jpg,image/gif,image/png,image/bmp",
		uptoken: {
			//上传参数
			token: "",
			key: ""
		},
        
        decoration: {	
			type: '',
            company: '',
            money: '',
            num: '',
            contract: '',
            remarks: '',
		},
        // 条件
        typeList: [],
        companyList: [],
        currentPage: 1, //当前页数
        pageSize: 20, //总页数
        total: 100, //总条数
        rules: {
            type: [{ 
                required: true, message: "请选择收款类型", trigger: "change" 
            },],
            company: [{ 
                required: true, message: "请选择家装公司", trigger: "change" 
            }],
            money: [{ 
                required: true, message: '请输入合同金额', trigger: 'blur' 
            },],
        }
    };
  },
	created() {
		if(this.$route.path == "/minemanagement/audit") {
			this.isAudit = true;
		}
	},

  mounted() {},
    methods: {
        submitForm(formName) {
        //   this.$refs[formName].validate(valid => {
        //     if (valid) {
        //       alert("submit!");
        //     } else {
        //       console.log("error submit!!");
        //       return false;
        //     }
        //   });
        },
        //文件上传前操作
		beforeAvatarUpload(file) {
			//console.log(this.imgShow+file.lastModified+".jpg");
			this.uptoken.key = `${file.lastModified}.jpg`;
		},
		//文件成功操作  //addAccessory编辑的新增接口
		handleAvatarSuccess(res, file, fileList) {
			if (this.referrerId) {
			let data = {
				dataSourceEnum: "IdCopiesImg",
				dataSourceId: this.referrerId,
				fileUrl: this.imgShow + res.key
			};
			addAccessory(data).then(res => {
				console.log(res);
				if (res.status == "200") {
				this.$message.success("图片上传成功");
				} else {
				this.$message.error("图片上传失败");
				}
			});
			} else {
			this.fileList = fileList;
			}
		},
			//文件上传失败
		handError(err) {
			this.$message.error("文件上传失败，可尝试退出登录重新操作");
		},
		//文件删除操作
		handleRemove(file, fileList) {
			if (this.referrerId) {
			let data = {
				accessoryId: file.accessoryId,
				dataSourceId: file.dataSourceId,
				dataSourceEnum: file.dataSourceEnum
			};
			removeAccessoryImg(data).then(res => {
				if (res.status == "200") {
				this.$message.success("删除图片成功");
				} else {
				this.$message.error("删除图片失败");
				}
			});
			} else {
			this.fileList = fileList;
			}
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
    
  }
  .app_text {
        width: 80%;
        display: flex;
        margin: 0 auto;
        >div{
            display: flex;
            flex-wrap: nowrap;
            align-items: center;
            justify-content: flex-start;
            >span {
                font-size: 14px;
                color: #606266;
                line-height: 40px;
                font-weight: 700;
                text-align: right;
                min-width: 120px;
                box-sizing: border-box;
                padding-right: 12px;
            }
        }
    
  }
  .btn_btn {
    width: 200px;
    margin: 10px auto;
  }
}
</style>

