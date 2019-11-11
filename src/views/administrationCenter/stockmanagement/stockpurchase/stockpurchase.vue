<template>
    <div class="addrecommender">
        <div class="head_nav">
            <!-- 导航栏 -->
            <breadcrumb :navList="navList"></breadcrumb>
        </div>

        <el-card class="lvs cards">
            <!-- 输入框集合 -->
            <stockform ref="stockform" @brand_change="brandChange"  @company_change="companyChange" @commodity_change="commodityChange" ></stockform>


            <!-- table  -->
            <div class="addgoods">
                <div class="iconBox m-bottom">
                    <i class="Icon"></i>
                    <span>选择商品</span>
                </div>
                <!-- :isExit="isExit" -->
                <stockTable ref="stockTable" :brandId="brandId" :commodityCategoryId="commodityCategoryId" :companyId="companyId" ></stockTable>
            </div>

        </el-card>

        <div class="bottom_btnlist">
            <!-- isView // 备货采购申请管理 查看备货申请 -->
            <!-- 只有修改是保存 新增都有 -->
            <el-button type="primary" @click="submitForm('ruleForm',0)"  v-if="!isView" :loading="btnLoading">保 存</el-button> 
            <el-button type="primary" @click="submitForm('ruleForm',4)"  v-if="!isEdit && !isView" :loading="btnLoading">提 交</el-button>
            <el-button @click="cancel" >取 消</el-button>
        </div>
    </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";


import stockform from "../components/stockform";
import stockTable from "../components/stockTable";

import spot from "@/assets/images/spot.png";
import { getUUID } from "api/pulicJava";
import { 
    addStockUpApply, // 新增备货申请
    editStockUpApply, // 修改的保存按钮
} from 'api/administrationCenter/stockmanagement/index';
import {
removeAccessoryImg, //删除图片
addAccessory, //新增图片
} from "@/api/order/recommender/recommender";

export default {
    components: {
        breadcrumb,
        pagination,
        stockform,
        stockTable
    },
    // name: 'brandmanagement',
    data() {
        return {
            isExit: false, // 品牌 品类 供应商是否改变
            applyCode: '',
            navList: [], //头部面包屑
            visible: false,
            isView: false,
            isEdit: false,
            btnLoading: false, // 按钮的loading Flag
            // 上传
            fileList: [],
            imgArr: [],
            delImgArr: [],
            brandId: '', // 品牌
            commodityCategoryId: '', // 品类
            companyId: '', // 供应商
        };
    },

    mounted() {
        // 头部面包屑
        this.navList = this.$route.meta;
        this.brandId = this.$refs.stockform.brandId; // 品牌
        this.commodityCategoryId = this.$refs.stockform.commodityCategoryId; // 品类
        this.companyId = this.$refs.stockform.companyId; // 供应商
    },
    created() {
        if(this.$route.path == "/stockmanagement/editstockpurchase") { // 备货采购申请管理 修改备货申请
            this.isEdit = true;
        } 
        if(this.$route.path == "/stockmanagement/viewstockpurchase") { // 备货采购申请管理 查看备货申请
            this.isView = true;
        }
    },
    watch: {

        // this.brandId = this.$refs.stockform.brandId; // 品牌

        // this.commodityCategoryId = this.$refs.stockform.commodityCategoryId; // 品类
        // this.companyId = this.$refs.stockform.companyId; // 供应商
    },
    methods: {
        // 品类
        commodityChange(val,isExit) {
      
            this.commodityCategoryId = val; // 品类
            this.$refs.stockTable.tabList = []; 
            this.$refs.stockTable.$refs.stockTable.clearSelection();
        }, 
        // 品牌
        brandChange(val,isExit) {
      
            this.brandId = val; // 品牌
            this.$refs.stockTable.tabList = []; 
            this.$refs.stockTable.$refs.stockTable.clearSelection();
        },  
        // 供应商
        companyChange(val,isExit) {
      
            this.companyId = val;
            this.$refs.stockTable.tabList = []; 
            this.$refs.stockTable.$refs.stockTable.clearSelection();
        }, 



        // 保存 and 提交
        submitForm(formName,type) {
            if(this.$refs.stockTable.tabList.length == 0) {
                this.$message.warning("请选择商品");
                return;
            }
            
            // 附件
            // let stockUpApplyFile = this.$refs.stockform.imgArr.map(file => {
            //     return {
            //         fileUrl: file.url,
            //         sourceName: file.name
            //     };
            // });

            //  if(this.isEdit && type == 0) {

            //     if ( this.$refs.stockform.delImgArr.length > 0) {
            //         //有删除旧图片
            //         console.log("有删除旧图片",this.$refs.stockform.delImgArr);
            //         this.$refs.stockform.delImgArr.forEach(item => {
            //             removeAccessoryImg(item).then(res => {});
            //         });
            //     }

            //     this.$refs.stockform.imgArr.forEach(item => { // 编辑新增
            //         if (!item.accessoryId) {
            //             let data = {
            //                 dataSourceId: this.orderApplyRefundId,
            //                 sourceName: item.name,
            //                 fileUrl: item.url,
            //                 dataSourceEnum: "OrderApplyRefund"
            //             };
            //             addAccessory(data).then(res => {}).catch(error => {
            //                 console.error("新增图片", error);
            //             });
            //         }
            //     });
            //  }
            let flag = this.$refs.stockTable.tabList.every(item => {
                let flag1 = false;
                let flag2 = false;
                let flag3 = false;
                 
                if(item.commoditycolourList.length != 0) { // 颜色
                    if(item.commodityColourId) {
                        flag1 = true;
                    }
                }else {
                    flag1 = true;
                }

                if(item.commoditymaterialList.length != 0) { // 材质
                    if(item.commodityMaterialId) {
                        flag2 = true;
                    }
                }else {
                    flag2 = true;
                }

                if(item.commodityseriesList.length != 0) { // 系列
                    if(item.commoditySeriesId) {
                        flag3 = true;
                    }
                }else {
                    flag3 = true;
                }

                return flag1 && flag2 && flag3;
            })

            if(flag) { // 每一个商品的材质颜色系列有可选项并且选中了

            }else {
                this.$message.warning("请添加商品的材质颜色系列");
                return;
            }

            let purnumFlag = this.$refs.stockTable.tabList.every(item => {
                if(item.purchaseNumber < 1) {
                    return false;
                }else {
                    return true;
                }

                // return item.purchaseNumber;
            });

            if(purnumFlag) { // table的每一个purchaseNumber都有

            }else {
                this.$message.warning("数量不得为空或者小于1");
                return;
            }

            let stockUpApplyId = null;
            if(this.$route.path == "/stockmanagement/editstockpurchase") {
                stockUpApplyId = this.$route.query.stockUpApplyId; // id 如果是修改  就有id
            }
            
            this.$refs.stockform.$refs.ruleForm.validate((valid) => {
                if (valid) {
                    let data = {
                        // applyOrganizationId:  this.$refs.stockform.purchase.applyOrganizationId, // 申请机构id 
                        // applyUserId :  this.$refs.stockform.purchase.applyUserId , // 申请人ID
                        
                        // applyCode: this.applyCode,
                        ...this.$refs.stockform.purchase,
                        applyCode: this.isEdit ? this.$refs.stockform.purchase.applyCode : this.applyCode, // 申请单号
                        predictArrivalTime:  this.$refs.stockform.purchase.predictArrivalTime, // 预计到货开始时间 
                        brandId:  this.$refs.stockform.purchase.brandId , // 品牌ID  
                        commodityCategoryId:  this.$refs.stockform.purchase.commodityCategoryId , // 品类ID  
                        supplierId:   this.$refs.stockform.purchase.companyId , // 供应商ID  
                        // applyRemark: this.$refs.stockform.purchase.applyRemark, // 申请理由
                        // stockUpApplyFile, // 附件集合
                        addGoodsList:  this.$refs.stockTable.tabList, // 商品列表
                    };

                    this.btnLoading = true;

                    if(this.isEdit && type == 0) {
                        data.stockUpApplyId = stockUpApplyId;
                        data.applyStatus = this.$route.query.applyStatus;

                        editStockUpApply(data).then(res => {
                            if(res.status == 200) {
                                // if ( this.$refs.stockform.delImgArr.length > 0) {
                                //     //有删除旧图片
                                //     console.log("有删除旧图片",this.$refs.stockform.delImgArr);
                                //     this.$refs.stockform.delImgArr.forEach(item => {
                                //         removeAccessoryImg(item).then(res => {});
                                //     });
                                // }

                                // this.$refs.stockform.imgArr.forEach(item => { // 编辑新增
                                //     if (!item.accessoryId) {
                                //         let data = {
                                //             dataSourceId: this.orderApplyRefundId,
                                //             sourceName: item.name,
                                //             fileUrl: item.url,
                                //             dataSourceEnum: "OrderApplyRefund"
                                //         };
                                //         addAccessory(data).then(res => {}).catch(error => {
                                //             console.error("新增图片", error);
                                //         });
                                //     }
                                // });


                                this.$message({
                                    message: '操作成功',
                                    type: 'success'
                                });
                                this.btnLoading = false;
                                this.$router.push("/stockmanagement/stockpurchase"); // 跳转到采购申请页面
                            }
                        }).catch(err => {
                            this.btnLoading = false;
                            console.log('备货采购申请管理 备货管理 新增备货申请 views/stockmanagement/stockpurchase/stockpurchase', err);
                        })
                    }else {
                        getUUID({serialNumber: 'PR'}).then(res => {
                            if(res.status == 200) {
                                data.applyStatus =  Number(type), // 新增的保存和提交按钮 如果是编辑页面就是null
                                data.applyCode = res.data;

                                // console.log(JSON.stringify(data),"databsfbjn");
                                
                                addStockUpApply(data).then(res => {
                                    if(res.status == 200) {
                                        this.$message({
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                        this.btnLoading = false;
                                        this.$router.push("/stockmanagement/stockpurchase"); // 跳转到采购申请页面
                                    }
                                }).catch(err => {
                                    this.btnLoading = false;
                                    console.log('备货采购申请管理 备货管理 新增备货申请 views/stockmanagement/stockpurchase/stockpurchase', err);
                                })
                            }
                        }).catch(err => {
                            this.btnLoading = false;
                            console.log('申请:退款管理 总申请 marketing/components/application/components/refundapply.vue', err);    
                        })
                    }

                } else {
                    return false;
                }
            });
        },
        // 取 消
        cancel() {
            this.$router.push("/stockmanagement/stockpurchase"); // 跳转到采购申请页面
        },
    }
};
</script>
<style scoped lang='scss'>
.cards {
    margin-top: 20px;
    .bordermodel {
        border: 1px solid #e6e6e6;
        margin-top: 20px;
        padding: 10px 0px;

       
        .upload-demo {
            padding: 20px 60px;
        }
    }
}

.bottom_btnlist {
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: center;
    // border: 1px solid red;
}

        .textitle {
            display: flex;
            justify-content: space-between;
            font-size: 14px;
            // 标题
            .titleborder {
                margin:0 20px ;
                font-size: 18px;
                position: relative;
                font-weight: 500;
                color: #006ec7;
                top: 0px;
                &::after {
                    content: "";
                    display: block;
                    width: 4px;
                    height: 15px;
                    background: #006ec7;
                    position: absolute;
                    left: -16px;
                    top: 50%;
                    border-radius: 5px;
                    transform: translateY(-50%);
                }
            }
        }


</style>

