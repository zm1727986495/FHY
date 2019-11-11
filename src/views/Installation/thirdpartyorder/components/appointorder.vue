<template>
    <div class="appointorder">
        <!-- 查询条件组 -->
        <el-dialog title="指派部门" class="customDialogTitle" :visible.sync="appointdialogVisible" 
            width="600px" :before-close="closefun">
            <el-form :label-position="labelPosition" label-width="130px" class="demo_form_inline">
                <el-form-item label="服务方式" class="selewi">
                    <ul class="fromlistclas">
                        <li>
                            <el-checkbox v-model="checked" :disabled="selechange">仓储</el-checkbox>
                            <el-select v-model="fromdata.storehouseId" :disabled="!checked || selechange" placeholder="请选择仓储">
                                <el-option :label="item.storageName" :value="item.storageId" 
                                    v-for="item in storehouselist" :key="item.value"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <el-checkbox v-model="checked2" :disabled="selechange">安装</el-checkbox>
                            <el-select v-model="fromdata.installId" :disabled="!checked2 || selechange" placeholder="请选择安装">
                                <el-option :label="item.serveGroupName" :value="item.serveGroupId" 
                                    v-for="item in installist" :key="item.value"></el-option>
                            </el-select>
                        </li>
                        <li>
                            <el-checkbox v-model="checked3" :disabled="selechange">售后</el-checkbox>
                            <el-select v-model="fromdata.aftermarketId" :disabled="!checked3 || selechange" placeholder="请选择售后">
                                <el-option :label="item.serveGroupName" :value="item.serveGroupId" 
                                    v-for="item in aftermarketlist" :key="item.value"></el-option>
                            </el-select>
                        </li>
                    </ul>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subappoin">确 定</el-button>
                <el-button @click="closefun">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {
  listLoginServeGroup, thirdPartyDetails, listStorageByLogin,
  designateGroup, 
} from "api/Installation/thirdpartyorder/index";
export default {
    data() {
        return {
            fromdata: {
                storehouseId: "",
                installId: "",
                aftermarketId: "",
            },
            checked: false,
            checked2: false,
            checked3: false,
            selechange: false,
            labelPosition: 'right',
            installist: [],//安装列表
            aftermarketlist: [],//售后列表
            storehouselist: [],//仓库
            contractNumber: "",//合同号
            thirdOrderDetailId: "",//第三方订单id
            customerId: "",//客户id
            customerAddressId: "",//客户地址id
        };
    },
    props: ["appointdialogVisible", "orderId"],
    created() {
        //服务选项安装
        listLoginServeGroup({dataCode: "INSTALL_DEPARTMENT"}).then(res =>{
            if(res.status == 200){
                this.installist = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:订单列表 order/order/order.vue', error);
        })
        // 售后
        listLoginServeGroup({dataCode: "MAINTENANCE_DEPARTMENT"}).then(res =>{
            if(res.status == 200){
                this.aftermarketlist = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:订单列表 order/order/order.vue', error);
        })
        // 仓库
        listStorageByLogin().then(res =>{
            if(res.status == 200){
                this.storehouselist = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:订单列表 order/order/order.vue', error);
        })
        this.creafu();
    },
    methods: {
        subappoin(){
            if(this.selechange){
                this.$message.warning("该订单已不可指派部门");
                return false
            }
            if(this.checked && this.fromdata.storehouseId == ""){
                this.$message.warning("请选择仓储");
                return false
            }
            if(this.checked2 && this.fromdata.installId == ""){
                this.$message.warning("请选择安装");
                return false
            }
            if(this.checked3 && this.fromdata.aftermarketId == ""){
                this.$message.warning("请选择售后");
                return false
            }
            let data = {
                thirdOrderDetail: [
                    {
                        thirdOrderDetailId: this.thirdOrderDetailId,//第三方订单id
                        customerId: this.customerId,//客户id
                        customerAddressId: this.customerAddressId,//地址id
                        contractNumber: this.contractNumber,//合同号
                    }
                ],
                orderId: this.orderId,//订单id
                processModes: []
            };
            if(this.checked){
                let objs = {
                    processMode: 1,
                    sourceId: this.fromdata.storehouseId
                }
                data.processModes.push(objs)
            }
            if(this.checked2){
                let objs = {
                    processMode: 2,
                    sourceId: this.fromdata.installId
                }
                data.processModes.push(objs)
            }
            if(this.checked3){
                let objs = {
                    processMode: 3,
                    sourceId: this.fromdata.aftermarketId
                }
                data.processModes.push(objs)
            }
            console.log(data);
            designateGroup(data).then(res =>{
                if(res.status == 200){
                    this.$message.success("指派成功");
                    this.closefun()
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 order/order/order.vue', error);
            })

        },
        creafu(){
            thirdPartyDetails({orderId: this.orderId}).then(res =>{
                if(res.status == 200){
                    console.log(res, "回显");
                    let detilsdata = res.data;
                    this.contractNumber = detilsdata.contractNumber;//合同编号
                    this.thirdOrderDetailId = detilsdata.thirdOrderDetailId;//第三方订单id
                    this.customerAddressId = detilsdata.customerAddressId;//客户地址id
                    this.customerId = detilsdata.customerId;//客户id
                    if(detilsdata.processModes.length !== 0){
                        this.selechange = true;
                        detilsdata.processModes.forEach(item =>{
                            if(item.processMode == 1){
                                this.checked = true;
                                this.fromdata.storehouseId = item.sourceId
                            }
                            if(item.processMode == 2){
                                this.checked2 = false;
                                this.fromdata.installId = item.sourceId
                            }
                            if(item.processMode == 3){
                                this.checked3 = false;
                                this.fromdata.aftermarketId = item.sourceId
                            }
                        })
                    }
                }
            }).catch(error =>{
                console.log('订单管理:订单列表 order/order/order.vue', error);
            })
        },
        // 关闭弹窗
        closefun(){
            this.$emit("appointclosefun");
        },
    },
  }
</script>
<style lang="scss" scoped>
.appointorder{
    .fromlistclas{
        li{
            margin: 10px 0px;
        }
    }
}
</style>

