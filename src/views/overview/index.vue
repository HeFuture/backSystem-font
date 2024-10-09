<template>
    <bread_crumb ref="breadcrumb" :item="item"></bread_crumb>
    <!-- 系统概览模块 -->
    <div class="overview-wrapped">

        <!-- 上部分内容 个人资料 + 饼状图 -->
        <div class="top-content-wrapped">
            <!-- 个人信息 -->
            <div class="person-infor">
                <!-- 头像区域 -->
                <div class="person-avatar-wrapped">
                    <el-avatar :size="100" :src="userStore.imageUrl"></el-avatar>
                    <!-- 职务 -->
                    <span class="department">所属部门：{{ userData.department }}</span>
                    <!-- 公司 -->
                    <div class="company">所属公司：捣蛋设计</div>
                </div>
                <!-- 分割线 -->
                <div class="line-wrapped">
                    <div class="line"></div>
                </div>
                <!-- 详细信息区域 -->
                <div class="detail-infor-wrapped">
                    <p>姓名：{{ userData.name }}</p>
                    <p>性别：{{ userData.sex }}</p>
                    <p>身份：{{ userData.identity }}</p>
                    <p>分管领域：超级管理</p>
                    <p>权限：最高权限</p>
                </div>
            </div>
            <!-- 管理员与用户比值饼状图pie第一个类用于创建图例，第二个类修改样式 -->
            <div class="manage-user pie"></div>
        </div>

        <!-- 产品类别图 为了与产品类别饼状图区分 加了个bar代表柱状图 -->
        <div class="product-category-bar mid-content-wrapped">
            <!-- 中间部分内容 消息阅读量图 产品类别图 -->
            <div class="mid-content-left"></div>
            <div class="mid-content-right">
                <div class="title">常用管理</div>
                <el-row :gutter="20">
                    <el-col :span="6">
                        <div class="button-area" @click="routerTo('users_manage')">
                            <SvgIcon icon-name="team" style="width: 24px;height: 24px"></SvgIcon>
                            <span class="button-name">用户管理</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="button-area" @click="routerTo('productmanage')">
                            <SvgIcon icon-name="CodeSandbox" style="width: 24px;height: 24px"></SvgIcon>
                            <span class="button-name">产品管理</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="button-area"  @click="routerTo('message_list')">
                            <SvgIcon icon-name="sound" style="width: 24px;height: 24px"></SvgIcon>
                            <span class="button-name">系统消息</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="button-area"  @click="routerTo('set')">
                            <SvgIcon icon-name="user" style="width: 24px;height: 24px"></SvgIcon>
                            <span class="button-name">个人信息</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="button-area" >
                            <SvgIcon icon-name="消息" style="width: 24px;height: 24px"></SvgIcon>
                            <span class="button-name">部门信息</span>
                        </div>
                    </el-col>
                    <el-col :span="6">
                        <div class="button-area"  @click="routerTo('set')">
                            <SvgIcon icon-name="setting" style="width: 24px;height: 24px"></SvgIcon>
                            <span class="button-name">系统设置</span>
                        </div>
                    </el-col>
                </el-row>
            </div>
        </div>

        <!-- 底部内容  下部分 footer -->
        <div class="footer-content-wrapped">
            <!-- 消息等级图 -->
            <div class="massage-level footer-content-left"></div>
            <!-- 消息每日总量图 -->
            <div class="massage-all-day footer-content-right"></div>
        </div>
    </div>
</template>

<script setup lang="ts">

import { ref, onMounted, reactive } from 'vue'
import bread_crumb from '@/components/bread_crumb.vue';
import { UserInfoStore } from '@/store/userInfo';
import * as echarts from 'echarts';
// 导入svgIcon
import SvgIcon from '@/components/SvgIcon.vue';
// 引入接口
import { getUserInfor } from '@/api/userInfo'
import { getCategoryAndNumber, getAdminAndNumber, getLevelAndNumber, getDayAndNumber } from '@/api/overview'
import { useRouter } from 'vue-router';

const router = useRouter()
const userStore = UserInfoStore()

// 点击进行路由跳转
const routerTo = (x: string) => {
    router.push(`\/${x}`)
}

// 面包屑
const breadcrumb = ref()

// 将面包屑值传递给 bread_crumb 组件
const item = ref({
    first: '系统概览'
})


// 上部分内容 个人资料 + 饼状图
// 获取用户信息
const getUserinfo = async () => {
    const res = await getUserInfor(localStorage.getItem('id'))
    userData.name = res.data.name
    userData.sex = res.data.sex
    userData.department = res.data.department
    userData.identity = res.data.identity
}
getUserinfo()
interface userData {
    name: string,
    sex: string,
    department: string,
    identity: string,
}
const userData: userData = reactive({
    name: '',
    sex: '',
    department: '',
    identity: '',
})


// 调用echarts图
onMounted(() => {
    manageUser()
    productCategoryBar()
    massageLevel()
    massageAllDay()
})
// 管理员与用户比值图
const manageUser = async () => {
    // 通过类名 初始化
    const mu = echarts.init(document.querySelector('.manage-user'))
    mu.showLoading()
    // 获取不同角色与数量
    let res = await getAdminAndNumber()
    // console.log(res.data);
    mu.hideLoading()
    document.querySelector('.manage-user').setAttribute('_echarts_instance_', '')
    // 设置基本的参数
    mu.setOption({
        title: {
            text: '管理与用户对比图',
            // subtext: 'Fake Data',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            padding: [20, 20, 20, 20]
        },
        series: [
            {
                // name: 'Access From',
                type: 'pie',
                radius: '65%',
                data: res.data.data,
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    })
    // 用于echarts响应式
    window.addEventListener('resize', function () {
        mu.resize()
    })
}

// 产品类别图
const productCategoryBar = async () => {
    const pcb = echarts.init(document.querySelector('.mid-content-left'))
    pcb.showLoading()
    // 获取产品类别和总价
    let res = await getCategoryAndNumber()
    // console.log(res.data);
    pcb.hideLoading()
    document.querySelector('.mid-content-left').setAttribute('_echarts_instance_', '')
    pcb.setOption({
        title: {
            text: "产品类别库存总价图",
            top: "3%",
            textStyle: {
                fontSize: 16
            },
        },
        tooltip: {
            trigger: 'axis',
        },
        xAxis: {
            type: 'category',
            // 食品类，服装类，鞋帽类，日用品类，家具类，家用电器类，纺织品类，五金类
            data: res.data.category
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: res.data.price,
                type: 'bar',
                barWidth: 40,
                colorBy: "data"
            },
        ]
    })
    window.addEventListener('resize', function () {
        pcb.resize()
    })
}

// 公告等级分布图
const massageLevel = async () => {
    const ml = echarts.init(document.querySelector('.massage-level'))
    ml.showLoading()
    // 获取不同消息等级和数量
    let res = await getLevelAndNumber()
    // console.log(res.data);
    ml.hideLoading()
    document.querySelector('.massage-level').setAttribute('_echarts_instance_', '')
    ml.setOption({
        title: {
            text: "公告等级分布图",
            top: "3%",
            textStyle: {
                fontSize: 16
            },
        },
        tooltip: {
            trigger: 'item'
        },
        legend: {
            top: '5%',
            left: 'center'
        },
        series: [
            {
                // name: 'Access From',
                type: 'pie',
                radius: ['35%', '65%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 10,
                    borderColor: '#fff',
                    borderWidth: 2
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: res.data.data,
            }
        ]
    })
    window.addEventListener('resize', function () {
        ml.resize()
    })
}

// 消息每日总量图
const massageAllDay = async () => {

    const mad = echarts.init(document.querySelector('.massage-all-day'))
    mad.showLoading()
    // 返回每天登录人数
    let res = await getDayAndNumber()
    // console.log(res.data);
    mad.hideLoading()
    document.querySelector('.massage-all-day').setAttribute('_echarts_instance_', '')
    mad.setOption({
        title: {
            text: "每日登录人数图",
            top: "3%",
            textStyle: {
                fontSize: 16
            },
        },
        tooltip: {
            trigger: 'item'
        },
        xAxis: {
            type: 'category',
            data: res.data.week
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                data: res.data.number,
                type: 'line'
            }
        ]
    })
    window.addEventListener('resize', function () {
        mad.resize()
    })
}


</script>

<style scoped lang="scss">
// 总览内容
.overview-wrapped {
    padding: 8px;
    height: calc(100vh - 85px);
    background: #f5f5f5;

    // 上部分内容 个人资料 + 饼状图
    .top-content-wrapped {
        height: 30%;
        display: flex;

        // 个人信息
        .person-infor {
            padding: 0 40px;
            height: 100%;
            margin-right: 8px;
            width: calc(50% - 8px);
            display: flex;
            background: #fff;

            // 头像区域
            .person-avatar-wrapped {
                display: flex;
                width: 60%;
                height: 100%;
                justify-content: center;
                align-items: center;
                flex-direction: column;

                // 公司
                .company {
                    margin: 10px 0px;
                    font-size: 13px;
                }

                // 职务
                .department {
                    margin-top: 8px;
                    font-size: 13px;
                }

            }

            // 分割线
            .line-wrapped {
                height: 100%;
                display: flex;
                align-items: center;

                .line {
                    height: 170px;
                    border: 1px solid #D3D3D3;
                }
            }

            // 详细信息区域
            .detail-infor-wrapped {
                height: 100%;
                width: calc(50% - 1px);
                margin-left: 50px;
                padding-left: 50px;
                font-size: 14px;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                justify-content: center;

                p {
                    padding: 4px;
                }
            }
        }

        // 饼状图
        .pie {
            width: calc(50%);
            height: 100%;
            background: #fff;
        }
    }

    // 中间部分内容 消息阅读量图 产品类别图
    .mid-content-wrapped {
        margin-top: 8px;
        height: calc(32% - 8px);
        display: flex;


        // 中间左部分
        .mid-content-left {
            margin-right: 8px;
            width: calc(60% - 8px);
            background: #fff;
            padding: 0 40px;
        }

        // 中间右部分
        .mid-content-right {
            width: calc(40%);
            background: #fff;
            padding: 8px;
            padding: 0 40px;

            // 标题
            .title {
                font-size: 14px;
                margin-top: 8px;
                margin-bottom: 20px;
            }

            // 按钮区域
            .button-area {
                margin-bottom: 15px;
                height: 100px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                cursor: pointer;
                background: #F5F5F5;
                transition: all 0.3s ease-in-out;

                // 按钮名字
                .button-name {
                    margin-top: 10px;
                }
            }

            // 按钮变色
            .button-area:hover {
                background: #e4efff;
                box-shadow: 1px 1px 4px 1px rgb(211, 211, 211);
            }
        }
    }

    // 底部内容
    .footer-content-wrapped {
        margin-top: 8px;
        height: calc(38% - 8px);
        display: flex;

        // 底部左部分
        .footer-content-left {
            margin-right: 8px;
            height: 100%;
            width: calc(30% - 8px);
            background: #fff;
            padding: 0 40px;
        }

        // 底部右部分
        .footer-content-right {
            height: 100%;
            width: calc(70%);
            background: #fff;
            padding-left: 40px;
        }
    }
}
</style>