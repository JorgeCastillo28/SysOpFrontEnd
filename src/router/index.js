import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/store/store'
import HelloWorld from '../components/HelloWorld'
import NotFoundComponent from '../views/errors/NotFoundComponent'
import LoginComponent from '../views/LoginComponent'
import PostsComponent from '../views/PostsComponent'
import UsersComponent from '../views/UsersComponent'
import UserSaveComponent from '../views/UserSaveComponent'
import PostSaveComponent from '../views/PostSaveComponent'
import PostShowComponent from '../views/PostShowComponent'

// Definir objeto rutas -- configuración
const routes = [
    { path: '/login', name: "Login", component: LoginComponent, meta: { requiresAuth: false } },
    { path: '/hello-world', name: "HelloWorld", component: HelloWorld, meta: { requiresAuth: false } },
    // Rutas del Administrador
    { path: '/users', name: "Users", component: UsersComponent, meta: { requiresAuth: true, hasRole: ['admin'] } },
    { path: '/user/new', name: "UserNew", component: UserSaveComponent, meta: { requiresAuth: true, hasRole: ['admin'], title: "Nuevo Usuario" } },
    { path: '/user/edit/:id', name: "UserEdit", component: UserSaveComponent, meta: { requiresAuth: true, hasRole: ['admin'], title: "Editar Usuario" } },
    // Rutas del Administrador y Empleado
    { path: '/posts', name: "Posts", component: PostsComponent, meta: { requiresAuth: true, hasRole: ['admin', 'employee'], } },
    { path: '/post/new', name: "PostNew", component: PostSaveComponent, meta: { requiresAuth: true, hasRole: ['admin', 'employee'], title: "Nuevo Post" } },
    { path: '/post/edit/:id', name: "PostEdit", component: PostSaveComponent, meta: { requiresAuth: true, hasRole: ['admin', 'employee'], title: "Editar Post" } },
    { path: '/post/show/:id', name: "PostShow", component: PostShowComponent, meta: { requiresAuth: true, hasRole: ['admin', 'employee'], title: "Detalle del Post" } },
    // Catch All 404
    { path: '/:catchAll(.*)', name: "NotFound", component: NotFoundComponent },
    { path: '/404', component: NotFoundComponent }
];

// Crear objeto rutas de vue router -- objeto de Vue Router
const router = createRouter({
    history: createWebHashHistory(),
    routes
})

// Validaciones para cada ruta
router.beforeEach((to, from, next) => {
    if (to.path == "/") {
        if (!store.state.auth.user_id) {
            next({ name: "Login" });
        } else {
            next({ name: "Posts" });
        }
    } else if (to.matched.some(route => route.meta.requiresAuth)) { // Si es una ruta donde la autenticación es requerida
        if (!store.state.auth.user_id) { // Si el usuario no está autenticado mandar a la pantalla de Login
            next({ name: "Login" });
        } else {
            if (!store.state.auth.roles.some(role => to.meta.hasRole.includes(role.name))) { // Si el usuario no tiene un rol de los que están permitidos en la ruta, mostrar la pantalla de error 404
                next('/404');
            } else { // De lo contrario mostrar la pantalla con la ruta correspondiente
                next();
            }
        }
    } else {
        next();
    }
});

export default router