const express = require('express');
// const bodyParser = require('body-parser');
const dbConfig = require('./db/db-conf.js');
// ↑ exports = {user, password, host, databse}
// const connection = require('mysql2');
const connection = require('./db/connect.js');
const query = require('./db/query.js');
const crypto = require('crypto');
const app = express();
const port = 3000;
var bodyParser = require('body-parser');




app.use( bodyParser.json({     // to support JSON-encoded bodies
  limit: '50mb', extended: true
}) );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  limit: '50mb', extended: true
}));
// public stuff
app.use(express.static('public'));
// app.use(bodyParser.json());
// app.set('view engine','jade'); //Sets jade as the View Engine / Template Engine
app.set('view engine','ejs');
app.set('views','src/views'); 
app.engine('html', require('ejs').renderFile);


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); 
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Creates a Root Route
app.get('/',function(req, res){
  res.render('index.html');
    // res.render('index');  //renders the index.jade file into html and returns as a response. The render function optionally takes the data to pass to the view.
});


// app.get('/', (req, res) => res.send('Hello World!'))

app.get('/api', async (req, res) => {
  const conn = await connection(dbConfig).catch(e => {}) 
  const results = await query(conn, 'SELECT * FROM abacvs_seqhead LIMIT 1,10').catch(console.log);
  conn.close();
  res.json({ results });
})

app.post('/upload', async (req, res) => {
  var myfile = req.body.myfile;
  var mysequence = JSON.parse(req.body.myfiledata);
  var myfilename = mysequence.filename;
  var myfilesize = mysequence.filesize;
  var myfileext = mysequence.ext;
  var mymd5 = mysequence.md5;
  var myemail = mysequence.email;

 
  // console.log(mysequence.exeversion);
  const conn = await connection(dbConfig).catch(e => {}); 
  // let hash = crypto.createHash('md5').update(req.body.myfile).digest("hex");
  // check if md5 exists
  var selectmd5 = "SELECT `md5` FROM `abacvs_files_"+myfileext+"` WHERE `md5`= ?; ";
  var todos=[mymd5];
  const resultsselectmd5 = await query(conn, selectmd5,todos).catch(console.log);
  // check if no md5
  if (resultsselectmd5.length === 0) {
    // insert filedata
    var insertstr = "INSERT INTO `abacvs_files_"+myfileext+"` ( `oldname`, `ext`, `md5`, `email`, `size`, `download`, `lastdown`, `uptime`, `rawdata`) \
                  VALUES ( ?,  ?,  ?, ?,  ?,  '0', NOW(),  NOW(),COMPRESS(?)); ";
    var todos = [ myfilename,myfileext,mymd5,myemail,myfilesize,myfile];
    const resultsfile = await query(conn, insertstr,todos).catch(console.log);
    //console.log("INSERT FILE");
    //console.log(results.insertId);
    // res.json({ results });
    var inserthead = "INSERT INTO `abacvs_seqhead_"+myfileext+"` \
                  ( `uid`, `version`, `gtime`, `datum`, `zeit`, `karte`, `cpuskill`, `players`, `kategori`, \
                  `towers`, `catapults`, `ballistas`, `rams`, `dataset`) \
                  VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?) ";
                  var todos = [resultsfile.insertId,mysequence.exeversion,mysequence.nallTime,mysequence.gamedate,mysequence.game_time,mysequence.mapa,mysequence.cpuskill,mysequence.playerCounter,mysequence.kategori,mysequence.tow,mysequence.cat,mysequence.bal,mysequence.ram,req.body.myfiledata];  const resultshead = await query(conn, inserthead,todos).catch(console.log);
    mysequence["fileid"] = resultsfile.insertId;
    mysequence["headid"] = resultshead.insertId;
    mysequence["email"]=(mysequence["email"].split('@'))[0];
    var todos=[mysequence.mapa];
    const resultkarte = await query(conn, 'SELECT filename FROM abacvs_karten WHERE mapid = ?',todos).catch(console.log);
    mysequence["karteen"]=resultkarte[0].filename;
    var todoshead = [JSON.stringify(mysequence),resultshead.insertId];
    var updatehead = "UPDATE `abacvs_seqhead_"+myfileext+"` set `dataset`= ? WHERE `idx`= ? ";
    const resultupdatehead = await query(conn, updatehead,todoshead).catch(console.log);

    //console.log("INSERT HEAD");
    var insertbody = "INSERT INTO `abacvs_seqbody_"+myfileext+"` \
                      (`cpu`, `steamid`, `name`, `rasse`, `losts`, `kills`, `trains`, `times`, `vills`, `points`, `teams`, `colors`, `wins`, `saved`,  `sequenze`, `skill`) \
                      VALUES ? ";
    var todos = [];  
    for (var iplayer=0 ; iplayer < mysequence['playerCounter'] ; ++iplayer) 
    {
      var aktplayer = mysequence.troops[iplayer];
      var pskill = Math.floor((aktplayer.score*10000/mysequence.nallTime));
      var myrow =[aktplayer.cpu,aktplayer.steamid,aktplayer.name,aktplayer.race,aktplayer.losts,aktplayer.kills,aktplayer.train,aktplayer.time,aktplayer.villa,aktplayer.score,aktplayer.team,aktplayer.color,aktplayer.wins,aktplayer.saved,resultshead.insertId,pskill];
      todos.push(myrow);
    }
    const resultsbody = await query(conn, insertbody,[todos]).catch(console.log);
      //console.log("INSERT BODY");
      conn.close();
    res.send({status:'new',md5:mymd5});
  } else {
    conn.close();
    res.send({status:'exists',md5:mymd5});
  }


})
// CHECK FOR MD5 EXISTS
app.post('/upload/md5', async (req, res) => {
  var mymd5 = req.body.md5;
  var myext = req.body.ext;
   // console.log(mysequence.exeversion);
  const conn = await connection(dbConfig).catch(e => {}); 
  // check if md5 exists
  var selectmd5 = "SELECT `md5` FROM `abacvs_files_"+myext+"` WHERE `md5`= ? ";
  var todos=[mymd5];
  const resultsselectmd5 = await query(conn, selectmd5,todos).catch(console.log);
  // check if no md5
  conn.close();
  if (resultsselectmd5.length === 0) {
    res.send({status:'new',md5:mymd5});
  } else {
    res.send({status:'exists',md5:mymd5});
  }


})
// CHECK FOR MD5 EXISTS
app.get('/graph/3dforce', async (req, res) => {
  // var mymd5 = req.body.md5;
  var myext = "sav";
   // console.log(mysequence.exeversion);
  const conn = await connection(dbConfig).catch(e => {}); 
  // check if md5 exists
  var selectseq100 = "SELECT seqh.idx AS idx, seqh.uid, seqh.version,  seqh.datum, seqh.zeit, seqh.kategori AS kat, seqh.karte AS karte, seqf.email AS email, seqh.dataset AS dataset,seqb.name AS name ,seqb.skill AS skill,seqb.sequenze AS sequenze ,seqb.idx AS bidx \
                   FROM `abacvs_seqhead_"+myext+"` AS seqh  \
                   JOIN `abacvs_files_"+myext+"` AS seqf ON seqh.uid = seqf.idx  \
                   JOIN  `abacvs_seqbody_"+myext+"` AS seqb ON seqb.sequenze = seqh.idx  \
                   ORDER BY seqf.email asc,seqb.sequenze desc \
                   Limit 100; ";
   const resultsselectseq100 = await query(conn, selectseq100).catch(console.log);
  // check if no md5
  var nodeing = {nodes:[],links:[]}; 
  var nextseq = 0;
   for (var i3=0; i3 < resultsselectseq100.length ; ++i3) {
    var datarec = {"id":"p"+resultsselectseq100[i3].bidx,
    "user":resultsselectseq100[i3].sequenze,
    "description":resultsselectseq100[i3].name,
    "brief":resultsselectseq100[i3].dataset
    };
    nodeing.nodes.push(datarec);
  }
  var nextupl = 0;
  for (var i3=0; i3 < resultsselectseq100.length ; ++i3) {
    if ( resultsselectseq100[i3].email !== nextupl ) {
      var datarec = {"id":resultsselectseq100[i3].email,
      "user":resultsselectseq100[i3].email,
      "description":resultsselectseq100[i3].email.split('@')[0],
      "brief":resultsselectseq100[i3].dataset
      };
      nodeing.nodes.push(datarec);     
      nextupl = resultsselectseq100[i3].email;      
    }
  }


  for (var iii=0; iii < resultsselectseq100.length ; ++iii) {
    if ( resultsselectseq100[iii].sequenze !== nextseq ) {
      var datarec = {"id":"s"+resultsselectseq100[iii].sequenze,
      "user":resultsselectseq100[iii].sequenze,
      "description":resultsselectseq100[iii].kat,
      "brief":resultsselectseq100[iii].dataset
      };
      nodeing.nodes.push(datarec);     
      var datarec = {"source":resultsselectseq100[iii].email,"target":"s"+resultsselectseq100[iii].sequenze};
      nodeing.links.push(datarec);
      nextseq = resultsselectseq100[iii].sequenze;
      for (var ii=0; ii < resultsselectseq100.length ; ++ii) {
        if (resultsselectseq100[iii].sequenze == resultsselectseq100[ii].sequenze) {
        var datarec = {"source":"s"+resultsselectseq100[iii].sequenze,"target":"p"+resultsselectseq100[ii].bidx};
            nodeing.links.push(datarec);
        }
       }
    } 
  
  }

  res.json(nodeing);
 


})

// CHECK FOR MD5 EXISTS
app.get('/graph/3dforceraw', async (req, res) => {
  // var mymd5 = req.body.md5;
  var myext = "sav";
   // console.log(mysequence.exeversion);
  const conn = await connection(dbConfig).catch(e => {}); 
  // check if md5 exists
  var selectseq100 = "SELECT seqh.idx AS idx, seqh.uid, seqh.version,  seqh.datum, seqh.zeit, seqh.kategori AS kat, seqh.karte AS karte, SUBSTR( seqf.email,1, (LENGTH(seqf.email) - ( LENGTH(seqf.email) -( INSTR(seqf.email,'@') ) )-1) ) as email, seqh.dataset AS dataset,seqb.name AS name ,seqb.skill AS skill,seqb.sequenze AS sequenze ,seqb.idx AS bidx,seqk.filename as karteen \
                   FROM `abacvs_seqhead_"+myext+"` AS seqh  \
                   JOIN `abacvs_files_"+myext+"` AS seqf ON seqh.uid = seqf.idx  \
                   JOIN  `abacvs_seqbody_"+myext+"` AS seqb ON seqb.sequenze = seqh.idx  \
                   JOIN abacvs_karten AS seqk ON seqh.karte=seqk.mapid \
                   ORDER BY seqf.email asc,seqb.sequenze desc \
                   Limit 500; ";
   const resultsselectseq100 = await query(conn, selectseq100).catch(console.log);
  conn.close();
  // check if no md5
   res.json( resultsselectseq100);
 })

// no players
// CHECK FOR MD5 EXISTS
app.get('/graph/3dforcenoply', async (req, res) => {
  // var mymd5 = req.body.md5;
  var myext = "sav";
   // console.log(mysequence.exeversion);
  const conn = await connection(dbConfig).catch(e => {}); 
  // check if md5 exists
  var selectseqheadfile = "SELECT seqh.idx AS idx, seqh.uid, seqh.version,  seqh.datum, seqh.zeit, seqh.kategori AS kate, seqh.karte AS karte, SUBSTR( seqf.email,1, (LENGTH(seqf.email) - ( LENGTH(seqf.email) -( INSTR(seqf.email,'@') ) )-1) ) as email, seqh.dataset AS dataset,seqk.filename as karteen,seqf.oldname as sequencefilename \
                   FROM `abacvs_seqhead_"+myext+"` AS seqh  \
                   JOIN `abacvs_files_"+myext+"` AS seqf ON seqh.uid = seqf.idx \
                   LEFT JOIN abacvs_karten AS seqk ON seqh.karte=seqk.mapid \
                   ORDER BY seqf.email asc \
                   LIMIT 500 ";
   const resultselectseqheadfile = await query(conn, selectseqheadfile).catch(console.log);
   conn.close();
  // check if no md5
   res.json( resultselectseqheadfile);
 });

// CHECK FOR MD5 EXISTS
app.post('/list/:id', async (req, res) => {
  // var mymd5 = req.body.md5;
  if (req.params.id !== 'undefined'){
  
    var myext = req.params.id;
  
  var limlength =  parseInt(req.body.limlength);
  var limstart = parseInt(req.body.limstart);
  var limstart = limstart*limlength-limlength;
  var sqldata = [];
  var where = [];
  if (req.body.filterplayername !=  "") {
    where += " AND seqb.name LIKE ? ";
    sqldata.push('%'+req.body.filterplayername+'%');
  }
  if (req.body.filteridx !=  "") {
    where += " AND seqh.idx =? ";
    sqldata.push(req.body.filteridx);
  }
  if (req.body.filtercpuskill !=  "") {
    where += " AND seqh.cpuskill =? ";
    sqldata.push(req.body.filtercpuskill);
  }
  if (req.body.filtergroup !=  "" || req.body.filteryourid !=  "") {
    where += " AND seqf.email LIKE ? ";
    sqldata.push('%'+req.body.filtergroup+'\@'+req.body.filteryourid+'%');
  }
  if (req.body.filterplayerwin !=  "" ) {
    where += " AND seqb.wins = ? ";
    sqldata.push(req.body.filterplayerwin);
  }
  if (req.body.filterplayerrace !=  "" ) {
    where += " AND seqb.rasse LIKE ? ";
    sqldata.push(req.body.filterplayerrace);
  }
  if (req.body.filterplayersaved !=  "" ) {
    where += " AND seqb.saved = ? ";
    sqldata.push(req.body.filterplayersaved);
  }
  if (req.body.filterplycount !=  "" ) {
    where += " AND seqh.players = ? ";
    sqldata.push(req.body.filterplycount);
  }
  if (req.body.filterkategori !=  "" ) {
    where += " AND seqh.kategori LIKE ? ";
    sqldata.push(req.body.filterkategori);
  }
  if (req.body.filtersiege !=  "" ) {
    if (req.body.filtersiege == 0 ) {
    where += " AND (seqh.rams = 0 AND seqh.ballistas = 0 AND seqh.catapults = 0 AND seqh.towers = 0)   ";
    }
    if (req.body.filtersiege == 1 ) {
      where += " AND (seqh.rams > 0 OR seqh.ballistas  > 0 OR seqh.catapults  > 0 OR seqh.towers > 0) ";
      }
  }
  if (where != "") {where = " WHERE 1 = 1 "+where;}
  var order ="";
  order = "ORDER BY seqh.idx desc";
  if (req.body.orderfield !=  "" ) {
    var orderfieldname ="";
    var orderfieldorder ="";
    if (req.body.orderfield == "idx") {orderfieldname ="seqh.idx";}
    if (req.body.orderfield == "kategori") {orderfieldname ="seqh.kategori";}
    if (req.body.orderfield == "players") {orderfieldname ="seqh.players";}
    if (req.body.orderfield == "download") {orderfieldname ="seqf.download";}
    if (req.body.orderorder == "asc") {
      orderfieldorder ="asc";
    } else {
      orderfieldorder ="desc";
    }
    
    order = "ORDER BY "+orderfieldname+" "+orderfieldorder;  
  } 
  if (req.body.orderfield ==  "0" ) {
    order = ""; 
  }
  sqldata.push(limlength,limstart);
    // console.log(mysequence.exeversion);
  const conn = await connection(dbConfig).catch(e => {}); 
  var selectrowcount =  "SELECT COUNT(DISTINCT seqh.uid) as zahler  FROM `abacvs_seqhead_"+myext+"` AS seqh  \
                        JOIN `abacvs_files_"+myext+"` AS seqf ON seqh.uid = seqf.idx  \
                        JOIN  `abacvs_seqbody_"+myext+"` AS seqb ON seqb.sequenze = seqh.idx  \
                        LEFT JOIN abacvs_karten AS seqk ON seqh.karte=seqk.mapid \
                        "+where;
                         
  const resultsselectrowcount = await query(conn, selectrowcount,sqldata).catch(console.log);
  // check if md5 exists
  var selectseqlist = "SELECT seqh.idx,seqh.uid,seqh.version,seqh.gtime,seqh.datum,seqh.zeit,seqh.karte,seqh.cpuskill,seqh.players,seqh.kategori,seqh.towers,seqh.catapults,seqh.ballistas,seqh.rams,seqh.dataset,seqf.oldname,seqf.ext,seqf.md5,SUBSTR( seqf.email,1, (LENGTH(seqf.email) - ( LENGTH(seqf.email) -( INSTR(seqf.email,'@') ) )-1) ) as email,seqf.size,seqf.download,seqf.lastdown,seqf.uptime,seqk.filename as karteen,seqk.spmax,seqk.mapdl,seqk.author,seqk.includedin,seqk.terrain  \
                      FROM `abacvs_seqhead_"+myext+"` AS seqh  \
                      JOIN `abacvs_files_"+myext+"` AS seqf ON seqh.uid = seqf.idx  \
                      JOIN  `abacvs_seqbody_"+myext+"` AS seqb ON seqb.sequenze = seqh.idx  \
                      LEFT JOIN abacvs_karten AS seqk ON seqh.karte=seqk.mapid \
                       "+where+" \
                      GROUP BY seqh.idx \
                       "+order+"  \
                   LIMIT ? OFFSET ? ";
  
   const resultsselectseqlist = await query(conn, selectseqlist,sqldata).catch(console.log);

   conn.close();
  // check if no md5
   res.json({'count':resultsselectrowcount[0].zahler,'limstart':limstart, 'limlength':limlength,'list':resultsselectseqlist});
  }
 })

app.get('/download/sec/:id', async (req, res) => {
  if (req.params.id !== 'undefined'){
    const conn = await connection(dbConfig).catch(e => {}) ;
    const results = await query(conn, 'SELECT oldname,UNCOMPRESS(rawdata) as rawdat FROM abacvs_files_sec idx='+req.params.id+' ORDER BY idx desc LIMIT 1').catch(console.log);
    // res.json({ results });
    const resultupdatedownload = await query(conn, 'UPDATE abacvs_files_sec SET download=download+1,lastdown=NOW() WHERE idx='+req.params.id ).catch(console.log);  
    conn.close();
        myfilename = results[0].oldname;
        // console.log(myfile);
        var buf = Buffer.from(results[0].rawdat.toString(), 'base64');

        // res.json({ myfile,myfilename });
        res.status(200);
        res.set({
          'Cache-Control': 'no-cache',
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': 'attachment; filename=' + myfilename,
          'Content-Length': buf.byteLength
        });      
        
      res.send(buf);
  } 

})
app.get('/download/sav/:id', async (req, res) => {
  if (req.params.id !== 'undefined'){
  const conn = await connection(dbConfig).catch(e => {}) ;
  const results = await query(conn, 'SELECT oldname,UNCOMPRESS(rawdata) as rawdat FROM abacvs_files_sav WHERE idx='+req.params.id+' ORDER BY idx desc LIMIT 1').catch(console.log);
  // res.json({ results });
  const resultupdatedownload = await query(conn, 'UPDATE abacvs_files_sav  SET download=download+1,lastdown=NOW()  WHERE idx='+req.params.id).catch(console.log);  
  conn.close();
      myfilename =  results[0].oldname;
      // console.log(myfile);
      var buf = Buffer.from(results[0].rawdat.toString(), 'base64');
      // res.json({ myfile,myfilename });
      res.status(200);
      res.set({
        'Cache-Control': 'no-cache',
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': 'attachment; filename=' + myfilename,
        'Content-Length': buf.byteLength
      });      
      
     res.send(buf);
    }

})
// CHECK FOR MD5 EXISTS
app.get('/bestof/:id', async (req, res) => {
  if (req.params.id !== 'undefined'){
  // var mymd5 = req.body.md5;
  var myext =req.params.id;
  const conn = await connection(dbConfig).catch(e => {}) ;

  // bestof
  function maxselecter(highval) {
   var selecthigh =  "SELECT seqh.idx ,seqh.dataset,seqb.name,seqb.rasse,"+highval+"  FROM `abacvs_seqhead_"+myext+"` AS seqh  \
                        JOIN `abacvs_files_"+myext+"` AS seqf ON seqh.uid = seqf.idx  \
                        JOIN  `abacvs_seqbody_"+myext+"` AS seqb ON seqb.sequenze = seqh.idx  \
                        LEFT JOIN abacvs_karten AS seqk ON seqh.karte=seqk.mapid \
                        \
                        ORDER BY "+highval+" desc LIMIT 5";
                        return selecthigh;
  }
  function playerselecter(highval) {
    var selecthigh =  "SELECT seqh.idx ,seqh.dataset,seqb.name,seqb.rasse,"+highval.field+"  FROM `abacvs_seqhead_"+myext+"` AS seqh  \
                         JOIN `abacvs_files_"+myext+"` AS seqf ON seqh.uid = seqf.idx  \
                         JOIN  `abacvs_seqbody_"+myext+"` AS seqb ON seqb.sequenze = seqh.idx  \
                         LEFT JOIN abacvs_karten AS seqk ON seqh.karte=seqk.mapid \
                         GROUP BY seqb.name \
                         ORDER BY "+highval.as+" desc LIMIT 5";
                         return selecthigh;
   }                       
   /*
   SELECT seqh.idx ,seqh.dataset,seqb.name,seqb.rasse,SUM(seqb.skill) as sumskill  FROM `abacvs_seqhead_save` AS seqh 
                         JOIN `abacvs_files_sav` AS seqf ON seqh.uid = seqf.idx  
                         JOIN  `abacvs_seqbody_sav` AS seqb ON seqb.sequenze = seqh.idx  
                         LEFT JOIN abacvs_karten AS seqk ON seqh.karte=seqk.mapid 
                         GROUP BY seqb.name 
                         ORDER BY sumskill desc LIMIT 5
   */
  const resultsselecthighskill = await query(conn, maxselecter('seqb.skill ')).catch(console.log);
  const resultsselecthighscore = await query(conn, maxselecter('seqb.points  ')).catch(console.log);
  const resultsselecthighkill = await query(conn, maxselecter('seqb.kills  ')).catch(console.log);
  const resultsselecthighlost = await query(conn, maxselecter('seqb.losts  ')).catch(console.log);
  const resultsselecthightrain = await query(conn, maxselecter('seqb.trains  ')).catch(console.log);
  const resultsselecthightime = await query(conn, maxselecter('seqb.times  ')).catch(console.log);
 
  const resultsselecthighgamecount = await query(conn, playerselecter({field:'COUNT(seqb.skill) as gamescount',as:'gamescount'})).catch(console.log);
  const resultsselecthighsumskill = await query(conn, playerselecter({field:'SUM(seqb.skill) as sumskill',as:'sumskill'})).catch(console.log);
  const resultsselecthighsumpoints = await query(conn, playerselecter({field:'SUM(seqb.wins) as sumpoints',as:'sumpoints'})).catch(console.log);
  const resultsselecthighsumkills = await query(conn, playerselecter({field:'SUM(seqb.kills) as sumkills',as:'sumkills'})).catch(console.log);
  const resultsselecthighsumlosts = await query(conn, playerselecter({field:'SUM(seqb.losts) as sumlosts',as:'sumlosts'})).catch(console.log);
  const resultsselecthighsumtrains = await query(conn, playerselecter({field:'SUM(seqb.trains) as sumtrains',as:'sumtrains'})).catch(console.log);
  const resultsselecthighsumtimes = await query(conn, playerselecter({field:'SUM(seqb.times) as sumtimes',as:'sumtimes'})).catch(console.log);
  const resultsselecthighgamewin = await query(conn, playerselecter({field:'SUM(seqb.wins) as gameswin',as:'gameswin'})).catch(console.log);

  const resultsselecthighavgskill = await query(conn, playerselecter({field:'AVG(seqb.skill) as avgskill',as:'avgskill'})).catch(console.log);
  const resultsselecthighavgpoints = await query(conn, playerselecter({field:'AVG(seqb.wins) as avgpoints',as:'avgpoints'})).catch(console.log);
  const resultsselecthighavgkills = await query(conn, playerselecter({field:'AVG(seqb.kills) as avgkills',as:'avgkills'})).catch(console.log);
  const resultsselecthighavglosts = await query(conn, playerselecter({field:'AVG(seqb.losts) as avglosts',as:'avglosts'})).catch(console.log);
  const resultsselecthighavgtrains = await query(conn, playerselecter({field:'AVG(seqb.trains) as avgtrains',as:'avgtrains'})).catch(console.log);
  const resultsselecthighavgtimes = await query(conn, playerselecter({field:'AVG(seqb.times) as avgtimes',as:'avgtimes'})).catch(console.log);
   conn.close();
  // check if no md5
   res.json({'skill':resultsselecthighskill,'kills':resultsselecthighkill,'points':resultsselecthighscore,'losts':resultsselecthighlost,
              'trains':resultsselecthightrain,'times':resultsselecthightime,'sumskill':resultsselecthighsumskill,'gamescount':resultsselecthighgamecount,'gameswin':resultsselecthighgamewin,
            'sumpoints':resultsselecthighsumpoints,'sumkills':resultsselecthighsumkills,'sumlosts':resultsselecthighsumlosts,'sumtrains':resultsselecthighsumtrains,'sumtimes':resultsselecthighsumtimes,
            'avgskill':resultsselecthighavgskill,'avgpoints':resultsselecthighavgpoints,'avgkills':resultsselecthighavgkills,'avglosts':resultsselecthighavglosts,'avgtrains':resultsselecthighavgtrains,'avgtimes':resultsselecthighavgtimes
              
          });
  }
 })
app.listen(port, () => console.log(`Example app listening on port ${port}!`))