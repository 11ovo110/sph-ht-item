<template>
  <div class="login-container">
    <!-- 
       el-form:表单组件
           属性:ref获取表单组件实例
           model:告诉表单组件,数据收集到那个对象(代理对象)的身上
           rule:表单校验规则
       el-form-item:表单项一起使用
      -->
    <el-form
      ref="formRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      auto-complete="on"
      label-position="left"
    >
      <!-- 登录标题 -->
      <div class="title-container">
        <h3 class="title">尚品汇后台管理</h3>
      </div>
      <el-form-item prop="username">
        <!-- 小图标全局组件 -->
        <span class="svg-container">
          <svg-icon name="ele-UserFilled" />
        </span>
        <el-input
          ref="username"
          v-model="loginForm.username"
          placeholder="请你输入账号"
        />
      </el-form-item>
      <el-form-item prop="password">
        <!-- 前面锁头小图标 -->
        <span class="svg-container">
          <svg-icon name="ele-Lock" />
        </span>
        <!-- 密码 -->
        <el-input
          :key="passwordType"
          ref="passwordRef"
          v-model="loginForm.password"
          :type="passwordType"
          placeholder="请你输入密码"
          @keyup.enter="handleLogin"
        />
        <!-- 小眼睛 -->
        <span class="show-pwd" @click="showPwd">
          <svg-icon
            :name="passwordType === 'password' ? 'ele-Hide' : 'ele-View'"
          />
        </span>
      </el-form-item>
      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin-bottom: 30px; height: 40px"
        @click.prevent="handleLogin"
        >登 陆</el-button
      >
    </el-form>
  </div>
</template>
<script lang="ts" setup>
//用户登录相关的小仓库
import { useUserInfoStore } from "@/stores/userInfo";
import type { FormInstance } from "element-plus";
import { nextTick, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
//获取用户小仓库
const userInfoStore = useUserInfoStore();
//获取路由对象
const route = useRoute();
//获取路由器对象
const router = useRouter();
//获取el-form组件实例的VC,调用validate方法确保校验通过
const formRef = ref<FormInstance>();
//控制按钮的加载效果:默认没有
const loading = ref(false);
//获取密码的组件实例
const passwordRef = ref<HTMLInputElement>();
//收集登录页面:账号与密码的响应式数据
const loginForm = ref({
  username: "admin",
  password: "111111",
});
//密码的文本框类型:默认密码类型带小点点
const passwordType = ref("password");

//点击密码后面小眼睛:切换密码表单类型,小眼睛来回切换
/* 
切换密码的显示/隐藏
*/
const showPwd = () => {
  //无非passwrodType来回切换
  passwordType.value = passwordType.value === "password" ? "text" : "password";
  //nextTick:当响应式数据发生变化的时候,获取更新后DOM
  nextTick(() => {
    //密码表单元素聚焦
    passwordRef.value?.focus();
  });
};

//存储login登录query参数
const redirect = ref("");

//自定义校验规则:用户名字规则---->只要文本发生变化就会触发次函数
const validateUsername = (rule: any, value: any, callback: any) => {
  //账号长度小于4位
  if (value.length < 4) {
    callback(new Error("用户名长度不能小于4位"));
  } else {
    //账号长度大于四位正常放行
    callback();
  }
};
//自定义校验规则:密码的规则
const validatePassword = (rule: any, value: any, callback: any) => {
  if (value.length < 6) {
    callback(new Error("密码长度不能小于6位"));
  } else {
    callback();
  }
};

//表单元素校验规则
const loginRules = {
  //校验用户名:required,必须校验字段  validator:自定义校验规则
  username: [
    { required: true, validator: validateUsername, trigger: "change" },
  ],
  //校验密码:trigger,触发校验时机
  password: [
    { required: true, trigger: "change", validator: validatePassword },
  ],
};

//监听路由对象(上来立即监听一次)
watch(
  route,
  () => {
    //判断是否有query参数,如果有query参数。把他赋值给rediret这个ref对象
    redirect.value = route.query && (route.query.redirect as string);
  },
  { immediate: true }
);

/* 
点击登陆的回调
*/
const handleLogin = async () => {
  //点击登录按钮,看表单元素每一项目是否校验通过
  await formRef.value?.validate();
  //按钮加载效果开始动
  loading.value = true;
  //登录需要的账号与密码的参数
  const { username, password } = loginForm.value;
  //前台项目:vuex->小仓库(action)
  //后台项目:pinia->获取小仓局,调用它的actions的方法,去发请求
  try {
    //调用用户相关的小仓库login方法->进行登录请求
    await userInfoStore.login(username, password);
    router.push({ path: redirect.value || "/" });
  } finally {
    //登录成功、还是失败,小加载消失
    loading.value = false;
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg: #283443;
$light_gray: #fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}
/* reset element-ui css */
.login-container {
  background-image: url(../../assets/bg.jpg);
  background-color: #2d3a4b;
  background-size: cover;
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    .el-input__wrapper {
      width: 100%;
      background-color: transparent;
      box-shadow: none;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        caret-color: $cursor;

        &:-webkit-autofill {
          box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: $cursor !important;
        }
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg: #2d3a4b;
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $light_gray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}
</style>
