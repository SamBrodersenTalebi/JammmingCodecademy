import React from 'react';
import './SearchBar.css';

class SearchBar extends React.Component{
  constructor(props){
    super(props);
    this.state = {searchTerm:''};
    this.search = this.search.bind(this);
    this.handleTermChange = this.handleTermChange.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  search(){
    this.props.onSearch(this.state.searchTerm)
  }

  handleTermChange(event){
    this.setState({searchTerm: event.target.value});
  }

  onKeyPress(event){
    //Number 13 is the Enter key on the keyboard
    if (event.keyCode === 13){
      /*when the enter is pressed on the key keyboard
        onKeyPress will pass the state of the term to this.props.onSearch*/
      this.props.onSearch(this.state.searchTerm);
    }
  }


  render(){
    return(
      <div className="SearchBar">
        <input onKeyPress = {this.onKeyPress} onChange = {this.handleTermChange} placeholder="Enter A Song, Album, or Artist" />
        <a onClick={this.search}>SEARCH</a>
      </div>
    );

  }
}


export default SearchBar;
