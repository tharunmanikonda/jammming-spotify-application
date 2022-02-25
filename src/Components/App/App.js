// import logo from './logo.svg';
import React from 'react';
import { SearchResults } from '../SearchResults/SearchResults';
import { Playlist } from '../Playlist/Playlist';
import { SearchBar } from '../SearchBar/SearchBar';
import './App.css';
import Spotify from '../../util/Spotify';

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {searchResults :[],
  PlaylistName :'playlistname',
  PlaylistTracks:[]

  }
  this.addTrack = this.addTrack.bind(this);
  this.removeTrack = this.removeTrack.bind(this);
  this.updatePlaylistName = this.updatePlaylistName.bind(this);
  this.savePlaylist = this.savePlaylist.bind(this); 
  this.search = this.search.bind(this); 
}
  addTrack(track) {
    let tracks = this.state.PlaylistTracks;
    if (tracks.find(savedTrack => savedTrack.id === track.id)){
      return;
    }
    tracks.push(track);
    this.setState({PlaylistTracks:tracks});
    
  }
  removeTrack(track){
    let tracks = this.state.PlaylistTracks;
    tracks = tracks.filter(currentTrack => currentTrack.id !== track.id);
    this.setState({PlaylistTracks:tracks})
  
  }
  updatePlaylistName(name){
    this.setState({PlaylistName:name});

  }
  savePlaylist() {
    debugger
    const trackUris = this.state.PlaylistTracks.map(track => track.uri);
    Spotify.savePlaylist(this.state.PlaylistName, trackUris).then(() => {
      this.setState({
        playlistName: 'New Playlist',
        playlistTracks: []
      });
    });
  }
  // savePlaylist(){
  //   const tracksUris = this.props.PlaylistTracks.map(track => {
  //     return track.uri;
  //   });
  //   Spotify.savePlaylist(this.state.PlaylistName,tracksUris).then(()=>{
  //   this.setState({
  //     playlistname : 'New Playlist',
  //     PlaylistTracks: []
  //   })
  //   })
  // }
  search(term){
    Spotify.search(term).then(searchResults =>{
      this.setState({
        searchResults:searchResults
      })
    });
  }

  render() {
    return (
    <div>
  <h1>Ja<span className="highlight">mmm</span>ing</h1>
  <div className="App">
    <SearchBar onSearch = {this.search}/>
    <div className="App-playlist">
      <SearchResults searchResults = {this.state.searchResults} onAdd = {this.addTrack}/>
      <Playlist playlistname = {this.state.PlaylistName} Playlisttracks = {this.state.PlaylistTracks} 
      onRemove = {this.removeTrack} onNameChange = {this.updatePlaylistName} 
      onSave = {this.savePlaylist}/>
    </div>
  </div>
</div>
  );
}
}

export default App;
