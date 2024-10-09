<template>
    <el-dialog v-model="dialogTableVisible" title="赋权操作" width="30%" center>
        <el-radio-group v-model="radio1">
            <el-radio value="1" size="large">产品管理员</el-radio>
            <el-radio value="2" size="large">用户管理员</el-radio>
            <el-radio value="3" size="large">消息管理员</el-radio>
        </el-radio-group>
        <template #footer>
            <span class="">
                <el-button type="primary" @click="yes">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang="ts">

import { ref, onBeforeUnmount } from 'vue'
import { bus } from "@/utils/mitt";
import { changeIdentityToAdmin } from '@/api/userInfo'
import { ElMessage } from 'element-plus';

const userid = ref()
bus.on('promoteId', (id: any) => {
    userid.value = id
})
// 赋权选择管理员
const yes = async () => {
    if (radio1.value == 1) {
        const res = await changeIdentityToAdmin(userid.value, '产品管理员')
        if (res.data.status == 0) {
            dialogTableVisible.value = false
            ElMessage({
                message: '赋权成功',
                type: 'success'
            })
            bus.emit('offDialog', 1)
        } else {
            ElMessage.error('赋权失败')
        }
    }
    else if (radio1.value == 2) {
        const res = await changeIdentityToAdmin(userid.value, '用户管理员')
        if (res.data.status == 0) {
            dialogTableVisible.value = false
            ElMessage({
                message: '赋权成功',
                type: 'success'
            })
            bus.emit('offDialog', 2)
        } else {
            ElMessage.error('赋权失败')
        }
    }
    else {
        const res = await changeIdentityToAdmin(userid.value, '消息管理员')
        if (res.data.status == 0) {
            dialogTableVisible.value = false
            ElMessage({
                message: '赋权成功',
                type: 'success'
            })
            bus.emit('offDialog', 3)
        } else {
            ElMessage.error('赋权失败')
        }
    }
}
// 判断管理员
const radio1 = ref(1)

// 控制弹窗开关
const dialogTableVisible = ref(false)

// 打开编辑弹窗
const open = () => {
    dialogTableVisible.value = true
}
// 将方法传递给父组件
defineExpose({
    open
})

// 取消监听
onBeforeUnmount(() => {
    bus.all.clear()
})

</script>

<style scoped lang="scss">
.el-radio-group {
    display: flex;
    justify-content: center;
    padding: 10px 0;
}
</style>