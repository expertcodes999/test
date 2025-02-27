import React, {useEffect} from 'react';
import Routes from './Routes';
import './App.css';
import './base.scss';
import './assets/font/Nurom-Bold.ttf';
import './assets/font/Poppins-Medium.ttf';
import './assets/font/Poppins-SemiBold.ttf';
import store from './store'
import { useState } from "react";
import {Provider} from 'react-redux';
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from "@ethersproject/providers";
import { BrowserRouter } from "react-router-dom";
import Favicon from 'react-favicon'

import desktopFavicon from './assets/images/favicons/desktop.png'; 
import mobileFavicon from './assets/images/favicons/mobile.png'; 
import AccountManager from './components/AccountManager'
import ModalController from './components/ModalController'

//import DailyBonusPopup from './components/DailyBonusPopup'
import { detectMob } from './utils/globalActions';
import axios from 'axios';
import {serverUrl} from './utils/constant'

/* axios defaults */
axios.defaults.withCredentials = true;
axios.defaults.crossDomain = true;
axios.defaults.baseURL = serverUrl;


function getLibrary(provider) {
  return new Web3Provider(provider);
}

function App() {
  document.title = "Mooning Monkey"
  const [isMobile, setIsMobile] = useState(false)
  useEffect(async () => {
    console.log("~~~~~redraw app")
    setIsMobile(detectMob());
  }, [])
  const cleareAllInterval = () => {
    
    const interval_id = window.setInterval(function(){}, Number.MAX_SAFE_INTEGER);

    // Clear any timeout/interval up to that id
    for (let i = 1; i < interval_id; i++) {
      window.clearInterval(i);
    }

  }
  return (
    <div>
      <Favicon url={isMobile ? desktopFavicon : desktopFavicon} />
      
      <Provider store={store}>
        
          <Web3ReactProvider getLibrary={getLibrary}>
            <BrowserRouter>
              <Routes/>
              <AccountManager/>
              <ModalController/>
            </BrowserRouter>
          </Web3ReactProvider>
        
      </Provider>
    </div>
  );
}

export default App;
