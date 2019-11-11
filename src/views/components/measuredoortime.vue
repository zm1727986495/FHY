<template>
    <div class="measuredoortime">
        <el-dialog title="确认上门时间" :visible.sync="dialogvisible" :before-close="handleDialogClose" custom-class="customDialogTitle" top='2vh' width="65%">
            <div>
                <div>
                    <div class="orderfrom">
                        <el-form :label-position="labelPosition" 
                            label-width="130px" 
                            :model="assignmeasuredata" 
                            class="demo-form-inline">
                            <el-form-item label="所属门店">
                                <el-input v-model="assignmeasuredata.storeName" size="medium" placeholder="DDBH0001" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="所属销售员/业务员">
                                <el-input v-model="assignmeasuredata.salesmanName" size="medium" placeholder="DDBH0001" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="订单号">
                                <el-input v-model="assignmeasuredata.orderNumber" size="medium" placeholder="DDBH0001" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="客户姓名">
                                <el-input v-model="assignmeasuredata.customerName" size="medium" placeholder="DDBH0001" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="客户电话">
                                <el-input v-model="assignmeasuredata.customerPhone" size="medium" placeholder="DDBH0001" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="地址" class="addresscl">
                                <el-input v-model="assignmeasuredata.address" placeholder="DDBH0001" disabled></el-input>
                                <!-- <div class="addrestxt">地址管理</div> -->
                            </el-form-item>
                            <!-- <el-form-item label="">
                                <el-input v-model="assignmeasuredata.address" placeholder="DDBH0001"></el-input>
                            </el-form-item> -->
                            
                            <el-form-item label="指派类型" class="widmax">
                                <el-select v-model="assignedType" placeholder="请选择" size="medium" class="addresele widmax" disabled>
                                    <el-option v-for="item in options" :key="item.assignedType" :label="item.label" :value="item.assignedType"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="预计测量时间">
                                <div class="block widmax">
                                    <el-date-picker 
                                    disabled
                                    v-model="assignmeasuredata.assignedTime" 
                                    type="date" 
                                    placeholder="选择日期"
                                    value-format='yyyy-M-dd HH:mm:ss'
                                    format='yyyy-M-dd HH:mm:ss'
                                    ></el-date-picker>
                                </div>
                            </el-form-item>
                            <el-form-item label="指派人员">
                                <el-input v-model="assignmeasuredata.salesmanName" placeholder="DDBH0001" disabled></el-input>
                            </el-form-item>
                            <el-form-item label="确认上门时间">
                                <div class="block widmax">
                                    <el-date-picker
                                     v-model="appointmentDoorTime" 
                                     type="datetime" 
                                     placeholder="选择日期"
                                     value-format='yyyy-M-dd HH:mm:ss'
                                    format='yyyy-M-dd HH:mm:ss'
                                     ></el-date-picker>
                                </div>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div class="fromtwo">
                        <el-form ref="form" :model="assignmeasuredata" label-width="130px">
                            <el-form-item label="备注：">
                                <el-input type="textarea" v-model="remark"></el-input>
                            </el-form-item>
                            <el-form-item label="">
                                <el-checkbox v-model="isInform">通知客户</el-checkbox>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
                <div class="tabbox">
                    <el-table border ref="multipleTable" :data="tableData" 
                        tooltip-effect="dark" style="width: 100%"
                        :row-class-name="tableRowClassName"
                        @selection-change="handleSelectionChange">
                        <el-table-column type="index" width="55" align="center" label="序号"></el-table-column>
                        <el-table-column prop="appointmentDoorTime" align="center" label="预约上门时间" width="200" show-overflow-tooltip> </el-table-column>
                        <el-table-column prop="appointmentId" align="center" label="预约人" width="80" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="appointmentTime" align="center" label="预约时间" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="status" align="center" label="状态" show-overflow-tooltip>
                            <template slot-scope="scope">
                                <!-- <span :class="[scope.row.status == 1 ? 'colred':'colgre']">{{scope.row.status == 1 ? '已取消' : '待上门测量'}}</span> -->
                                <span>{{scope.row.status == 0 ? "待测量" : scope.row.status == 1 ? "已失败" : "已成功"}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="remark" align="center" label="备注" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="dictName" align="center" label="未完成原因" width="200" show-overflow-tooltip></el-table-column>
                        <el-table-column prop="unfinishedReason" align="center" label="其他说明"></el-table-column>
                    </el-table>
                </div>

            </div>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subminbtn">保 存</el-button>
                <el-button @click="handleDialogClose">取 消</el-button>
            </span>
        </el-dialog>
    </div>

</template>

<script>
import { addOrderAssignedAppointment,listAppointmentByPage } from 'api/order/measuremanage/measuremanage';
  export default {
    data() {
        return {
            remark: '',
            assignedMeasureId: this.assignmeasuredata.assignedMeasureId,
            isInform: false,
            assignedType: this.assignmeasuredata.assignedType+"",
            labelPosition: 'right',
            value1: "",
            appointmentDoorTime: "",
            options: [
                {assignedType: '0',label: '测量'}, 
                {assignedType: '1',label: '设计'}, 
                {assignedType: '2',label: '测量和设计'}
            ],
            tableData:[],
            datas: {}
        };
    },
    props: ['dialogvisible','assignmeasuredata'],
    mounted() {
        console.log()
    },
    created() {
        let obj = {
            assignedMeasureId: this.assignedMeasureId,
        };
        listAppointmentByPage(obj).then(res =>{
            console.log(res,"预约时间列表查询");
            if(res.status === 200){
                this.tableData = res.data
            }
        }).catch(error =>{
            console.log('设计师预约上门:预约时间列表查询 src/views/components/measuredoortime.vue', error);          
        })
    },
    methods: {
        handleDialogClose(){
            this.$emit("measuredoorfun");
        },
        subminbtn(){
            let obj = {
                assignedMeasureId: this.assignedMeasureId,
                appointmentDoorTime: this.appointmentDoorTime,
                isInform: this.isInform?1:0,
                remark: this.remark,
            };
            
            if(obj.appointmentDoorTime==''){
                this.$message.error("请选择确认上门时间!")
               return 
            }
            addOrderAssignedAppointment(obj).then(res =>{
                if(res.status === 200){
                   this.$emit('measuredoorfun')
                }
            }).catch(error =>{
                console.log('设计师预约上门:设计师预约上门 src/views/components/measuredoortime.vue', error);          
            })
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        handleSelectionChange(){
            
        }
    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
    .measuredoortime{
        max-height:700px;
        overflow-y: auto;
        .el-form-item{
            margin-bottom:5px;
        }
        .orderfrom{
            margin-top: 10px;
            padding: 0px 70px 0px 20px;
        }
        .widmax{
            width: 100%;
            >div{
                width: 100%;
            }
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

        .addresscl{
            position: relative;
        }
        .addrestxt{
            font-size: 14px;
            position: absolute;
            right: -70px;
            top: 0px;
            color: #1ABC9C;
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
        .tabbox{
            margin-top: 20px;
            padding: 0px 70px;
        }
        .colred{
            color: #FF0000;
        }
        .colgre{
            color: #008000;
        }
    }
</style>

