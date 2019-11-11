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
                        <el-input size="medium" placeholder="名称" clearable v-model="formList.text"></el-input>
                    </el-col>
                    <el-col :span="span" >
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
                        <el-select v-model="formList.status" size="medium">
                            <el-option label="不可用" :value="0"></el-option>
                            <el-option label="可用" :value="1"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="span">
                        <el-select v-model="formList.supplierId" size="medium">
                            <el-option v-for="(item,idx) in supplierId" :key="idx" :label="item.companyName" :value="item.companyId"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="span">
                        <el-select v-model="formList.brandId" size="medium">
                            <el-option v-for="(item,idx) in listBrand" :key="idx" :label="item.brandName" :value="item.brandId"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="span">
                        <el-select v-model="formList.categoryId" size="medium">
                            <el-option v-for="(item,idx) in listCategory" :key="idx" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="span">
                        <el-button size="medium" class="button-fc" type="warning" @click="search">查询</el-button>
                        <el-button size="medium" type="primary" @click="reset">重置</el-button>
                    </el-col>
                </el-row>
            </div>
        </el-card>
        <el-card class="m-top20">
            <div>
                <div class="btnList">
                    <el-button size="small" class="button-96" v-if="btnJurisdiction.add" @click="operation">新增</el-button>
                    <el-button size="small" class="button-96" v-if="btnJurisdiction.edit" @click="editFile">编辑</el-button>
                    <el-button size="small" class="button-96" v-if="btnJurisdiction.delete" @click="deleFile">删除</el-button>
                </div>
                <div class="lvs">
                    <el-table
                    border
                    style="width: 100%"
                    :row-class-name="tableRowClassName"
                    @selection-change="chooseDelete"
                    :data="tableData">
                        <el-table-column
                            align="center"
                            type="selection">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="aogName"
                        show-overflow-tooltip
                        label="名称">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="brandName"
                        label="品牌">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        prop="categoryName"
                        show-overflow-tooltip
                        label="品类">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="companyName"
                        label="供应商">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="status"
                        label="状态">
                        <template slot-scope="scope">
                            {{scope.row.status==0?"启动":"禁止"}}
                        </template>
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="createTime"
                        label="生效时间">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="createName"
                        label="创建人">
                        </el-table-column>
                        <el-table-column
                        align="center"
                        show-overflow-tooltip
                        prop="remarks"
                        label="备注">
                        </el-table-column>
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
        <div class="Alerts">
            <el-dialog
                :visible.sync="dialogVisible"
                width="900px"
                :before-close="handleClose"
                @close="close"
                title="新增模板" custom-class="customDialogTitle">
                <div>
                    <div class="queryForm">
                        <el-form :model="formInline" class="demo-form-inline" label-width="140px" :rules="rules" ref="form">
                            <el-form-item label="到货单模板名称：" prop="name" style="width:48%;display:inline-block">
                                <el-input type="text" class="ipts" v-model="formInline.name"></el-input>
                            </el-form-item>
                            <el-form-item label="供应商：" prop="supplierId" style="width:48%;display:inline-block">
                                <el-select v-model="formInline.supplierId"  placeholder="选择" class="form-selects" @change="supChange" style="width:100%">
                                    <el-option v-for="(item,idx) in supplierId" :key="idx" :label="item.companyName" :value="item.companyId"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="品牌：" prop="brandId" style="width:48%;display:inline-block">
                                <el-select v-model="formInline.brandId" placeholder="选择" class="form-selects" style="width:100%">
                                    <el-option v-for="(item,idx) in listBrand" :key="idx" :label="item.brandName" :value="item.brandId"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="品类：" prop="categoryId" style="width:48%;display:inline-block">
                                <el-select v-model="formInline.categoryId" placeholder="选择" class="form-selects" @change="categoryChange" style="width:100%">
                                    <el-option v-for="(item,idx) in listCategory" :key="idx" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="状态：" prop="status" style="width:48%;display:inline-block">
                                <el-select v-model="formInline.status" placeholder="选择" class="form-selects" style="width:100%">
                                    <el-option label="启用" value="0"></el-option>
                                    <el-option label="停用" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="商场码：" prop="storeYards" style="width:48%;display:inline-block">
                                <el-input placeholder="请输入商场码" v-model="formInline.storeYards"></el-input>
                            </el-form-item>
                            <el-form-item label="入库形式：" prop="isArrivalNotice" style="width:48%;display:inline-block">
                                <el-radio v-model="formInline.isArrivalNotice" :label="0">商品列表</el-radio>
                                <el-radio v-model="formInline.isArrivalNotice" :label="1">模板</el-radio>
                            </el-form-item>
                            <el-form-item label="入库方式：" prop="isWay" style="width:48%;display:inline-block">
                                <el-radio v-model="formInline.isWay" :label="0">执行完成</el-radio>
                                <el-radio v-model="formInline.isWay" :label="1">导入到到货单</el-radio>
                            </el-form-item>
                            <el-form-item label="备注：">
                                <el-input type="textarea" v-model="formInline.remarks"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="tableBottom">
                        <div class="clearfloat center">
                            <div class="labels">
                                <label>模板字段</label>
                                <div class="addMinus clearfloat">
                                    <div class="add" @click="add">+</div>
                                    <div class="minus" @click="minus">-</div>
                                </div>
                            </div>
                        </div>
                        <div class="tableChange">
                            <el-table
                            border
                            style="width: 100%"
                            :data="tableDataMark"
                            @selection-change="chooseDeletes">
                                <el-table-column
                                align="center"
                                type="selection">
                                </el-table-column>
                                <el-table-column
                                align="center"
                                prop="unpackingId"
                                label="字段项名称">
                                <template slot-scope="scope">
                                    <el-select v-model="scope.row.unpackingId" placeholder="选择" @change="fieldChange(scope.row,scope.$index)">
                                        <el-option v-for="(item,idx) in tableSelect" :key="idx" :label="item.unpackingName" :value="item.unpackingId"></el-option>
                                    </el-select>
                                </template>
                                </el-table-column>
                                <el-table-column
                                align="center"
                                prop="isEmpty"
                                label="允许为空">
                                <template slot-scope="scope">
                                    <el-radio :label="0" v-model="scope.row.isEmpty" @change="clickRadio(scope.row)">是</el-radio>
                                    <el-radio :label="1" v-model="scope.row.isEmpty" @change="clickRadio(scope.row)">否</el-radio>
                                </template>
                                </el-table-column>
                                <el-table-column
                                align="center"
                                prop="isColumn"
                                label="列项">
                                    <template slot-scope="scope">
                                        <div>
                                            <el-radio v-model="scope.row.isColumn" @change="isColumn(scope.row)" :label="0">否</el-radio>
                                            <el-radio v-model="scope.row.isColumn" @change="isColumn(scope.row)" :label="1">是</el-radio>
                                        </div>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                align="center"
                                prop="importName"
                                label="导入名称">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.importName" @blur="keyRemark(scope.row)"></el-input>
                                </template>
                                </el-table-column>
                                <el-table-column
                                align="center"
                                prop="remarks"
                                label="备注">
                                <template slot-scope="scope">
                                    <el-input v-model="scope.row.remarks" @blur="keyRemark(scope.row)"></el-input>
                                </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div class="btns">
                        <el-button type="primary" @click="onSubmit">提交</el-button>
                        <el-button @click="dialogVisible=false;tableDataMark=[];id=0">取消</el-button>
                    </div>
                </div>
            </el-dialog>
        </div>
        
    </div>
</template>
<script>
import { getNames } from '../../../utils/pubilcFn'
import { pageTable,getUnpackingDataList, addAog, getById, listById, editAog, deleteAog } from 'api/entrepotSet/receiptManagement/index';
import { listCompanyByAll, listBrand, listCategory } from 'api/pulicJava';
import breadcrumb from "../../components/breadcrumb";
import pagination from '@/views/components/pagination'
export default {
    data(){
        return {
            flag:false,
            navList:[],
            aogName:[],
            radios:"0",
            span:6,
            formInline:{
                supplierId:"",
                brandId:"",
                categoryId:"",
                status:"",
                region:"",
                name:'',
                remarks:'',
                storeYards:'',
                isArrivalNotice:0,
                isWay:0,
            },
            title:"新增模板",
            dialogVisible:false,
            total:0,
            tableData:[
            ],
            tableDataMark:[
            ],
            chooseArr:[],
            supplierId:[],
            listBrand:[],
            listCategory:[],
            formData:{
                supplierId:"",
                brandId:"",
                categoryId:"",
                status:"",
            },
            id:0,
            tableSelect:[],
            choseRows:[],
            addTemplatelist:[],
            delList:[],
            editList:[],
            date:[],
            formList:{
                page:1,
                limit:10,
                status:"",
                text:"",
                startTime:null,
                endTime:null,
                supplierId:"",
                brandId:"",
                categoryId:""
            },
            btnJurisdiction:{
                add:false,
                edit:false,
                delete:false,
            },
            rules:{
                supplierId:[
                    {
                        required:true
                    }
                ],
                name:[
                    {
                        required:true
                    }
                ],
                brandId:[
                    {
                        required:true
                    }
                ],
                categoryId:[
                    {
                        required:true,
                    }
                ],
                status:[
                    {
                        required:true,
                    }
                ],
                isArrivalNotice:[
                    {
                        required:true,
                    }
                ],
                isWay:[
                    {
                        required:true,
                    }
                ]
            }
        }
    },
    components: {
        breadcrumb,
        pagination
    },
    // created(){
    //     this.aogName=getNames('aogName',this.tableData)
    // },
    // mounted() {
    //     this.btnInit()
    //     this.navList=this.$route.meta;;
    //     this.pages()
    //     listCompanyByAll(
    //         {
    //             companyType:1
    //         }
    //     ).then(res=>{
    //         this.supplierId=res.data
    //     })
    //     listBrand().then(res=>{
    //         this.listBrand=res.data
    //     })
    //     listCategory().then(res=>{
    //         this.listCategory=res.data;
    //     })
    // },
    activated(){
        this.aogName=getNames('aogName',this.tableData)
        this.btnInit()
        this.navList=this.$route.meta;;
        this.pages()
        listCompanyByAll(
            {
                companyType:1
            }
        ).then(res=>{
            this.supplierId=res.data
        })
        listBrand().then(res=>{
            this.listBrand=res.data
        })
        listCategory().then(res=>{
            this.listCategory=res.data;
        })
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    methods:{
        btnInit(){
            this.btnJurisdiction.add=JSON.parse(this.$loca.getItem('element'))["receiptManagement:btn_add"];
            this.btnJurisdiction.edit=JSON.parse(this.$loca.getItem('element'))["receiptManagement:btn_edit"];
            this.btnJurisdiction.delete=JSON.parse(this.$loca.getItem('element'))["receiptManagement:btn_delete"];
        },
        reset(){
            this.formList.text="";
            this.formList.startTime=null;
            this.formList.endTime=null;
            this.formList.supplierId="";
            this.formList.brandId="";
            this.formList.categoryId="";
            this.date=[];
            this.pages()
        },
        search(){
            this.formList.page=1;
            this.pages()
        },
        close(){
            for(let i in this.formInline){
                this.formInline[i]="";
            }
            this.formInline.isArrivalNotice=0;
            this.formInline.isWay=0;
            this.tableDataMark=[];
        },
        fuc(val){
            if(val.isOriginal==true){
                if(this.editList.length!=0){
                    this.editList.map((item,idx)=>{
                        if(val.aogTemplateId!=item.aogTemplateId){
                            this.editList.push(val);
                        }else{
                            this.editList.splice(idx,1);
                            this.editList.push(val);
                        }
                    })
                }else{
                    this.editList.push(val)
                }
            }
        },
        pages(){
            this.formList.startTime=this.date[0]
            this.formList.endTime=this.date[1]
            pageTable(
                this.formList
            ).then(res=>{
                this.tableData=res.data.rows;
                this.total=res.data.total;
                
            })
        },
        sizeChange(val){
            this.formList.limit=val;
            this.formList.page=1;
            this.pages()
        },
        currentChange(val){
            this.formList.page=val;
            this.pages()
        },
        isColumn(val){
            this.fuc(val)
        },
        fieldChange(val,index){
            this.fuc(val)
        },
        keyRemark(val){
            this.fuc(val)
        },
        clickRadio(val){
            this.fuc(val)
        },
        categoryChange(val){
            getUnpackingDataList({
                categoryId:val
            }).then(res=>{
                this.tableSelect=res.data;
            })
        },
        chooseDeletes(val){
            this.chooseArr=val;
        },
        add(){
            this.id++;
            this.tableDataMark.push({
                unpackingId:"",
                isEmpty:0,
                remarks:'',
                importName:'',
                id:this.id,
                isColumn:0,
            })
            this.addTemplatelist.push({
                unpackingName:'',
                unpackingId:"",
                isEmpty:0,
                remarks:'',
                id:this.id,
                isColumn:0,
            })
        },
        deleFile(){
            if(this.choseRows.length!=0){
                this.$confirm('是否删除?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let arr=[];
                    this.choseRows.map((item,idx)=>{
                        arr.push(item.aogId)
                    })
                    deleteAog({
                        delAogList:arr
                    }).then(res=>{
                    this.pages()
                    this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });          
                });
            }else{
                this.$message({
                    message: '请选择后再进行删除',
                    type: 'warning'
                });
            }
        },
        minus(){
            if(this.flag){
                for(var i=0;i<this.chooseArr.length;i++){
                  for(var j=0;j<this.tableDataMark.length;j++){
                    if(this.tableDataMark[j].id==this.chooseArr[i].id){
                      let arr=this.tableDataMark.splice(j,1);
                      j=j-1;
                      
                      if(arr[0].isOriginal){
                          let obj={
                              aogTemplateId:arr[0].aogTemplateId
                          };
                          this.delList.push(obj);
                      }
                      
                    }
                  }
                } 
            }else{
                for(var i=0;i<this.chooseArr.length;i++){
                  for(var j=0;j<this.tableDataMark.length;j++){
                    if(this.tableDataMark[j].id==this.chooseArr[i].id){
                      this.tableDataMark.splice(j,1);
                      j=j-1;
                    }
                  }
                } 
            }
            
        },
        supChange(val){
            // this.formData.supplierId=val;
            // let data=this.supplierId.find(item=>{
            //     return item.companyId==val
            // })
        },
        operation(val){
            this.dialogVisible=true;
            this.flag=false;
        },
        editFile(){
            if(this.choseRows.length==0){
                this.$message({
                    message: '请选择候再进行编辑',
                    type: 'warning'
                });
            }else if(this.choseRows.length>1){
                this.$message({
                    message: '只能选择一条进行编辑',
                    type: 'warning'
                });
            }else{
                for(let i in this.formInline){
                    this.formInline[i]="";
                }
                this.tableDataMark=[];
                this.dialogVisible=true;
                this.flag=true;
                listCompanyByAll(
                    {
                        companyType:1
                    }
                ).then(res=>{
                    this.supplierId=res.data;
                })
                listBrand().then(res=>{
                    this.listBrand=res.data;
                })
                listCategory().then(res=>{
                    this.listCategory=res.data;
                })
                getById(
                    {
                        aogId:this.choseRows[0].aogId
                    }
                ).then(res=>{
                    this.formInline.supplierId=res.data.supplierId
                    this.formInline.brandId=String(res.data.brandId);
                    this.formInline.categoryId=String(res.data.categoryId);
                    this.formInline.status=String(res.data.status);
                    this.formInline.name=res.data.aogName;
                    this.formInline.remarks=res.data.remarks;
                    this.formInline.isWay=res.data.isWay;
                    this.formInline.isArrivalNotice=res.data.isArrivalNotice;
                    this.formInline.storeYards=res.data.storeYards;
                })
                
                getUnpackingDataList({
                    categoryId:this.choseRows[0].categoryId
                }).then(res=>{
                    this.tableSelect=res.data;
                })
                listById(
                    {
                        aogId:this.choseRows[0].aogId
                    }
                ).then(res=>{
                    res.data.map((item,idx)=>{
                        this.tableDataMark.push({
                            unpackingId:item.unpackingId,
                            isEmpty:item.isEmpty,
                            remarks:item.remarks,
                            aogTemplateId:item.aogTemplateId,
                            status:item.status,
                            importName:item.importName,
                            id:idx*Date.parse(new Date()),
                            isColumn:item.isColumn,
                            isOriginal: true
                        })
                    })
                })
                
            }
        },
        chooseDelete(val){
            this.choseRows=val;
            
        },
        handleClose(done) {
            this.$confirm('确认关闭？').then(_ => {
                done();
            }).catch(_ => {

            });
        },
        onSubmit(){
            this.$refs.form.validate((valid) => {
                if (valid) {
                    if(this.flag){
                            this.addTemplatelist = this.tableDataMark.filter(item => {
                                return !item.isOriginal;
                            })
                            this.addTemplatelist.forEach(item => {
                                item.aogTemplateName = this.tableSelect.filter(item2 => {
                                    return item2.unpackingId == item.unpackingId
                                })[0].unpackingName;
                            })
                            this.editList.forEach(item => {
                                item.aogTemplateName = this.tableSelect.filter(item2 => {
                                    return item2.unpackingId == item.unpackingId
                                })[0].unpackingName;
                                
                            })
                            editAog(
                                {
                                    aogId:this.choseRows[0].aogId,
                                    aogName:this.formInline.name,
                                    supplierId:this.formInline.supplierId,
                                    brandId:this.formInline.brandId,
                                    categoryId:this.formInline.categoryId,
                                    status:this.formInline.status,
                                    remarks:this.formInline.remarks,
                                    addTemplatelist:this.addTemplatelist,
                                    editTemplatelist:this.editList,
                                    isArrivalNotice:this.formInline.isArrivalNotice,
                                    isWay:this.formInline.isWay,
                                    delList:this.delList,
                                    storeYards:this.formInline.storeYards,
                                }
                            ).then(res=>{
                                this.editList=[];
                                this.dialogVisible=false;
                                this.pages()
                                this.$message({
                                    message: '编辑成功',
                                    type: 'success'
                                });
                            })
                    }else{
                        let addTemplatelist=[]
                        if(this.tableDataMark.length!=0){
                            this.tableDataMark.map((item,idx)=>{
                                let obj={
                                    aogTemplateName:this.addTemplatelist[idx].unpackingName,
                                    unpackingId:item.unpackingId,
                                    isEmpty:item.isEmpty,
                                    remarks:item.remarks,
                                    importName:item.importName,
                                    isColumn:item.isColumn,
                                };
                                addTemplatelist.push(obj)
                            })
                            console.log(this.tableSelect)
                            addTemplatelist.forEach(item => {
                                item.aogTemplateName = this.tableSelect.filter(item2 => {
                                    return item2.unpackingId == item.unpackingId
                                })[0].unpackingName;
                            })
                        }
                        if(addTemplatelist.length){
                            addAog({
                                aogName:this.formInline.name,
                                supplierId:this.formInline.supplierId,
                                brandId:this.formInline.brandId,
                                categoryId:this.formInline.categoryId,
                                status:this.formInline.status,
                                remarks:this.formInline.remarks,
                                addTemplatelist:addTemplatelist,
                                isArrivalNotice:this.formInline.isArrivalNotice,
                                storeYards:this.formInline.storeYards,
                                isWay:this.formInline.isWay,
                            }).then(res=>{
                                this.pages()
                                this.$message({
                                    message: '新增成功',
                                    type: 'success'
                                });
                                this.dialogVisible=false;
                            })
                        }else{
                            this.$message({
                                message: '请添加模板字段',
                                type: 'warning'
                            });
                        }
                        
                    }
                } else {
                
                    return false;
                }
            });
            
        },
        filterHandler(value, row, column){
            const property = column['property'];
            return row[property] === value;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
    },
    
    
}
</script>
<style scoped>
    .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
    .clearfloat{zoom:1}
    /* .clearfloat>div{
        float: left;
    }
    .clearfloat>div:nth-child(2){
        float: right;
    } */
    .btns{
        width: 100%;
        display: flex ;
        justify-content: center;
        align-items: center;
        margin-top:20px;
    }
    .center{
        margin-bottom:15px;
    }
    .formList{
        border-bottom:1px solid #e5e5e5;
        padding-left: 20px;
        padding-bottom:15px;
    }
    .ipts:focus{
        border-color:#409eff;
    }
    .tableBottom{
        margin-top:20px;
        padding:0 25px 0 20px;
    }
    .title{
        height: 30px;
        color:#006ec5;
        padding-left:20px;
        font-size: 15px;
        display: flex;
        align-items: center;
    }
    .title>span:nth-child(1){
        display: inline-block;
        width: 3px;
        height: 15px;
        background:#006ec5;
    }
    .title>span:nth-child(2){
        display: inline-block;
        margin-left:7px;
    }
    .labels{
        height: 100%;
        line-height: 44px;
        display: flex;
        align-items: center;
    }
    .btnList{
        margin-bottom:20px;
    }
    .add,.minus{
        width: 16px;height: 16px;
        float: left;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 50%;
        background: #54a9ea;
        color:#fff;
        margin-left:15px;
    }
    .maxRightt{
        width: 40%;
        margin: 0;
    }
    .maxRightt:nth-child(4){
        padding-left:15px;
    }
    .maxRightt:nth-child(6){
        padding-left:15px;
    }
    .maxLeft{
        width: 58%;
        margin:0;
    }
    #labelPadding{
        padding-left:70px;
    }
    .typePadding{
        padding-left:12px;
    }
    .demo-form-inline>div{
        margin-bottom:7px;
    }
</style>