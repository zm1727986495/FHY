<template>
    <div class="addcomplain">
        <el-form :label-position="labelPosition" ref="dynamicValidateForm"
            label-width="120px" 
            :model="compContent" 
            class="demo-form-inline">

            <el-form-item label="申诉内容" :rules="{
                required: true, message: '域名不能为空', trigger: 'blur'
            }">
                <el-input type="textarea" v-model="compContent.illegalAllege.allegeContent" :readonly="readonly"></el-input>
            </el-form-item>
            

            <div class="addcomplainAccessory" v-if="isJudge && fileList && fileList.length != 0">
                <!-- <div class="titlecals martop">申诉附件</div> -->
                <div class="iconBox m-bottom">
					<i class="Icon"></i>
					<span>申诉附件</span>
				</div>

                <ul class="el-upload-list el-upload-list--text downlists">
                    <li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in fileList" :key="index">
                        <a class="el-upload-list__item-name">
                            <i class="el-icon-document"></i> {{item.sourceName}}
                        </a>
                        <a :href="urls" download class="el-icon-download pointer" @click="downPic(item)"></a>
                        <!-- <el-link type="primary" :underline="false" :href="item.fileUrl">下载</el-link> -->
                        <!-- <el-button type="text" @clcik="downFun">
                            <a :href="downFile">下载</a>
                        </el-button> -->
                    </li>
                </ul>
            </div>
            
            <el-form-item label="申诉附件" v-else-if="!isJudge">
                <el-upload
                    list-type="text"
                    class="upload-demo"
                    action="string"
                    :http-request="uploadSectionFile"
                    :file-list="fileList"
                    :on-remove="handleRemove"
                    >
                    <el-button size="small" type="primary" v-if="!isJudge">点击上传</el-button>
                </el-upload>
                <!-- <template>
                    <el-upload :disabled= "readonly"
                        class="upload-demo"
                        :data='technology'
                        :action="TechnologyimgUrl"
                        :limit='num'
                        list-type="picture-card"
                        :accept="Technologyaccept"
                        :on-remove="Technologydel"
                        :on-success="TechnologySwiper"
                        :before-upload="beforeAvatarUp"
                        :on-error="uploadError">
                        <i class="el-icon-plus"></i>
                    </el-upload>
                    <el-dialog :visible.sync="processPicture.dialogVisible" class='box'>
                        <img width="100%" :src="processPicture.dialogImageUrl" alt="">
                    </el-dialog>
                </template> -->
            </el-form-item>

            <el-form-item label="申诉人" v-if="readonly">
                <el-input v-model="addcomplaindata.name" :readonly="readonly"></el-input>
            </el-form-item>

            <el-form-item label="申诉时间"  v-if="readonly">
                <div class="block">
                    <el-date-picker :readonly="readonly"
                        v-model="addcomplaindata.complianTime" 
                        size="medium" 
                        type="datetime" 
                        placeholder="选择日期"
                        value-format='yyyy-MM-dd HH:mm:ss'
                        format='yyyy-MM-dd HH:mm:ss'
                    ></el-date-picker>
                </div>
            </el-form-item>
             
        </el-form>
        
           
    </div>
</template>

<script>
import { getUpToken } from '@/utils/auth';
import { put } from "@/utils/pubilcFn";
import { getBuffer } from "@/utils/pubilcFn";
import { 
    addIllegalAllege, // 申诉
     complaintContent, // 申诉内容回显
} from 'api/administrationCenter/puniManagement/punish';

  export default {
    components: {
       
    },
    data() {
        return {
            addcomplaindata: {
                allegeContent: '',
            },
            readonly: false,

            processPicture:{},//图片
            num: 20,
            dialogImageUrl: '',
            dialogVisible: false,
            labelPosition: 'right',
      
            // 上传
            fileList: [],
            imgArr: [],
            delImgArr: [],  
            compContent: {
                illegalAllege: {
                    allegeContent: '',
                }
            }, // 申诉内容回显
            isJudge: false,
            urls: ""
        };
    },
    props: {
       
    },
    created() {
       if(this.$route.path == "/puniManagement/judgedisposal") {
           this.isJudge = true;
            this.complaintContent(); // 申诉内容回显
        } 
    },
    mounted() {
       
    
    },
    methods: {
        downPic(item) {
            getBuffer(item.sourceName).then(res => {
                this.urls = res;
            });
        },
        uploadSectionFile(res) {
            if(this.isJudge) {
                return;
            }
            put(res).then(data => {
                this.imgArr.push(data);
            });
        },
        handleRemove(file, fileList) {

            // if (file.dataSourceId) {
            //     //console.log("旧图片删除");
            //     let delobj = {
            //         accessoryId: file.accessoryId,
            //         dataSourceId: file.dataSourceId,
            //         dataSourceEnum: file.dataSourceEnum
            //     };
            //     this.delImgArr.push(delobj);
            // } else {
                //console.log("新增图片删除");
                let lengs = String(file.uid).length;
                this.imgArr = this.imgArr.filter(item => {
                    let str = item.name.substring(0, lengs);
                    return str !== String(file.uid);
                });
            // }
        },

        // 申诉内容 -- 回显
        complaintContent() {
            let data = {
                illegalBillId: this.$route.query.illegalBillId,
            }

            complaintContent(data).then(res => {
                if(res.status == 200) {
                    this.compContent = res.data;

                    if(this.compContent.illegalAllege == null) {
                        this.compContent.illegalAllege = {};
                        this.compContent.illegalAllege.allegeContent = '';
                    }
                    this.fileList  = this.compContent.accessoryVOList;
                    this.fileList = this.fileList.map(item => {
                        return {
                            ...item,
                            name: item.sourceName,
                        }
                    })
                }
            }).catch(err => {
               console.log('违规处罚管理:违规管理 申诉内容 administrationCenter/puniManagement/violations/disposllal.vue', err);
            })
        },

    
    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
    .titlecals{
    font-size: 18px;
    position: relative;
    font-weight: 500;
    color: #006EC7;
    margin: 0px 35px;
    top: -20px;
    }
    .map {
        width: 100%;
        height: 400px;
        .anchorBL {
        　　display: none;
        }
    }
    .addcomplain{
        .addresbox{
            display: flex;
            .explaintxttwo{
                width: 100px;
                display: block;
                padding-left: 10px;
                text-align: center;
            }
        }
        .addresslist{
            display: flex;
            flex-wrap: wrap;
            // justify-content: space-between;
            align-items: center;
            .input-with-select{
                max-width: 200px;
            }
            .addresele{
                max-width: 150px;
            }
            >div{
                margin: 0px 5px;
            }
        }
    }

    .addcomplainAccessory {
     
        
        .downlists {
            >li {
                display: flex;
                align-items: center;
                flex-wrap: nowrap;
            }
        }
    }
</style>

<style lang="scss">
.addcomplain{
    .el-upload-list__item:hover .el-icon-close{
        display: none;
    }
}
    
</style>


