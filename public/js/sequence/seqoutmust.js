// output a sequence
function asequencerem(sequence,remastered,layout) 
{
if (sequence !== false) {
		/* main sequence data */
		sequence_info = sequence;
		sequence_file = sequence.filename;

		html_out = '<p class="secfilename">'+sequence_file+'</p>';
		/* player detail player_datas */
		sequence_players = sequence['troops'];
		/* make version number readable */
		sequence_info['version'] = (sequence_info['exeversion'] == 105 ? '1.05' : (sequence_info['exeversion'] == 104 ? '1.04':(sequence_info['exeversion'] == 103 ? 'Demo':(sequence_info['exeversion'] == 102 ? 'release':'error'))));
		// sequence_info['cpuskill'] = (sequence_info['cpuskill'] == 1 ? 'Easy':(sequence_info['cpuskill'] == 2 ? 'Normal':(sequence_info['cpuskill'] == 3 ? 'Hard':'')));
		sequence_info['unallTime'] = _game_time(sequence_info['nallTime']);
		//
						// mustach
						html_out_secinfo='{{#.}}\n'; 
if(layout == "widget") {	

		html_out+= '<div style="width:400px; overflow:hidden;">';
		html_out+= '<div class="sequence">\n'
	//	html_out+= '<div style="float:left;"><img style="height:90px;" src="/images/mapas/mapnorm/'+sequence_info['karteen']+'"></div>';
		html_out+= '<div style="display:inline-block">';
} else {
	html_out+= '<div style="width:800px;">';
	html_out+= '<div class="sequence">\n'
	// html_out+= '<div style="display:inline-block"><img style="height:90px;" src="/images/mapas/mapnorm/'+sequence_info['karteen']+'"></div>';
	html_out+= '<div style="display:inline-block">';	
}
if(layout == "widget") {
		//  sequence head table
		var html_out_secdata = "";
		html_out_secdata+= '<table cellpadding="0" cellspacing="0" class="sequenceheadtbl" >\n';
			// mustach
			//html_out_secinfo='{{#.}}\n';
		// sequence head table row

		html_out_secdata+=  '<tr>\n';
		html_out_secdata+=  '<td colspan="2" class="center fsize"><img style="height:90px;" src="/images/mapas/mapnorm/{{karteen}}"></img></td>\n';
		html_out_secdata+=  '<td  rowspan="3" class="center fsize" >';

			// sequence body table 
			html_out_secdata+= '<table class="sequencetbl" cellpadding="0" cellspacing="0"  >\n';	
			// sequence body table head
			html_out_secdata+= '<tr>\n';
			html_out_secdata+= '<th class="left team fsize" nowrap="nowrap" ></th>\n';
			html_out_secdata+= '<th class="left fsize" nowrap="nowrap" >Name</th>\n';
			html_out_secdata+= '<th class="left prace fsize">Race</th>\n';
			html_out_secdata+= '<th class="left team fsize">Team</th>\n';
			html_out_secdata+= '</tr>\n';
			// sequence body table rows
			// mustach
			html_out_secdata +='{{#troops}}\n'; 
			player_data = sequence_players;
			for (var ib=0 ; ib < sequence_players.length; ++ib) 
			{
					// player_data[ib]["cpu"]=(player_data['cpu'] == 1 ? 'Yes':'');
					player_data[ib]["skill"] = Math.floor((player_data[ib]['score']*10000/sequence_info['nallTime']));
					// player_data[ib]['wins']=(player_data['wins'] == 1 ? 'win':'');
			}
			// console.log(player_data);
			html_out_secdata+= '<tr class="color{team{{team}}}">\n';
				html_out_secdata+= '<td class="left team fsize">{{#cpu}}*{{/cpu}}</td>\n';
				html_out_secdata+= '<td width=75 nowrap class="left fsize">{{name}}</td>\n';
				html_out_secdata+= '<td class="left fsize">{{race}}</td>\n';
				html_out_secdata+= '<td class="right fsize team{{team}} color{team{{team}}}">{{#wins}}win{{/wins}}</td>\n';			  
				html_out_secdata+= '</tr>\n';	
				html_out_secdata+='{{/troops}}\n'; 
				// html_out+=Mustache.to_html(html_out_troop, player_data);
			html_out_secdata+= '</table>\n';

		html_out_secdata+= '</td></tr>\n';
		html_out_secdata+= '<tr class="">\n';
		html_out_secdata+= '<td class="left team fsize">{{version}}</td><td class="left team fsize">{{gamedate}}</td>\n';
		html_out_secdata+= '</tr>\n';
		html_out_secdata+= '<tr class="">\n';
			html_out_secdata+= '<td class="left team fsize">{{playerCounter}}</td><td class="left team fsize">{{unallTime}}</td>\n';
			html_out_secdata+= '</tr>\n';
			html_out+=Mustache.to_html(html_out_secdata, sequence);
	
		//html_out_secinfo+='{{/.}}\n';
		// console.log(sequence_info);
		html_out+= '</table>\n';
	
} else {		//  sequence head table
	html_out+= '<table cellpadding="0" cellspacing="0" class="sequenceheadtbl" >\n';
		// mustach
		//html_out_secinfo='{{#.}}\n';
	// sequence head table head
	html_out_secinfo= '<tr>\n';
	html_out_secinfo+= '<th rowspan="2" class=\"patch\"><img style="height:50px;" src="/images/mapas/mapnorm/'+sequence_info['karteen']+'"></th>\n';
	html_out_secinfo+= '<th class=\"patch fsize\">Patch</th>\n';
	html_out_secinfo+= '<th class=\"typ fsize\">Players</th>\n';
	html_out_secinfo+= '<th class=\"map fsize\">CPUs</th>\n';
	html_out_secinfo+= '<th class=\"playtime fsize\">Time</th>\n';
	html_out_secinfo+= '<th class=\"playdate fsize\">Date</th>\n';
	html_out_secinfo+= '</tr>\n';
	// sequence head table row

	html_out_secinfo+= '<tr>\n';
	html_out_secinfo+= '<td class="center fsize">{{version}}</td>\n';
	html_out_secinfo+= '<td class="center fsize">{{playerCounter}}</td>\n';
// ADD CPU SKILLS 1= Easy , 2 = Normal , 3 = Hard
	html_out_secinfo+= '<td class="center fsize">{{cpuskill}}</td>\n';
	html_out_secinfo+= '<td class="center fsize">{{unallTime}}</td>\n';
	html_out_secinfo+= '<td class="center fsize">{{gamedate}}</td>\n';
	html_out_secinfo+= '</tr>\n';
	//html_out_secinfo+='{{/.}}\n';
	// console.log(sequence_info);
	
	html_out+=Mustache.to_html(html_out_secinfo, sequence_info);
	html_out+= '</table>\n';

	// sequence body table 
	html_out+= '<table class="sequencetbl fsize" cellpadding="0" cellspacing="0" id="sequencebodytbl" >\n';	
	// sequence body table head
	html_out+= '<tr>\n';
	html_out+= '<th class="left team fsize" nowrap="nowrap" ></th>\n';
	html_out+= '<th class="left pname fsize" nowrap="nowrap" >Name</th>\n';
	if (remastered) {
		html_out+= '<th class="left pname" nowrap="nowrap" >SteamId</th>\n';
	}
	html_out+= '<th class="left prace fsize">Race</th>\n';
	html_out+= '<th class="left team fsize">Team</th>\n';
	html_out+= '<th class="right pkill fsize">Killed</th>\n';
	html_out+= '<th class="right pdead fsize">Dead</th>\n';
	html_out+= '<th class="right pbuild fsize">Build</th>\n';
	html_out+= '<th class="right pscore fsize">Score</th>\n';
	html_out+= '<th class="right pplayer fsize">Wins</th>\n';
			html_out+= '<th class="right pplayer fsize">Skill</th>\n';
	html_out+= '</tr>\n';
	// sequence body table rows
	// mustach
	html_out_troop='{{#.}}\n'; 
	player_data = sequence_players;
	for (var ib=0 ; ib < sequence_players.length; ++ib) 
	{
			// player_data[ib]["cpu"]=(player_data['cpu'] == 1 ? 'Yes':'');
			player_data[ib]["skill"] = Math.floor((player_data[ib]['score']*10000/sequence_info['nallTime']));
			// player_data[ib]['wins']=(player_data['wins'] == 1 ? 'win':'');
	}
	// console.log(player_data);
	html_out_troop+= '<tr>\n';
		html_out_troop+= '<td class="left team fsize">{{#cpu}}*{{/cpu}}</td>\n';
		html_out_troop+= '<td width=125 nowrap class="left fsize">{{name}}</td>\n';
		if (remastered) {
			html_out_troop+= '<td width=125 nowrap class="left fsize">{{steamid}}</td>\n';
		}
		html_out_troop+= '<td class="left fsize">{{race}}</td>\n';
		html_out_troop+= '<td class="right fsize">{{color}}</td>\n';
		html_out_troop+= '<td class="right fsize">{{kills}}</td>\n';
		html_out_troop+= '<td class="right fsize">{{losts}}</td>\n';
		html_out_troop+= '<td class="right fsize">{{train}}</td>\n';
		html_out_troop+= '<td class="right fsize">{{score}}</td>\n';	
		html_out_troop+= '<td class="right  fsize team{{team}} color{{colors}}">{{#wins}}win{{/wins}}</td>\n';			  
		html_out_troop+= '<td class="right fsize ">{{skill}}</td>\n';
		html_out_troop+= '</tr>\n';	
		html_out_troop+='{{/.}}\n'; 
		html_out+=Mustache.to_html(html_out_troop, player_data);
	html_out+= '</table>\n';
}
		html_out+= '</div>\n';
		html_out+= '</div>\n';
		html_out+= '</div>\n';
		return html_out;
	} else {
		return '';
	}
}

// raw
function asequenceraw(asequence,remastered,layout) 
{
if (asequence !== false) {
		/* main sequence data */
		sequence_info = JSON.parse(asequence.dataset);
		sequence = sequence_info; // JSON.parse(asequence.dataset);
		sequence_file = sequence_info.filename;
		sequence_info['download'] = asequence.download;
		sequence_info['ext'] = asequence.ext;
		// console.log(sequence.download);
		// html_out = '<p class="secfilename">'+sequence_file+'</p>';
		html_out = '';
		/* player detail player_datas */
		sequence_players = sequence['troops'];
		/* make version number readable */
		sequence_info['version'] = (sequence_info['exeversion'] == 105 ? '1.05' : (sequence_info['exeversion'] == 104 ? '1.04':(sequence_info['exeversion'] == 103 ? 'Demo':(sequence_info['exeversion'] == 102 ? 'release':'error'))));
		// sequence_info['cpuskill'] = (sequence_info['cpuskill'] == 1 ? 'Easy':(sequence_info['cpuskill'] == 2 ? 'Normal':(sequence_info['cpuskill'] == 3 ? 'Hard':'')));
		sequence_info['unallTime'] = _game_time(sequence_info['nallTime']);
		//
		sequence_info['cpuskill'] = (sequence_info['cpuskill'] == 1 ? 'Easy' : (sequence_info['cpuskill'] == 2 ? 'Medium':(sequence_info['cpuskill'] == 3 ? 'Hard':'')));
		
						// mustach
						html_out_secinfo='{{#.}}\n'; 
if(layout == "widget") {	

		html_out+= '<div style="width:800px; overflow:hidden;">';
		html_out+= '<div class="sequence">\n'
	//	html_out+= '<div style="float:left;"><img style="height:90px;" src="/images/mapas/mapnorm/'+sequence_info['karteen']+'"></div>';
		html_out+= '<div style="display:inline-block">';
} else {
	html_out+= '<div style="width:800px;">';
	html_out+= '<div class="sequence">\n'
	// html_out+= '<div style="display:inline-block"><img style="height:90px;" src="/images/mapas/mapnorm/'+sequence_info['karteen']+'"></div>';
	html_out+= '<div style="display:inline-block">';	
}
if(layout == "widget") {
		//  sequence head table
		var html_out_secdata = "";
		html_out_secdata+= '<table cellpadding="0" cellspacing="0" class="sequenceheadtbl" >\n';
			// mustach
			//html_out_secinfo='{{#.}}\n';
		// sequence head table row

		html_out_secdata+=  '<tr>\n';
		html_out_secdata+=  '<td colspan="2" class="center fsize"><img style="height:90px;" src="/images/mapas/mapnorm/{{karteen}}"></img></td>\n';
		html_out_secdata+=  '<td  rowspan="4" class="center fsize" >';
		html_out_secdata+=  '{{#ram}}Rams<br>{{ram}}{{/ram}}<br> {{#bal}}Ballista<br>{{bal}}{{/bal}}<br>{{#cat}}Catapult<br>{{cat}}{{/cat}}<br>{{#tow}}Tower<br>{{tow}}{{/tow}}';
		html_out_secdata+=  '</td>';
		html_out_secdata+=  '<td  rowspan="4" class="center fsize" >';

			// sequence body table 
			html_out_secdata+= '<table class="sequencetbl" cellpadding="0" cellspacing="0"  >\n';	
			// sequence body table head
			html_out_secdata+= '<tr>\n';
			html_out_secdata+= '<th class="left team fsize" nowrap="nowrap" ></th>\n';
			html_out_secdata+= '<th class="left pname fsize" nowrap="nowrap" >Name</th>\n';
			html_out_secdata+= '<th class="left prace fsize">Race</th>\n';
			html_out_secdata+= '<th class="left team fsize">Team</th>\n';
			html_out_secdata+= '<th class="right pkill">Killed</th>\n';
			html_out_secdata+= '<th class="right pdead">Dead</th>\n';
			html_out_secdata+= '<th class="right pbuild">Build</th>\n';
			html_out_secdata+= '<th class="right pscore">Score</th>\n';
			html_out_secdata+= '<th class="right pplayer">Skill</th>\n';
			html_out_secdata+= '<th class="right pplayer">Wins</th>\n';
			html_out_secdata+= '<th class="right pplayer">saved</th>\n';
			
			html_out_secdata+= '</tr>\n';
			// sequence body table rows
			// mustach
			html_out_secdata +='{{#troops}}\n'; 
			player_data = sequence_players;
			for (var ib=0 ; ib < sequence_players.length; ++ib) 
			{
					// player_data[ib]["cpu"]=(player_data['cpu'] == 1 ? 'Yes':'');
					player_data[ib]["skill"] = Math.floor((player_data[ib]['score']*10000/sequence_info['nallTime']));
					// player_data[ib]['wins']=(player_data['wins'] == 1 ? 'win':'');
			}
			// console.log(player_data);
			html_out_secdata+= '<tr class="color{team{{team}}}">\n';
				html_out_secdata+= '<td class="left team fsize">{{#cpu}}*{{/cpu}}</td>\n';
				html_out_secdata+= '<td width=75 nowrap class="left fsize">{{name}}</td>\n';
				html_out_secdata+= '<td class="left fsize">{{race}}</td>\n';
				html_out_secdata+= '<td class="right fsize color{{color}}"><img src="/images/icons/icon{{team}}.gif"></td>\n';			  
				html_out_secdata+= '<td class="right">{{kills}}</td>\n';
				html_out_secdata+= '<td class="right">{{losts}}</td>\n';
				html_out_secdata+= '<td class="right">{{train}}</td>\n';
				html_out_secdata+= '<td class="right">{{score}}</td>\n';	
				html_out_secdata+= '<td class="right">{{skill}}</td>\n';
				html_out_secdata+= '<td class="right ">{{#wins}}<img src="/images/icons/win{{wins}}.gif">{{/wins}}</td>\n';
				html_out_secdata+= '<td class="right ">{{#saved}}<img src="/images/icons/save{{saved}}.gif">{{/saved}}</td>\n';			  
								
				html_out_secdata+= '</tr>\n';	
				html_out_secdata+='{{/troops}}\n'; 
				// html_out+=Mustache.to_html(html_out_troop, player_data);
			html_out_secdata+= '</table>\n';

		html_out_secdata+= '</td>';
		html_out_secdata+= '<td rowspan="4" class="center fsize">&nbsp;<button class="w3-button  w3-card " ><a href="/download/{{ext}}/{{fileid}}?file={{filename}}">DOWNLOAD</a></button>&nbsp;</td>\n';
		html_out_secdata+= '</tr>\n';
		html_out_secdata+= '<tr class="">\n';
		html_out_secdata+= '<td class="left team fsize">ID:{{fileid}}</td><td class="left team fsize">{{gamedate}}</td>\n';
		html_out_secdata+= '</tr>\n';
		html_out_secdata+= '<tr class="">\n';
			html_out_secdata+= '<td class="left team fsize">DL:{{download}}</td><td class="left team fsize">{{unallTime}}</td>\n';
			html_out_secdata+= '</tr>\n';
			html_out_secdata+= '<tr class="">\n';
			html_out_secdata+= '<td class="left team fsize">{{kategori}}</td><td class="left team fsize">{{#cpuskill}}CPU:{{cpuskill}}{{/cpuskill}}</td>\n';
			html_out_secdata+= '</tr>\n';
			html_out+=Mustache.to_html(html_out_secdata, sequence);
			console.log(sequence);
	
		//html_out_secinfo+='{{/.}}\n';
		// console.log(sequence_info);
		html_out+= '</table>\n';
	
} else {		//  sequence head table
	html_out+= '<table cellpadding="0" cellspacing="0" class="sequenceheadtbl" >\n';
		// mustach
		//html_out_secinfo='{{#.}}\n';
	// sequence head table head
	html_out_secinfo= '<tr>\n';
	html_out_secinfo+= '<th rowspan="2" class=\"patch\"><img style="height:90px;" src="/images/mapas/mapnorm/'+sequence_info['karteen']+'"></th>\n';
	html_out_secinfo+= '<th class=\"patch fsize\">Patch</th>\n';
	html_out_secinfo+= '<th class=\"typ fsize\">Players</th>\n';
	html_out_secinfo+= '<th class=\"map fsize\">CPUs</th>\n';
	html_out_secinfo+= '<th class=\"playtime fsize\">Time</th>\n';
	html_out_secinfo+= '<th class=\"playdate fsize\">Date</th>\n';
	html_out_secinfo+= '</tr>\n';
	// sequence head table row

	html_out_secinfo+= '<tr>\n';
	html_out_secinfo+= '<td class="center fsize">{{version}}</td>\n';
	html_out_secinfo+= '<td class="center fsize">{{playerCounter}}</td>\n';
// ADD CPU SKILLS 1= Easy , 2 = Normal , 3 = Hard
	html_out_secinfo+= '<td class="center fsize">{{cpuskill}}</td>\n';
	html_out_secinfo+= '<td class="center fsize">{{unallTime}}</td>\n';
	html_out_secinfo+= '<td class="center fsize">{{gamedate}}</td>\n';
	html_out_secinfo+= '</tr>\n';
	//html_out_secinfo+='{{/.}}\n';
	// console.log(sequence_info);
	
	html_out+=Mustache.to_html(html_out_secinfo, sequence_info);
	html_out+= '</table>\n';

	// sequence body table 
	html_out+= '<table class="sequencetbl" cellpadding="0" cellspacing="0" id="sequencebodytbl" >\n';	
	// sequence body table head
	html_out+= '<tr>\n';
	html_out+= '<th class="left team fsize" nowrap="nowrap" ></th>\n';
	html_out+= '<th class="left pname fsize" nowrap="nowrap" >Name</th>\n';
	if (remastered) {
		html_out+= '<th class="left pname fsize" nowrap="nowrap" >SteamId</th>\n';
	}
	html_out+= '<th class="left prace fsize">Race</th>\n';
	html_out+= '<th class="left team fsize">Team</th>\n';
	html_out+= '<th class="right pkill fsize">Killed</th>\n';
	html_out+= '<th class="right pdead fsize">Dead</th>\n';
	html_out+= '<th class="right pbuild fsize">Build</th>\n';
	html_out+= '<th class="right pscore fsize">Score</th>\n';
	html_out+= '<th class="right pplayer fsize">Wins</th>\n';
			html_out+= '<th class="right pplayer fsize">Skill</th>\n';
	html_out+= '</tr>\n';
	// sequence body table rows
	// mustach
	html_out_troop='{{#.}}\n'; 
	player_data = sequence_players;
	for (var ib=0 ; ib < sequence_players.length; ++ib) 
	{
			// player_data[ib]["cpu"]=(player_data['cpu'] == 1 ? 'Yes':'');
			player_data[ib]["skill"] = Math.floor((player_data[ib]['score']*10000/sequence_info['nallTime']));
			// player_data[ib]['wins']=(player_data['wins'] == 1 ? 'win':'');
	}
	// console.log(player_data);
	html_out_troop+= '<tr>\n';
		html_out_troop+= '<td class="left team fsize">{{#cpu}}*{{/cpu}}</td>\n';
		html_out_troop+= '<td width=125 nowrap class="left fsize">{{name}}</td>\n';
		if (remastered) {
			html_out_troop+= '<td width=125 nowrap class="left">{{steamid}}</td>\n';
		}
		html_out_troop+= '<td class="left fsize">{{race}}</td>\n';
		html_out_troop+= '<td class="right fsize">{{color}}</td>\n';
		html_out_troop+= '<td class="right fsize">{{kills}}</td>\n';
		html_out_troop+= '<td class="right fsize">{{losts}}</td>\n';
		html_out_troop+= '<td class="right fsize">{{train}}</td>\n';
		html_out_troop+= '<td class="right fsize">{{score}}</td>\n';	
		html_out_troop+= '<td class="right fsize team{{team}} color{{colors}}">{{#wins}}win{{/wins}}</td>\n';			  
		html_out_troop+= '<td class="right fsize">{{skill}}</td>\n';
		html_out_troop+= '</tr>\n';	
		html_out_troop+='{{/.}}\n'; 
		html_out+=Mustache.to_html(html_out_troop, player_data);

	html_out+= '</table>\n';
}
		html_out+= '</div>\n';
		html_out+= '</div>\n';
		html_out+= '</div>\n';
		return html_out;
	} else {
		return '';
	}
}