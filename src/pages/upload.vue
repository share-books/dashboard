<template>
	<div id="UploadBox">
		<h2>Video Uploader</h2>

		<span id='UploadArea'>
				<label for="FileBox">Choose A File: </label><input type="file" id="FileBox" @change="FileChosen"><br>
				<label for="NameBox">Name: </label><input type="text" id="NameBox" ><br>
				<button	type='button' id='UploadButton' class='Button' @click="StartUpload">Upload</button>
			</span>
	</div>

</template>
<script>
	export default {
		created(){
		//document.getElementById('UploadButton').addEventListener('click', this.StartUpload);  
		//document.getElementById('FileBox').addEventListener('change', this.FileChosen);
			
		},

		data() {
			return {
				SelectedFile: '',
				FReader: null,
				Name: ''
			}
		},
		sockets: {
			connect: function () {
				console.log('socket connected')
			},
			MoreData(data) {
				this.UpdateBar(data['Percent'])
				let Place = data['Place'] * 524288 //The Next Blocks Starting Position
				let NewFile = this.SelectedFile.slice(Place, Place + Math.min(524288, (this.SelectedFile.size - Place)))
				this.FReader.readAsBinaryString(NewFile)
			},
			Done(data) {
				/*	let Content = "Video Successfully Uploaded !!"
					//	Content += "<img id='Thumb' src='" + Path + data['Image'] + "' alt='" + Name + "'><br>";
					Content += "<button	type='button' name='Upload' value='' id='Restart' class='Button'>Upload Another</button>";
					document.getElementById('UploadArea').innerHTML = Content;
					document.getElementById('Restart').addEventListener('click', this.Refresh);
					document.getElementById('UploadBox').style.width = '270px';
					document.getElementById('UploadBox').style.height = '270px';
					document.getElementById('UploadBox').style.textAlign = 'center';
					document.getElementById('Restart').style.left = '20px';*/
				this.$message({
					message: '提交成功',
					type: 'success'
				})
			}
		},
		methods: {
			FileChosen(evnt) {
				this.SelectedFile = document.getElementById('FileBox').files[0]//evnt.target.files[0]
				//console.log(this.SelectedFile)
				document.getElementById('NameBox').value = this.SelectedFile.name
		
			},
			Refresh() {
				location.reload(true)
			},
			UpdateBar(percent) {
				document.getElementById('ProgressBar').style.width = percent + '%';
				document.getElementById('percent').innerHTML = (Math.round(percent * 100) / 100) + '%';
				let MBDone = Math.round(((percent / 100.0) * this.SelectedFile.size) / 1048576);
				document.getElementById('MB').innerHTML = MBDone;
			},
			StartUpload() {
				if (document.getElementById('FileBox').value != "") {
					this.FReader = new FileReader()
					this.Name = document.getElementById('NameBox').value
					let Content = "<span id='NameArea'>Uploading " + this.SelectedFile.name + " as " + this.Name + "</span>"
					Content += '<div id="ProgressContainer"><div id="ProgressBar"></div></div><span id="percent">50%</span>'
					Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(this.SelectedFile.size / 1048576) + "MB</span>"
					document.getElementById('UploadArea').innerHTML = Content
					let self=this
					this.FReader.onload = function (evnt) {//
						self.$socket.emit('Upload', { Name: self.Name, Data: evnt.target.result })
					}
					this.$socket.emit('Start', { Name: this.Name, Size: this.SelectedFile.size })
				}
				else {
					alert("Please Select A File")
				}
			}
		}
	}

</script>

<style lang="css" scoped>
	h2 {
		font-size: 40px;
		margin-top: 6px;
		margin-bottom: 10px;
	}
	
	#Thumb {
		max-width: 230px;
		max-height: 130px;
	}
	
	#ProgressContainer {
		width: 396px;
		height: 36px;
		background: #F8F8F8;
		margin-top: 14px;
		border: 1px solid #E8E8E8;
		border-top: 1px solid #D8D8D8;
		-webkit-border-radius: 4px;
		-moz-border-radius: 4px;
		border-radius: 4px;
		padding: 2px;
	}
	
	#ProgressBar {
		height: 100%;
		width: 0%;
		-webkit-border-radius: 4px;
		-moz-border-radius: 4px;
		border-radius: 4px;
		background: -webkit-gradient( linear, left top, left bottom, from(#a50aad), color-stop(0.50, #6b0d6b), to(#4a074a));
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
	
	button.Button {
		font-size: 18px;
		color: #ffffff;
		padding: 8px 30px;
		background: -webkit-gradient( linear, left top, left bottom, from(#a50aad), color-stop(0.50, #6b0d6b), to(#4a074a));
		-webkit-border-radius: 5px;
		-moz-border-radius: 5px;
		border-radius: 5px;
		border: 1px solid #5b139e;
		-webkit-box-shadow: 0px 1px 3px rgba(000, 000, 000, 0.5), inset 0px 0px 3px rgba(255, 255, 255, 0.4);
		-moz-box-shadow: 0px 1px 3px rgba(000, 000, 000, 0.5), inset 0px 0px 3px rgba(255, 255, 255, 0.4);
		box-shadow: 0px 1px 3px rgba(000, 000, 000, 0.5), inset 0px 0px 3px rgba(255, 255, 255, 0.4);
		text-shadow: 0px -1px 0px rgba(000, 000, 000, 0.1), 0px 1px 0px rgba(145, 035, 145, 1);
		position: absolute;
		bottom: 20px;
		right: 20px;
		cursor: pointer;
	}
	
	button.Button:hover {
		background: -webkit-gradient( linear, left top, left bottom, from(#a50aad), color-stop(0.80, #6b0d6b), to(#a50aad));
		color: #D3D3D3;
	}
	
	button.Button:active {
		background: -webkit-gradient( linear, left top, left bottom, from(#4a074a), color-stop(0.80, #6b0d6b), to(#a50aad));
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