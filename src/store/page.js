import {defineStore} from "pinia";
import { ref } from 'vue';

export const usePageStore = defineStore("pagePanel", () => {
    const activePage = ref('scene-viewer-3d');

    function togglePage(pageName) {
        activePage.value = activePage.value === pageName ? 'scene-viewer-3d' : pageName;
    }

    return {
        activePage,
        togglePage,
    }
})