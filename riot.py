import requests

def get_summoner():
    url = "https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/Kafuu%20Cheetoes/petit?api_key=RGAPI-1d81f372-4f3b-49a9-8a09-a87e8bbf8c97"
    response = requests.get(url)
    return response.json()

def get_summoner_data():
    url = "https://na1.api.riotgames.com/lol/league/v4/entries/by-puuid/7ECbIkBbL8CqVKcnQFV1dVHi7EinBw3zdtX76frAuB6Y6bCLPRBL0TyIDiPbdDDo6lGYQMPxrpHeNg?api_key=RGAPI-1d81f372-4f3b-49a9-8a09-a87e8bbf8c97"
    response = requests.get(url)
    return response.json()

def get_match_info():
    url = "https://americas.api.riotgames.com/lol/match/v5/matches/NA1_5316438534?api_key=RGAPI-1d81f372-4f3b-49a9-8a09-a87e8bbf8c97"
    response = requests.get(url)
    return response.json()



x = get_summoner_data()
y = get_summoner()
z = get_match_info()
print(z['info']['participants'][5]["puuid"])
z2 = z['info']['participants']
z1 = [y for y in z2 if y["puuid"] == "7ECbIkBbL8CqVKcnQFV1dVHi7EinBw3zdtX76frAuB6Y6bCLPRBL0TyIDiPbdDDo6lGYQMPxrpHeNg"]
print(z1)
print(y)
# print(x[0])
# 7ECbIkBbL8CqVKcnQFV1dVHi7EinBw3zdtX76frAuB6Y6bCLPRBL0TyIDiPbdDDo6lGYQMPxrpHeNg