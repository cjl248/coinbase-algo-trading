import React from 'react'
import './App.scss';

import SideMenuContainer from './components/SideMenuContainer.jsx'
import MainContainer from './components/MainContainer.jsx'

class App extends React.Component {

  state = {
    activePage: 'home'
  }

  setActivePage = (page) => {
    this.setState({
      activePage: page
    })
  }

  render() {
    return (
      <div className="app">
        <SideMenuContainer
          activePage={this.state.activePage}
          setActivePage={this.setActivePage}>
        </SideMenuContainer>
        <MainContainer
          activePage={this.state.activePage}>
        </MainContainer>
      </div>
    );
  }
}

export default App;
