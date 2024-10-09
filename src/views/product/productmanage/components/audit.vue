<template>
    <div>
        <el-dialog v-model="dialogFormVisible" title="审核产品" width="550" center :draggable="true">
            <div class="discribe">确定审核此产品的出库吗？</div>
            <el-radio-group v-model="formData.product_out_status" class="ml-a">
                <el-radio value="同意" size="large">同意</el-radio>
                <el-radio value="否决" size="large">否决</el-radio>
            </el-radio-group>
            <el-input type="textarea" placeholder="请输入审核备注" v-model="formData.audit_memo" />
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="auditproduct">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">

import { ref, onBeforeUnmount, reactive } from 'vue'
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt"
import { ElMessage } from 'element-plus';
import { auditProduct } from '@/api/product';
import { UserInfoStore } from '@/store/userInfo';
import { tracking } from '@/utils/operation';

const userStore = UserInfoStore()
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

// 审核产品状态
const formData = reactive({
    id: 0,
    product_out_id: 0,
    product_out_status: '',
    product_name: '',
    audit_memo: '',
    product_out_price: 0,
    product_out_audit_person: userStore.name,
    product_out_apply_person: '',
    product_inwarehouse_number: 0,
    product_single_price: 0,
    product_out_number: '',
    product_apply_time: '',
})

// 获得父组件的 row 用户信息
bus.on('auditProductInfo', (row: any) => {
    formData.id = row.id
    formData.product_out_id = row.product_out_id
    formData.product_out_status = row.product_out_status
    formData.product_name = row.product_name
    formData.audit_memo = row.audit_memo
    formData.product_out_price = row.product_out_price
    formData.product_out_apply_person = row.product_out_apply_person
    formData.product_inwarehouse_number = row.product_inwarehouse_number
    formData.product_single_price = row.product_single_price
    formData.product_out_number = row.product_out_number
    formData.product_apply_time = row.product_apply_time
})


// 接收父组件传递的方法
const emit = defineEmits(['success'])

// 审核产品
const auditproduct = async () => {
    const res = await auditProduct(formData)
    if (res.data.status == 0) {
        dialogFormVisible.value = false
        emit('success')
        // 产品审核出库成功后，向产品列表发送标识，提示更新产品列表
        // bus.emit('audit', 1)
        // 操作日志记录
        await tracking('产品', localStorage.getItem('name'), formData.product_name, '高级', formData.product_out_status)
        ElMessage({
            message: '审核完成',
            type: 'success'
        })
    } else {
        ElMessage.error('审核失败')
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
    .discribe {
        margin: 20px 0 8px 50px;
    }

    .ml-a {
        display: flex;
        justify-content: center;
        padding: 10px;
    }

    .el-textarea {
        display: flex;
        justify-content: center;
    }

}

:deep(.el-textarea__inner) {

    width: 80%;
}
</style>