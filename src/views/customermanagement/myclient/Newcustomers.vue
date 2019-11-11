<template>
    <div class="newcustomers">
        <div class="newcustomers_c">    
            <div class="crumbs">
                <span>当前位置：</span>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>销售中心</el-breadcrumb-item>
                    <el-breadcrumb-item>客户管理</el-breadcrumb-item>
                    <el-breadcrumb-item>客户新增</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="newContent">
                <h3>客户新增</h3>
                <div class="newContent_form">
                    <el-form :model="ruleForm"  ref="ruleForm" label-width="80px" class="demo-ruleForm">
                        <el-form-item label="客户姓名" prop="name" :rules=" { required: true, message: '姓名', trigger: 'blur' }" >
                            <el-input v-model="ruleForm.name"></el-input>
                        </el-form-item>
                        <el-form-item label="客户电话" prop="tel" :rules=" { required: true, message: '电话', trigger: 'blur' }" >
                            <el-input v-model="ruleForm.tel"></el-input>
                            <span>发送验证码</span>
                        </el-form-item>
                        <el-form-item label="验证码" prop="verify" >
                            <el-input v-model="ruleForm.verify"></el-input>
                        </el-form-item>
                        <el-form-item label="备用电话" prop="tel1" >
                            <el-input v-model="ruleForm.tel1"></el-input>
                        </el-form-item>
                        <el-form-item label="年龄段" prop="Agegroup">
                            <el-select v-model="ruleForm.region" placeholder="请选择年龄段">
                                <el-option label="20-30" value="20-30"></el-option>
                                <el-option label="30-40" value="30-40"></el-option>
                            </el-select>
                        </el-form-item> 
                        <el-form-item label="性别" prop="sex">
                            <el-radio-group v-model="ruleForm.sex">
                                <el-radio label="男"></el-radio>
                                <el-radio label="女"></el-radio>
                            </el-radio-group>
                        </el-form-item>   
                    </el-form>
                </div>
                <div class="address">
                    <div class="address_t"> 
                        <span>客户地址</span>
                        <div>
                            <button>新增</button>
                            <button>删除</button>
                        </div>
                    </div>
                    <div class="address_tab">
                        <el-table   border  ref="multipleTable"   :data="tableData" tooltip-effect="dark"  
                                style="width: 100%"  @selection-change="handleSelectionChange"
                                :cell-style="cellStyle"  :header-cell-style="rowClass" 
                                >
                            <el-table-column type="selection" ></el-table-column>
                            <el-table-column label="操作" >
                                <template slot-scope="scope">
                                    <span>编辑</span>
                                    <span>删除</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="address" label="地址" ></el-table-column>
                            
                        </el-table>
                        <el-form :model="ruleForm1"  ref="ruleForm1" label-width="80px" class="demo-ruleForm">
                            <el-form-item label="客户来源" prop="source" :rules=" { required: true, message: '必选', trigger: 'blur' }">
                                <el-select  v-model="ruleForm1.option" placeholder="请选择...">
                                    <el-option label="自然渠道" value="z"></el-option>
                                    <el-option label="内部推荐人" value="n"></el-option>
                                    <el-option label="外部推荐人" value="w"></el-option>
                                    <el-option label="客户活动" value="k"></el-option>
                                    <el-option label="公众号" value="g"></el-option>
                                </el-select>
                            </el-form-item> 
                            <el-form-item label="备注：" class="remarks">
                                <el-input type="textarea" v-model="ruleForm1.desc"></el-input>
                            </el-form-item>
                        </el-form>

                    </div>
                </div>
                <div class="foot_btn">
                    <button @click="handleAddCustomer">新增</button>
                    <button @click="handleCancel">取消</button>
                </div>
            </div>
            

        </div>
    </div>
</template>
<script>
export default {
    data() {
        return {
            ruleForm: {
                name: '',
                Agegroup: '',
                region: '',
                sex: '',
                tel:'',
                tel1:'',
                verify:''
              
            },
            ruleForm1: {
                source:"",
                desc:'',
                option:''
            },
            region: [
                { required: true, message: '请选择年龄段', trigger: 'change' }
            ],
            tableData:[
                {'address':'北京市海淀区知春路小区8号楼3单元1009'}
            ]
        }
    },
    methods:{
        handleSelectionChange(val) {
            this.multipleSelection = val;
        },
        cellStyle({row,column,rowIndex,columnIndex}){
            return "text-align:center";
        },
        rowClass({row,rowIndex}){
            return "text-align:center";
        },
        handleCancel(){
            this.$router.go(-1);
        },
        // 新增按钮
        handleAddCustomer(){
            this.$router.push({path:'/customerquery'});                
        },
       
    }
}
</script>

<style scoped>

.newcustomers{
    height:100%;
    background:#fff;
    overflow: hidden;
}
.newcustomers_c{
    margin:30px 60px 0;
}
.crumbs {
  overflow: hidden;
}
.crumbs > span {
  color: #ddd;
  font-size: 15px;
  float: left;
}
.newContent{
    margin:20px;
    border:1px solid #333;
}
.newContent>h3{
    width: 229px;
    height: 30px;
    border-bottom: 1px solid #000;
    line-height: 30px;
    color: #222;
    margin-bottom: 20px;
    margin-top: 10px;
}
.el-form-item{
    width:260px;
}
.newContent_form{
    border-bottom:1px solid #ddd;
}
.address{

}
.address_t{
    overflow:hidden;
}
.address_t>span{
    float:left;
}
.address_t>div{
    float:right;
}
.address_tab{
    border-bottom:1px solid #ddd;
}
.remarks{
    width:80%;
    height:60px;
}
.el-textarea{
    margin-right:30px;
    
}
.foot_btn{
    margin:20px 0 0 20px;
    text-align:center;

}
</style>