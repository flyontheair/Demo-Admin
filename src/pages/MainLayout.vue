<template>
    <div class="" id="menu">
        <header class="">
            <el-menu theme="dark" default-active="menuOne" class="el-menu-demo" mode="horizontal" >
                <el-menu-item index="menuOne">
                    <router-link to="/menuOne">menuOne</router-link>
                </el-menu-item>
                <el-menu-item index="menuTwo">
                    <router-link to="/menuTwo">menuTwo</router-link>
                </el-menu-item>
            </el-menu>
        </header>
        <div class="">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'menu',
        data: function () {
            return {
                routePath: ''
            }
        },
        watch: {
            '$route':'getPath'
        },
        mounted: function () {
            this.getPath();
        },
        methods: {
            getPath(){
                let path = this.$route.path;
                if (path.indexOf('/menu1') !== -1) {
                    this.routePath = 'menu1';
                } else if (path.indexOf('/menu2') !== -1) {
                    this.routePath = 'menu2';
                }
            }
        }
    }
</script>