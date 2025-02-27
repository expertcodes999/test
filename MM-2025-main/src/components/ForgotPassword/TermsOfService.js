import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import validator from 'validator'
import './index.scss';

import {connect} from 'react-redux'

const TermsOfService = (props) => {
    const { clickCloseBtn } = props;
    return (
        <div className="term-of-service">
            <Modal.Header>
                <Modal.Title><span>Terms of Service</span></Modal.Title>
                <button type="button" onClick={clickCloseBtn} className="btn-close btn-close-white" aria-label="Close"></button>
            </Modal.Header>
            <Modal.Body>
                <li>
                    <span className="term-header">Prohibited users</span>
                    <ul>
                        <li>Users that are citizens or residents of any of the following jurisdictions are prohibited from using the service:
                            <ul>
                                <li>Aruba</li>
                                <li>Australia</li>
                                <li>Curaçao</li>
                                
                                <li>France</li>
                                
                                <li>Netherlands</li>
                                
                                <li>Sint Maarten</li>
                                
                                <li>United States of America</li>
                                
                            </ul>
                        </li>
                        <li>Users younger than 18 years of age are prohibited from using the service.</li>
                        <li>Users for which using the service is not legal in their applicable jurisdiction(s) are prohibited from using the service.</li>
                        <li>Ensuring they are legally permitted to use the service is the user's responsibility. The operator makes no claims and provides no guarantees that using the service is legal for the user.</li>
                        <li>To ensure that no prohibited users are using the service, the operator may demand proof of age, citizenship and residence of any user at his own discretion. If the user does not provide adequate proof at the operator's request they may be barred from further using the service.</li>
                    </ul>
                </li>
                <li>
                    <span className="term-header">Account access</span>
                    <ul>
                        <li>An account's owner is authenticated solely by his login credentials: the combination of his username, password and two-factor authentication method (if enabled). The operator need not accept any other form of authentication. The user acknowledges that he may permanently lose access to his account and all funds contained within if he loses his login credentials.</li>
                        <li>The user is responsible for securing his login credentials. The operator shall not be liable for lost user accounts or the funds contained within or any other resulting damages if the user knowingly or unknowingly provides a third party with his login credentials, especially but not limited to the user falling victim to social engineering or malware attacks.</li>
                        <li>By voluntarily deleting his account, the user forfeits any remaining balance and bankroll investments of the account.</li>
                    </ul>
                </li>
                <li>
                    <span className="term-header">Deposits & withdrawals</span>
                    <ul>
                        <li>Only Bitcoin is accepted for deposits and withdrawals. Other cryptocurrencies sent to the service's deposit addresses can not be accessed by the operator and will not be credited to the user's account or returned to the user.</li>
                        <li>In the case of blockchain forks, the operator may decide which chain is considered to be Bitcoin at his discretion. The operator may choose to make the proceeds of Bitcoin forks or airdrops available to the user or not at his sole discretion.</li>
                        <li>The operator attempts to process all withdrawals instantly unless the user explicitly opts to queue his withdrawal. The operator shall not be liable for delayed withdrawals including those that are delayed through fault of the operator.</li>
                        <li>The operator attempts to process all withdrawals instantly unless the user explicitly opts to queue his withdrawal. The operator shall not be liable for delayed withdrawals including those that are delayed through fault of the operator.</li>
                    </ul>
                </li>
                <li>
                    <span className="term-header">Betting</span>
                    <ul>
                        <li>All bets are final. The operator will not provide refunds of lost bets, including but not limited to accidentally submitted bets or bets lost due to network latency.</li>
                        <li>In the case of a dispute, the information received and recorded by the service in its database shall be deciding.</li>
                        <li>Use of the script editor and the automated betting feature is voluntary. The operator assumes no liability for malfunctioning scripts.</li>
                    </ul>
                </li>
                <li>
                    <span className="term-header">Investing</span>
                    <ul>
                        <li>The user acknowledges that bankroll investments are highly volatile, are not guaranteed to earn a profit and carry a substantial risk of loss.</li>
                        <li>Bankroll investments are governed by the terms shown on the bankroll management page and in the FAQ. The operator may unilaterally change these terms with immediate effect and without advance notice at any time.</li>
                        <li>The operator may choose to award otherwise lost bets that encountered technical difficulties (e.g. server crash) to players at his sole discretion and at cost to the bankroll investors.</li>
                        <li>Investment operations (including divestments) are irreversible and the operator shall not be liable for investment operations accidentally taken by the user.</li>
                    </ul>
                </li>
                <li>
                    <span className="term-header">Chat</span>
                    <ul>
                        <li>The user agrees to abide by the chat rules. The operator may temporarily or permanently prevent users that violate the chat rules or are otherwise disruptive from participating in the chat at the operator's sole discretion and without any warning.</li>
                        <li>The operator is not liable for content that other users post or link to in the chat.</li>
                        <li>The service is not a trading forum and the operator discourages all sorts of trading or other dealing among players. The operator will not intervene in disputes among players under any circumstances and shall not be liable for any losses arising from such disputes.</li>
                        
                    </ul>
                </li>
                <li>
                    <span className="term-header">Forfeiture of dormant accounts</span>
                    <ul>
                        <li>The operator may permanently delete accounts that have not been accessed for two years and may make usernames of deleted accounts available for use with new accounts again.</li>
                        <li>For this purpose, an account's last access time is the time that the user last signed in to the account or connected to the service while already signed in.</li>
                        <li>All funds of deleted dormant accounts including their balance and any bankroll investments are forfeited by the user and assumed by the operator.</li>
                        <li>No dormant accounts shall be deleted before October 1, 2021.</li>
                    </ul>
                </li>
                <li>
                    <span className="term-header">Miscellaneous</span>
                    <ul>
                        <li>The agreement shall be governed by the laws of Curaçao. Any legal disputes between the operator and the user regarding the use of the service are to be decided by the courts of Curaçao.</li>
                        <li>The operator may unilaterally modify these terms of service at any time and without notice. Continued use of the service implies consent to the new terms of service. For this purpose, remaining invested in the bankroll is considered use of the service.</li>
                        <li>All funds of deleted dormant accounts including their balance and any bankroll investments are forfeited by the user and assumed by the operator.</li>
                        <li>The operator not insisting on one of his rights granted by these terms of service in one or more specific instances shall not preempt the operator from making use of this right in the future.</li>
                    </ul>
                </li>
            </Modal.Body>
        </div>
    );
}

const mapStateToProps  = (state) => (
    {
        
    }
)
export default connect(mapStateToProps, {})(TermsOfService)