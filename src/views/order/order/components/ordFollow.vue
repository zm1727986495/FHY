<template>
    <!-- 订单跟进弹框页面 -->
    <el-dialog  title="订单跟进"  custom-class="customDialogTitle"  :visible.sync="centerDialogVisible" min-width="30%" width="60%"  :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
        <div style="width:100%;">
            <div class='Dialog_input_cell'>
                <div class='Dialog_content'>
                    <el-form :label-position="labelPosition" :rules="rules" label-width="128px" :model="fromdatas" class="demo-form-inline-two"  ref="orderfollowForm">
                        <el-form-item label="跟进状态"  prop="status" >
                            <div class="status">
                                <el-radio-group v-model="fromdatas.status" class = "radioList" :rules="{
                                    required: true, message: '不能为空', trigger: 'change'
                                }">
                                    <el-radio 
                                        v-for="item in statusList" 
                                        :key="item.id"
                                        :label="item.id">
										{{item.dictName}}
                                    </el-radio>
                                </el-radio-group>
                            </div>
                        </el-form-item>

                        <el-form-item label="跟进内容" class="addressclas"  prop="remarks" :rules="{
                            required: true, message: '不能为空', trigger: 'blur'
                        }">
                            <el-input type="textarea" v-model="fromdatas.remarks"></el-input>
                        </el-form-item>

                        <el-form-item label="上传附件">
                            <el-upload
                                list-type="text"
                                class="upload-demo"
                                action="string"
                                :http-request="uploadSectionFile1"
                                :file-list="fileList1"
                                :on-remove="handleRemove"
                            >
                                <el-button size="small" type="primary">点击上传</el-button>
                            </el-upload>
                        </el-form-item>

                            
                        <el-form-item label="客户要求回访时间">
                            <el-date-picker 
                                v-model="fromdatas.handoverDate" 
                                value-format='yyyy-MM-dd'
                                format='yyyy-MM-dd'
                                size="medium" type="date" 
                                placeholder="选择日期" class="selewi">
                            </el-date-picker>
                        </el-form-item>
                    </el-form> 

                    <div slot="footer" class="dialog-footer" >
                        <el-button type="primary" @click="sendJava('orderfollowForm')">确 定</el-button>
                        <el-button @click="cancel">取 消</el-button>
                        <!-- <el-button @click="closeDialog">关闭</el-button> -->
                    </div>

                </div>
            </div>
            <div class="timeCard" v-if="activities && activities.length != 0">
                <div class="iconBox m-bottom">
                    <i class="Icon"></i>
                    <span>订单记录</span>
                </div>

                <div class="timeline">
                    <el-timeline reverse>
                        <el-timeline-item 
                            v-for="(activity, index) in activities"
                            :key="index"
                            :timestamp="activity.timestamp" 
                            placement="top">
                                {{activity.content}}
                                <ul class="el-upload-list el-upload-list--text downlists">
                                    <li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in activity.accessoryList" :key="index">
                                        <a class="el-upload-list__item-name">
                                            <i class="el-icon-document"></i> {{item.sourceName}}
                                             <!-- {{item.targetName}} -->
                                        </a>
                                        <el-link type="primary" :underline="false" :href="item.fileUrl">下载</el-link>
                                        <!-- <el-button type="text" @clcik="downFun">
                                            <a :href="downFile">下载</a>
                                        </el-button> -->
                                    </li>
                                </ul>
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </div>  
        </div>
    </el-dialog>
</template>
<script>

import { getToken,getUpToken } from '@/utils/auth';
import { put } from "@/utils/pubilcFn";
import {
  addAccessory,
  listBaseDict, // 跟进状态列表
  orderFollowList, // 订单跟进记录
  orderFollow, // 确定操作按钮
} from 'api/order/order/order';
import { log } from 'util';

export default {
    props: ["tabledata","orderId"],
    data() {
        return {
            centerDialogVisible: true, // 弹框是否显示的flag -- 始终显示
            fromdatas: {
                status: '',
				remarks: '',
				handoverDate:'',
            },
            statusList: [], // 状态列表
            labelPosition: 'right',
            rules: {
                status: [
                    { required: true, message: '请选择跟进状态', trigger: 'change' }
                ],
                remarks: [
                    { required: true, message: '请输入跟进内容',trigger: 'blur'}, 
                ]
			},
		
			orderFollowFile: [],

            processPicture:{},
            // 订单跟进记录
            orderRecord: [], // 订单跟进记录数据
            activities: [],

            // 上传
			fileList1: [],
			imgArr1: [],
			delImgArr: [],
        }
    },
    mounted() {},
    created(){
        this.getstatusList(); // 获取跟进状态列表
        this.getRecord();  // 获取跟进记录

    
    },
    methods:　{
            // 下载附件
            downFun() {
                
            },
            // 获取跟进状态列表
            getstatusList() {
                let data = {
                    dataType: "RECORD_STATUS"
                };
                listBaseDict(data).then(res => {
                    if(res.status == 200) {
                        this.statusList = res.data;
                    }
                }).catch(err => {
                    console.log('订单管理:订单列表 order/order/components/ordFollow.vue', error);
                })
            },
            // 获取跟进记录
            getRecord() {
                let data = {
                    orderId: this.orderId, // 订单Id
                }
                orderFollowList(data).then(res => {
                    if(res.status == 200) {
                        // createTime		  //跟进时间 
                        // recordName	 //跟进人
                        // status              //跟进状态
                        // content		//跟进内容
                        // "accessoryList": [{
                        //                 "accessoryId": 1,//附件Id
                        //                 "fileUrl":      //附件路径
                        //                 "sourceName": "1555751600198.vue",//原文件名称
                        //                 "targetName": "1555747111669",//上传后文件名称
                        //             }]
                        // }],
                        console.log(7899521111111111111111);
                        
                        this.orderRecord = res.data.rows;

                        this.orderRecord.forEach(item => {
                            let timestamp = item.createTime + " 跟进人" + item.recordName + " 跟进状态：" + item.statusName;
                            let content = item.content; 

                            this.activities.push({
                                content,
                                timestamp,
                                accessoryList: item.accessoryList
                            })
                        })

                        console.log(this.orderRecord,"orderRecord");
                        console.log(this.activities,"this.activit");
                        
                        
                        
                        // this.activities.push({
                        //     content: '2018-04-12 20:46   跟进人 张三     跟进状态：待测量',
                        //     timestamp: '已联系客户，并与客户约定测量时间及内容，已指派设计师！！',
                        // })
                    }
                }).catch(error => {
                     console.log('订单管理:订单列表 order/order/components/ordFollow.vue', error);
                })
            },

         //文件成功操作  //addAccessory编辑的新增接口
            uploadSectionFile1(res) {
                put(res).then(data => {
                    this.imgArr1.push(data);
                });
            },
            //文件删除操作
            handleRemove(file, fileList) {
                let lengs = String(file.uid).length;
                this.imgArr1 = this.imgArr1.filter(item => {
                    let str = item.name.substring(0, lengs);
                    return str !== String(file.uid);
                });
            },


        // 确定 -- 操作按钮
        sendJava(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let arr = this.imgArr1.map(item => {
                        return {
                            fileUrl: item.url,
                            sourceName: item.name,
                            // dataSourceEnum: "AllegeImg",
                        };
                    });

                let data = {
                    orderId: this.orderId ,//        订单ID
                    status:  this.fromdatas.status ,  //  跟进状态 （跟进状态列表里id）
                    content:   this.fromdatas.remarks,   //  跟进内容
                    orderFollowFile: arr,
                    customerVisitTime: this.fromdatas.handoverDate   //客户要求回访时间
                }

                orderFollow(data).then(res => {
                    if(res.status == 200) {     
                        this.$message({
                            message: '订单跟进成功',
                            type: 'success'
                        });
                        this.$emit( "close-change");
                    }
                }).catch(error => {
                        console.log('订单管理:订单列表 订单跟进 order/order/components/ordFollow.vue', error);
                })

                } else {
                    return false;
                }
            });
            
        },
        // 取消 -- 操作按钮
        cancel(){
            this.$emit( "close-change");
        },
        // 关闭 -- 操作按钮
        closeDialog() {
            this.$emit( "close-change");
        },

    },
        
}
</script>
<style scoped  lang="scss">
    .Dialog_input_cell{
        display: flex;
        justify-content: center;
        align-items: center;
        .Dialog_content {
            .status {
                display: flex;
                align-items: center;
                justify-content: center;
                height: 40px;
                .radioList {
                    >label {
                        padding: 6px 0;
                    }
                }
            }
        }
    }

    .avatar {
        width: 94px;
        height: 94px;
        display: block;
    }
    
</style>
<style lang="scss">
    .timeCard{
        margin-top: 35px;
    }
    .timeline {
        max-height: 500px;
        // height: 500px;
        // height: auto;
        overflow-y: auto;
        .el-timeline-item {
            position: relative;
            padding-bottom: 92px;
            /* left:1%; */
            .el-timeline-item__node--normal {
                border:1px solid #0bbd87;
                background: transparent;
                left: 0px;
				z-index: 99999;
            }
        }
        .el-timeline-item__tail {
            border-left-color: #0bbd87;
            position: absolute;
            top: 12px;
            height: calc(100% - 12px);
            left: 5px;
			z-index: 9999;
        }
        .downlists {
            >li {
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
            }
        }
    }
    .dialog-footer {
        display: flex;
        justify-content: flex-end;

    }
    
</style>

