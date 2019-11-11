<template>
    <div class="boxAbnormal">
        <el-card class="box-card-8">
            <div slot="header" class="header_box">
                <div class="iconBox">
                    <i class="Icon"></i>
                    <span>预警&呆滞提醒</span>
                </div>
                <div class="btnlist">
                    <el-select v-model="value" placeholder="请选择仓库">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </div>
            </div>
            <div class="search_item_list table_list lvs attribute">
                <el-table border :row-class-name="tableRowClassName" :data="tabList">
                    <el-table-column prop="name" align="center" label="商品状态" sortable></el-table-column>
                    <el-table-column prop="name" align="center" label="产品名称" sortable></el-table-column>
                    <el-table-column prop="name" align="center" label="产品类别" sortable></el-table-column>
                    <el-table-column prop="name" align="center" label="计量单位" sortable></el-table-column>
                    <el-table-column prop="name" align="center" label="实际库存" sortable></el-table-column>
                    <el-table-column prop="name" align="center" label="所属仓库" sortable></el-table-column>
                    <el-table-column prop="name" align="center" label="操作" sortable>
                        <template slot-scope="scope">
                            <div>
                                <p class="table_action_span" @click="lookFun(scope.row)">查看</p>
                            </div>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-card>
    </div>
</template>
<script>

export default {
    components: {
    },
    data() {
      return {
          options: [
              { value: '仓库1号', label: '仓库1号'}, 
              { value: '仓库2号', label: '仓库2号'}
          ],
          value: '',
          tabList:[
              {name:"仓库1号"},
              {name:"仓库1号"},
              {name:"仓库1号"},
              {name:"仓库1号"},
              {name:"仓库1号"},
              {name:"仓库1号"},
              {name:"仓库1号"},
              {name:"仓库1号"},
              {name:"仓库1号"},
              {name:"仓库1号"},
              {name:"仓库1号"},
              {name:"仓库1号"},
              {name:"仓库1号"},
          ],
      }
    },
    methods: {
        //查看
        lookFun(){
            
        },
        //表格斑马线设置
        tableRowClassName({ row, rowIndex }) {
            return rowIndex % 2 != 0 ? "el-f0" : "";
        }
    }
  }
</script>
<style scope lang='scss'>
.boxAbnormal{
    .box-card-8{
        .header_box{
            padding: 0;
            .iconBox{
                min-width: 150px;
            }
            display: flex;
            flex-wrap: nowrap;
            justify-content: space-between;
        }
        .btnlist{
            display: flex;
            flex-wrap: nowrap;
        }
        .search_item_list{
            height: 185px;
            overflow-y: auto;
        }
    }
    
}
</style>

