<template>
    <div class="common-layout">
        <el-container>
            <el-aside width="200px">
                <el-menu class="el-menu-vertical-demo" router text-color="white" background-color="#2b303b">
                    <div class="title">通用后台管理系统</div>
                    <el-menu-item index="home">
                        <el-icon>
                            <House />
                        </el-icon>
                        <span>首页</span>
                    </el-menu-item>

                    <el-menu-item index="1">
                        <el-icon>
                            <Document />
                        </el-icon>
                        <span>系统概览</span>
                    </el-menu-item>
                    <el-sub-menu index="2">
                        <template #title>
                            <el-icon>
                                <User />
                            </el-icon>
                            <span>用户管理</span>
                        </template>
                        <el-menu-item-group title="管理员管理">
                            <el-menu-item index="2-1">产品管理员</el-menu-item>
                            <el-menu-item index="2-2">用户管理员</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="员工管理">
                            <el-menu-item index="2-3">用户列表</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>

                    <el-sub-menu index="3">
                        <template #title>
                            <el-icon>
                                <TakeawayBox />
                            </el-icon>
                            <span>产品管理</span>
                        </template>
                        <el-menu-item-group title="入库管理">
                            <el-menu-item index="3-1">产品列表</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="出库管理">
                            <el-menu-item index="3-3">用户列表</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>

                    <el-sub-menu index="4">
                        <template #title>
                            <el-icon>
                                <ChatSquare />
                            </el-icon>
                            <span>消息管理</span>
                        </template>
                        <el-menu-item-group title="消息管理">
                            <el-menu-item index="4-1">产品列表</el-menu-item>
                        </el-menu-item-group>
                        <el-menu-item-group title="回收站">
                            <el-menu-item index="4-3">回收站</el-menu-item>
                        </el-menu-item-group>
                    </el-sub-menu>

                    <el-menu-item index="5">
                        <el-icon><icon-menu /></el-icon>
                        <span>合同管理</span>
                    </el-menu-item>
                    <el-menu-item index="6">
                        <el-icon><icon-menu /></el-icon>
                        <span>操作日志</span>
                    </el-menu-item>
                    <el-menu-item index="7">
                        <el-icon><icon-menu /></el-icon>
                        <span>登录日志</span>
                    </el-menu-item>
                    <el-menu-item index="8">
                        <el-icon>
                            <Tools />
                        </el-icon>
                        <span>系统设置</span>
                    </el-menu-item>
                </el-menu>
            </el-aside>
            <el-container>
                <el-header>
                    <span class="header-left-content">
                        尊敬的李青欢迎你登录本系统
                    </span>
                    <div class="header-right-content">
                        <el-icon :size="24">
                            <Message />
                        </el-icon>
                        <el-avatar :size="24" :src="state.circleUrl" />
                        <el-dropdown>
                            <span class="el-dropdown-link">设置</span>
                            <template #dropdown>
                                <el-dropdown-menu>
                                    <el-dropdown-item>设置账号</el-dropdown-item>
                                    <el-dropdown-item>更改头像</el-dropdown-item>
                                    <el-dropdown-item @click="goLogin">退出登录</el-dropdown-item>
                                </el-dropdown-menu>
                            </template>
                        </el-dropdown>
                    </div>
                </el-header>
                <el-main>
                    <router-view></router-view>
                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang="ts">

import { Menu as IconMenu, House, Document, User, TakeawayBox, ChatSquare, Tools, Message } from '@element-plus/icons-vue'
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router';

const router=useRouter()
// 头像
const state = reactive({
    circleUrl: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',

})

const goLogin=()=>{
    router.push('/login')
}

</script>

<style scoped lang="scss">
// 侧边栏
.el-aside {
    height: 100vh;
    background-color: $base-menu-background;
    width: $base-menu-width;
    overflow-x: hidden;

    .el-menu {
        background: $base-menu-background;
        width: $base-menu-width;
        height: 100vh;
        border-right: 0px;
    }

    .title {
        padding: 20px;
        display: flex;
        justify-content: center;
        color: #fff;
        background: $base-menu-background;
    }

}

.el-menu-item:hover {
    background: #545d70;
}

:deep(.el-sub-menu__title):hover {
    background: #545d70;
}

// tabbar
.el-header{
    display: flex;
    height: $base-tabbar-height;
    background: $base-menu-background;
    justify-content: space-between;
    align-items: center;
    color: #fff;
    padding: 0 40px;
    .header-left-content{
        font-size: 14px;
    }
    .header-right-content{
        width: 160px;
        display: flex;
        justify-content:space-between;
        align-items: center;
        .el-dropdown-link{
            color: #fff;
        }
    }
}
</style>