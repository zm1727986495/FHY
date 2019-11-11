<template>
    <div class="evaluatecompon">
        <el-tabs type="border-card" v-model="source" @tab-click="tabChange">
            <el-tab-pane label="安装评价" name="0">
                <ul class="evalualist" v-if="isShow">
                    <li>
                        <div><b>安装状态</b></div>
                        <div v-if="install.evaluateStatus == '0'">未完成</div>
                        <div v-if="install.evaluateStatus == '1'">已完成</div>
                        <div class="baizhu">备注：{{install.remake}}</div>
                    </li>
                    <li>
                        <div><b>是否当天完成</b></div>
                        <div v-if="isFinish.evaluateStatus == '0'">否</div>
                        <div v-if="isFinish.evaluateStatus == '1'">是</div>
                        <div class="baizhu">备注：{{isFinish.remake}}</div>
                    </li>
                    <li>
                        <div><b>安装师傅上门前是否提前联系</b></div>
                        <div v-if="iscontact.evaluateStatus == '0'">否</div>
                        <div v-if="iscontact.evaluateStatus == '1'">是</div>
                        <div class="baizhu">备注：{{iscontact.remake}}</div>
                    </li>

                    <li>
                        <div><b>安装师傅是否有穿工服和鞋套</b></div>
                        <div v-if="iswear.evaluateStatus == '0'">否</div>
                        <div v-if="iswear.evaluateStatus == '1'">是</div>
                        <div class="baizhu">备注：{{iswear.remake}}</div>
                    </li>

                    <li>
                        <div><b>货品是否有损坏</b></div>
                        <div v-if="isgoods.evaluateStatus == '0'">否</div>
                        <div v-if="isgoods.evaluateStatus == '1'">是</div>
                        <div class="baizhu">备注：{{isgoods.remake}}</div>
                    </li>

                    <li>
                        <div><b>设计师评分</b></div>
                        <div>{{designdegree.evaluateStatus}}分</div>
                        <div class="baizhu">备注：{{designdegree.remake}}</div>
                    </li>

                    <li>
                        <div><b>销售评分</b></div>
                        <div>{{saledegree.evaluateStatus}}分</div>
                        <div class="baizhu">备注：{{saledegree.remake}}</div>
                    </li>
                    
                    <li>
                        <div><b>安装服务评分</b></div>
                        <div>{{installdegree.evaluateStatus}}分</div>
                        <div class="baizhu">备注：{{installdegree.remake}}</div>
                    </li>

                    <li>
                        <div><b>客户评价</b></div>
                        <div>{{customerdegree.evaluateStatus}}分</div>
                        <div class="baizhu">备注：{{customerdegree.remake}}</div>
                    </li>
                </ul>
                <div v-else>
                    您未对本订单填写过评价
                </div>
            </el-tab-pane>
            <el-tab-pane label="维修评价" name="1">
                <ul class="evalualist" v-if="isShow">
                    <li>
                        <div>维修状态</div>
                        <div v-if="install.evaluateStatus == '0'">未完成</div>
                        <div v-if="install.evaluateStatus == '1'">已完成</div>
                        <div class="baizhu">备注：{{install.remake}}</div>
                    </li>
                    <li>
                        <div>是否当天完成</div>
                        <div v-if="isFinish.evaluateStatus == '0'">否</div>
                        <div v-if="isFinish.evaluateStatus == '1'">是</div>
                        <div class="baizhu">备注：{{isFinish.remake}}</div>
                    </li>
                    <li>
                        <div>维修服务满意程度</div>
                        <div>{{customerdegree.evaluateStatus}}星</div>
                        <div class="baizhu">备注：{{installdegree.remake}}</div>
                    </li>
                </ul>
                <div v-else>
                    您未对本订单填写过评价
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
import {
  listInstallOrderEvaluate, // 回显评价
} from 'api/administrationCenter/administrativeservice/index';
export default {
    data() {
        return {
            value: 1,
            source: "0",     //tab标签
            isShow:false,    //是否添加过评价


            install:{},        //安装状态
            isFinish:{},       //是否当天完成
            iscontact:{},      //安装师傅上门前是否提前联系
            iswear:{},         //安装师傅是否穿工服和鞋套
            isgoods:{},        //货品是否有损坏
            designdegree:{},   //设计师满意程度
            saledegree:{},     //销售满意程度
            installdegree:{},  //安装服务满意程度
            customerdegree:{}, //客户评价
        }
    },
    mounted(){
        this.getInfoBack();
    },
    methods:{
        tabChange(e){
            this.source = e.name;
            this.getInfoBack();
        },
        getInfoBack(){
            let data = {
                orderId:this.$route.query.orderId,
                source:this.source
            }
            listInstallOrderEvaluate(data).then(res=>{
                if(res.data.rows.length>0){
                    this.isShow = true;
                    res.data.rows.forEach(item=>{
                        if(item.evaluateType == 1) {
                            // 安装状态
                            this.install.evaluateStatus = item.evaluateStatus;
                            this.install.remake = item.remake;
                        }else if(item.evaluateType == 2) {
                            // 是否当天完成
                            this.isFinish.evaluateStatus = item.evaluateStatus;
                            this.isFinish.remake = item.remake;
                        }else if(item.evaluateType == 3) {
                            // 安装师傅上门前是否提前联系
                            this.iscontact.evaluateStatus = item.evaluateStatus;
                            this.iscontact.remake = item.remake;
                        }else if(item.evaluateType == 4) {
                            // 安装师傅是否有穿工服和鞋套
                            this.iswear.evaluateStatus = item.evaluateStatus;
                            this.iswear.remake = item.remake;
                        }else if(item.evaluateType == 5) {
                            // 货品是否有损坏
                            this.isgoods.evaluateStatus = item.evaluateStatus;
                            this.isgoods.remake = item.remake;
                        }else if(item.evaluateType == 6) {
                            // 设计师满意程度
                            this.designdegree.evaluateStatus = Number(item.evaluateStatus);
                            this.designdegree.remake = item.remake;
                        }else if(item.evaluateType == 7) {
                            // 安装服务满意程度
                            this.installdegree.evaluateStatus = Number(item.evaluateStatus);
                            this.installdegree.remake = item.remake;
                        }else if(item.evaluateType == 8) {
                            // 客户评价
                            this.customerdegree.evaluateStatus = Number(item.evaluateStatus);
                            this.customerdegree.remake = item.remake;
                        }else if(item.evaluateType == 9) {
                            //销售满意程度
                            this.saledegree.evaluateStatus = Number(item.evaluateStatus);
                            this.saledegree.remake = item.remake;
                        }
                    })
                }else{
                    this.isShow = false;
                }
                
            })

        },
    },
}
</script>
<style lang="scss">
    .evaluatecompon{
        .evalualist{
            color: #666;
            li{
                margin: 10px 0px;
                display: flex;
                justify-content: space-between;
                div{
                    flex: 1;
                }
                .baizhu{
                    flex: 1.5;
                }
            }
        }
    }
</style>