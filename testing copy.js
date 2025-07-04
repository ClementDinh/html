function addMatchElement(str, dest) {
  // create a new div element
  const newDiv = document.createElement("div");

  // and give it some content
  const newContent = document.createTextNode(str);

  // add the text node to the newly created div
  newDiv.appendChild(newContent);

  // add the newly created element and its content into the DOM
  const currentDiv = document.getElementById(dest);
  currentDiv.appendChild(newDiv);

  const lb = document.createElement("br");
  currentDiv.appendChild(lb);
}

var api_key = "RGAPI-b44e6975-a7f0-4153-943c-54fd0397aef0"


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
    for(let i = 0; i<20; i++){
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
        
        addMatchElement(participants["kills"] + "/" + participants["deaths"] + "/" + participants["assists"], "match");       
    }
    
}

// show_summoner_stats();
//NA1_5316438534
