<template>
    <div class="addrecommender">
        
            <!-- 申请信息 -->
            <div class="bordermodel">
                <div class="textitle">
                    <div class="titlecals">申请信息</div>
                    <!-- <div class="table_action_span" @click="retractone">{{retractbox1 ? "收起" : "展开"}}</div> -->
                </div>
                <div class="discountfrom">
                    <el-form
                        ref="ruleForm"
                        :label-position="labelPosition"
                        label-width="120px"
                        :model="discount"
                        class="demo-form-inline"
                        :rules="rules">
                        <el-form-item label="申请单号" required prop="organ"  >
                            <el-input v-model="discount.organ" size="medium"  disabled placeholder="申请单号"></el-input>
                        </el-form-item>

                        <el-form-item label="申请类型" required prop="type"  >
                            <el-input v-model="discount.type" size="medium"  disabled placeholder="申请类型"></el-input>
                        </el-form-item>

                        <el-form-item label="审批人" required prop="auditer"  >
                            <el-input v-model="discount.auditer" size="medium" disabled placeholder="审批人"></el-input>
                        </el-form-item>

                        <el-form-item label="是否使用审批次数" required prop="isAudit">
                            <el-select v-model="discount.isAudit" placeholder="是否使用审批次数" disabled>
                                <el-option
                                    v-for="item in countList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="已用次数" required prop="usedNum"  >
                            <el-input-number v-model="discount.usedNum" disabled :step="2" step-strictly :min="0"></el-input-number>
                        </el-form-item>

                        <el-form-item label="审批次数" required prop="auditNum"  >
                            <el-input-number v-model="discount.auditNum" disabled :step="2" step-strictly :min="0"></el-input-number>
                        </el-form-item>

                        <el-form-item label="每月审批次数" required prop="audittotalNum"  >
                            <el-input-number v-model="discount.audittotalNum" disabled :step="2" step-strictly :min="0"></el-input-number>
                        </el-form-item>

                        <el-form-item
                            label="申请原因"
                            required
                            class="addressclas input_100"
                            prop="desc">
                            <el-input type="textarea" v-model="discount.desc"></el-input>
                        </el-form-item>

                         <el-form-item label="特批折扣" required prop="discount"  >
                            <el-input v-model="discount.discount" size="medium" disabled placeholder="特批折扣"></el-input>
                        </el-form-item>

                    </el-form>
                </div>
            </div>
    </div>
</template>
<script>


import spot from "@/assets/images/spot.png";

import { listCompanyByAll } from "api/productmanage/goodsmanage/goodsmanage";


export default {
    components: {
      
    },
    // name: 'brandmanagement',
    data() {
        return {

            supplierList: [], //供应商
            countList: [{
                label: '是',value: 1,
            },{
                label: '否',value: 0,
            },], // 审批次数
            searchData: [],
            labelPosition: "right",
            discount: {
                measure: 1,
                usedNum: 2, 
                auditNum: 8,   
                audittotalNum: 10,
                isAudit: 1,
                desc: '',
            }, // 申请信息

            // customerId: "",
             

            rules: {
                organ: [
                    {required: true,message: "请输入申请机构",trigger: "blur"}
                ],
                applicant: [
                    { required: true, message: "请选择申请人", trigger: "blur" }
                ],
                supplierId: [
                    { required: true, message: "请选择供应商", trigger: "blur" }
                ],
                searchData: [
                    {type: "date",required: true,message: "请选择日期",trigger: "blur"}
                ],
                usedNum: [
                    {required: true,message: "请输入已用次数",trigger: "blur"}
                ],
                auditNum: [
                    {required: true,message: "请输入审批次数",trigger: "blur"}
                ],
                audittotalNum: [
                    {required: true,message: "请输入每月审批次数",trigger: "blur"}
                ],
                type: [
                    {required: true,message: "请输入申请类型",trigger: "blur"}
                ],
                auditer: [
                    {required: true,message: "请输入审批人",trigger: "blur"}
                ],
                isAudit: [
                    {required: true,message: "是否使用审批次数",trigger: "blur"}
                ],
                
                // type: [
                //   { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                // ],
                desc: [
                    {required: true,message: "请填写申请理由",trigger: "blur"}
                ],
                discount: [
                    {required: true,message: "特批折扣",trigger: "blur"}
                ],
            },
       
        };
    },

    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
    },
    created() {
        this.getSupplier();
       
       
        // /stockmanagement/editstockpurchase 修改
    },
    methods: {
        //获取供应商
        /**
         * 获取供应商
         */
        getSupplier() {
            listCompanyByAll()
                .then(res => {
                    this.supplierList = res.data;
                })
                .catch(error => {
                    console.error("获取供应商", error);
                });
        },
    
      
    }
};
</script>
<style scoped lang='scss'>

    .bordermodel {
        border: 1px solid #e6e6e6;
        margin-top: 20px;
        padding: 10px 0px;
        .discountfrom {
            padding: 10px 70px;
            .el-form-item__label {
                font-weight: 400;
            }
            .demo-form-inline {
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                > div {
                    width: 40%;
                }
                .addressclas {
                    width: 40%;
                }
            }
            .input_100 {
                width: 100% !important;
            }
        }
        .upload-demo {
            padding: 20px 60px;
        }
    }
    .titlecals {
        
        top: 0px;
    }

</style>

