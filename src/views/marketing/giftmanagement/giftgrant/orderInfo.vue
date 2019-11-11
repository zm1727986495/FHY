<template>
    <!-- 订单详情信息table -->
    <div class="orderInfo_dia">
      <table class="tab_class">
        <tr>
          <td>
            <span class="befor_text_bold">订单编号：</span>
            {{id}}
          </td>
          <td>
            <span class="befor_text_bold">客户姓名：</span>
            张三
          </td>
          <td>
            <span class="befor_text_bold">客户电话：</span>
            19098987766
          </td>
        </tr>
        <tr>
          <td>
            <span class="befor_text_bold">订单地址：</span>
            北京市东城区美惠大厦A座904
          </td>
          <td>
            <span class="befor_text_bold">所属网点：</span>
            京北橱柜店
          </td>
          <td>
            <span class="befor_text_bold">销售员：</span>
            李丽
          </td>
        </tr>
        <tr>
          <td>
            <span class="befor_text_bold">设计师：</span>
            赵亮
          </td>
          <td colspan="2">
            <span class="befor_text_bold">订单创建时间：</span>
            2018-09-18 14:50
          </td>
        </tr>
      </table>
        
    </div>
  
</template>
<script>




export default {
  props:["id"],
  data() {
    return {
      
      
    };
  },
  
  mounted() {
   
  },
  methods: {
    
    
  }
};
</script>
<style scoped lang='scss'>


.orderInfo_dia{
  table tr td{
  width: 33%;
  height: 48px;
  border:solid #EBEEF5; 
  border-width:0px 1px 1px 0px;
  padding-left:10px; 
    .befor_text_bold{
      font-weight: bold
    }
  }
  .tab_class{
    border:solid #EBEEF5;
    border-radius: 5px;
    color: #606266;
    font-size: 14px;
    border-width:1px 0px 0px 1px;
    width: 95%;
    margin:20px 2.5%;
  }
  

}



</style>

