import { Nav, Tab } from 'react-bootstrap';
import React, { useState, useEffect } from "react";
import { useMediaQuery } from 'react-responsive'
import {connect} from 'react-redux'
import Chat from './Chat';
import History from './History';
import AutoBet from '../BetTypeContainer/AutoBet'
import PlayersMobile from '../../../components/PlayersPanel/PlayersMobile';

import ScamedPage from './ScamedPage';
import ContainerComponent from "../../../components/ContainerComponent";
import './index.scss';

const ChatAndHistory = (props) => {
    const {newFriendAdded} = props;
    const [haveReadScammAlert, setReadScammAlert] = useState(false);
    const [key, setKey] = useState('chat')
    useEffect(() => {
        const readScamMessage = window.localStorage.getItem('readUserScamMessage');
        if(readScamMessage === "true") {
            setReadScammAlert(true);
        }
    },[]);
    const closeScamedPage = () => {
        setReadScammAlert(true);
        window.localStorage.setItem('readUserScamMessage', 'true');
    
    }
    const isMobileSamll = useMediaQuery({ query: '(max-width: 800px)' })
    const isMobile = useMediaQuery({ query: '(max-width: 1200px)' })
    const isMedium = useMediaQuery({ query: '(max-width: 1800px)' })
    const isPlayerHideSize = useMediaQuery({ query: '((min-width: 800px) and (max-width: 1200px)) or (min-width: 1400px)' })
    const hideAutoBet = useMediaQuery({ query: '(min-width: 800px)' })

    
    useEffect(() => {
        if(!isMobile && key === 'auto') {
            setKey('chat')
        }
        if(!isMedium && key === 'players') {
            setKey('chat')
        }
    }, [isMobile, isMedium])
    return (
        <ContainerComponent className="chat-container">
            <div className="chat-and-history">
                <Tab.Container id="left-tabs-example" defaultActiveKey="chat" activeKey={key} onSelect={(k) => setKey(k)} >
                    <div className="left-btns">
                        <Nav variant="pills" className="left-nav">
                            <Nav.Item>
                            <Nav.Link eventKey="chat" className="left-tab-button">
                                <span><div className="tab-text">CHAT</div></span>
                            </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                            <Nav.Link eventKey="history">
                                <span><div className="tab-text">History</div></span>
                            </Nav.Link>
                            </Nav.Item>
                            {!hideAutoBet &&
                                    <Nav.Item>
                                    <Nav.Link eventKey="auto">
                                        <span><div className="tab-text">Auto</div></span>
                                    </Nav.Link>
                                    </Nav.Item>
                            }
                            {!isPlayerHideSize &&
                                <Nav.Item>
                                <Nav.Link eventKey="players">
                                    <span><div className="tab-text">Players</div></span>
                                </Nav.Link>
                                </Nav.Item>
                            }
                        </Nav>
                        {/* <div className="setting">
                            <AiFillSetting></AiFillSetting>
                        </div> */}
                    </div>        
                    <Tab.Content>
                        <Tab.Pane eventKey="chat">
                            {
                                !haveReadScammAlert && newFriendAdded
                                ?    <ScamedPage closePage={closeScamedPage}/>
                                :   <Chat/>
                            }
                        </Tab.Pane>
                        <Tab.Pane eventKey="history">
                            <History/>
                        </Tab.Pane>
                        <Tab.Pane eventKey="auto">
                            <div className="mobile-auto-bet">
                                <AutoBet isMobile={true}/>
                            </div>
                        </Tab.Pane>
                        <Tab.Pane eventKey="players">
                            <PlayersMobile/>
                        </Tab.Pane>
                    </Tab.Content>

                </Tab.Container>
            </div>
        </ContainerComponent>
    );
}

const mapStateToProps  = (state) => (
    { 
        newFriendAdded: state.userData.newFriendAdded
    }
)
export default connect(mapStateToProps, {})(ChatAndHistory)