function dforcegraphbuild(seqquerydata,seqqueryconf,nodeing) {

var datarec = {"id":"root",
"user":"",
"description":"GROUPS",
"brief":'false',
"map":''
};
if ($.inArray("root",nodeing.nodes) == -1) {
nodeing.nodes.push(datarec);
}
var nextseq = 0;
for (var i3=0; i3 < seqquerydata.length ; ++i3) {
   if ($.inArray("p"+seqquerydata[i3][seqqueryconf[0].id],nodeing.nodes) == -1) {
        var datarec = {"id":"p"+seqquerydata[i3][seqqueryconf[0].id],
            "user":seqquerydata[i3][seqqueryconf[0].user],
            "description":seqquerydata[i3][seqqueryconf[0].description],
            "brief":seqquerydata[i3][seqqueryconf[1].brief],
            "map":''
        };
        nodeing.nodes.push(datarec);
    }
}
    var nextupl = 0;
for (var i3=0; i3 < seqquerydata.length ; ++i3) {
    if ($.inArray(seqquerydata[i3][seqqueryconf[1].id],nodeing.nodes) == -1) {
        if ( seqquerydata[i3][seqqueryconf[1].nextupl] !== nextupl ) {
            var datarec = {"id":seqquerydata[i3][seqqueryconf[1].id],
            "user":seqquerydata[i3][seqqueryconf[1].user],
            "description":seqquerydata[i3][seqqueryconf[1].description],
            "brief":'false',
            "map":''
            };
            nextupl = seqquerydata[i3][seqqueryconf[1].nextupl];
            nodeing.nodes.push(datarec);  
            var datarec = {"source":seqquerydata[i3][seqqueryconf[1].id],"target":"root"};
            nodeing.links.push(datarec);   
        }
    }
}


for (var iii=0; iii < seqquerydata.length ; ++iii) {
    if ($.inArray("s"+seqquerydata[iii][seqqueryconf[2].id],nodeing.nodes) == -1) {
        if ( seqquerydata[iii][seqqueryconf[2].nextseq] !== nextseq ) {
            var datarec = {"id":"s"+seqquerydata[iii][seqqueryconf[2].id],
                "user":seqquerydata[iii][seqqueryconf[2].user],
                "description":seqquerydata[iii][seqqueryconf[2].description],
                "brief":seqquerydata[iii][seqqueryconf[2].brief],
                "map":seqquerydata[iii]["karteen"]
            };
            // console.log(seqquerydata[iii]);
            nodeing.nodes.push(datarec);   
            var datarec = {"source":seqquerydata[iii][seqqueryconf[3].source],"target":"s"+seqquerydata[iii][seqqueryconf[3].target]};
            nodeing.links.push(datarec);
            nextseq = seqquerydata[iii][seqqueryconf[2].nextseq];
            for (var ii=0; ii < seqquerydata.length ; ++ii) {
                if (seqquerydata[iii][seqqueryconf[4].compa] == seqquerydata[ii][seqqueryconf[4].compb]) {
                var datarec = {"source":"s"+seqquerydata[iii][seqqueryconf[4].source],"target":"p"+seqquerydata[ii][seqqueryconf[4].target]};
                    nodeing.links.push(datarec);
                }
            }
        }
    }
} 
    return nodeing;
} 
function dforcegraphbuildList(seqquerydata,seqqueryconf,nodeing,detail) {

    var datarec = {"id":"root",
    "user":"",
    "description":"GROUPS",
    "brief":'false',
    "map":''
    };
    if ($.inArray("root",nodeing.nodes) == -1) {
    nodeing.nodes.push(datarec);
    }
    var nextseq = 0;
    var nextupl = 0;

    seqquerydata.sort(function(a, b) {
        return a.email.localeCompare(b.email);
    });

    for (var i3=0; i3 < seqquerydata.length ; ++i3) {
        if ($.inArray(seqquerydata[i3][seqqueryconf[0].id],nodeing.nodes) == -1) {
            if ( seqquerydata[i3][seqqueryconf[0].nextupl] !== nextupl ) {
                var datarec = {"id":seqquerydata[i3][seqqueryconf[0].id],
                "user":seqquerydata[i3][seqqueryconf[0].user],
                "description":seqquerydata[i3][seqqueryconf[0].description],
                "brief":'false',
                "map":''
                };
                nextupl = seqquerydata[i3][seqqueryconf[0].nextupl];
                nodeing.nodes.push(datarec);  
                var datarec = {"source":seqquerydata[i3][seqqueryconf[0].id],"target":"root"};
                nodeing.links.push(datarec);   
            }
        }
    }
    /*
    seqquerydata.sort(function(a, b) {
        return a[seqqueryconf[1].nextseq].localeCompare(b.[seqqueryconf[1].nextseq]);
    });
    */
    for (var iii=0; iii < seqquerydata.length ; ++iii) {
        if ($.inArray("s"+seqquerydata[iii][seqqueryconf[1].id],nodeing.nodes) == -1) {
            if ( seqquerydata[iii][seqqueryconf[1].nextseq] !== nextseq ) {
                var datarec = {"id":"s"+seqquerydata[iii][seqqueryconf[1].id],
                    "user":seqquerydata[iii][seqqueryconf[1].user],
                    "description":seqquerydata[iii][seqqueryconf[1].description],
                    "brief":seqquerydata[iii][seqqueryconf[1].brief],
                    "map":seqquerydata[iii][seqqueryconf[1].map]
                };
                // console.log(seqquerydata[iii]);
                nodeing.nodes.push(datarec);   
                var datarec = {"source":seqquerydata[iii][seqqueryconf[2].source],"target":"s"+seqquerydata[iii][seqqueryconf[2].target]};
                nodeing.links.push(datarec);
                nextseq = seqquerydata[iii][seqqueryconf[1].nextseq];
                
                if (detail) {
                    var datarec = {"id":"p1"+seqquerydata[iii][seqqueryconf[1].id],"user":seqquerydata[iii][seqqueryconf[2].user],"description":seqquerydata[iii]["datum"],"brief":'false',"map":''};
                    nodeing.nodes.push(datarec);
                    var datarec = {"id":"p2"+seqquerydata[iii][seqqueryconf[1].id],"user":seqquerydata[iii][seqqueryconf[2].user],"description":seqquerydata[iii]["zeit"],"brief":'false',"map":''};
                    nodeing.nodes.push(datarec);
                    var datarec = {"id":"p3"+seqquerydata[iii][seqqueryconf[1].id],"user":seqquerydata[iii][seqqueryconf[2].user],"description":seqquerydata[iii]["kategori"],"brief":'false',"map":''};
                    nodeing.nodes.push(datarec);

                    var datarec = {"source":"p1"+seqquerydata[iii][seqqueryconf[1].id],"target":"s"+seqquerydata[iii][seqqueryconf[1].id]};
                    nodeing.links.push(datarec);
                    var datarec = {"source":"p2"+seqquerydata[iii][seqqueryconf[1].id],"target":"s"+seqquerydata[iii][seqqueryconf[1].id]};
                    nodeing.links.push(datarec);
                    var datarec = {"source":"p3"+seqquerydata[iii][seqqueryconf[1].id],"target":"s"+seqquerydata[iii][seqqueryconf[1].id]};
                    nodeing.links.push(datarec);
                }
            }
        }
    } 
        return nodeing;
    } 
function dforcegraphbuildRanking(seqquerydata,seqqueryconf,nodeing) {
    var labels = {4:'Round1',3:'Round2',2:'Quarter',1:'Semi',0:'Final'}
    for (var stage=0; stage <= 4 ; ++stage) {
        for (var stagei=0; stagei < Math.pow(2,stage);++stagei) {
            var datarec = {"id":"t"+stage+""+stagei,
            "user":"u1"+stage,
            "description":labels[stage]+" Game:"+(stage+""+stagei),
            "brief":'false'
            };
            nodeing.nodes.push(datarec);
        }
    }   

    for (var stage=0; stage <= 3 ; ++stage) {
        for (var stagei=0; stagei < Math.pow(2,stage);++stagei) {
            var datarec = {"source":"t"+(stage)+""+stagei,"target":"t"+(stage+1)+""+(2*stagei)};
            nodeing.links.push(datarec);
            var datarec = {"source":"t"+(stage)+""+stagei,"target":"t"+(stage+1)+""+(2*stagei+1)};
            nodeing.links.push(datarec);
        }
    }

    return nodeing;
} 

function dforcegraphbuildHigh(seqquerydata,nodeing) {
    var datarec = {"id":"max",
                    "user":"max",
                    "description":"TOP 5 PLAYER",
                    "brief":'false',
                    "map":''
                    };
                    nodeing.nodes.push(datarec);
Object.keys(seqquerydata).forEach(function(key,index) {
                        // key: the name of the object key
                        // index: the ordinal position of the key within the object 
    var datarec = {"id":key+"0",
                    "user":key,
                    "description":key,
                    "brief":'false',
                    "map":''
                    };
    nodeing.nodes.push(datarec);
    nodeing.links.push({source:key+"0",target:"max"});
    for (var i=0 ; i < seqquerydata[key].length; ++i) {
        var datarec = { "id":key+(i+1),
                        "user":key,
                        "description":''+(i+1)+'. '+seqquerydata[key][i].name+' '+seqquerydata[key][i].datavalue,
                        "brief":'false'
        };
        nodeing.nodes.push(datarec);
        nodeing.links.push({source:key+(i+1),target:key+i});
    }
});
    return nodeing;
} 


function dforcegraphbuildmapdetail(seqquerydata,seqqueryconf,nodeing,detail) {

    var datarec = {"id":"root",
    "user":"",
    "description":"GROUPS",
    "brief":'false',
    "map":''
    };
     nodeing.nodes.push(datarec);
    var nextupl = "----";
    console.log(seqquerydata);
    for (var i3=0; i3 < seqquerydata.length ; ++i3) {
           if ( seqquerydata[i3][seqqueryconf[0].nextupl] !== nextupl ) {
               
                var datarec = { "id":"i"+seqquerydata[i3][seqqueryconf[0].id],
                                "user":seqquerydata[i3][seqqueryconf[0].user],
                                "description":seqquerydata[i3][seqqueryconf[0].description],
                                "brief":'false',
                                "map":''
                            };
                nextupl = seqquerydata[i3][seqqueryconf[0].nextupl];
                nodeing.nodes.push(datarec);
                 
                var datarec = {"source":"i"+seqquerydata[i3][seqqueryconf[0].id],"target":"root"};
                nodeing.links.push(datarec);   
            }
   }
   
    for (var iii=0; iii < seqquerydata.length ; ++iii) {
                var datarec = { "id":"s"+seqquerydata[iii][seqqueryconf[1].id],
                                "user":seqquerydata[iii][seqqueryconf[2].id],
                                "description":seqquerydata[iii][seqqueryconf[1].description],
                                "brief":seqquerydata[iii][seqqueryconf[1].brief],
                                "map":seqquerydata[iii][seqqueryconf[1].map]
                };
                
                nodeing.nodes.push(datarec);  
                 
                var datarec = {"source":"s"+seqquerydata[iii][seqqueryconf[1].id],"target":"i"+seqquerydata[iii][seqqueryconf[0].id]};
                
                nodeing.links.push(datarec);
                
                if (detail) {
                    var datarec = {"id":"p1"+seqquerydata[iii][seqqueryconf[1].id],"user":seqquerydata[iii][seqqueryconf[2].user],"description":seqquerydata[iii]["datum"],"brief":'false',"map":''};
                    nodeing.nodes.push(datarec);
                    var datarec = {"id":"p2"+seqquerydata[iii][seqqueryconf[1].id],"user":seqquerydata[iii][seqqueryconf[2].user],"description":seqquerydata[iii]["zeit"],"brief":'false',"map":''};
                    nodeing.nodes.push(datarec);
                    var datarec = {"id":"p3"+seqquerydata[iii][seqqueryconf[1].id],"user":seqquerydata[iii][seqqueryconf[2].user],"description":seqquerydata[iii]["kate"],"brief":'false',"map":''};
                    nodeing.nodes.push(datarec);

                    var datarec = {"source":"p1"+seqquerydata[iii][seqqueryconf[1].id],"target":"s"+seqquerydata[iii][seqqueryconf[1].id]};
                    nodeing.links.push(datarec);
                    var datarec = {"source":"p2"+seqquerydata[iii][seqqueryconf[1].id],"target":"s"+seqquerydata[iii][seqqueryconf[1].id]};
                    nodeing.links.push(datarec);
                    var datarec = {"source":"p3"+seqquerydata[iii][seqqueryconf[1].id],"target":"s"+seqquerydata[iii][seqqueryconf[1].id]};
                    nodeing.links.push(datarec);
                }
                
                          
    } 


        return nodeing;
}