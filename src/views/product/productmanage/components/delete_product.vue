<template>
    <div>
        <el-dialog v-model="dialogFormVisible" title="删除产品" width="600" center :draggable="true">
            <span>请慎重操作，删除后将失去此产品的记录</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="deletePro">删除</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">

import { ref, onBeforeUnmount } from 'vue'
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt"
import { deleteProduct } from '@/api/product'
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
const productId = ref()
bus.on('deleteProId', (id: number) => {
    productId.value = id
})


// 接收父组件传递的方法
const emit = defineEmits(['success'])

// 删除产品信息
const deletePro = async () => {
    const res = await deleteProduct(productId.value)
    if (res.data.status == 0) {
        dialogFormVisible.value = false
        emit('success')
        ElMessage({
            message: '删除产品成功',
            type: 'success'
        })
    } else {
        ElMessage.error('删除产品失败')
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