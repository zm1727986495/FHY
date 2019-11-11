<template>
    <div class="punish">
                <div class="punishTop">
                    <span>处罚人</span> 
                    <el-select v-model="punishId" placeholder="请选择处罚人" size="medium" @change="punishChange">
                        <el-option
                            v-for="item in punishList" :key="item.punishId"
                            :label="item.punishName" :value="item.punishId">
                        </el-option>
                    </el-select>
                </div>
                <div class="orderbox">
                   <ul class="punishlsit punishhead">
                        <li>被处罚门店</li>
                        <li>被处罚人</li>
                        <li>被处罚人职位</li>
                        <li>合同号</li> 
                    </ul> 
                    <ul class="punishlsit">
                        <el-tooltip class="item" effect="dark" :content="punishUserinfo.storeName" placement="top">
                            <li>{{punishUserinfo.storeName}}</li>
                        </el-tooltip>
                        <li>{{punishUserinfo.punishName}}</li>
                        <li>
                          <p v-if="punishUserinfo.jobType == 1">店长</p>
                          <p v-if="punishUserinfo.jobType == 2">设计师</p>
                          <p v-if="punishUserinfo.jobType == 3">销售</p>
                        </li>
                        <li>{{punishUserinfo.contractSerialNumber}}</li>
                    </ul>
                    <ul class="punishlsit">
                        <li>处罚理由（详细）</li>
                        <li>
                            <el-input type="desc" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="punishUserinfo.punishReason"></el-input>
                        </li>
                    </ul>
                    <ul class="punishlsit">
                        <li>处罚金额计算公式</li>
                        <li>
                            <el-input placeholder="请填写内容" v-model="punishUserinfo.punishFormula"></el-input>
                        </li>
                        <li>处罚金额</li>
                        <li>
                            <el-input-number class="width-100" :controls="false" v-model="punishUserinfo.punishMoney" :precision="2" :min="0" size="mini" ></el-input-number>
                        </li>
                    </ul>
                    <ul class="punishlsit" v-show="false">
                        <li>部门经理:</li>
                        <li>
                            <el-input
                                placeholder="请填写内容"
                                v-model="apartManager">
                            </el-input>
                        </li>
                        <li>审核人:</li>
                        <li>
                            <el-input
                                placeholder="请填写内容"
                                v-model="reviewer">
                            </el-input>
                        </li>
                        <li>开单人:</li>
                        <li>
                            <el-input
                                placeholder="请填写内容"
                                v-model="order">
                            </el-input>
                        </li>
                    </ul>
                </div>
                <!-- <div class="foot_button" v-if="isrecord">
                    <el-button type="primary" size="medium" @click="subminbtn">打印</el-button>
                    <el-button size="medium" @click='cancel'>取消</el-button>
                </div>
                <div class="foot_button" v-else-if="isPunish">
                    <el-button type="primary" size="medium" @click="submitPunish">提交</el-button>
                    <el-button size="medium" @click='cancel'>取消</el-button>
                </div> -->

    </div>
    
</template>

<script>
import { 
    createPunishBill, // 生成处罚单
    listPunishPeople, // 处罚人列表
    punishUserInfo , // 处罚人员信息
} from 'api/administrationCenter/puniManagement/punish';

  export default {
    data() {
        return {
            punishList: [], // 处罚人列表
            remark: '',
            desc: '',
            punishId: '', // 处罚人
            punishReason: '', // 处罚理由（详细）
            punishFormula: '', //处罚金额计算公式
            punishMoney: '', // 处罚金额
            apartManager: '',
            reviewer: '',
            order: '',
            punishUserinfo: {}, //  处罚人的详情信息
            jobType: '',
        };
    },
    // props: [],
    props: {
        // 该组件是否显示button
        isrecord: {
            type: Boolean,
            default () {
                return false;
            }
        },
        isPunish: {
            type: Boolean,
            default () {
                return false;
            }
        },
        elsectVal: {
            type: Array,
            default () {
                return [{
                    illegalBillId: '',
                }];
            }
        },
    },
    mounted() {

    },
    created() {
        // 生成处罚单下的处罚人
        this.listPunishPeople();
    },
    methods: {
        punishChange(val) {
            this.punishList.forEach(item => {
                if(item.punishId == val) {
                    this.jobType = item.jobType;
                }
            })
          this.punishUserinfo = this.punishList.filter(item => {
            return item.punishId == val;
          })[0];
        },
        // 处罚人员信息
        punishUserInfo() {
            let data = {
                punishId: Number(this.punishId),
                illegalBillId: Number(this.elsectVal[0].illegalBillId)
            }
            punishUserInfo(data).then(res => {
                if(res.status == 200) {
                    this.punishUserinfo = res.data;
                    if(this.punishUserinfo.jobType) {
                        this.punishUserinfo.jobType = String(this.punishUserinfo.jobType);
                    }
                }
            }).catch(err => {
                console.log('违规处罚管理:违规管理 处罚人员信息 order/puniManagement/components/punishlist.vue', err);      
            })
        },
      

        // 生成处罚单下的处罚人
        listPunishPeople() {
            let data = {
                illegalBillId: this.elsectVal[0].illegalBillId,
            }
            listPunishPeople(data).then(res => {
                if(res.status == 200) {
                    this.punishList = res.data.rows; 
                    console.log(this.punishList,"this.punishList");
                    
                }
            }).catch(error => {
                console.log('违规处罚管理:违规管理 生成处罚单 order/puniManagement/components/punishlist.vue', error);    
            })
        },

        
        subminbtn() {
            if(this.isrecord) { // 处罚单记录里面的导出按钮
                this.$emit("close-dialog");
                return;
            }


        },
        // 处罚单弹出框的提交按钮
        submitPunish() { 
            createPunishBill(data).then(res =>{
                if(res.status == 200){
                    this.$message({
                        message: '处罚单生成成功',
                        type: 'warning'
                    });
                }
            }).catch(error =>{
                console.log('违规处罚管理:违规管理 order/puniManagement/components/punishlist.vue', error);
            })
            
            // "illegalBillId":"违规单ID",
            // "punishBillSn": "处罚单号",
            // "createTime": "开单日期",
            // "punishDept": "被处罚部门",
            // "punishId": "被处罚人ID",
            // "punishJob": "被处罚人职位",
            // "contractSerialNumber": "客户合同号",
            // "punishReason": "处罚理由（详细）",
            // "punishFormula": "处罚金额计算公式",
            // "punishMoney": "处罚金额"
        },
        // 处罚单弹出框的取消按钮
        cancel() {
            if(this.isrecord) {
                this.$emit("close-dialog");
                return;
            }
        },
    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
    .punish{
        width: 100%;

           
            .punishTop{
                margin-bottom: 10px;
                display: flex;
                flex-wrap: nowrap;
                justify-content: flex-start;
                align-items: center;
                .el-input {
                    width: 30%;
                }
                span{
                    min-width: 120px;
                    vertical-align: middle;
                    text-align: center;
                }
            }
            .orderbox{
                width: 100%;
                font-size: 14px;
                border-top: 1px solid #e4e4e4;
                border-left: 1px solid #e4e4e4;
                .punishlsit{
                    display: flex;
                    li{
                        padding: 0px 10px;
                        // display: flex;
                        // align-items: center;
                        // justify-content: center;
                        border-right: 1px solid #e4e4e4;
                        border-bottom: 1px solid #e4e4e4;
                        height: 36px;
                        line-height: 36px;
                        box-sizing: border-box;
                        width: 140px;
                        white-space:nowrap;
                        text-overflow: ellipsis;
                        text-align: center;
                        overflow: hidden;
                        &:nth-of-type(2),&:nth-of-type(5),&:nth-of-type(4){
                            flex: 1;
                            text-align: center;
                            // display: -webkit-box;
                            // -webkit-box-orient: vertical;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            overflow: hidden;
                        }
                        .el-input__inner {
                            appearance: none;
                            border: 0px;
                        }
                        
                    }
                    &:nth-of-type(2) {
                        li {
                            color: #999;
                        }
                    }
                }
            }
        .foot_button {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-top:20px;
        }

        

    }
    
    
</style>

<style lang="scss"> 
.punishlsit{
    li{
        .el-input__inner {
            appearance: none;
            border: 0px;
        }
        .el-input-number .el-input__inner{
            text-align: left;
        }
    }

}
</style>


