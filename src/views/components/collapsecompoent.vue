<template>
    <div class="collapsecompoent">
        <el-card>
            <ul class="disflex">
                <li class="titlecals first"><slot name="titles"></slot></li>
                <li class="btnlistclass">
                    <slot name="btnlist"></slot>
                </li>
                <li class="xiala last" :class="[show ? 'el-icon-arrow-up' : 'el-icon-arrow-down']" @click="show = !show">
                    {{show ? "收缩" : "展开"}}
                </li>
            </ul>
            <el-collapse-transition>
                <div v-show="show" class="p_top10">
                    <slot name="content"></slot>
                </div>
            </el-collapse-transition>
        </el-card>
    </div>
</template>
<script>
export default {
    props: {
      isShow: {
        type: Boolean,
        default: () => true
      }
    },
    data() {
        return {
            show: this.isShow,
        }
    },
}
</script>
<style lang="scss" scoped>
.collapsecompoent{
    margin-top: 5px;
    .p_top10{
        padding-top: 5px;
    }
    .disflex{
        display: flex;
        width: 100%;
        justify-content: space-between;
        align-items: center;
        .btnlistclass{
            flex: 1;
            height: auto;
        }
        .first{
            width: 100px;
        }
        .last{
            width: 50px;
        }
    }
    .titlecals{
        top: 0;
    }
    .xiala{
        font-size: 14px;
        color: rgb(83, 168, 255);
        cursor: pointer;
    }
}
</style>
