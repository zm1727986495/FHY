<template>
	<div id="app" class="page_warp lvs">
         <router-view></router-view>
	</div>
</template>

<script>
import headnav from "./views/components/headNav"
import asidenav from "./views/components/asideNav"
  export default{
    name: 'APP',
    data() {
      return{
        port:''
      }
    },
    created(){
        this.port = this.$loca.getItem('port');
    },
    mounted(){
      this.getFullScreen();
    },
    methods:{
      getFullScreen(){
        let screenH=window.screen.height;
        document.querySelector('#app').style.height=screenH+"px";
      }
    },
    components:{
      headnav,
      asidenav,
    }
  }
</script>

<style lang="scss">
  @import './styles/index.scss'; // 全局自定义的css样式
  .page_warp{
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    height: 100vh !important;
  }
  .head_box{
    width: 100%;
    height: 50px;
    background-color: #006ec6;   
  }
  .content_warp{
    width:100%;
    display: flex;
    flex-wrap: nowrap;
    flex: 1;
     .aside_box{
      width: 200px;
      background-color: #000;
      height: 100%;
      }
      .content_box{
        height: 100%;
        flex: 1;
        padding: 8px;
        background-color: #f5f5f5;
        overflow-y: auto;
      }
  }
      table>.el-table__row{
        height:50px;
    }
    // element-ui的全局样式
    .border_top{
      border-top: 1px solid #dddddd;
    } 
    .border_bottom{
       border-bottom: 1px solid #dddddd;
    }
    .pagination_wrap {
        margin-top: 10px;
        text-align: center;
    }
    .margin_right_style{
      margin-right: 20px;
    }
    //
    .head_nav{
      padding: 8px 0 ;
      display: flex;
      align-items: center;
    }
    //列表搜索条件
    .warp_head_list{
      display: flex;
      align-items: center;
      justify-content: start;
    }
    .head_nav_select{
      width: 200px;
      margin-right: 20px
    }
    .head_nav_search_t{
      width: 25%;
      padding: 0 10px;
      box-sizing: border-box;
    }
    .head_nav_label{
      display: inline-block;
      width: 100px;
    }
    //按钮组
    .warp_head_action_btn{
      height: 60px;
      border-bottom: 1px solid #dddddd;
    }
 
</style>
