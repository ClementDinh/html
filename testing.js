function addMatch(win, champion,kda,cs,gold,minutes,date, dest) {
    const match = document.createElement("div");
    let outcome = "loss";
    if(win){
        outcome = "win"
    }
    match.classList.add("match_" + outcome);

    const ratio = (kda[0]+kda[2])/kda[1];
    let kda_bin = document.createElement("span");
    kda_bin.classList.add("stat","kda");
    kda_text = document.createTextNode(kda[0] + "/" + kda[1] + "/" + kda[2]);
    kda_bin.appendChild(kda_text);
    let border_color = "rgb(150, 150, 150)"
    if(kda[1] == 0 || ratio>10){
        border_color =  "rgb(191, 0, 255)";
    }
    else if(ratio>=6 && ratio<10){
        border_color = "rgb(0, 68, 255)"
    }
    else if(ratio>=3 && ratio<6){
        border_color = "rgb(89, 255, 0)"
    }
    else if(ratio>=1 && ratio<3){
        border_color = "rgb(255, 191, 0)"
    }
    kda_bin.setAttribute("style", "border-color: " + border_color +";");
    match.appendChild(kda_bin);

    const cs_rate = cs/minutes;
    let cs_bin = document.createElement("span");
    cs_bin.classList.add("stat","cs");
    cs_text = document.createTextNode(cs);
    cs_bin.appendChild(cs_text);
    if(cs_rate>=10){
        border_color =  "rgb(191, 0, 255)";
    }
    else if(cs_rate>=8 && cs_rate<10){
        border_color = "rgb(0, 68, 255)"
    }
    else if(cs_rate>=6 && cs_rate<8){
        border_color = "rgb(89, 255, 0)"
    }
    else if(cs_rate>=4 && cs_rate<6){
        border_color = "rgb(255, 191, 0)"
    }
    cs_bin.setAttribute("style", "border-color: " + border_color +";");
    match.appendChild(cs_bin);
    

    gold = Math.round(gold/100)/10
    let gold_bin = document.createElement("span");
    gold_bin.classList.add("stat","gold");
    gold_text = document.createTextNode(gold+ "k");
    gold_bin.appendChild(gold_text);
    match.appendChild(gold_bin);

    const stats = ["kda", "cs", "gold"];
    
    for(let i = 0; i<stats.length; i++){
        const icon = document.createElement("img");
        icon.setAttribute("src", stats[i]+".png");
        icon.classList.add(stats[i]+"_icon");
        match.appendChild(icon);
    }
     

    if(ratio>5 && cs/minutes >0.8){
        const sticker = document.createElement("img");
        sticker.setAttribute("src", "sticker.png");
        sticker.classList.add("sticker");
        match.appendChild(sticker);
    }


    const splash = document.createElement("img");
    const splash_url = "https://ddragon.leagueoflegends.com/cdn/img/champion/splash/"+ champion + "_0.jpg"
    splash.setAttribute("src", splash_url);
    splash.classList.add("splash");
    match.appendChild(splash);

    const currentDiv = document.getElementById(dest);
    currentDiv.appendChild(match);
    
}

var api_key = 


async function get_summoner_info(){
    let gameName = document.getElementById("gameName").value;
    gameName = gameName.replace(" ", "%20");
    let tagline = document.getElementById("tagline").value;
    let puuid;
    let url = "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/" + gameName + "/" + tagline + "?api_key=" + api_key
    
    data = await fetch(url)
        .then(response => {
            if (response.ok){
                console.log("Successfully retrieved summoner data.")
                return response.json();
            }
            else{
                throw new Error("Please check if the information is correct.");
            }
        }).catch(error => document.getElementById("summoner").innerText = error);
    
    return data;
}

async function get_match_info(match_id){
    match_info_url = "https://americas.api.riotgames.com/lol/match/v5/matches/" + match_id + "?api_key=" + api_key;
      data = await fetch(match_info_url)
        .then(response => {
            if (response.ok){
                console.log("Successfully retrieved match info.")
                return response.json();
            }
            else{
                throw new Error("Cannot access match.");
            }
        }).catch(error => document.getElementById("match").innerText = error);
    
    return data;
}

async function show_summoner_stats(){
    document.getElementById("match").style.display = "none"
    document.getElementById("match").innerHTML = "";
    let summoner_info = await get_summoner_info();
    puuid = summoner_info["puuid"];

    url = "https://na1.api.riotgames.com/lol/league/v4/entries/by-puuid/"+ puuid + "?api_key=" + api_key;
 
    let summoner_stats = await fetch(url)
        .then(response => {
            if (response.ok){
                console.log("Successfully retrieved league entries data.")
                return response.json();
            }
            else{
                throw new Error("Please check if the puuid is correct.");
            }
        }).catch(error => console.log("There was a problem with the fetch operation:", error));

    let wins = summoner_stats[1]["wins"];
    let losses = summoner_stats[1]["losses"];
    
    

    
    
    let match_url = "https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?start=0&count=20&api_key=" + api_key;
    let match_ids = await fetch(match_url)
        .then(response => {
            if (response.ok){
                console.log("Successfully retrieved match ids.")
                return response.json();
            }
            else{
                throw new Error("Please check if the puuid is correct.");
            }
        }).catch(error => console.log("There was a problem with the fetch operation:", error));
    
   

    document.getElementById("summoner").innerText = "Summoner: " + summoner_info["gameName"] + " #" + summoner_info["tagLine"];
    document.getElementById("rank").innerText = "Rank: " + summoner_stats[1]["tier"] + " " + summoner_stats[1]["rank"] + " " + summoner_stats[1]["leaguePoints"] + " LP";
    document.getElementById("wr").innerText = Math.round((wins/(wins+losses))*100) + "% WR";

    for(let i = 0; i<match_ids.length; i++){
        
        let match_info = await get_match_info(match_ids[i]);
        participants = match_info['info']['participants']
        let team = match_info['info']['teams'][0];
        for(let i = 0; i <10; i++){
            if(participants[i]["puuid"] == puuid){
                participants = participants[i];
                if(i>=5){
                    team = match_info['info']['teams'][1];
                }
                break;
            }
        }
   
        let date = match_info['info']['gameStartTimestamp'];
        date = new Date(date);
   
        if(date.getHours() > 12){
            document.getElementById("match").innerHTML+= date.getMonth() + "/" + date.getDate() + "/" + (date.getFullYear()-2000) + " " + (date.getHours()-12) + ":" + (date.getMinutes()<10 ? '0' : '') + date.getMinutes() + " PM";
        }
        else if(date.getHours() == 0){
            document.getElementById("match").innerHTML+= date.getMonth() + "/" + date.getDate() + "/" + (date.getFullYear()-2000) + " " + (date.getHours()+12) + ":" + (date.getMinutes()<10 ? '0' : '') + date.getMinutes() + " AM";
        }
        else{
            document.getElementById("match").innerHTML+= date.getMonth() + "/" + date.getDate() + "/" + (date.getFullYear()-2000) + " " + date.getHours() + ":" + (date.getMinutes()<10 ? '0' : '') + date.getMinutes() + " AM";
        }
        // console.log(participants["championId"], participants["championName"])
        const kda = [participants["kills"], participants["deaths"], participants["assists"]];
        const minutes = match_info['info']['gameDuration']/60
    
        const cs = participants['totalMinionsKilled'] + participants["neutralMinionsKilled"];
        addMatch(participants["win"], participants["championName"], kda, cs, participants["goldEarned"], minutes,2, "match");       
    }
    //participants['totalAllyJungleMinionsKilled'] + participants['totalEnemyJungleMinionsKilled']
    // addMatch("hi", "match");       
    document.getElementById("match").removeAttribute("style")
}

// show_summoner_stats();
//NA1_5316438534

