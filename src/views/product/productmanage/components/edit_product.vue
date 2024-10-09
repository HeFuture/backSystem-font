<template>
    <div>
        <el-dialog v-model="dialogFormVisible" title="编辑产品" width="600" align-center :draggable="true">
            <div class="dialog-content">
                <el-form ref="ruleFormRef" :model="formData" :rules="rules" label-width="180px"
                    :label-position="labelPosition">
                    <el-form-item label="入库编号" prop="product_id">
                        <el-input v-model="formData.product_id" disabled />
                    </el-form-item>
                    <el-form-item label="产品名称" prop="product_name">
                        <el-input v-model="formData.product_name" />
                    </el-form-item>
                    <el-form-item label="产品类别" prop="product_category">
                        <el-select v-model="formData.product_category" placeholder="请选择产品类别">
                            <el-option :label="item" :value="item" v-for="item in categoryData" :key="item" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="产品单位" prop="product_unit">
                        <el-select v-model="formData.product_unit" placeholder="请选择产品单位">
                            <el-option label="个" value="个" />
                            <el-option label="件" value="件" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="产品入库数量" prop="product_inwarehouse_number">
                        <el-input v-model="formData.product_inwarehouse_number" />
                    </el-form-item>
                    <el-form-item label="产品入库单价" prop="product_single_price">
                        <el-input v-model="formData.product_single_price" />
                    </el-form-item>
                    <el-form-item label="入库负责人" prop="product_create_person">
                        <el-input v-model="formData.product_create_person" disabled />
                    </el-form-item>
                    <el-form-item label="入库备注" prop="in_memo">
                        <el-input v-model="formData.in_memo" type="textarea" />
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

import { ref, reactive, onBeforeUnmount } from 'vue';
import { ElMessage } from 'element-plus';
import { editProduct } from '@/api/product';
import { bus } from '@/utils/mitt';
import { getProduct } from '@/api/setting'

// 获得父组件的 row 用户信息
bus.on('editProId', (row: any) => {
    formData.id = row.id
    formData.product_id = row.product_id
    formData.product_name = row.product_name
    formData.product_category = row.product_category
    formData.product_unit = row.product_unit
    formData.product_inwarehouse_number = row.product_inwarehouse_number
    formData.product_single_price = row.product_single_price
    formData.product_create_person = row.product_create_person
    formData.in_memo = row.in_memo
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

const categoryData = ref([])
// 获取产品数据
const getproduct = async () => {
    const res = await getProduct()
    // JSON.parse 反序列化数据 
    categoryData.value = JSON.parse(res.data[0].set_value)
}
getproduct()

// 数据接口类型
interface formData {
    id: number,
    product_id: number,
    product_name: string,
    product_category: string,
    product_unit: string,
    product_inwarehouse_number: number,
    product_single_price: number,
    product_create_person: string,
    in_memo: string,
}

// 数据绑定
const formData: formData = reactive({
    id: null,
    product_id: null,
    product_name: '',
    product_category: '',
    product_unit: '',
    product_inwarehouse_number: null,
    product_single_price: null,
    product_create_person: '',
    in_memo: '',
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
    product_id: [
        { required: true, message: '请输入入库编号', trigger: 'blur' },
    ],
    product_name: [
        { required: true, message: '请输入产品名称', trigger: 'blur' },
    ],
    product_category: [
        { required: true, message: '请选择产品类别', trigger: 'blur' },
    ],
    product_unit: [
        { required: true, message: '请选择产品单位', trigger: 'blur' },
    ],
    product_inwarehouse_number: [
        { required: true, message: '请输入库存数量', trigger: 'blur' },
    ],
    product_single_price: [
        { required: true, message: '请输入产品单价', trigger: 'blur' },
    ],
    product_create_person: [
        { required: true, message: '请输入入库操作人', trigger: 'blur' },
    ]
})

// loading加载中
const isLoading = ref(false)
// 接收父组件传递的方法
const emit = defineEmits(['success'])

// 获取表单数据，用来判断用户是否填入指定数据
const ruleFormRef = ref(null)
// 产品入库
const addProduct = () => {
    // 提交form表单前，判断表单数据是否输入
    ruleFormRef.value.validate(async (valid) => {
        if (valid) {
            const res = await editProduct(formData)
            isLoading.value = true
            if (res.data.status == 0) {
                isLoading.value = false
                emit('success')
                dialogFormVisible.value = false
                ElMessage({
                    message: '修改产品信息成功',
                    type: 'success'
                })
            }
            else {
                isLoading.value = false
                ElMessage.error('修改产品信息失败')
                dialogFormVisible.value = false
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
.dialog-content {
    display: flex;
    padding: 20px 40px;

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