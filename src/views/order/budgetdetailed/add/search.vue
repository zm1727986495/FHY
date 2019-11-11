<template>
    <div class="search">
        <!-- <div class="titlecal" v-if=" this.$route.query.orderGoodsType == 2 &&this.$route.path == '/ordermm/signcontract' || this.$route.path == '/ordermm/addTranslate' || this.$route.path == '/ordermm/editBudgetList'">预算清单：{{budgetNumber}}</div> -->
        <!-- <div class = "search_item flex-div" v-if="this.$route.query.orderGoodsType == 2 && this.$route.path == '/ordermm/signcontract' || this.$route.path == '/ordermm/addTranslate' || this.$route.path == '/ordermm/editBudgetList'">
            <span>版本名称</span>
            <el-input class="width-100"  placeholder="预算清单本名称" v-model="budgetName"  size="small" maxlength="50">
                <i slot="suffix" class="el-input__icon el-icon-search"></i>
            </el-input>
        </div> -->
        <!-- <div class="h-width"></div> -->
        <div class="pricingProposal flex-div">
            <div class = "flex-div search_item">
                <el-checkbox v-model="checked" @change="editBudgeChecked"></el-checkbox>
                <span>商品售价:</span>
                <el-select v-model="priceValue" placeholder="请选择售价" size="small" >
                        <el-option
                            v-for="item in priceSecet"
                            :key="item.priceStrategyId"
                            :label="item.priceName"
                            :value="item.priceStrategyId">
                        </el-option>
                </el-select>  
            </div>
            <!-- <div class="m-left10">
                <span class="m-right10">优惠方式:</span>
                <template>
                        <el-radio-group v-model="radio" @change="discountRadio" class="addSearch">
                            <el-radio  :label="0">活动</el-radio>
                            <el-radio  :label="1">特批折扣</el-radio>
                        </el-radio-group>
                </template>
            </div> -->
            <div class="discount flex-div" v-if="isActivityPackage == 0">
                <div class="title-font">可选活动:</div>
                <el-select  v-model="value" @change="activeSelect" placeholder="可参与活动" size="small" class="width-100 m-right10">
                        <el-option
                            v-for="item in ruleList"
                            :key="item.activityId"
                            :label="item.activityName"
                            :value="item.activityId">
                        </el-option>
                </el-select>  
                <el-input  v-model="ruleACtive" @click.native="showdialogVisible" placeholder="查看'优惠'规则" size="small" class="width-100"  :readonly="true">
                </el-input>
            </div>
            
        <el-popover
        width="400"
        placement="bottom"
        v-if="value != ''"
        trigger="click">
            <div v-html="activeDetails" class="activeDetailsHtml"></div>
            <el-button size="small"  class="m-left10"  slot="reference">查看活动详情</el-button>
        </el-popover>
            <!-- <div class="discount flex-div" v-if="isActivityPackage == 1">
                <div class="title-font">特批折扣</div>
                <el-input class="discount-input" v-model="discountNum"></el-input>
                <div style="margin-right:10px;">折</div>
                <el-button type="primary" plain size="small" class="discount-button">刷新</el-button>
                <el-button type="primary" plain size="small" class="discount-button">特批申请</el-button>
            </div> -->
        </div>
        <!-- <div class="flex-div" v-if="isActivityPackage == 0">
            <div class="title-font">计算方式:</div>  
            <el-input class="activity-input" v-model="calculateWay"></el-input>
        </div> -->
        <el-dialog
        title="查看优惠规则"
        :visible.sync="dialogVisible"
        :close-on-press-escape="false"
        :close-on-click-modal="false"
        :show-close="false"
        width="30%"
        >
        <div class="ruleModel">
            <el-tree
            :data="rule"
            ref="tree"
            node-key="id"
            @check="treeChange"
            >
            </el-tree>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button @click="colseTree()">取 消</el-button>
            <el-button type="primary" @click="dialogShow()">确 定</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters ,mapMutations, mapActions} from 'vuex';
import { orderDetails } from 'api/order/order/order';
import { listActivity, listPriceStrategy, listCommodityActivityRule, getActivityDetail } from "@/api/order/budgetdetailed/budgetdetailed";
export default {
    data(){
        return {
            budgetName:'',//预算清单名称
            budgetNumber:'',//预算清单编号
            radio: 0,//单选
            radioisActivityPackageShow:0,//优惠套件显示
            ruleList:[],//活动列表数据
            value: "",//活动列表Change选中数据
            priceValue:'',//商品售价选中数据
            priceSecet:[],//价格策略接口数据
            discountNum:0,
            dialogVisible: false,//弹框判断
            rule:[],//活动规则
            selectShows:true,
            num:0,//tree数据选中的数量
            ruleACtive:'',//活动规则文本展示数据
            ruleData: '',//活动规则勾选数据
            calculateWay: '', //计价方式
            isActivityPackage: 0, //是否为特批折扣
            activeDetails: '',
            checked: false,//房间全选
        }
    },
    created(){
        // this.acquisition();//活动列表查询
        this.priceList();
    },
    props: ["orderId"],
    mounted() {
        this.getOrder();
        this.priceListItem();
    },
    methods:{
        ...mapMutations([
            'SET_RULESTTING' 
        ]),
        ...mapActions([
            'getCommodity',
            'activeRuleList',
            'priceList'
        ]),
        /**
         * 获取订单详情
         * @method getOrder
         */
        getOrder(){
                orderDetails({orderId: this.$route.query.orderId}).then(res =>{
                    if(res.status == 200){
                        // this.detaildata = res.data;
                        // this.priceList(res.data.storeId);
                    }
                }).catch(error =>{
                    console.log('订单管理:订单相关信息获取 order/order/order.vue', error);
                })
        },
        /**
         * 回显设置预算清单 名称 编号
         * @method setName
         * 名称
         * @param item
         * 编号
         * @param number
         * 是否为特批折扣
         * @param radio
         * 是否显示活动规则 或 特批折扣申请
         * @param isActivityPackage
         * 已选商品活动
         * @param value
         * 计算方式
         * @param calculateWay
         * 价格策略
         * @param priceStrategyId
         */
        setName(date){ 
            this.budgetName = date.versionName;
            this.budgetNumber = date.budgetNumber;
            this.radio = Number(date.isActivityPackage);
            this.isActivityPackage = date.isActivityPackage;
            this.value = date.activityId ?  Number(date.activityId) : null;
            this.calculateWay = date.calculateWay;
            this.priceValue = Number.isInteger(date.priceStrategyId) ?  date.priceStrategyId : '请选择' ;
            this.activeSelect(this.value);
        },
        /**
         * 优惠方式
         * @method discountRadio 
         */
        discountRadio(item){
            this.isActivityPackage = item;
        },
        /**
         * 活动列表查询
         * @method acquisition 
         */
        acquisition() { 
            listActivity({orderId: this.$route.query.orderId}).then(res =>{       
                this.ruleList = res.data;
            }).catch(error =>{
                console.error('新增预算清单 活动列表查询 order/budgetdetailed/add/addTranslate', error) 
            })            
        },
        /**
         * 获取活动详情
         * @method getActiveInfo
         */
        getActiveInfo(item){
            getActivityDetail({activityId: item}).then(res=>{
                // this.activeDetails = res.data.imageText;
            })
        },
        /**
         * 房间全选
         * @func
         */
        editBudgeChecked(val){
            this.$emit('getSeach', val);
        },  
        /**
         * 将已选活动存入 vuex
         * @method  activeSelect 
         */
        activeSelect(item){
            let type = false;
            // this.SET_RULESTTING(item);
            this.commodity.length > 0 ? type = true : type = false;
            let acitve ={
                activeId: item,
                type: type
            } 
            // this.activeRuleList(acitve);//活动规则查询
            this.getActiveInfo(item);
            // if (this.commodity.length > 0 ) {//判断vuex是否存有已选商品 调用获取商品活动范围接口
            //         this.getCommodity();
            // }  
        },
        /**
         * 处理Tree数据
         * @method itemTree 
         */
        itemTree(){
            this.rule = this.ruleSunning.map((item, index) => {
                    return {id: item.activityRuleId, label:item.ruleName, ruleType:item.ruleType, disabled:false,}
            })
            // this.ruleACtive = '';
        },
        /**
         * 弹框显示
         * @method showdialogVisible 
         */
        showdialogVisible(){
            if(this.value == '') {
                this.$message({
                message: '请选择参与活动',
                type: 'warning'
                });        
                return         
            }
            this.dialogVisible = true;
        },
        /**
         * 获取价格策略
         * @method priceList 
         */
        priceListItem(val){
            // let types = 0;
            // listPriceStrategy({type:types}).then(res => {
                if(val){
                    this.priceSecet = val;
                    this.priceValue = this.priceSecet[this.priceSecet.length-1].priceStrategyId;
                }
            // }).catch(error =>{
            //     console.error('新增预算清单 获取价格策略 order/budgetdetailed/add/addTranslate', error) 
            // })
        },
        /**
         * 活动规则Tree数据Change事件
         * @method treeChange 
         */
        treeChange(item, items){
            this.num = items.checkedKeys.length;
            if (item.ruleType == 5){
                items.checkedNodes = [item];
                this.rule.forEach(el => {//如果选择套餐 其它活动全部置灰
                    if ( el.ruleType != 5 ) {
                        this.$refs.tree.setChecked(el.id, false);
                        el.disabled = true;
                    }else {
                        el.disabled = false;
                    }
                });
                this.num = 1; 
            }
            if(items.checkedKeys.length == 0) {
                items.checkedNodes= [];
                this.rule.forEach(el => {//取消选中套餐 其它活动全部恢复
                     el.disabled = false;
                });  
                this.num = 0;              
            }
            // this.ruleACtive = `已选择${this.num}种优惠`;
            // this.ruleACtive = "查看'优惠'规则";
            this.ruleData = items.checkedNodes;
            this.parentChecked(this.ruleData);
        },
        /**
         * 批量设置活动规则
         * @method parentChecked
         */ 
        parentChecked(item){
            let array = item.map(res =>{
                return res.id;
            })
            this.$parent.childreItem(array);
        },
        /**
         * 弹框确定事件 判断是否勾选tree选项
         * @method dialogShow 
         */
        dialogShow(){
            if (!this.num){
                this.$message({
                    message: '请勾选优惠规则',
                    type: 'warning'
                });
            } else {
                this.dialogVisible = false;                
            }
        },
        /**
         * 关闭tree弹框 所有tree选中数据全部清空 置灰恢复
         * @method colseTree 
         */
        colseTree(){
            this.rule.forEach(el => {
                this.$refs.tree.setChecked(el.id, false);
                el.disabled = false;
            });
            this.ruleData = [];
            this.num = 0;
            // this.ruleACtive = `已选择${this.num}种优惠`;
            // this.ruleACtive = "查看'优惠'规则";
            this.dialogVisible = false;    
            this.$parent.childreItem([]);
        },      
    },
    computed:{
        ...mapGetters([
            'commodity',
            'ruleStting',
            'ruleSunning',
            'priceLists'
            ])
    },
    watch: {
        /**
         * 当选择活动变换时 重新处理活动会规则数据
         * @method  ruleSunning  
         */
        ruleSunning(){ 
            this.itemTree();
        },
        priceLists(val){
            this.priceListItem(val);
        }
    }

}
</script>
<style scoped>
.search{
    padding-bottom: 10px;
    border-bottom: 1px solid #d9d9d9;
}
.titlecal {
    font-size: 18px;
    line-height: 1;
    position: relative;
    font-weight: 500;
    color: #006EC7;
    padding-left: 15px;
    /* margin-bottom: 20px; */
}
.titlecal::before {
    content: " ";
    display: inline-block;
    width: 4px;
    height: 15px;   
    position: absolute;
    top: 10px;
    left: 0;
    margin-right: 10px; 
    background: #006EC7;
    border-radius: 5px;
    -webkit-transform: translateY(-50%);
    transform: translateY(-50%);
}
.search_item{
    width: 25%;
    cursor: pointer;
    position: relative;
    flex-wrap: nowrap;
    /* margin-right: 20px; */
}    
.ruleModel{
    max-height: 400px;
    overflow: auto;
}
.search_item span{
    min-width: 95px;
    text-align: right;
    padding-right: 10px;
}
.discount{
    /* position: absolute; */
    /* right: 40px; */
    font-size: 14px;
}
.title-font{
    min-width: 95px;
    text-align: right;
    padding-right: 10px;
}
.discount-input{
    width: 40px;
    margin: 0 15px;
}
.discount-button{
    margin-left: 10px;
}
.activeDetailsHtml{
    height: 400px;
    overflow: auto;
}
</style>


