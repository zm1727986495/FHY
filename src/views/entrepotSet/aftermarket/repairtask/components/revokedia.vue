<template>
  <div class="revokedia">
    <el-dialog title="撤销任务" :visible.sync="visible" width="600px" :before-close="handerr" custom-class="customDialogTitle">
        <div class="divdivdiv">
            请选择仓库:
            <el-select v-model="storageId" clearable placeholder="请选择仓库">
                <el-option v-for="item in storeOptions" :key="item.storageId" :label="item.storageName" :value="item.storageId"></el-option>
            </el-select>
        </div>

        <span slot="footer" class="dialog-footer">
            <el-button type="primary" size="medium" @click="handOk">确认</el-button>
            <el-button size="medium" @click="handerr">取消</el-button>
        </span>
    </el-dialog>
  </div>
</template>
<script>
import { getUpToken } from "@/utils/auth";
import { 
    listStorage,
    editDesignateInstallation
} from "@/api/entrepotSet/aftermarket/repairtask/repairtask";
export default {
  props: ["visible","installationOrderId","designateInstallationId"],
  data() {
    return {
      storageId:'',
      storeOptions: []
    };
  },
  //获取仓库列表
  mounted() {
      let data = {
        designateInstallationId: this.designateInstallationId
      };
      listStorage(data).then(res=>{
        this.storeOptions = res.data;
      })
  },

  methods: {
    handOk() {
        if(this.storageId == ''){
            this.$message.warning("请选择仓库");
            return;
        }
        //操作调接口
        let data = {
            installationOrderId: this.installationOrderId,
            designateInstallationId: this.designateInstallationId,
            storageId:this.storageId,
            installationOrderStatus: 5
        };
        editDesignateInstallation(data).then(res => {
        if (res.status == "200") {
            this.$message.success("撤销成功");
            this.$emit("closeok_redia");
            }
        });
    },
    handerr() {
      this.$emit("close_redia");
    }
  }
};
</script>
<style scoped lang='scss'>
.revokedia {
    .divdivdiv{
        margin-left: 120px;
    }
}
</style>

