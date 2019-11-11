<template>
  <div class="head-nav clearfix" style="width: 100vw">
    <!-- <Heavburger class="hamburger-container" :toggleClick="toggleHeavBar" :isActive="heavbar.opened"></Heavburger> -->
    <div class="logo_box fl m-left10">
      <h1 class="logo">
        <img :src="logo" />
      </h1>
      <h2 class="title">梵华云</h2>
    </div>
    <div class="nav_box fl" style="margin-left: 50px">
      <div class="nav_cell" :class="{'active':(activeIndex==index)}" v-for="(item,index) in navList" :key="index" @click="jumpToPage(item.id,index)">
        <icon-svg class="ing_icon_box" v-if='item.icon' :icon-class="item.icon"></icon-svg>
        <div class="nav_cell_title">{{item.title}}</div>
      </div>
    </div>
    <div class="systemOpe fr">
      <div>
        <span class="logout" @click="handleUpdatePwd">修改密码</span> | <span @click="logout" class="logout">退出</span>
      </div>
      <!-- <div class="version">版本号：{{systemVersion}}</div> -->
      <div class="version">版本号：2.2</div>
    </div>
    <div class="systemOpe fr">
      <div class="userInfo">你好，{{name}}</div>
      <div class="storeInfo">
        <el-select v-model="activeStoreId.storeId" @change="activStore" size="small">
          <el-option
            v-for="item in sotre"
            :key="item.storeId"
            :label="item.storeName"
            :value="item.storeId">
          </el-option>
        </el-select>
      </div>
    </div>
    <el-dialog title="修改密码" :visible.sync="passwordDialog" width="600px" custom-class="customDialogTitle" append-to-body>
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" size="medium">
        <el-form-item label="新密码" prop="passwordValue">
          <el-input v-model="ruleForm.passwordValue" show-password placeholder="请输入新密码"></el-input>
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="ruleForm.confirmPassword" show-password placeholder="请再次确认密码"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm('ruleForm')">提 交</el-button>
        <el-button @click="passwordDialog = false">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
  import logo from '@/assets/images/logo.png';
  import { mapGetters, mapState, mapMutations, mapActions  } from 'vuex';
  import Heavburger from 'components/Heavburger';
  export default {
    components: {
      Heavburger
    },
    name: "headNav",
    data() {
      return {
        logo,
        title: "我是首页",
        activeIndex: 0,
        navList: [],
        sotre:[],
        activeStoreId:{},
        passwordDialog: false,
        ruleForm:{
          passwordValue: '',
          confirmPassword: ''
        },
        rules: {
          passwordValue: [
            {required: true, message: '请输入密码'},
            {min: 6, max: 20, message: '密码长度必须在6-20位之间', trigger: 'blur'}
          ],
          confirmPassword: [
            {required: true, message: '请确认密码'},
            {min: 6, max: 20, message: '密码长度必须在6-20位之间', trigger: 'blur'}
          ]
        }

      };
    },
    watch: {
      webmenusstate(val){
        this.navList = val
        this.$emit("clicktab", val[this.activeIndex].id)
      },
      storesList(val){
        this.sotre = val;
        if(val.length != 0){
          this.activeStoreId = JSON.parse(this.$loca.getItem('activeStoreId'));          
        }
      }
    },
    mounted() {
        this.$loca.getItem('activeIndex') != null ? this.activeIndex =this.$loca.getItem('activeIndex') : null;
    },
    methods: {
      ...mapMutations([
        'SET_ACTIVESTOREID',
      ]),
      ...mapActions([
        'SetStore',
      ]),
      resetForm(formName) {
        if (this.$refs[formName] !== undefined) {
          this.$refs[formName].resetFields();
        }
      },
      activStore(val){
        let arr = [];
        this.sotre.map(res=>{
          res.storeId == val ? arr.push(res) : null;
        })
        this.SET_ACTIVESTOREID(arr[0]);
        this.$loca.setItem('activeStoreId',JSON.stringify(arr[0]) );
        this.$nextTick(() => {
          this.SetStore();
        })
      },
      toggleHeavBar() {
        this.$store.dispatch('ToggleHeavBar')
      },
      jumpToPage(type, index) {
        this.activeIndex = index;
        this.$loca.setItem('activeIndex',this.activeIndex);
        this.$root.Bus.$emit('changeAside', {'type': type});
        this.$emit("clicktab", type)
      },
      logout() {
        this.$store.dispatch('FedLogOut')
          .then(() => {
            this.$loca.removeItem('sings');
            this.$loca.removeItem('Store');
            this.$loca.removeItem('activeStoreId');
            this.$loca.removeItem('activeIndex');
            location.reload(); // 为了重新实例化vue-router对象 避免bug
          });
      },
      handleUpdatePwd() {
        this.passwordDialog = true;
        this.ruleForm.passwordValue = '';
        this.ruleForm.confirmPassword = '';
        this.resetForm('ruleForm');
        this.passwordDialog = true;
      },
      submitForm(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.ruleForm.passwordValue === this.ruleForm.confirmPassword) {
              let params = {
                password:this.ruleForm.passwordValue,
                id: this.id
              };
              this.$store.dispatch('FedUpdatePwd', params)
                .then(() => {
                  this.$message({
                    message: '修改成功',
                    type: 'success',
                    duration: 1000,
                    onClose: () => {
                      this.passwordDialog = false;
                      this.logout();
                    }
                  });
                });
            }else{
              this.$message({
                message: '两次输入密码不一致',
                type: 'error'
              });
            }
          } else {
            return false;
          }
        });
      }
    },
    computed: {
      ...mapGetters([
        'heavbar',
        'webMenusFront',
        'name',
        'systemVersion',
        'id',
        'storesList'
      ]),
      ...mapActions([
        'FedUpdatePwd'
      ]),
      webmenusstate:function(){
        return this.webMenusFront
      }
    }
  };
</script>

<style lang="scss" scoped>
  .active {
    color: #409EFF !important;
  }
  .head-nav {
    color: #fff;
    width: 100%;
    height: 70px;
    background-color: #006ec6;
  }
  .logo_box {
    width: 140px;
    color: #fff;
    text-align: center;
    display: flex;
    align-items: center;
    height: 100%;
  }
  .logo_box .title {
    font-size: 24px;
  }
  .logo_box .logo {
    width: 50px;
    margin-right: 10px;
  }
  .logo_box .logo  img {
    width: 100%;
  }
  .nav_box {
    display: flex;
    flex-wrap: nowrap;
    justify-content: flex-start;
    margin-left: 20px;
    align-items: center;
    height: 100%;
  }
  .nav_cell {
    margin-right: 10px;
    color: #fff;
    cursor: pointer;
    width: 70px;
    .ing_icon_box {
      width: 100%;
      height: 30px;
    }
    .nav_cell_title {
      text-align: center;
      font-size: 12px;
      padding-top: 4px;
    }
  }
  .systemOpe{
    padding-top: 10px;
    margin-right: 10px;
    line-height: 26px;
    text-align: right;
  }
  .userInfo{
    text-align: right;
  }
  .logout{
    cursor: pointer;
  }
</style>

