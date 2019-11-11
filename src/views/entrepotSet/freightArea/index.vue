<template>
    <div>
        <div class="head_nav">
                    <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <div class="clearfloat">
            <div class="content_body_warp_left fl" ref='tab' style="position: inherit;">
                <div v-for="(item,index) in categorys" :key="index" @click="cateClick(item,index)" :class="item.flag?'listTitle listTitleBg':'listTitle'">
                    <span>{{item.storageName}}</span>
                    <i class="el-icon-arrow-right"></i>
                </div>
            </div>
            <el-card class="fr" style="width:calc(100% - 250px);height: calc(100vh - 144px);">
                <div class="freightMain" style="width: 100%">
                    <div>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.add" @click="addNewFile(0)">新增货区</el-button>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.edit" @click="editFile(1)">编辑</el-button>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.delete" @click="deleteRows">删除</el-button>
                    </div>
                    <div class="freightTable" style="width: 100%">
                        <el-table
                            :data="tableData"
                            border
                            :row-class-name="tableRowClassName"
                            @selection-change="chooseDelete"
                            style="width: 100%">
                            <el-table-column
                            type="selection"
                            align="center">
                            </el-table-column>
                            <el-table-column
                            prop="regionCode"
                            label="货区编码"
                            align="center"
                            width="180">
                            </el-table-column>
                            <el-table-column
                            prop="regionName"
                            label="货区名称"
                            align="center"
                            width="180">
                            </el-table-column>
                            <el-table-column
                            prop="userName"
                            align="center"
                            label="负责人">
                            </el-table-column>
                            <el-table-column
                            prop="telPhone"
                            align="center"
                            label="手机号">
                            </el-table-column>
                            <el-table-column
                            prop="theStaging"
                            align="center"
                            label="暂存区"
                            width="250px">
                            <template slot-scope="scope">
                                <el-radio v-model="scope.row.theStaging" :label="1">是</el-radio>
                                <el-radio v-model="scope.row.theStaging" :label="0">否</el-radio>
                            </template>
                            </el-table-column>
                            <el-table-column
                            prop="remarks"
                            align="center"
                            label="备注">
                            </el-table-column>
                            <el-table-column
                            prop="createName"
                            align="center"
                            label="创建人">
                            </el-table-column>
                            <el-table-column
                            prop="createTime"
                            align="center"
                            label="创建时间"
                            width="200">>
                            </el-table-column>
                        </el-table>
                        <div class="pagination_wrap">
                            <pagination
                                :current-page="formList.page"
                                :pageSize="formList.limit"
                                :total="total"
                                @sizeChange="sizeChange"
                                @currentChange="currentChange">
                            </pagination>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        <div class="Alerts">
            <el-dialog
            :visible.sync="dialogVisible"
            width="768px"
            :before-close="handleClose"
            @open="closes">
                <div class="freightDialog">
                    <div class="title">
                        <span></span>
                        <span>新增货区</span>
                    </div>
                    <ul>
                        <div class="lefts">
                            <li>
                                <label>货区名称:</label>
                                <div>
                                    <el-input v-model="valArr.regionName"></el-input>
                                </div>
                            </li>  
                            
                            <li class="setTel"><label>手机号:</label>
                                <div>
                                    {{tel}}
                                </div>
                            </li>
                            <li><label>暂存区:</label>
                                <div>
                                    <el-radio v-model="valArr.theStaging" :label="0">是</el-radio>
                                    <el-radio v-model="valArr.theStaging" :label="1">否</el-radio>
                                </div>
                            </li>
                        </div>
                        <div class="rights">
                            <li><label>负责人:</label>
                                <div>
                                    <el-select v-model="valArr.userId" placeholder="选择" class="form-selects" @change="changeUser">
                                        <el-option v-for="(item,idx) in userList" :key="idx" :label="item.name" :value="item.id"></el-option>
                                    </el-select>
                                </div>
                                
                            </li>
                            <li id="remarks"><label>备注:</label>
                                <div><el-input type="textarea" class="textAreaMain" v-model="valArr.remarks"></el-input></div>
                            </li>
                        </div>
                    </ul>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="addNewFreight">确 定</el-button>
                    <el-button @click="dialogVisible = false">取 消</el-button>
                </span>
            </el-dialog>
        </div>
        
    </div>
</template>
<script>
import { getNames } from '../../../utils/pubilcFn';
import { listStorageRegionByPage, addStorageRegion, getStorageList, getOrganAndStorageRegionTree, getById, deleteAllStorageRegion, editStorageRegion } from "api/entrepotSet/freightArea/server";
import { listOrganizationStaff } from 'api/pulicJava';
import breadcrumb from "../../components/breadcrumb";
import pagination from "@/views/components/pagination";
export default {
    components: {
        breadcrumb,
        pagination
    },
    activated(){
        this.btnInit()
        this.navList=this.$route.meta;;
        // getOrganAndStorageRegionTree().then(res=>{
        //     this.trees=res.data
        // });
        getStorageList().then(res=>{
            this.categorys=res.data;
        })
        this.regionCode=getNames('regionCode',this.tableData)
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // mounted() {
    //     this.btnInit()
    //     this.navList=this.$route.meta;;
    //     // getOrganAndStorageRegionTree().then(res=>{
    //     //     this.trees=res.data
    //     // });
    //     getStorageList().then(res=>{
    //         this.categorys=res.data;
    //     })
    // },
    // created(){
    //     this.regionCode=getNames('regionCode',this.tableData)
    // },
    data() {
        return {
            active:"",
            isShow:true,
            regionCode:[],
            navList:[],
            categorys:[],
            searchtext:'',
            radio:"0",
            id:null,
            flag:false,
            valArr:{
                userId:"",
                regionName:"",
                theStaging:0,
                remarks:""
            },
            dialogVisible: false,
            trees: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            tableData: [],
            treeRows:{},
            organizationId:"",
            userList:[],
            rowsData:[],
            editArr:[],
            submitStatus:0,
            formList:{
                page:1,
                limit:10,
                storageId:""
            },
            storageId:"",
            total:10,
            tel:"",
            btnJurisdiction:{
                add:false,
                edit:false,
                delete:false
            }
        };
    },
    methods: {
        btnInit(){
            this.btnJurisdiction.add=JSON.parse(this.$loca.getItem('element'))["freightArea:btn_add"];
            this.btnJurisdiction.edit=JSON.parse(this.$loca.getItem('element'))["freightArea:btn_edit"];
            this.btnJurisdiction.delete=JSON.parse(this.$loca.getItem('element'))["freightArea:btn_delete"];
        },
        sizeChange(val){
            this.formList.page=1;
            this.formList.limit=val;
            this.pages()
        },
        currentChange(val){
            this.formList.page=val;
            this.pages()
        },
        changeUser(val){
            this.userList.map((item,idx)=>{
                if(val==item.id){
                    this.tel=item.mobilePhone
                }
            })
        },
        search(){

        },
        deleteRows(){
            if(this.rowsData.length!=0){
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let arr=[];
                    this.rowsData.map((item,idx)=>{
                        if(item.status!=0){
                            arr.push(item.regionId)
                        }else{
                            this.$message({
                                message: '暂存或出库不可操作',
                                type: 'warning'
                            });
                        }
                    })
                    deleteAllStorageRegion(
                        {
                            delList:arr
                        }
                    ).then(res=>{
                        if(res.status==200){
                            this.$message({
                                message: '删除成功',
                                type: 'success'
                            });
                            this.pages()
                        }
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });
            }else{
                this.$message({
                    message: '请选择后再删除',
                    type: 'warning'
                });
            }
        },
        chooseDelete(val){
            this.rowsData=val;
        },
        pages(){
          listStorageRegionByPage({
                page:1,
                limit:10,
                storageId:this.formList.storageId
            }).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
            })
        },
        editFile(val){
            if(val==1){
                if(this.flag){
                    if(this.rowsData.length==0){
                        this.$message({
                            message: '请选择后再进行编辑',
                            type: 'warning'
                        });
                    }else if(this.rowsData.length!=1){
                        this.$message({
                            message: '请选择一条进行编辑操作',
                            type: 'warning'
                        });
                    }else{
                        if(this.rowsData[0].status==0){
                            this.$message({
                                message: '暂存或出库不可操作',
                                type: 'warning'
                            });
                        }else{
                            // console.log(valArr)
                            this.dialogVisible=true;
                            this.submitStatus=1;
                            // for(let i in this.valArr){
                            //     this.valArr[i]="";
                            // }
                            getById({
                                regionId:this.rowsData[0].regionId
                            }).then(res=>{
                                this.editArr=res.data;
                                this.valArr.regionName=this.editArr.regionName;
                                this.valArr.remarks=this.editArr.remarks;
                                this.valArr.theStaging=this.editArr.theStaging;
                                this.tel=res.data.telPhone
                                listOrganizationStaff({
                                    organizationId:this.organizationId
                                }).then(response=>{
                                    this.userList=response.data.leader;
                                    for(let i=0;i<response.data.staff.length;i++){
                                        this.userList.push(response.data.staff[i])
                                    }
                                    this.userList.map((item,idx)=>{
                                        if(item.id===this.editArr.userId){
                                            this.valArr.userId=item.name;
                                            this.tel=item.mobilePhone;
                                        }
                                        
                                    })
                                    
                                })
                            })
                        }
                        
                    }
                }else{
                    this.$message({
                        message: '请选择仓库后，再进行编辑',
                        type: 'warning'
                    });
                }
                
            }
        },
        cateClick(val,idx){
            console.log(val)
            this.flag=true;
            this.categorys.map((item,index)=>{
                item.flag=false;
            })
            val.flag=!val.flag;
            this.categorys.splice(idx, 1, val)
            this.storageId=val.storageId;
            this.formList.storageId=val.storageId;
            this.organizationId=val.organizationId;
            this.pages()
        },
        handleOpen(key, keyPath) {
            console.log(key, keyPath);
        },
        addNewFile(val){
            if(val==0){
                if(this.flag){
                    this.submitStatus=0;
                    this.dialogVisible = true;
                    listOrganizationStaff({
                        organizationId:this.organizationId
                    }).then(res=>{
                        this.userList=res.data.leader;
                        for(let i=0;i<res.data.staff.length;i++){
                            this.userList.push(res.data.staff[i])
                        }
                        console.log(this.userList)
                    })
                }else{
                    this.$message({
                        message: '请选择仓库后，再进行新增',
                        type: 'warning'
                    });
                }
            }
        },
        treeChange(data){
            console.log(data)
        },
        closes(){
            console.log(1)
            for(let i in this.valArr){
                this.valArr[i]=""
            }
        },
        handleClose(done) {
            this.$confirm('确认关闭？')
            .then(_ => {
                done();
            })
            .catch(_ => {});
        },
        addNewFreight(){
            this.dialogVisible=false;
            if(this.submitStatus==0){
                addStorageRegion({
                    regionName:this.valArr.regionName,
                    userId:this.valArr.userId,
                    remarks:this.valArr.remarks,
                    theStaging:this.valArr.theStaging,
                    storageId:this.storageId,
                }).then(res=>{
                    if(res.status==200){
                        this.$message({
                            message: '新增成功',
                            type: 'success'
                        });
                        this.pages()
                    }
                })
            }else if(this.submitStatus==1){
                let id=''
                for(let i=0;i<this.userList.length;i++){
                    if(this.userList[i].name==this.valArr.val1){
                        id=this.userList[i].id;
                    }else{
                        id=this.userList[i].id;
                    }
                }
                editStorageRegion({
                    regionName:this.valArr.regionName,
                    userId:id,
                    remarks:this.valArr.remarks,
                    theStaging:this.valArr.theStaging,
                    storageId:this.storageId,
                    regionId:this.rowsData[0].regionId
                }).then(res=>{
                    console.log(res)
                })
            }
            
            
        },
        filterHandler(value, row, column){
            const property = column['property'];
            return row[property] === value;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
    },
    
  };
</script>
<style scoped>
    .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
    .clearfloat{zoom:1}
    .listTitle{
        height: 40px;
        line-height: 40px;
        color: #666;
        cursor: pointer;
        border-bottom: 1px solid #ebeef5;
        font-size: 13px;
        font-weight: 500;
        outline: 0;
        display: flex;
        align-items: center;
        justify-content:space-between;
        padding: 0px 15px;
    }
    .listTitleBg{
        background: #409EFF;
        color: #fff;
    }
    .content_body_warp_left {
        float: left;
        /* position: fixed; */
        width: 230px;
        height: calc(100vh - 145px);
        z-index: 1;
        padding: 0px;
        border: 1px solid #dddddd;
        margin-right: 10px;
        border-radius: 4px;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        overflow-y: auto;
        transition: top .2s;
    }
    .left_button{
      margin-left:10px;
    }
    ol{
        list-style: none;
        padding: 0;
    }
    .textAreaMain{
        width: 100%;
    }
    .actives{
        background:#409EFF;
        color:#fff;
    }
    .trees div:hover{
        background:#409EFF;
        color:#fff;
    }
    .flt{
        float: right;
        margin-right: 20px;
    }
    .trans1{
        transform:rotate(90deg);
        transition:all 0.5s
    }
    .trans2{
        transform:rotate(0deg);
        transition:all 0.5s
    }
    .parent{
        padding-left:12%;
        height: 40px;
        font-size: 15px;
        line-height: 40px;
        border-bottom: 1px solid #e6e6e6;
    }
    .children{
        padding-left:24%;
        height: 30px;
        font-size: 14px;
        line-height: 30px;
        border-bottom: 1px solid #e6e6e6;
    }
    .grandson{
        padding-left:36%;
        height: 20px;
        font-size: 13px;
        line-height: 20px;
        border-bottom: 1px solid #e6e6e6;
    }
    .title{
        height: 30px;
        color:#409EFF;
        padding-left:20px;
        font-size: 15px;
        display: flex;
        align-items: center;
    }
    .title>span:nth-child(1){
        display: inline-block;
        width: 3px;
        height: 15px;
        background:#409EFF;
    }
    .title>span:nth-child(2){
        display: inline-block;
        margin-left:7px;
    }
    .Alerts>>>.el-dialog__body{
        padding-top:10px;
    }
    .Alerts>>>.el-dialog__headerbtn{
        top:10px;
        right:10px;
        font-size: 20px;
    }
    .freightDialog>ul{
        display: flex;
        flex-wrap: wrap;
        margin-top:30px;
    }
    .lefts,.rights{
        width: 50%;
    }
    .lefts>li>div,.rights>li>div{
        display:inline-block;
        width: 202px;
    }
    .lefts>li>label,.rights>li>label{
        display: inline-block;
        width: 100px;;
        text-align: right;
        padding-right: 20px;
        float: left;
    }
    #remarks{
        display: block;
        align-items: none;
    }
    #remarks>label{
        height: 36px;;
        line-height: 36px;
    }
    .lefts>li,.rights>li{
        padding:0px 20px;
        display: flex;
        align-items: center;
        margin-bottom:35px;
    }
    .submitDiv{
        width: 100%;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .freightTree{
        width: 200px;
        float: left;
    }
    .freightMain{
        /* width: calc(100% - 230px); */
    }
    .freightTable{
        margin-top:20px;
    }
    .treesLeft{
        width: 100%;
        height: auto;
        border: 1px solid #e6e6e6;
        border-bottom: none;
    }
    
</style>
