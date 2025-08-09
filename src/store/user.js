import {defineStore} from "pinia";
import {ref} from "vue";

export const useUserStore = defineStore("user", ()=>{
    const currentUser = ref('');

    function setCurrentUser(user) {
        currentUser.value = user;
    }

    return {
        currentUser,
        setCurrentUser
    }
})