<template>
    <div class="followuprecord">
        <div class="titlecals">跟进记录</div>
        <div class="timeline">
            <el-timeline reverse>
                <el-timeline-item
                v-for="(activity, index) in activities"
                :key="index"
                :color="activity.color"
                :size="activity.size"
                :timestamp="activity.timestamp" 
                placement="top">
                {{activity.content}}
                <ul class="el-upload-list el-upload-list--text downlists">
                    <li tabindex="0" class="el-upload-list__item is-success" v-for="(item,index) in activity.accessoryList" :key="index">
                        <a class="el-upload-list__item-name">
                            <i class="el-icon-document"></i> {{item.sourceName}}
                                <!-- {{item.targetName}} -->
                        </a>
                        <el-link type="primary" :underline="false" :href="item.fileUrl">下载</el-link>
                    </li>
                </ul>
                </el-timeline-item>
            </el-timeline>
        </div>
    </div>
</template>
<script>
import { 
    orderFollowList, //编辑订单回显
    } from 'api/order/order/orderdetails';
export default {
    data() {
        return {
            activities: [
            //     {
            //     content: '2018-04-12 20:46 跟进人 张三 跟进状态：待测量',
            //     timestamp: '已联系客户，并与客户约定测量时间及内容，已指派设计师！！',

            // }, {
            //     content: '2018-04-12 20:46 跟进人 张三 跟进状态：待测量',
            //     timestamp: '已联系客户，并与客户约定测量时间及内容，已指派设计师！！',
               
            // }, {
            //     content: '2018-04-12 20:46 跟进人 张三 跟进状态：待测量',
            //     timestamp: '已联系客户，并与客户约定测量时间及内容，已指派设计师！！',
               
            // }, {
            //     content: '2018-04-12 20:46 跟进人 张三 跟进状态：待测量',
            //     timestamp: '已联系客户，并与客户约定测量时间及内容，已指派设计师！！',
               
            // }
            ],
        }
    },
    created() {
        let data = {
            orderId: this.$route.query.orderId
        }
        orderFollowList(data).then(res => {
            if(res.status == 200) {
                let followdata = res.data.rows;
                followdata.forEach(item => {
                    let timestamp = item.createTime + " 跟进人" + item.recordName + " 跟进状态：" + item.statusName;
                    let content = item.content; 
                    this.activities.push({
                        content,
                        timestamp,
                        accessoryList: item.accessoryList
                    })
                })
                console.log(this.activities,"this.activit");
            }
        }).catch(error => {
                console.log('订单管理:订单列表 order/order/components/ordFollow.vue', error);
        })
    },
}
</script>
<style lang="scss">
    .followuprecord{
        padding: 20px;
        .timeline .el-timeline-item .el-timeline-item__node--normal {
            border:1px solid #0bbd87;
            background: transparent;
            left: 0px;
        }
        .timeline .el-timeline-item__tail {
            border-left-color: #0bbd87;
            position: absolute;
            top: 12px;
            height: 91%;
            left: 5px;
        }
        .el-timeline-item {
            position: relative;
            padding-bottom: 92px;
            /* left:1%; */
        }
        .titlecals{
            top: 0;
            margin-bottom: 20px;
        }
    }
</style>