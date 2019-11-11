<template>
  <div class="urgentapply">

    <div class="app_text urgent_app">
        <div>
            <span class="header_span">加急天数：</span>
                <el-input-number v-model="urgentDay"  :min="0"></el-input-number>
            <span>天</span>
        </div>

        <div>
            <span class="header_span">标准工期：</span>
            <span>{{predictGq}}天</span>
        </div>
    </div>

    <div class="app_text">
        <span>申请原因：</span>
        <el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="applyCause">
        </el-input>
    </div>
    <!-- 商品清单table -->
    <goodslist :orderId="orderId" ref="goodslist"></goodslist>

     <div>
        <div class="titlecals martop">附件管理</div>
        <ul class="el-upload-list el-upload-list--text downlists" v-if="isAudit">
            <li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in fileList" :key="index">
                <a class="el-upload-list__item-name">
                    <i class="el-icon-document"></i> {{item.name}}
                </a>
                <a :href="urls" download class="el-icon-download pointer" @click="downPic(item)"></a>
            </li>
        </ul>
        <el-upload
            list-type="text"
            class="upload-demo"
            action="string"
            :http-request="uploadSectionFile"
            :file-list="fileList"
            :on-remove="handleRemove" v-else
            >
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
    </div>

    <!-- 审批意见组件 -->
    <auditopinion v-if="isAudit"></auditopinion>

    <div class="btn_btn">
        <el-button type="primary" size="medium" class="reset_btn m-left20" @click="applyFun">申 请</el-button>
        <el-button size="medium" class="reset_btn m-left20" @click="closeFun">取 消</el-button>
    </div>

  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";

import goodslist from "./goodslist";
import auditopinion from "../../components/auditopinion";
import { put, getBuffer } from "@/utils/pubilcFn";
import { getUUID } from 'api/pulicJava';
import {
    whetherApplyStatus, // 获取可申请天数
    addProjectDelayUrgentApply, // 添加申请
    projectDelayUrgentApplyDetails, // 编辑页回显
    editProjectDelayUrgentApply, // 修改
} from 'api/marketing/projectpermit/index';
import {
  removeAccessoryImg, //删除图片
  addAccessory, //新增图片
} from "@/api/order/recommender/recommender";

export default {
    components: {
      breadcrumb,
      pagination,
      goodslist,
      auditopinion
  },
    props: ["orderId"],
    // name: 'brandmanagement',
    data() {
        return {
            // 分页
            currentPage: 1,//当前页数
            pageSize: 20,//总页数
            total: 100,//总条数

            customerContractId: '',  // 合同id
            applyCause: '',  // 申请原因
            urgentDay: '', // 加急天数
            standardProjectDelay: '', // 标准工期
            predictGq: '',// 标准工期
            isAudit: false,

            dataLimit: '', // 限制天数 接口获取
             // 上传
            fileList: [],
            imgArr: [],
            delImgArr: [],
            projectDelayUrgentApplyId: '',  // 工期加急申请id

            isEdit: false,
            isAdd: false,
            isAudit: false,
        };
    },
    created() {
        if(this.$route.path == "/projectpermit/projectaudit") {
            this.isAudit = true;
        }else if(this.$route.path == "/projectpermit/addapplication") {
            this.isAdd = true;
        }else if(this.$route.path == "/projectpermit/editapplication") { //编辑
            this.isEdit = true;

            this.projectDelayUrgentApplyDetails();
        }
    },
    mounted() {

    },
    watch: {
        orderId: function(val,attr) {
            console.log(val,attr,typeof(this.getCustomerContracts),"val attr 这里是工期加急的orderId watch");
            this.whetherApplyStatus();// 获取可申请天数
        },
    },
    methods: {
        // 获取可申请天数
        whetherApplyStatus() {
            let data = {
                orderId: this.orderId,
            }
            whetherApplyStatus(data).then(res => {
                if(res.status == 200) {
                    this.dataLimit = res.data.minPeriod; // 最大加急天数
                    console.log(this.dataLimit,res.data.minPeriod,"最大加急");
                    
                    this.customerContractId = res.data.customerContractId; // 客户合同id
                    this.predictGq = res.data.predictGq; // 标准工期
                }
            }).catch(err =>{
                console.log('申请:退款管理 总申请 获取可申请天数 marketing/components/application/components/urgentapply.vue', err);
            })
        },

        // 编辑页回显
        projectDelayUrgentApplyDetails() {
            let data = {
                orderApplyId: this.$route.query.orderApplyId,
            }
            projectDelayUrgentApplyDetails(data).then(res => {
                if(res.status == 200) {

                    // 附件
                    this.fileList = res.data.projectDelayUrgentApplyAcc;
                    this.fileList = this.fileList.map(item => {
                        return {
                            ...item,
                            name: item.sourceName,
                            url: item.fileUrl
                        }
                    })

                    this.predictGq = res.data.standardProjectDelay; // 标准工期
                    this.urgentDay = res.data.urgentDay; // 加急天数
                    this.applyCause = res.data.applyCause;

                    this.projectDelayUrgentApplyId = res.data.projectDelayUrgentApplyId; // 工期加急申请id
                }
            }).catch(err =>{
                console.log('申请:退款管理 总申请 编辑页回显 marketing/components/application/components/urgentapply.vue', err);
            })
        },


        // 新增
        applyFun() {
            console.log(this.dataLimit,typeof(this.dataLimit),"this.dataLimit ewaew");
            
            // if(!this.dataLimit) {
            //     this.$message.warning("未签合同，不得申请");
            //     return;
            // }

            if(!this.orderId) {
                this.$message.warning("请选择订单");
                return;
            }else if(!this.urgentDay) {
                this.$message.warning("请填写加急天数");
                return;
            }
            console.log(this.urgentDay,this.dataLimit,Boolean(this.urgentDay > this.dataLimit),"加急天数");
            
            if(this.urgentDay > this.dataLimit) {
                this.$message.warning("请填写正确的加急天数");
                return;
            }

            // if(this.isAudit){ // 如果是审批
            //     if(this.$refs.auditcomponent.audit.operationStatus == 2 && !this.$refs.auditcomponent.audit.rejectionReasons) { // 如果是驳回
            //         this.$message.warning("请填写审批意见");
            //         return;
            //     }
            // }

            let projectDelayUrgentApplyAcc = this.imgArr.map(file => {
                return {
                    fileUrl: file.url,
                    sourceName: file.name
                };
            });
            
                // 工期特批
                let data = {
                    orderId: this.orderId,//订单id
                    customerContractId:  this.customerContractId,  // 合同id
                    applyCause:  this.applyCause,  // 申请原因
                    urgentDay: this.urgentDay, // 加急天数
                    standardProjectDelay: this.predictGq, // 标准工期
                    projectDelayUrgentApplyAcc, // 工期特批附件
                }
                    
                    if(this.isEdit) {
                        data.orderApplyId = this.$route.query.orderApplyId;
                        data.projectDelayUrgentApplyId = this.projectDelayUrgentApplyId;

                        editProjectDelayUrgentApply(data).then(res => {
                            if(res.status == 200) {
                                if ( this.delImgArr.length > 0) {
                                    //有删除旧图片
                                    console.log("有删除旧图片",this.delImgArr);
                                    this.delImgArr.forEach(item => {
                                        removeAccessoryImg(item).then(res => {});
                                    });
                                }

                                this.imgArr.forEach(item => { // 编辑的新增
                                    if (!item.accessoryId) {
                                        let data = {
                                            dataSourceId: this.projectDelayUrgentApplyId,
                                            sourceName: item.name,
                                            fileUrl: item.url,
                                            dataSourceEnum: "ProjectDelayUrgentApplyAcc"
                                        };
                                        addAccessory(data).then(res => {}).catch(error => {
                                            console.error("新增图片", error);
                                        });
                                    }
                                });

                                this.$message.success("操作成功");
                                this.$router.push("/projectpermit/projectapply");
                            }
                        }).catch(err =>{
                            console.log('申请:退款管理 总申请 marketing/components/application/components/urgentapply.vue', err);
                        })
                    }else if(this.isAdd){
                        console.log(25254);
                        
                        getUUID({serialNumber: 'AU'}).then(res => {
                            if(res.status == 200) {
                                data.applyNumber = res.data;

                                addProjectDelayUrgentApply(data).then(res => {
                                    if(res.status == 200) {
                                        this.$message.success("操作成功");
                                        this.$router.push("/projectpermit/projectapply");
                                    }
                                }).catch(err =>{
                                    console.log('申请:工期加急管理 总申请 marketing/components/application/components/urgentapply.vue', err);
                                })
                            }
                        }).catch(err => {
                            console.log('申请:工期管理 总申请 marketing/components/application/components/urgentapply.vue', err);    
                        })
                    }
            

            
        },
        // 取消
        closeFun() {
            this.$router.push("/refundpermit/refundapply");
        },


        //表格斑马线设置
        tableRowClassName({row, rowIndex}) {
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
         // 文件成功操作  //addAccessory编辑的新增接口
        uploadSectionFile(res) {
            put(res).then(data => {
                this.imgArr.push(data);
                
            });
        },

        // 文件删除操作
        handleRemove(file, fileList) {
            console.log(file,"filer 555");
            
            if (file.accessoryId) {
                //console.log("旧图片删除");
                let delobj = {
                    accessoryId: file.accessoryId,
                    dataSourceId: file.dataSourceId,
                    dataSourceEnum: file.dataSourceEnum
                };
                this.delImgArr.push(delobj);
            } else {
                //console.log("新增图片删除");
                
                let lengs = String(file.raw.uid).length;
                this.imgArr = this.imgArr.filter(item => {
                let str = item.name.substring(0, lengs);
                    return str !== String(file.raw.uid);
                });
            }
        },
        enlargePic(item) {
            this.dialogImageUrl = item.fileUrl;
            this.dialogVisible = true;
        },
        downPic(item) {
            getBuffer(item.sourceName).then(res => {
                this.urls = res;
            });
        },


    }
};
</script>
<style scoped lang='scss'>
.urgentapply{
	
	.app_text{
        padding: 12px;
        display: flex;
        flex-wrap: nowrap;
        align-items: center;
        span{
            min-width: 100px;
            padding-left: 12px;
            text-align: right;
            white-space: nowrap;
            font-size: 14px;
        }
	}
    .urgent_app {
        display: flex;
        flex-wrap: nowrap;
        >div:nth-of-type(even) {
            padding-left:20px;
        }
    }
	.btn_btn{
        width: 200px;
        margin: 10px auto;
    }
}

    



</style>

