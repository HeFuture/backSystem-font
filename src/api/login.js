
import instance from '@/http/index'

// 注册
export const register = data => {
    const { account, password } = data
    return instance({
        url: '/api/register',
        method: 'POST',
        data: {
            account,
            password
        }
    })
}

// 登录
export const login = data => {
    const { account, password } = data
    return instance({
        url: '/api/login',
        method: 'POST',
        data: {
            account,
            password
        }
    })
}

// 忘记密码 验证邮箱和账号是否正确
export const veirfy = data => {
    const { account, email } = data
    return instance({
        url: '/user/verifyAccountAndEmail',
        method: 'POST',
        data: {
            account,
            email
        }
    })
}

// 验证通过后 用户密码重置
export const resetPwd = (id, newPassword) => {
    return instance({
        url: '/user/changePasswordInLogin',
        method: 'POST',
        data: {
            id,
            newPassword
        }
    })
}