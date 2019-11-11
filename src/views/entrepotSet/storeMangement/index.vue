<template>
    <div>
        <div class="head_nav">
                    <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="queryForm">
                <el-row :gutter="10">
                    <el-col :span="span">
                        <el-input size="medium" placeholder="仓库名称/编码/负责人" v-model="formList.text"></el-input>
                    </el-col>
                    <el-col :span="span">
                        <el-date-picker
                            size="medium"
                            v-model="date"
                            type="daterange"
                            range-separator="-"
                            value-format="yyyy-MM-dd"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="span">
                        <el-select v-model="formList.storageType" size="medium">
                            <el-option label="商品" :value="0"></el-option>
                            <el-option label="门店" :value="1"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="span">
                        <el-select v-model="formList.status" size="medium">
                            <el-option label="启用" :value="0"></el-option>
                            <el-option label="禁用" :value="1"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="24" style="display:flex;justify-content:center;align-items:center">
                        <el-button size="medium" class="button-fc" type="warning" @click="search">查询</el-button>
                        <el-button size="medium" type="primary" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <el-card class="m-top10">
            <div>
                <div class="m-bottom10">
                    <el-button size="small" class="button-96" v-if="btnJurisdiction.add" @click="clickOperation(0)">新增仓库</el-button>
                    <el-button size="small" class="button-96" v-if="btnJurisdiction.edit" @click="clickOperation(1)">编辑</el-button>
                    <el-button size="small" class="button-96" v-if="btnJurisdiction.delete" @click="deleteRows">删除</el-button>
                </div>
                <div>
                    <el-table :max-height="maxHeight" :data="tableData" border :row-class-name="tableRowClassName" @selection-change="chooseDelete">
                        <el-table-column align="center" type="selection" fixed="left" width="50"></el-table-column>
                        <el-table-column align="center" prop="storageName" label="仓库名称" show-overflow-tooltip width="200"></el-table-column>
                        <el-table-column align="center" prop="status" show-overflow-tooltip label="状态">
                            <template slot-scope="scope">
                                {{scope.row.status==0?"启用":"停用"}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="storageCode" show-overflow-tooltip width="180" label="仓库编码"></el-table-column>
                        <el-table-column align="center" prop="storeName" label="关联门店" show-overflow-tooltip width="250"></el-table-column>
                        <el-table-column align="center" show-overflow-tooltip prop="storageType" label="仓库类型" width="120">
                            <template slot-scope="scope">
                                {{scope.row.storageType==0?"商品库":"门店"}}
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="address" show-overflow-tooltip label="仓库地址" width="250"></el-table-column>
                        <el-table-column align="center" show-overflow-tooltip prop="userName" label="负责人" width="120"></el-table-column>
                        <el-table-column align="center" show-overflow-tooltip prop="telPhone" label="手机" width="120"></el-table-column>
                        <el-table-column align="center" prop="remarks" show-overflow-tooltip label="备注" width="200"></el-table-column>
                        <el-table-column align="center" show-overflow-tooltip prop="createTime" width="200" label="创建时间"></el-table-column>
                        <el-table-column align="center" show-overflow-tooltip prop="createName" label="创建人" width="120"></el-table-column>
                    </el-table>
                </div>
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
        </el-card>
        <el-dialog custom-class="customDialogTitle" :title="title" :visible.sync="dialogVisible" width="1000px" @open="openListStore">
          <div class="queryForm">
            <el-form :model="formInline" class="demo-form-inline" label-width="130px" size="medium" :rules="rules">
              <el-form-item label="仓库名称" style="width:49%;display:inline-block;margin-bottom:30px" prop="storageName">
                <el-input v-model="formInline.storageName" clearable></el-input>
              </el-form-item>
              <el-form-item label="仓库类型" style="width:50%;display:inline-block;margin-bottom:30px" prop="storageType">
                <el-select v-model="formInline.storageType" clearable placeholder="选择" class="form-selects" @change="changeStore">
                  <el-option label="商品库" :value="0"></el-option>
                  <el-option label="门店" :value="1"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="关联门店" style="width:49%;display:inline-block;margin-bottom:30px" prop="addStoreList">
                <el-select v-model="formInline.addStoreList" clearable placeholder="选择" class="form-selects" v-if="isCheckes" filterable collapse-tags>
                  <el-option v-for="(item,index) in listStore" :key="index" :label="item.storeName" :value="item.storeId"></el-option>
                </el-select>
                <el-select v-model="formInline.addStoreList" clearable placeholder="选择" class="form-selects" multiple v-else filterable collapse-tags>
                  <el-option v-for="(item,index) in listStore" :key="index" :label="item.storeName" :value="item.storeId"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="组织机构" style="width:50%;display:inline-block;margin-bottom:30px" prop="labelName">
                <el-input size="medium" @focus="btnAlert" clearable v-model="formInline.labelName">组织机构</el-input>
              </el-form-item>
              <el-form-item label="负责人" style="width:49%;display:inline-block;margin-bottom:30px" prop="userId">
                <el-select v-model="formInline.userId" clearable placeholder="选择" class="form-selects" @change="changeUser">
                  <el-option v-for="(item,idx) in userArr" :key="idx" :label="item.name" :value="item.id"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="联系方式" style="width:50%;display:inline-block;margin-bottom:30px" prop="mobilePhone">
                <el-input v-model="formInline.mobilePhone"></el-input>
              </el-form-item>
              <el-form-item label="仓库地址" prop="areaId" style="margin-bottom:30px">
                <el-select v-model="formInline.provinceId" clearable placeholder="省" @change="changeProvince" style="width:138px;">
                  <el-option v-for="(item,idx) in listProvince" :key="idx" :label="item.province" :value="item.provinceid"></el-option>
                </el-select>
                <el-select v-model="formInline.cityId" clearable placeholder="市" @change="changeCity" style="width:138px;">
                  <el-option  v-for="(item,idx) in listCity" :key="idx" :label="item.city" :value="item.cityid"></el-option>
                </el-select>
                <el-select v-model="formInline.areaId" clearable placeholder="县" @change="changeArea" style="width:138px;" >
                  <el-option  v-for="(item,idx) in listAreas" :key="idx" :label="item.area" :value="item.areaid"></el-option>
                </el-select>
                <el-input class="addressIpt" clearable v-model="formInline.address"></el-input>
              </el-form-item>
              <el-form-item label="备注">
                <el-input type="textarea" clearable v-model="formInline.remarks"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                <el-radio v-model="formInline.status" :label="0">启用</el-radio>
                <el-radio v-model="formInline.status" :label="1">禁用</el-radio>
              </el-form-item>
            </el-form>
          </div>
          <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="onSubmit" :loading="loadingBtn">提交</el-button>
            <el-button @click="dialogVisible=false">取消</el-button>
          </div>
        </el-dialog>
        <el-dialog :title="title2" :visible.sync="dialogVisible2" width="760px">
            <div>
                <el-tree
                    :data="treeData"
                    node-key="id"
                    :props="defaultProps"
                    highlight-current
                    @node-click="nodeData">
                </el-tree>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button size="medium" type="primary" @click="byConfirm">确定</el-button>
                <el-button size="medium" @click="dialogVisible2=false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { getNames } from '../../../utils/pubilcFn';
import breadcrumb from "@/views/components/breadcrumb";
import pagination from '@/views/components/pagination';
import { mapGetters } from 'vuex';
import { page, addStorage, deleteTable, editStorage,getStorage} from "api/entrepotSet/storeManagement/index";
import { listStore, listProvince, listCity, listAreas, listOrganization, listOrganizationStaff } from 'api/pulicJava'
export default {
    components: {
        breadcrumb,
        pagination
    },
    data(){
        return {
            span:6,
            total:10,
            title:"",
            title2:"组织机构树",
            flag:'',
            loadingBtn:false,
            dialogVisible: false,
            dialogVisible2:false,
            mangementName:[],
            companyId:null,
            companyId2:null,
            userArr:[],
            formInline: {
                storageName: "",
                storageType: "",
                userId: "",
                provinceId: "",
                cityId: "",
                areaId: "",
                address: "",
                remarks: "",
                status: "",
                organizationId: "",
                addStoreList: [],
                labelName:"",
                mobilePhone:"",
            },
            navList:[],
            provinceId:"",
            cityId: "",
            areaId: "",
            tableData: [],
            deleteArr:[],
            listStore:[],
            listProvince:[],
            listCity:[],
            listAreas:[],
            organizationArr:[],
            defaultProps:[],
            treeData: [],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            label:"",
            delStoreList:[],
            date:[],
            formList:{
                page:1,
                limit:10,
                text:"",
                startTime:"",
                endTime:"",
                storageType:"",
                status:"",
            },
            isCheckes:false,
            btnJurisdiction:{
                add:false,
                edit:false,
                delete:false,
            },
            rules:{
                storageName:[
                    {
                        required:true,
                        message:'请输入仓库名称'
                    }
                ],
                storageType:[
                    {
                        required:true,
                        message:'请选择仓库类型'
                    }
                ],
                addStoreList:[
                    {
                        required:true,
                        message:'请选择关联门店'
                    }
                ],
                labelName:[
                    {
                        required:true,
                        message:'请选择组织机构'
                    }
                ],
                userId:[
                    {
                        required:true,
                        message:'请选择负责人'
                    }
                ],
                mobilePhone:[
                    {
                        required:true,
                        message:'请输入手机号'
                    }
                ],
                status:[
                    {
                        required:true,
                        message:'请选择状态'
                    }
                ],
                areaId:[
                    {
                        required:true,
                        message:'请选择全仓库地址'
                    }
                ],
            }
        }
    },
    created(){
        this.btnInit()
        this.mangementName=getNames('mangementName',this.tableData)
        listOrganization().then(res=>{
            this.treeData=res.data;
        })
        listProvince().then(resion=>{
            if(resion.status==200){
                this.listProvince=resion.data;
            }
        })
    },
    methods: {
        btnInit(){
            this.btnJurisdiction.add=JSON.parse(this.$loca.getItem('element'))["storeMangement:btn-add"];
            this.btnJurisdiction.edit=JSON.parse(this.$loca.getItem('element'))["storeMangement:btn_edit"];
            this.btnJurisdiction.delete=JSON.parse(this.$loca.getItem('element'))["storeMangement:btn_delete"];
        },
        reset(){
            this.formList.page=1;
            this.formList.text="";
            this.formList.startTime="";
            this.formList.endTime="";
            this.formList.storageType="";
            this.getTableData()
        },
        search(){
            this.getTableData()
        },
        changeStore(val){
            if(val==1){
                this.formInline.addStoreList=[]
                this.formInline.addStoreList=""
                this.isCheckes=true;
            }else{
                this.formInline.addStoreList=""
                this.formInline.addStoreList=[]
                this.isCheckes=false;
            }
        },
        getTableData(){
            this.formList.startTime=this.date[0];
            this.formList.endTime=this.date[1]
            page(this.formList).then(res=>{
                if(res.status==200){
                    this.tableData=res.data.rows;
                    this.total=res.data.total;
                }else{
                    alert("接口有问题")
                }
            })
        },
        //弹窗打开默认展示
        openListStore(){
                for(let i in this.formInline){
                    this.formInline[i]="";
                }
                listStore().then(res=>{
                    if(res.status==200){
                        this.listStore=res.data;
                    }
                })
        },
        //获取市接口
        changeProvince(){
             this.formInline.cityId="";
             this.formInline.areaId="";
             this.listAreas=[];
             this.provinceId=this.formInline.provinceId;
            listCity({id:this.formInline.provinceId}).then(res=>{
                if(res.status==200){
                    this.listCity=res.data
                }
            })
        },
        //获取县接口
        changeCity(){
            this.formInline.areaId="";
            this.listAreas=[];
            this.cityId=this.formInline.cityId;
            listAreas({id:this.formInline.cityId}).then(res=>{
                if(res.status==200){
                    this.listAreas=res.data
                }
            })
        },
        changeArea(){
            this.areaId=this.formInline.areaId;
        },
        //斑马线
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        //组织机构弹窗
        btnAlert(){
            this.dialogVisible2=true;
        },
        //组织结构确定按钮
        byConfirm(){
            this.dialogVisible2=false;
            this.companyId2=this.companyId;
            this.companyId="";
            this.formInline.labelName=this.label;
            listOrganizationStaff({
                organizationId:this.companyId2
            }).then(res=>{
                this.userArr=res.data.leader;
                for(let i=0;i<res.data.staff.length;i++){
                    this.userArr.push(res.data.staff[i])
                }
            })
        },
        changeUser(){
            this.userArr.map((item,idx)=>{
                if(item.id==this.formInline.userId){
                    this.formInline.mobilePhone=item.mobilePhone
                }
            })
        },
        //点击组织机构时获取到的数据
        nodeData(data){
           this.companyId=data.id;
           this.label=data.label;
        },
        //新增按钮与编辑按钮
        clickOperation(val){
            if(val==0){
                this.title="新增仓库";
                this.flag=val;
                this.dialogVisible=true;
            }else{
                this.title="编辑仓库";
                this.flag=val;
                if(this.deleteArr.length<1){
                    this.$message({
                        message: '请选择后再进行编辑',
                        type: 'warning'
                    });
                }else if(this.deleteArr.length>1){
                    this.$message({
                        message: '每次只可编辑一条',
                        type: 'warning'
                    });
                }else{
                    this.dialogVisible=true;
                    getStorage({
                        storageId:this.deleteArr[0].storageId
                    }).then(res=>{
                        let arr=[]
                        res.data.storeList.map((item,idx)=>{
                            arr.push(item.storeId)
                        })
                        this.delStoreList=arr;
                        this.formInline.storageName = res.data.storageName;
                        this.formInline.storageType = res.data.storageType;
                        this.formInline.userId = res.data.userId;
                        this.formInline.provinceId = res.data.provinceId;
                        // this.formInline.cityId = res.data.cityId;
                        // this.formInline.areaId = res.data.areaId;
                        this.formInline.address = res.data.address;
                        this.formInline.remarks = res.data.remarks;
                        this.formInline.status = res.data.status;
                        this.formInline.organizationId = res.data.organizationId;
                        this.formInline.addStoreList = res.data.addStoreList;
                        this.formInline.labelName =res.data.labelName;
                        if(res.data.storageType==1){
                            this.isCheckes=true;
                            this.formInline.addStoreList=res.data.storeList[0].storeId;
                        }else{
                            this.isCheckes=false;
                            this.formInline.addStoreList=arr;
                        }
                        this.formInline.labelName=res.data.organizationName;
                        listOrganizationStaff({
                            organizationId:res.data.organizationId
                        }).then(resion=>{
                            this.userArr=resion.data.leader;
                            for(let i=0;i<resion.data.staff.length;i++){
                                this.userArr.push(resion.data.staff[i])
                            }
                            this.userArr.map((item,idx)=>{
                                if(this.formInline.userId==item.id){
                                    this.formInline.userId=item.id;
                                    this.formInline.mobilePhone=item.mobilePhone;
                                }
                            })
                        })
                        listProvince().then(resion=>{
                            if(resion.status==200){
                                this.listProvince=resion.data;
                                resion.data.map((item,idx)=>{
                                    if(item.provinceid==this.deleteArr[0].provinceId){
                                        this.formInline.provinceId=item.province;
                                        this.provinceId=item.provinceid
                                    }
                                })
                            }
                        })
                        listCity({id:res.data.provinceId}).then(resion=>{
                            if(resion.status==200){
                                this.listCity=resion.data;
                                resion.data.map((item,idx)=>{
                                    if(item.cityid==this.deleteArr[0].cityId){
                                        this.formInline.cityId=item.city;
                                        this.cityId=item.cityid
                                    }
                                })
                            }
                        })
                        listAreas({id:res.data.cityId}).then(resion=>{
                            if(resion.status==200){
                                this.listAreas=resion.data;
                                resion.data.map((item,idx)=>{
                                    if(item.areaid==this.deleteArr[0].areaId){
                                        this.formInline.areaId=item.area;
                                        this.areaId=item.areaid
                                    }
                                })
                            }
                        })
                    })
                    
                }
            }
        },
        //弹窗提交
        onSubmit() {
            this.dialogVisible=false;
            if(this.flag==0) {
                this.formInline.organizationId=this.companyId2;
                let obj=[]
                if(this.isCheckes){
                    obj=[this.formInline.addStoreList]
                }else{
                    obj=this.formInline["addStoreList"]
                }
                let data = {
                    storageName: this.formInline.storageName,
                    storageType: this.formInline.storageType,
                    userId: this.formInline.userId,
                    provinceId: this.formInline.provinceId,
                    cityId: this.formInline.cityId,
                    areaId: this.formInline.areaId,
                    address: this.formInline.address,
                    remarks: this.formInline.remarks,
                    status: this.formInline.status,
                    organizationId: this.formInline.organizationId,
                    addStoreList: obj,
                    labelName:this.formInline.labelName,
                }
                this.loadingBtn = true;
                addStorage(data).then(res=>{
                    if(res.status == 200){
                        for(let i in this.formInline){
                            this.formInline[i]="";
                        }
                        this.getTableData()
                        this.$message({message: '提交成功',type: 'success'});
                        this.loadingBtn = false;
                    }else{
                        this.loadingBtn = false;
                    }
                }).catch(error=>{
                    this.loadingBtn = false;
                    console.error('',error);
                })
            }else{
                let arr=[];
                let brr=[];
                if(this.isCheckes){
                    if(this.delStoreList.indexOf(this.formInline.addStoreList)==-1){
                        arr.push(this.delStoreList[0])
                        brr=[this.formInline.addStoreList]
                    }
                }else{
                    this.delStoreList.map((info,index)=>{
                        if(this.formInline.addStoreList.indexOf(info)==-1){
                            arr.push(info)
                        }
                    })
                    this.formInline.addStoreList.map((item,idx)=>{
                        if(this.delStoreList.indexOf(item)==-1){
                            brr.push(item)
                        }
                    })
                }
                editStorage({
                    storageName: this.formInline.storageName,
                    storageType: this.formInline.storageType,
                    userId: this.formInline.userId,
                    provinceId: this.provinceId,
                    cityId: this.cityId,
                    areaId: this.areaId,
                    address: this.formInline.address,
                    remarks: this.formInline.remarks,
                    status: this.formInline.status,
                    organizationId: this.companyId2,
                    storageId:this.deleteArr[0].storageId,
                    addStoreList:brr,
                    delStoreList:arr
                }).then(res=>{
                    for(let i in this.formInline){
                        this.formInline[i]="";
                    }
                    this.getTableData()
                    this.$message({
                        message: '编辑成功',
                        type: 'success'
                    });
                })
            }
        },
        //删除表格
        deleteRows(){
            if(this.deleteArr.length==0){
                 this.$message.error('请勾选后再进行批量操作');
            }else{
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let arr=[];
                    this.deleteArr.map((item,idx)=>{
                        arr.push(item.storageId)
                    })
                    deleteTable({delStorageList:arr}).then(res=>{
                        this.getTableData()
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
                
            }
        },
        chooseDelete(selection){
            this.deleteArr=selection;
        },
        filterHandler(value, row, column){
            const property = column['property'];
            return row[property] === value;
        },
        currentChange(val) {
            this.formList.page=val
            this.getTableData();
        },
        sizeChange(val) {
            this.formList.page=1;
            this.formList.limit=val;
            this.getTableData()
        },
    },
    mounted() {
        //获取表格接口
        this.getTableData();
        this.navList=this.$route.meta;
    },
  computed: {
      ...mapGetters([
        'maxHeight'
      ])
  }
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
        width:574px;
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
        width: 120px;
    }
</style>
