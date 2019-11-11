<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card>
            <div class="clearfix">
                <div class="fl">
                    <el-upload
                        action="string"
                        :show-file-list="false"
                        :http-request="uploadSectionFile"
                        style="display:inline-block"
                        v-loading="btnLoading"
                    >
                        <el-button class="button-96" size="small">导入采购单</el-button>
                    </el-upload>
                    <span v-if="showText">{{text}}</span>
                </div>
                <!-- <div v-if="status" style="width:500px;height:32px;align-items: center;display:flex;justify-content:space-between;margin-left:50px;" class="fl">
                    <span>
                        验证结果：{{Num.allSize}}
                    </span>
                    <span>
                        成功：{{Num.okSize}}
                    </span>
                    <span>
                        失败：{{Num.errorSize}}
                    </span>
                    <span>
                        需要处理：{{Num.needSize}}
                    </span>
                </div> -->
            </div>
        </el-card>
        <el-tabs type="border-card" class="m-top20" v-show="status" @tab-click="tabClick">
            <el-tab-pane label="需要处理">
                <el-button :loading="loading" v-if="purchaseOrderBatchId" class="button-96" size="medium" type="small" @click="confirm">完成对账</el-button>
                <needToSettle @rowsData="changeRows" :tableObj="tableObj" :updatas="updatas" :purchaseOrderBatchId="purchaseOrderBatchId"></needToSettle>
            </el-tab-pane>
            <el-tab-pane label="失败">
                <defeate :tableObj="tableObj" :purchaseOrderBatchId="purchaseOrderBatchId"></defeate>
            </el-tab-pane>
            <!-- <el-tab-pane label="成功">
                <success :tableObj="tableObj" :purchaseOrderBatchId="purchaseOrderBatchId"></success>
            </el-tab-pane> -->
            <el-tab-pane label="重复">
                <repetition :tableObj="tableObj" :purchaseOrderBatchId="purchaseOrderBatchId"></repetition>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import breadcrumb from "@/views/components/breadcrumb";
import pagination from '@/views/components/pagination';
import needToSettle from "./table/needToSettle";
import defeate from './table/defeat';
import success from './table/success';
import repetition from './table/repetition';
import { put } from '@/utils/pubilcFn';
import {getCheckPurchaseOrderData, savePurchaseOrderData, importPurchaseOrderBatch, listPurchaseOrderBatchDataFailVO, listPurchaseDataVO, listPurchaseOrderBatchDataSuccess, listRepeatPurchaseDataVO } from '@/api/administrationCenter/purchaseOrderAccountCheck/index';
import { getUUID } from "@/api/pulicJava"
export default {
    components:{
        breadcrumb,
        needToSettle,
        pagination,
        defeate,
        success,
        repetition
    },
    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
        if(this.purchaseOrderBatchId){
            // if(val){
                this.status=true;
                this.updatas=1;
            // }
        }
    },
    // activated(){
    //     // 头部面包屑
    //     this.navList = this.$route.meta;
    //     if(this.purchaseOrderBatchId){
    //         // if(val){
    //             this.status=true;
    //             this.updatas=1;
    //         // }
    //     }
    // },
    // deactivated () {
    //     this.$destroy(true)
    // },
    data(){
        return{
            navList:[],
            month:'',
            errorParams:{
                page:1,
                limit:10,
                purchaseOrderBatchId:''
            },
            successParams:{
                page:1,
                limit:10,
                purchaseOrderBatchId:''
            },
            status:false,
            Num:{
                allSize:this.$route.query.allSize,
                errorSize :this.$route.query.errorSize,
                okSize :this.$route.query.okSize,
                needSize:this.$route.query.needSize
            },
            purchaseOrderBatchId:this.$route.query.purchaseOrderBatchId,
            tableObj:{
                total:10,
                tableData:[],
                tabLoading:false
            },
            updatas:0,
            repetitionParams:{
                page:1,
                limit:10,
                purchaseOrderBatchId:''
            },
            index:0,
            btnLoading:false,
            showText:false,
            text:'导入中...',
            rowsData:[],
            loading:false
        }
    },
    watch: {
        purchaseOrderBatchId(val,oldVal){
            if(val){
                this.status=true;
            }
        }
    },
    methods: {
        changeRows(val){
            this.rowsData=val;
        },
        confirm(){
            if(this.rowsData.length){
                let accountsStatus = this.rowsData.every((item,idx)=>{
                    return item.accountsStatus!=3
                })
                if(accountsStatus){
                    let status=this.rowsData.every((item,idx)=>{
                        return item.purchaseStatus==2
                    })
                    if(status){
                        let flag=this.rowsData.every((item,idx)=>{
                            return Number(item.settlementMoneyIm)!=0|Number(item.asAmountIm)!=0||Number(item.additionalAsAmountIm)!=0
                        })
                        if(flag){
                            let arr=[];
                            this.rowsData.map((item,idx)=>{
                                arr.push(item.purchaseOrderBatchDataId)
                            })
                            this.loading=true;
                            getCheckPurchaseOrderData({
                                purchaseOrderBatchId:this.purchaseOrderBatchId,
                                purchaseOrderBatchDataIds:arr
                            }).then(res=>{
                                if(res.status==205){
                                    this.$message.warning(res.message)
                                }else{
                                    let arr=[];
                                    let brr=[];
                                    this.rowsData.map((item,idx)=>{
                                        let obj={
                                            handleType:0,
                                            purchaseNumber:item.purchaseNumber,
                                            purchaseOrderBatchDataId:item.purchaseOrderBatchDataId,
                                            purchaseOrderBatchId:this.purchaseOrderBatchId,
                                            purchaseOrderDataId:-1
                                        }
                                        arr.push(obj)
                                        brr.push(item.purchaseOrderBatchDataId)
                                    })
                                    let params={
                                        purchaseOrderBatchId:this.purchaseOrderBatchId,
                                        purchaseOrderBatchDataList:arr,
                                        purchaseOrderBatchDataIds:brr
                                    }
                                    savePurchaseOrderData(params).then(res=>{
                                        if(this.updatas==0){
                                            this.updatas=1;
                                        }else{
                                            this.updatas=0;
                                        }
                                        this.loading=false;
                                        this.$message.success("操作成功");
                                    })
                                } 
                            })
                        }else{
                            this.$message.warning("金额不能为0！")
                        }
                    }else{
                        this.$message.warning("只可选择执行完成的")
                    }
                }else{
                    this.$message.warning("结算中状态，不可执行");
                }
                
            }else{
                this.$confirm('是否全部操作', '提示', {
                    confirmButtonText: '是',
                    cancelButtonText: '否',
                    type: 'warning'
                }).then(() => {
                    let arr=[];
                    getCheckPurchaseOrderData({
                        purchaseOrderBatchId:this.purchaseOrderBatchId,
                    }).then(res=>{
                        if(res.status==205){
                            this.$message.warning(res.message)
                        }else{
                            let params={
                                purchaseOrderBatchId:this.purchaseOrderBatchId,
                            }
                            savePurchaseOrderData(params).then(res=>{
                                if(this.updatas==0){
                                    this.updatas=1;
                                }else{
                                    this.updatas=0;
                                }
                                this.$message.success("操作成功");
                            })
                        } 
                    })
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消'
                    });          
                });
                
            }
        },
        tabClick(val){
            this.index=val.index;
            this.goInterface(this.index)
            
        },
        goInterface(index){
            console.log(index)
            this.tableObj.tableData=[];
            if(index==0){
                if(this.updatas==0){
                    this.updatas=1;
                }else{
                    this.updatas=0;
                }
            }else if(index==1){
                this.errorParams.purchaseOrderBatchId=this.purchaseOrderBatchId;
                this.tableObj.tabLoading=true;
                listPurchaseOrderBatchDataFailVO(this.errorParams).then(res=>{
                    this.tableObj.tableData=res.data.rows;
                    this.tableObj.total=res.data.total;
                    this.tableObj.tabLoading=false;
                })
            // }else if(index==2){
            //     this.successParams.purchaseOrderBatchId=this.purchaseOrderBatchId;
            //     listPurchaseOrderBatchDataSuccess(this.successParams).then(res=>{
            //         this.tableObj.tableData=res.data.rows;
            //         this.tableObj.total=res.data.total;
            //     })
            }else if(index==2){
                this.tableObj.tabLoading=true;
                this.repetitionParams.purchaseOrderBatchId=this.purchaseOrderBatchId;
                listRepeatPurchaseDataVO(this.repetitionParams).then(res=>{
                    this.tableObj.tableData=res.data.rows;
                    this.tableObj.total=res.data.total;
                    this.tableObj.tabLoading=false;
                })
            }
            
        },
        sizeChange(val){
            this.formList.page=1;
            this.formList.limit=val;
        },
        currentChange(val){
            this.formList.page=val;
        },
        uploadSectionFile(val){
            // put(val).then(res =>{
                this.postFile(val);
            // })
        },
        postFile(val,res){
            this.btnLoading=true;
            this.showText=true;
            getUUID({
                serialNumber: 'R'
            }).then(response=>{
                var formData = new FormData();
                formData.append("sourceName",val.file.name);
                formData.append("purchaseOrderBatchId",this.purchaseOrderBatchId?this.purchaseOrderBatchId:"");
                // formData.append("targetName", null);
                // formData.append("fileUrl", null); 
                formData.append("file", val.file);
                formData.append("purchaseOrderNumber", response.data);
                
                importPurchaseOrderBatch(formData).then(res=>{
                    if(res.status==205){
                        this.$message.warning("最多导入5000条！")
                    }else{
                        this.btnLoading=false;
                        this.showText=false;
                        this.$message({
                            message: '导入成功',
                            type: 'success'
                        });
                        let url = "#/contractmanagement/importStatement?purchaseOrderBatchId=" + res.data.purchaseOrderBatchId;
                        let stateObject = {
                            purchaseOrderBatchId: res.data.purchaseOrderBatchId
                        };
                        history.pushState(stateObject, '', url);
                        this.purchaseOrderBatchId=res.data.purchaseOrderBatchId;
                        this.goInterface(this.index)
                        for(let i in this.Num){
                            this.Num[i]=stateObject[i]
                        }
                    }
                    
                }).catch(err=>{
                    this.btnLoading=false;
                    this.$message({
                        message: '导入失败',
                        type: 'error'
                    });
                })
            })
            
        },
    },
}
</script>
<style scoped>
.btnConfim{
    margin-left: 20px;
}
</style>
