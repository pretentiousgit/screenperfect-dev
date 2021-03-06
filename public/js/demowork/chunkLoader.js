window.addEventListener("load", Ready); 
			
			function Ready(){ 
				if(window.File && window.FileReader){ //These are the necessary HTML5 objects the we are going to use 
					document.getElementById('UploadButton').addEventListener('click', StartUpload);  
					document.getElementById('FileBox').addEventListener('change', FileChosen);
				}
				else
				{
					document.getElementById('UploadArea').innerHTML = "Your Browser Doesn't Support The File API Please Update Your Browser";
				}
			}
			var SelectedFile;

			function FileChosen(evnt) {
		        SelectedFile = evnt.target.files[0];
				document.getElementById('NameBox').value = SelectedFile.name;
		    }
		
			var FReader;
			var Name;
	
			function StartUpload(){
				if(document.getElementById('FileBox').value != "")
				{
					FReader = new FileReader();
					Name = document.getElementById('NameBox').value;
					var Content = "<span id='NameArea'>Uploading " + SelectedFile.name + " as " + Name + "</span>";
					Content += '<div id="ProgressContainer"><div id="ProgressBar"></div></div><span id="percent">50%</span>';
					Content += "<span id='Uploaded'> - <span id='MB'>0</span>/" + Math.round(SelectedFile.size / 1048576) + "MB</span>";
					document.getElementById('UploadArea').innerHTML = Content;
					FReader.onload = function(evnt){
						socket.emit('Upload', { 'Name' : Name, Data : evnt.target.result });
					}
					socket.emit('Start', { 'Name' : Name, 'Size' : SelectedFile.size });
				}
				else
				{
					alert("Please Select A File");
				}
			}
			
			socket.on('MoreData', function (data){
				UpdateBar(data['Percent']);
				var Place = data['Place'] * 524288; //The Next Blocks Starting Position
				var NewFile; //The Variable that will hold the new Block of Data
				if(SelectedFile.webkitSlice) 
					NewFile = SelectedFile.webkitSlice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
				else
					NewFile = SelectedFile.mozSlice(Place, Place + Math.min(524288, (SelectedFile.size-Place)));
				FReader.readAsBinaryString(NewFile);
			});

			function UpdateBar(percent){
				document.getElementById('ProgressBar').style.width = percent + '%';
				document.getElementById('percent').innerHTML = (Math.round(percent*100)/100) + '%';
				var MBDone = Math.round(((percent/100.0) * SelectedFile.size) / 1048576);
				document.getElementById('MB').innerHTML = MBDone;
			}
			
			var Path = "http://localhost/";
			
			socket.on('Done', function (data){
				var Content = "Video Successfully Uploaded !!"
				Content += "<img id='Thumb' src='" + Path + data['Image'] + "' alt='" + Name + "'><br>";
				Content += "<button	type='button' name='Upload' value='' id='Restart' class='Button'>Upload Another</button>";
				document.getElementById('UploadArea').innerHTML = Content;
				document.getElementById('Restart').addEventListener('click', Refresh);
				document.getElementById('UploadBox').style.width = '270px';
				document.getElementById('UploadBox').style.height = '270px';
				document.getElementById('UploadBox').style.textAlign = 'center';
				document.getElementById('Restart').style.left = '20px';
			});
			function Refresh(){
				location.reload(true);
}