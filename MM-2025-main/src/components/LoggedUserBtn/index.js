import React, { useState, useRef, useEffect } from "react";
import { FiLogOut } from 'react-icons/fi';
import { useWeb3React } from "@web3-react/core";
import { withRouter } from "react-router-dom";

import "./index.scss";

const LoggedUserBtn = (props) => {
    const {userName, walletAddress, history, isOnSideBar} = props
    const { deactivate } = useWeb3React();

    useEffect(() => {
        
    }, []);
  let timeout;
  const [onContainer, setOnContainer] = useState(false);
  const [onBtn, setOnBtn] = useState(false);

  const showTip = () => {
    timeout = setTimeout(() => {
      setOnContainer(true);
    }, props.delay || 0);
  };

  const hideTip = () => {
    clearInterval(timeout);
    setOnContainer(false);
  };

  const enterTip = () => {
    timeout = setTimeout(() => {
      setOnBtn(true);
    }, props.delay || 0);
  };

  const leaveTip = () => {
    clearInterval(timeout);
    setOnBtn(false);
  };

  const clickLogoutBtn = () => {
    deactivate()

    history.push('/play')
    // Redirect to logout.php
    window.location.replace("/logout.php");
    window.location.replace("/play");
  }
  return (
    <div style={{padding:"0 20px"}} className="logged-user-btn purple border-0 wallet-address"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}>
        {/*<button className="purple border-0 mt-1 wallet-address" >
        {`${walletAddress.substring(0, 8)}...${walletAddress.slice(-4)}`}
          <p className="username">
          {userName}
          </p>
  </button>*/}
        {isOnSideBar ? `${walletAddress.substring(0, 10)}...${walletAddress.slice(-8)}` : `${walletAddress.substring(0, 5)}...${walletAddress.slice(-3)}`}
          <p className="username">
            {userName}
          </p>
        {
          (onContainer || onBtn) && !isOnSideBar &&
          <a href="./logout.php" onClick={clickLogoutBtn} className="logout-btn" onMouseEnter={enterTip}
            onMouseLeave={leaveTip}>
            <FiLogOut/>
            <p>Logout</p>
          </a>
        }
    </div>
  );
};

export default withRouter(LoggedUserBtn);
