<template>
    <div class="customerSharing">
        <div class="customerSharing_c">
            <div class="crumbs">
                <span>当前位置：</span>
                <el-breadcrumb separator-class="el-icon-arrow-right">
                    <el-breadcrumb-item>销售中心</el-breadcrumb-item>
                    <el-breadcrumb-item>客户管理</el-breadcrumb-item>
                    <el-breadcrumb-item>客户编辑</el-breadcrumb-item>
                </el-breadcrumb>
            </div>
            <div class="import_form">
                <el-form  :model="form" class="demo-form-inline">
                    <div class="import_e">
                        <span>选择要导入的Excel：</span>
                        <div class="content">{{file}}</div>
                        <div class="fileBox">
                            上传附件
                            <input type='file' value=""  @change="addFile" ref="inputer">
                        </div>
                        <el-button type="primary">下载Excel模板</el-button>
                    </div>
                    <el-form-item label="客户来源" prop="source" :rules=" { required: true, message: '必选', trigger: 'blur' }">
                        <el-select  v-model="form.option" placeholder="请选择...">
                            <el-option label="自然渠道" value="z"></el-option>
                            <el-option label="内部推荐人" value="n"></el-option>
                            <el-option label="外部推荐人" value="w"></el-option>
                            <el-option label="客户活动" value="k"></el-option>
                            <el-option label="公众号" value="g"></el-option>
                        </el-select>
                    </el-form-item> 
                     <el-form-item label="分配门店：">
                        <el-input v-model="form.store"></el-input>
                    </el-form-item>
                    <el-form-item label="分配导购" prop="guide">
                        <el-select  v-model="form.guideOption" placeholder="请选择...">
                            <el-option label="导购一" value="z"></el-option>
                            <el-option label="导购一" value="n"></el-option>
                            <el-option label="导购一" value="w"></el-option>
                            <el-option label="导购一" value="k"></el-option>
                            <el-option label="导购一" value="g"></el-option>
                        </el-select>
                    </el-form-item> 
                </el-form>
                <div class="upload">
                    <el-button type="primary" @click="handleUpload">上传</el-button>
                    <span v-show="flag">上传有误</span>
                </div>
            </div>
            <div class="errorList">
                <el-table :data="tableData"  style="width: 100%"  height="250" border>
                    <el-table-column   prop="result"   label="验证结果"   ></el-table-column>
                    <el-table-column   prop="reason"  label="失败原因"     ></el-table-column>
                    <el-table-column   prop="id"         label="客户ID"     ></el-table-column>
                    <el-table-column   prop="name"       label="客户名称"   ></el-table-column>
                    <el-table-column   prop="sex"        label="性别"   ></el-table-column>
                    <el-table-column   prop="age"       label="年龄段"   ></el-table-column>
                    <el-table-column   prop="tel"    label="客户电话"   ></el-table-column>
                    <el-table-column   prop="address"       label="客户地址"   ></el-table-column>
                </el-table>
            </div>
            <div class="export_btn">
                <el-button type="primary" v-for="(item,index) in export_btn" :key="index" @click="handleExport(index)">{{item}}</el-button>
            </div>
        </div>      
    </div>
</template>
<script>
export default{
    data(){
        return{
            form:{
                    source:"",
                    option:'',
                    store:'',
                    guide:'',
                    guideOption:''
            },
                
            file:"",
            flag:false,
            tableData:[
                {"result":"","reason":"","id":"","name":"","sex":"","age":"","tel":"","address":""},
                {"result":"","reason":"","id":"","name":"","sex":"","age":"","tel":"","address":""},
                {"result":"","reason":"","id":"","name":"","sex":"","age":"","tel":"","address":""},
                {"result":"","reason":"","id":"","name":"","sex":"","age":"","tel":"","address":""},

            ],
            export_btn:["导出错误信息","只保存成功","保存所有","取消"]
        }
    },
    methods:{
        // 上传文件
        addFile(event){
            // event.target.files[0]
            console.log(event.target.files[0].name)
            this.file = event.target.files[0].name;
        },
        handleUpload(){
            alert()
        },
        handleExport(index){
             switch(index){
                case 0:
                    console.log(index)
                    break;
                case 1:
                    console.log(index)
                    break;
                case 2:
                    this.$router.push( {path: '/customerquery'} )
                                       
                    break;
                case 3:
                    this.$router.push( {path: '/customerquery'} )
                    break;
            }
        }
       
    }
}

</script>
<style scoped>
.customerSharing{
    height:100%;
    background:#fff;
    overflow: hidden;
}
.customerSharing_c{
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

.import_e{
    overflow:hidden;
}
.import_e>span{
    float:left;
}
.import_e>button{
    float:left;
}
.content{
    width:200px;
    height:30px;
    border:1px solid #ddd;
    float:left;
}
 .fileBox {
    display: inline-block;
    width: 60px;
    height: 25px;
    background: #fff;
    border: 1px solid #ddd;
    border-radius: 5px;
    position: relative;
    overflow: hidden;
    cursor: pointer;
    text-align: center;
    line-height: 25px;
    text-decoration: none;
    color: #969696;
    font-size: 14px;
    margin:10px;
    font-size:12px;
    float:left;
}


.fileBox input {
    position: absolute;
    left: 0;
    top: 0;
    opacity: 0;
    font-size: 100px;
    filter: alpha(opacity=0);
}

.el-input {
    width:200px;
}

.upload>button{
    width:60px;
    height:30px;
    border:none;
    border-radius:5px;
    font-size:14px;
    line-height:30px;
}
.upload>span{
    color:red;
}
.export_btn{
    margin-top:40px;
}
.export_btn>button{
    padding:5px 8px;
    border:none;
    border-radius:5px;
    background:skyblue;
    color:#fff;
    margin-right:20px;
}
</style>

