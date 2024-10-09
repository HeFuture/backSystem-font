<template>
    <div>
        <el-dialog v-model="dialogFormVisible" title="清空列表" width="600" center :draggable="true">
            <span>请慎重操作，是否确定清空该列表？该操作无法撤回</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="clearList">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">

import { ref, onBeforeUnmount } from 'vue'
// 兄弟组件传值之mitt
// import { bus } from "@/utils/mitt"
import { truncateLoginLogList } from '@/api/loginLog'
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


// 接收父组件传递的方法
const emit = defineEmits(['success'])

// 清空列表
const clearList = async () => {
    const res = await truncateLoginLogList()
    if (res.data.status == 0) {
        dialogFormVisible.value = false
        emit('success')
        ElMessage({
            message: '清空列表成功',
            type: 'success'
        })
    } else {
        ElMessage.error('清空列表失败')
        dialogFormVisible.value = false
    }

}


// 取消监听
// onBeforeUnmount(() => {
//     bus.all.clear()
// })

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