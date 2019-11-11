<template>
    <div class="addTranslate">
        
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>       
            <!-- 订单编号组件 -->
            <div class="m-bottom">         
                <orderdetail ref='orders'></orderdetail>
            </div>
        <collapsecompoent>
            <div slot="titles">报价方案</div>
            <div slot="content">
                <!-- 搜索框组件 -->
                <search ref="addSercet"></search>
                <div class="allElection flex-div m-top10">
                    <el-checkbox v-model="checked"  style="margin-right:60px;">全选</el-checkbox>
                    <div class="operation">
                        <el-button size="small" class="button-96"  @click="addRooms()">新增房间</el-button>
                        <el-button size="small" class="button-96"  @click="rovmeRooms()">删除房间</el-button>
                        <el-button size="small" class="button-96" @click="choiceRoom('复制商品', 1)">复制</el-button>
                        <el-select v-model="value" placeholder="分类"  class="classification">
                            <el-option v-for="item in styleList" :key="item.value" 
                                :label="item.label" :value="item.value">
                            </el-option>
                        </el-select>
                        <el-button size="small" class="button-96" @click="choiceRoom('更换房间', 2)">更换房间</el-button>
                        <el-button size="small" class="button-96" @click="shopprevidw">清单预览</el-button>
                        <el-button size="small" class="button-96" @click="copyRomm()">复制房间</el-button>
                        <!-- <el-button size="small" class="button-96" @click="allSize">批量设置尺寸</el-button> -->
                        <!-- <el-button size="small" class="button-96" >批量设置颜色</el-button>
                        <el-button size="small" class="button-96" @click="getInfo()" >批量设置系列</el-button>
                        <el-button size="small" class="button-96" >批量设置材质</el-button> -->
                    </div>
                </div>
                <!-- <div class="h-width"></div> -->
                <budgetInfo v-if="value==0" class="classifGoods" :rommList="rommList"></budgetInfo>
                <div class="rooms" v-for="(item, index) in rommList" :key="index" v-show="value==1">
                <div class="h-width-top"></div>
                    <div class="rooms-heade">
                        <div class="rooms-heade-left">
                            <el-checkbox   v-model="item.checked"></el-checkbox>
                            <div>房间：</div>
                            <div>0{{item.roomCode + 1}}-</div>
                            <el-select v-model="item.roomId" filterable placeholder="房间"  class="classification">
                                <el-option
                                v-for="item in rooms"
                                :key="item.id"
                                :label="item.dictName"
                                :value="item.id">
                                </el-option>
                            </el-select> 
                            <el-input placeholder="房间备注" v-model="item.roomRemark"  size="small" class="classification"></el-input>
                            <el-button  class="m-left25" @click="commodityShow(index)"  type="primary" size="small" plain>选择商品</el-button>                  
                            <!-- <el-button  type="primary" size="small" plain>组套</el-button>                   -->
                            <el-button  type="primary" size="small" @click="removeCommodity(index)" plain>删除商品</el-button>                  
                            <el-button  type="primary" size="small" @click="copyFn()" plain>复制商品</el-button>                  
                            <el-button  type="primary" size="small" @click="roomShow(index)" plain>{{item.show== true ?'收起' : '显示'}}</el-button>                  
                        </div>
                        <div class="rooms-heade-right" >
                            <!-- v-if="item.activityPrice > 0" -->
                            <div class="rooms-heade-l">
                                <div class="subtotal">小计：</div>
                                <div class="activityPrice" >活动价：</div>
                            </div>
                            <div class="rooms-heade-r" >
                                <div class="subtotal line-through" style="color:#006ec6;"  >{{item.originalPrice.toFixed(2)}}</div>
                                <div  class="activityPrice" style="color:#ff0000;">{{item.discountsPrice.toFixed(2)}}</div>
                            </div>
                        </div>
                    </div>
                    <div class="h-width-bottom"></div> 
                    <vxe-table class="addTranslateTable"
                    :mouse-config="{selected: true}"
                    :keyboard-config="{isTab: true, isEdit: true}"  
                    :loading="tableLoding[index]"
                    v-show="item.show" row-key=true border max-height="400" stripe :edit-config="{trigger: 'click', mode: 'cell'}" 
                    @edit-closed="editChange" :tree-config="{children: 'childrenGoods', expandAll: true}" :data.sync="item.commodity">
                    <vxe-table-column align="center"  fixed="left">
                        <template slot-scope="scope">
                            <el-checkbox @change="checkClick(index, scope)" class="room-checkbox" v-model="scope.row.checked"></el-checkbox>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column tree-node field="commodityName" align="center" fixed="left" min-width=200 title="商品名称" resizable show-overflow="tooltip"></vxe-table-column>
                    <vxe-table-column field="amount" align="center" title="数量" min-width=70 :edit-render="{name: 'input'}"  resizable></vxe-table-column>
                    <vxe-table-column field="discountRate" align="center" title="折扣率" min-width=100 :edit-render="{name: 'input'}"  resizable></vxe-table-column>
                    <vxe-table-column field="nonParameter" align="center" title="非标系数" min-width=100 :edit-render="{name: 'input'}"  resizable></vxe-table-column>
                    <vxe-table-column field="onePrice" align="center" title="单价" min-width=110 >
                        <template slot-scope="scope">
                            <div size="medium">{{scope.row.onePrice.toFixed(2)}}</div>
                        </template>                    
                    </vxe-table-column>
                    <vxe-table-column field="sumPrice" align="center" title="小计" min-width=110 >
                        <template slot-scope="scope">
                            <div size="medium">{{scope.row.sumPrice.toFixed(2)}}</div>
                        </template>                    
                    </vxe-table-column>
                    <vxe-table-column field="discountPrice" align="center" title="活动价" min-width=150 >
                        <template slot-scope="scope">
                            <vxe-input type="number" v-model="scope.row.discountPrice" size="medium" @input="setPrice(scope.row.discountPrice)"></vxe-input>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="remarks" align="center" title="备注" min-width=300 :edit-render="{name: 'input'}"  resizable show-overflow="tooltip"></vxe-table-column>
                    <vxe-table-column field="commodityColourId" align="center" title="颜色" min-width=140>
                        <template slot-scope="scope">
                            <el-select v-model="scope.row.commodityColourId" placeholder="颜色"  class="classification"  @change="setColor(index,scope.row)">
                                <el-option
                                v-for="item in scope.row.commodityColorList"
                                :key="item.colourId"
                                :label="item.colourName"
                                :value="item.colourId">
                                </el-option>
                            </el-select> 
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="commodityModel" align="center" title="规格" min-width=200 resizable show-overflow="tooltip" v-if="isFinished"></vxe-table-column>
                    <vxe-table-column field="commodityModel" align="center" title="型号" min-width=200 resizable show-overflow="tooltip" v-if="isUnfinished"></vxe-table-column>
                    <vxe-table-column field="seriesName" align="center" title="系列" v-if="isUnfinished" min-width=140>
                    </vxe-table-column>
                    <vxe-table-column field="materialName" align="center" title="材质" min-width=140 v-if="isUnfinished">
                    </vxe-table-column>
                    <vxe-table-column field="valuationMethod" align="center" title="计价方式" min-width=90 ></vxe-table-column>
                    <vxe-table-column field="classifyName" align="center" title="商品分类" min-width=180 resizable show-overflow="tooltip"></vxe-table-column>
                    <vxe-table-column field="commodityWide" align="center" title="宽" min-width=70 :edit-render="{name: 'input'}" resizable ></vxe-table-column>
                    <vxe-table-column field="commodityHigh" align="center" title="高" min-width=70 :edit-render="{name: 'input'}"  resizable></vxe-table-column>

                    
                    
                    <vxe-table-column field="commodityNumber" align="center" title="货号" min-width=200 resizable show-overflow="tooltip" v-if="isFinished"></vxe-table-column>

                    <!-- <vxe-table-column field="allActivityRules" align="center" title="可选优惠规则" min-width=270>
                        <template slot-scope="scope">
                            <el-select
                                v-model="scope.row.checkedList"
                                multiple
                                collapse-tags
                                style="margin-left: 20px;"
                                placeholder="请选择"
                                @change="activerRule(index, scope)">
                                <el-option
                                v-for="item in scope.row.allActivityRules"
                                :key="item.activityRuleId"
                                :label="item.ruleName"
                                :value="item.activityRuleId"
                                v-if="item.isWholeRule != 1" 
                                :disabled="scope.row.checkedShow.includes(item.activityRuleId)"
                                >
                                </el-option>
                            </el-select>
                        </template>
                    </vxe-table-column> -->
                    <vxe-table-column field="ratedPeriod" align="center" title="工期" min-width=200 resizable show-overflow="tooltip">
                        <template slot-scope="scope">
                            <p>{{scope.row.ratedPeriod}}天</p>
                        </template>
                    </vxe-table-column>
                    <vxe-table-column field="commodityCode" align="center" title="商品编号"  min-width=200 resizable show-overflow="tooltip"></vxe-table-column>
                    <vxe-table-column field="companyName" align="center" title="供应商" min-width=200 resizable show-overflow="tooltip"></vxe-table-column>
                    <!-- <vxe-table-column field="commodityLong" align="center" title="深" min-width=100 :edit-render="{name: 'input'}"  resizable></vxe-table-column> -->
                    <vxe-table-column field="commodityUnit" align="center" title="单位" min-width=100 resizable></vxe-table-column>
                    <!-- <vxe-table-column align="center" title="操作" min-width=200 >
                        <template slot-scope="scope" >
                            <div class="flex-div">
                                <el-button v-if="scope.row.higherPrice && scope.row.higherPrice != ''" size="small" @click="heightPrice(scope.row, 'higherPrice', index, scope.rowIndex)">加价购</el-button>
                                <el-button v-if="scope.row.gift && scope.row.gift != ''" size="small" @click="heightPrice(scope.row, 'gift', index, scope.rowIndex)">满赠</el-button>
                            </div>
                        </template>
                    </vxe-table-column> -->
                    </vxe-table>
                </div>
            </div>
        </collapsecompoent>
        <!-- 批量设置尺寸 -->
        <batch ref="batch"></batch>
        <chooseCommodity v-if="choose" :sonVal="sonVal" :parseInt="parseInt"></chooseCommodity>
        <el-dialog :visible.sync="dialogCommodity" :close-on-press-escape="false" :close-on-click-modal="false"
            :show-close="false" @close="handClose" class="customDialogTitle dialogCommodity" width="90%" top="2vh" title="选择商品">
            <!-- 选择商品组件 -->
            <selectCommodity v-if="destroy" @selectionChange="selectionChange" 
                ref="selectedCommodities" :select-list="selectList">
            </selectCommodity>
            <span class="dialog-footer" slot="footer">
                <el-button size="medium" type="primary" @click="addCommodityList()">确 定</el-button>
                <el-button size="medium" @click="dialogCommodity = false">取 消</el-button>
            </span>
        </el-dialog>  
        <el-dialog :visible.sync="dialogSelect" width="30%">
        <div class="titlecals">{{roomListTitle.name}}</div>
          <el-select v-model="roomIndex" placeholder="请选择">
            <el-option v-for="item in rommList" :key="item.roomCode" :label="item.roomName" :value="item.roomCode"></el-option>
        </el-select>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogSelect = false" >取 消</el-button>
            <el-button v-if="roomListTitle.type == 1" type="primary" @click="copyFnRoomCommodity()">确 定</el-button>
            <el-button v-if="roomListTitle.type == 2" type="primary" @click="replaceRoom()">确 定</el-button>
        </span>
        </el-dialog>
        <!-- 清单预览弹窗 -->
        <el-dialog :visible.sync="previdwvisiblt" class="customDialogTitle" title="清单预览" width="900px">
            <budgetInfo class="classifGoods" :rommList="rommList"></budgetInfo>
            <span slot="footer" class="dialog-footer">
                <el-button @click="previdwvisiblt = false" >取 消</el-button>
            </span>
        </el-dialog>
        <el-card class="m-top20">
            <div class="titlecal">整单优惠活动</div>
            <div>可选优惠</div>
            <div class="discountCard">
                <div class="discountItem" v-for="(item, index) in ruleSunning" :key="index" v-if="item.isWholeRule == 1 ">
                    <el-checkbox v-model="item.checked" @change="sumCheck(item)">{{item.ruleName}}</el-checkbox>
                </div>
            </div>
        </el-card>   
        <el-card class="m-top20">
            <div class="sumPrice">
                <div>订单价格：{{orderPrice.toFixed(2)}}</div>
                <!-- <div v-if="activityPprice != 0">优惠价格：{{discountsPrice}}</div> -->
                <div>活动价格：{{discountsPrice.toFixed(2)}}</div>
            </div>
        </el-card>
        <div class="priceButton m-top20 m-bottom15">
            <el-button type="primary" size="medium"   :loading="buttonLoding"  @click="getUid()">生成预算清单</el-button>
            <el-button size="medium " style="padding:10px 48px;" @click="backView()">取消</el-button>
        </div>
    </div>
</template>
<script>
import collapsecompoent from "@/views/components/collapsecompoent";//收起展开组件
import viewBugetde from '@/views/order/budgetdetailed/viewBugetdetailed.vue';
import breadcrumb from "@/views/components/breadcrumb";
import budgetInfo from './budgetInfo.vue';
import selectCommodity from '@/views/components/selectCommodity'
import orderdetail from "@/views/order/components/orderdetail";
import { listBaseDict, listCommodityColour, insertOrderBudget, listPriceStrategy, listCommodityByClassify, listPurchaseCommodity, getActivityDetail} from "@/api/order/budgetdetailed/budgetdetailed";
import { removeBudget } from "@/utils/pubilcFn";
import search from "./search";
import chooseCommodity from "./chooseCommodity";
import batch from "./batch";
import giftComponent from "./giftComponent";
import higherComponent from "./higherComponent";
import { calculatePrices,  setData, sum, sums } from '@/utils/budgetdetailed.js'
import { mapGetters ,mapMutations, mapActions} from 'vuex';
import { delActivity } from 'src/api/administrationCenter/sysParamsSetting/activityMaintain';
import { listClassify } from 'api/pulicJava';
// import GoEasy from 'GoEasy';
import { getUUID } from "api/pulicJava"
import { listCommoditySeries, listCommodityMaterial } from '@/api/administrationCenter/stockmanagement/index';
export default {
    components: {
        collapsecompoent,
        breadcrumb,
        orderdetail,
        search,
        selectCommodity,
        chooseCommodity,
        giftComponent,
        higherComponent,
        budgetInfo,
        batch,
    }, 
    data(){
        return {
            radio:0,//单选框
            checkList:[],//复选框
            navList:'',//面包
            styleList:[//下拉
                {'label':'房间',"value":1},
                {'label':'商品',"value":0},
            ],
            ruleSunn:[],
            num: 1,
            sonVal:{},
            value:1,
            parseInt: 0,
            destroy:false,
            roomListTitle:{},//更换房间商品 更换房间复制商品title
            choose: false,//满赠 加价购商品 选择列表show
            commodityScope:[],//已选商品 活动范围
            commodityHighers:[],//整单赠品 加价购商品数据
            commodityGift:[],//整单赠品 加价购商品数据
            codeList:[],
            rommTable:[],//房间列表数据
            checkedList:[],//整单活动规则
            dialogCommodity: false,//选择商品show
            checked: false,//全选
            rooms:[],//房间分类
            rommList: [],//房间列表
            roomIndex:0,//当前房间索引
            roomsActive:'',//房间分类Change选中数据
            selectList: {
                selectedCommodities: [], // 选中的商品 可不传
                brandList: [], // 品牌数组 可不传（不传默认为全部品牌）
                categoryList: [], // 品类数组 可不传（不传默认为全部品类）
                priceStrategyId: '', // 价格策略 不是必填
                height: '320px', // 设置表格高度 可不传（弹出层最好传下）
                isDialog: true, // 是否为弹出层（不传默认为页面）
                disabled: true,
                brandId:this.$route.query.brandId,
                commodityCategoryId: this.$route.query.commodityCategoryId,
                storeId: this.$route.query.storeId,
                goodsType: this.$route.query.orderGoodsType,
            },
            activeCommodity: [],//选中商品数据
            activeId: [],//已选中规则互斥Id
            dialogSelect:false,//更换房间对话框
            previdwvisiblt: false,//清单预览
            // activityPprice: 0,//活动价格
            orderPrice: 0,//订单价格
            discountsPrice: 0, //活动价格       
            material:[],//材质 
            series:[],//系列
            dialogBatch: false,//批量设置尺寸show
            buttonLoding: false,//防止重复提交
            tableLoding:[]//加载loading
        }
    },
    activated(){
        console.log(this.rommList);
    },
    created(){
        this.SetStore();
        // var goEasy = new GoEasy({
        //     appkey:"BC-5e90cf78b1b64721b56d13bcbc4c2145"
        // });
        // goEasy.subscribe({
        //     channel:'my_channel',
        //     onMessage: function(message){
        //     alert('收到：'+message.content);
        //     }
        // });
        this.baseDict('ROOM_TYPE');//房间类型字典查询
        // this.selectList.priceStrategyId =this.$refs.addSercet.priceValue;
        this.navList=this.$route.meta;// 头部面包屑
        let arr =[];
        this.SET_RULESUNNING(arr);
        this.SET_RULESTTING(arr);
    },
    methods:{
        ...mapMutations([
            'SET_COMMODITY',
            'SET_RULESUNNING',
            'SET_RULESTTING'
        ]),
        ...mapActions([
            'getCommodity',
            'SetStore'
        ]),
        /**
         * 房间显示隐藏
         * @method roomShow
         */
        roomShow(index){
            this.rommList[index].show =! this.rommList[index].show;
        },
        /**
         * 设置全部商品尺寸
         * @method setSize
         */
        setSize(val){
            let datas = [];
            this.rommList.forEach((el, index)=>{
                el.commodity.forEach((item, i )=>{
                    if (item.checked) {
                        Object.assign(item, val);
                        this.square(index, i, item);
                        this.comidyChange(index, i, item);
                    }
                })
            });
            this.totalPrice();
        },
        //批量设置弹框show
        allSize(){
            this.$refs.batch.dialogBatch = true;
        },
        /**
         * 活动价格修改
         * @methods setPrice
         */
        setPrice(val){
            this.suPrice();
        },
        /**
         * table单元格编辑关闭事件
         * @method editChange
         */
        editChange(row){
            var t = row.row.discountRate.toString().charAt(0);
            var amountStr = row.row.amount.toString().charAt(0);
            var nonParameterS = row.row.nonParameter.toString().charAt(0);
            this.rommList[row.row.roomIndex].commodity[row.$rowIndex].amount = row.row.amount.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/[^\d.]/g, "").replace(/^\./g, "").replace( /([0-9]+\.[0-9]{3})[0-9]*/,"$1");
            this.rommList[row.row.roomIndex].commodity[row.$rowIndex].discountRate = row.row.discountRate.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/[^\d.]/g, "").replace(/^\./g, "").replace( /([0-9]+\.[0-9]{2})[0-9]*/,"$1");
            this.rommList[row.row.roomIndex].commodity[row.$rowIndex].nonParameter = row.row.nonParameter.toString().replace(".", "$#$").replace(/\./g, "").replace("$#$", ".").replace(/[^\d.]/g, "").replace(/^\./g, "").replace( /([0-9]+\.[0-9]{3})[0-9]*/,"$1");
            if (t == '-') {
              this.rommList[row.row.roomIndex].commodity[row.$rowIndex].discountRate = '-' + this.rommList[row.row.roomIndex].commodity[row.$rowIndex].discountRate;
            }
            if(amountStr == '-'){
              this.rommList[row.row.roomIndex].commodity[row.$rowIndex].amount = '-' + this.rommList[row.row.roomIndex].commodity[row.$rowIndex].amount;
            }
            if(nonParameterS == '-'){
                this.rommList[row.row.roomIndex].commodity[row.$rowIndex].nonParameter = '-' + this.rommList[row.row.roomIndex].commodity[row.$rowIndex].nonParameter;
            }
            this.rommList[row.row.roomIndex].commodity[row.$rowIndex].discountPrice = sum(this.rommList[row.row.roomIndex].commodity[row.$rowIndex]);
            this.rommList[row.row.roomIndex].commodity[row.$rowIndex].sumPrice = sums(this.rommList[row.row.roomIndex].commodity[row.$rowIndex]);
            this.suPrice();
        },
        /**
         * 整单赠品 加价购商品
         * getparseInt
         */
        getparseInt(val){
            // this.parseIntList = val;
        },
        /**
         * 正单优惠规则
         */
        sumCheck(val){
            this.totalPrice();
            let arr  = this.ruleSunning.filter(res=>{
                return res.checked;
            })
            this.checkedList = [];
            this.ruleSunning.forEach(res =>{
                if (res.checked){
                    this.checkedList.push(res.activityRuleId);
                }
            })
            let item ={
                checkedList: this.checkedList,
                discountPrice: this.discountsPrice
            }
            if(this.checkedList.length != 0){
                this.discountsPrice = calculatePrices(item, this.ruleSunning).monye;
                // if(calculatePrices(item, this.ruleSunning).higherPrice != ''){
                //     this.parseInt = 1;
                //     this.choose = true;
                //     this.sonVal.name = 'higherPrice';
                //     this.sonVal.val = calculatePrices(item, this.ruleSunning).higherPrice;
                //     this.sonVal.index = 0;
                //     this.sonVal.i = 0;
                // }
                // if(calculatePrices(item, this.ruleSunning).gift != ''){
                //     this.parseInt = 1;
                //     this.choose = true;
                //     this.sonVal.name = 'gift';
                //     this.sonVal.val = calculatePrices(item, this.ruleSunning).gift;
                //     this.sonVal.index = 0;
                //     this.sonVal.i = 0;
                // }
            }else {
                this.discountsPrice= 0;
                this.rommList.forEach(res => {
                    this.discountsPrice = res.discountsPrice + this.discountsPrice;
                })
            }
        },
        /**
         * 房间类型字典查询
         * @method baseDict 
         */
        baseDict(item) {
            listBaseDict({
                dataType: item	
            }).then(res => {
                    this.rooms = res.data;
            }).catch(error => {
                console.error('新增预算清单 字典查询 order/budgetdetailed/add/addTranslate', error) 
            })
        },
        /**
         * 新增房间
         * @method addRooms 
         */
        addRooms() {
            if(!this.priceLists){
                this.$message({
                    showClose: true,
                    message: '没有配置价格策略',
                    type: 'warning'
                    });
                return 
            }
            this.rommList.push({checked: false,commodity:[], discountsPrice : 0, originalPrice: 0, roomId: this.rooms[0].id, show: true, roomCode : this.rommList.length, roomName : `房间0${this.rommList.length+1}`, roomRemark:''});
            this.tableLoding=[];                
            this.rommList.forEach(res=>{
                this.tableLoding.push(false);
            })
        },
        /**
         * 更换房间 选择房间弹框
         * @method Choice
         */
        choiceRoom(item,type){
            this.roomListTitle={
                name: item,
                type: type
            }
            this.dialogSelect = true;
        },
        // 清单预览
        shopprevidw(){
            this.previdwvisiblt = true;
        },
        /**
         * 更换房间复制商品
         * copyFnRoomCommodity
         */
        copyFnRoomCommodity(){
            var arryass = {};
            this.rommList.forEach((res, index) => {
                  res.commodity.forEach(item => {
                    if (item.checked) {
                        Object.assign(arryass, item);
                    }else {
                    //    this.message('请勾选您要复制的的商品');
                    }
                    // return item.checked != true;
                })
            })
            arryass.checked = false;
            arryass.roomIndex = this.roomIndex;
            this.rommList[this.roomIndex].commodity.push(arryass);
            arryass= null;
            this.suPrice();
            this.dialogSelect = false;
        },
        /**
         * 更换房间
         * @method replaceRoom
         */
        replaceRoom(){
           var arryass = {};
            this.rommList.forEach((res, index) => {
                  res.commodity = res.commodity.filter(item => {
                    if (item.checked) {
                        Object.assign(arryass, item);
                    }else {
                    //    this.message('请勾选您要更换房间的商品');
                    }
                    return item.checked != true;
                })
            })
            // arryass.forEach(res => {
                arryass.checked = false;
                arryass.roomIndex = this.roomIndex;
                this.rommList[this.roomIndex].commodity.push(arryass);
            // })
            arryass= null;
            this.suPrice();
            this.dialogSelect = false;
        },
        /**
         * 选择商品弹框显示
         * @method commodityShow 
         * 当前房间索引值
         * @param index 
         */
        commodityShow(index){
            this.selectList.priceStrategyId=this.$refs.addSercet.priceValue,
            this.selectList.goodsType = this.orderDetails.orderGoodsType;
            this.roomIndex = index;
            this.dialogCommodity = true;
            this.destroy = true;
        },
        /**
         * 商品数据加入房间
         * @method addCommodityList 
         * 在已选择商品上添加规则判断互斥参数
         * @param item.checkedShow 
         * 在已选择商品上添加已勾选规则id
         * @param item.checkedList
         * 在已选商品 添加加价购ID
         * @param item.higherPrice
         * 在已选商品 添加赠品ID
         * @param item.gift
         * 加价购商品数据
         * @param item.childrenGoods
         * 赠品商品数据
         * @param item.childrenGoods
         * 加价购金额
         * @param item.markupPrice
         * 非标系数
         * @param nonParameter
         * 折扣率
         * @param discountRate
         * 商品数量
         * @param amount
         * 系列
         * @param commoditySeries
         * 材质
         * @param commodityMaterial
         * 商品活动价格
         * @param discountPrice
         * 商品单价
         * @param onePrice
         * 商品工期
         * @param productionTime
         * 商品单位
         * @param commodityUnit
         * 商品成本价
         * @param costPrice
         */
        addCommodityList(){
            this.tableLoding[this.roomIndex] = true;
            this.activeCommodity.forEach(item => {
                item.checkedList = [];
                item.checkedShow = [];
                item.higherPrice = '';
                item.commodityPrice ? null : item.commodityPrice = 0;
                item.onePrice = item.commodityPrice;
                item.sumPrice = item.commodityPrice;
                item.coefficient = item.coefficient;//成本系数
                item.gift = '';
                item.productionTime = item.constructionPeriod;
                // item.commodityUnit = item.priceUnit;
                item.commodityHeight=[];
                item.childrenGoods =[];
                item.childrenGoods =[];
                item.markupPrice= '';
                item.amount = 1;
                item.checked = false;
                item.remarks= '';//备注
                item.nonParameter = '1.000';
                item.discountRate = '1.00';
                item.roomIndex = this.roomIndex;
                item.commoditySeriesId = item.seriesId;
                item.commodityMaterialId = item.materialId;
                item.commodityColourId = '';
                item.commodityColorList=[];
                item.colourId != null ? item.commodityColourId = item.colourId : null;
                item.activityLogo = 1;
                item.discountPrice = sum(item)
                console.log(item);
                this.setcColors(item.commodityId).then(color => {
                    item.commodityColorList = color;
                    this.rommList[this.roomIndex].commodity.push(item);
                }).catch(error=>{
                    this.rommList[this.roomIndex].commodity.push(item);
                }).then(res=>{
                    this.suPrice();
                })
            });
            this.dialogCommodity = false;
            this.SET_COMMODITY(this.rommList);
            // if (this.ruleSunning.length > 0) { //判断vuex是否存有已选活动数据 调用商品活动范围接口
            //     this.$nextTick(() => {
            //         this.getCommodity();
            //     })
            // }
            // this.tableLoding = false;
            // this.activeCommodity = null;
        },
        /**
         * 获取商品颜色
         * @method setcolors
         */
        setcColors(commodityId){
            return  new Promise((resolve, reject) => {
                listCommodityColour({commodityId: commodityId}).then(el => {
                        resolve(el.data)
                }).catch(error => {
                    console.log('新增预算清单 获取商品颜色接口 views/order/budgetdetailed/add/addTranslate.vue')
                })
            });
        },
        /**
         * 选择商品返回数据
         * @method selectionChange 
         */
        selectionChange(item, type) {
            // item.forEach(res => {
                // res.commodityColorList=[];
                // res.seriesLsit=[];
                // res.materialList=[];
                // let color = new Promise((resolve, reject) => {
                //     listCommodityColour({commodityId:res.commodityId}).then(el => {
                //             resolve(el);
                //     }).catch(error => {
                //         console.log('新增预算清单 获取商品颜色接口 views/order/budgetdetailed/add/addTranslate.vue')
                //     })
                // });
            //   let series = new Promise((resolve, reject) => {
            //         listCommoditySeries({commodityId:res.commodityId}).then(el => {
            //             resolve(el);
            //         }).catch(error => {
            //             console.log('新增预算清单 获取商品系列接口 views/order/budgetdetailed/add/addTranslate.vue')                        
            //         })
            //     });
            //    let material = new Promise((resolve, reject) => {
            //         listCommodityMaterial({commodityId:res.commodityId}).then(el => {
            //             resolve(el);
            //         }).catch(error => {
            //             console.log('新增预算清单 获取商品材质接口 views/order/budgetdetailed/add/addTranslate.vue')                        
            //         })
            //     });
                // Promise.all([color]).then(respones => {
                //         res.commodityColorList = respones[0].data;
                //         // res.seriesLsit = respones[1].data;
                //         // res.materialList = respones[2].data;
                // });
            // })
              this.activeCommodity = item;
              type ? this.addCommodityList() : null;

        },
        /**
         * 复制商品
         * @method copyFn
         */
        copyFn(){
            this.rommList.forEach(res => {
                res.commodity.forEach(item => {
                    if(item.checked) {
                       let  arryas = Object.assign({}, item);//深拷贝复制商品对象
                        arryas.checked = false;
                        res.commodity.push(arryas);
                    } else {
                        // this.message('请勾选您要复制的商品');
                        return ; 
                    }
                })
            })
            this.suPrice();
        },
        /**
         * 选择颜色change事件 出发dome更新
         * @method setColor
         */
        setColor(index, el, type){
            let arrayColor = this.rommList;         
            arrayColor[index].commodity = arrayColor[index].commodity;
            this.$set(this.rommList,index,arrayColor[index]);
            arrayColor = null;
        }, 
        /**
         * 加价购 满赠选择商品方法
         * @method heightPrice
         */
        heightPrice(val, item, index, i){
            this.choose = true;
            this.parseInt = 0;
            item == 'higherPrice' ? (this.sonVal.name = 'higherPrice') && (this.sonVal.val = val.higherPrice) : (this.sonVal.name = 'gift') && (this.sonVal.val = val.gift);
            this.sonVal.index = index;
            this.sonVal.i = i;
            this.totalPrice();
        },
        /**
         * 关闭组件 加价购 赠品弹框
         * @method coloseItem
         */
        coloseItem(){
            this.choose = false;
        },
        /**
         * 商品Change事件 动态刷新dome数据
         * @method checkClick 
         */
        checkClick(index, scope) {
            let i = scope.$rowIndex;
            var array = this.rommList;
            array[index].commodity[i].checked != array[index].commodity[i].checked;
            this.$set(this.rommList,index,array[index]);
            array = null;
        },
        /**
         * 复制房间
         * @method copyRomm
         */
        copyRomm(){
            var arrya = {};
            var arryas = 0;
            let arrList =[]; 
            this.rommList.forEach(res=>{
                if(res.checked){
                    Object.assign(arrya, res)
                    arryas ++
                }
            })
            if(arryas > 1){
                this.message('只能复制一个房间');
                return ;
            }
            arrya.checked = false;
            arrya.roomCode = this.rommList.length;
            arrya.roomName = `房间0${this.rommList.length+1}`;
            arrya.commodity.forEach(el => {
                let item = Object.assign({}, el);
                item.roomIndex = arrya.roomCode;
                arrList.push(item)
            })
            arrya.commodity = arrList;
            this.rommList.push(arrya);
            arrList = null;
            arrya = null;
            this.tableLoding=[];
            this.rommList.forEach(res=>{
                this.tableLoding.push(false);
            })
        },
        /**
         * 已选择加价购商品
         * @param addPrice
         */
        addPrice(item, sonVal){
            var arrItem = this.rommList;
            if (sonVal.name == 'higherPrice') {
            let price = calculatePrices(arrItem[sonVal.index].commodity[sonVal.i], this.ruleSunning, item[0].activityPrice);
                arrItem[sonVal.index].commodity[sonVal.i].discountPrice = price.monye;
                // arrItem[sonVal.index].commodity[sonVal.i].onePrice = Number(item[0].sourcePrice) + arrItem[sonVal.index].commodity[sonVal.i].onePrice;
                arrItem[sonVal.index].commodity[sonVal.i].sumPrice = Number(item[0].sourcePrice) + arrItem[sonVal.index].commodity[sonVal.i].sumPrice;
                arrItem[sonVal.index].commodity[sonVal.i].childrenGoods = item;
                arrItem[sonVal.index].commodity[sonVal.i].isPurchase = 1;
            } else {
                arrItem[sonVal.index].commodity[sonVal.i].childrenGoods = item;
                arrItem[sonVal.index].commodity[sonVal.i].isGift = 1;
            }
            this.$set(this.rommList,sonVal.index,arrItem[sonVal.index]);   
            this.choose = false;   
            this.suPrice();    
            this.totalPrice();
            arrItem = null;
        },
        /**
         * 款高深变化计算价格
         */
        square(index, i, el){
            this.rommList[index].commodity[i].sumPrice = sums(el);
            this.rommList[index].commodity[i].discountPrice = sum(el);
            // this.rommList[index].commodity[i].discountPrice = calculatePrices(this.rommList[index].commodity[i], this.ruleSunning).monye;
            this.suPrice();
        },
        /**
         * 修改折扣率 非标系数 商品数量 Change事件 触发dome更新
         * @method coeffChange
         */
        coeffChange(index, i , item, el){
            this.$set(this.rommList, index, setData(this.rommList, index, i, item));  
            sum(el) == 0 ? this.$message({message: '参数设置错误',type: 'warning'}):null;
            this.rommList[index].commodity[i].discountPrice = sum(el);
            // this.rommList[index].commodity[i].discountPrice = calculatePrices(this.rommList[index].commodity[i], this.ruleSunning).monye;
            this.suPrice();
        },
        /**
         * 商品规则select选择Change事件
         */
        activerRule(index, scope){
            let i = scope.rowIndex;
            let item = scope.row;
            this.totalPrice();
            var arrays = this.rommList;
            let ayys,arrayList= [];
            item.allActivityRules.map(res => {
                if ( res.mutexId != null) {
                    if(item.checkedList.includes(res.activityRuleId)){
                        arrayList.push(res.mutexId.split(','));    
                        arrayList = Array.from(new Set(arrayList.flat()));
                    }
                }
            })
            let price = calculatePrices(item, this.ruleSunning);
            price.gift != '' ? arrays[index].commodity[i].gift = price.gift : arrays[index].commodity[i].gift = '';//判断是否有为满赠规则
            price.higherPrice != '' ? arrays[index].commodity[i].higherPrice = price.higherPrice : arrays[index].commodity[i].higherPrice = '';//判断为是否为加价购规则
            arrays[index].commodity[i].gift == '' ? arrays[index].commodity[i].childrenGoods = [] : null;//如果取消选择加价购规则 清空选择的商品
            arrays[index].commodity[i].discountPrice = price.monye;
            arrays[index].commodity[i].checkedShow = arrayList.map(item=>{
                return Number(item);
            });
            if(arrays[index].commodity[i].checkedList.length == 0){
                arrays[index].commodity[i].discountPrice = sum(item);
                // arrays[index].commodity[i].onePrice = sum(item);
                arrays[index].commodity[i].sumPrice = sum(item);
            }
            this.$set(this.rommList, index, arrays[index]);//勾选活动规则刷新dome监听
            this.suPrice();
            arrays = null;
        },
        /**
         * 商品本身活动规则checked勾选Change事件
         * @method comidyChange 
         * 当前房间索引
         * @param index
         * 当前商品索引
         * @param i
         * 当前商品数据 
         * @param item
         */
        comidyChange( index, i, item){
            this.totalPrice();
            var arrays = this.rommList;
            let ayys,arrayList= [];
            item.allActivityRules.map(res => {
                if ( res.mutexId != null) {
                    if(item.checkedList.includes(res.activityRuleId)){
                        arrayList.push(res.mutexId.split(','));    
                        arrayList = Array.from(new Set(arrayList.flat()));
                    }
                }
            })
            let price = calculatePrices(item, this.ruleSunning);
            price.gift != '' ? arrays[index].commodity[i].gift = price.gift : arrays[index].commodity[i].gift = '';//判断是否有为满赠规则
            price.higherPrice != '' ? arrays[index].commodity[i].higherPrice = price.higherPrice : arrays[index].commodity[i].higherPrice = '';//判断为是否为加价购规则
            arrays[index].commodity[i].gift == '' ? arrays[index].commodity[i].childrenGoods = [] : null;//如果取消选择加价购规则 清空选择的商品
            arrays[index].commodity[i].discountPrice = price.monye;
            arrays[index].commodity[i].checkedShow = arrayList.map(item=>{
                return Number(item);
            });
            if(arrays[index].commodity[i].checkedList.length == 0){
                // arrays[index].commodity[i].discountPrice = sum(item);
            }
            this.$set(this.rommList, index, arrays[index]);//勾选活动规则刷新dome监听
            this.suPrice();          
            arrays = null;
        },
        /**
         * 房间原价 活动价 小计
         * @method suPrice
         */
        suPrice(){
            this.rommList.forEach((res, i) => {
                res.discountsPrice = 0;
                res.originalPrice = 0;
                res.commodity.forEach(item => {
                    res.discountsPrice = Number(item.discountPrice) + res.discountsPrice;
                    res.originalPrice = Number(item.sumPrice) + res.originalPrice;
                })
            });
            this.totalPrice()
        },
        /**
         * 订单总价 优惠价格 活动价格
         * @method totalPrice
         * 整单价格
         * @param orderPrice
         * 活动价格
         * @param activityPprice
         * 优惠价格
         * @param discountsPrice
         * 
         */
        totalPrice(){
            // this.activityPprice = 0;
            this.discountsPrice = 0
            this.orderPrice = 0;
            this.tableLoding=[];
            this.rommList.forEach(res => {
                this.tableLoding.push(false)
                this.orderPrice = res.originalPrice + this.orderPrice;
                this.discountsPrice = res.discountsPrice + this.discountsPrice;
            })
        },
        /**
         * 删除商品
         * @method removeCommodity 
         * 房间索引
         * @param index
         */
        removeCommodity(index){
            this.rommList[index].commodity = removeBudget(this.rommList[index].commodity)[0];
            !removeBudget(this.rommList)[1] ? this.message('请勾选商品') : null;
            this.suPrice();
        },
        /**
         * 删除房间
         * @method rovmeRooms 
         */
        rovmeRooms(){
            !removeBudget(this.rommList)[1] ? this.message('请勾选房间') : null;
            this.rommList = removeBudget(this.rommList)[0];
            this.rommList.forEach((item, index)=>{
                item.roomCode = index;
                item.roomName = `房间0${index+1}`;
                item.commodity.forEach((res, i)=>{
                    res.roomIndex = index;
                })
            })
             this.totalPrice();
        },
        /**
         * 弹框消息
         * @method message 
         */
        message(item) {
            this.$message({
                message: item,
                type: 'warning'
            });
        },
        /**
         * 强制销毁组件
         * @method handClose 
         */
        handClose(){
            this.destroy = false;
            
        },
        /**
         * 在商品数据内添加商品互斥关系及互斥规则
         * @method activitiesItem 
         */
        activitiesItem(){
            var arrList = this.rommList;
                arrList.forEach((res, index) => {
                res.commodity.forEach( (items, key)=> {
                    this.selectedActivities.forEach(el => {
                        if(items.commodityId == el.commodityId){//房间内的商品id与活动范围的商品id对应
                            items.allActivityRules = el.allActivityRules;
                             this.$set(this.rommList, index, arrList[index]);
                        }
                    })
                })
            })
            arrLists = null;
        },
        /**
         * 批量设置活动规则 
         * @method childreItem
         */
        childreItem(id){
            let arrLists = this.rommList;
            arrLists.forEach((res, index)=>{
                res.commodity.forEach((item, i)=> {
                    item.checkedList= id;
                    this.$set(this.rommList, index, arrLists[index]);
                })
            })
            arrLists = null;

        },
        /**
         * 取消按钮返回订单管理
         * @method backView
         */
        backView(){
            this.$router.push({path: '/ordermm/budgetdetailed'});
        },
        getUid(){
            this.buttonLoding = true;
            getUUID({serialNumber: 'BL'}).then(res=>{
                this.addBudget(res.data);
            })
        },
        /**
         * 提交预算清单
         * @method addBudget
         */
        addBudget(item){
            let data ={
                budgetNumber: item,
                orderId: this.$route.query.orderId,
                totalAmount: this.orderPrice,
                versionName: this.$refs.addSercet.budgetName,
                isActivityPackage: this.$refs.addSercet.isActivityPackage,
                activityId: this.$refs.addSercet.value,
                discountAmount: this.discountsPrice,
                specialDiscountId: '',
                orderBudgetRooms: this.rommList,
                priceStrategyId: this.$refs.addSercet.priceValue
            }
            insertOrderBudget(data).then( res=> {
            this.buttonLoding = false;
            this.$router.push({path: '/ordermm/budgetdetailed'});
            }).catch( error=> {

            })
        },
        getInfo(){
               let table = [];
                this.rommList.map(res=>{
                    res.commodity.forEach((item, i)=> {
                        item.commodityName = item.companyName;
                        item.categoryName = item.category_name;
                        item.color = item.commodityColour;
                        item.width = item.commodityWide;
                        item.deep = item.commodityLong;
                        item.high = item.commodityHigh;
                        item.series = item.commoditySeries;
                        item.material = item.commodityMaterial;
                        table.push(item);
                    })
                })
                listCommodityByClassify(table).then(res=>{
                }).catch(error=>{

                })
        }
    },
    computed:{
        // 是否是成品
        isFinished() {
            return this.$route.query.orderGoodsType == 1;
        },
        // 是否是定制品
        isUnfinished() {
            return this.$route.query.orderGoodsType == 2;
        },
        ...mapGetters([
            'ruleStting',
            'selectedActivities',
            'ruleSunning',
            'orderDetails',
            'priceLists'
        ])
    },
    watch: {
        /**
         * 通过watch监听 实现房间全选
         * @method checked 
         */
        checked(item) {
            this.rommList.forEach(res => {
                item == true ? res.checked = true : res.checked = false;
            })
        },
        /**
         * 通过watch监听 添加时增加房间号 删除时更改房间号
         * @method  rommList 
         *  房间索引
         * @param res.index
         * 房间名称 
         * @param res.name
         * 房间列别
         * 
         */
        // rommList(item){
        //     this.rommList.forEach((res,index) => {
        //         res.roomCode =  index;
        //         res.roomName = `房间0${index+1}`;
        //     })
        // },
        /**
         * 通过数据监听 进行商品数据整合
         * @method selectedActivities 
         */
        // selectedActivities(item){
        //     this.activitiesItem()
        // },
        value(item){
            if(item ==  0){
                this.rommTable=[];
                this.rommList.map(res => {
                    res.commodity.map(ite=>{
                        ite.roomName = res.roomName;
                        this.rommTable.push(ite);
                    })
                })
            }
        },
        ruleSunning(item){
        }
    }   
}
</script>
<style scoped>
.operation{
    display: flex;
    align-items: center;
    width: 100%;
    justify-content: flex-start;
}
.classification{
    width: 105px;
    margin: 0 10px;
}
.commodity-checkbox span{
    font-size: 14px;
    color: #aeaeae;
}
.rooms-heade{
    display: flex;
    align-items: center;
    margin:0px 0;
    justify-content:space-between;
}
.rooms-heade-left{
    display: flex;
    align-items: center;
}
.rooms-heade-right{
    display: flex;
    align-items: center;
}
.rooms-heade-l, .rooms-heade-r{
    display: flex;
    align-items: center;
    flex-direction: column;
    align-items: flex-end;
}
.rooms-heade-r{
    align-items: flex-start !important;
}
.rooms-item{
    background: #fcfcfc;
    border: 1px solid #e6e6e6;
    margin-bottom: 20px;
}
.commodity-checkbox{
    min-height: 30px;
    padding: 10px 10px; 
    flex-wrap: wrap;
}
.commodity-title{
    border-top: 1px solid #e6e6e6; 
    display: flex;
    height:144px;
    padding-top:25px; 
    padding:  24px 10px 20px 10px ;
}
.room-checkbox{
    margin-top: 14px;
}
.commodity-group{
    flex-flow: wrap;
}
.commodity-number{
    width: calc((100% - 44px)/4);
    overflow: hidden;
    white-space: nowrap;
    text-overflow:ellipsis;
}
.commodity-select{
    width: 17%;
}
.h-w80{
  width: calc(100% - 88px);
  height: 1px;
  margin: 0 0 25px 44px;
  background: #d9d9d9;    
}
.rooms-input{
    padding: 0 54px 0 50px;
    display: flex;
    align-items: center;
}
.rooms-color{
    color: #0963b8;
}
.rooms-measure{
    width: 8%;
    display: flex;
    align-items: center;
    margin-left: 2%;
}
.rooms-calculation{
    width: 16%;
    display: flex;
    align-items: center;
    margin-left:2%; 
}
.rooms-size{
    width: 160px;
    text-align: center;
}
.mus-left{
    margin-left: calc(6% + 4px);
}
.nums-size{
    width: 80px;
}
.rooms-remarks{
    display: flex;
    padding: 0 44px 0 54px;
    margin-bottom: 20px;
}
.remarks-title{
    width: 61px;
}
.subtotal{
    height: 16px;
    line-height: 16px;
    font-size: 16px;
    margin:4px 0 10px 0;
}
.activityPrice{
    height: 18px;
    line-height: 18px;
    font-size:18px;
    margin-bottom:4px;
}
.remarks-content{
    display: flex;
    width: 80%;
}
.roomPrice{
    width:19%;
    display: flex;
    align-items: flex-end;
    flex-direction: column;
    justify-content:space-around;
}
.roomPrice-input{
    width: 100px;
}
.roomPrice-num{
    font-size: 16px;
}
.prices{
    position: absolute;
    right:20px;
    top: 10px;
    z-index: 99;
    color: red;
}
.titlecal {
    font-size: 18px;
    line-height: 1;
    position: relative;
    font-weight: 500;
    color: #006EC7;
    padding-left: 15px;
    margin-bottom: 20px;
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
.discountCard{
    padding:0 20px;
}
.discountItem{
    margin:0 10px;
    border-bottom:1px solid #d9d9d9;
}
.line-through{
    text-decoration: line-through;
}
.sumPrice{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    line-height:1;
}
.priceButton{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
}
.dialogCommodity{
    height:100%;
    /* overflow:hidden; */
    
}
.classifGoods{
    margin-top:20px;
}
.dialogCommodityTitle{
    justify-content: space-between;
}
</style>
