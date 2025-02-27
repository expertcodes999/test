import React, { useState, useEffect, useRef } from "react";
import {
  CDBSidebar,
  CDBSidebarContent,
  CDBSidebarFooter,
  CDBSidebarHeader,
  CDBSidebarMenu,
  CDBSidebarMenuItem,
} from "cdbreact";
import { NavLink, withRouter, useLocation } from "react-router-dom";
import {
  AiOutlineDoubleRight,
  AiOutlineDoubleLeft,
  AiFillTwitterCircle,
} from "react-icons/ai";
import { BsPlay, BsMenuButton, BsDiscord } from "react-icons/bs";
import { BiTransferAlt, BiStar, BiPencil } from "react-icons/bi";
import { useMediaQuery } from "react-responsive";

import {
  SiSurveymonkey,
  SiLinktree,
  SiNotion,
  SiTwitter,
} from "react-icons/si";
import { GiReceiveMoney, GiTrophyCup, GiSailboat } from "react-icons/gi";
import { FiUsers } from "react-icons/fi";
import { GrDocumentText } from "react-icons/gr";
import { CgFileDocument } from "react-icons/cg";
import { FaDove, FaAngleDoubleLeft, FaAngleDoubleRight } from "react-icons/fa";
import { RiHome2Fill } from "react-icons/ri";
import { connect } from "react-redux";
import { useWeb3React } from "@web3-react/core";
import { FiLogOut } from "react-icons/fi";

import BankrollModal from "./components/BanrollModal";
import WalletConnectBtn from "./components/WalletConnectBtn";

import DepositModal from "./components/DepositModal";
import WithdrawModal from "./components/WIthdrawModal";
import Cell from "./pages/layouts/Sidebar/Cell.js";
import "./Sidebar.scss";
import darkLogo from "./assets/images/playpage/dark-logo.png";
import RaribleLogo from "./assets/images/rarible.svg";
import Earnings from "./assets/images/sidebar/earnings-blue.png";
import Bankroll from "./assets/images/sidebar/bankroll-blue.png";
import Cashback from "./assets/images/sidebar/cashback-blue.png";
import ComicBook from "./assets/images/sidebar/comic_book-blue.png";
import Referral from "./assets/images/sidebar/referral.png";
import { changeCurrentPage } from "./actions/userActions";
import {
  showStatsModal,
  showLeaderboardModal,
  showLoginModal,
  showHelpModal,
  showDailyBonusModal,
} from "./actions/gameActions";
import { setPopUp } from "./actions/gameActions";
import { nextVersion } from "./utils/constant";
import LoggedUserBtn from "./components/LoggedUserBtn";
import LuckySpin from "./assets/images/lucky_spin.png";

const Sidebar = (props) => {
  const {
    changeCurrentPage,
    logged,
    useChainData,
    currentChainId,
    showStatsModal,
    showLeaderboardModal,
    showLoginModal,
    showHelpModal,
    showDailyBonusModal,
  } = props;
  const { active, account, library, chainId, connector, activate, deactivate } =
    useWeb3React();
  const burgerRef = useRef(null);
  const modalContentRef = useRef(null);
  const [bankrollStatus, setBankrollStatus] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("");
  const [isSidebarShow, setSidebarShow] = useState(false);
  // const [isMobile, setIsMobile] = useState(false)

  const setPage = (targetPage) => {
    changeCurrentPage(targetPage);
  };
  const location = useLocation();
  const isMobile = useMediaQuery({ query: "(max-width: 1200px)" });
  useEffect(() => {
    console.log("~~url", location.pathname);
    setCurrentPage(location.pathname);
  }, [location]);
  const clickStatsBtn = () => {
    showStatsModal();
  };

  const handleOutsideClick = (e) => {
    if (
      (modalContentRef.current &&
        modalContentRef.current?.contains(e.target)) ||
      window.innerWidth > 1200
    ) {
      return;
    }

    // burgerRef.current.classList.remove("left-sidebar-show");
    setSidebarShow(false);
  };

  useEffect(() => {

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  });

  function handleWindowSizeChange() {
    if (window.innerWidth < 1200) {
      // modalContentRef.current.classList.remove("toggled")
      // console.log(modalContentRef.current.classList.contains("toggled"));
      modalContentRef.current.classList.remove("toggled");
    }
  }
  useEffect(() => {
    window.addEventListener("resize", handleWindowSizeChange);
    return () => {
      window.removeEventListener("resize", handleWindowSizeChange);
    };
  }, []);
  useEffect(() => {

    if (window.innerWidth < 1200) {
      // modalContentRef.current.classList.remove("toggled")
      // console.log(modalContentRef.current.classList.contains("toggled"));
      modalContentRef.current.classList.remove("toggled");
    }
  }, [isSidebarShow]);
  return (
    <>
      <div
        className="app left-sidebar"
        style={{ display: "flex", height: "100%", overflow: "scroll initial" }}
      >
        <div className="sidebar-mask" />
        {isMobile ? 
          <>
            <CDBSidebarHeader className="display-button">
              <div className="icon">
                {/* <FaAngleDoubleRight className="right-icon oc-icon"/> */}
                {isSidebarShow ? (
                  <FaAngleDoubleLeft
                    className="left-icon oc-icon"
                    onClick={() => setSidebarShow(false)}
                  />
                ) : (
                  <FaAngleDoubleRight
                    className="right-icon oc-icon"
                    onClick={() => setSidebarShow(true)}
                  />
                )}
              </div>
            </CDBSidebarHeader>
            <CDBSidebar
              textColor="#fff"
              backgroundColor="#333"
              toggled={true}
              ref={modalContentRef}
              className={
                isSidebarShow ? "left-sidebar-show" : "left-sidebar-hidden"
              }
              // className="left-sidebar-show"
            >
              <CDBSidebarContent className="sidebar-content">
                <div className="buttons normal-group">
                  {nextVersion && (
                    <button className="purple buy-now border-0">
                      <img
                        className=""
                        src={darkLogo}
                        alt="Italian Trulli"
                      ></img>
                      BUY $TAK NOW
                    </button>
                  )}
                </div>

                <CDBSidebarMenu>

                  <Cell
                    linkStr="play"
                    setPage={setPage}
                    selectedPage={currentPage}
                  >
                    <BsPlay className="icon" />
                    <span className="detail-str">Play</span>
                  </Cell>
                      <Cell
                        linkStr="transaction-history"
                        setPage={setPage}
                        selectedPage={currentPage}
                      >
                        <BiTransferAlt className="icon" />
                        <span className="detail-str">
                          Transaction History
                          
                        </span>
                      </Cell>
                  
                  <Cell
                    linkStr="tak-stak"
                    disabled
                    setPage={setPage}
                    selectedPage={currentPage}
                  >
                    <BiStar className="icon" />
                    <span className="detail-str">
                      TAK Staking
                      <span className="coming-soon">coming soon</span> 
                    </span>
                  </Cell>
                  <Cell
                    linkStr="monkey-earning"
                    disabled
                    setPage={setPage}
                    selectedPage={currentPage}
                  >
                    <img src={Earnings} className="icon" />
                    <span className="detail-str">
                      Monkey Earnings
                      <span className="coming-soon">coming soon</span> 
                    </span>
                  </Cell>
                  <Cell
                    linkStr="comics"
                    disabled
                    setPage={setPage}
                    selectedPage={currentPage}
                  >
                    <img src={ComicBook} className="icon" />
                    <span className="detail-str">
                      Comics Earning
                      <span className="coming-soon">coming soon</span>
                    </span>
                  </Cell>
                  <Cell
                    linkStr="cashback"
                    disabled
                    setPage={setPage}
                    selectedPage={currentPage}
                  >
                    <img src={Cashback} className="icon" />
                    <span className="detail-str">
                      Cashback<span className="coming-soon">coming soon</span>
                    </span>
                  </Cell>
                  <Cell
                    linkStr="bankroll"
                    disabled
                    setPage={setPage}
                    selectedPage={currentPage}
                  >
                    <img src={Bankroll} className="icon" />
                    <span className="detail-str">
                      Bankroll<span className="coming-soon">coming soon</span>
                    </span>
                  </Cell>
                  <Cell
                    linkStr="referral"
                    setPage={setPage}
                    selectedPage={currentPage}
                  >
                    <FiUsers className="icon" />
                    <span className="detail-str">Referral</span>
                  </Cell>

                  <Cell linkStr="https://mooningmonkey.notion.site/Game-FAQ-Review-aa1342e371224735a6159e0e7c673225">
                    <CgFileDocument className="icon" />
                    <span className="detail-str">FAQs</span>
                  </Cell>
                  <img
                    src={LuckySpin}
                    className="lucky-spin"
                    onClick={showDailyBonusModal}
                  />
                </CDBSidebarMenu>
                <div className="buttons normal-group">
                  <a
                    target="_blank"
                    href="https://rarible.com/mooningmonkey"
                    className="image-back border-0 buy-monkey"
                  >
                    <div className="mask">
                      <span>BUY A MONKEY & EARN</span>
                    </div>
                  </a>
                  {nextVersion && (
                    <button
                      className="image-back border-0 join-bankroll"
                      onClick={() => setBankrollStatus(true)}
                    >
                      <div className="mask">
                        <span>JOIN THE BANKROLL & EARN</span>
                      </div>
                    </button>
                  )}
                  <button
                    className="image-back border-0 leaderboard"
                    onClick={() => showLeaderboardModal()}
                  >
                    <div className="mask">
                      <span>LEADERBOARD</span>
                    </div>
                  </button>
                  <button
                    className="image-back border-0 stats"
                    onClick={() => clickStatsBtn()}
                  >
                    <div className="mask">
                      <span>STATS</span>
                    </div>
                  </button>
                  {/*<button
                    className="image-back border-0 help"
                    onClick={() => showHelpModal()}
                  >
                    <div className="mask">
                      <span>HELP</span>
                    </div>
                  </button>*/}
                  <WalletConnectBtn isOnSideBar={true} />
                  {account && (
                    <a
                      className="image-back border-0 logout"
                      href="./logout.php"
                    >
                      <div className="mask">
                        {" "}
                        <span>
                          <FiLogOut className="icon" />
                          Logout
                        </span>
                      </div>
                    </a>
                  )}
                </div>
              </CDBSidebarContent>

              <CDBSidebarFooter style={{ textAlign: "center" }}>
                <div
                  className="sidebar-btn-wrapper"
                  style={{
                    padding: "20px 5px",
                  }}
                >
                  <a
                    href="https://discord.gg/MooningMonkey"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <BsDiscord className="sidebar-foot-btn" />
                  </a>
                  <a
                    href="https://twitter.com/MooningMonkeys"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiTwitter className="sidebar-foot-btn" />
                  </a>

                  <a
                    href="https://rarible.com/mooningmonkey"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <img src={RaribleLogo} />
                  </a>
                  <a
                    href="https://linktr.ee/MooningMonkeyOfficial"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiLinktree className="sidebar-foot-btn" />
                  </a>
                  <a
                    href="https://mooningmonkey.notion.site/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <SiNotion className="sidebar-foot-btn" />
                  </a>
                </div>
              </CDBSidebarFooter>
            </CDBSidebar>
          </>
         : 
          <CDBSidebar
            textColor="#fff"
            backgroundColor="#333"
            toggled={true}
            ref={modalContentRef}
            // className="left-sidebar-show"
          >
            <CDBSidebarHeader
              className="display-button"
              prefix={
                <div className="icon">
                  <FaAngleDoubleRight className="right-icon oc-icon" />
                  <FaAngleDoubleLeft className="left-icon oc-icon" />
                </div>
              }
            ></CDBSidebarHeader>

            <CDBSidebarContent className="sidebar-content">
              <div className="buttons normal-group">
                <button className="purple buy-now border-0">
                  <img className="" src={darkLogo} alt="Italian Trulli"></img>
                  BUY $TAK NOW
                </button>
              </div>

              <CDBSidebarMenu>
                <Cell
                  linkStr="play"
                  setPage={setPage}
                  selectedPage={currentPage}
                >
                  <BsPlay className="icon" />
                  <span className="detail-str">Play</span>
                </Cell>
                  <Cell
                    linkStr="transaction-history"
                    setPage={setPage}
                    selectedPage={currentPage}
                  >
                    <BiTransferAlt className="icon" />
                    <span className="detail-str">
                      Transaction History
                      
                    </span>
                  </Cell>
                <Cell
                  linkStr="tak-stak"
                  setPage={setPage}
                  selectedPage={currentPage}
                  disabled
                >
                  <BiStar className="icon" />
                  <span className="detail-str">
                    TAK Staking
                    <span className="coming-soon">coming soon</span> 
                  </span>
                </Cell>
                <Cell
                  linkStr="monkey-earning"
                  setPage={setPage}
                  selectedPage={currentPage}
                  disabled
                >
                  <img src={Earnings} className="icon" />
                  <span className="detail-str">
                    Monkey Earnings
                    <span className="coming-soon">coming soon</span> 
                  </span>
                </Cell>
                <Cell
                  linkStr="comics"
                  setPage={setPage}
                  selectedPage={currentPage}
                  disabled
                >
                  <img src={ComicBook} className="icon" />
                  <span className="detail-str">
                    Comics Earning
                    <span className="coming-soon">coming soon</span>
                  </span>
                </Cell>
                <Cell
                  linkStr="cashback"
                  setPage={setPage}
                  selectedPage={currentPage}
                  disabled
                >
                  <img src={Cashback} className="icon" />
                  <span className="detail-str">
                    Cashback<span className="coming-soon">coming soon</span>
                  </span>
                </Cell>
                <Cell
                  linkStr="bankroll"
                  setPage={setPage}
                  selectedPage={currentPage}
                  disabled
                >
                  <img src={Bankroll} className="icon" />
                  <span className="detail-str">
                    Bankroll<span className="coming-soon">coming soon</span>
                  </span>
                </Cell>
                <Cell
                  linkStr="referral"
                  setPage={setPage}
                  selectedPage={currentPage}
                  
                >
                  <FiUsers className="icon" />
                  <span className="detail-str">Referral
                   
                  </span>
                </Cell>

                <Cell linkStr="https://mooningmonkey.notion.site/Game-FAQ-Review-aa1342e371224735a6159e0e7c673225">
                  <CgFileDocument className="icon" />
                  <span className="detail-str">FAQs</span>
                </Cell>
                <img
                    src={LuckySpin}
                    className="lucky-spin"
                    onClick={showDailyBonusModal}
                  />
              </CDBSidebarMenu>
              <div className="buttons normal-group">
                <a
                  target="_blank"
                  href="https://rarible.com/mooningmonkey"
                  className="image-back border-0 buy-monkey"
                >
                  <div className="mask">
                    <span>BUY A MONKEY & EARN</span>
                  </div>
                </a>
                {nextVersion && (
                  <button
                    className="image-back border-0 join-bankroll"
                    onClick={() => setBankrollStatus(true)}
                  >
                    <div className="mask">
                      <span>JOIN THE BANKROLL & EARN</span>
                    </div>
                  </button>
                )}
                <button
                  className="image-back border-0 leaderboard"
                  onClick={() => showLeaderboardModal()}
                >
                  <div className="mask">
                    <span>LEADERBOARD</span>
                  </div>
                </button>
                <button
                  className="image-back border-0 stats"
                  onClick={() => clickStatsBtn()}
                >
                  <div className="mask">
                    <span>STATS</span>
                  </div>
                </button>
                {/*<button
                  className="image-back border-0 help"
                  onClick={() => showHelpModal()}
                >
                  <div className="mask">
                    <span>HELP</span>
                  </div>
                </button>*/}
                <WalletConnectBtn isOnSideBar={true} />
              </div>
            </CDBSidebarContent>

            <CDBSidebarFooter style={{ textAlign: "center" }}>
              <div
                className="sidebar-btn-wrapper"
                style={{
                  padding: "20px 5px",
                }}
              >
                <a
                  href="https://discord.gg/MooningMonkey"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <BsDiscord className="sidebar-foot-btn" />
                </a>
                <a
                  href="https://twitter.com/MooningMonkeys"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiTwitter className="sidebar-foot-btn" />
                </a>

                <a
                  href="https://rarible.com/mooningmonkey"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={RaribleLogo} />
                </a>
                <a
                  href="https://linktr.ee/MooningMonkeyOfficial"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiLinktree className="sidebar-foot-btn" />
                </a>
                <a
                  href="https://mooningmonkey.notion.site/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SiNotion className="sidebar-foot-btn" />
                </a>
              </div>
            </CDBSidebarFooter>
          </CDBSidebar>
        }
      </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  logged: state.userData.logged,
  currentPage: state.userData.currentPage,
  useChainData: state.userData.useChainData,
  currentChainId: state.userData.currentChainId,
});
export default withRouter(
  connect(mapStateToProps, {
    changeCurrentPage,
    showLoginModal,
    showStatsModal,
    showLeaderboardModal,
    showHelpModal,
    showDailyBonusModal,
  })(Sidebar)
);
