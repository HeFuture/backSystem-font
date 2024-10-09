<template>
    <div>
        <el-dialog v-model="dialogFormVisible" title="申请产品出库" width="600" align-center :draggable="true">

            <div class="product-name">您申请出库的产品是：{{ formData.product_name }}</div>
            <div class="product-name">该产品库存数量为：{{ formData.product_inwarehouse_number }}</div>
            <div class="dialog-content">
                <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="180px"
                    :label-position="labelPosition">
                    <el-form-item label="申请出库编号" prop="product_out_id">
                        <el-input v-model="formData.product_out_id" />
                    </el-form-item>
                    <el-form-item label="出库数量" prop="product_out_number">
                        <el-input v-model="formData.product_out_number" />
                    </el-form-item>
                    <el-form-item label="出库申请人" prop="product_out_apply_person">
                        <el-input v-model="formData.product_out_apply_person" disabled />
                    </el-form-item>
                    <el-form-item label="产品单价" prop="product_single_price">
                        <el-input v-model="formData.product_single_price" disabled />
                    </el-form-item>
                    <el-form-item label="出库备注" prop="apply_memo">
                        <el-input v-model="formData.apply_memo" />
                    </el-form-item>
                </el-form>
            </div>

            <!-- 底部确认修改 -->
            <template #footer>
                <div class="dialog-footer">
                    <el-button type="primary" @click="addProduct" :loading="isLoading">确定</el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">

import { ref, reactive, onBeforeUnmount } from 'vue'
import { ElMessage } from 'element-plus';
import { applyOutProduct } from '@/api/product'
import { bus } from '@/utils/mitt';

// 获得父组件的 row 用户信息
bus.on('appllyId', (row: any) => {
    formData.id = row.id
    formData.product_name = row.product_name
    formData.product_single_price = row.product_single_price
    formData.product_inwarehouse_number = row.product_inwarehouse_number
})
// 设置form表单对齐方式
const labelPosition = ref('left')

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

// const departmentData = ref([])
// 获取部门数据
// const getdepartment = async () => {
//     const res = await getDepartment()
//     // JSON.parse 反序列化数据 
//     departmentData.value = JSON.parse(res.data[0].set_value)
// }
// getdepartment()

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

// 数据绑定
const formData: formData = reactive({
    id: null,
    product_name: '',
    product_out_id: null,
    product_inwarehouse_number: null,
    product_out_number: null,
    product_single_price: null,
    product_out_apply_person: localStorage.getItem('name'),
    apply_memo: '',
})

// 表单校验规则
const rules = reactive({
    // 规则对象属性：
    /* 
        required：表示字段必须要校验
        min：文本长度最少多少位
        max：文本长度最多多少位
        message：错误的提示信息
        trigger：触发校验表单的时机 change -> 文本发生改变时触发校验，blur -> 失去焦点触发
    */
    product_out_id: [
        { required: true, message: '请输入申请出库编号', trigger: 'blur' },
    ],
    product_out_number: [
        { required: true, message: '请输入申请出库数量', trigger: 'blur' },
    ],
    product_single_price: [
        { required: true },
    ],
    product_out_apply_person: [
        { required: true, message: '出库申请人', trigger: 'blur' },
    ]
})

// loading加载中
const isLoading = ref(false)
// 接收父组件传递的方法
const emit = defineEmits(['success'])

// 获取表单数据，用来判断用户是否填入指定数据
const ruleFormRef = ref(null)
// 产品申请出库
const addProduct = () => {
    // 提交form表单前，判断表单数据是否输入
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            if (formData.product_inwarehouse_number - formData.product_out_number < 0) {
                isLoading.value = false
                ElMessage.error('库存数量不足')
            } else {
                console.log(formData.product_out_id);
                
                const res = await applyOutProduct(formData)
                isLoading.value = true
                if (res.data.status == 0) {
                    isLoading.value = false
                    emit('success')
                    // 产品申请出库成功后，向审核列表发送标识，提示更新列表
                    // bus.emit('apply', 1)
                    dialogFormVisible.value = false
                    ElMessage({
                        message: '产品申请出库成功',
                        type: 'success'
                    })
                }
                else if (res.data.status == 2) {
                    isLoading.value = false
                    ElMessage.error('申请出库编号已存在')
                }
                else {
                    isLoading.value = false
                    ElMessage.error('产品申请出库失败')
                    dialogFormVisible.value = false
                }
            }

        }

    })

}

// 取消监听
onBeforeUnmount(() => {
    bus.all.clear()
})

</script>

<style scoped lang="scss">
.product-name {
    display: flex;
    justify-content: center;
    font-size: 16px;
    color: #333;
    padding-bottom: 8px;
}

.dialog-content {
    display: flex;
    padding: 0 20px 20px 50px;

    .el-form {
        padding-left: 40px;

        .el-form-item {
            margin: 20px;

        }
    }

}

// 于是在网上搜了搜element.style的属性（对它的讲解可以自己搜一下，看一下专业的，我这只小菜鸟讲不好啦~），大概说的意思就是，这是我引入外部js/css包里人家定义好的，他的这种样式会把自己的样式给覆盖掉。需要在自己定义的样式后面加上！important控制来优先使用自己的样式。
:deep(.el-form-item__label) {
    width: 140px !important;

}
</style>