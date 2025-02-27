import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import React, { useEffect, useState } from "react";
import Pagination from 'react-responsive-pagination';
import {connect} from 'react-redux'
import { Helmet } from 'react-helmet'
import { useWeb3React } from "@web3-react/core";

import LogoFooterComponent from '../../components/LogoFooterComponent';
import TransActionTableComponent from '../../components/TransActionTableComponent';
import MobileDataList from '../../components/MobileDataList';
import WalletNotConnectedComponent from './WalletNotConnectedComponent';

import './index.scss';
import {TRANSACTION_TYPE} from '../../utils/types';
import {getTransactionHistory} from '../../actions/transactionHistoryActions'
import Select from 'react-select';
import {nextVersion} from '../../utils/constant'

const defaultData = [
    // event: "Reward",
    // status: "Success",
    // amount: 0.05,
    // fee: 0,
    // creditedOn: "24-09-2021 16:03"
    "Reward",
    "Success",
    0.05,
    0,
    "24-09-2021 16:03"
]
const testDataList = [];
const TRANSACTION_PAGE_TITLE = {
    DEPOSIT: 'Crypto Deposit History',
    WITHDRAW: 'Withdrawals',
    EVENT: "Events",
    REWARD: "Rewards"
}

for (let i = 0; i < 11; i++) {
    testDataList.push(defaultData);
}
const TransactionHistory = (props) => {
    const { transactionHistory, getTransactionHistory } = props;
    const [currentPage, setCurrentPage] = useState(1);
    const [displayCount, setDisplayCount] = useState(10);
    const [displayData, setDisplayData] = useState([]);
    const [totalPages, setTotalPageCopunt] = useState(10);
    const [pageTitle, setPageTitle] = useState()
    const { account } = useWeb3React();
    const getDisplayData = (baseData, selectedPageNumber, selectedDisplayCount) => {
        const displayArray = baseData.slice((selectedPageNumber-1) * selectedDisplayCount, selectedPageNumber * selectedDisplayCount)
        return displayArray;
    }
    useEffect(
        () => {
            let displayDataList = getDisplayData(transactionHistory, currentPage, displayCount)
            setDisplayData(displayDataList)
        },
        [transactionHistory, currentPage, displayCount],
    );
    useEffect(
        () => {
            setTotalPageCopunt(parseInt((transactionHistory.length - 1) / displayCount + 1))
        },
        [transactionHistory, displayCount],
    );
    useEffect(
        () => {
            clickTabBtn(TRANSACTION_TYPE.DEPOSIT)
        },
        [],
    );
    const clickTabBtn = (type) => {
        switch(type) {
            case TRANSACTION_TYPE.DEPOSIT:
                setPageTitle(TRANSACTION_PAGE_TITLE.DEPOSIT)
                break;
            case TRANSACTION_TYPE.WITHDRAW:
                setPageTitle(TRANSACTION_PAGE_TITLE.WITHDRAW)
                break;
            case TRANSACTION_TYPE.EVENT:
                setPageTitle(TRANSACTION_PAGE_TITLE.EVENT)
                break;
            case TRANSACTION_TYPE.REWARD:
                setPageTitle(TRANSACTION_PAGE_TITLE.REWARD)
                break;
        }
        getTransactionHistory(type)
        //setTransactionHistory(testDataList)
        
    }
    /////// pagination action
    const changeDisplayCount = (e) => {
        setDisplayCount(e);
    }
    const tableRecodCountOptions = [
        { value: 10, label: '10 Records' },
        { value: 20, label: '20 Records' },
        { value: 50, label: '50 Records' } 
    ];
    const recordTableStyle = {
        option: (provided, state) => ({
            ...provided
        }),
        control: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderRadius: '5px',
            borderColor: '#515189',
        }),
        singleValue: provided => ({
            ...provided,
            color: 'white'
          })
    }
    return (
        <div className="transaction-history monkey-page">
            <Helmet>
                <title>{pageTitle}</title>
            </Helmet>
            
            <div className="main-content">
                <div className="gradient-font page-title">TRANSACTION HISTORY</div>
                {
                    account?
                    <>
                        <div className='transaction-history-container'>
                            
                            <Tab.Container id="left-tabs-example" defaultActiveKey="deposit">
                                <Nav variant="pills" className="nav-tabs">
                                    <Nav.Item>
                                        <Nav.Link eventKey="deposit" onClick={()=>clickTabBtn(TRANSACTION_TYPE.DEPOSIT)}>Deposit</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="withdraw" onClick={()=>clickTabBtn(TRANSACTION_TYPE.WITHDRAW)}>Withdraw</Nav.Link>
                                    </Nav.Item>
                                    {
                                        nextVersion &&
                                        <Nav.Item>
                                            <Nav.Link eventKey="event" onClick={()=>clickTabBtn(TRANSACTION_TYPE.EVENT)}>Event</Nav.Link>
                                        </Nav.Item>
                                    }

                                    <Nav.Item>
                                        <Nav.Link eventKey="rewards" onClick={()=>clickTabBtn(TRANSACTION_TYPE.REWARD)}>Rewards</Nav.Link>
                                    </Nav.Item>
                                    
                                </Nav>
                                <Tab.Content>
                                    <Tab.Pane eventKey="deposit">
                                        <MobileDataList dataList={displayData}/>
                                        <TransActionTableComponent dataList={displayData} transActionType={TRANSACTION_TYPE.DEPOSIT}/>
                                    </Tab.Pane>
                                    <Tab.Pane eventKey="withdraw">
                                        <MobileDataList dataList={displayData}/>
                                        <TransActionTableComponent dataList={displayData} transActionType={TRANSACTION_TYPE.WITHDRAW}/>
                                    </Tab.Pane>
                                    {
                                        nextVersion &&
                                        <Tab.Pane eventKey="event">
                                            <MobileDataList dataList={displayData}/>
                                            <TransActionTableComponent dataList={displayData} transActionType={TRANSACTION_TYPE.WITHDRAW}/>
                                        </Tab.Pane>
                                    }
                                    <Tab.Pane eventKey="rewards">
                                        <MobileDataList dataList={displayData}/>
                                        <TransActionTableComponent dataList={displayData} transActionType={TRANSACTION_TYPE.REWARDS}/>
                                    </Tab.Pane>
                                
                                </Tab.Content>
                            
                            </Tab.Container>
                        </div>
                        <div className='custom-table-bottom'>
                            <div className='custom-table-bottom-left'>
                            <React.Fragment>
                                <Select value={{label: `${displayCount} Records`, value: displayCount}} className="record-count-select"
                                    onChange={(e)=>changeDisplayCount(e.value)}
                                    options = {tableRecodCountOptions} styles = {recordTableStyle}>

                                </Select>
                                <div className='custom-table-bottom-left-status'>{`Showing ${displayData.length} out of ${transactionHistory.length}`}</div>
                            </React.Fragment>
                            </div>
                            <div className='pagination-content'>
                                <Pagination current={currentPage}
                                    total={totalPages}
                                    onPageChange={setCurrentPage}>  
                                    </Pagination>
                            </div>
                        </div>  
                    </>
                    :<WalletNotConnectedComponent/>
                }
            </div>
            <LogoFooterComponent/>
        </div>
    );
}

const mapStateToProps  = (state) => (
    {
        transactionHistory: state.transactionData.transactionHistory
    }
)

export default connect(mapStateToProps, {getTransactionHistory})(TransactionHistory)