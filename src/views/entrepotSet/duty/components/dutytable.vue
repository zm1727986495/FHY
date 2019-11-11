<template>
    <div class="dutydetail">
        <!-- <el-card class="m-bottom"> -->
            <!-- 查询条件组 -->
            <div class="dutydetails">
                <div class="dutybox">
                    <ul class="dutylsit">
                        <li>操作</li>
                        <li>被定责人</li>
                        <li>部门</li>
                        <li>电话</li>
                        <li>处罚方式</li>
                        <li>处罚金额计算公式</li>
                        <li>处罚金额</li>
                        <li>说明</li>
                    </ul>

                    <ul class="dutylsit">
                        <li>
                            <i class="el-icon-remove"></i>
                        </li>
                        <li>
                            <el-select v-model="dutyType"  placeholder="被定责人" size="medium">
                                <el-option
                                    v-for="item in responList" :key="item.value"
                                    :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li>安装</li>
                        <li>13948491211</li>
                        <li>
                            <el-select v-model="dutyType"  placeholder="请选择处罚方式" size="medium">
                                <el-option
                                    v-for="item in typeList" :key="item.value"
                                    :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li>
                            <el-input class="width-100" placeholder="处罚金额计算公式" v-model="desc" maxlength="50"></el-input>
                        </li>
                        <li>
                            <el-input class="width-100" placeholder="处罚金额" v-model="desc" maxlength="50"></el-input>
                        </li>
                        <li>
                            <el-input class="width-100" placeholder="说明" v-model="desc" maxlength="50"></el-input>
                        </li>
                    </ul>
                    <ul class="dutylsit">
                        <li>
                            <i class="el-icon-circle-plus"></i>
                        </li>
                        <li>
                            <el-select v-model="dutyType"  placeholder="被定责人" size="medium">
                                <el-option
                                    v-for="item in responList" :key="item.value"
                                    :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li>安装</li>
                        <li>13948491211</li>
                        <li>
                            <el-select v-model="dutyType"  placeholder="请选择处罚方式" size="medium">
                                <el-option
                                    v-for="item in typeList" :key="item.value"
                                    :label="item.label" :value="item.value">
                                </el-option>
                            </el-select>
                        </li>
                        <li>
                            <el-input class="width-100" placeholder="处罚金额计算公式" v-model="desc" maxlength="50"></el-input>
                        </li>
                        <li>
                            <el-input class="width-100" placeholder="处罚金额" v-model="desc" maxlength="50"></el-input>
                        </li>
                        <li>
                            <el-input class="width-100" placeholder="说明" v-model="desc" maxlength="50"></el-input>
                        </li>
                    </ul>
                    
                </div>
            </div>
        <!-- </el-card> -->
    </div>
</template>

<script>
  export default {
    data() {
        return {
            dutyType: '',
            desc: '',
            // 条件
            responList: [], // 被定责人条件
            typeList: [{
				label: '罚款',value: '0'
			},{
				label: '暂扣',value: '1'
			},{
				label: '不处罚',value: '2'
			},{
				label: '其他',value: '3'
			},],
        };
    },
    props: [],
    mounted() {
        
    },
    methods: {
        
    },
    computed: {}
  };
</script>

<style lang="scss" scoped>
    .dutydetail{
        .dutydetails{
            width: 100%;
            border-radius: 2px;
            .dutybox{
                width: 100%;
                font-size: 14px;
                border-top: 1px solid #e4e4e4;
                border-left: 1px solid #e4e4e4;
                .dutylsit{
                    display: flex;
                    flex-wrap: nowrap;
                    align-items: center;
                    justify-content: center;
                    li{
                        
                        flex: 1;
                        padding: 0px 10px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-right: 1px solid #e4e4e4;
                        border-bottom: 1px solid #e4e4e4;
                        white-space: nowrap;
                        height: 30px;
                        line-height: 2.2;
                        text-align: center;
                        &:nth-child(even){
                            overflow: hidden;
                            text-overflow: ellipsis;
                            display: block;
                        }
                        .el-input__inner {
                            height: 30px;
                            line-height: 30px;
                        }
                        // &:nth-child(odd){
                        //     width: 120px;
                        //     text-align: center;
                        //     display: -webkit-box;
                        //     -webkit-box-orient: vertical;
                        //     overflow: hidden;
                        // }
                        // &:nth-child(even){
                        //     flex: 1;
                        //     color: #999;
                        //     overflow: hidden;
                        //     text-overflow: ellipsis;
                        //     white-space: nowrap;
                        //     display: block;
                        // }
                    }
                    &:nth-of-type(1) {
                        li {
                            flex: 1;
                        }
                    }
                }
            }
        }     
    }
</style>

<style lang="scss">
    .dutybox{
        .dutylsit{
            li{
                .el-input__inner {
                    height: 30px;
                    line-height: 30px;
                    border: 0px;
                    appearance: none;
                    background: transparent;
                }
                .el-input__suffix{
                    display: none;
                }
            }
            
        }
    }
</style>

