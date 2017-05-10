<template>
    <section>
        <div class="left-menu">
            <el-menu default-active="1" class="el-menu-vertical-demo">
                <el-menu-item index="1">
                    <router-link to="/menuTwo/three" tag="span">
                        <i class="el-icon-menu"></i>Demo2-菜单一
                    </router-link>
                </el-menu-item>
                <el-menu-item index="2">
                    <router-link to="/menuTwo/four" tag="span">
                        <i class="el-icon-setting"></i>Demo2-菜单二
                    </router-link>
                </el-menu-item>
            </el-menu>
        </div>
        <div class="offset-left-menu layout-content">
            <router-view></router-view>
        </div>
    </section>
</template>