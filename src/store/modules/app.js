// Modulo para el store general del app
export default {
    namespaced: true,
    state() {
        return {
            isLoadingOverlay: false
        }
    },
    getters: {
        isLoadingOverlay(state) {
            return state.isLoadingOverlay;
        }
    },
    mutations: {
        setIsLoadingOverlay(state, value) {
            state.isLoadingOverlay = value;
        }
    },
    actions: {
        setIsLoadingOverlay({ commit }, value) {
            commit("setIsLoadingOverlay", value);
        }
    }
}