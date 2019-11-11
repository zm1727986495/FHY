<template>
    <div class="orderdetail">
        <!-- <el-card class="m-bottom"> -->
            <!-- 查询条件组 -->
            <div class="orderdetails">
                <div class="orderbox">
                    <ul class="orderlsit">
                        <li>定责单号</li>
                        <li>{{taskduty.taskDutyNumber}}</li>
                        <li>发起部门</li>
                        <li>{{taskduty.groupName}}</li>
                        <li>发起人</li>
                        <li>{{taskduty.sponsorName}}</li>
                        <li>发起时间</li>
                        <li>{{taskduty.sponsorTime}}</li>
                    </ul>

                    <ul class="orderlsit">
                        <li>来源</li>
                        <li>{{taskduty.source}}</li>
                        <li>来源单号</li>
                        <li>{{taskduty.sourceNumber}}</li>
                        <li>定责原因</li>
                        <el-tooltip class="item" effect="dark" :content="taskduty.dutyCause" placement="top">
                            <li>{{taskduty.dutyCause}}</li>
                        </el-tooltip>
                        <li>定责单状态</li>
                        <li>{{status}}</li>
                    </ul>

                    <ul class="orderlsit">
                        <li>备注</li>
                        <el-tooltip class="item" effect="dark" :content="taskduty.remake" placement="top-start">
                            <li>{{taskduty.remake}}</li>
                        </el-tooltip>
                    </ul>
                </div>
            </div>
        <!-- </el-card> -->
    </div>
</template>

<script>
  export default {
    data() {
        return {
         
        };
    },
    props: ["taskduty"],
    mounted() {
        
    },
    methods: {
        
    },
    computed: {
        status() {
            let status = '';
            // 1未接受 2 已接受 3 申诉中 4申诉通过 5有条件接受
            switch(this.taskduty.status) {
                case "1" :
                    status = "未接受";
                    break;
                case "2" :
                    status = "已接受";
                    break;
                case "3" :
                    status = "申诉中";
                    break;
                case "4" :
                    status = "申诉通过";
                    break;
                case "5" :
                    status = "有条件接受";
                    break;
                default: 
                    status = ""
            }
		    return status;
	    }
    }
  };
</script>

<style lang="scss" scoped>
    .orderdetail{
        .orderdetails{
            width: 100%;
            border-radius: 2px;
            .orderbox{
                width: 100%;
                font-size: 14px;
                border-top: 1px solid #e4e4e4;
                border-left: 1px solid #e4e4e4;
                .orderlsit{
                    display: flex;
                    li{
                        padding: 0px 10px;
                        display: flex;
                        align-items: center;
                        border-right: 1px solid #e4e4e4;
                        border-bottom: 1px solid #e4e4e4;
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
                    }
                }
            }
        }     
    }
</style>

