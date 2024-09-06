<template>
    <div class="common-layout">
        <el-container>
            <el-header class="header-wrapped">
                <div class="header-content">
                    <h3>通用后台系统管理</h3>
                    <span class="welcome">欢迎您的登录</span>
                </div>
            </el-header>


            <el-main>
                <div class="login-wrapped">
                    <el-card style="max-width: 480px">
                        <el-tabs v-model="activeName" class="demo-tabs" :stretch="true">
                            <el-tab-pane label="登录" name="first">
                                <el-form :model="loginData" label-width="auto" class="login-form">

                                    <!-- 账号密码输入 -->
                                    <el-form-item label="账号">
                                        <el-input v-model="loginData.account" placeholder="请输入账号" />
                                    </el-form-item>
                                    <el-form-item label="密码">
                                        <el-input v-model="loginData.password" placeholder="请输入密码" />
                                    </el-form-item>

                                    <!-- 登录注册 -->
                                    <div class="foot-wrapped">
                                        <div class="forget-password">
                                            <span class="forget-password-button" @click="openPassword">忘记密码</span>
                                        </div>
                                        <div class="footer-button">
                                            <el-button type="primary" @click="Login">登录</el-button>
                                        </div>
                                        <div class="footer-go-register">
                                            <span>还没有账号</span>
                                            <span class="go-register">马上注册</span>
                                        </div>
                                    </div>
                                </el-form>
                            </el-tab-pane>

                            <el-tab-pane label="注册" name="second">
                                <el-form class="login-form" :module="registerData">
                                    <!-- 账号密码输入 -->
                                    <el-form-item label="账号">
                                        <el-input v-model="registerData.account" placeholder="账号长度6-12位" />
                                    </el-form-item>
                                    <el-form-item label="密码">
                                        <el-input v-model="registerData.password" placeholder="请输入6-12位数字字母混合密码" />
                                    </el-form-item>
                                    <el-form-item label="确认密码">
                                        <el-input v-model="registerData.repassword" placeholder="请再次输入密码" />
                                    </el-form-item>
                                    <div class="footer-button">
                                        <el-button type="primary" @click="Register">注册</el-button>
                                    </div>
                                </el-form>
                            </el-tab-pane>
                        </el-tabs>
                    </el-card>
                </div>
            </el-main>


            <el-footer class="footer-wrapped">
                <div class="footer-content">
                    <div class="title">
                        <span>阿里云博客专家</span> |
                        <span>学习懒人</span> |
                        <span>学习懒人</span>
                    </div>
                </div>
            </el-footer>
        </el-container>
    </div>

    <forget ref="forgetOp"></forget>
</template>

<script setup lang="ts">

import { ref, reactive } from 'vue'
// 引入子组件
import forget from './components/forget_password.vue'
// 引入注册和登录api
import { register, login } from '@/api/login'
// 默认指向登录块(首先指向登录模块)
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'

const router = useRouter()
const activeName = ref('first')

// 登录表单数据
const loginData: formData = reactive({
    account: null,
    password: ''
})

// 表单接口
interface formData {
    account: Number;
    password: String;
    repassword?: String;
}

// 注册表单数据
const registerData: formData = reactive({
    repassword: '',
    account: null,
    password: ''
})

// 登录
const Login = async () => {
    const res = await login(loginData)
    const {token} = res.data
    if (res.data.message == '登录成功') {
        ElMessage({
            message: '登录成功',
            type: 'success',
        })
        localStorage.setItem('token',token)
        // 跳转到首页
        router.push('/home')
    }else{
        ElMessage.error('登录失败')
    }

}

// 注册
const Register = async () => {
    if (registerData.password == registerData.repassword) {
        const res = await register(registerData)
        if (res.data.message == '注册成功') {
            ElMessage({
                message: '注册成功',
                type: 'success',
            })
            // 注册成功，转到登录页面
            activeName.value = 'first'
        } else {
            ElMessage.error('注册失败')
        }
    } else {
        ElMessage.error('两次输入密码不一致')
    }

}

// 用来绑定子组件传递的属性
const forgetOp = ref();
// 打开忘记密码弹出
const openPassword = () => {
    forgetOp.value.open()
}

</script>

<style lang="scss" scoped>
// 头部内容
.header-wrapped {
    .header-content {
        width: 70%;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        align-items: center;

        .welcome {
            font-size: 14px;
        }
    }
}

// 内容
.el-main {
    background-image: url('@/assets/海景.jpg');
    height: 87vh;
    background-size: cover;
    overflow: hidden;

    .login-wrapped {
        width: 70%;
        height: 100vh;
        margin: 0 auto;

        .el-card {
            width: 350px;
            height: 375px;
            float: right;
            position: relative;
            top: 14%;
            border: 0;

            .login-form {
                .foot-wrapped {
                    display: flex;
                    flex-direction: column;

                    // 忘记密码
                    .forget-password {
                        display: flex;
                        justify-content: flex-end;
                        margin-top: 10px;

                        // 忘记密码，并添加动画
                        .forget-password-button {
                            font-size: 13px;
                            color: #409EFF;
                            position: relative;
                            cursor: pointer;

                            &::after {
                                content: "";
                                position: absolute;
                                left: 0;
                                bottom: -2px;
                                width: 100%;
                                height: 2px;
                                background-color: #409EFF;
                                opacity: 0;
                                // transform: scaleX(0);
                                transition: all 0.5s;
                            }

                            &:hover::after {
                                opacity: 1;

                            }
                        }
                    }

                    // 还没有账号，马上注册
                    .footer-go-register {
                        font-size: 13px;
                        margin: 12px 0;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        .go-register {
                            color: #409EFF;
                            cursor: pointer;
                            margin-left: 5px;
                        }
                    }
                }
            }



        }

    }
}

// 底部
.footer-wrapped {
    margin-top: 10px;

    .footer-content {
        width: 70%;
        margin: 0 auto;
        display: flex;
        justify-content: center;
        align-items: center;

        .title {
            color: #666;
            font-size: 13px;
        }

        span {
            color: #666;
            font-size: 13px;
            cursor: pointer;
        }
    }
}




.el-form {
    margin-top: 30px;
    padding: 0 10px;
}

// 登录按钮
:deep(.el-button) {
    width: 100%;
    height: 40px;
    margin-top: 10px;
    font-size: 16px;
}

// 输入框
:deep(.el-input__inner) {
    height: 40px;
}

// 登录注册文字
:deep(.el-tabs__item) {
    color: #333;
    font-size: 18px;
}

// 输入框文字标签
:deep(.el-form-item__label) {
    height: 40px;
    line-height: 40px;
}
</style>