<template>
    <div>
        <el-dialog v-model="dialogFormVisible" title="撤回申请" width="600" center :draggable="true">
            <span>确定取消此产品的出库申请吗？</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="withdrawIdPro">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">

import { ref, onBeforeUnmount } from 'vue'
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt"
import { withDrawApplyProduct } from '@/api/product'
import { ElMessage } from 'element-plus';

// 控制弹窗开关
const dialogFormVisible = ref(false)
// 打开修改密码弹窗
const open = () => {
    dialogFormVisible.value = true
}

// 将方法传递给父组件
defineExpose({
    open
})

// 获得父组件的 row 用户信息
const withdrawId = ref()
bus.on('withdrawId', (id: number) => {
    withdrawId.value = id
})


// 接收父组件传递的方法
const emit = defineEmits(['success'])

// 撤回申请
const withdrawIdPro = async () => {
    const res = await withDrawApplyProduct(withdrawId.value)
    if (res.data.status == 0) {
        dialogFormVisible.value = false
        emit('success')
        ElMessage({
            message: '撤回申请成功',
            type: 'success'
        })
    } else {
        ElMessage.error('撤回申请失败')
        dialogFormVisible.value = false
    }
}

// 取消监听
onBeforeUnmount(() => {
    bus.all.clear()
})

</script>

<style scoped lang="scss">
.el-dialog {
    span {
        padding: 20px 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 15px;
        font-weight: 600;
    }
}
</style>