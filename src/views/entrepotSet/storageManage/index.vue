<template>
    <div>
        <div class="head_nav">
            <breadcrumb :navList="navList"></breadcrumb>
        </div>
        <el-card class="box-card" :body-style="{ padding: '10px 20px 10px 20px' }">
            <div class="storageRemind clearfloat">
                <div class="storageLeft">
                    <div class="storageRectangle"></div>
                    <span class="storageText">待办提醒</span>
                </div>
                <div class="storageRight">
                    <i class="el-icon-date"></i>
                    <span><i class="el-icon-edit"></i>添加待办事项</span>
                </div>
            </div>
        </el-card>
        <div class="storageNews clearfloat">
            <div class="content">
                <div class="storageBgc">
                    <div>
                        <el-card :body-style="{padding:'0px',height:'70px',width:'300px'}">
                            <div class="clearfloat">
                                <div class="storageIcon">
                                    图标
                                </div>
                                <div class="IconConnect">
                                    <div>待入库</div>
                                    <div>20%</div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <div>
                        <el-card :body-style="{padding:'0px',height:'70px',width:'300px'}">
                            <div class="clearfloat">
                                <div class="storageIcon">
                                    图标
                                </div>
                                <div class="IconConnect">
                                    <div>待出库</div>
                                    <div>20%</div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                    <div>
                        <el-card :body-style="{padding:'0px',height:'70px',width:'300px'}">
                            <div class='clearfloat'>
                                <div class="storageIcon">
                                    图标
                                </div>
                                <div class="IconConnect">
                                    <div>待移库</div>
                                    <div>20%</div>
                                </div>
                            </div>
                        </el-card>
                    </div>
                </div>
                <div>
                    <p class="storageTitle">
                        <span>{{date}}</span>
                        <span>（共{{listNum}}条工作日程）</span>
                    </p>
                    <ul class="newsList">
                        <li v-for="(item, index) in this.ulListData" :key='index'>
                            {{item}} <span><i class="el-icon-delete"></i></span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="datePick">
                <Calendar
                v-on:choseDay="clickDay"
                v-on:changeMonth="changeDate"
                v-on:isToday="clickToday"
                ></Calendar>
            </div>
        </div>
        <div class="storageBtnList">
            <button size="medium">手动入库</button>
            <button size="medium">手动出库</button>
            <button size="medium">新增采购单</button>
            <button size="medium">导入到货单</button>
            <button size="medium">移库</button>
            <button size="medium">商品查询</button>
            <button size="medium">订单查询</button>
        </div>
        <el-card class="m-bottom">
            <div class="clearfloat">
                <div class="graphStatistics">
                    <div class="storageTop">
                        <div class="storageRectangle"></div>
                        <span class="storageText">图形统计</span>
                    </div>
                    <div class="storageContent">
                        出库
                    </div>
                </div>
                <div class="Echarts">
                    <div class="clearfloat">
                        <div class="ThisTime">
                            <button>本月</button>
                            <button>本周</button>
                            <button>本日</button>
                        </div>
                        <div class="storageSelect">
                            <div>
                                <span>表现形式</span>
                                <el-select v-model="value1" placeholder="请选择" size="mini" @change="onChanged">
                                    <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                            <div>
                                <span>库房</span>
                                <el-select v-model="value2" placeholder="请选择" size="mini">
                                    <el-option
                                    v-for="item in options"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                            <div>
                                <span>时间</span>
                                <el-date-picker
                                    size="mini"
                                    v-model="dataValue"
                                    type="daterange"
                                    range-separator="-"
                                    start-placeholder="年/月/"
                                    end-placeholder="年/月/"
                                    style="width:275px">
                                </el-date-picker>
                            </div>
                        </div>
                    </div>
                    <div class="EchartsMain clearfloat">
                        <div class="MainLeft">
                            <div id="myChart" ref="myChart"></div>
                        </div>
                        <div class="MainRight">
                            <div>
                                <el-checkbox-group  v-model="furniture">
                                    <el-checkbox label="1"></el-checkbox>
                                    <el-checkbox label="2"></el-checkbox>
                                    <el-checkbox label="3"></el-checkbox>
                                    <el-checkbox label="4" ></el-checkbox>
                                    <el-checkbox label="5"></el-checkbox>
                                    <el-checkbox label="6" ></el-checkbox>
                                    <el-checkbox label="7"></el-checkbox>
                                </el-checkbox-group>
                            </div>
                        </div>
                    </div>
                </div>
                
            </div>
        </el-card>

        <div class="clearfloat storageBottom">
            <div class="riskLeft">
                <el-card>
                    <div class="riskWarning">
                        <div class="storageRectangle"></div>
                        <span class="storageRisk">风险预警</span>
                    </div>
                    <div class="riskBtn">
                        <el-button size="small" class="button-96">采购申请</el-button>
                        <el-button size="small" class="button-96">呆滞品设置</el-button>
                        <el-button size="small" class="button-96">移库</el-button>
                        <el-button size="small" class="button-96">预警设置</el-button>
                    </div>
                    <div class="riskTable lvs">
                        <el-table
                            :data="tableData"
                            border
                            style="width: 100%"
                            :row-class-name="tableRowClassName">
                            <el-table-column
                                type="selection"
                                align="center"
                            >
                            </el-table-column>

                            <el-table-column
                            label="库存状态"
                            prop="status"
                            :filters=status
                            :filter-method="filterHandler"
                            align="center"
                            width="104">
                            </el-table-column>

                            <el-table-column
                            label="产品名称"
                            align="center"
                            prop="name">
                            </el-table-column>

                            <el-table-column
                            label="产品规格"
                            align="center"
                            prop="specification">
                            </el-table-column>
                            
                            <el-table-column
                            label="产品类型"
                            align="center"
                            prop="type">
                            </el-table-column>

                            <el-table-column
                            label="计量单位"
                            align="center"
                            prop="unit">
                            </el-table-column>

                            <el-table-column
                            label="实际库存"
                            align="center"
                            prop="reality">
                            </el-table-column>

                            <el-table-column
                            label="所属仓库"
                            align="center"
                            prop="Subordinate">
                            </el-table-column>

                            <el-table-column
                            label="在途库存"
                            align="center"
                            prop="onPassage">
                            </el-table-column>

                            <el-table-column
                            label="库存上限"
                            align="center"
                            prop="upperLimit">
                            </el-table-column>
                            
                            <el-table-column
                            label="库存下限"
                            align="center"
                            prop="loverLimit">
                            </el-table-column>

                            <el-table-column
                            label="质检号"
                            align="center"
                            prop="qualityInspection">
                            </el-table-column>
                            <!-- <el-table-column
                            prop="date"
                            label="日期"
                            width="180">
                            </el-table-column>
                            <el-table-column
                            prop="name"
                            label="姓名"
                            width="180">
                            </el-table-column>
                            <el-table-column
                            prop="address"
                            label="地址">
                            </el-table-column> -->
                        </el-table>
                    </div>
                </el-card>
            </div>
            <div class="riskRight">
                <el-card class="m-bottom">
                    <div class="storageRectangle"></div>
                    <span>库管日志</span>
                </el-card>
                <el-card  :body-style="{height:'308px'}">
                    <div class="rateProgress">
                        <el-timeline>
                            <el-timeline-item
                            v-for='(item, index) in activities'
                            :key='index'
                            :timestamp='item.timestamp'
                            placement="top">
                            {{item.content}}
                            </el-timeline-item>
                        </el-timeline>
                    </div>
                </el-card>
            </div>
        </div>
    </div>
    
</template>
<script>
import breadcrumb from "../../components/breadcrumb";
import echarts from 'echarts';
import Calendar from 'vue-calendar-component';
import { getNames } from '../../../utils/pubilcFn'
export default {
    components: {
        Calendar,
        breadcrumb
    },
    data(){
        return{
            status:[],
            navList:[],
            furniture:[],
            chart:null,
            value1: '',
            value2: '',
            dataValue:"",
            date:"12月20日",
            listNum:0,
            ulListData:["【07.00 ~ 10.00】空间不能那么可参考","【07.00 ~ 10.00】空间不能那么可参考","【07.00 ~ 10.00】空间不能那么可参考"],
            options: [{
                value: 0,
                label: '折线图'
            }, {
                value: 1,
                label: '柱状图'
            }, {
                value: 2,
                label: '饼状图'
            }],
            Echarsoption :{
                xAxis: {
                    type: 'category',
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    position:"top",
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    }
                },
                yAxis: {
                    type: 'value',
                    axisLine:{
                        show:false
                    },
                    axisTick:{
                        show:false
                    }
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎',"1","2"]
                },
                series: [{
                    data: [820, 932, 901, 934, 1290, 1330, 1320],
                    type: 'line',
                    smooth: true,
                    radius : '55%',
                    center: ['50%', '60%'],
                    
                }],
                
            },
            tableData: [
                {
                    status:"1",
                    name:"aa",
                    specification:10,
                    type:"上",
                    unit:"px",
                    reality:"20",
                    Subordinate:"2",
                    onPassage:"30",
                    upperLimit:"50",
                    loverLimit:"20",
                    qualityInspection:"200"
                },
                {
                    status:"1",
                    name:"aa",
                    specification:10,
                    type:"上",
                    unit:"px",
                    reality:"20",
                    Subordinate:"2",
                    onPassage:"30",
                    upperLimit:"50",
                    loverLimit:"20",
                    qualityInspection:"200"
                },
                {
                    status:"1",
                    name:"aa",
                    specification:10,
                    type:"上",
                    unit:"px",
                    reality:"20",
                    Subordinate:"2",
                    onPassage:"30",
                    upperLimit:"50",
                    loverLimit:"20",
                    qualityInspection:"200"
                },
                {
                    status:"1",
                    name:"aa",
                    specification:10,
                    type:"上",
                    unit:"px",
                    reality:"20",
                    Subordinate:"2",
                    onPassage:"30",
                    upperLimit:"50",
                    loverLimit:"20",
                    qualityInspection:"200"
                }
            ],
            activities: [{
                content: '活动按期开始',
                timestamp: '2018-04-15'
                }, {
                content: '通过审核',
                timestamp: '2018-04-13'
                }, {
                content: '创建成功',
                timestamp: '2018-04-11'
            }],
        }
    },  
    activated(){
        this.listNum=this.ulListData.length;
        let dom = this.$refs.myChart;
        this.status=getNames('status',this.tableData)
    },
    // deactivated () {
    //     this.$destroy(true)
    // },
    // created() {
    //     this.listNum=this.ulListData.length;
    //     let dom = this.$refs.myChart;
    //     this.status=getNames('status',this.tableData)
    // },
    mounted() {
        // 头部面包屑
        this.navList=this.$route.meta;
    },
    methods:{
        onChanged(val){
            console.log(val)
            if(val==0){
                this.Echarsoption.series[0].type="line";
                 this.Echarsoption.xAxis.show=true;
                this.Echarsoption.yAxis.show=true;
                // delete this.Echarsoption.series[0].data;
            }else if(val==1){
                this.Echarsoption.series[0].type="bar";
            }else{
                this.Echarsoption.xAxis.show=false;
                this.Echarsoption.yAxis.show=false;
                this.Echarsoption.series[0].type="pie";
                this.Echarsoption.series[0].data=[
                    {value:820, name:'直接访问'},
                    {value:932, name:'邮件营销'},
                    {value:901, name:'联盟广告'},
                    {value:934, name:'视频广告'},
                    {value:1290, name:'搜索引擎'},
                    {value:1330, name:'1'},
                    {value:1320, name:'2'}
                ]
                console.log(this.Echarsoption)
            }
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        },
        initData(){//去请求初始化数据

        },
        initEcharts(){//初始化dom
            let dom = this.$refs.myChart;
            this.chart=echarts.init(dom);
            this.chart.setOption(this.Echarsoption);
        },
        drawEcharts(){//绘制echarts
            this.chart.setOption(this.Echarsoption);
        },
        clickDay(data) {
            console.log(data); //选中某天
        },
        changeDate(data) {
            console.log(data); //左右点击切换月份
        },
        clickToday(data) {
            console.log(data); // 跳到了本月
        },
        filterHandler(value, row, column){
            const property = column['property'];
            return row[property] === value;
        },
        tableRowClassName({row, rowIndex}) {//表格斑马线设置
            return rowIndex%2 != 0 ? 'el-f0' : '';
        }
    },
    mounted(){
        this.initData();
        this.initEcharts();
    },
    updated(){
        this.drawEcharts();
    }
}
</script>
<style scoped>
    .clearfloat:after{display:block;clear:both;content:"";visibility:hidden;height:0}
    .clearfloat{zoom:1}
    .wh_container{
        margin-top:20px !important;
    }
    .wh_container li{
        color:#000 !important;
    }
    .wh_jiantou1[data-v-2ebcbc83]{
        border-top: 2px solid #000;
        border-left: 2px solid #000;
    }
    .wh_container[data-v-2ebcbc83]{
        box-shadow: 0px 0px 15px #ccc;
    }
    .wh_content_item[data-v-2ebcbc83], .wh_content_item_tag[data-v-2ebcbc83]{
        color:#000;
    }
    .wh_container>.wh_content_all{
        background: none ;
    }
    .wh_content{

    }
    .wh_content:nth-child(3){

    }
    .wh_content_item .wh_isToday[data-v-2ebcbc83]{
        background: #96bdde;
    }
    .wh_content_item .wh_chose_day[data-v-2ebcbc83]{
        background: none;
        border:1px solid #96bdde;
    }
    .IconConnect{
        float: left;
        width: 70%;
        height: 70px;
    }
    .IconConnect>div{
        width: 100%;
        height: 50%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .storageIcon{
        float: left;
        width: 30%;
        height: 70px;
        display:flex;
        justify-content: center;
        align-items: center;
    }
    .storageTitle{
        height: 40px;
        line-height: 40px;
        padding-left:10px;
    }
    .newsList span{
        float: right;
    }
    .newsList>li{
        height:30px;
        line-height: 30px;
        padding-left:15px;
    }
    .rateProgress{
        width: 100%;
        height: 100%;
        /* overflow-y:scroll */
    }
    .riskBtn{
        width: 100%;
        height: 60px;;
    }
    .storageBottom{
        height: 500px;
        width: 100%;;
    }
    .riskLeft{
        width: 50%;
        height: 100%;
        float: left;
    }
    .riskRight{
        width: calc(50% - 20px);
        height: 100%;
        float: left;
        margin-left:20px
    }
    .storageRisk{
        margin-left:10px;
    }
    .riskWarning{
        width: 100%;
        height: 50px;

    }
    #myChart{
        width: 100%;
        height: 100%;
    }
    .EchartsMain>div{
        float: left;
    }
    .MainLeft{
        width: 47%;
        height: 100%;
    }
    .MainRight{
        width: 53%;
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .MainRight>div{
        width: 300px;
    }
    .EchartsMain{
        width: 100%;
        height:calc(400px - 60px) ;
    }
    .storageSelect,.ThisTime{
        float: left;
    }
    .storageSelect{
        width: calc(100% - 250px);
        height: 60px;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 20px 10px 70px;
    }
    .ThisTime{
        width: 250px;
        height: 60px;;
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .ThisTime>button{
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background: #96bdde;
        border:#96bdde;
        color:#fff;
        border:none;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0px 0px 15px #96bdde;
    }
    .storageTop{
        width: 100%;
        height: 50px;
    }
    .storageContent{
        width: 100%;
        height: calc(400px - 50px);
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .graphStatistics{
        width: 20%;
        height: 400px;
    }
    .Echarts{
        width:80%;
        height: 400px;;
    }
    
    .graphStatistics,.Echarts{
        float: left;
    }
    .storageNews{
        margin-top:20px;
        background: #fff;
        border-radius: 5px;
        padding: 0 20px 20px 0px;
    }
    .content{
         width:60%;
         float: left;
    }
    .datePick{
        width: 40%;
        float: left;
        /* height: 220px; */
    }
    .storageBtnList{
        display: flex;
        justify-content: space-between;
        height: 90px;
        align-items: center;
        /* padding: 0 0px; */
    }
    .storageBtnList>button{
        background: #96bdde;
        border:#96bdde;
        color:#fff;
        width: 200px;
        height: 50px;
        border-radius: 5px;
    }
    .storageBgc{
       width:100%;
       height:90px;
       background:#f5f5f5;
       display:flex;
       justify-content:center;
       align-items:center;
    }
    .storageBgc>div{
        flex:1;
        height: 90px;
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        padding:0 20px 0 0;
    }
    .storageBgc>div:nth-child(1){
        flex:1;
        height: 90px;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;;
    }
    .storageBgc>div:nth-child(2){
        flex:1;
        height: 90px;
        display: flex;
        justify-content: center;
        align-items: flex-start;;
    }
    .storageBgc>div:nth-child(3){
        flex:1;
        height: 90px;
        display: flex;
        justify-content: flex-end;
        align-items: flex-start;;
    }
    .storageLeft{
        height:30px;
        float:left;
        display:flex;
        /* justify-content:center; */
        align-items:center;
    }
    .storageRight{
        float:right;
        display:flex;
        /* justify-content:center; */
        align-items:center;
    }
    .storageText{
        margin-left:10px;
    }
    .storageRectangle{
        width:3px;
        height:14px;
        background:skyblue;
        display:inline-block;
    }
    .wh_top_changge{
        background: #96bdde;
    } 
</style>
