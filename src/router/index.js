import {createRouter, createWebHistory} from "vue-router";
import HelloWorld from "@/components/Title.vue";
import TimelineGraph from "@/components/graphs/TimelineGraph.vue";

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/welcome',
            name: 'welcome',
            component: HelloWorld
        },
        {
            path: '/',
            name: 'home',
            component: TimelineGraph,
        }
    ]
});

export default router