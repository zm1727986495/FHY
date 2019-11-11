<template>
    <div class="price_pop">
    
        <el-dialog title="" :visible.sync="visible" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
            <div class="titlecals">申请详情</div>
                <div class="applyfrom">
                    <el-form
                        ref="ruleForm"
                        :label-position="labelPosition"
                        label-width="120px"
                        :model="discount"
                        class="demo-form-inline">
                        <el-form-item label="申请单号" disabled prop="order">
                            <el-input v-model="discount.order" size="medium"  disabled placeholder="申请单号"></el-input>
                        </el-form-item>

                        <el-form-item label="申请类型" disabled  prop="type">
                            <el-input v-model="discount.type" size="medium"  disabled placeholder="申请类型"></el-input>
                        </el-form-item>

                        <el-form-item label="审批人" disabled  prop="auditer"  >
                            <el-input v-model="discount.auditer" size="medium" disabled placeholder="审批人"></el-input>
                        </el-form-item>

                        <el-form-item
                            label="申请原因"
                            class="addressclas input_100"
                            prop="desc" disabled >
                            <el-input type="textarea" v-model="discount.desc"></el-input>
                        </el-form-item>

                         <el-form-item label="特批折扣" prop="discount"  disabled>
                            <el-input v-model="discount.discount" size="medium" disabled placeholder="特批折扣"></el-input>
                        </el-form-item>

                    </el-form>
                </div>
                <div slot="footer" class="dialog-footer">
                    <!-- <el-button type="primary" @click="submitBtn">提交</el-button> -->
                    <el-button  @click="colseBtn">取消</el-button>
                </div>
        </el-dialog>
                 
    </div>
</template>
<script>
// import {
//   addPriceTactics,
  
// } from 'api/price/price';

export default {
    props: [],

    data(){
        return {
            discount: {
                measure: 1,
                usedNum: 2, 
                auditNum: 8,   
                audittotalNum: 10,
                isAudit: 1,
                desc: '',
            }, // 折扣特批的申请详情信息
            labelPosition: "right",
            formLabelWidth: '120px',
            // 控制弹出框是否显示 -- 始终显示
            visible: true,
        }
    },
    created(){    
        
    },
    methods: {
        colseBtn(){
            this.$emit( "close-dialog");
        },
       
        
    },



}
</script>
<style scoped lang="scss">
    .input_width {
        width: 60%;
    }
    .applyfrom {
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
</style>