<template>
    <div>
        <el-dialog v-model="dialogFormVisible" title="再次申请出库" width="600" center :draggable="true">
            <span>请慎重操作，此操作将再次申请产品出库</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="applyPro">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">

import { ref, onBeforeUnmount, reactive } from 'vue'
// 兄弟组件传值之mitt
import { bus } from "@/utils/mitt"
import { applyOutProduct } from '@/api/product'
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

// 数据接口类型
interface formData {
    id: number,
    product_name: string,
    product_out_id: number,
    product_inwarehouse_number: number,
    product_out_number: number,
    product_single_price: number,
    product_out_apply_person: string,
    apply_memo: string,
}

// 审核产品状态
const formData = reactive({
    id: 0,
    product_name: '',
    product_out_id: 0,
    audit_memo: '',
    product_out_apply_person: '',
    product_inwarehouse_number: 0,
    product_single_price: 0,
    product_out_number: '',
})

// 获得父组件的 row 用户信息
bus.on('againId', (row: any) => {
    formData.id = row.id
    formData.product_out_id = row.product_out_id
    formData.audit_memo = row.audit_memo
    formData.product_out_apply_person = row.product_out_apply_person
    formData.product_inwarehouse_number = row.product_inwarehouse_number
    formData.product_single_price = row.product_single_price
    formData.product_out_number = row.product_out_number
    formData.product_name = row.product_name
})


// 接收父组件传递的方法
const emit = defineEmits(['success'])

// 再次申请产品出库
const applyPro = async () => {
    const res = await applyOutProduct(formData)
    if (res.data.status == 0) {
        dialogFormVisible.value = false
        emit('success')
        ElMessage({
            message: '再次申请产品出库成功',
            type: 'success'
        })
    } else {
        ElMessage.error('再次申请产品出库失败')
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