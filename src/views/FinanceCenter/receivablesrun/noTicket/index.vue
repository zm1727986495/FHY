<template>
  <mains :tabIndexObj="tabIndexObj"></mains>
</template>
<script>
import mains from '../clientcollection/index'
export default {
  components:{
    mains
  },
  data(){
    return{
      tabIndexObj:{
        tabsIndex:"3"
      }
    }
  }
}
</script>