import React from 'react'
import './App.scss';

// import Header from './components/header/Header.jsx'
// import Body from './components/body/Body.jsx'

import SideMenuContainer from './components/SideMenuContainer.jsx'
import MainContainer from './components/MainContainer.jsx'

class App extends React.Component {

  state = {
    activePage: 'prices'
  }

  setActivePage = (page) => {
    this.setState({
      activePage: page
    })
  }

  render() {
    return (
      <div className="app">
        {/*
        <Header></Header>
        <Body></Body>
        */}
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
