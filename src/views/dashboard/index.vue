<template>
  <div class="dashboard-container">
    <component v-bind:is="currentRole"> </component>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex';
  import EditorDashboard from './editor/index';

  export default {
    name: 'dashboard',
    components: { EditorDashboard },
    data() {
      return {
        currentRole: 'EditorDashboard',
        prot:''
      }
    },
    beforeCreate(){
      this.port = this.$loca.getItem('sings');
      this.longSIn();
    },
    methods:{
      longSIn(){
        if(this.port == 1){
        }else {
          console.log(1);
          this.$loca.setItem('sings','1');

          location.reload();

        }
      }
    },
    computed: {
      ...mapGetters([
        'name',
        'avatar',
        'email',
        'introduction'
      ])
    }
  }
</script>
