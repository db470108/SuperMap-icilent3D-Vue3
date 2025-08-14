import {defineStore} from "pinia";
import {ref} from "vue";

export const usePanelStore = defineStore("panel", ()=>{
    const activePanel = ref(null);
    const activePage = ref(null);
    function togglePanel(panelName) {
        activePanel.value = activePanel.value === panelName ? null : panelName;
    }

    function togglePage(pageName) {
        activePage.value = activePage.value === pageName ? null : pageName;
    }

    function closePanel() {
        activePanel.value = null;
    }

    return {
        activePanel,
        togglePanel,
        closePanel
    }
})
