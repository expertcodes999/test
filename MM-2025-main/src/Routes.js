import React, { useState, Fragment } from "react";
import { Route, Redirect, useLocation } from "react-router-dom";
import { Helmet } from 'react-helmet'
import Cookies from 'universal-cookie';

import Play from "./pages/Play";
import TransactionHistory from "./pages/TransactionHistory";
import TakStaking from "./pages/TakStaking";
import MonkeyEarning from "./pages/MonkeyEarning";
import ComicBookearnings from "./pages/ComicBookearnings";
import Referral from "./pages/Referral";

import { ToastContainer, toast } from 'react-toastify';
import { useEffect } from 'react';
import {connect} from 'react-redux'
import Sidebar from "./Sidebar";
import Header from "./pages/layouts/Header";
import {setPopUp} from "./actions/gameActions";
import {sendReferralCode} from "./actions/userActions";


import {titleDescriptions} from "./utils/data";

import './Route.scss';
import 'mdbreact/dist/css/mdb.css';
import 'mdb-react-ui-kit/dist/css/mdb.min.css'

const Routes = (props) => {
  const {popup, setPopUp} = props
  const [pageData, setPageData] = useState(titleDescriptions.play)
  const cookies = new Cookies();
  const notify = () => toast.info(popup, {
      position: "top-right",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
  });
  useEffect(() => {
    if (popup !== "") {
        notify();
        setPopUp("")
    }
  }, [popup]);
  const location = useLocation();
  useEffect(async () => {
    //setCurrentPage(location.pathname)
    if(location.pathname.toLowerCase().includes("play")){
      setPageData(titleDescriptions.play)
    }
    else if(location.pathname.toLowerCase().includes("transaction-history")){
      setPageData(titleDescriptions.transactionHistory)
    }
    else if(location.pathname.toLowerCase().includes("tak-stak")){
      setPageData(titleDescriptions.takStaking)
    }
    else if(location.pathname.toLowerCase().includes("monkey-earning")){
      setPageData(titleDescriptions.monkeyEarnings)
    }
    else if(location.pathname.toLowerCase().includes("bookearning")){
      setPageData(titleDescriptions.comicsEarnings)
    }
    const url = new URL(window.location.href);
    const refCode = url.searchParams.get("refCode");
    if(refCode) {
      setRefCookie(refCode)
      await sendReferralCode(refCode)
    }
  }, [location]);
  const setRefCookie = (refCode) => {
    let d = new Date();
    d.setTime(d.getTime() + (24*60*60*1000));
    cookies.set("refCode", refCode, {path: "/", expires: d});
  }
  return (
        <div className="content d-flex">
          <Helmet>
            <title>{pageData.title}</title>
            <meta name="description" content={pageData.description} />
            <meta name="keywords" content={pageData.tags} />
          </Helmet>
          <Header />
          <Sidebar />
          <div
              style={{
                flex: "1 1 auto",
                display: "flex",
                flexFlow: "column",
                overflowX: "hidden",
                overflowY: "scroll",
              }}
            >

              <Route exact path="/"><Redirect to="/play"/></Route>
              <Route path="/play" render={() => <Play /> } />
              <Route path="/transaction-history" render={() => <TransactionHistory /> } />
              <Route path="/tak-stak" render={() => <TakStaking /> } />
              <Route path="/monkey-earning" render={() => <MonkeyEarning /> } />
              <Route path="/bookearning" render={() => <ComicBookearnings /> } />
              <Route path="/referral" render={() => <Referral /> } />
              
          </div>
        </div>
        
  );
};

const mapStateToProps  = (state) => (
  {
    popup: state.betGameData.popup
  }
)
export default connect(mapStateToProps, {setPopUp})(Routes)
