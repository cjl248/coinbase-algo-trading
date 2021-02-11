import React from 'react'
import './App.scss';

import SideMenuContainer from './components/SideMenuContainer.jsx'
import MainContainer from './components/MainContainer.jsx'

class App extends React.Component {

  state = {
    activePage: 'home',
    activeSection: 'h',
  }

  setActivePage = (page, section='h') => {
    this.setState({
      activePage: page,
      activeSection: section
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
          activePage={this.state.activePage}
          activeSection={this.state.activeSection}
          setActivePage={this.setActivePage}>
        </MainContainer>
      </div>
    );
  }
}

export default App;
