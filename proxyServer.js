var express = require('express');
var cors = require('cors');
const axios = require('axios');
const { response } = require('express');

var app = express();

app.use(cors());
const API_KEY = "RGAPI-b8f7ddcf-34d0-4b63-910e-212b770c9984";

function getPlayerPUUID(gameName, tagLine) {
    return axios.get(`https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${API_KEY}`)
        .then(function (response) {
        console.log(response.data);
        return response.data.puuid;
    }).catch(err => err);
}

// GET past5Games
// GET localhost:4000/past5Games
app.get('/past5Games', async (req, res) => {
    const userInput = req.query.username;
    //const userInput = "DontGoChasinHM07 #Rach";

    const [gameName, tagLine] = userInput.split('#');
    console.log("gameName: ", gameName);
    console.log("tagLine: ", tagLine);
    
    // PUUID
    const PUUID = await getPlayerPUUID(gameName, tagLine);
    const API_CALL = `https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/${PUUID}/ids?start=0&count=20&api_key=${API_KEY}`;

    const gameIDs = await axios.get(API_CALL)
        .then(response => response.data)
    console.log (gameIDs);

    const matchID = gameIDs[0];
    console.log(matchID);

    var matchDataArray = [];
    for (var i = 0; i < gameIDs.length - 15; i++) {
        const matchID = gameIDs[i];
        const API_MATCH = `https://americas.api.riotgames.com/lol/match/v5/matches/${matchID}?api_key=${API_KEY}`;
        const matchData = await axios.get(API_MATCH)
            .then(response => response.data)
            .catch(err => err)
        matchDataArray.push(matchData);
    }
    res.json(matchDataArray);
})

app.listen(4000, 'localhost', function() {
    console.log("Server started on port 4000");
});