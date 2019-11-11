<template>
<!-- 审核记录弹出框 -->
  <div class="transferdia">
        <el-dialog title="" :visible.sync="visible" width="50%" :before-close="handleClose">
            <div class="titlecals">提交</div>

            <div class="diaContent">
                <div class="titleCon">
                    <span>当前流程节点为第二步【主管审核】</span> 
                    <span class="titlename">张三（办理中）</span>        
                </div>

                <div class="seleStatus">
                    <span>提交到下一流程节点</span> 
                    <el-checkbox-group v-model="flow">
                        <el-checkbox v-for = "item in flowList" :key="item.value" :label="item.label">{{ item.label }}</el-checkbox>
                    </el-checkbox-group>
                </div>
                
                <div class="seleAppro">
                    <span>选择审批人</span> 
                    <el-select v-model="appro" clearable placeholder="选择审批人">
                        <el-option
                            v-for="item in approList"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                    <span>审核人：李四</span>
                </div>

            </div>

            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="handleClose">取 消</el-button>
                <el-button type="primary" @click="selectok">确 定</el-button>
            </span>

        </el-dialog>
    </div>
</template>
<script>


export default {
  props:["visible"],
  components: {
  
 
  },
  // name: 'brandmanagement',
  data() {
    return {
        // 流程
        flow: 2,
        flowList: [{
            label: "店长审核",value: 1
        },{
            label: "下单部审核",value: 2
        },{
            label: "结束",value: 0
        },],
        // 审批
        appro: '',
        approList: [{
            label: "店长审核",value: 1
        },{
            label: "下单部审核",value: 2
        },{
            label: "结束",value: 0
        },],
       
    };
  },
  
  methods: {
      //关闭回调函数
      handleClose(){
        this.$emit("close_examin")
      },


      //确认按钮
      selectok(){
        this.$emit("examin_ok")
      },

      

 
     

      
  }
};
</script>
<style scoped lang='scss'>
    .transferdia{
        .diaContent {
            div {
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-wrap: nowrap;
                padding:12px;
                >span {
                    font-size: 16px;
                    color: #303133;
                    white-space: nowrap;
                }
                >span:nth-of-type(1) {
                    padding-right:12px;
                    width: 360px;
                    display: inline-block;
                    box-sizing: border-box;
                    text-align: right;
                }
            }
            
        }
    }


</style>

