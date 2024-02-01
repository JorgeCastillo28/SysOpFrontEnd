// Modulo para el store de autenticación
export default {
    namespaced: true,
    state() {
        return {
            user_id: null,
            username: null,
            name: null,
            email: null,
            roles: []
        };
    },
    getters: {
        currentUser(state) {
            return state;
        }
    },
    mutations: {
        setCurrentUser(state, values) {
            state.user_id = values.id;
            state.username = values.username;
            state.name = values.name;
            state.email = values.email;
            state.roles = values.roles;
        }
    },
    actions: {
        setCurrentUser({ commit }, values) {
            commit("setCurrentUser", values);
        }
    }
}