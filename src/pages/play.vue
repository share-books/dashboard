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
