<template>
  <div style="text-align:center;">
    <el-button type="primary" @click.native="makeBig">大</el-button>
    <el-button type="primary" @click.native="makeNormal">中</el-button>
    <el-button type="primary" @click.native="makeSmall">小</el-button>
    <br />
    <video :width="width" style="margin-top:15px;" controls>
      <source :src="playUrl" type="video/mp4" /> Your browser does not support HTML5 video.
    </video>
  </div>
</template>
<script>
  import {Option} from '../resources/option'

  export default {
    data() {
      let playUrl = Option.WebServer + "/play"
      console.log(playUrl)
      return { width: 800, playUrl }
    },
    methods: {
      makeBig() {
        this.width = 960
      },
      makeSmall() {
        // console.log("makeSmall")
        this.width = 400
      },
      makeNormal() {
        // console.log("makeNormal")
        this.width = 600
      }
    }
  }

</script>