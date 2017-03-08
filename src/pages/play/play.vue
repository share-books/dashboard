<template>
  <div style="text-align:center;">
    <el-button type="primary" @click.native="makeBig">大</el-button>
   <el-button type="primary" @click.native="makeNormal">中</el-button>
    <el-button type="primary" @click.native="makeSmall">小</el-button>
    <br />
    <video :width="width" style="margin-top:15px;" controls>
      <source src="/static/demo.mp4" type="video/mp4" /> Your browser does not support HTML5 video.
    </video>
  </div>
</template>
<script>
  export default {
    data() {
      return { width: 420 }
    },
    methods: {
      makeBig() {
      //  console.log("makeBig")
        this.width = 560
      },
      makeSmall() {
        // console.log("makeSmall")
        this.width = 320
      },
      makeNormal() {
        // console.log("makeNormal")
        this.width = 420
      }
    }
  }

</script>

<style lang="scss" scoped>
  #login-page {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #efeeee;
    .login-form {
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 500px;
      height: 400px;
      border-radius: 10px;
      background: white;
      border: 1px #eaeaea solid;
      box-shadow: 0px 0px 25px #cac6c6;
      .title {
        color: #20a0ff;
        font-weight: bold;
        font-size: 40px;
        text-align: center;
        line-height: 2.2;
        font-family: sans-serif;
      }
      .input-group {
        margin-top: 30px;
        width: 80%;
        button {
          width: 100%;
        }
      }
    }
  }
</style>