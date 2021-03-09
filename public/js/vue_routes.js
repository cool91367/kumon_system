Vue.component('report_system', 'url:./vue/components/report_system.vue');
Vue.component('student_state_system', 'url:./vue/components/student_state_system.vue');
Vue.component('class_system', 'url:./vue/components/class_system.vue')
const routes = [
    {path: '/', component: { template: '<report_system></report_system>' } },
    {path: '/report_system', component: { template: '<report_system></report_system>' } },
    {path: '/student_state_system', component: {template: '<student_state_system></student_state_system>'} },
    {path: '/class_system', component: {template: '<class_system></class_system>'}}
]

const router = new VueRouter({
    routes // (缩写) 相当于 routes: routes
});