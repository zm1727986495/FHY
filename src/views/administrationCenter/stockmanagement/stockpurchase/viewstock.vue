<template>
    <div class="addrecommender">
        <div class="head_nav">
            <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>

        <el-card class="lvs cards">
             <!-- 输入框集合 -->
            <stockform></stockform>
            
            <!-- 附件管理 -->
            <div class="nessey">
                <div class="textitle">
                    <div class="titlecals">附件</div>
                    <!-- <div class="table_action_span" @click="retractone">{{retractbox1 ? "收起" : "展开"}}</div> -->
                </div>
                <ul class="nessContent">
                    <li>
                        <span class="assey">某某附件</span>
                        <span class="colorblue">上传 | 下载 | 删除</span>
                    </li>
                    <li></li>
                </ul>
            </div>

                <!-- table  -->
            <div class="addgoods">
                <stockTable  ref="stockTable"></stockTable>
            </div>
<!--             
            <viewTable></viewTable> -->
         

        </el-card>

        <div class="bottom_btnlist">
            <el-button type="primary" @click="submitForm('ruleForm')">保 存</el-button>
            <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
            <el-button @click="submitForm('ruleForm')">取 消</el-button>
        </div>
    </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";


import stockform from "../components/stockform";
import viewTable from "../components/viewTable";
import stockTable from "../components/stockTable";
import spot from "@/assets/images/spot.png";

import { listCompanyByAll } from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";


export default {
    components: {
        breadcrumb,
        pagination,
        stockform,
        viewTable,
        stockTable,
    },
    // name: 'brandmanagement',
    data() {
        return {
            navList: [], //头部面包屑

            supplierList: [], //供应商
            applicantList: [], //申请人
            searchData: [],
            labelPosition: "right",
            stock: {
                measure: 1
            }, // 申请信息

            // customerId: "",
            

            fileList: [
                {
                    name: "food.jpeg",
                    url:
                        "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
                },
                {
                    name: "food2.jpeg",
                    url:
                        "https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100"
                }
            ],

           
            imageUrl: ""
        };
    },

    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
    },
    created() {
        
    },
    methods: {
       
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    alert("submit!");
                } else {
                    console.log("error submit!!");
                    return false;
                }
            });
        },

        handleChange(file, fileList) {
            this.fileList = fileList.slice(-3);
        }
    }
};
</script>
<style scoped lang='scss'>
.cards {
    margin-top: 20px;
    .nessey {
        border: 1px solid #e6e6e6;
        margin-top: 20px;
        padding: 10px 0px;
        .textitle {
            display: flex;
            justify-content: space-between;
            padding: 10px 20px;
            font-size: 14px;
            // 标题
            .titlecals {
                font-size: 18px;
                position: relative;
                font-weight: 500;
                color: #006ec7;
                margin: 0px 35px;
                top: 0px;
                &::after {
                    content: "";
                    display: block;
                    width: 4px;
                    height: 15px;
                    background: #006ec7;
                    position: absolute;
                    left: -16px;
                    top: 50%;
                    border-radius: 5px;
                    transform: translateY(-50%);
                }
            }
        }
        .nessContent {
            padding: 10px 20px;
            .assey{
                padding:0 12px;
            }
            .colorblue{
            color: #0099FF;
            }
            .colorgren{
                color: #1ABC9C;
            }
        }   
        
        .upload-demo {
            padding: 20px 60px;
        }
    }
}

.bottom_btnlist {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    // border: 1px solid red;
}


</style>

