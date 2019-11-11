<template>
    <div class="measuredetails">
        
      <disposal></disposal>
    </div>
</template>

<script>
import disposal from "../components/disposal";


import breadcrumb from "@/views/components/breadcrumb";
import orderdetail from "../components/orderdetail";
import contractdetails from "../components/contractdetails";
import addcomplain from "../components/addcomplain";
import violainformation from "../components/violainformation";
import { editOrderAssignedMeasure } from 'api/order/measuremanage/measuremanage';

export default {
    components: {
        breadcrumb,
        orderdetail,
        contractdetails,
        addcomplain,
        violainformation,
        disposal
    },
    data() {
        return {
            addcomplaindata: {
                assignedMeasureId: this.$route.query.id,
                customerId: this.$route.query.customerId,
                dealResult: "",
                reportTime:"",
                isRetest: "",
                isScene: "",
                customerAddressId: "",
                taskResult: "",
                enclosures: [],
                oldCustomerAddressId:this.$route.query.customerAddressId,
                customerAddress:{}
            },
            rateList: [
                {label: "张海霞",value:"1"},
                {label: "王就就",value:"2"},
            ],
            typeList:  [
                {label: "张海霞",value:"1"},
                {label: "王就就",value:"2"},
            ],
            orderId:Number(this.$route.query.orderId),
            customerId:Number(this.$route.query.customerId),
            isShow: true,
            navList: [],
            punish: {},
        };
    },
    props: [],
    mounted() {
        // 头部面包屑
        this.navList=this.$route.meta;
    },
    methods: {
        cancel(){
            this.$router.go(-1)
        },
        subminbtn(addcomplaindata){
           this.$refs.address.confirm(true)  
        },
        editOrderFun(addcomplaindata){
            console.log(addcomplaindata);
            
            editOrderAssignedMeasure(addcomplaindata).then(res =>{
                if(res.status === 200){
                    // console.log("测量汇报成功")
                    this.$message.success('测量汇报成功')
                    this.$router.push({path:'measuremanage'})
                }
            }).catch(error =>{
                console.log('指派测量:测量汇报提交 order/measuremanage/measuredetails.vue', error);  
            })
        }
    },
    computed: {}
};
</script>

<style lang="scss" scoped>
    .measuredetails{
        .tapbox{
            padding: 10px 200px;
            border-radius: 2px;
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
        }
        .addmeas{
            padding: 0px 200px;
        }
        .boxtit{
            background: #f5f5f5;
            padding: 10px 20px;
            color: #333333;
            font-size: 14px;
            margin: 20px 0px;
        }
    }

     .orderlsit{
            display: flex;
            li{
                padding: 0px 10px;
                display: flex;
                align-items: center;
                text-align:center;
                vertical-align: middle;
                border: 1px solid #e4e4e4;
                line-height: 2.2;
                &:nth-child(odd){
                    width: 120px;
                    text-align: center;
                    display: -webkit-box;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
                &:nth-child(even){
                    flex: 1;
                    color: #999;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                    display: block;
                }
                // 关联附属订单样式
                &.orderclas{
                    display: flex;
                    align-items: center;
                    span{
                        &:nth-child(odd){
                            color: #5F71E7;
                        }
                        &:nth-child(even){
                            color: #E50E0F;
                            margin-right: 10px;
                        }
                    }
                }
            }
        }
    
</style>

