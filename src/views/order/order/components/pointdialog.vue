<template>
    <!-- 弹框页面 -->
    <el-dialog title="" :visible.sync="centerDialogVisible" min-width="30%" width="40%"  :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
        <div class="titlecals">{{dialogtitle}}</div>
        
        <div style="width:100%;">
            <div class='Dialog_input_cell'>
                <div class='Dialog_content'>
                    <el-form :label-position="labelPosition" label-width="126px" :model="fromdatas" class="demo-form-inline-two">
                        <el-form-item label="指派对象">
                            <div class="obj">
                                <el-radio-group v-model="fromdatas.status" class = "radioList">
                                    <el-radio :label="1">销售员</el-radio>
                                    <el-radio :label="2">业务员</el-radio>
                                    <el-radio :label="3">机构</el-radio>
                                </el-radio-group>
                            </div>
                        </el-form-item>

                        <el-form-item label="跟进内容" class="addressclas">
                            <el-input type="textarea" v-model="fromdatas.obj"></el-input>
                        </el-form-item>

                        <el-form-item label="上传附件">
                            <div class="collapse_input_cell_box">
                                <div class='contentBox'>
                                    <div class="collapse_cell_div" v-for="(item,index) in TechnologyList" :key="index">
                                        <div class="upImgBox">
                                            <img :src="item.fileUrl" alt="" class="avatar">
                                        </div>
                                        <div class="setPicture">
                                            <p @click='Deletepic(index,item.accessoryId)' style='margin-left:15px;'>删除图片</p>
                                        </div>
                                    </div>
                                    <div class="upload_box teupBox" v-if='TechnologyList.length < 1'>
                                        <el-upload
                                            class="upload-demo"
                                            :data='technology'
                                            :action="TechnologyimgUrl"
                                            list-type="picture-card"
                                            :accept="Technologyaccept"
                                            :on-remove="Technology"
                                            :on-success="TechnologySwiper"
                                            :before-upload="beforeAvatarUp"
                                            :on-error="uploadError">
                                            <i class="el-icon-plus"></i>
                                        </el-upload>
                                        <!-- <el-dialog :visible.sync="processPicture.dialogVisible" class='box'>
                                        <img width="100%" :src="processPicture.commodityUrl" alt="">
                                        </el-dialog> -->
                                    </div>
                                </div>
                            </div>
                        </el-form-item>

                            
                        <el-form-item label="客户要求回访时间">
                            <div class="">
                                <el-date-picker 
                                    v-model="fromdatas.handoverDate" 
                                    value-format='yyyy-MM-dd'
                                    format='yyyy-MM-dd'
                                    size="medium" type="date" 
                                    placeholder="选择日期" class="selewi">
                                </el-date-picker>
                            </div>
                        </el-form-item>
                    </el-form> 

                    <div slot="footer" class="dialog-footer" >
                        <el-button @click="cancel">取 消</el-button>
                        <el-button type="primary" @click="sendJava()">确 定</el-button>
                        <el-button type="primary" @click="closeDialog">关闭</el-button>
                    </div>

                </div>
            </div>
            <!-- <div class='Dialog_input_cell'>
                <div class='Dialog_content'>
                <el-checkbox v-model="whether">当前订单有收款信息，无法作废，是否走退单流程</el-checkbox>
                <div class='reasons'>
                    <span class='fontWidth'>退单原因：</span>
                    <el-input
                    type="textarea"
                    :rows="2"
                    placeholder="请输入内容"
                    v-model="textarea">
                    </el-input>
                </div>
                </div>
            </div> -->
            <!-- <el-card class="box-card"> -->
            <div class="timeCard">
                <div class="titlecals">订单记录</div>
                <div class="timeline">
                    <el-timeline reverse>
                        <el-timeline-item
                        v-for="(activity, index) in activities"
                        :key="index"
                        :color="activity.color"
                        :size="activity.size"
                        :timestamp="activity.timestamp">
                        {{activity.content}}
                        </el-timeline-item>
                    </el-timeline>
                </div>
            </div>   

            <!-- </el-card> -->
            
        </div>
    </el-dialog>
</template>
<script>

import { getToken,getUpToken } from '@/utils/auth';

import {
  addAccessory
} from 'api/order/order/order';

export default {
    props: ["dialogtitle","tabledata"],
    data() {
        return {
            centerDialogVisible: true,
            fromdatas: {
                status: 1,
            },
            isBudget: false,
            isDesign: false,
            labelPosition: 'right',
            TechnologyList:[], // 图片
            uptoken: {//上传参数
                token: '',
                key: ""
            },
            technology: {// 图片上传参数
                token: '',
                key: ""
            },
            //文件上传
            upLoadList:[],
            accept: "image/jpeg,image/gif,image/png,image/bmp",//图片上传格式
            imgShow: 'http://file.xczhihui.com/',
            imgUrl: 'http://up-z2.qiniup.com',

            Technologyaccept: "image/jpeg,image/gif,image/png,image/bmp",// 图片上传格式
            TechnologyimgShow: 'http://file.xczhihui.com/',
            TechnologyimgUrl: 'http://up-z2.qiniup.com',
            TechnologyUrl:'',
            processPicture:{},
            activities: [{
                content: '2018-04-12 20:46 跟进人 张三 跟进状态：待测量',
                timestamp: '已联系客户，并与客户约定测量时间及内容，已指派设计师！！',

            }, {
                content: '2018-04-12 20:46 跟进人 张三 跟进状态：待测量',
                timestamp: '已联系客户，并与客户约定测量时间及内容，已指派设计师！！',
               
            }, {
                content: '2018-04-12 20:46 跟进人 张三 跟进状态：待测量',
                timestamp: '已联系客户，并与客户约定测量时间及内容，已指派设计师！！',
               
            }, {
                content: '2018-04-12 20:46 跟进人 张三 跟进状态：待测量',
                timestamp: '已联系客户，并与客户约定测量时间及内容，已指派设计师！！',
               
            }],
        }
    },
    mounted() {},
    created(){
        this.uptoken.token = getUpToken();
        this.technology.token = getUpToken();
        console.log(this.uptoken,"token123")
    },
    methods:　{
         Deletepic(details,id){ // 图片删除
            this.TechnologyList=this.TechnologyList.filter((item,index)=>{
                return details!==index
            })
            if(id!==undefined){
                let data={
                dataSourceId:this.$route.query.id,
                dataSourceEnum:'CommodityTechnologyImg',
                accessoryId:id
            }
            removeAccessoryImg(data).then(res=>{
                console.log(res);
                
            }).catch(error=>{
                console.error('删除图片',error)
            })
            }
        },
        //工艺图片删除
        Technology(){

        },
        // 上传成功 工艺图片
        TechnologySwiper(val) {
            this.processPicture.commodityUrl = this.TechnologyimgShow + val.key;
            this.TechnologyList=[{
                fileUrl:this.processPicture.commodityUrl,
                isMain:0,
                sourceName:val.key
            }]
        },

        submitFun() {
            this.TechnologyList.forEach(item=>{
				console.log(item,'-------');
				
				if(!item.accessoryId){
					let data={
						dataSourceId:this.$route.query.id,
						sourceName:item.sourceName,
						fileUrl:item.fileUrl,
						isMain:item.isMain,
						dataSourceEnum:'CommodityTechnologyImg'
					}
					addAccessory(data).then(res=>{
					
					}).catch(error=>{
						console.error('新增图片',error)
					})
				}
            })
        },

        beforeAvatarUp(file){//工艺图片上传之前
			this.technology.key = `${file.lastModified}.png`;
			console.log(this.technology);  
      },
      // 上传成功 工艺图片
      TechnologySwiper(val) {
       this.processPicture.commodityUrl = this.TechnologyimgShow + val.key;
        this.TechnologyList=[{
          fileUrl:this.processPicture.commodityUrl,
          isMain:0,
          sourceName:val.key
          }]
       
          
      },
      // 预览图片
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url;
        this.ruleForm.dialogVisible = true;
      },
      // 删除图片
      handleRemove(file, fileList) {
        // this.Picture=fileList.map(item=>{
        //   return item.response.data
        // })
      },
      

       beforeAvatarUpload(file) {//图片上传之前
        this.uptoken.key = `${file.lastModified}.png`;
       },
       // 上传成功-轮播图
      handleSuccessChange(val) {
       this.ruleForm.dialogImageUrl = this.imgShow + val.key;
        this.upLoadList.push({
          fileUrl:this.ruleForm.dialogImageUrl,
          isMain:0,
          sourceName:val.key
          })
          console.log(this.upLoadList);
          
      },
		// 上传失败
		uploadError(err, file, fileList) {
			console.log(err, file, fileList)
		},
		// 关闭
        closeDialog() {
            this.$emit( "close-change");
        },
		cancel(){

		}

    },
        
}
</script>
<style scoped  lang="scss">
    .Dialog_input_cell{
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .Dialog_content{
        width: 30vw;
    }
    .reasons{
        display: flex;
        flex-direction:row;
        margin-top:15px;
    }
    .reasons .fontWidth{
        width: 6em;
        position: relative;
    }

    .avatar {
        width: 94px;
        height: 94px;
        display: block;
    }
    .radioList {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    
</style>
<style>
    .timeCard{
        margin-top: 35px;
    }
    .timeline {
        height: 140px;
        overflow-y: auto;
    }
    .timeline .el-timeline-item .el-timeline-item__node--normal {
        border:1px solid #0bbd87;
        background: transparent;
        left: 0px;
    }
    .timeline .el-timeline-item__tail {
        border-left-color: #0bbd87;
        position: absolute;
        top: 12px;
        height: 91%;
        left: 5px;
    }
    .el-timeline-item {
        position: relative;
        padding-bottom: 92px;
        /* left:1%; */
    }
    .dialog-footer {
        display: flex;
        justify-content: flex-end;

    }
    .status {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 40px;
    }
</style>

