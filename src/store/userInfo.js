

import { defineStore } from 'pinia'
// 引入接口
import { getUserInfor } from '@/api/userInfo'

export const UserInfoStore = defineStore("userInfor", {
    state: () => {
        return {
            imageUrl: '',
            name: '',
            sex: '',
            department: '',
            identity: '',
            account:'',
            email:'',
        }
    },
    actions: {
        async userInfo(id) {
            const res = await getUserInfor(id)
            // console.log(res.data);
            
            this.imageUrl=res.data.image_url
            this.name=res.data.name
            this.sex=res.data.sex
            this.department=res.data.department
            this.identity=res.data.identity
            this.account=res.data.account
            this.email=res.data.email
        }
    },
    // pinia持久化
    persist: {
        storage: localStorage,
        key:'userInfor',
        paths:[null]
    },
})

// export default UserInfoStore