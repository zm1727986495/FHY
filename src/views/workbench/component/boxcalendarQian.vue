<template>
    <div class="boxcalendarQian">
        <el-card class="box-card calendar">
            <div slot="header" class="clearfix box-card-header">
            <div class="iconBox">
                <i class="Icon"></i>
                <span>客户跟进日程</span>
            </div>
            </div>
            <Calendar v-on:choseDay="clickDay" v-on:changeMonth="changeDate" v-on:isToday="clickToday"></Calendar>
        </el-card>
    </div>
</template>

<script>
import Calendar from 'vue-calendar-component';

export default {
    components: {
        Calendar
    },
    data() {
        return {
            value:""
      }
    },
    methods: {
        // 选中某天
      clickDay(data) {
      },
      // 左右点击切换月份
      changeDate(data) {
        // console.log(data);
      },
      // 跳到今天
      clickToday(data) {
        // console.log(data);
      }
    }
  }
</script>
<style scope lang='scss'>

.boxcalendarQian{
  .calendar{
    height: 303px;   
  }
  .calendar .wh_container{
    max-width: 100%;
    margin-top: -70px;
  }
  .calendar .wh_content{
    padding: 0;
  }
  .calendar .wh_content_all{
    background-color: transparent;
  }
  .calendar .wh_content_item, .calendar .wh_content_item_tag{
    color: #000;
  }
  .calendar .wh_content_item{
    height: auto;
    width: 14.2%;
    font-size: 16px;
  }
  .calendar .wh_item_date{
    width: 100%;
    height: 30px;
    line-height: 30px;
    display: block;
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
    &:hover{
        background:#FFB588; 
    }
  }
  .calendar .wh_content_item .wh_isToday{
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    background-color: #f2f8fe;
  }
  .calendar .wh_content_item .wh_chose_day {
    -webkit-border-radius: 0;
    -moz-border-radius: 0;
    border-radius: 0;
    background-color: #FFB588;
    color: #fff;
  }
  .calendar .wh_top_changge{
    justify-content: flex-end;
    padding-right: 5px;
    height: 60px;
  }
  .calendar .wh_top_changge .wh_content_li{
    flex: none;
    padding: 0 5px;
  }
  .calendar .wh_top_changge li{
    flex: 0;
    color: #006EC6;
    font-size: 14px;
  }
  .calendar .wh_jiantou1,
  .calendar .wh_jiantou2 {
    border-color: #006EC6;
    width: 10px;
    height: 10px;
    border-width: 1px;
  }
  .calendar .status{
    font-size: 12px;
    color: #666;
  }
  .calendar .wh_other_dayhide .status {
    color: #bfbfbf;
  }
  .calendar .wh_chose_day .status{
    color: #fff;
  }
}
</style>

