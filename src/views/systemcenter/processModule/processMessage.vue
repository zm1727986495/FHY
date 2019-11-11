<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div>
                <div class="moduleHeader">
                    <h3 class="title">流程基本信息</h3>
                </div>
                <el-form :model="formList" label-width="130px" class="ruleForm" :rules="rules" ref="formList">
                    <el-row>
                        <el-col :span="6">
                            <el-form-item label="流程名称" prop="orderProcessName">
                                <el-input v-model="formList.orderProcessName" clearable :disabled="onlyRead"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="关联机构" prop="organizationName">
                                <el-input @focus="focusIpts" v-model="formList.organizationName" clearable @change="changeOrganization"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="品牌" prop="brandIds">
                                <el-select v-model="formList.brandIds" collapse-tags multiple clearable :disabled="onlyRead">
                                    <el-option v-for="(item,idx) in bandArr" :key="idx" :label="item.brandName" :value="item.brandId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="品类" prop="commodityCategoryIds">
                                <el-select v-model="formList.commodityCategoryIds" collapse-tags multiple clearable :disabled="onlyRead">
                                    <el-option v-for="(item,idx) in commodityCategoryArr" :key="idx" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="有效期" prop="date" >
                                <el-date-picker
                                    v-model="formList.date"
                                    type="daterange"
                                    range-separator="-"
                                    start-placeholder="开始日期"
                                    value-format="yyyy-MM-dd"
                                    :disabled="onlyRead"
                                    end-placeholder="结束日期" clearable>
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="货品类型" prop="goodsId">
                                <el-select v-model="formList.goodsId" clearable :disabled="onlyRead">
                                    <el-option label="定制" :value="0"></el-option>
                                    <el-option label="标品" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="6">
                            <el-form-item label="订单来源" prop="sourceIdArr">
                                <el-select v-model="formList.sourceIdArr" multiple collapse-tags clearable :disabled="onlyRead">
                                    <el-option v-for="(item,idx) in channelArr" :key="idx" :label="item.sourceName" :value="item.storeSourceId"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        <el-col :span="24">
                            <el-form-item label="备注" style="width:100%" clearable >
                                <el-input type="textarea" v-model="formList.remarks" :disabled="onlyRead"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div style="text-align:center">
                    <el-button size="medium" type="primary" @click="save" v-if="!onlyRead&&btnJurisdiction.save">保存</el-button>
                    <el-button size="medium" type="primary" @click="submit" v-if="!onlyRead&&btnJurisdiction.submit">提交</el-button>
                    <el-button size="medium" @click="goBack" v-if="!onlyRead">返回</el-button>
                </div>
            </div>
            <div class="m-top20">
                <div class="moduleHeader">
                    <h3 class="title">流程配置</h3>
                </div>
                <div class="m-top20">
                    <el-button class="button-96" size="small" @click="selectProcess" v-if="!onlyRead&&btnJurisdiction.selectionProcess">选择流程</el-button>
                    <div class="m-top20">
                        <el-table border :data="chooseProcessArr" :row-class-name="tableRowClassName">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column align="center" prop="orderProcessConfigureName" label="流程名称">
                                <template slot-scope="scope" >
                                    <div>
                                        <el-tooltip placement="right" visible-arrow v-if="!onlyRead">
                                            <div slot="content" class="tips tipFon" >
                                                <p class="operaItems" @click="moveUp(scope.row,scope.$index)">上移</p>
                                                <p class="operaItems" @click="moveDown(scope.row,scope.$index)">下移</p>
                                                <p class="operaItems" @click="deleteSelectProcess(scope.row,scope.$index)">删除</p>
                                            </div>
                                            <img :src="spot" alt="" class=" attributesTips">
                                        </el-tooltip>
                                        <p class="table_action_span" @click="isShowNode(scope.row)">{{scope.row.orderProcessConfigureName}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="isReturn" label="是否被退回">
                                <template slot-scope="scope">
                                    {{scope.row.isReturn==0?"否":"能"}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="isReturn" label="是否必填">
                                <template slot-scope="scope">
                                    {{scope.row.isMust==0?"否":"能"}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="remarks" label="备注"></el-table-column>
                            <el-table-column align="center" prop="remarks" label="选择节点任务" v-if="!onlyRead">
                                <template slot-scope="scope">
                                    <span class="table_action_span" v-if="btnJurisdiction.selectNode" @click="selectNode(scope.row)">选择节点任务</span>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
                <div class="m-top20" v-if="showNode">
                    <el-button class="button-96" size="small">选择节点</el-button>
                    <div class="m-top20">
                        <el-table border :data="nodeTable" :row-class-name="tableRowClassName">
                            <el-table-column align="center" type="index"></el-table-column>
                            <el-table-column align="center" prop="nodeName" label="节点名称">
                                <template slot-scope="scope" >
                                    <div>
                                        <el-tooltip placement="right" visible-arrow v-if="!onlyRead">
                                            <div slot="content" class="tips tipFon">
                                                <p class="operaItems" @click="nodeMoveUp(scope.row,scope.$index)">上移</p>
                                                <p class="operaItems" @click="nodeMoveDown(scope.row,scope.$index)">下移</p>
                                                <p class="operaItems" @click="deleteSelectNode(scope.row)">删除</p>
                                            </div>
                                            <img :src="spot" alt="" class=" attributesTips">
                                        </el-tooltip>
                                        <p>{{scope.row.nodeName}}</p>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="isReturn" label="是否被退回">
                                <template slot-scope="scope">
                                    {{scope.row.isReturn==0?"否":"能"}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="isReturn" label="是否必填">
                                <template slot-scope="scope">
                                    {{scope.row.isMust==0?"否":"能"}}
                                </template>
                            </el-table-column>
                            <el-table-column align="center" prop="remarks" label="备注"></el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </el-card>
        <el-dialog title="选择流程" :visible.sync="dialog" custom-class="customDialogTitle">
            <div>
                <div style="text-align:right">
                    <div style="display:inline-block;"><el-input clearable v-model="dialogProcessParams.orderProcessConfigureName" placeholder="选择流程"></el-input></div>
                    <el-button size="medium" class="button-fc" @click="searchProcess">查询</el-button> 
                </div>
                <div class="m-top20">
                    <el-table border :data="dialogProcessTable" @row-click="rowClick" ref="table" @selection-change="selectChange" :row-class-name="tableRowClassName">

                        <el-table-column align="center" type="selection" :selectable="checkSelectable"></el-table-column>
                        <el-table-column align="center" prop="orderProcessConfigureName" label="流程名称"></el-table-column>
                        <el-table-column align="center" prop="isReturn" label="是否被退回">
                            <template slot-scope="scope">  
                                <el-radio v-model="scope.row.isReturn" :label="1">是</el-radio>
                                <el-radio v-model="scope.row.isReturn" :label="0">否</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="isMust" label="是否必填">
                            <template slot-scope="scope">  
                                <el-radio v-model="scope.row.isMust" :label="1">是</el-radio>
                                <el-radio v-model="scope.row.isMust" :label="0">否</el-radio>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination_wrap">
                        <pagination
                        :current-page="dialogProcessParams.page"
                        :pageSize="dialogProcessParams.limit"
                        :total="totals.dialogProcessTotal"
                        @sizeChange="sizeChange"
                        @currentChange="currentChange">
                        </pagination>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogProcessSubmit">提 交</el-button>
                <el-button @click="dialog = false">取 消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="组织机构" :visible.sync="organizationDialogVisible" width="540px" custom-class="customDialogTitle">
            <div class="dialogBody">
                <el-tree
                :data="organizationTree"
                :props="defaultProps"
                @node-click="handleNodeClick"
                node-key="id"
                ref="organizationTree"
                auto-expand-parent
                check-strictly>
                </el-tree>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="selectOrganizationConfirm">确 定</el-button>
                <el-button @click="organizationDialogVisible = false">取 消</el-button>
            </div>
        </el-dialog>
        <el-dialog title="选择节点" :visible.sync="visible" custom-class="customDialogTitle">
            <div>
                <div style="text-align:right">
                    <div style="display:inline-block;"><el-input v-model="nodeParams.nodeName"></el-input></div>
                    <el-button size="medium" class="button-fc" @click="searchNode">查询</el-button> 
                </div>
                <div class="m-top20">
                    <el-table border :data="chooseNodeTable" @selection-change="nodeSelectData" :row-class-name="tableRowClassName">
                        <el-table-column align="center" type="selection" :selectable="nodeSelectTable"></el-table-column>
                        <el-table-column align="center" prop="nodeName" label="节点"></el-table-column>
                        <el-table-column align="center" prop="isReturn" label="是否被退回">
                            <template slot-scope="scope">  
                                <el-radio v-model="scope.row.isReturn" :label="1">是</el-radio>
                                <el-radio v-model="scope.row.isReturn" :label="0">否</el-radio>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="isMust" label="是否必填">
                            <template slot-scope="scope">  
                                <el-radio v-model="scope.row.isMust" :label="1">是</el-radio>
                                <el-radio v-model="scope.row.isMust" :label="0">否</el-radio>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="pagination_wrap">
                        <pagination
                        :current-page="dialogProcessParams.page"
                        :pageSize="dialogProcessParams.limit"
                        :total="totals.dialogProcessTotal"
                        @sizeChange="dialogNodeSize"
                        @currentChange="dialogNodePage">
                        </pagination>
                    </div>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogNodeSubmit">提 交</el-button>
                <el-button @click="visible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import breadcrumb from '@/views/components/breadcrumb';
import pagination from '@/views/components/pagination';
import spot from '@/assets/images/spot.png';
import { listCategory, listBrand, listBaseDict, listOrganization } from '@/api/pulicJava';
import { moveRelOrderProcessConfigure, addOrderProcess, addRelOrderProcessNodeConfigureDTO,listStoreSource, listOrderProcessConfigure, deleteRelOrderProcessNodeConfigure, listOrderProcessNodeConfigure, addRelOrderProcessConfigureDTO, updateOrderProcess, getOrderProcessVO, moveRelOrderProcessNodeConfigure, deleteRelOrderProcessConfigure } from '@/api/systemcenter/processModule';
import { getUUID } from "@/api/pulicJava"
export default {
    components:{
        breadcrumb,
        pagination,
    },
    created() {
        this.btnInit()
        if(this.$route.query.edit){
            this.orderProcessId=this.$route.query.orderProcessId;
            this.echo()
        }
        if(this.$route.query.onlyRead==true){
            this.onlyRead=true;
        }else{
             this.onlyRead=false;
        }
        listCategory().then(res=>{
            this.commodityCategoryArr=res.data;
        })
        listBrand().then(res=>{
            this.bandArr=res.data;
        })
        listStoreSource(
            {
                pid:0
            }
        ).then(res=>{
            this.channelArr=res.data.rows;
        })
        listOrganization().then(res=>{
            this.organizationTree=res.data;
        })
    },
    data(){
        return{
            navList:[],
            spot,
            dialog:false,
            visible:false,
            showNode:false,
            commodityCategoryArr:[],
            bandArr:[],
            channelArr:[],
            processDisable:false,
            onlyRead:false,
            organizationDialogVisible:false,
            organizationTree:[],
            defaultProps: {
                children: 'children',
                label: 'label'
            },
            data:[
                {
                    data:0
                },
                {
                    data:1
                }
            ],
            totals:{
                dialogProcessTotal:10,
            },
            chooseProcessArr:[],
            formList:{
                orderProcessName:"",
                organizationalId:"",
                organizationName:"",
                orderProcessStart:"",
                orderProcessEnd:"",
                goodsId:"",
                channelId:"",
                commodityCategoryIds:[],
                brandIds:[],
                remarks:"",
                date:[],
                status:0,
                sourceIdArr:[],
                sourceIds:''
            },
            dialogProcessParams:{
                orderProcessConfigureName:'',
                page:1,
                limit:10,
            },
            dialogProcessTable:[],
            rules:{
                orderProcessName:[
                    {
                        required:true,
                        message:'请输入流程名称',
                        trigger:"blur"
                    }
                ],
                organizationName:[
                    {
                        required:true,
                        message:'请选择组织机构',
                    }
                ],
                brandIds:[
                    {
                        required:true,
                        message:'请选择品牌',
                        trigger:"change"
                    }
                ],
                commodityCategoryIds:[
                    {
                        required:true,
                        message:'请选择品类',
                        trigger:"change"
                    }
                ],
                date:[
                    {
                        required:true,
                        message:'请选择时间',
                        trigger:"blur"
                    }
                ],
                goodsId:[
                    {
                        required:true,
                        message:'请选择货品类型',
                        trigger:"change"
                    }
                ],
                sourceIdArr:[
                    {
                        required:true,
                        message:'请选择订单流程',
                        trigger:"change"
                    }
                ]
            },
            status:0,
            orderProcessId:"",
            dialogProcessRowsData:[],
            chooseNodeTable:[],
            nodeParams:{
                page:1,
                limit:10,
                nodeName:""
            },
            nodeData:[],
            orderProcessConfigureId:'',
            nodeTable:[],
            orderProcessNodeConfigureVOS:[],
            flag:0,
            btnJurisdiction:{
                save:false,
                submit:false,
                selectionProcess:false,
                selectNode:false
            }
        }
    },
    mounted() {
        this.navList = this.$route.meta;
    },
    methods: {
        rowClick(row){
            this.$refs.table.toggleRowSelection(row)
        },
        btnInit(){
            this.btnJurisdiction.save=JSON.parse(this.$loca.getItem('element'))["processModule:btn_save"];
            this.btnJurisdiction.submit=JSON.parse(this.$loca.getItem('element'))["processModule:btn_submit"];
            this.btnJurisdiction.selectionProcess=JSON.parse(this.$loca.getItem('element'))["processModule:btn_selectionProcess"];
            this.btnJurisdiction.selectNode=JSON.parse(this.$loca.getItem('element'))["processModule:btn_selectNode"];
        },
        handleNodeClick(data) {
            this.organizationName = data.label;
            this.organizationalId = data.id;
        },
        selectOrganizationConfirm(){
            if (this.organizationalId) {
                this.formList.organizationName = this.organizationName;
                this.formList.organizationalId = this.organizationalId;
                this.organizationDialogVisible = false;
                return;
            }
            this.$message.warning('请选择组织机构');
        },
        focusIpts(){
            this.organizationDialogVisible = true;
        },
        changeOrganization(){
            this.organizationName="";
            this.organizationalId="";
            this.formList.organizationalId="";
            this.formList.organizationName="";
        },
        tableRowClassName({ row, rowIndex }) {//斑马线
            return rowIndex % 2 != 0 ? 'el-f0' : '';
        },
        deleteSelectProcess(val){//选择流程删除功能
            deleteRelOrderProcessConfigure(
                {
                    orderProcessId:this.orderProcessId,
                    relOrderProcessConfigureId:val.relOrderProcessConfigureId
                }
            ).then(res=>{
                this.$message({
                    showClose: true,
                    message: '删除成功',
                    type: 'success'
                });
                this.echo()
            })
        },
        selectProcess(){ //选择流程按钮
            this.$refs.formList.validate((valid) => {
                if (valid) {
                    this.formList.status=0;
                    if(this.$route.query.edit){
                        this.editQuery()
                    }else{
                        this.status=1;
                        if(this.flag==0){
                            this.flag=1;
                            this.processMessage();
                        }else{
                            this.editQuery()
                        }
                    }
                    this.dialogProcess(true);
                } else {
                    return false;
                }
            });  
        },
        editQuery(val){//流程基本信息编辑接口
            updateOrderProcess(
                {
                    orderProcessId:this.$route.query.orderProcessId,
                    orderProcessName:this.formList.orderProcessName,
                    organizationalId:this.formList.organizationalId,
                    orderProcessStart:this.formList.date[0],
                    orderProcessEnd:this.formList.date[1],
                    goodsId:this.formList.goodsId,
                    channelId:this.formList.channelId,
                    commodityCategoryIds:this.formList.commodityCategoryIds.join(","),
                    brandIds:this.formList.brandIds.join(","),
                    status:this.formList.status,
                    remarks:this.formList.remarks,
                    sourceIds:this.formList.sourceIdArr.join(",")
                }
            ).then(res=>{
                this.$message({
                    showClose: true,
                    message: '编辑成功',
                    type: 'success'
                });
                if(val){
                    this.$router.push({
                        path:'processModule'
                    })
                }
            })
        },
        checkSelectable(row,idx){//选择流程多选框禁用功能
            if(this.chooseProcessArr.length){
                let arr=[];
                let brr=[];
                this.chooseProcessArr.map((item,index)=>{
                    arr.push(item.orderProcessConfigureId)
                })
                if(arr.indexOf(row.orderProcessConfigureId)!=-1){
                    brr.push(row.orderProcessConfigureId);
                    return false;
                }else{
                    return true
                }
            }else{
                return true;
            }   
        },
        dialogProcess(flag){ //选择流程弹窗表格请求方法
            listOrderProcessConfigure(
                this.dialogProcessParams
            ).then(res=>{
                if(flag){
                    this.dialog=true;
                }
                this.dialogProcessTable=res.data.rows;
                this.totals.dialogProcessTotal=res.data.total;
            })
        },
        searchProcess(){  //选择流程弹窗查询按钮
            this.dialogProcessParams.page = 1;
            this.dialogProcess();
        },
        sizeChange(val){//选择流程换数据量
            this.dialogProcessParams.page = 1;
            this.dialogProcessParams.limit = val;
            this.dialogProcess()
        },
        currentChange(val) {//换页
            this.dialogProcessParams.page = val;
            this.dialogProcess()
        },
        selectChange(val){//选择流程多选框操作功能
            this.dialogProcessRowsData=val;
        },
        dialogProcessSubmit(){//选择流程提交按钮
            if(this.dialogProcessRowsData.length){
                let arr=[]
                this.dialogProcessRowsData.map((item,idx)=>{
                    let obj={
                        orderProcessConfigureId:item.orderProcessConfigureId,
                        isMust:item.isMust,
                        isReturn:item.isReturn,
                    }
                    arr.push(obj)
                })
                addRelOrderProcessConfigureDTO(
                    {
                        orderProcessId:this.orderProcessId,
                        relOrderProcessConfigures:arr
                    }
                ).then(res=>{
                    this.dialog=false;
                    this.echo()
                })
            }else{
                this.$message({
                    message: '请选择后再进行提交',
                    type: 'warning'
                });
            }
            
        },
        processMove(val,index,status){//流程配置上移下移公共接口
            moveRelOrderProcessConfigure(
                {
                    orderProcessId:this.orderProcessId,
                    move:status,
                    sortNo:index,
                    relOrderProcessConfigureId:val.relOrderProcessConfigureId
                }
            ).then(res=>{
                this.echo()
                this.processDisable=false;
                this.$message({
                    showClose: true,
                    message: '操作成功',
                    type: 'success'
                });
            })
        },
        moveUp(val,index){//流程配置上移
            if(val.sortNo==1){
                this.$message({
                    message: '不可上移',
                    type: 'warning'
                });
            }else{
                this.processDisable=true;
                this.processMove(val,val.sortNo,0)
            }
        },
        moveDown(val,index){//流程配置下移
            if(val.sortNo==this.chooseProcessArr.length){
                this.$message({
                    message: '不可下移',
                    type: 'warning'
                });
            }else{
                this.processDisable=true;
                this.processMove(val,val.sortNo,1)
            }
            
        },

        nodeQuery(){//选择节点列表接口
            listOrderProcessNodeConfigure(
                this.nodeParams
            ).then(res=>{
                this.chooseNodeTable=res.data.rows;
                this.totals.dialogProcessTotal=res.data.total;
            })
        },
        nodeSelectData(val){//选择节点选择框点击操作
            this.nodeData=val
        },
        dialogNodeSize(val){//选择节点数据量切换操作
            this.nodeParams.limit=val;
            this.nodeParams.page=1;
            this.nodeQuery()
        },
        dialogNodePage(val){//选择节点换页操作
            this.nodeParams.page=val;
            this.nodeQuery()
        },
        searchNode(){//选择节点搜索功能
            this.nodeParams.page=1;
            this.nodeQuery()
        },
        selectNode(val){//流程配置点击选择节点
            this.orderProcessNodeConfigureVOS=val.orderProcessNodeConfigureVOS;
            this.visible=true;
            this.orderProcessConfigureId=val.orderProcessConfigureId;
            this.nodeQuery()
        },
        dialogNodeSubmit(){ //选择节点提交功能
            if(this.nodeData.length){
                this.showNode=true;
                this.visible=false;
                let arr=[]
                this.nodeData.map((item,idx)=>{
                    let obj={
                        orderProcessNodeConfigureId:item.orderProcessNodeConfigureId,
                        isMust:item.isMust
                    }
                    arr.push(obj)
                })
                addRelOrderProcessNodeConfigureDTO(
                    {
                        orderProcessId:this.orderProcessId,
                        orderProcessConfigureId:this.orderProcessConfigureId,
                        relOrderProcessNodeConfigures:arr,
                    }
                ).then(res=>{
                    this.echo()
                })
            }else{
                this.$message({
                    message: '请选择后再进行提交',
                    type: 'warning'
                });
            }
            
        },
        nodeSelectTable(row,idx){//选择节点，checkbox禁用功能
            if(this.orderProcessNodeConfigureVOS!=null&&this.orderProcessNodeConfigureVOS.length){
                let arr=[]
                this.orderProcessNodeConfigureVOS.map((item,index)=>{
                    arr.push(item.orderProcessNodeConfigureId)
                })
                if(arr.indexOf(row.orderProcessNodeConfigureId)!=-1){
                    return false;
                }else{
                    return true
                }
            }else{
                return true;
            }   
        },
        isShowNode(val){ //流程名称点击事件
            this.showNode=true;
            this.nodeTable=val.orderProcessNodeConfigureVOS;
            this.orderProcessConfigureId=val.orderProcessConfigureId
        },
        nodeMoveQuery(val,index,status){
            moveRelOrderProcessNodeConfigure(
                {
                    orderProcessId:this.orderProcessId,
                    orderProcessConfigureId:this.orderProcessConfigureId,
                    relOrderProcessNodeConfigureId:val.relOrderProcessNodeConfigureId,
                    sortNo:index,
                    move:status
                }
            ).then(res=>{
                this.echo()
                this.$message({
                    showClose: true,
                    message: '操作成功',
                    type: 'success'
                });
            })
        },
        nodeMoveUp(val,index){//节点上移
            if(val.sortNo==1){
                this.$message({
                    message: '不可上移',
                    type: 'warning'
                });
            }else{
                this.nodeMoveQuery(val,val.sortNo,0)
            }
        },
        nodeMoveDown(val,index){ //节点下移
            if(this.nodeTable.length==val.sortNo){
                this.$message({
                    message: '不可下移',
                    type: 'warning'
                });
            }else{
                this.nodeMoveQuery(val,val.sortNo,1)
            }
            
        },
        deleteSelectNode(val){//节点删除
            deleteRelOrderProcessNodeConfigure(
                {
                    orderProcessId:this.orderProcessId,
                    relOrderProcessNodeConfigureId:val.relOrderProcessNodeConfigureId,
                    orderProcessConfigureId:this.orderProcessConfigureId
                }
            ).then(res=>{
                this.echo()
            })
        },
        processMessage(val){  //保存和提交的公共方法
            this.formList.orderProcessStart=this.formList.date[0]
            this.formList.orderProcessEnd=this.formList.date[1];
            if(this.formList.brandIds instanceof Array){
                this.formList.brandIds=this.formList.brandIds.join(",");
            }
            if(this.formList.commodityCategoryIds instanceof Array){
                this.formList.commodityCategoryIds=this.formList.commodityCategoryIds.join(",")
            }
            this.formList.sourceIds=this.formList.sourceIdArr.join(",")

            let obj=Object.assign({},this.formList);
            getUUID({
                serialNumber:"PRO"
            }).then(resion=>{
                obj.orderProcessNumber=resion.data;
                addOrderProcess(
                    obj
                ).then(res=>{
                    this.orderProcessId=res.data.orderProcessId;
                    this.formList.brandIds=this.formList.brandIds.split(",");
                    this.formList.commodityCategoryIds=this.formList.commodityCategoryIds.split(",");
                    if(val){
                        this.$router.push({
                            path:'processModule'
                        })
                        if(val==1){
                            this.$message({
                                message: '保存成功',
                                type: 'success'
                            });
                        }else if(val==2){
                            this.$message({
                                message: '提交成功',
                                type: 'success'
                            });
                        }
                    }
                    
                })
            })
            
        },
        echo(){ //回显方法
            getOrderProcessVO(
                {
                    orderProcessId:this.orderProcessId
                }
            ).then(res=>{
                let arr=[];
                this.formList.orderProcessName=res.data.orderProcessName;
                this.formList.organizationalId=res.data.organizationalId;
                this.formList.date.push(res.data.orderProcessStart,res.data.orderProcessEnd)
                this.formList.goodsId=res.data.goodsId;
                this.formList.channelId=res.data.channelId;
                this.formList.commodityCategoryIds=res.data.commodityCategoryIds.split(",");
                this.formList.brandIds=res.data.brandIds.split(",");
                this.formList.remarks=res.data.remarks;
                this.formList.organizationName=res.data.organizationalName;
                this.chooseProcessArr=res.data.orderProcessConfigureVOS;
                this.organizationName=res.data.organizationalName;
                this.organizationalId=res.data.organizationalId;
                arr=res.data.sourceIds.split(",")
                arr.map((item,idx)=>{
                    this.formList.sourceIdArr.push(Number(item))
                })
                
                if(this.chooseProcessArr.length){
                    this.chooseProcessArr.map((item,idx)=>{
                        if(this.orderProcessConfigureId==item.orderProcessConfigureId){
                            this.nodeTable=this.chooseProcessArr[idx].orderProcessNodeConfigureVOS
                        }
                    })
                }
            })
        },
        save(){//流程信息保存按钮
            this.$refs.formList.validate((valid) => {
                if (valid) {
                    this.formList.status=0;
                    if(this.$route.query.edit){
                        this.editQuery(1)
                    }else{
                        if(this.status==1){
                            this.editQuery(1)
                        }else{
                            
                            this.processMessage(1);
                        }
                    }
                    this.$router.push({
                        path:'processModule'
                    })
                } else {
                    return false;
                }
            });
        },
        submit(){//流程基本信息提交按钮
            this.$refs.formList.validate((valid) => {
                if (valid) {
                    this.formList.status=1;
                    if(this.$route.query.edit){
                        this.editQuery(1)
                    }else{
                        if(this.status==1){
                            this.editQuery(1)
                        }else{
                            this.processMessage(2);
                        }
                    }
                    
                } else {
                    return false;
                }
            });
        },
        goBack(){
            this.$router.push({
                path:'processModule'
            })
        },
    },
}
</script>
<style scoped>

</style>
