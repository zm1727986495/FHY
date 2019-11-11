<template>
    <div class="tapesheetcompon">
        <!-- 查询条件组 -->
        <el-dialog title="新建带单" class="customDialogTitle" :visible.sync="tapesheetvisible" width="500px" :before-close="closefun">
            <el-form label-width="120px" :model="orderForm" :rules="rules" ref="orderForm" size="small" class="ruleForm">
                <!-- <el-form-item label="原订单号" prop="orderNumber">
                    <el-input placeholder="选择订单" v-model="orderForm.orderNumber" readonly @focus="orderTableDialog = true"></el-input>
                </el-form-item> -->
                <el-form-item label="被推介门店" prop="acceptStoreId">
                    <el-select v-model="orderForm.acceptStoreId" @change="getBrandAndCategoryList" clearable filterable>
                    <el-option v-for="item in recommendedStores" :key="item.value" :label="item.storeName" :value="item.storeId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="被推介门店品牌" prop="acceptBrank">
                    <el-select v-model="orderForm.acceptBrank" clearable filterable>
                    <el-option v-for="item in brandList" :key="item.brandId" :label="item.brandName" :value="item.brandId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="被推介门店品类" prop="acceptCategory">
                    <el-select v-model="orderForm.acceptCategory" clearable filterable>
                    <el-option v-for="item in categoryList" :key="item.commodityCategoryId" :label="item.categoryName" :value="item.commodityCategoryId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="备注">
                    <el-input v-model="orderForm.assistRemarks" type="textarea" placeholder="请输入备注"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subminbtn">确 定</el-button>
                <el-button @click="closefun">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
  import { 
      listAssistOrder, recommendedStores, recommendedStoreBrand, recommendedStoreCategory, addAssistOrder, editAssistOrderInfo, getAssistOrderInfo, deleteAssistOrder
   } from 'api/order/tapesheet/tapesheet'
  import { getUUID } from '@/api/pulicJava';

  export default {
    data() {
        return {
            orderForm: {
                customerId: '',
                orderId: '',
                acceptStoreId: '',
                acceptBrank: '',
                acceptCategory: '',
                assistNo: '',
            },
            categoryList: [],
            brandList: [],
            recommendedStores: [],
            rules: {
                acceptStoreId: [
                    { required: true, message: '请选择门店', trigger: 'change' }
                ],
                acceptBrank: [
                    { required: true, message: '请选择品牌', trigger: 'change' }
                ],
                acceptCategory: [
                    { required: true, message: '请选择品类', trigger: 'change' }
                ]
            },
        };
    },
    props: {
        tapesheetvisible: {
            type: Boolean,
        },
        tapesheetdata: {
            type: Object,
        }
    },
    created() {
      this.getRecommendedStores();
    },
    methods: {
        // resetForm(formName) {
        //     if (this.$refs[formName] !== undefined) {
        //         this.$refs[formName].resetFields();
        //     }
        // },
        subminbtn(){
            this.$refs.orderForm.validate(valid => {
                if (valid) {
                    getUUID({serialNumber: 'RD'}).then(response => {
                        this.orderForm.assistNo = response.data;
                        let params = {
                            ...this.orderForm,
                            ...this.tapesheetdata
                        }
                        addAssistOrder(params).then(response => {
                            if(response.status == 200){
                                this.$message.success('新增带单成功');
                                this.$emit("tapesheetclosefun", 1);
                            }else{
                                this.$message.warning(response.message);
                            }
                        }).catch(error => {
                            console.log('获取接单列表views/order/tapesheet/index-submitForm:' + error);
                        });
                    }).catch(error => {
                        console.log('views/order/tapesheet/index.vue-getUUID:' + error);
                    })
                } else {
                    return false;
                }
            });
            
        },
        // 关闭弹窗
        closefun(){
            this.$emit("tapesheetclosefun");
        },
        // 根据门店获取品牌和品类
        getBrandAndCategoryList(val) {
            this.orderForm.acceptCategory = '';
            this.orderForm.acceptBrank = '';
            this.brandList = [];
            this.categoryList = [];
            if (val) {
                let params = {
                    storeId: val
                }
                recommendedStoreBrand(params).then(response => {
                    this.brandList = response.data.rows;
                }).catch(error => {
                    console.log('获取接单列表views/order/tapesheet/index:getBrandAndCategoryList' + error);
                });
                recommendedStoreCategory(params).then(response => {
                    this.categoryList = response.data.rows;
                }).catch(error => {
                    console.log('获取接单列表views/order/tapesheet/index:getBrandAndCategoryList' + error);
                });
            }
        },
        // 获取被推介门店列表
        getRecommendedStores() {
            recommendedStores().then(response => {
                this.recommendedStores = response.data;
            }).catch(error => {
                console.log('获取带单列表views/order/tapesheet/index:getRecommendedStores' + error);
            })
        },
    },
  }
</script>
<style lang="scss" scoped>
.tapesheetcompon{
    
}
</style>

