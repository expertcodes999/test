import React, { useState, useEffect } from 'react';
import { Row, Col } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";

import { useWeb3React } from "@web3-react/core";
import { Hearts } from  'react-loader-spinner';
import { MDBInput } from 'mdb-react-ui-kit';
import Web3 from 'web3';

import { showHisotyModal } from '../../actions/gameActions'
import LogoFooterComponent from "../../components/LogoFooterComponent";
import { connectWallet, changeNetwork } from '../../utils/interact';
import AmountImg from '../../assets/images/amount.svg';
import ClockImg from '../../assets/images/clock.svg';
import StarImg from '../../assets/images/star.svg';
import BNBImg from '../../assets/images/bnb.png';
import MonkeyImg from '../../assets/images/monkey.png';
import './index.scss';
import { EtherscanProvider } from '@ethersproject/providers';

//handsome
import { CONTRACTS, CONTRACTS_TYPE } from '../../utils/constants';
import { injected, rinkebyInjectedConnector } from "../../components/wallet/connectors";
import axios from "axios";
// import BigNumber from 'bignumber.js';
// import BigNumber from 'big-number';
import { BigNumber } from "@ethersproject/bignumber";
import { ethers } from 'ethers';

import { rinkebyChainData } from '../../constants/chain';

import {connect} from 'react-redux'
import {changeUseChainData, getStakingRewards} from '../../actions/userActions'
import {stakingContractABI, stakingContractAddress} from '../../utils/contractData'
import {nextVersion} from '../../utils/constant'

let web3 ;
const chartTimes = [
    'H',
    'D',
    'W',
    'M',
    'ALL'
];

const TakStaking = (props) => {
    const {changeUseChainData, currentChainId, useChainData, showHisotyModal, userName} = props;
    let chartSeries = [
        {
          name: "series-1",
          data: [0, 0, 0, 0, 0, 0, 0, 0]
        }
    ]

    const { active, account, library, chainId, connector, activate, deactivate } = useWeb3React();

    let metadata0 = CONTRACTS[CONTRACTS_TYPE.TAKTOKEN][4]?.abi;
    let addr0 = CONTRACTS[CONTRACTS_TYPE.TAKTOKEN][4]?.address;

    let metadata1 = CONTRACTS[CONTRACTS_TYPE.TAKTOKENSTAKE][4]?.abi;
    let addr1 = CONTRACTS[CONTRACTS_TYPE.TAKTOKENSTAKE][4]?.address;

    const [approveAmount, setAmountValue] = useState(0);
    const [claimAmount, setClaimAmount] = useState(0);
    const [amountStake, setAmountStake] = useState(0);
    const [lockduration, setLockDuration] = useState(0);
    const [loading, setLoading] = useState(false);
    const [myBalance, setMyBalance] = useState(0);
    const [chartdata, setChartData] = useState([]);
    const [stakedRewards, setStakedRewards] = useState([])

    const [amount, setAmount] = useState(0);
    const [totalRewards, setTotalRewards] = useState(0);
    const [myRewards, setMyRewards] = useState(0);
    const [rewardSum, setRewardSum] = useState(0);
    const [staked, setStakeState] = useState(null);
    const [chartTimeFrame, setChartTimeFrame] = useState(chartTimes[0])

    // useEffect(() => {
    //     if (!active && localStorage.getItem("accountStatus")) {
    //         activate(injected);
    //     }
    // }, [])
    useEffect(() => {
        changeUseChainData(rinkebyChainData)
    }, [])

    useEffect(async () => {
        const stakingRewards = await getStakingRewards(chartTimeFrame, userName)
        setStakedRewards(stakingRewards)
    }, [chartTimeFrame])

    useEffect(() => {
        
        (async () => {
            console.log("account: ", account)
            if (account && chainId && library) {
                web3 = new Web3(library.provider);
                let contract0 = new web3.eth.Contract(metadata0, addr0);
                let contract1 = new web3.eth.Contract(metadata1, addr1);
                let stakingContract = new web3.eth.Contract(stakingContractABI, stakingContractAddress);
                const walletInfo = await axios.get(`https://deep-index.moralis.io/api/v2/0x2D9A3804Bf88666B67424D301F0C5c815dc5438f?chain=rinkeby`, {
                    headers: {'x-api-key': 'C9ceiK2PKyLkB2y065rR8ZD4jZitcSXMba3SrIZblvFHR5Qsw2kIdO20RRPCgpI1'}
                })

                let results  = walletInfo.data.result;

                // results.map(result, i)
                for(let i = 0; i < results.length; i++)
                {
                    let tempdate = new Date(results[i].block_timestamp);
                    let now = new Date();
                    let total = 0;


                    if(results[i].to_address == account)
                    {
                        let duration = getDifferenceInDays(now, tempdate);
                        chartSeries[0].data[Math.floor(duration)] += results[i].value;

                        total += results[i].value;

                        setChartData(chartSeries);
                        setRewardSum(total);
                    }
                }

                try
                {
                    
                    let totalRewardPool = await contract1.methods.totalRewardsPool().call();
                    totalRewardPool = totalRewardPool / (10 ** 18);
                    console.log("lastRewardsPool::::::::::::: ", totalRewardPool)
                    setTotalRewards(Math.floor(totalRewardPool));


                    let amount_claimable = await contract1.methods.getAmountClaimable().call();
                    console.log(amount_claimable);
                    console.log('staked.amount');
                    setAmount(amount_claimable);

                    let allow_result = await contract0.methods.allowance(account, addr1).call();
                    setAmountValue(allow_result);
                    console.log("A++++++++++++++++++++", allow_result)

                    let balance = await contract0.methods.balanceOf(account).call();
                    setMyBalance(balance / (10 ** 18));

                    
                    let temp_val = await contract1.methods.totalRewardsClaimed(account).call();
                    temp_val = temp_val / (10 ** 18);
                    console.log("lastRewardsPool::::::::::::: ", temp_val)
                    temp_val = await contract1.methods.userToRewards(account).call();
                    temp_val = temp_val / (10 ** 18);
                    console.log("MyRewardsPool: ", temp_val);
                    setMyRewards(Math.floor(temp_val));

                    temp_val = await contract1.methods.stakeStructs(account).call();
                    console.log("MYstakeStructs: ", temp_val);
                    // setMyRewards(Math.floor(temp_val.amount));
                    let stakedAmount = Math.floor(temp_val.amount)
                    // let stakeState = await contract1.methods.isStaked(account).call();
                    // console.log("stakeState: ", stakeState);
                    setStakeState(stakedAmount > 0);

                }
                catch(err)
                {
                    console.log(err);
                }
            }
        })();
    }, [chainId, currentChainId, library, account, loading])

    async function isStaked() {
            if (account && chainId && library) {
                let contract1 = new web3.eth.Contract(metadata1, addr1);
                let result = await contract1.methods.isStaked(account).call();
                return result;
            }
    }

    function getDifferenceInDays(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60 * 60 * 24);
      }

    const onClickTimeFrameBtn = async (timeFrame) => {
        setChartTimeFrame(timeFrame)
    }
    const handleChangeNetwork = async () => {
        const walletResponse = await changeNetwork(useChainData);
    }


    const chartOptions = {
        chart: {
            type: 'area',
            id: "basic-bar",
            zoom: {
                enabled: false
            }
        },
        dataLabels: {
            enabled: false
        },
        legend: {
            horizontalAlign: 'left'
        },
        labels: [30, 40, 45, 50, 49, 60, 70, 91],
        xaxis: {
            categories: [17, 18, 19, 20, 21, 22, 23, 24]
        },
        stroke: {
            curve: 'straight'
        },
        tooltip: {
            enabled: true
        },
        theme: {
            mode: 'dark'
        },
        colors: ['#F001F4']
    }



    // const changeStakeAmount = () => {

    // }

    function connect() {
        setLoading(true);
        activate(rinkebyInjectedConnector, async (error) => {
            console.log(error);
        });
        setLoading(false);
    }

    async function handleConnectWallet() {
        setLoading(true);
        const walletResponse = await connectWallet(rinkebyChainData.chainId);
        setLoading(false);
    }

    const changeStakeAmount = (e) => {
        setAmountStake(e.target.value);
    }


    async function approve() {
        if (account && chainId && library) {
            setLoading(true);
            web3 = new Web3(library.provider);
            let contract0 = new web3.eth.Contract(metadata0, addr0);

            let contract1 = new web3.eth.Contract(metadata1, addr1);


            try
            {
                // let approve = await contract1.methods.approvedAddresses(account).call();
                // let amountToApprove = new BigNumber(10000 * (10 ** 18));

                let amountToApprove = BigNumber.from(10000 + "000000000000000000");
                // let amountToApprove = BigNumber.from('1000000000000000000000000');


                console.log('****************************************************************', typeof amountToApprove, amountToApprove);



                let allow_result = await contract0.methods.approve(addr1, amountToApprove).send({from: account});

                // let allow_result = await contract0.methods.approve(account, amountToApprove).send({from: account});

                allow_result = await contract0.methods.allowance(account, addr1).call();
                setAmountValue(allow_result);

                let amount_reward = await  contract1.methods.getAmountClaimable().call();
                setClaimAmount(amount_reward);
            }
            catch(err)
            {
                console.log(err);
            }
            setLoading(false);
        }
    }

    async function clickStake() {
        if(amountStake > 10000)
        {
            alert("Max amount over.");
            return;
        }

        if (account && chainId && library) {

            setLoading(true);
            web3 = new Web3(library.provider);

            let contract1 = new web3.eth.Contract(metadata1, addr1);

            try
            {
                // let approve = await contract1.methods.approvedAddresses(account).call();
                // let amountToStake = new BigNumber(amountStake * (10 ** 18)).toString();
                let amountToStake = BigNumber.from(amountStake + "000000000000000000");//Once

                console.log('================================================', amountToStake, lockduration)
                let mint_result = await contract1.methods.stake(amountToStake, lockduration).send({from: account});

            }
            catch(err)
            {
                console.log(err);
                console.log("User can stake only once per time. To do another stake, please finish previous stake.");
            }
            setLoading(false);
        }
    }

    async function clickUnStake() {
        if (account && chainId && library) {

            setLoading(true);
            web3 = new Web3(library.provider);

            let contract1 = new web3.eth.Contract(metadata1, addr1);

            try
            {
                // let approve = await contract1.methods.approvedAddresses(account).call();
                let mint_result = await contract1.methods.unstake().send({from: account});

            }
            catch(err)
            {
                console.log(err);
                console.log("Contract does not have enough TAKs for unstake and reward");
            }
            setLoading(false);
        }
    }

    async function clickClaim() {
        if (account && chainId && library) {

            setLoading(true);
            web3 = new Web3(library.provider);

            let contract1 = new web3.eth.Contract(metadata1, addr1);

            try
            {
                // let approve = await contract1.methods.approvedAddresses(account).call();
                let mint_result = await contract1.methods.claim().send({from: account});

            }
            catch(err)
            {
                console.log(err);
                console.log("Contract does not have enough TAKs");
            }
            setLoading(false);
        }
    }

    const clickLockDuration = (day) => {
        setLockDuration(day);
    }

    //amountStake
    if(loading)
    {
        return (
            <div className="staking-container">
                <div style={{margin:'15% 40%'}}>
                    <Hearts color="#F001F4" height={280} width={280}/>
                </div>
            </div>
        )
    }
    else
    return (
        <div className="staking-container monkey-page">
            <div className="gradient-font page-title">STAKING</div>
            {
                currentChainId !== useChainData.chainId &&
                <p className="change-network-alert">You are still on BSC Chain (Crash Game Blockchain) Please  switch to ETH chain for Staking</p>
            }
            <div className="main">
                <Row>
                    <Col sm={12} lg={12} xl={7}>
                        <div className="staking-container-left">
                            <div className="staking-container-left-top mooning-purple-border-content">
                                <div className="title">
                                Available Tak Balance in Wallet for Staking: {Math.floor(myBalance)}
                                </div>
                                <div className="stake-component ph-hide wnd-show">
                                    <div className="title">
                                        <img src={AmountImg} alt="amount" />
                                        Stake Amount
                                    </div>
                                    <div className="info">
                                        <input className="stake-amount-input" value={amountStake} type='number' onChange={changeStakeAmount}/>
                                        <div className="max-btn cursor-pointer poppin-light-txt" onClick={() => setAmountStake(Math.floor(myBalance))}>MAX</div>
                                        {/* <div className="">Amount</div> */}
                                    </div>
                                </div>
                                <div className="stake-component ph-show wnd-hide">
                                    <div className="info stake-component-first">
                                        <div className="title">
                                            <img src={AmountImg} alt="amount" />
                                            Stake Amount
                                        </div>
                                        <div className="">10'000 <span>max</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="lock-component">
                                    <div className="title">
                                        <img src={ClockImg} alt="clock" />
                                        Lock in period (Days)
                                    </div>
                                    <div className="info">
                                        <div className={`item ${lockduration === 0 ? 'active' : ''}`} onClick={() => clickLockDuration(0)}>0</div>
                                        <div className={`item ${lockduration === 7 ? 'active' : ''}`} onClick={() => clickLockDuration(7)}>7</div>
                                        <div className={`item ${lockduration === 30 ? 'active' : ''}`} onClick={() => clickLockDuration(30)}>30</div>
                                        <div className={`item ${lockduration === 60 ? 'active' : ''}`} onClick={() => clickLockDuration(60)}>60</div>
                                        <div className={`item ${lockduration == 90 ? 'active' : ''}`} onClick={() => clickLockDuration(90)}>90</div>
                                        <div className={`item ${lockduration == 120 ? 'active' : ''}`} onClick={() => clickLockDuration(120)}>120</div>
                                    </div>
                                </div>
                                <div className="stake-component ph-hide wnd-show">
                                    <div className="title">
                                        <img src={StarImg} alt="star" />
                                        Rewards
                                    </div>
                                    <div className="info">
                                        <div></div>
                                        <div className="reward-amount"><span className="pink-font">{claimAmount}</span> <span>$Tak</span></div>
                                    </div>
                                </div>
                                <div className="stake-component ph-show wnd-hide">
                                    
                                    <div className="info">
                                    <div className="title">
                                        <img src={StarImg} alt="star" />
                                        Rewards
                                    </div>
                                        <div><span className="pink-font">{claimAmount}</span> <span>$Tak</span></div>
                                    </div>
                                </div>
                                <div className="explain-component">
                                    <div className="left">Only 1 stake is possible per wallet with a minimum of 1,000 Tak tokens. Staked tokens will be locked for the staking period chosen. </div>
                                    <a target="_blank" href="https://rinkeby.etherscan.io/address/0x8852d66155068a4f945cae3D1cC4e33E7874284b#readContract"
                                     className="right ph-hide wnd-show">
                                        <div>
                                            <div>View Contract</div>
                                            <div>On BSCscan.com</div>
                                        </div>
                                        <img src={BNBImg} alt="bnb_image" />
                                    </a>
                                    <div className="right ph-show wnd-hide">
                                        View Contract
                                        <div>
                                            On BSCscan.com
                                            <img src={BNBImg} alt="bnb_image" />
                                        </div>
                                        
                                        
                                    </div>
                                </div>
                            </div>
                            <div className="staking-container-left-bottom mooning-purple-border-content">
                                {
                                    currentChainId !== useChainData.chainId &&
                                    <div className="button-group">
                                        <div className="button" onClick={handleChangeNetwork}>Change Network</div>
                                    </div>
                                }
                                
                                {(currentChainId === useChainData.chainId) && !account && (
                                    <div className="button-group">
                                        <div className="button" onClick={connect}>Connect Wallet</div>
                                    </div>
                                )}

                                {(currentChainId === useChainData.chainId) && account && (approveAmount > 0) && (
                                    <div className="button-group">
                                        <button disabled={!staked} className="mooning-gradient-button" onClick={clickStake}>STAKE</button>
                                        <button disabled={staked}  className="mooning-gradient-button" onClick={clickUnStake}>UNSTAKE</button>
                                        <button disabled={staked}  className="mooning-gradient-button" onClick={clickClaim}>CLAIM</button>
                                    </div> )
                                }
                                {/* <div className="button-group">
                                    <div className="button" onClick={clickStake}>STAKE</div>
                                    <div className="button" onClick={clickUnStake}>UNSTAKE</div>
                                    <div className="button" onClick={clickClaim}>CLAIM</div>
                                </div> */}


                                {(currentChainId === useChainData.chainId) && account && (approveAmount == 0) && (
                                    <div className="button-group">
                                        <div className="button" onClick={approve}>approve</div>
                                    </div> )
                                }
                                <div className="view-history white-btn"><a target = "_blank" onClick={()=>showHisotyModal()}>View History</a></div>
                            </div>
                        </div>
                    </Col>
                    <Col sm={12} lg={12} xl={5}>
                        <div className="staking-container-right">
                            <div className="staking-container-right-top mooning-purple-border-content">
                                <Row className="ph-hide wnd-show">
                                    <Col sm={12} md={6}>
                                        <div className="title">Market Data</div>
                                        <div className="detail">
                                            <div className="sub-title">Total Tak Reward Pool</div>
                                            <div className="info">{totalRewards} Tak</div>
                                        </div>
                                        <div className="detail">
                                            <div className="sub-title">Total Tak Rewards Left</div>
                                            <div className="info">{claimAmount} Tak</div>
                                        </div>
                                        {/* <div className="detail">
                                            <div className="sub-title">Tak Circ. Supply Staked</div>
                                            <div className="info">X%</div>
                                        </div>
                                        <div className="detail">
                                            <div className="sub-title">TVL</div>
                                            <div className="info">$X</div>
                                        </div> */}
                                    </Col>
                                    <Col sm={12} md={6}>
                                        <div className="title">My Data</div>
                                        <div className="detail">
                                            <div className="sub-title">My Tak Staked</div>
                                            <div className="info">{amount} Tak</div>
                                            {/* <div className="info">{myRewards} Tak</div> */}
                                        </div>
                                        <div className="detail">
                                            <div className="sub-title">My Tak Earned</div>
                                            <div className="info">{rewardSum} Tak</div>
                                        </div>
                                        {/* <div className="detail">
                                            <div className="sub-title">Locked Until</div>
                                            <div className="info">XX/XX/XX</div>
                                        </div>
                                        <div className="detail">
                                            <div className="sub-title">APY</div>
                                            <div className="info">X%</div>
                                        </div> */}
                                    </Col>
                                </Row>
                                <div className="ph-show wnd-hide">
                                </div>
                                <div className="chart-option">
                                    <div className="">STAKING REWARD</div>
                                    
                                    <div className="item-list chart-time">
                                    {
                                        chartTimes.map(time => 
                                        <button className={`time-type ${chartTimeFrame === time ? 'selected-time' : ''}`}
                                            onClick={()=>onClickTimeFrameBtn(time)}>{time}</button>
                                        )
                                    }
                                        
                                    </div>
                                </div>
                                <ReactApexChart type="area" height={320}
                                    options={{...chartOptions, xaxis: {categories: stakedRewards.map(data => data[1])}}} 
                                    series={[
                                        {
                                            type: 'area',
                                            name: "",
                                            data: stakedRewards.map(data => data[0])
                                        }
                                    ]}/>
                            </div>
                            {
                                nextVersion &&
                                    <div className="staking-container-right-bottom mooning-purple-border-content">
                                        <div className="button">
                                            Tutorial Video
                                        </div>
                                        <img src={MonkeyImg} alt="monkey_image" />
                                    </div>
                            }
                        </div>
                    </Col>
                </Row>
            </div>
            <LogoFooterComponent />
            
        </div>
    );
}

const mapStateToProps  = (state) => (
    {
        currentChainId: state.userData.currentChainId,
        useChainData: state.userData.useChainData,
        userName: state.userData.userName,
    }
)

export default connect(mapStateToProps, {changeUseChainData, showHisotyModal})(TakStaking)