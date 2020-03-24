// read the sequence statistics
function getDataFromSeqrem(sequence_player_datas,remastered = false) 
{
		var player_datas={};
		var nothing=fread(sequence_player_datas,8);
		player_datas['exeversion'] 		= 		ord(fgetc(sequence_player_datas));
		nothing=fread(sequence_player_datas,3);
		player_datas['nallTime'] 		= 		getInteger(sequence_player_datas,4);
		player_datas['gamedate'] 		= 		getString(sequence_player_datas,1);
		player_datas['game_time'] 		= 		getString(sequence_player_datas,1);
		player_datas['mapa'] 			= 		getString(sequence_player_datas,1);
	// ADDED CPU SKILL 03-hard, 02-normal, 01-easy 1 BYTE
		nothing=fread(sequence_player_datas,1);
		player_datas['cpuskill'] 	= 		getInteger(sequence_player_datas,1);
		nothing=fread(sequence_player_datas,1);
	// END ADDED
		player_datas['playerCounter'] 	= 		getInteger(sequence_player_datas,1);
		nothing=fread(sequence_player_datas,2);
		player_datas['troops'] 			= 		new Array();
		hasCPU = false;
		for (var ii=0 ; ii < player_datas['playerCounter'] ; ++ii) 
		{
			var theid = ord(fread(sequence_player_datas,1));
		/* ADDED ISCPU */
			var iscpu = getInteger(sequence_player_datas,1);
			if (iscpu == 1) {hasCPU = true;}
		// ENd ADDED	
			var player={};
			player['name'] 				=  		getString(sequence_player_datas,2);
            /* skip some unknown values */
            if (remastered) {
                // ADDED for REMSTERED //
                player['steamid']=getString(sequence_player_datas,2);
                // END ADDED for REMSTERED //
            } else {
                player['steamid']="";
            }
			player['race'] 				=  		getString(sequence_player_datas,1);
			/* skip some unknown values */
			nothing=fread(sequence_player_datas,20);
			/* here we find the count of troops follow */
			troopscounter=getInteger(sequence_player_datas,1);
			/* skip some empty values */
			nothing=fread(sequence_player_datas,2);
			/* now skip the troops */
			skipelement(troopscounter,sequence_player_datas);
		/* ADDED ISCPU */
			var mydpush = {"cpu":iscpu,"name" :player['name'],"steamid" :player['steamid'],"race" :player['race'],"saved" :"","wins" :"","color" :"","team" :"","score" :"","villa" :"","time" :"","train" :"","kills" :"","losts" :""};
		// END ADDED
			player_datas['troops'].push(mydpush);
        }
        /* ADDED Check if CPU is inside , if not set skill to 0 */
        if (!hasCPU) {player_datas['cpuskill']=0;}
        // find the last player_datas cause there are the stats
        // read the siege stuff while this 
		// at 0000450000800000
    var findid ="";
		findid += mdechex(fgetc(sequence_player_datas))+mdechex(fgetc(sequence_player_datas));
        findid += mdechex(fgetc(sequence_player_datas))+mdechex(fgetc(sequence_player_datas))+mdechex(fgetc(sequence_player_datas))+mdechex(fgetc(sequence_player_datas));
        findid += mdechex(fgetc(sequence_player_datas))+mdechex(fgetc(sequence_player_datas))+mdechex(fgetc(sequence_player_datas))+mdechex(fgetc(sequence_player_datas));
        findid += mdechex(fgetc(sequence_player_datas))+mdechex(fgetc(sequence_player_datas))+mdechex(fgetc(sequence_player_datas));
        var cat = 0;
        var bal = 0;
        var ram = 0;
        var tow = 0;
        var sieges = ['/CATAPULTA/','/BALLESTA/','/ARIETE/','/TORRE_DEFENSA/'];
		while (findid.substr(14) != "450000800000" &&  sequence_player_datas.length-1 > filepos) 
		{                           
            if (findid.substr(14) =="415249455445") {++ram;}
            if (findid.substr(8) =="4341544150554c5441") {++cat;}
            if (findid.substr(10) =="42414c4c45535441") {++bal;}
            if (findid == "544f5252455f444546454e5341") {++tow;};
            nextnewchar = mdechex(fgetc(sequence_player_datas));
            findid = findid.substr(2)+nextnewchar;
    
        }
        player_datas['bal'] = bal;
        player_datas['cat'] = cat;
        player_datas['ram'] = ram;
        player_datas['tow'] = tow;
        // gametype teamplayer count ... 
        var gametype = [0,0,0,0,0,0,0,0,0];

		nothing=fread(sequence_player_datas,4);
		var players_coming =  getInteger(sequence_player_datas,1);
		for (var ii=0 ; ii < players_coming ; ++ii) 
		{
			player_datas_saved 	= 	getInteger(sequence_player_datas,1) ;
			player_datas_wins 	=  	getInteger(sequence_player_datas,1);
			player_datas_color 	=  	getInteger(sequence_player_datas,1);
            player_datas_team 	=  	getInteger(sequence_player_datas,1);
            // for gametype count 
            ++gametype[player_datas_team];
			player_datas_score 	=  	getInteger(sequence_player_datas,4);
			player_datas_villa 	=  	getInteger(sequence_player_datas,4);
			player_datas_time 	= 	getInteger(sequence_player_datas,4);
			player_datas_train 	= 	getInteger(sequence_player_datas,4);
			player_datas_kills 	= 	getInteger(sequence_player_datas,4);
			player_datas_losts 	= 	getInteger(sequence_player_datas,4);
            player_datas_name 	= 	getString(sequence_player_datas,2);
            if (remastered) {
                // ADDED for REMASTERED //
                nothing=fread(sequence_player_datas,1);
                // END ADDED for REMASTERED //
            }
			player_datas_race 	= 	getString(sequence_player_datas,2);
			// console.log(player_datas_race);
			for (var ini=0 ; ini < player_datas['troops'].length ; ++ini) 
			{
				if (player_datas['troops'][ini]['name'] == player_datas_name)
				{				
						player_datas['troops'][ini]['saved'] 	= 	player_datas_saved ;
						player_datas['troops'][ini]['wins'] 	=  	player_datas_wins;
						player_datas['troops'][ini]['color'] 	=  	player_datas_color;
						player_datas['troops'][ini]['team'] 	=  	player_datas_team;
						player_datas['troops'][ini]['score'] 	=  	player_datas_score;
						player_datas['troops'][ini]['villa'] 	=  	player_datas_villa;
						player_datas['troops'][ini]['time'] 	= 	player_datas_time;
						player_datas['troops'][ini]['train'] 	= 	player_datas_train;
						player_datas['troops'][ini]['kills'] 	= 	player_datas_kills;
						player_datas['troops'][ini]['losts'] 	= 	player_datas_losts;
				}
			}			
        }
        // create gametype 1vs ..2vs2 ... 
        var found ="";
        for (var ikat=0; gametype.length > ikat; ++ikat) {
            if (gametype[ikat] > 0) {
                if (found != "") {found+="vs";}
                found += gametype[ikat];
            }
        }
        player_datas['kategori']=found;
	return player_datas;
}
// helper functions
/* php ord functions */
function ord(abyte) 
{ 
	return abyte.toString();
}
/* php file functions */
function fgetc(sequence_player_datas) 
{
	var oldfpos = filepos;
	++filepos;
	return sequence_player_datas.charCodeAt(oldfpos);
}
function fread(sequence_player_datas,anzahl)
{
			var result;
			for (var i=0; i < anzahl ; i++) 
			{
				result=result+fgetc(sequence_player_datas);
			}
			return result;
}
function fseek(sequence_player_datas,lastbytes,SEEK_END) 
{
			var ende 	= sequence_player_datas.length ;
			var now 	= ende-lastbytes;
			filepos 	= now;
}
// skip number of string entrys   
function skipelement(nr,sequence_player_datas) 
{
	for (var ni=0; ni < nr; ni++) {id = ord(fread(sequence_player_datas,1)) ;nothing =  {"id":id,"value":getString(sequence_player_datas,1)};}
}
/* hex view for byte */
function mdechex(aByte) 
{
	byteStr = aByte.toString(16);
	if (byteStr.length < 2) {
		byteStr = "0" + byteStr;
	}
  return byteStr;
}
/* reads a number byte long */
function getInteger(sequence_player_datas,bytelong) 
{
	anint = 0;
	if ( bytelong > 0 ) {anint += parseInt(ord(fgetc(sequence_player_datas)));} // 1 byte integer
	if ( bytelong > 1 ) {anint += parseInt(ord(fgetc(sequence_player_datas)))*256;} // 2 byte integer
	if ( bytelong > 2 ) {anint += parseInt(ord(fgetc(sequence_player_datas)))*256*256;}  // 3 byte integer
	if ( bytelong > 3 ) {anint += parseInt(ord(fgetc(sequence_player_datas)))*256*256*256;}  // 4 byte integer
	return anint;
}
/* reads a string with characters are 1 or 2 byte long */
function getString(sequence_player_datas,bytelong) 
{
    var scount = ord(fgetc(sequence_player_datas));
	var result_string = "";
	if (scount > 0 ) {
		for (ii=0 ; ii < scount;ii++) {
			if (bytelong == 1 ) { // 1 byte character
				result_string += String.fromCharCode(fgetc(sequence_player_datas));
			}
			if (bytelong == 2 ) { // 2 byte character
				/* todo : read 2 bytes and get UTF-8 */
				result_string += String.fromCharCode(fgetc(sequence_player_datas));
				++filepos;
			}
		}
	}
	return result_string;
}
/* gameticks in realtime */
function _game_time(game_time)
{
	total_seconds		=	Math.floor((game_time / 15.16285));
	days 				= 	Math.floor((total_seconds / (60*60*24)));
	hourn 				= 	Math.floor((total_seconds / (60*60)));
	seconds_remaining 	= 	Math.floor(total_seconds-(hourn*(60*60)));
	minutes 			= 	Math.floor((seconds_remaining / 60));
	seconds 			= 	seconds_remaining-(minutes*60);
	/* fill with 0 for 2 digit formated */
	return (hourn < 10 ? '0'+hourn+':' : hourn+':')+(minutes < 10 ? '0'+minutes+':' : minutes+':')+(seconds < 10 ? '0'+seconds : seconds);
}