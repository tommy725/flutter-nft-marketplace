import React from "react"
import { Routes, Route } from 'react-router-dom'

import axios from 'axios'
import "bootstrap/dist/css/bootstrap.min.css"

import CreateItem from "./components/create/CreateItem"
import CheckRawData from "./components/check/CheckRawData"
import ItemDetail from './components/home/ItemDetail'

import Home from "./components/home/Home"
import Search from "./components/search/Search"
import Profile from "./components/profile/Profile"
import Login from './components/Login'
import LoginError from './components/LoginError'

import NavigationBar from './components/NavigationBar'
import Footer from './components/Footer'
import Error from './components/Error'

import Web3 from "web3"
import detectEthereumProvider from '@metamask/detect-provider'

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      keywords: '',
      isLogin: 'false',
      account: { _id: '0x0000000000000000000000000000000000000000' },
    }
  }

  componentDidMount = async () => {
    // Get network provider and web3 instance.
    const web3 = new Web3(process.env.REACT_APP_INFURA_HTTP_ENDPOINT)

    // check logged in status form local storage
    const isLogin = await localStorage.getItem('isLogin');
    this.setState({ web3, isLogin })
    if (isLogin === 'true') this.login()
  }

  login = async () => {
    try {
      // connect with metamask provider
      const provider = await detectEthereumProvider()

      // Use new web3 to connect with metamask provider
      const web3 = new Web3(window.ethereum)

      axios
        .post(`${process.env.REACT_APP_HTTP_SERVER_ENDPOINT}/account`, {
          _id: (await provider.request({ method: 'eth_requestAccounts' }))[0].toLowerCase()
        })
        .then(res => {

          this.setState({ account: res.data, isLogin: 'true', web3: web3 })
          localStorage.setItem('isLogin', 'true');
        })
        .catch(error => console.error(error))

      //  handle when account changed
      provider.on('accountsChanged', async () => {
        axios
          .post(`${process.env.REACT_APP_HTTP_SERVER_ENDPOINT}/account`, {
            _id: (await provider.request({ method: 'eth_requestAccounts' }))[0].toLowerCase()
          })
          .then(res => this.setState({ account: res.data }))
          .catch(error => console.error(error))
      })

      return true
    }
    catch (error) {
      console.error(error)
      // return is error for login component
      return false
    }
  }

  logout = () => {
    localStorage.setItem('isLogin', 'false');
    this.setState({ account: { _id: '0x0000000000000000000000000000000000000000' }, isLogin: 'false' })
  }

  handleKeywordsChange = (keywords) => {
    this.setState({ keywords: keywords })
  }

  render() {
    return (
      <>
        <NavigationBar account={this.state.account} handleKeywordsChange={this.handleKeywordsChange} logout={this.logout} isLogin={this.state.isLogin} />
        <div className="container mt-5 py-5 " style={{ minHeight: '75vh' }}>
          <Routes>
            <Route
              exact
              path="/"
              element={
                <Home
                  account={this.state.account}
                  web3={this.state.web3}
                />
              }
            />
            <Route
              path="/create"
              element={
                <CreateItem
                  account={this.state.account}
                  web3={this.state.web3}
                />
              }
            />
            <Route
              path="/profile"
              element={
                (this.state.account._id !== '0x0000000000000000000000000000000000000000')
                  ? <Profile
                    account={this.state.account}
                    web3={this.state.web3}
                  />
                  : <Login login={this.login} />
              }
            />
            <Route
              path="/login"
              element={
                <Login login={this.login} />
              }
            />
            <Route
              path="/login_error"
              element={
                <LoginError login={this.login} />
              }
            />
            <Route
              path="/checkrawdata"
              element={
                <CheckRawData web3={this.state.web3} />
              }
            />
            <Route
              path="/item/:itemAddress"
              element={
                <ItemDetail
                  web3={this.state.web3}
                  account={this.state.account}
                />
              }
            />
            <Route
              path="/search"
              element={
                <Search keywords={this.state.keywords} />
              }
            />
            <Route path="*" element={<Error />} />
          </Routes>
        </div>

        <Footer contractAddress={
          process.env.REACT_APP_ITEM_MANAGER_ADDRESS
          || "process.env.REACT_APP_ITEM_MANAGER_ADDRESS not found!"
        } />
      </>
    )
  }
}


export default App