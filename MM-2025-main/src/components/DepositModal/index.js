import { useState, useEffect } from "react";
import { Modal, Spinner } from "react-bootstrap";
import { ethers, BigNumber } from 'ethers';
import {connect} from 'react-redux'
import { useWeb3React } from "@web3-react/core";
import { BSC_TOKENS, DEPOSIT_WALLET_ADDRESS } from "../../constants/tokens";
import { getTokenContract, getSigner, getBalance, getGasFee } from "../../utils/interact";
import TakCoinImg from '../../assets/images/tak-coin.svg';
import ArrowDownImg from '../../assets/images/arrow-down.svg';
import './index.scss';
import {changeCurrentPage, deposit} from '../../actions/userActions'
import {setPopUp, getGameCoins} from "../../actions/gameActions";

import { withRouter } from "react-router-dom";

const testCoins = [
    {
        tokenName: "asdf",
        tokenImgSrc: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"
    },
    {
        tokenName: "asdf",
        tokenImgSrc: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"
    },
    {
        tokenName: "asdf",
        tokenImgSrc: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"
    },
    {
        tokenName: "asdf",
        tokenImgSrc: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"
    },
    {
        tokenName: "asdf",
        tokenImgSrc: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"
    },
    {
        tokenName: "asdf",
        tokenImgSrc: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"
    },
    {
        tokenName: "asdf",
        tokenImgSrc: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"
    },
    {
        tokenName: "asdf",
        tokenImgSrc: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"
    },
    {
        tokenName: "asdf",
        tokenImgSrc: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"
    },
    {
        tokenName: "asdf",
        tokenImgSrc: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"
    },
    {
        tokenName: "asdf",
        tokenImgSrc: "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"
    }
]


const DepositModal = (props) => {
    const { show, onHide, history, changeCurrentPage, getGameCoins, coins } = props;
    const { account } = useWeb3React();    
    const [selectedCoin, setSelectedCoin] = useState(null);
    const [balance, setBalance] = useState(0);
    const [tokenAmount, setTokenAmount] = useState({
        vale: 0,
        error: null    
    });
    const [showSelect, setShowSelect] = useState(false);
    const [txHash, setTxHash] = useState();
    const [transactionFee, setTransactionFee] = useState(0);
    const [showResult, setShowResult] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [gasFee, setGasFee] = useState(0);
    const [availableAmount, setAvailableAmount] = useState(0);

    const handleToken = (coin) => {
        setSelectedCoin(coin);
        setShowSelect(false);
    };

    const handleDeposit = async () => {
        setIsLoading(true);
        try {
            const signer = getSigner();
            let tx;
            if (selectedCoin.tokenAddress === 'BNBAddress') {
                tx = await signer.sendTransaction({to: DEPOSIT_WALLET_ADDRESS, value: ethers.utils.parseEther(tokenAmount.value.toString())});
            } else {
                const tokenContract = getTokenContract(selectedCoin.tokenAddress);
                tx = await tokenContract.transfer(DEPOSIT_WALLET_ADDRESS, ethers.utils.parseEther(tokenAmount.value.toString()));
            }
            const res = await tx.wait();
            console.log(tx);
            let gasLimit = parseInt(tx.gasLimit._hex, 16);
            let gasPrice = parseInt(tx.gasPrice._hex, 16);
            
            
            setTransactionFee(gasLimit * gasPrice *  Math.pow(10, -18));
            if (res.transactionHash) {
                setIsSuccess(true);
                setTxHash(res.transactionHash);
                setIsLoading(false);
                setShowResult(true);
                let newBalance = await getBalance(account, selectedCoin.tokenAddress);
                setBalance(newBalance);
                deposit(res.transactionHash);
            }
        } catch (error) {
            setPopUp("deposit failed")
            console.log(error);
            setIsLoading(false);
            setIsSuccess(false);
        }
    }

    const handleTokenAmount = (e) => {
        validateAmountSet(e.target.value)
    }
    const validateAmountSet = (value) => {
        let newValue = Math.max(value, 0);
        let err = null;
        if(newValue > availableAmount) {
            err = "Insufficient balance"
        }
        setTokenAmount({
            value: newValue,
            error: err
        })
    }
    useEffect(async () => {
        getGameCoins()
    }, []);
    useEffect(async () => {
        
        const gasFee = await getGasFee()
        setGasFee(gasFee)
    }, [show]);
    useEffect(async () => {
        const _avaliableValue = Math.max(balance - gasFee, 0)
        setAvailableAmount(_avaliableValue)
    }, [balance, gasFee]);
    useEffect(async () => {
        if(coins.length > 0) {
            setSelectedCoin(coins[0])
        }
    }, [coins]);
    useEffect(async () => {
        if (account) {
            try {
                let newBalance = await getBalance(account, selectedCoin.tokenAddress);
                setBalance(newBalance);
            } catch (error) {
                console.log(error);
            }
        }
    }, [selectedCoin, account]);
    
    useEffect(async () => {
        setShowResult(false);
        setTokenAmount({
            value: 0,
            error: null
        })
    }, [show]);
    useEffect(async () => {
        validateAmountSet(tokenAmount.value)
    }, [balance]);

    const gotoHistoryPage = () => {
        history.push("/transaction-history");
        changeCurrentPage("transaction-history");
        onHide();
    }

    return (
        <Modal show={show} onHide={onHide}  className="monkey-modal deposit-modal">
    
            <Modal.Header closeButton closeVariant='white'>
                <Modal.Title><span>DEPOSIT</span></Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <div className="dropdown-container">
                    <div className="title">
                        <h6 className="poppins-bold-text">Select coin</h6>
                    </div>
                    <div className="relative">

                        <div className="dropdown-box p-2">
                            <div className="w-100 d-flex  align-items-center justify-content-start p-1" onClick={() => setShowSelect(!showSelect)}>
                                <div className="d-flex align-items-center">
                                    <img src={selectedCoin ? selectedCoin.tokenImgSrc : "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"} className="mr-2" width="25" alt="" />
                                    <h6 className="mb-0 dropdwon-item-text">{selectedCoin ? selectedCoin.tokenName : "BNB"}</h6>
                                    
                                </div>
                            </div>
                            <img src={ArrowDownImg} alt="" style={{width: "15px"}}/>
                        </div>
                        <div className={`absolute w-100 dropdown-content ${!showSelect ? 'hidden' : 'show'}`}>
                            {
                                coins.map((gameCoin, index) =>
                                    <div key={index} className="d-flex p-2 select-money-item" onClick={() => handleToken(gameCoin)} >
                                        <div className="d-flex align-items-center">
                                            <img src={gameCoin.tokenImgSrc} className="mr-2" width="25" alt="" />
                                            <h6 className="mb-0">{gameCoin.tokenName}</h6>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div> 
                    
                </div>
                <div className={`dropdown-container ${tokenAmount.error ? 'err-field' : ''}`}>
                    <div className="title">
                        <h6 className="poppins-bold-text red-under-error">Amount</h6>              
                    </div>
                    <div className="wallet-amount">
                        <p>Gas fee: {Number(gasFee).toFixed(6)}</p>
                        <p className="poppin-light-txt hint red-under-error">Wallet Balance: <span className="poppin-light-txt">{Number(balance).toFixed(6)} {selectedCoin ? selectedCoin.tokenName : ""} </span></p>    
                    </div>
                    
                    <div className="dropdown-box p-2 red-border-under-error">
                        <div className="w-100 d-flex align-items-center justify-content-between p-1">
                        <input type='number' className="token-amount poppin-bold-txt red-outline-under-error" value={tokenAmount.value} onChange={handleTokenAmount}  />
                            <div className="d-flex align-items-center justify-content-between">
                                <img src={selectedCoin ? selectedCoin.tokenImgSrc : "https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png"} className="mr-2" width="25" alt="" />
                                <h6 className="mb-0 amount-coin poppin-light-txt">{selectedCoin?selectedCoin.tokenName:""}</h6>
                            </div>
                            <div className="flex1 d-flex align-items-center">
                                &nbsp;<span className="poppin-bold-txt">{selectedCoin ? selectedCoin.tokenName : ""}</span>
                                <div className="mb-0 max-btn cursor-pointer poppin-light-txt" onClick={() => validateAmountSet(availableAmount)}>MAX</div>
                            </div>
                        </div>
                        <div className="display-under-error red-under-error error-alert">
                            {tokenAmount.error}   
                        </div>
                    </div>
                </div>
                <p className="deposit-rewards-amount">You will receive: {tokenAmount.value * (selectedCoin ? selectedCoin.tokenMultiplier : 0)} Bits</p>
                <button disabled={tokenAmount.error||isLoading ? true: false} className="cta-btn deposit-btn justify-content-center poppins-bold-text" onClick={()=>handleDeposit()}>
                    {isLoading?<><Spinner className="pending-spinner" animation="border" variant="secondary" />Pending</>:"Deposit"}
                </button>
                <div className="justify-content-between d-flex mt-4 mb-1">
                    <h6 className="text-light">Recent Transactions</h6>
                    <div onClick={()=>gotoHistoryPage()} className="text-light view-history-btn poppin-light-txt view-history" style={{textDecoration: "underline !important"}}>View History</div>
                </div>
                
                {
                    showResult &&
                    (
                        isSuccess ?
                            <div className="recent-transaction-history">
                                <div className="rth-row">
                                    <div>Deposit</div>
                                    <div className="success-box">
                                    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.12375 13.2457C8.93275 13.2457 8.73975 13.1727 8.59375 13.0258L6.21975 10.6528C5.92675 10.3598 5.92675 9.88575 6.21975 9.59275C6.51275 9.29975 6.98675 9.29975 7.27975 9.59275L9.12375 11.4348L13.3397 7.21975C13.6328 6.92675 14.1067 6.92675 14.3997 7.21975C14.6927 7.51275 14.6927 7.98675 14.3997 8.27975L9.65375 13.0258C9.50775 13.1727 9.31575 13.2457 9.12375 13.2457Z" fill="#6DE713"/>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10 1.5C5.313 1.5 1.5 5.313 1.5 10C1.5 14.687 5.313 18.5 10 18.5C14.687 18.5 18.5 14.687 18.5 10C18.5 5.313 14.687 1.5 10 1.5ZM10 20C4.486 20 0 15.514 0 10C0 4.486 4.486 0 10 0C15.514 0 20 4.486 20 10C20 15.514 15.514 20 10 20Z" fill="#6DE713"/>
                                        </svg>
                                    <strong className="text-green">Success</strong>
                                    </div>
                                </div>
                                <div className="rth-row">
                                    <div>Amount({selectedCoin.tokenName})</div>
                                    <div>{tokenAmount.value}</div>
                                </div>
                                <div className="rth-row">
                                    <div>Fee({selectedCoin.tokenName})</div>
                                    <div>{transactionFee}</div>
                                </div>
                                <div className="rth-row">
                                    <div>Hash</div>
                                    <div>{`${txHash.substring(0, 9)}...${txHash.slice(-5)}`}</div>
                                </div>
                            </div>
                            :
                            <div className="recent-transaction-history">
                                <div className="rth-row">
                                    <div>Deposit</div>
                                    <div className="success-box">
                                    <svg width="15" height="15" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M9.12375 13.2457C8.93275 13.2457 8.73975 13.1727 8.59375 13.0258L6.21975 10.6528C5.92675 10.3598 5.92675 9.88575 6.21975 9.59275C6.51275 9.29975 6.98675 9.29975 7.27975 9.59275L9.12375 11.4348L13.3397 7.21975C13.6328 6.92675 14.1067 6.92675 14.3997 7.21975C14.6927 7.51275 14.6927 7.98675 14.3997 8.27975L9.65375 13.0258C9.50775 13.1727 9.31575 13.2457 9.12375 13.2457Z" fill="#6DE713"/>
                                        <path fillRule="evenodd" clipRule="evenodd" d="M10 1.5C5.313 1.5 1.5 5.313 1.5 10C1.5 14.687 5.313 18.5 10 18.5C14.687 18.5 18.5 14.687 18.5 10C18.5 5.313 14.687 1.5 10 1.5ZM10 20C4.486 20 0 15.514 0 10C0 4.486 4.486 0 10 0C15.514 0 20 4.486 20 10C20 15.514 15.514 20 10 20Z" fill="#6DE713"/>
                                        </svg>
                                    <strong className="text-red">Failed</strong>
                                    </div>
                                </div>
                            </div>
                        )
                }
            </Modal.Body>
        </Modal>
    );
}

const mapStateToProps  = (state) => (
    {
        coins: state.betGameData.coins
    }
)
export default withRouter(connect(mapStateToProps, {changeCurrentPage, getGameCoins})(DepositModal))
//https://s2.coinmarketcap.com/static/img/coins/64x64/1839.png