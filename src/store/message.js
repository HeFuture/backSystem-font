import { defineStore } from 'pinia'
// 引入接口
import { getReadListAndStatus, getDepartmentMsgList } from '@/api/dep_msg'

export const UseMessage = defineStore("messageInfor", {
    state: () => {
        return {
            read_list: [],
            msg_list: []
        }
    },
    actions: {
        async returnReadList(id) {
            this.read_list = []
            this.msg_list = []
            const res = await getReadListAndStatus(id)
            const userInforString = localStorage.getItem('userInfor')
            const userInfor = JSON.parse(userInforString);
            const department = userInfor.department;
            const res2 = await getDepartmentMsgList(department)
            // this.read_list = JSON.parse(res.data[0].read_list) || '[]';
            try {
                this.read_list = JSON.parse(res.data[0].read_list) || [];
                this.msg_list = res2.data
            } catch (error) {
                console.error('Error parsing read_list:', error);
                this.read_list = [];
            }
        }
    },
    // pinia持久化
    persist: {
        storage: localStorage,
        key: 'messageInfor',
        // paths: [null]

    },
})