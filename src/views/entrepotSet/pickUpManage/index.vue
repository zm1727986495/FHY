<template>
    <div>
        <div class="head_nav">
                    <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div>
                <div class="operation">
                    <el-button size="small" class="button-96" @click="clickOperation(0)">新增提货站</el-button>
                    <el-button size="small" class="button-96" @click="clickOperation(1)">编辑</el-button>
                    <el-button size="small" class="button-96" @click="deleteRows">删除</el-button>
                </div>
                <div class="lvs">
                    <el-table
                        :data="tableData"
                        border
                        style="width: 100%"
                        :row-class-name="tableRowClassName"
                        @selection-change="chooseDelete">
                        <el-table-column
                        align="center"
                        type="selection">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="mangementName"
                        label="仓库名称"
                        :filters=mangementName
                        :filter-method="filterHandler"
                        >
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="status"
                        label="状态"
                        >
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="mangementNum"
                        label="仓库编码">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="affiliates"
                        label="关联机构"
                        width="200px">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="warehouseType"
                        label="仓库类型">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="address"
                        label="仓库地址">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="principal"
                        label="负责人">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="tel"
                        label="手机">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="options"
                        label="备注">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="date"
                        label="创建时间">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="creator"
                        label="创建人">
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </el-card>
        <el-dialog
        :title="title"
        :visible.sync="dialogVisible"
        width="40%"
        :before-close="handleClose">
            <div>
                <div>
                    <el-form :inline="true" :model="formInline" class="demo-form-inline">
                        <el-form-item class="form-ipts" label="仓库编码">
                            <el-input v-model="formInline.user"></el-input>
                        </el-form-item>
                        <el-form-item class="form-ipts" label="关系仓库">
                            <el-select v-model="formInline.region" placeholder="选择" class="form-selects">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="form-ipts" label="仓库名称">
                            <el-input></el-input>
                        </el-form-item>
                        <el-form-item class="form-ipts" label="仓库类型">
                            <el-select v-model="formInline.region" placeholder="选择" class="form-selects">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="form-ipts label-padding" label="负责人">
                            <el-select v-model="formInline.region" placeholder="选择" class="form-selects">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item class="form-ipts" label="联系方式">
                            12345678911
                        </el-form-item>
                        <el-form-item label="仓库地址">
                            <el-select v-model="formInline.region" placeholder="选择" class="form-selects2">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                            <el-select v-model="formInline.region" placeholder="选择" class="form-selects2">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                            <el-select v-model="formInline.region" placeholder="选择" class="form-selects2">
                                <el-option label="区域一" value="shanghai"></el-option>
                                <el-option label="区域二" value="beijing"></el-option>
                            </el-select>
                            <el-input class="addressIpt"></el-input>
                        </el-form-item>
                        <el-form-item label="备注" class="textAreaIpt">
                            <el-input type="textarea" class="textAreaMain"></el-input>
                        </el-form-item>
                        <el-form-item label="状态" class="textAreaIpt"> 
                            <el-radio v-model="formInline.radio" label="1">启用</el-radio>
                            <el-radio v-model="formInline.radio" label="2">禁用</el-radio>
                        </el-form-item>
                        <el-form-item class="btnSubmit">
                            <div class="btns">
                                <el-button type="primary" @click="onSubmit">提交</el-button>
                                <el-button @click="dialogVisible=false">取消</el-button>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { getNames } from '../../../utils/pubilcFn';
import breadcrumb from "../../components/breadcrumb";
export default {
    components:{
        breadcrumb
    },
    // mounted() {
    //     this.navList=this.$route.meta;;
    // },
    // created(){
    //     this.mangementName=getNames('mangementName',this.tableData)
    // },
    activated(){
        this.navList=this.$route.meta;;
        this.mangementName=getNames('mangementName',this.tableData)
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    data(){
        return {
            title:"",
            dialogVisible: false,
            mangementName:[],
            navList:[],
            formInline: {
                user: '',
                region: '',
                radio:""
            },
            tableData: [{
                id:1,
                mangementName:"北京大兴仓库",
                status:"启用",
                mangementNum:'ck00001',
                affiliates:'北京大区，十里河店',
                warehouseType:'商品库',
                address:'北京顺义',
                principal:'小李',
                tel:'135885225555',
                options:"只存欧派",
                date:'2019-01-01',
                creator:'张三'
            },{
                id:2,
                mangementName:"北京大兴仓库",
                status:"启用",
                mangementNum:'ck00001',
                affiliates:'北京大区，十里河店',
                warehouseType:'商品库',
                address:'北京顺义',
                principal:'小李',
                tel:'135885225555',
                options:"只存欧派",
                date:'2019-01-01',
                creator:'张三'
            },{
                id:3,
                mangementName:"北京大兴仓库",
                status:"启用",
                mangementNum:'ck00001',
                affiliates:'北京大区，十里河店',
                warehouseType:'商品库',
                address:'北京顺义',
                principal:'小李',
                tel:'135885225555',
                options:"只存欧派",
                date:'2019-01-01',
                creator:'张三'
            },
            {
                id:4,
                mangementName:"北京大兴仓库",
                status:"启用",
                mangementNum:'ck00001',
                affiliates:'北京大区，十里河店',
                warehouseType:'商品库',
                address:'北京顺义',
                principal:'小李',
                tel:'135885225555',
                options:"只存欧派",
                date:'2019-01-01',
                creator:'张三'
            },
            {
                id:5,
                mangementName:"北京大兴仓库",
                status:"启用",
                mangementNum:'ck00001',
                affiliates:'北京大区，十里河店',
                warehouseType:'商品库',
                address:'北京顺义',
                principal:'小李',
                tel:'135885225555',
                options:"只存欧派",
                date:'2019-01-01',
                creator:'张三'
            }],
            deleteArr:[]
        }
    },
    methods: {
        deleteRows(){
            if(this.deleteArr.length==0){
                 this.$message.error('请勾选后再进行批量操作');
            }else{
                this.deleteArr.map((item,idx)=>{
                    this.tableData.map((itm,index)=>{
                        if(item.id==itm.id){
                            this.tableData.splice(index,1)
                        }
                    })
                })
                console.log(this.tableData)
            }
        },
        handleClose(done) {
            this.$confirm('确认关闭？').then(_ => {
                    done();
                }).catch(_ => {

                });
        },
        onSubmit() {
            this.dialogVisible=false;
            console.log('submit!');
        },
        clickOperation(val){
            this.dialogVisible=true;
            if(val==0){
                this.title="新增仓库"
            }else{
                this.title="编辑仓库"
            }
        },
        chooseDelete(selection){
            this.deleteArr=selection;
        },
        filterHandler(value, row, column){
            const property = column['property'];
            return row[property] === value;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        }
    },
    
}
</script>
<style>
    .btnSubmit{
        width: 100%;
    }
    .btnSubmit>div{
        width: 100%;
    }
    .btns{
        width: 100%;
        display: flex ;
        justify-content: center;
        align-items: center;
    }
    .textAreaIpt{
        width: 100%;;
    }
    .textAreaMain{
        width:564px;
    }
    .textAreaIpt>label{
        padding-right:39px;
    }
    .addressIpt{
        width: 202px;;
    }
    .form-ipts{
        margin:0 0 20px !important;
        width: 49.7%;
        /* padding:0 10px;  */
    }
    .form-selects{
        width: 202px;;
    }
    .operation{
        margin-bottom: 20px;
    }
    .label-padding>label{
        padding:0 26px 0 0;
    }
    .form-selects2{
        width: 80px;
    }
</style>