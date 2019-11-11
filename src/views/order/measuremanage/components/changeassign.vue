<template>
    <div class="changeassign">
        <el-dialog
            title="指派测量设计"
            custom-class="customDialogTitle"
            :visible.sync="dialogvisibletwo"
            :before-close="handleDialogClose" 
            width="65%">
            <div>
                <div>
                    <div class="orderfrom">
                        <el-form :label-position="labelPosition" 
                            label-width="130px" 
                            :model="assignmeasuredata" 
                            class="demo-form-inline">
                            <el-form-item label="所属门店">
                                <el-input v-model="assignmeasuredata.storeName" disabled size="medium"></el-input>
                            </el-form-item>
                            <el-form-item label="所属销售员/业务员">
                                <el-input v-model="assignmeasuredata.salesmanName" disabled size="medium"></el-input>
                            </el-form-item>
                            <el-form-item label="订单号">
                                <el-input v-model="assignmeasuredata.orderNumber" disabled size="medium"></el-input>
                            </el-form-item>
                            <el-form-item label="预计订单金额">
                                <el-input v-model="assignmeasuredata.orderExpectMoney" disabled size="medium"></el-input>
                            </el-form-item>
                            <el-form-item label="客户姓名">
                                <el-input v-model="assignmeasuredata.customerName" disabled size="medium"></el-input>
                            </el-form-item>
                            <el-form-item label="客户电话">
                                <el-input v-model="assignmeasuredata.customerPhone" disabled size="medium"></el-input>
                            </el-form-item>
                            <el-form-item label="地址">
                                <el-input v-model="assignmeasuredata.address" disabled size="medium"></el-input>
                            </el-form-item>

                            <el-form-item label="指派类型">
                                <el-select v-model="assignedType" placeholder="请选择" size="medium" class="addresele width-100">
                                    <el-option v-for="item in options" :key="item.assignedType" :label="item.label" :value="item.assignedType"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="预计测量时间">
                                <div class="block">
                                    <el-date-picker 
                                        v-model="assignmeasuredata.assignedTime" 
                                        size="medium" type="datetime" 
                                        format='yyyy-M-dd HH:mm:ss'
                                        value-format='yyyy-M-dd HH:mm:ss'
                                        placeholder="选择日期" 
                                        class="selewi">
                                    </el-date-picker>
                                </div>
                            </el-form-item>
                            <el-form-item label="指派人员">
                                 <el-select v-model="Employee" placeholder="请选择" class="width-100" @change='designatedFun'>
                                    <el-option
                                    v-for="item in employeeList"
                                    :key="item.id"
                                    :label="item.username"
                                    :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="人员工号">
                                <el-input v-model="Employee1" size="medium" :disabled="true"></el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="fromtwo">
                        <el-form ref="form" label-width="130px" :model="assignmeasuredata">
                            <el-form-item label="备注">
                                <el-input type="textarea" v-model="remark"></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <el-checkbox v-model="isInform">通知客户</el-checkbox>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>


            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subminbtntask">提 交</el-button>
                <el-button @click="subminbtn">取 消</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import { addOrderAssignedMeasure, listOrganization,listUserPost } from 'api/order/measuremanage/measuremanage';
  export default {
    data() {
        return {
            selectedOptions: "",
            assignmeasuredata:{},
            assignedType:"",
            remark: "",
            isInform: false,
            labelPosition: 'right',
            options: [
                {assignedType: '0',label: '测量'}, 
                {assignedType: '1',label: '设计'}, 
                {assignedType: '2',label: '测量和设计'}
            ],
            employeeList:[],
            Employee:'',
            Employee1:''
        };
    },
    props: {
        'dialogvisibletwo':Boolean
    },
    created() {

    
    },
    mounted() {
    },
    methods: {
        staff(assignmeasuredata){
            let data={
                storeId:assignmeasuredata.storeId,
                dataCode:'YWY'
            }
           
            listUserPost(data).then(res=>{
                this.employeeList=res.data
            }).catch(error=>{
                console.error('员工',error)
            })
        },
        designatedFun(){
             this.Employee1=this.employeeList.filter(item=>{
               return item.id==this.Employee
            })[0].number
        },
        handleDialogClose(){
            this.$emit("assignmeasurefun");
        },
        subminbtn(){
            this.$emit("assignmeasurefun");
        },
        subminbtntask(){
           
        },
    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
    .changeassign{
        .orderfrom{
            margin-top: 10px;
            padding: 0px 70px 0px 20px;
        }
        .fromtwo{
            padding: 0px 70px 0px 20px;
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
            width: 45%;
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
        .selewi{
            width: 100%;
        }
    }
</style>

