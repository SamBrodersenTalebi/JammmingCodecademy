import React from 'react';
import './App.css';

import SearchBar from '../SearchBar/SearchBar';
import SearchResults from '../SearchResults/SearchResults';
import Playlist from '../Playlist/Playlist';
import Spotify from '../../util/Spotify';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      searchResults:[],
      playlistName:'New TrackList',
      playlistTracks:[]
    };
    this.addTrack = this.addTrack.bind(this);
    this.removeTrack = this.removeTrack.bind(this);
    this.updatePlaylistName = this.updatePlaylistName.bind(this);
    this.savePlaylist = this.savePlaylist.bind(this);
    this.search = this.search.bind(this);
  }

//Use the track's id property to check if the current song is in the playlistTracks state.
//If the id is new, add the song to the end of the playlist. Set the new state of the playlist
  addTrack(track){
    let tracks = this.state.playlistTracks;
    // find method returns the value of the first element in the provided array 
    if (tracks.find(savedTrack => savedTrack.id === track.id )) {
      return;
    }
    //push new track to playlistTrack state if it does not already exist
    tracks.push(track)
    this.setState({playlistTracks: tracks});
  }

//use filter metod to filter track id out of playlistTracks
  removeTrack(track){
    let tracks = this.state.playlistTracks;
    let filter = tracks.filter(removeTrack => removeTrack.id !== track.id);
    this.setState({playlistTracks: tracks});
  }
  //KIG NÆRMERE PÅ REMOVETRACK!

  updatePlaylistName(name){
    this.setState({playlistName:name})
  }

  savePlaylist(){
    let trackURIs = this.state.playlistTracks;
    //push playlist to spotify and reset app.
    Spotify.savePlaylist(this.state.playlistName,trackURIs)
    this.setState({
      playlistName:'New Playlist',
      playlistTracks:[]
    });

  }

  search(searchTerm){
    Spotify.search(searchTerm).then((result)=>{
      this.setState({searchResults:result});
    });
  }

  render(){
    return (
      <div>
        <h1>Ja<span className="highlight">mmm</span>ing</h1>
        <div className="App">
          <SearchBar onSearch = {this.search}/>
          <div className="App-playlist">
          < SearchResults onAdd = {this.addTrack} searchResults={this.state.searchResults}/>
          <Playlist onSave = {this.savePlaylist} onNameChange = {this.updatePlaylistName} onRemove = {this.removeTrack} playlistName = {this.state.playlistName} playlistTracks = {this.state.playlistTracks} />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
