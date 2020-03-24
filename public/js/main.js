var filepos = 0;
var sequence,result ;
var user={sid:0,limstart:1,limlength:2};
var elem = 0;
var elmentresult =0;
var myGraph = 0;
window.onload = function() {
    elem = document.getElementById('3d-graph');
	/* UPLOAD */
    var auplink = new Array();
    var uplinkcount = 0;
    var myfiles = new Array();
    resetForms();
    var filesUpload = document.getElementById("filein"),
    dropArea = document.getElementById("drop-area"),
    fileList = document.getElementById("file-list");
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
        }
        else {
            fileList.innerHTML = "No support for the File API in this web browser";
        }	
    }
    filesUpload.addEventListener("click", function (evt) {	
        if (!(document.getElementById("email").value).search("@") || document.getElementById("email").value == "") { 
        alert('Please Enter a valid Group@YourID. include @ sign pls.'); 
        evt.preventDefault();evt.stopPropagation();
    } 
    }, false);
    filesUpload.addEventListener("change", function () {                                                        
                                                        traverseFiles(this.files);	
                                                        }, false);
    dropArea.addEventListener("dragleave", function (evt) {
        var target = evt.target;
        if (target && target === dropArea) {	this.className = "";	}
        evt.preventDefault();evt.stopPropagation();
    }, false);
    dropArea.addEventListener("dragenter", function (evt) {
        this.className = "over"; evt.preventDefault(); evt.stopPropagation();
    }, false);
    dropArea.addEventListener("dragover", function (evt) {
        evt.preventDefault(); evt.stopPropagation(); 
    }, false);
    dropArea.addEventListener("drop", function (evt) {
        if ((document.getElementById("email").value).search("@") || document.getElementById("email").value == "") { 
            alert('Please Enter a valid Group@YourID. include @ sign pls.');
        } else {
            traverseFiles(evt.dataTransfer.files);
        }
        this.className = "";
         evt.preventDefault();	evt.stopPropagation();
    }, false);	
    function resetForms() {
        for (i = 0; i < document.forms.length; i++) {
              document.forms[i].reset();
        }
    };
    resetForms();
    $('#seldatalength').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        user.limlength = parseInt(this.value);
        loadlistres('sav');
    });
    $('#filtercpuskill').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        loadlistres('sav');
    });
    $('#filterplycount').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        loadlistres('sav');
    });
    $('#filtersiege').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        loadlistres('sav');
    });
    $('#orderfield').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        loadlistres('sav');
    });
    $('#orderorder').on('change', function (e) {
        var optionSelected = $("option:selected", this);
        loadlistres('sav');
    });	
    $.ajax({
        url: "/graph/3dforceraw",
        type: "GET",
        data: '',
        success: function(result) {
        var    seqqueryconf =   [{id: "bidx",user: "sequenze",description: "name",brief: "dataset"},
                      {id: "email",nextupl: "email",user: "email",description: "email",brief: "dataset",email: "email"},
                      {id: "sequenze",nextseq: "sequenze",user: "email",description: "kat",brief: "dataset"},
                      {source: "email",target: "sequenze"},
                      {compa: "sequenze",compb: "sequenze",source: "sequenze",target: "bidx"}
        ];
        elmentresult = result;
        var nodeing = {nodes:[],links:[]}; 
        var seqdataset = dforcegraphbuild(result,seqqueryconf,nodeing);
        // var seqdataset = dforcegraphbuildRanking(result,seqqueryconf,nodeing);
        myGraph = ForceGraph3D()(elem)
          .graphData(seqdataset)
          .width(950)
          .height(600)
          .enableNodeDrag(false)
          .nodeAutoColorBy('user')
          .nodeLabel(node => asequencerem(JSON.parse(`${node.brief}`),false,""))
          .onNodeHover(node => elem.style.cursor = node ? 'pointer' : null)
          .onNodeClick(node => window.open('download/sav/'+(JSON.parse(`${node.brief}`)).headid, '_self'))
          .nodeThreeObject(node => {
                // use a sphere as a drag handle
                const obj = new THREE.Mesh(
                  new THREE.SphereGeometry(10),
                  new THREE.MeshBasicMaterial({ depthWrite: false, transparent: true, opacity: 0 })
                );
                if (typeof node.map === "undefined" || node.map == "") {
                // add text sprite as child
                const sprite = new SpriteText(`${node.description}`);
                      sprite.color = node.color;
                      sprite.textHeight = 8;
                      obj.add(sprite);
                } else {
                       // add img sprite as child
                      const imgTexture = new THREE.TextureLoader().load(`/images/mapas/mapnorm/`+`${node.map}`);
                      const material = new THREE.SpriteMaterial({ map: imgTexture });
                      const sprite = new THREE.Sprite(material);
                      sprite.scale.set(12, 12);
                      obj.add(sprite);
                }
                
                return obj;
          });

       }
  });
}