<template>
	<div id="UploadBox">
		<h2>Video Uploader</h2>

		<span id='UploadArea'>
				<label for="FileBox">Choose A File: </label><input type="file" id="FileBox" @change="FileChosen"><br>
				<el-button type="primary" @click="StartUpload">Upload</el-button>
				<br>
				<label for="NameBox">Name: </label><input type="text" id="NameBox" ><br>
				<el-progress :text-inside="true" :stroke-width="18" :percentage="p"></el-progress>
				
			</span>
	</div>

</template>
<script>
	export default {
		data() {
			return {
				SelectedFile: null,
				FReader: null,
				Name: '',
				p:0
			}
		},
		sockets: {
			connect: function () {
				console.log('socket connected')
			},
			MoreData(data) {
				
				let Place = data['Place'] * 524288 //The Next Blocks Starting Position
				let NewFile = this.SelectedFile.slice(Place, Place + Math.min(524288, (this.SelectedFile.size - Place)))
				this.FReader.readAsBinaryString(NewFile)
				this.p=Math.round(data['Percent'])
			},
			Done(data) {
				this.$message({
					message: '提交成功',
					type: 'success'
				})
				this.$router.replace({ path: 'play', query: { fn: this.Name }})
			}
		},

		methods: {
			FileChosen(evnt) {
				this.SelectedFile =evnt.target.files[0]
				// document.getElementById('FileBox').files[0]//evnt.target.files[0]
				this.Name=this.SelectedFile.name
				console.log(evnt.target.files[0].name)
				document.getElementById('NameBox').value = this.Name
		
			},
			Refresh() {
				location.reload(true)
			},
			StartUpload() {
				if (document.getElementById('FileBox').value != "") {
					this.FReader = new FileReader()
					let self=this
					this.FReader.onload = function (evnt) {//
						self.$socket.emit('Upload', { 'Name': self.Name, 'Data': evnt.target.result })
					}
					this.$socket.emit('Start', { 'Name': this.Name, 'Size': this.SelectedFile.size })
				}
				else {
					alert("Please Select A File")
				}
			}
		}
	}
</script>

<style scoped>
	h2 {
		font-size: 40px;
		margin-top: 6px;
		margin-bottom: 10px;
	}
	
	#Thumb {
		max-width: 230px;
		max-height: 130px;
	}
	
	#UploadBox {
		background: #FFF;
		padding: 20px;
		position: absolute;
		top: 50%;
		left: 50%;
		margin-left: -200px;
		margin-top: -150px;
		height: 200px;
		width: 400px;
		border: 1px solid #DFDFDF;
		-webkit-box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.2);
		-moz-box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.2);
		box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.2);
		-webkit-border-radius: 11px;
		-moz-border-radius: 11px;
		border-radius: 11px;
	}
	
		
	input {
		margin-top: 10px;
		margin-bottom: 8px;
	}
	
	input[type=text] {
		border: 1px solid #CDCDCD;
		border-top: 1px solid #676767;
		-webkit-border-radius: 3px;
		-moz-border-radius: 3px;
		border-radius: 3px;
		font-size: 18px;
		padding: 2px;
		width: 300px;
		margin-left: 10px;
	}
</style>