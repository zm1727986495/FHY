<template>
    <div class="price_pop">
        <el-dialog title="申请详情" :visible.sync="visible" custom-class="customDialogTitle" :close-on-press-escape="false" :close-on-click-modal="false" :show-close="false">
                <div class="applyfrom">
                    <el-form
                        ref="ruleForm"
                        :label-position="labelPosition"
                        label-width="120px"
                        :model="discount"
                        class="demo-form-inline">
                        <el-form-item label="申请单号"  prop="applyCode">
                            <el-input v-model="discount.applyCode" size="medium"  :readonly="readonly" placeholder="申请单号"></el-input>
                        </el-form-item>
                        <el-form-item label="申请类型"   prop="applyTypeName">
                            <el-input v-model="discount.applyTypeName" size="medium"  :readonly="readonly" placeholder="申请类型"></el-input>
                        </el-form-item>
                        <el-form-item label="审批人"   prop="auditName">
                            <el-input v-model="discount.auditName" size="medium" :readonly="readonly" placeholder="审批人"></el-input>
                        </el-form-item>
                        <el-form-item  label="申请原因" class="addressclas input_100" prop="applyReason" >
                            <el-input type="textarea" v-model="discount.applyReason" :readonly="readonly"></el-input>
                        </el-form-item>
                         <el-form-item label="特批折扣" prop="discount">
                            <el-input v-model="discount.discount" size="medium" :readonly="readonly" placeholder="特批折扣"></el-input>
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
import { 
    listBaseDict //字典
} from "api/order/order/order";


export default {
    props: ["rowData"],

    data(){
        return {
            discount: {
                applyCode: this.rowData.applyCode,
                applyType: this.rowData.applyType,
                auditName: this.rowData.auditName,
                applyReason: this.rowData.applyReason,
                applyTypeName: '',
            }, // 折扣特批的申请详情信息
            labelPosition: "right",
            formLabelWidth: '120px',
            // 控制弹出框是否显示 -- 始终显示
            visible: true,
            readonly: true,
        }
    },

    created(){  
        // if(Number(this.rowData.applyType) == 512) {
        //     this.discount.applyTypeName =  "工作流程"
        // }else if(Number(this.rowData.applyType) == 1064) {
        //     this.discount.applyTypeName =  "折扣申请"
        // }else if(Number(this.rowData.applyType) == 1067) {
        //     this.discount.applyTypeName =  "工期加急申请"
        // }else if(Number(this.rowData.applyType) == 1078) {
        //     this.discount.applyTypeName =  "返点申请"
        // }else if(Number(this.rowData.applyType) == 1066) {
        //     this.discount.applyTypeName =  "开票申请"
        // }else if(Number(this.rowData.applyType) == 1077) {
        //     this.discount.applyTypeName =  "退款申请"
        // }else if(Number(this.rowData.applyType) == 1065) {
        //     this.discount.applyTypeName =  "家装代收合同申请"
        // }else if(Number(this.rowData.applyType) == 1066) {
        //     this.discount.applyTypeName =  "开票申请"
        // };

        new Promise((resolve, reject) => {
            let data = {
                dataType: "APPLY_TYPE"
            };
            listBaseDict(data).then(res=>{
                if(res.status == 200) {
                    this.typeList = res.data;
                    resolve( this.typeList );
                }
            }).catch(error => {
                console.log('申请 申请详情 views/components/components/applydetail', error);
            });
            
        }).then((res)=>{
            res.forEach(attr => {
                if( this.rowData.applyType == attr.id ) { // 列表的传来这条数据的applyType 与字典的对应
                    this.discount.applyTypeName = attr.dictName;
                }
            })   
        });

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
                    width: 50%;
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