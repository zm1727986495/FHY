<template>
    <div>
        <div class="head_nav">
                    <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <div class="content_body_warp_left fl" ref='tab' style="position: inherit;">
            <div v-for="(item,index) in categorys" :key="index" @click="cateClick(item,index)" :class="item.flag?'listTitle listTitleBg':'listTitle'">
                <span>{{item.storageName}}</span>
                <i class="el-icon-arrow-right"></i>
            </div>
        </div>
        <el-card>
            <div>
                <div class="goodsAllcationMain">
                    <div>
                        <el-select v-model="params.regionId" @change="changeGoods">
                            <el-option v-for="(item,idx) in goodsAreaArr" :key="idx" :label="item.regionName" :value="item.regionId"></el-option>
                        </el-select>
                    </div>
                    <div class="m-top20">
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.add"  @click="addNewFile">新增货位</el-button>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.edit" @click="editFile">编辑</el-button>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.save"  @click="save">保存</el-button>
                        <el-button size="small" class="button-96" v-if="btnJurisdiction.delete" @click="deleteFile">删除</el-button>
                    </div>
                    <div class="goodsAllcationTable">
                        <el-table
                            :data="tableData"
                            border
                            :row-class-name="tableRowClassName"
                            @selection-change="chooseDelete"
                            style="width: 100%">
                            <el-table-column
                            align="center"
                            type="selection">
                            </el-table-column>
                            <el-table-column
                            align="center"
                            prop="siteCode"
                            label="货位编码"
                            width="180">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isAdd">
                                    <el-input placeholder="请输入货位编码" v-model="scope.row.siteCode"></el-input>
                                </div>
                                <div v-else>{{scope.row.siteCode}}</div>
                            </template>
                            </el-table-column>
                            <el-table-column
                            align="center"
                            prop="price"
                            label="货位价格"
                            width="180">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isAdd">
                                    <div style="display:inline-block;width:45%;">
                                        <el-input type="number" placeholder="价格" v-model="scope.row.price"></el-input>
                                    </div>
                                    <div style="display:inline-block;width:45%;">
                                        <el-input placeholder="单位" v-model="scope.row.unit"></el-input>
                                    </div>
                                </div>
                                <div v-else>{{scope.row.price}}/{{scope.row.unit}}</div>
                            </template>
                            </el-table-column>
                            <el-table-column
                            align="center"
                            prop="createName"
                            show-overflow-tooltip
                            label="创建人">
                            </el-table-column>
                            <el-table-column
                            align="center"
                            prop="createTime"
                            label="创建时间"
                            show-overflow-tooltip
                            width="200">
                            </el-table-column>
                            <el-table-column
                            align="center"
                            prop="remarks"
                            show-overflow-tooltip
                            label="备注">
                            <template slot-scope="scope">
                                <div v-if="scope.row.isAdd">
                                    <el-input placeholder="备注" v-model="scope.row.remarks"></el-input>
                                </div>
                                <div v-else>{{scope.row.remarks}}</div>
                            </template>
                            </el-table-column>
                        </el-table>
                        <div class="pagination_wrap">
                            <pagination
                                :current-page="params.page"
                                :pageSize="params.limit"
                                :total="total"
                                @sizeChange="sizeChange"
                                @currentChange="currentChange">
                            </pagination>
                        </div>
                    </div>
                </div>
            </div>
        </el-card>
        
    </div>
</template>
<script>
import { getNames } from '../../../utils/pubilcFn';
import { listStorageSiteByPage, addAllStorageSite, deleteAllStorageSite, getById, editStorageSite, getStorageList, getStorageRegionListById } from 'api/entrepotSet/goodsAllocation/index';
import { listOrganizationStaff } from 'api/pulicJava';
import breadcrumb from "../../components/breadcrumb";
import pagination from "@/views/components/pagination";
export default {
    components: {
        breadcrumb,
        pagination
    },
    // mounted() {
    //     this.btnInit()
    //     this.navList=this.$route.meta;
    //     getStorageList().then(res=>{
    //         this.categorys=res.data;
    //     })
    // },
    // created(){
    //     this.siteCode=getNames('siteCode',this.tableData)
    // },
    activated(){
        this.btnInit()
        this.navList=this.$route.meta;
        getStorageList().then(res=>{
            this.categorys=res.data;
        })
        this.siteCode=getNames('siteCode',this.tableData)
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    data() {
      return {
        siteCode:[],
        trees:[],
        active:"",
        navList:[],
        valArr:{
            val1:"",
            val2:"",
            val3:"",
            val4:"",
            val5:"",
            val6:"",
            val7:""
        },
        flag:false,
        defaultProps: {
            children: 'children',
            label: 'label'
        },
        tableData: [],
        userList:[],
        organizationId:"",
        rowsData:[],
        storageId:'',
        editArr:[],
        submitStatus:0,
        userId:'',
        searchtext:'',
        categorys:[],
        total:10,
        params:{
            page:1,
            limit:10,
            regionId:"",
        },
        goodsAreaArr:[],
        treeListRows:{},
        userArr:[],
        mobilePhone:'',
        addOredit:0,
        btnJurisdiction:{
            add:false,
            edit:false,
            delete:false,
            save:false
        }
      };
    },
    methods: {
        btnInit(){
            this.btnJurisdiction.add=JSON.parse(this.$loca.getItem('element'))["goodsAllocation:btn_add"];
            this.btnJurisdiction.edit=JSON.parse(this.$loca.getItem('element'))["goodsAllocation:btn_edit"];
            this.btnJurisdiction.delete=JSON.parse(this.$loca.getItem('element'))["goodsAllocation:btn_delete"];
            this.btnJurisdiction.save=JSON.parse(this.$loca.getItem('element'))["goodsAllocation:btn_save"];
        },
        save(){
            if(this.params.regionId){
                if(this.rowsData.length){
                    let arr=[];
                    let brr=[];
                    let editArr=[];
                    this.rowsData.map((item,idx)=>{
                        if(item.flag){
                            arr.push(item)
                        }
                        if(item.edit){
                            editArr.push(item)
                        }
                        brr.push(item.flag)
                    })
                    if(this.addOredit==0){
                        if(brr.indexOf(undefined)==-1){
                            let storageAdd=[];
                            let siteCodeArr=[];
                            arr.map((item,idx)=>{
                                let obj={
                                    storageId:this.storageId,
                                    regionId:this.params.regionId,
                                    price:item.price,
                                    unit:item.unit,
                                    siteCode:item.siteCode,
                                    remarks:item.remarks,
                                    status:0
                                }
                                storageAdd.push(obj)
                                siteCodeArr.push(item.siteCode)
                            })
                            if(siteCodeArr.indexOf("")==-1){
                                addAllStorageSite({siteList:storageAdd}).then(res=>{
                                    this.$message({
                                        message: '新增成功',
                                        type: 'success'
                                    });
                                    this.pages()
                                })
                            }else{
                                this.$message({
                                    message: '货位编码为必填项',
                                    type: 'warning'
                                });
                            }   
                        }else{
                            this.$message({
                                message: '只可选择新增数据',
                                type: 'warning'
                            });
                        }
                    }else{
                        editStorageSite({
                            siteId:editArr[0].siteId,
                            regionId:editArr[0].regionId,
                            storageId:this.storageId,
                            regionId:this.params.regionId,
                            price:editArr[0].price,
                            unit:editArr[0].unit,
                            siteCode:editArr[0].siteCode,
                            status:editArr[0].status,
                            remarks:editArr[0].remarks,
                        }).then(res=>{
                            this.pages()
                            this.$message({
                                message: '编辑成功',
                                type: 'success'
                            });
                        })
                    }
                }else{
                    this.$message({
                        message: '请选择列表后再进行保存',
                        type: 'warning'
                    });
                }
            }else{
                this.$message({
                    message: '请选择货区后再进行保存',
                    type: 'warning'
                });
            }
        },
        sizeChange(val){
            this.params.page=1;
            this.params.limit=val;
            this.pages();
        },
        currentChange(val){
            this.params.page=val;
            this.pages();
        },
        changeGoods(){
            this.pages()
        },
        pages(){
            listStorageSiteByPage(this.params).then(res=>{
                res.data.rows.map((item,idx)=>{
                    item.isAdd=false;
                })
                this.tableData=res.data.rows;
                this.total=res.data.total;
                this.addOredit=null;
            })
        },
        search(){

        },
        cateClick(val,idx){
            this.categorys.map((item,index)=>{
                item.flag=false;
            })
            this.params.regionId="";
            val.flag=!val.flag;
            this.categorys.splice(idx, 1, val)
            this.storageId=val.storageId;
            this.organizationId=val.organizationId;
            getStorageRegionListById(
                {
                    storageId:this.storageId
                }
            ).then(res=>{
                this.goodsAreaArr=res.data;
            })
            this.treeListRows=val;
            listOrganizationStaff({
                organizationId:val.organizationId
            }).then(res=>{
                this.userArr=res.data.leader;
                for(let i=0;i<res.data.staff.length;i++){
                    this.userArr.push(res.data.staff[i])
                }
            })
        },
        chooseDelete(val){
            this.rowsData=val;
        },
        deleteFile(){
            if(this.rowsData.length){
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let arr=[];
                    this.rowsData.map((item,idx)=>{
                        if(item.status!=0){
                            arr.push(item.siteId)
                        }else{
                            this.$message({
                                message: '暂存或出库不可操作',
                                type: 'warning'
                            });
                        }
                    })
                    deleteAllStorageSite(
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
                    message: '请选择后再进行删除',
                    type: 'warning'
                });
            }
        },
        addNewFile(){
            if(this.params.regionId){
                if(this.addOredit==1){
                    this.$message({
                        message: '编辑状态下不可新增',
                        type: 'warning'
                    });
                }else{
                    let obj={
                        siteCode:'',
                        remarks:'',
                        price:'0',
                        unit:'元',
                        isAdd:true,
                        flag:true
                    }
                    this.tableData.unshift(obj)
                    this.addOredit=0;
                }
            }else{
                this.$message({
                    message: '请选择货区后再进行新增',
                    type: 'warning'
                });
            }
        },
        closes(){
            for(let i in this.valArr){
                this.valArr[i]="";
            }
            this.mobilePhone="";
        },
        editFile(){
            if(this.params.regionId){
                if(this.rowsData.length==0){
                    this.$message({
                        message: '请选择后再进行编辑',
                        type: 'warning'
                    });
                }else if(this.rowsData.length!=1){
                    this.$message({
                        message: '只能选择一条进行编辑',
                        type: 'warning'
                    });
                }else{
                    // if(this.addOredit==0){
                    //     this.$message({
                    //         message: '新增状态不可编辑',
                    //         type: 'warning'
                    //     });  
                    // }else{
                        this.tableData.map((item,idx)=>{
                            if(item.siteId==this.rowsData[0].siteId){
                                item.isAdd=true
                            }
                        })
                        this.rowsData[0].edit=true;
                        this.addOredit=1;
                    // }
                }
            }else{
                this.$message({
                    message: '请选择货区后再进行编辑',
                    type: 'warning'
                });
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
    .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
    .clearfloat{zoom:1}
    .price>div{
        width: 67px !important;
    }
    .price>label:nth-child(3){
        width: 60px !important;
    }
    .formList{
        width: 100%;
        margin-top:30px;
    }
    .formList li{
        display: flex;
        align-items: center;
        width: 50%;;
        margin-bottom: 35px;
    }
    .formList li>label{
        display: inline-block;
        width: 100px;
        text-align: right;
        padding-right:20px;
        float: left;
    }
    .formList li>div{
        width: 60%;
        display: inline-block;
        float: left;
    }
    .goodsAllcationDialog>ul{
        display: flex;
        flex-wrap: wrap;
        
        
    }
    .Alerts>>>.el-dialog__body{
        padding-top:10px;
    }
    .Alerts>>>.el-dialog__headerbtn{
        top:10px;
        right:10px;
        font-size: 20px;
    }
    .goodsAllcationDialog>ul>li{
        width: 50%;
        padding:0px 20px;
    }
    .submitDiv{
        width: 100%;
        height: 70px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }
    .goodsAllcationTree{
        width: 200px;
    }
    .goodsAllcationMain{
        width: 100%;
    }
    .goodsAllcationTable{
        margin-top:20px;
    }
    .treesLeft{
        width: 100%;
        height: auto;
        border: 1px solid #e6e6e6;
        border-bottom: none;
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
        height:40px;
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
</style>