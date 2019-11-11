<template>
  <!-- 
  指派派送任务弹出框-->
  <div class="delivertaskdia">
    <el-dialog
      title="指派派送任务"
      :visible.sync="visible"
      width="60%"
      :before-close="handleClose"
      custom-class="customDialogTitle"
    >
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="提货时间">
              <el-date-picker
                v-model="ruleForm.pickUpTime"
                value-format="yyyy-MM-dd"
                format="yyyy-MM-dd"
                class="width-100"
                style="width:100%"
                type="date"
                placeholder="选择日期"
              ></el-date-picker>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <!-- <el-form-item label="推荐人姓名" prop="referrerName">
              <el-input v-model="ruleForm.referrerName"></el-input>
            </el-form-item>-->
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="选择组长">
              <el-select v-model="ruleForm.region1" placeholder="请选择组长" class="width-100">
                <el-option
                  v-for="item in getdesOptions"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="司机">
              <el-input v-model="ruleForm.driver"></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="选择工人">
              <el-select v-model="ruleForm.region2" multiple collapse-tags placeholder="请选择工人" class="width-100">
                <el-option
                  v-for="item in workerOptions"
                  :key="item.userId"
                  :label="item.name"
                  :value="item.userId"
                ></el-option>
              </el-select>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="司机电话">
              <el-input v-model="ruleForm.driverPhone"></el-input>
            </el-form-item>
          </div>
        </div>

        <div class="infoform">
          <div class="infoform_item">
            <el-form-item label="借调工人">
              <!-- <el-input v-model="ruleForm.companyName"></el-input> -->
              <el-input v-model="workerStr" @focus="openCheckOrgan"></el-input>
            </el-form-item>
          </div>
          <div class="infoform_item">
            <el-form-item label="派车车牌号">
              <el-input v-model="ruleForm.sendCarNumber"></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="ruleForm.remark"></el-input>
        </el-form-item>

        <el-form-item class="dia_fotter">
          <el-button type="primary" @click="handleok">确定</el-button>
          <el-button @click="handleClose">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
    <!-- 多选组织机构 -->
    <organcheckdia :visible="checkorg_visible" v-if="checkorg_visible" @close_org="closeCheckOrg"></organcheckdia>
  </div>
</template>
<script>
import pagination from "@/views/components/pagination";
import breadcrumb from "@/views/components/breadcrumb";
import { addGiftSend } from "api/entrepotSet/giftdeliver/giftdeliver"; //添加确认按钮接口
import organcheckdia from "@/views/Installation/dispatchcenter/components/organcheckdia"; //组织机构--多选
import { getUUID } from "api/pulicJava"; //生成编码
import {
  listUserByType,
} from "api/Installation/dispatchcenter/dispatchcenter";

export default {
  props: ["visible", "elsectIdArr"],
  components: {
    breadcrumb,
    organcheckdia, //组织机构--多选
    pagination
  },
  // name: 'brandmanagement',
  data() {
    return {
      ruleForm: {
        designateInstallationUsers: []
      }, //发送表单
      getdesOptions: [], //组长下拉内容
      workerOptions: [], //工人下拉内容
      rules: {},
      checkorg_visible: false, //多选组织机构是否显示
      workerStr: "" //页面展示的工人信息
    };
  },
  mounted() {
    this.listUserByTypeFun('B1'); //获取组长和工人   2组长 3工人
    this.listUserByTypeFun('A'); //获取组长和工人   2组长 3工人
  },

  methods: {
    //获取组长  工人
    listUserByTypeFun(id){
      let data = {
        userType:id
      }
      listUserByType(data).then(res=>{
        if( id == "B1"){
          this.getdesOptions = res.data;
        }else{
          this.workerOptions = res.data;
        }
      })
    },
    //关闭方法
    handleClose() {
      this.$emit("close_task");
    },

    //确认按钮
    handleok() {
      let data1 = {
        designateType: "1",
        userId: this.ruleForm.region1
      };
      let data2 = this.ruleForm.region2.map(item=>{
        return {
          designateType: "2",
          userId: item
        }
      })
      this.ruleForm.designateInstallationUsers.push(data1);
      this.ruleForm.designateInstallationUsers = this.ruleForm.designateInstallationUsers.concat(data2);
      this.ruleForm.sendGifts = this.elsectIdArr; //获取传递过来的礼品id
      new Promise((resolve, reject) => {
        getUUID({ serialNumber: "DA" }).then(res => {
          resolve(res);
        });
      }).then(res => {
        this.ruleForm.takeSendNumber = res.data;
        addGiftSend(this.ruleForm)
          .then(res => {
            if(res.status == "200"){
              this.$message.success("礼品派送任务成功");
              this.$emit("close_taskok");
            }
          })
          .catch(error => {
            console.log(
              error +
                "views/entrepotSet/giftdeliver/giftdeliver/components/delivertaskdia"
            );
          });
      });
    },

    //打开多选组织机构弹框
    openCheckOrgan() {
      this.checkorg_visible = true;
    },

    //关闭多选组织机构弹框
    closeCheckOrg(Arr) {
      if (Arr) {
        let nameArr = Arr.map(item => {
          return item.name;
        });
        let str = nameArr.join(",");
        this.workerStr = str; //给页面input框赋值所选人员的姓名

        this.ruleForm.designateInstallationUsers = [];
        Arr.forEach(item => {
          this.ruleForm.designateInstallationUsers.push({
            designateType: "3",
            userId: item.id
          });
        });
      }
      this.checkorg_visible = false;
    },
    //表格斑马线设置
    tableRowClassName({ row, rowIndex }) {
      return rowIndex % 2 != 0 ? "el-f0" : "";
    },
    
  }
};
</script>
<style scoped lang='scss'>
.delivertaskdia {
  .infoform {
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-between;
    .infoform_item {
      width: 50%;
    }
  }
  .demo-ruleForm {
    width: 95%;
  }
  .dia_fotter {
    width: 100%;
    display: flex;
    justify-content: flex-end;
  }
}
</style>

