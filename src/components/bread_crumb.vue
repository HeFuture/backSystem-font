<template>
    <div class="bread_crumb">
        <SvgIcon icon-name="坐标" class="bread-crumb-icon"></SvgIcon>
        <el-breadcrumb separator="/">
            <el-breadcrumb-item>{{ props.item.first }}</el-breadcrumb-item>
            <el-breadcrumb-item v-if="props.item.second">{{ props.item.second }}</el-breadcrumb-item>
        </el-breadcrumb>
    </div>
</template>

<script setup lang="ts">

// 导入svgIcon
import SvgIcon from './SvgIcon.vue';
// 接收父组件的值
const props = defineProps(['item'])

</script>

<style scoped lang="scss">
.bread_crumb {
    height: 30px;
    padding: 8px 20px 0 28px;
    display: flex;
    align-items: center;
    .bread-crumb-icon{
        margin-right: 4px
    }

}

:deep(.el-breadcrumb) {
    height: 30px;
    font-size: 14px;
    line-height: 30px;
    cursor: pointer;
}

</style>