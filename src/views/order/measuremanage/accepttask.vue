<template>
    <div class="accepttask">
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="lvs">
            <!-- 订单详情 -->
            <orderdetail></orderdetail>

            <!-- 合同信息 -->
            <!-- <contractdetails></contractdetails> -->

            <div class="accepbox">
                <div class="boxtit borbottom">测量任务</div>
                <div class="orderfrom">
                    <el-form :label-position="labelPosition" 
                    label-width="130px" 
                    :model="formInline" 
                    class="demo-form-inline">
                        <el-form-item label="指派单号">
                            <el-input v-model="formInline.user" size="medium" placeholder="DDBH0001-增1"></el-input>
                        </el-form-item>
                        <el-form-item label="制单日期">
                            <el-input v-model="formInline.user" size="medium" placeholder="2019-01-01"></el-input>
                        </el-form-item>
                        <el-form-item label="所属门店">
                            <el-input v-model="formInline.user" size="medium" placeholder=""></el-input>
                        </el-form-item>
                        <el-form-item label="所属销售员/业务员">
                            <el-input v-model="formInline.user" size="medium" placeholder="张三"></el-input>
                        </el-form-item>
                        <el-form-item label="订单号">
                            <el-input v-model="formInline.user" size="medium" placeholder="HT0001"></el-input>
                        </el-form-item>
                        <el-form-item label="合计金额">
                            <el-input v-model="formInline.user" size="medium" placeholder="2500"></el-input>
                        </el-form-item>
                        <el-form-item label="客户姓名">
                            <el-input v-model="formInline.user" size="medium" placeholder="张三"></el-input>
                        </el-form-item>
                        <el-form-item label="客户电话">
                            <el-input v-model="formInline.user" size="medium" placeholder="13899992222"></el-input>
                        </el-form-item>
                        <el-form-item label="地址">
                            <el-input v-model="formInline.user" size="medium" placeholder="DDBH0001"></el-input>
                        </el-form-item>
                        <el-form-item label="">
                            <el-input v-model="formInline.user" size="medium" placeholder="DDBH0001"></el-input>
                        </el-form-item>
                        <el-form-item label="预计测量时间">
                            <div class="block">
                                <el-date-picker v-model="value1" size="medium" type="date" placeholder="选择日期"></el-date-picker>
                            </div>
                        </el-form-item>
                    </el-form>
                </div>
            </div>

            <div class="btnboxs">
                <div></div>
                <div>
                    <el-button class="button-fc" size="medium">接受</el-button>
                    <el-button class="button-fc" size="medium" @click="refusefucn">拒绝</el-button>
                </div>
            </div>

            <div class="reason" v-if="reasonshow">
                <div class="explatxt">原因：</div>
                <div class="textareabox">
                    <el-input
                        type="textarea"
                        :autosize="{ minRows: 2, maxRows: 4}"
                        placeholder="请输入内容"
                        v-model="textarea2">
                    </el-input>
                </div>
            </div>
        </el-card>
        
    </div>
    
</template>
<script>
import spot from '@/assets/images/spot.png';
import breadcrumb from "../../components/breadcrumb";
import orderdetail from "../components/orderdetail";
import contractdetails from "../components/contractdetails";

export default {
    components: {
        breadcrumb,
        orderdetail,
        contractdetails
    },
    data(){
        return {
            navList: [],
            isShow: true,
            labelPosition: 'right',
            formInline: {
                user: '',
                region: '',
                type: [],
                resource: ""
            },
            value1: "",
            textarea2: '',
            reasonshow: false
        }
    },
    mounted() {
        // 头部面包屑
        this.navList=this.$route.meta;
    },
    methods: {
        // 显示隐藏搜索
        hideSearch(){
            this.isShow = !this.isShow;
            // console.error('111', this.isShow);
        },
        refusefucn(){
            this.reasonshow = true;
        }
    }
}
</script>
<style lang="scss" scoped>
    .accepttask{
        // .button-96{
        //     width: auto;
        // }
        .m-right{
            width: 10%;
            float: right;
            height: 100%;
            position: relative;
        }
        
        .boxtit{
            background: #f5f5f5;
            padding: 10px 20px;
            color: #333333;
            font-size: 14px;
        }
        .contractcon{
            padding: 20px 0px 20px 50px;
            position: relative;
        }

        .accepbox{
            border: 1px solid #e4e4e4;
        }
        .borbottom{
            border-bottom: 1px solid #e4e4e4;
        }
        .orderfrom{
            margin-top: 10px;
            padding: 0px 70px;
        }
        .orderfrom .el-form-item__label{
            font-weight: 400;
        }

        .orderfrom .demo-form-inline{
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        .orderfrom .demo-form-inline>div{
            width: 40%;
        }
        .btnboxs{
            margin-top: 10px;
            display: flex;
            justify-content: space-between;
            border: 1px solid #e4e4e4;
            background: #f5f5f5;
            padding: 10px 20px;
        }
        .reason{
            display: flex;
            margin-top: 10px;
        }
        .reason .explatxt{
            font-size: 14px;
            width: 100px;
            padding-right: 20px;
            text-align: right;
        }
        .textareabox{
            flex: 1;
        }
    }
</style>