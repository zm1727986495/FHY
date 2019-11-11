<template>
    <div class="demandassembly">
        <el-form :label-position="labelPosition" label-width="135px" :disabled="contractState" :model="customerDemand" class="demo-form-inline-two">
            <el-form-item label="房屋类型">
                <el-radio-group v-model="customerDemand.housingTypeId">
                    <el-radio :label="1">新房</el-radio>
                    <el-radio :label="0">老房</el-radio>
                </el-radio-group>
            </el-form-item>
            
            <el-form-item label="房屋户型">
                <el-select clearable filterable v-model="customerDemand.housingBuildTypeId" placeholder="请选择房屋户型" class="selewi" size="medium">
                    <el-option 
                        v-for="item in huxinglistdata" 
                        :label="item.dictName" :value="item.id" :key="item.value">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="交房日期">
                <div class="block">
                    <el-date-picker 
                        v-model="customerDemand.handoverDate" 
                        prefix-icon="el-icon-date"
                        value-format='yyyy-M-dd HH:mm:ss'
                        format='yyyy-M-dd HH:mm:ss'
                        size="medium" type="date" 
                        placeholder="选择日期" class="selewi"></el-date-picker>
                </div>
            </el-form-item>
            <el-form-item label="预计装修时间">
                <div class="block">
                    <el-date-picker v-model="customerDemand.estimatedDecorationTime" 
                        size="medium" type="date" 
                        prefix-icon="el-icon-date"
                        value-format='yyyy-M-dd HH:mm:ss'
                        format='yyyy-M-dd HH:mm:ss'
                        placeholder="选择日期" 
                        class="selewi"></el-date-picker>
                </div>
            </el-form-item>
            <el-form-item label="房屋总面积">
                <el-select clearable filterable v-model="customerDemand.totalAreaOfHousingId" placeholder="请选择活动区域" class="selewi" size="medium">
                    <el-option 
                        v-for="item in allsitdata" 
                        :label="item.dictName" :value="item.id" :key="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="装修房屋面积">
                <el-select clearable filterable v-model="customerDemand.decoratedHousingAreaId" placeholder="请选择活动区域" class="selewi" size="medium">
                    <el-option 
                        v-for="item in mianjlistdata" 
                        :label="item.dictName" :value="item.id" :key="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="装修进度">
                <el-select clearable filterable v-model="customerDemand.decorationProgressId" placeholder="请选择活动区域" class="selewi" size="medium">
                    <el-option 
                        v-for="item in jindulistdata" 
                        :label="item.dictName" :value="item.id" :key="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="装修预计完成时间">
                <div class="block">
                    <el-date-picker v-model="customerDemand.finishingTimeOfDecoration" 
                    size="medium" type="date" 
                    prefix-icon="el-icon-date"
                    value-format='yyyy-M-dd HH:mm:ss'
                    format='yyyy-M-dd HH:mm:ss'
                    placeholder="选择日期" class="selewi">
                    </el-date-picker>
                </div>
            </el-form-item>
            <el-form-item label="意向产品">
                <el-checkbox-group v-model="customerDemand.productId">
                    <el-checkbox v-for="(item, idx) in chanpdatalist" 
                        :label="item.id" :key="item.idx">{{item.dictName}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="意向风格">
                <el-checkbox-group v-model="customerDemand.styletId">
                    <el-checkbox v-for="(item, idx) in fenggdatalist" 
                        :label="item.id" :key="item.idx">{{item.dictName}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="备注" class="addressclas">
                <el-input type="textarea" v-model="customerDemand.remarks"></el-input>
            </el-form-item>

            <!-- <el-form-item label="进店次数">
                <el-select clearable filterable v-model="customerDemand.region" placeholder="请选择活动区域" class="selewi">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="进店时间">
                <el-input v-model="customerDemand.user" size="medium"></el-input>
            </el-form-item>
            <el-form-item label="进店时长">
                <el-select clearable filterable v-model="customerDemand.region" placeholder="请选择活动区域" class="selewi">
                    <el-option label="区域一" value="shanghai"></el-option>
                    <el-option label="区域二" value="beijing"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预算金额">
                <el-input v-model="customerDemand.user" size="medium"></el-input>
            </el-form-item> -->
        </el-form>
        
    </div>
</template>

<script>
import { listBaseDict } from "api/order/order/order"
  export default {
    data() {
        return {
            // customerDemand: {
            //     customerDemandId: "",//客户需求id
            //     housingTypeId: "",//房屋类型
            //     housingBuildTypeId: "",//房屋户型
            //     handoverDate: "",//交房日期,
            //     estimatedDecorationTime: "",//预计装修时间
            //     totalAreaOfHousingId: "",//房屋总面积
            //     decoratedHousingAreaId: "",//装修房屋面积
            //     decorationProgressId: "",//装修进度
            //     finishingTimeOfDecoration: "",//装修完成时间
            //     productId: [],//意向产品
            //     styletId: [],//意向风格
            //     remarks: "",//备注
            // },
            customerDemands: this.customerDemand,
            labelPosition: 'right',
            formInline: {
                user: '',
                region: '',
                type: [],
                resource: ""
            },
            value1: '',
            huxinglistdata: [],
            allsitdata: [],
            mianjlistdata: [],
            jindulistdata: [],
            chanpdatalist: [],
            fenggdatalist: [],
        };
    },
    filters: {
        fenge(val){
            return  val.split(",")
        }
    },
    created() {

        listBaseDict({dataType: "HOUSING_BUILD_TYPE"}).then(res =>{
            if(res.status == 200){
                this.huxinglistdata = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:基础字典查询房屋户型 order/components/demandassembly.vue', error);
        })

        listBaseDict({dataType: "HOUSING_AREA"}).then(res =>{
            if(res.status == 200){
                this.allsitdata = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:基础字典查询房屋总面积 order/components/demandassembly.vue', error);
        })

        listBaseDict({dataType: "HOUSING_AREA"}).then(res =>{
            if(res.status == 200){
                this.mianjlistdata = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:基础字典查询装修房屋面积 order/components/demandassembly.vue', error);
        })

        listBaseDict({dataType: "DECORATION_PROGRESS"}).then(res =>{
            if(res.status == 200){
                this.jindulistdata = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:基础字典查询装修进度 order/components/demandassembly.vue', error);
        })

        listBaseDict({dataType: "DEMAND_PRODUCT"}).then(res =>{
            if(res.status == 200){
                this.chanpdatalist = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:基础字典查询意向产品 order/components/demandassembly.vue', error);
        })

        listBaseDict({dataType: "DEMAND_STYLE"}).then(res =>{
            if(res.status == 200){
                this.fenggdatalist = res.data;
            }
        }).catch(error =>{
            console.log('订单管理:基础字典查询意向风格 order/components/demandassembly.vue', error);
        })

    },
    props: ["customerDemand", "contractState"],
    mounted() {
        
    },
    methods: {
        handleChange(val){
            console.log(val);
        },
        hideSearch(){
            this.isShow = !this.isShow;
        },
    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
    .demandassembly{
        .demo-form-inline-two{
            flex: 1;
            display: flex;
            justify-content: space-between;
            flex-wrap: wrap;
            padding: 20px 20px 0 0;
            .addressclas{
                width: 100%;
            }
        }
        .demo-form-inline-two>div{
            width: 45%;
        }
        .selewi{
            width: 100%;
        }
    }
</style>

