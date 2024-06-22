import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [searchText, setSearchText] = useState("");
  const [gameList, setGameList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function getPlayerGames() {
    setLoading(true);
    axios.get("http://localhost:4000/past5Games", { params: { username: searchText } })
      .then(function (response) {
        setGameList(response.data);
        setLoading(false);
        setError(null);
      }).catch(function (error) {
        setError("An error occurred. Please try again later.");
        setLoading(false);
        console.log(error);
      });
  }

  function correctChampionNames(data) {
    return data.map((gameData) => {
      const updatedParticipants = gameData.info.participants.map((participant) => {
        return {
          ...participant,
          championName: participant.championName.replace('FiddleSticks', 'Fiddlesticks'), // Case correction
        };
      });
      return {
        ...gameData,
        info: {
          ...gameData.info,
          participants: updatedParticipants,
        },
      };
    });
  }

  function formatGameDuration(duration) {
    const minutes = Math.floor(duration / 60);
    const seconds = duration % 60;
    return `${minutes} min ${seconds} sec`;
  }
  

  return (
    <div className="App">
      <h2>Match Nexus</h2>
      <input type="text" placeHolder="Enter SummonerName #TagLine" onChange={e => setSearchText(e.target.value)}></input>
      <button onClick={getPlayerGames}>Search Summoner</button>
      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}
      {gameList.length !== 0 ?
        <>
          <p>We have data!</p>
          {gameList.map((gameData, index) => (
            <div key={index}>
              <h2>Game {index + 1} - Game Mode: {gameData.info.gameMode}</h2>
              <p>Game Duration: {formatGameDuration(gameData.info.gameDuration)}</p>
              <div className="table-container">
                <table key={`first-${index}`} className={`first-table ${gameData.info.participants[0].win ? 'winner' : 'loser'}`}><thead>
                    <tr>
                      <th>Player</th>
                      <th>Champion</th>
                      <th>Kills</th>
                      <th>Deaths</th>
                      <th>Assists</th>
                      <th>K/D/A</th>
                      <th>Damage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameData.info.participants.slice(0, 5).map((data, participantIndex) => (
                      <tr key={`${index}-${participantIndex}`}>
                        <td>{data.riotIdGameName} #{data.riotIdTagline}</td>
                        <td>
                          <img className="champion-img" src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${data.championName}.png`} alt={data.championName} title={data.championName} />
                        </td>
                        <td>{data.kills}</td>
                        <td>{data.deaths}</td>
                        <td>{data.assists}</td>
                        <td>{data.challenges.kda.toFixed(2)}</td>
                        <td>{data.totalDamageDealtToChampions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <table key={`last-${index}`} className={`last-table ${gameData.info.participants[5].win ? 'winner' : 'loser'}`}><thead>
                    <tr>
                      <th>Player</th>
                      <th>Champion</th>
                      <th>Kills</th>
                      <th>Deaths</th>
                      <th>Assists</th>
                      <th>K/D/A</th>
                      <th>Damage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {gameData.info.participants.slice(5).map((data, participantIndex) => (
                      <tr key={`${index}-${participantIndex}`}>
                        <td>{data.riotIdGameName} #{data.riotIdTagline}</td>
                        <td>
                          <img className="champion-img" src={`https://ddragon.leagueoflegends.com/cdn/14.6.1/img/champion/${data.championName}.png`} alt={data.championName} title={data.championName} />
                        </td>
                        <td>{data.kills}</td>
                        <td>{data.deaths}</td>
                        <td>{data.assists}</td>
                        <td>{data.challenges.kda.toFixed(2)}</td>
                        <td>{data.totalDamageDealtToChampions}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </>
        :
        <>
          {loading ? null : <p>We have no data</p>}
        </>
      }
    </div>
  );
}

export default App;
