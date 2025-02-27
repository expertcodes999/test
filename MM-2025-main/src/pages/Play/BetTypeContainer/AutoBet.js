import { useState, useEffect, useRef } from 'react';
import { Row, Col, Form, ButtonGroup, ToggleButton } from 'react-bootstrap';
import {connect} from 'react-redux'
import { MDBBtn, MDBWaves, MDBTooltip } from "mdb-react-ui-kit";

import InputComponent from '../../../components/InputComponent';
import {GAME_STATE, betAmountMultiple, BET_COIN, SOUND_TYPE} from '../../../utils/types'
import {betRequest, setAutoBet, stopAutoBet, stopBet, setMaxCredits} from '../../../actions/betActions'
import { playBetSoundAction, showSelectWalletModal, setPopUp, changeBetCoin, setRoundWin } from '../../../actions/gameActions'
import BottomLineInputComponent from "../../../components/BottomLineInputComponent";
import ConvertBetCoinTypeModal from "../../../components/ConvertBetCoinTypeModal";

import MooningBottomLineInput from "../../../components/BottomLineInputWithValidate";
import Tooltip from "../../../components/Tooltip";
import rocketIcon from '../../../assets/images/playpage/rocket_icon.png';
import { bnbMultiByBits } from '../../../utils/constant'
import GradientQuestionCircleFill from '../../../components/GradientQuestionCircleFill';
import handIcon from '../../../assets/images/playpage/hand_icon.svg';


const valueUpdateType = {
    INCREASE: 'INCREASE',
    RESET: 'RESET'
}

let prevSelectedCoin = BET_COIN.NONE
let totalProfit = 0;
let didBet = false;
let currentInfiniteMode = false;
let currentTotalBetCount = 0
function usePrevious(value) {
    // The ref object is a generic container whose current property is mutable ...
    // ... and can hold any value, similar to an instance property on a class
    const ref = useRef();
    // Store current value in ref
    useEffect(() => {
      ref.current = value;
    }, [value]); // Only re-run if value changes
    // Return previous value (happens before update in useEffect above)
    return ref.current;
  }
const AutoBet = (props) => {
    const {isMobile, gameState, maxCredits, autoBetState, betState, gameResult, 
        showSelectWalletModal, currentBetCoin, setRoundWin,
        bettedMultiplier, setMaxCredits, winOnRound, loadingBetRequest, displayValue, 
        changeBetCoin, playBetSoundAction, userName,
        myRecentWin, setAutoBet, betRequest, stopAutoBet, stopBet, bettedAmount, logged} = props;
    
    const [betAmount, setBetAmount] = useState(1);
    const [betAmountMin, setBetAmountMin] = useState(1);
    const [betAmountMax, setBetAmountMax] = useState(1);
    const [autoCashOut, setAutoCashOut] = useState(3);
    const [maxDeciamlCountForInput, setMaxDecimalCount] = useState(4);
    const [displayConvertModal, setDisplayConvertModal] = useState(false);
    const [convertCoinType, setCovertCoinType] = useState(BET_COIN.NONE);
    const [isStopingBet, setIsStopingBet] = useState(false);
    const [totalBets, setTotalBets] = useState(0);
    const [profitAmount, setProfitAmount] = useState("");
    const [onWin, setOnWin] = useState({
        amount: 0,
        type: valueUpdateType.RESET
    });
    const [playButtonStyle, setPlayButtonStyle] = useState({
        btnIcon: rocketIcon,
        disableBtn: true, 
        buttonName: "",
        btnClassName: "disable-play",
        btnAction: () => {}
    });
    const [onLoss, setOnLoss] = useState({
        amount: 0,
        type: valueUpdateType.RESET
    });
    const [firstData, setFirstData] = useState({
        cashOut: 0
    });
    const [stopOnProfit, setStopOnProfit] = useState(0);
    const [stopOnLoss, setStopOnLoss] = useState(0);
    const [infiniteMode, setInfiniteMode] = useState(false);
    const [originalBetAmount, setOriginalBetAmount] = useState(0);
    const [btnState, setBtnState] = useState({
        startBtn: {
            display: true,
            disable: false
        }, 
        stopBtn: {
            display: false,
            disable: false
        }     
    })
    const [inputVaild, setInputValid] = useState({
        betAmount: true,
        autoCashout: true,
        onWin: true,
        onLoss: true,
        stopOnProfit: true,
        stopOnLoss: true
    });

    const doBet = () => {
        if(betState || loadingBetRequest) return
        didBet = true;
        let _amount;
        switch(currentBetCoin) {
            case BET_COIN.BNB:
                _amount = betAmount * bnbMultiByBits;
                break;
            case BET_COIN.BITS:
                _amount = betAmount;
                break;
        }
        betRequest(userName, _amount, autoCashOut)
        //console.log("!!!! auto bet request: ", _amount)
    }
    const acceptFunction = (convertCoinType) => {
        window.localStorage.setItem('betCoinType', convertCoinType);
        changeBetCoin(convertCoinType)
    }
    const stopAutoBetAction = () => {
        didBet = false
        setInfiniteMode(false)
        //console.log("infinite mode: false")
        stopAutoBet()
    }
    const updateAutoValues = () => {
        let profit = 0;
        let _autoBetAmount = 0;
        console.log("update auto value game result: ", gameResult)
        if(gameResult >= bettedMultiplier) {
            profit = betAmount * bettedMultiplier;
            if(onWin.type === valueUpdateType.INCREASE) {
                _autoBetAmount = Number(betAmount) * (100 + Number(onWin.amount)) / 100;
                setBetAmount(_autoBetAmount)
            }
            if(onWin.type === valueUpdateType.RESET) {
                
            }
        }
        else {
            profit = -betAmount;
            if(onLoss.type === valueUpdateType.INCREASE) {
                let _autoBetAmount = Number(betAmount) * (100 + Number(onLoss.amount)) / 100;
                setBetAmount(_autoBetAmount)
            }
            if(onLoss.type === valueUpdateType.RESET) {
                
            }
        }
        totalProfit = Number(profit) + Number(totalProfit);
    }
    const prevGameState = usePrevious(gameState);
    useEffect(
        () => {
            if(autoBetState) {    
                switch(gameState) {
                    case GAME_STATE.RUNNING:

                    break;
                    case GAME_STATE.CRASHED:
                        if(prevGameState === GAME_STATE.RUNNING) {   
                            if(!currentInfiniteMode) {
                                if(Number(currentTotalBetCount) > 0) {
                                    //console.log("~~~~~auto bet current infinite mode: ", currentInfiniteMode, infiniteMode)
                                }
                                else {
                                    //console.log("~~~~~auto bet stoped by count RUNNING", totalBets, currentTotalBetCount)
                                    stopAutoBetAction()
                                }
                            }
                            //console.log("~~~~didBet: ", didBet)
                            if(didBet) {
                                updateAutoValues()
                            }
                            //console.log("~~~~check profits: ", totalProfit, stopOnProfit)
                            if(totalProfit >= Number(stopOnProfit) && Number(stopOnProfit) > 0) {
                                setPopUp("Auto bet has stopped. Your “Stop on Profit” has been met.")
                                stopAutoBetAction()
                            }
                            if(totalProfit <= -Number(stopOnLoss) && Number(stopOnLoss) > 0) {
                                setPopUp("Auto bet has stopped. Your “Stop on Loss” has been met.")
                                stopAutoBetAction()
                            }
                        }
                        didBet = false
                    break;
                    case GAME_STATE.WAITING:
                        if(autoBetState && !didBet) {   
                            if(currentInfiniteMode) {
                                doBet()
                            }
                            else {
                                if(Number(currentTotalBetCount) > 0) {
                                    setTotalBets(Number(currentTotalBetCount) - 1)
                                    doBet()
                                }
                                else {
                                    console.log("~~~~~auto bet stoped by count WAITING", currentTotalBetCount)
                                    stopAutoBetAction()
                                }
                            }
                        }                        
                    break;
                }
            }
        },
        [gameState],
    );
    useEffect(
        () => {
            if(betState && autoBetState && gameState === GAME_STATE.RUNNING && displayValue < bettedMultiplier) {    
                setProfitAmount(Number(displayValue * bettedAmount).toFixed(2))
            }
            else {
                setProfitAmount("")
            }
        },
        [displayValue],
    );
    useEffect(
        () => {
            //console.log("infinite mode changed ", infiniteMode)
            currentInfiniteMode = infiniteMode
        },
        [infiniteMode],
    );
    useEffect(
        () => {
            currentTotalBetCount = totalBets
        },
        [totalBets],
    );
    
    useEffect(
        () => {
            if(currentBetCoin === BET_COIN.BITS) {
                setMaxDecimalCount(0)
                if(prevSelectedCoin === BET_COIN.BNB) {
                    setBetAmount(betAmount * bnbMultiByBits)
                    setStopOnProfit(stopOnProfit * bnbMultiByBits)
                    setStopOnLoss(stopOnLoss * bnbMultiByBits)
                }
                
            }
            if(currentBetCoin === BET_COIN.BNB) {
                setMaxDecimalCount(4)
                if(prevSelectedCoin === BET_COIN.BITS) {
                    setBetAmount(betAmount / bnbMultiByBits)
                    setStopOnProfit(stopOnProfit / bnbMultiByBits)
                    setStopOnLoss(stopOnLoss / bnbMultiByBits)
                }
            }
            prevSelectedCoin = currentBetCoin
        },
        [currentBetCoin],
    );
    useEffect(
        () => {
            if(currentBetCoin === BET_COIN.BITS) {
                setBetAmountMin(1)
                setBetAmountMax(maxCredits)
            }
            if(currentBetCoin === BET_COIN.BNB) {
                setBetAmountMin(1 / bnbMultiByBits)
                setBetAmountMax(maxCredits / bnbMultiByBits)
            }
        },
        [currentBetCoin, maxCredits],
    );
    useEffect(
        () => {
            if(loadingBetRequest) {
                setPlayButtonStyle({
                    btnIcon: null,
                    disableBtn: true, 
                    buttonName: "PLACING BET",
                    btnClassName: "stop-auto-bet opacity",
                    btnAction: () => {}
                })
            }
            else if(isStopingBet) {
                setPlayButtonStyle({
                    btnIcon: rocketIcon,
                    disableBtn: true, 
                    buttonName: "CASHING OUT…",
                    btnClassName: "stop-auto-bet",
                    btnAction: () => {}
                })
            }
            else if(autoBetState) {    
                if(betState) {
                    if(gameState === GAME_STATE.RUNNING && bettedMultiplier > displayValue) {
                        setPlayButtonStyle({
                            btnIcon: handIcon,
                            disableBtn: false, 
                            buttonName: `${Number(displayValue * bettedAmount).toFixed(2)} STOP AUTOBET`,
                            btnClassName: "stop-auto-bet",
                            btnAction: () => {clickStopBtn()}
                        })
                    }
                    else {
                        setPlayButtonStyle({
                            btnIcon: null,
                            disableBtn: false, 
                            buttonName: "CANCEL AUTOBET",
                            btnClassName: "stop-auto-bet",
                            btnAction: () => {clickCancelAutoBetBtn()}
                        })
                    }
                }
                else {
                    setPlayButtonStyle({
                        btnIcon: null,
                        disableBtn: false, 
                        buttonName: "CANCEL AUTOBET",
                        btnClassName: "stop-auto-bet",
                        btnAction: () => {clickCancelAutoBetBtn()}
                    })
                }
            }
            else {
                setPlayButtonStyle({
                    btnIcon: rocketIcon,
                    disableBtn: false, 
                    buttonName: "START AUTOBET",
                    btnClassName: "start-auto-bet",
                    btnAction: () => {clickAutoBetBtn()}
                })
            }
        },
        [gameState, betState, autoBetState, loadingBetRequest, displayValue, bettedAmount, bettedMultiplier],
    );
    
    const clickAutoBetBtn = () => {
        //console.log("clickAutoBetBtn")
        playBetSoundAction(SOUND_TYPE.PLAY)
        if(!logged) {
            showSelectWalletModal()
            return;
        }
        totalProfit = 0;
        if(betAmount > 0) {    
            setInfiniteMode(Number(totalBets) === 0)
            //console.log("infinite mode: ", Number(totalBets) === 0)
            setOriginalBetAmount(betAmount)
            if(!autoBetState) {
                setAutoBet()
                if(gameState === GAME_STATE.WAITING) {
                    doBet()
                }
            }
        }
        else {
            setPopUp("Please use a bet amount larger then 0!")
        }
    }
    const clickBetCoinButton = (coinType) => {
        setDisplayConvertModal(true)
        setCovertCoinType(coinType)
        //setBetCoin(coinType)
    }
    const clickCancelAutoBetBtn = async () => {
        playBetSoundAction(SOUND_TYPE.CANCEL)
        stopAutoBetAction()
    }
    const clickStopBtn = async () => {
        const stopValue = displayValue
        const baseMultiplier = bettedMultiplier
        if(stopValue < baseMultiplier ) {
            playBetSoundAction(SOUND_TYPE.STOP_ON_PLAYING)
        }
        else {
            playBetSoundAction(SOUND_TYPE.CANCEL)
        }
        stopAutoBetAction()
        if(gameState === GAME_STATE.RUNNING && betState && !winOnRound) {
            setIsStopingBet(true)
            const stoped = await stopBet(stopValue);
            setIsStopingBet(false)
            if(stoped && stopValue < baseMultiplier) {
                setRoundWin(true)
                setMaxCredits(bettedAmount * stopValue + maxCredits)
            }
        }
        
        totalProfit = 0;
    }
    const clickOnWinRadioBtn = (param) => {
        if(param === valueUpdateType.RESET) {
            setOnWin({
                ...onWin,
                amount: 0,
                type: param
            })
        }
        else {
            setOnWin({
                amount: 1,
                type: param
            })
        }
    }
    const clickOnLossRadioBtn = (param) => {
        //console.log("asdf", param)
        if(param === valueUpdateType.RESET) {
            setOnLoss({
                ...onLoss,
                amount: 0,
                type: param
            })
        }
        else {
            setOnLoss({
                amount: 1,
                type: param
            })
        }
    }
    const changeTotalBet = (value) => {
        if(value === "") {
            setTotalBets(0)
        }
        else {
            setTotalBets(Math.floor(Number(value)))
        }
    }
    const validateAmount = (amount) => {
        setBetAmount(amount)
        let decimalCount = 0;
        if(Math.floor(amount) !== Number(amount)) {
            decimalCount = amount.toString().split(".")[1].length
        }
        setInputValid({
            ...inputVaild,
            betAmount: decimalCount <= maxDeciamlCountForInput
        })
    }
    const validateCashout = (amount) => {
        setAutoCashOut(amount)
        let decimalCount = 0;
        if(Math.floor(amount) !== Number(amount)) {
            decimalCount = amount.toString().split(".")[1].length
        }
        setInputValid({
            ...inputVaild,
            autoCashout: decimalCount <= 2
        })
    }

    const validateOnWin = (amount) => {
        changeOnWinValue(Math.floor(Number(amount)))
    }

    const validateOnLoss = (amount) => {
        changeOnLossValue(Math.floor(Number(amount)))
    }

    const validateStopOnProfit = (amount) => {
        changeStopOnProfit(amount)
        let decimalCount = 0;
        if(Math.floor(amount) !== Number(amount)) {
            decimalCount = amount.toString().split(".")[1].length
        }
        setInputValid({
            ...inputVaild,
            stopOnProfit: decimalCount <= maxDeciamlCountForInput
        })
    }

    const validateStopOnLoss = (amount, maxBalance) => {
        changeStopOnLoss(amount, maxBalance)
        let decimalCount = 0;
        if(Math.floor(amount) !== Number(amount)) {
            decimalCount = amount.toString().split(".")[1].length
        }
        setInputValid({
            ...inputVaild,
            stopOnLoss: decimalCount <= maxDeciamlCountForInput
        })
    }

    const changeOnWinValue = (value) => {
        if(value === "") {
            setOnWin({amount: 0, type: valueUpdateType.RESET})
        }
        else {
            if(value < 1){
                setOnWin({amount: value, type: valueUpdateType.RESET})
            }else{
                setOnWin({amount: value, type: valueUpdateType.INCREASE})
            }
        }

    }
    const changeOnLossValue = (value) => {
        if(value === "") {
            setOnLoss({amount: 0, type: valueUpdateType.RESET})
        }
        else {
            if(value < 1){
                setOnLoss({amount: value, type: valueUpdateType.RESET})
            }else{
                setOnLoss({amount: value, type: valueUpdateType.INCREASE})
            }
        }
    }
    const changeStopOnProfit = (value) => {
        if(value === "") {
            setStopOnProfit(0)
        }
        else {
            setStopOnProfit(value)
        }
    }
    const changeStopOnLoss = (value, maxBalance) => {
        if(Number(value) > Number(maxBalance)) {
            setPopUp("Stop on Loss amount must be lower than your current balance.")
            setStopOnLoss(maxBalance.toString())
        }
        else {
            setStopOnLoss(value)
        }
    }
    const clickChangeBetAmountBtn = (multipleAmount) => {
        let _betAmount = 1;
        switch(multipleAmount) {
            case betAmountMultiple.half:
                _betAmount = Math.max(betAmount / 2, 1 / bnbMultiByBits)
                break;
            case betAmountMultiple.double:
                _betAmount = betAmount * 2
                break;
            case betAmountMultiple.max:
                if(currentBetCoin === BET_COIN.BNB) {
                    _betAmount = maxCredits / bnbMultiByBits
                }
                else {
                    _betAmount = maxCredits
                }
                
                break;
            case betAmountMultiple.min:
                if(currentBetCoin === BET_COIN.BNB) {
                    _betAmount = 1 / bnbMultiByBits
                }
                else {
                    _betAmount = 1
                }
                break;
        }
        setBetAmount(Math.min(_betAmount, maxCredits).toFixed(maxDeciamlCountForInput));
    }
    return (
        <div className="auto-bet bet-info">
            <div className="validate-alert-field">
                {
                    (!inputVaild.betAmount || !inputVaild.autoCashout || !inputVaild.onWin || !inputVaild.onLoss || !inputVaild.stopOnProfit || !inputVaild.stopOnLoss) &&
                    <p className="validate-alert-text">Input is not a valid number</p>
                }
                </div>
            <div className="bet-amount bet-detail">
                <MooningBottomLineInput label="Bet Amount" disableModify={autoBetState} minValue={betAmountMin} maxValue={betAmountMax}
                        type="number" prefix={currentBetCoin} valueChangeHandler={validateAmount}
                        valid={inputVaild.betAmount} floatCount={maxDeciamlCountForInput} defaultValue={betAmount} />
                <div className="sub-detail-content">
                    <button disabled={autoBetState} className="detail amount-change-btn" tabindex="1" onClick={()=>clickChangeBetAmountBtn(betAmountMultiple.half)}>1/2</button>
                    <button disabled={autoBetState} className="detail amount-change-btn" tabindex="2" onClick={()=>clickChangeBetAmountBtn(betAmountMultiple.double)}>x2</button>
                    <button disabled={autoBetState} className="detail amount-change-btn" tabindex="3" onClick={()=>clickChangeBetAmountBtn(betAmountMultiple.max)}>Max</button>
                    <button disabled={autoBetState} className="detail amount-change-btn" tabindex="4" onClick={()=>clickChangeBetAmountBtn(betAmountMultiple.min)}>Min</button>
                    <ButtonGroup className="bet-coin-radio-group">
                        <ToggleButton
                            id="bet-coin-radio-2"
                            type="radio"
                            className={`bits-radio ${currentBetCoin === BET_COIN.BITS ?
                                "checked-radio" : "unchecked-radio"} ${autoBetState ? "modify-disable" : ""}`}
                            name="bits-radio"
                            value={BET_COIN.BITS}
                            checked={currentBetCoin === BET_COIN.BITS}
                            onClick={autoBetState ? () => {} : (e) => clickBetCoinButton(BET_COIN.BITS)}
                        >
                            {BET_COIN.BITS}
                        </ToggleButton>
                        <ToggleButton
                            id="bet-coin-radio-1"
                            type="radio"
                            className={`bits-radio ${currentBetCoin === BET_COIN.BNB ?
                                "checked-radio" : "unchecked-radio"} ${autoBetState ? "modify-disable" : ""}`}
                            name="bits-radio"
                            value={BET_COIN.BNB}
                            checked={currentBetCoin === BET_COIN.BNB}
                            onClick={autoBetState ? () => {} : (e) => clickBetCoinButton(BET_COIN.BNB)}
                        >
                            {BET_COIN.BNB}
                        </ToggleButton>
                        
                        
                    </ButtonGroup>
                </div>
            </div>
            <div className="bet-detail multi-detail">
                <div className="auto-cashout">
                    <MooningBottomLineInput disableModify={autoBetState} label="Auto Cashout" minValue={1.01} maxValue={100000}
                        type="number" prefix="X" valueChangeHandler={validateCashout} fixedDecimalCount={2}
                        defaultValue={autoCashOut} valid={inputVaild.autoCashout}  />
                </div>
                <div className="total-bet">
                    
                    <MooningBottomLineInput disableModify={autoBetState} label="Number of Rounds" minValue={0} 
                        className="fill-input moon-bet-input purple-bg-input-child" 
                        type="number" prefix="x" valueChangeHandler={changeTotalBet}
                        floatCount={0} defaultValue={totalBets} valid={true} fixedDecimalCount={0}/>
                    {
                        totalBets <= 0 &&
                        <div className="sub-detail-content">
                            <span className="detail">Ꚙ</span>
                        </div>
                    }
                </div>
            </div>
            <div className="on-win bet-detail">
                <MooningBottomLineInput disableModify={autoBetState} label="On Win"
                    className="fill-input moon-bet-input purple-bg-input-child" fixedDecimalCount={0}
                    type="number" prefix="%" valueChangeHandler={validateOnWin} floatCount={0} 
                    defaultValue={onWin.amount}  valid={inputVaild.onWin} minValue={0}/>
                
                <div className="sub-detail-content">
                <ButtonGroup>
                    <ToggleButton
                        id="radio-1"
                        type="radio"
                        className={`on-win-radio ${onWin.type === valueUpdateType.INCREASE ?
                            "checked-radio" : "unchecked-radio"} ${autoBetState ? "modify-disable" : ""}`}
                        name="on-win-radio"
                        value={valueUpdateType.INCREASE}
                        checked={onWin.type === valueUpdateType.INCREASE}
                        onClick={autoBetState ? () => {} : (e) => clickOnWinRadioBtn(valueUpdateType.INCREASE)}
                    >
                        Increase
                    </ToggleButton>
                    <ToggleButton
                        id="radio-2"
                        type="radio"
                        className={`on-win-radio ${onWin.type === valueUpdateType.RESET ?
                            "checked-radio" : "unchecked-radio"} ${autoBetState ? "modify-disable" : ""}`}
                        name="on-win-radio"
                        value={valueUpdateType.RESET}
                        checked={onWin.type === valueUpdateType.RESET}
                        onClick={autoBetState ? () => {} : (e) => clickOnWinRadioBtn(valueUpdateType.RESET)}
                    >
                        Reset
                    </ToggleButton>
                </ButtonGroup>
                </div>
            </div>

            <div className="on-loss bet-detail">
                <MooningBottomLineInput disableModify={autoBetState} label="On Loss" fixedDecimalCount={0}
                    className="fill-input moon-bet-input purple-bg-input-child"  floatCount={0}
                    type="number" prefix="%" valueChangeHandler={validateOnLoss}
                    defaultValue={onLoss.amount}  valid={inputVaild.onLoss} minValue={0} />
                
                <div className="sub-detail-content">
                    <ButtonGroup>
                        
                        <ToggleButton
                            id="loss-radio-1"
                            type="radio"
                            className={`on-loss-radio ${onLoss.type === valueUpdateType.INCREASE ?
                                "checked-radio" : "unchecked-radio"} ${autoBetState ? "modify-disable" : ""}`}
                            name="on-loss-radio"
                            value={valueUpdateType.INCREASE}
                            checked={onLoss.type === valueUpdateType.INCREASE}
                            onClick={autoBetState ? () => {} : (e) => clickOnLossRadioBtn(valueUpdateType.INCREASE)}
                        >
                            Increase
                        </ToggleButton>
                        <ToggleButton
                            id="loss-radio-2"
                            type="radio"
                            className={`on-loss-radio ${onLoss.type === valueUpdateType.RESET ?
                                "checked-radio" : "unchecked-radio"} ${autoBetState ? "modify-disable" : ""}`}
                            name="on-loss-radio"
                            value={valueUpdateType.RESET}
                            checked={onLoss.type === valueUpdateType.RESET}
                            onClick={autoBetState ? () => {} :  (e) => clickOnLossRadioBtn(valueUpdateType.RESET)}
                        >
                            Reset
                        </ToggleButton>
                        
                    </ButtonGroup>
                </div>
            </div>
            
            <div className="bet-detail multi-detail">
                <div className="stop-on-profit">
                    <MooningBottomLineInput disableModify={autoBetState} label="Stop On Profit"
                        className="fill-input moon-bet-input purple-bg-input-child" 
                        minValue={0} floatCount={maxDeciamlCountForInput}
                        type="number" prefix={currentBetCoin} valueChangeHandler={validateStopOnProfit}
                        defaultValue={stopOnProfit} valid={inputVaild.stopOnProfit} />
                    <div className="sub-detail-content">
                        <Tooltip
                            width="300px"
                            content="Use “Stop on Profit” to stop Auto Bet after profiting a specific amount. For Example, if you start with 100 Bits and you set “Stop on Profit” at 125. 

                                    If your balance went above 125 Bits, Auto Bet will stop." 
                            direction="bottom">
                            <span className="detail"><GradientQuestionCircleFill /></span>
                        </Tooltip>
                    </div>
                </div>
                <div className="stop-on-loss">
                    <MooningBottomLineInput disableModify={autoBetState} label="Stop On Loss"
                        className="fill-input moon-bet-input purple-bg-input-child" 
                        maxValue={maxCredits} floatCount={maxDeciamlCountForInput}
                        type="number" prefix={currentBetCoin} valueChangeHandler={(value)=>validateStopOnLoss(value, maxCredits)}
                        defaultValue={stopOnLoss} valid={inputVaild.stopOnLoss} />
                    <div className="sub-detail-content">
                        <Tooltip
                            width="300px"
                            content="Use “Stop on Loss” to stop Auto Bet after losing a specific amount. For Example, if you start with 100 Bits and you set “Stop on Loss” at 25. 

                            If your balance went below 75 Bits, Auto Bet will stop." 
                            direction="bottom">
                            <span className="detail"><GradientQuestionCircleFill /></span>
                        </Tooltip>
                    </div>
                </div>
            </div>
            <MDBBtn disabled={playButtonStyle.disableBtn} className={`play-button ${playButtonStyle.btnClassName}`}
                onClick={()=>playButtonStyle.btnAction()}>
                    {
                        playButtonStyle.btnIcon!==null &&
                            <img src={playButtonStyle.btnIcon}/>
                    }
                <span>{playButtonStyle.buttonName}</span>
            </MDBBtn>
            <div className="my-recent-wins">
                <div className="title"><span>My Recent Wins</span></div>
                <div className="data-content">
                    <div className="data-header">
                        <div className="detail">Wager</div>
                        <div className="detail">Multi</div>
                        <div className="detail">Payout</div>
                    </div>
                    <div className="data-list">
                        <table className="table">
                            <tbody>
                            {
                                myRecentWin.length > 0 &&
                                myRecentWin.map((data, index) => 
                                    <tr>
                                        <td>{data.bet}</td>
                                        <td>{data.multiplier}X</td>
                                        <td>{Number(data.payout).toFixed(2)}</td>
                                    </tr>
                                )
                            }
                            
                            </tbody>
                            
                        </table>
                    </div>
                </div>
            </div>
            <ConvertBetCoinTypeModal show={displayConvertModal} targetType={convertCoinType}
                acceptFunc={()=>{acceptFunction(convertCoinType)}} cancelFunc={()=>{}}
                onHide={()=>setDisplayConvertModal(false)}/>
        </div>
    );
}
const mapStateToProps  = (state) => (
    {
        autoBetState: state.betData.autoBetState,
        betState: state.betData.betState,
        loadingBetRequest: state.betData.loadingBetRequest,
        maxCredits: state.betData.maxCredits,
        gameResult: state.gameValue.gameResult,
        displayValue: state.displayData.value,
        currentBetCoin: state.betGameData.currentBetCoin,
        gameState: state.gameValue.gameState,
        myRecentWin: state.userData.myRecentWin,
        logged: state.userData.logged,
        bettedMultiplier: state.betData.multiplier,
        bettedAmount: state.betData.betAmount,
        userName: state.userData.userName,
        winOnRound: state.betGameData.winOnRound
    }
)

export default connect(mapStateToProps, {betRequest, setAutoBet, stopAutoBet, stopBet, setRoundWin, 
    showSelectWalletModal, setMaxCredits, changeBetCoin, playBetSoundAction})(AutoBet)