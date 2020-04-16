

    function clearmenu(evt) {
                  $(".tablink").removeClass("w3-red");
                  evt.currentTarget.className += " w3-red";
    }
    
    function loadlist(evt) {
      loadlistres();
    }
    
    function loadlistres() {
                  $(".tablink").removeClass("w3-red");
                  $("#loadbutton").addClass("w3-red");
            var dataContainer = $('#seqdata');

            $('#seqlist').pagination({
                  dataSource: '/list/'+$('#gamerelease').val(),
                  locator: 'list',
                  totalNumberLocator: function(response) {
                        // you can return totalNumber by analyzing response content
                        return response.count;
                  },
                  formatNavigator: '<span style="color: #f00"><%= currentPage %></span> / <%= totalPage %> pages (found <%= totalNumber %> sequences) ',
                  alias: {
                        pageNumber: 'limstart',
                        pageSize: 'limlength'
                  },
                  pageSize: user.limlength,
                  showNavigator: true,
                  ajax: {
                        method:"POST",
                        beforeSend: function() {
                              dataContainer.html('Loading data from ...');
                        },
                        data: {     "filterplayername": $('#filterplayername').val(),
                                    "filteridx": $('#filteridx').val(),
                                    "filtercpuskill":$('#filtercpuskill').val(),
                                    "filtergroup":$('#filtergroup').val(),
                                    "filteryourid":$('#filteryourid').val(),
                                    "filteremail":$('#filteremail').val(),
                                    "filterplayerwin":$('#filterplayerwin').children("option:selected").val(),
                                    "filterplayerrace":$('#filterplayerrace').val(),
                                    "filterplayersaved":$('#filterplayersaved').children("option:selected").val(),
                                    "filterplycount":$('#filterplycount').children("option:selected").val(),
                                    "filterkategori":$('#filterkategori').val(),
                                    "filtersiege":$('#filtersiege').children("option:selected").val(),
                                    "orderfield":$('#orderfield').children("option:selected").val(),
                                    "orderorder":$('#orderorder').children("option:selected").val()
            
                              }
                        
                  },
                  callback: function(data, pagination) {
                        // template method of yourself
                        // var html = template(data);
                        // dataContainer.html(html);
                        dataContainer.html('');
                        // var seqdata = [];
                        // seqdata.push([JSON.parse(data[i].dataset)]);

                        for (var i=0;i < data.length;++i ) {

                              var html = asequenceraw(data[i],false,"widget");
                              dataContainer.append(html);
                        }
                        /*
                        data.sort(function(a, b) {
                              return a.email.localeCompare(b.email);
                        });
                        */
                        var    seqqueryconf =   [
                        {id: "email",nextupl: "email",user: "email",description: "email",brief: "dataset",email: "email"},
                        {id: "uid",nextseq: "uid",user: "email",description: "kategori",brief: "dataset",map:"karteen"},
                        {source: "email",target: "uid",id: "uid",nextseq: "uid",user: "uid"}
                       
                        ];
                        var nodeing = {nodes:[],links:[]}; 
                        var seqdataset = dforcegraphbuildList(data,seqqueryconf,nodeing,true);
                        /*
                        seqdataset={ // testcase 
                              nodes: [...nodes, ...nodes],
                              links: [...links, ...links]
                        };
                        */
                        // myGraph.dagMode('td');
                        myGraph.graphData(seqdataset);                          
                  }
            })
    }
    function otherview(evt) {
      clearmenu(evt);
                    var    seqqueryconf =[{id: "bidx",user: "sequenze",description: "name",brief: "dataset"},
                                          {id: "email",nextupl: "email",user: "email",description: "email",brief: "dataset",email: "email"},
                                          {id: "sequenze",nextseq: "sequenze",user: "sequenze",description: "kat",brief: "dataset"},
                                          {source: "email",target: "sequenze"},
                                          {compa: "sequenze",compb: "sequenze",source: "sequenze",target: "bidx"}
                        ];
                        
                        var nodeing = {nodes:[],links:[]};
                        var seqdataset = dforcegraphbuild(elmentresult,seqqueryconf,nodeing);
                        /*
                        seqdataset={ // testcase 
                            nodes: [...nodes, ...nodes],
                            links: [...links, ...links]
                        };
                        */
                        myGraph.dagMode('td').dagLevelDistance(100);
                        myGraph.graphData(seqdataset);           
            }
      function otherviewmapdata(evt,deta) {
            clearmenu(evt);
            $.ajax({
            url: "/graph/3dforcenoply",
            type: "GET",
            data: '',
            success: function(resultdata) {
                  var    seqqueryconf =[{id: "email",user: "email",description: "email",brief: "false",map:"",nextupl: "email"},
                                    {id: "idx",user: "idx",description: "karte",brief: "dataset",map: "karteen"},
                                    {user: "uid"}
                  ];
                  
                  var nodeing = {nodes:[],links:[]};
                  var seqdataset = dforcegraphbuildmapdetail(resultdata,seqqueryconf,nodeing,deta);





                  /*
                  seqdataset={ // testcase 
                        nodes: [...nodes, ...nodes],
                        links: [...links, ...links]
                  };
                  */
                  
                   myGraph.graphData(seqdataset);  
                  }
            });         
      }
      function othertop5view(evt) {
            clearmenu(evt);
            var ergs = [['','kills'],['','trains'],['','times'],['','vills'],['','points'],['','losts'],['','skill'],
                  ['sum','kills'],['sum','trains'],['sum','times'],['sum','vills'],['sum','points'],['sum','losts'],['sum','skill'],['sum','wins'],['sum','saved'],
            ['avg','kills'],['avg','trains'],['avg','times'],['avg','vills'],['avg','points'],['avg','losts'],['avg','skill'],
            ['max','kills'],['max','trains'],['max','times'],['max','vills'],['max','points'],['max','losts'],['max','skill']
                        ];
                        

            myGraph.graphData({
                  nodes: [],
                  links: []
                }); 
            var ie=0;
            var nodeing = {nodes:[],links:[]};
            var datarec = {"id":"max",
            "user":"max",
            "description":"TOP 5 PLAYER",
            "brief":'false',
            "map":''
            };
            nodeing.nodes.push(datarec);
            myGraph.graphData(nodeing).nodeThreeObjectExtend(false); 
            function top5list() {
                        
                        if(ie < ergs.length) {
                              var myagregat = ergs[ie][0];
                              var mfield = "seqb."+ergs[ie][1];
                              var mfieldas = myagregat+ergs[ie][1];
                              $.ajax({
                              url: "/bestof/"+$('#gamerelease').val(),
                              type: "POST",
                              data: {'myagregat':myagregat,'myfield':mfield,'myfieldas':mfieldas,
                              "filterplayername": $('#filterplayername').val(),
                              "filteridx": $('#filteridx').val(),
                              "filtercpuskill":$('#filtercpuskill').val(),
                              "filtergroup":$('#filtergroup').val(),
                              "filteryourid":$('#filteryourid').val(),
                              "filteremail":$('#filteremail').val(),
                              "filterplayerwin":$('#filterplayerwin').children("option:selected").val(),
                              "filterplayerrace":$('#filterplayerrace').val(),
                              "filterplayersaved":$('#filterplayersaved').children("option:selected").val(),
                              "filterplycount":$('#filterplycount').children("option:selected").val(),
                              "filterkategori":$('#filterkategori').val(),
                              "filtersiege":$('#filtersiege').children("option:selected").val(),
                              "orderfield":$('#orderfield').children("option:selected").val(),
                              "orderorder":$('#orderorder').children("option:selected").val()
                        },
                              success: function(resultdata) {
                                    nodeing = dforcegraphbuildHigh(resultdata,nodeing,false);
                                    /*
                                    myGraph.graphData({
                                          nodes: [...nodes, ...seqdataset.nodes],
                                          links: [...links, ...seqdataset.links]
                                    }); */
                                    myGraph.graphData(nodeing).nodeThreeObjectExtend(false);  
                                    setTimeout(top5list,Math.floor(Math.random() * 200) + 1000 );
                                    }
                                    
                              });
                              ++ie;
                        } 
            };
            setTimeout(top5list,1000);   
      }
        function otherview2(evt) {
            clearmenu(evt);
              var nodeing = {nodes:[],links:[]}; 
              var seqdatasets = dforcegraphbuildRanking(nodeing,[],nodeing);
              myGraph.dagMode('td');
              myGraph.graphData({
                  nodes: [],
                  links: []
                });  
              let nodesl = seqdatasets.nodes.length-1;
              let linksl = seqdatasets.links.length-1;
              var handle = setInterval(() => {
                  const { nodes, links } = myGraph.graphData();

                  var aktnode = seqdatasets.nodes[nodesl];
                  if (nodesl < 15 && nodesl >= 0) {
                        var aktlink = seqdatasets.links[linksl];
                        var aktlink2 = seqdatasets.links[linksl-1];
                        myGraph.graphData({
                        nodes: [...nodes, aktnode],
                        links: [...links, { source: aktlink2.source, target: aktlink2.target },{ source: aktlink.source, target: aktlink.target } ]
                        }).nodeThreeObjectExtend(false);
                        linksl = linksl -2;
                  } else {
                        myGraph.graphData({
                              nodes: [...nodes, aktnode],
                              links: []
                            }).nodeThreeObjectExtend(false);     
                  }
                  nodesl = nodesl -1;
                  
                  if ( nodesl < 0 ) {
                        clearInterval(handle);
                  }
                }, 500);


              /*
              seqdataset={ // testcase 
                  nodes: [...nodes, ...nodes],
                  links: [...links, ...links]
              };
              */
             // myGraph.dagMode('td');
             // myGraph.graphData(seqdataset);           
        }
function searchnamelist(playername) {
      $.ajax({
            url: "/searchplayer/"+$('#gamerelease').val(),
            type: "POST",
            data: {'playername':playername},
            success: function(resultdata) {
                  var html = "";
                  // html = "<div id=\"myresult\" style=\"width:200px; height:100px; overflow:auto\">";
                  if (resultdata.result) {
                        
                        // $myres .=var_dump($namearray);
                        for(var i=0 ;i < resultdata.result.length; ++i) {
                              html += "<a href=\"javascript:void(0)\" onclick=\"document.getElementById('filterplayername').value='"+resultdata.result[i]['name']+"';\">"+resultdata.result[i]['name']+"</a><br>";
                        }
                       
                  }
                  // html += "</div>";
                  console.log(html);
                  $('#nameauto').html(html) ;
            }
      });  
 

}