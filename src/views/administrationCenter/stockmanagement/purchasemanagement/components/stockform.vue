<template>
    <div class="addrecommender">
            {{isView}}
            <!-- 客户基本信息 -->
            <div class="bordermodel">
                <div class="stockfrom">
                    <el-form
                        ref="ruleForm"
                        :label-position="labelPosition"
                        label-width="120px"
                        :model="stock"
                        class="demo-form-inline"
                        :rules="rules">
                        <el-form-item label="采购单号" required prop="purchasenum"  v-if="isEdit || isView">
                            <el-input v-model="stock.purchasenum" size="medium" placeholder="申请机构" disabled></el-input>
                        </el-form-item>

                        <el-form-item label="供应商" required prop="supplierId">
                            <el-select v-model="stock.supplierId" placeholder="请选择" >
                                <el-option
                                    v-for="item in supplierList"
                                    :key="item.companyId"
                                    :label="item.companyName"
                                    :value="item.companyId"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="要求完成日期" required class="search_item" prop="searchData">
                            <el-date-picker
                                size="medium"
                                v-model="stock.searchData"
                                type="daterange"
                                value-format="yyyy-MM-dd"
                                format="yyyy-MM-dd"
                                range-separator="-"
                                start-placeholder="年/月/日"
                                end-placeholder="年/月/日"
                            ></el-date-picker>
                        </el-form-item>

                        <el-form-item label="发起机构" required prop="organId"  v-if="isEdit || isView">
                            <el-select v-model="stock.organId" placeholder="请选择" disabled>
                                <el-option
                                    v-for="item in organList"
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item label="发起人" required prop="originatorId"  v-if="isEdit || isView">
                            <el-select v-model="stock.originatorId" placeholder="请选择" disabled>
                                <el-option
                                    v-for="item in originatorList"
                                    :key="item.label"
                                    :label="item.label"
                                    :value="item.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>

                        <el-form-item
                            label="备注"
                            required
                            class="addressclas input_100"
                            prop="desc">
                            <el-input type="textarea" v-model="stock.desc"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
    </div>
</template>
<script>


import spot from "@/assets/images/spot.png";

import { listCompanyByAll } from "api/entrepotSet/stockManagement/arrivalNotice/arrivalNotice";


export default {
    components: {
      
    },
    // name: 'brandmanagement',
    data() {
        return {
            // 条件
            supplierList: [], //供应商
            organList: [], // 机构
            originatorList: [], // 发起人

            
            labelPosition: "right",
            stock: {
                purchasenum: '', // 采购单号
                supplierId: '', // 供应商
                searchData: [],
                organId: '', // 发起机构
                originatorId: '', // 发起人
                desc: '', 
            }, // 申请信息

            // customerId: "",
            isEdit: false,
            isView: false,
            rules: {
                supplierId: [
                    { required: true, message: "请选择供应商", trigger: "blur" }
                ],
                searchData: [
                    {type: "array",required: true,message: "请选择日期",trigger: "change"}
                ],
                organId: [
                    {required: true,message: "请选择发起机构",trigger: "blur"}
                ],
                originatorId: [
                    { required: true, message: "请选择发起人", trigger: "blur" }
                ],
                
                // type: [
                //   { type: 'array', required: true, message: '请至少选择一个活动性质', trigger: 'change' }
                // ],
                desc: [
                    {required: true,message: "请填写备注",trigger: "blur"}
                ]
            },
       
        };
    },

    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
    },
    created() {
        this.getSupplier();
       
        if(this.$route.path === "/stockmanagement/editpurchase"){
            this.isEdit = true;
        }else if(this.$route.path == "/stockmanagement/viewpurchase"){
            this.isView = true;
        }
        // /stockmanagement/editstockpurchase 修改
    },
    methods: {
        //获取供应商
        getSupplier() {
            listCompanyByAll().then(res => {
                this.supplierList = res.data;
            }).catch(error => {
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
        .stockfrom {
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
                .input_100 {
                    width: 100% !important;
                }
            }
            
        }
        
    }


</style>

