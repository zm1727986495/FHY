<template>
    <div class="destory-margin">
        <div class="destory-textArea">
           <span class="textH1">作废原因：</span>
           <span class="textContent">
               {{cause}} 
           </span>
        </div>
    </div>
</template>
<script>
export default {
    data(){
        return {
            cause:"客户需求变更，整体风格不符合装修风格"
        }
    }
}
</script>
<style scope>
    .destory-textArea{
        width:100%;
        height:200px;
        border:1px solid #ccc;
        padding:10px 0 10px 25px;
    }
    .destory-margin{
        margin-top:30px;
    }
    .textH1{
        font-size:32px;
    }
    .textContent{
        font-size:32px;
        font-weight:bold;
        color:#666;
    }
</style>