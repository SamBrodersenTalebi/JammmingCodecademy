//register app using the Spotify application registration flow!
const clientId = "aff1209174bf4e879941f7fb55e7ae06"
const redirectURI = "http://localhost:3000/";
let accessToken;

let Spotify = {
    getAccessToken(){
        if(accessToken){
            return accessToken;
        }

        const GetAccessToken = window.location.href.match(/access_token=([^&]*)/);
        const GetExpirationDate = window.location.href.match(/expires_in=([^&]*)/);
        if(GetAccessToken && GetExpirationDate){
            //set access token value
            accessToken = GetAccessToken[1];
            //variable for expiration time
            const expiresIn = Number(GetExpirationDate[1]);
            //access token expire at the value for expiration time
            window.setTimeout(() => accessToken = '', expiresIn * 1000);
            //wipe access token and URL parameters
            window.history.pushState('Access Token', null, '/');
            return accessToken;
        }else{
            const url = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectURI}`;
            window.location = url;
        }
    },

    search(searchTerm){
        const accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchTerm}`, {
            headers: {Authorization: `Bearer ${accessToken}`}
          }).then( (response)=>{
            if(response.ok){
                return response.json();
            }
          }
          ).then( (data) =>{
              if(data.tracks){
                  return data.tracks.items.map((track)=>({
                      id:track.id,
                      name: track.name,
                      artist: track.artists[0].name,
                      album: track.album.name,
                      uri: track.uri
                  }));
              }else{
                  return [];
              }
          });
    },

    savePlaylist(name, trackURIs){
        if(name && trackURIs.length == 0){
            const accessToken = Spotify.getAccessToken();
            const headers = {Authorization: `Bearer ${accessToken}`};
            let userId;
            return fetch('https://api.spotify.com/v1/me',{headers: headers}).then(
                (response)=>{
                    if(response.ok){
                        return response.json();
                    }
                }
            ).then((data)=>{
                const userId = data.id;
                //Use the returned user ID to make a POST request that creates a new playlist in the user's account and returns a playlist ID
                return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,{
                    method: 'POST',
                    body: JSON.stringify({name:name}),
                    headers: headers
                }).then((response)=>{
                    if(response.ok){
                        return response.json();
                    }
                }).then((data)=>{
                    const playlistId = data.id;
                    //Use the returned user ID to make a POST request that creates a new playlist in the user's account and returns a playlist ID.
                    return fetch(`https://api.spotify.com//v1/users/${userId}/playlists/${playlistId}/tracks`, {
                        method: 'POST',
                        body: JSON.stringify({name:name}),
                        headers: headers
                    });

                });
            });

        }else{
            return;
        }

    }
};

export default Spotify;