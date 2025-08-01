import {defineStore} from "pinia";
import {ref} from "vue";

export const usePanelStore = defineStore("panel", ()=>{
    const activePanel = ref(null);

    function openPanel(panelName) {
        activePanel.value = panelName;
    }

    function togglePanel(panelName) {
        activePanel.value = activePanel.value === panelName ? null : panelName;
    }

    function closePanel() {
        activePanel.value = null;
    }

    return {
        activePanel,
        openPanel,
        togglePanel,
        closePanel
    }
})
