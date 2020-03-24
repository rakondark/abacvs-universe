function morefiles(fil,fileout) {

    var file = fil;
    var frr = new FileReader();
    frr.onload = function ()
    {
        filepos = 0;
        var binary = "";
        var base64er = "";
        var bytes = new Uint8Array(frr.result);
        var length = bytes.byteLength;

        for (var i = 0; i < length; i++) {
          binary += String.fromCharCode(bytes[i]);
        }
        var hash = CryptoJS.MD5(CryptoJS.enc.Latin1.parse(binary));
        var mymd5 = hash.toString(CryptoJS.enc.Hex);
        base64er = btoa(binary);
        var sequence = 0;
        var extent = 0;
        var remaster = false;
        if (file.name.substr(file.name.length - 4) === '.sec') {
            extent ="sec";
            remaster = false;
        }
        if (file.name.substr(file.name.length - 4) === '.sav') {
            remaster = true;
            extent ="sav";
        }
        
        if (extent !== 0) {
            sequence = getDataFromSeqrem(binary,remaster);
            sequence["ext"] = extent; 
            sequence["md5"] = mymd5;
            sequence["filesize"] = file.size;
            sequence['filename'] = file.name;
            sequence['email'] = document.getElementById("email").value;
            var fileDisplayArea = fileout;
            
            var div = document.createElement("div");
            var seqout = document.createElement("div");
            seqout.id='seq'+mymd5+'sec';
            seqout.innerHTML=asequencerem(sequence,false);
            div.appendChild(seqout);
            var seqout2 = document.createElement("div");
            seqout2.id='seq'+mymd5+'comp';
            seqout2.innerHTML='<p>...</p>';
            div.appendChild(seqout2);
			fileDisplayArea.appendChild(div);
 
            $.ajax({
                url: "/upload/md5",
                type: "POST",
                data: { md5: sequence["md5"], ext: sequence["ext"]
                    },
                success: function(result) {
                    if (result.status == "new"){ 
                        progressBarContainer = document.createElement("div"),
                        progressBar = document.createElement("progress"),
                        progressResult = document.createElement("div");
                        progressResult.className += " darkschrift ";
                        progressBar.value = 1;
                        progressBar.max = 100;
                        div.className = "";
                        progressBarContainer.className = "progress-bar-container";
                        progressBar.className = "progress-bar";
                        progressBarContainer.appendChild(progressBar);
                        progressBarContainer.appendChild(progressResult);
                        div.appendChild(progressBarContainer);                 
                        $.ajax({
                        xhr: function() {
                        var xhr = new window.XMLHttpRequest();

                        xhr.upload.addEventListener("progress", function(evt) {
                        if (evt.lengthComputable) {
                            var p = Math.round(100 / evt.total * evt.loaded);
                            progressBar.value = p;
                        }
                        }, false);
                        xhr.upload.addEventListener("load", function () {
                            progressBarContainer.className += " uploaded ";
                        }, false);
                        return xhr;
                        },
                        url: "/upload",
                        type: "POST",
                        data: { myfile: base64er,
                                myemail:'localhost',
                                myfiledata: JSON.stringify(sequence) 
                            },
                        success: function(results) {
                            var secdata = "#seq"+results.md5+"comp";
                            $(secdata).html("<p>"+results.status+"</p>");                   
                        }
                        });
                    } else {
                            var secdata = "#seq"+result.md5+"comp";
                            $(secdata).html("<p>"+result.status+"</p>"); 
                    }
                }
                
            });
        
        };

        
    };
    frr.readAsArrayBuffer(file);
}