const clientId = '73bcf6dd2a6944abb1d995b7d1516d63';
const redirectUri = "http://localhost:3000";

let accessToken;
const Spotify = {
    getAcessToken(){
        if(accessToken){
            return accessToken;
        }
        const accesstokenMatch = window.location.href.match(/access_token=([^&]*)/);
        
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/);
        if (accesstokenMatch && expiresInMatch){
            accessToken = accesstokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            window.setTimeout(() =>accessToken = '',expiresIn * 1000);
            window.history.pushState('Access Token',null,'/');
            return accessToken;
        }
        else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }
    },
    search(term){
        const accessToken = Spotify.getAcessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${term}`,
        {Headers:{
            Authorization: `Bearer ${accessToken}`
        }}).then(Response => {
            return Response.json();
        }).then(jsonResponse => {
            if (!jsonResponse.tracks){
                return [];
            }
            return jsonResponse.tracks.items.map(track =>({
                id:track.id,
                name: track.name,
                artist: track.artist[0].name,
                album: track.album.name,
                uri:track.uri
            }));
        })
    },
    savePlaylist(name,trackUris){
        if(!name || !trackUris.length){
            return;
        }
        const accessToken = Spotify.getAcessToken();
        const headers = {Authorization:`Bearer ${accessToken}`};
        let userId;

        return fetch('https://api.spotify.com/v1/me',{headers: headers}
        ).then(Response => Response.json()
        ).then(jsonResponse =>{
            userId = jsonResponse.id;
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`,
            {
                headers:headers,
                method:'POST',
                body:JSON.stringify({name:name})
            }
            ).then(Response =>Response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id;
                return fetch(`https://api.spotify.com//v1/users/${userId}/playlists/${playlistId}/tracks
                `,{
                    headers:headers,
                    method:'POST',
                    body:JSON.stringify({
                      uris:trackUris})
                })
            })

        })
    } 
}
export default Spotify;