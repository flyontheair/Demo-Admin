<template>
    <div>
        <h2>MenuOne</h2>
        <h3>页面一</h3>

        <el-button class="btn btn-primary" @click="reqOne">请求一</el-button>
        <p>请求结果：</p>
        <div style="border: 1px solid #ddd;padding: 15px;margin: 15px 0;">
            {{msgOne}}
        </div>
        <el-button class="btn btn-primary" @click="reqTwo">请求二</el-button>
        <p>请求结果：</p>
        <div style="border: 1px solid #ddd;padding: 15px;margin: 15px 0;">
            {{msgTwo}}
        </div>
    </div>
</template>

<script>
    import {one as oneApi,two as twoApi} from '../../api/index'

    export default{
        data(){
            return {
                msgOne:'',
                msgTwo:''
            }
        },
        methods: {
            reqOne:function(){
                oneApi.getOne().then((res)=>{
                    this.msgOne=res;
                    console.log(res);
                }).catch((err)=>{
                    this.msgOne=res;
                    console.log(err);
                });
            },
            reqTwo:function(){
                twoApi.getTwo().then((res)=>{
                    this.msgTwo=res;
                console.log(res);
            }).catch((err)=>{
                    this.msgTwo=res;
                console.log(err);
            });
            }
        },
        mounted(){

        },
        components: {

        },
        filters: {
        }
    }
</script>