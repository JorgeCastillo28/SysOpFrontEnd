
import { createStore } from 'vuex'
import app from './modules/app';
import auth from './modules/auth';

const store = createStore({
    modules: {
        app,
        auth
    }
});

export default store;