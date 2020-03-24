function traverseFiles (files) {
    if (typeof files !== "undefined") {
        auplink = new Array();
        uplinkcount = 0;
        for (var i=0, l=files.length; i<l; i++) {
            auplink[i] = document.createElement("div");
            auplink[i].className = "secupbox  aupsec";
            fileList.appendChild(auplink[i]);
            fileList.insertBefore(auplink[i], fileList.firstChild);
            morefiles(files[i],auplink[i]);
            
        }
        //senduploads(0);
    }
    else {
        fileList.innerHTML = "No support for the File API in this web browser";
    }	
}
