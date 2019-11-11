<template>
<div class="login-container">
  <div class="login-marks">
    <h2 class="title">
      梵华云
      <span class="title-login">欢迎登录</span>
    </h2>
    <el-form autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm" label-position="left" label-width="0px" class="card-box login-form">
      <p class="form-title">账号密码登录</p>
      <div class="form-main">
        <el-form-item prop="username">
          <span class="svg-container">
            <img :src="userUrl" alt="" class="svg-icon">
          </span>
          <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on" placeholder="账户" class="userName"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <span class="svg-container">
            <img :src="pwdUrl" alt="" class="svg-icon">
          </span>
          <el-input name="password" type="password" @keyup.enter.native="handleLogin" v-model="loginForm.password" autoComplete="on" placeholder="密码"></el-input>
        </el-form-item>
        <div class="form-check">
          <el-checkbox>自动登录</el-checkbox>
        </div>
        <el-form-item>
          <el-button type="primary" style="width:100%;height:50px;background:#1170da;border:1px solid #1170da" :loading="loading" @click.native.prevent="handleLogin">
            登录
          </el-button>
        </el-form-item>
      </div>
    </el-form>
    <el-dialog title="第三方验证" :visible.sync="showDialog">
      邮箱登录成功,请选择第三方验证
      <social-sign></social-sign>
    </el-dialog>
  </div>

</div>
</template>

<script>
import socialSign from './socialsignin';
// import { verifyDirector } from 'src/api/administrationCenter/contractmanagement/contractmanagement';
import { mapMutations } from 'vuex';
import userUrl from '@/assets/images/user.png';
import pwdUrl from '@/assets/images/pwd.png';
export default {
  components: {
    socialSign
  },
  name: 'login',
  data() {
    const validatePass = (rule, value, callback) => {
      if (value.length < 5) {
        callback(new Error('密码不能小于5位'));
      } else {
        callback();
      }
    };
    return {
      userUrl,
      pwdUrl,
      loginForm: {
        username: '',
        password: ''
      },
      loginRules: {
        username: [{
          required: true,
          message: '账户不能为空',
          trigger: 'blur'
        },
        {
          min: 3,
          max: 20,
          message: '长度在 3 到 20 个字符',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          trigger: 'blur',
          validator: validatePass
        }]
      },
      loading: false,
      showDialog: false
    }
  },
  methods: {
    ...mapMutations([
        'SET_ACTIVESTOREID',
        'SET_STOREARRY'
    ]),
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store.dispatch('LoginByEmail', this.loginForm).then((res) => {
            if(res.status == 200){
              this.$loca.setItem('port', 'web');
              this.$router.push({
                path: '/'
              });
            }else if(res.status == 403){
              this.$notify({
                title: '警告',
                message: '密码错误',
                type: 'warning'
              });
            }
            this.loading = false;
          }).catch((err) => {
            this.$notify.error({
              title: '错误',
              message: '网络错误'
            });
            this.loading = false;
          });
          // this.$http.post('/oauth/token', {
          //   username: this.loginForm.username,
          //   password: this.loginForm.password
          // }, {
          //   headers: {
          //     Authorization: 'Basic enV1bDp6dXVs'
          //   },
          //   emulateJSON: true,
          //   emulateHTTP: true
          // }).then(function(response) {
          //   if (response.status === 200) {
          //     this.$store.dispatch('LoginByEmail', this.loginForm).then(() => {
          //       this.loading = false;
          //       this.$router.push({
          //         path: '/'
          //       });
          //       // this.showDialog = true;
          //     }).catch(() => {
          //       this.loading = false;
          //     });
          //   } else {
          //     this.loading = false;
          //     return false;
          //   }
          // }, function(error) {
          //   console.log('server error!!');
          //   this.loading = false;
          //   return false;
          // });
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    afterQRScan() {
      const hash = window.location.hash.slice(1);
      const hashObj = getQueryObject(hash);
      const originUrl = window.location.origin;
      history.replaceState({}, '', originUrl);
      const codeMap = {
        wechat: 'code',
        tencent: 'code'
      };
      const codeName = hashObj[codeMap[this.auth_type]];
      if (!codeName) {
        alert('第三方登录失败');
      } else {
        this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
          this.$router.push({ path: '/' });
        });
      }
    }
  },
  created() {
    // window.addEventListener('hashchange', this.afterQRScan);
  },
  destroyed() {
    // window.removeEventListener('hashchange', this.afterQRScan);
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
@import "src/styles/mixin.scss";
.tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 5px;
}
.login-marks{
  width: 100%;
  height: 100%;
  background:#454545;
  background:rgba(0,0,0,0.77)
}
.form-title{
  text-align: center;
  color: #016fc8;
  font-size: 22px;
}
.form-main{
  margin-top:40px;
}
.form-check{
  margin-bottom:20px;
}
.login-container {
    @include relative;
    overflow: hidden;
    height: 100vh;
    background-color: #2d3a4b;
    background: url("../../assets/images/loginBgI.jpg");
    input:-webkit-autofill {
        -webkit-box-shadow: 0 0 0 1000px #293444 inset !important;
        -webkit-text-fill-color: #fff !important;
    }
    input {
        background: transparent;
        border: 0;
        -webkit-appearance: none;
        border-radius: 0;
    }
    .el-input {
        display: inline-block;
        width: 85%;
    }
    .svg-container {
        width: 1em;
        padding: 6px 5px 6px 20px;
        color: #889aa4;
        box-sizing: border-box;
        .svg-icon {
          width: 1.5em;
          height: 1.5em;
          vertical-align: -0.4em;
        }
    }
    .title {
        font-size: 60px;
        font-weight: 400;
        color: #eeeeee;
        width: 100%;
        // margin: 0 auto 0px;
        text-align: center;
        font-weight: bold;
        position: absolute;
        top:100px;
    }
    .title-login{
      display: inline-block;
       font-size: 26px;
       margin-left:30px;
    }
    .login-form {
        background: #fff;
        position: absolute;
        left: 0;
        right: 0;
        width: 450px;
        padding: 20px 50px 15px;
        margin: 300px auto;
    }
    .el-form-item {
        border: 1px solid #bbbbbb;;
        // background: rgba(0, 0, 0, 0.1);
        border-radius: 5px;
        color: #454545;
        margin-bottom:30px;
    }
    .forget-pwd {
        color: #fff;
    }
}
</style>
