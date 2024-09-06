<template>
    <div>
        <!-- 忘记密码 -->
        <el-dialog v-model="state.forgetPasswordDialog" title="忘记密码" width="450">
            <el-form :model="forgetData" label-width="auto" class="login-form" :label-position="labelPosition"
                :rules="rules">

                <!-- 账号密码输入 -->
                <el-form-item label="账号" prop="account">
                    <el-input v-model="forgetData.account" placeholder="请输入您的注册账号" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="forgetData.email" placeholder="请输入您的个人邮箱" />
                </el-form-item>
            </el-form>
            <!-- 底部下一步 -->
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="state.forgetPasswordDialog = false">取消</el-button>
                    <el-button type="primary" @click="openChangePassword">
                        下一步
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 修改密码 -->
        <el-dialog v-model="state.changePasswordDialog" title="修改密码" width="450">
            <el-form :model="forgetData" label-width="auto" class="login-form" :label-position="labelPosition"
                :rules="rules">

                <!-- 密码输入 -->
                <el-form-item label="请输入密码" prop="password">
                    <el-input v-model="forgetData.password" placeholder="请输入密码" />
                </el-form-item>
                <el-form-item label="再次输入密码" prop="repassword">
                    <el-input v-model="forgetData.repassword" placeholder="请输入密码" />
                </el-form-item>
            </el-form>
            <!-- 底部确认修改 -->
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="state.changePasswordDialog = false">取消</el-button>
                    <el-button type="primary" @click="openChangePassword">
                        确定
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue'

// 表单对齐方式
const labelPosition = ref('top')

// 表单对象接口
interface forgetData {
    account: Number;
    email: String;
    password: String;
    repassword: String;
}

// 表单对象数据
const forgetData: forgetData = reactive({
    account: null,
    email: '',
    password: '',
    repassword: '',
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
    account: [
        { required: true, message: '账号不能为空', trigger: 'blur' },
    ],
    email: [
        { required: true, message: '注册邮箱不能为空', trigger: 'blur' },
    ],
    password: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
    ],
    repassword: [
        { required: true, message: '密码不能为空', trigger: 'blur' },
    ],
})

// 控制弹出，默认关闭
const state = reactive({
    // 控制忘记密码弹窗出现
    forgetPasswordDialog: false,
    changePasswordDialog: false
})

// 打开弹出回调
const open = () => {
    state.forgetPasswordDialog = true
}

// 打开下一步的弹窗
const openChangePassword = () => {
    state.forgetPasswordDialog = false
    state.changePasswordDialog = true
}

// 将方法传递给父组件
defineExpose({
    open
})


</script>



<style scoped lang="scss">
:deep(.el-dialog) {
    padding: 30px;
}

.dialog-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    button {
        width: 100px;
    }
}
</style>