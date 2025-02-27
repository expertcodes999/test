import { useState, useEffect, Fragment } from 'react';
import { MDBBtn, MDBWaves } from "mdb-react-ui-kit";
import { ButtonGroup, ToggleButton } from 'react-bootstrap';
import InputComponent from "../../../components/InputComponent";
import BottomLineInputComponent from "../../../components/BottomLineInputComponent";
import MooningBottomLineInput from "../../../components/BottomLineInputWithValidate";
import ConvertBetCoinTypeModal from "../../../components/ConvertBetCoinTypeModal";

import {connect} from 'react-redux'
import {betRequest, stopBet, setMaxCredits} from '../../../actions/betActions'
import { bookBet, stopBookBet, showSelectWalletModal, changeBetCoin, 
    playCloseButtonClickSoundAction, setPopUp, playBetSoundAction, setRoundWin} from '../../../actions/gameActions'
import {BET_COIN, GAME_STATE, betAmountMultiple, SOUND_TYPE} from '../../../utils/types'
import rocketIcon from '../../../assets/images/playpage/rocket_icon.png';
import bnb1Img from '../../../assets/images/playpage/bnb1.png';
import handIcon from '../../../assets/images/playpage/hand_icon.svg';

const bnbMultiByBits = 10000
let prevSelectedCoin = BET_COIN.NONE
const myRecentWinsTestData = [
    {
        bet: 1,
        multiplier: 1,
        payout: 1
    },
    {
        bet: 1,
        multiplier: 1,
        payout: 1
    },
    {
        bet: 1,
        multiplier: 1,
        payout: 1
    },
    {
        bet: 1,
        multiplier: 1,
        payout: 1
    },
    {
        bet: 1,
        multiplier: 1,
        payout: 1
    },
    {
        bet: 1,
        multiplier: 1,
        payout: 1
    },
    {
        bet: 1,
        multiplier: 1,
        payout: 1
    },
    {
        bet: 1,
        multiplier: 1,
        payout: 1
    },
    {
        bet: 1,
        multiplier: 1,
        payout: 1
    },
    {
        bet: 1,
        multiplier: 1,
        payout: 1
    },
    {
        bet: 1,
        multiplier: 1,
        payout: 1
    },
    {
        bet: 1,
        multiplier: 1,
        payout: 1
    }
]
const ManualBet = (props) => {

    const {maxCredits, betState, currentBetCoin, betRequest, gameState, isBetBooked, 
        showSelectWalletModal, bookBet, loadingBetRequest,
        logged, myRecentWin, displayValue, setRoundWin, userName,
        stopBet, bettedMultiplier, bettedAmount, bookedAmount, stopBookBet,
        bookedMultiplier, setMaxCredits, winOnRound, autoBetState, changeBetCoin, 
        playCloseButtonClickSoundAction,
        playBetSoundAction} = props;
    const [betAmount, setBetAmount] = useState(1);
    const [betAmountMin, setBetAmountMin] = useState(1);
    const [betAmountMax, setBetAmountMax] = useState(1);
    const [displayConvertModal, setDisplayConvertModal] = useState(false);
    const [convertCoinType, setCovertCoinType] = useState(BET_COIN.NONE);
    const [maxDeciamlCountForInput, setMaxDecimalCount] = useState(4);
    const [isStopingBet, setIsStopingBet] = useState(false);
    
    const [inputVaild, setInputValid] = useState({
        betAmount: true,
        autoCashout: true
    });
    const [multiplier, setMultiplier] = useState(3);
    const [cursorPos, setWaveState] = useState({});
    const [playerButtonStyle, setPlayerButtonStyle] = useState({
        btnIcon: rocketIcon,
        disableBtn: false, 
        buttonName: "BET",
        btnClassName: "enable-play",
        btnAction: () => {
            playBetSoundAction(SOUND_TYPE.PLAY)}
    });
    useEffect(() => {
        const readScamMessage = window.localStorage.getItem('betCoinType');
        if(readScamMessage === "BNB") {
            changeBetCoin(BET_COIN.BNB);
        }
        else {
            changeBetCoin(BET_COIN.BITS);
        }
    },[]);
    const acceptFunction = (convertCoinType) => {
        window.localStorage.setItem('betCoinType', convertCoinType);
        changeBetCoin(convertCoinType)
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
        let _maxAmount = currentBetCoin === BET_COIN.BNB ? maxCredits / bnbMultiByBits : maxCredits
        setBetAmount(Math.min(_betAmount, _maxAmount).toFixed(maxDeciamlCountForInput));
    }
    const clickBetCoinButton = (coinType) => {
        setDisplayConvertModal(true)
        setCovertCoinType(coinType)
        //setBetCoin(coinType)
    }
    const clickPlayBtn = () => {
        if(!logged) {
            showSelectWalletModal()
            return
        }
        if(gameState === GAME_STATE.WAITING) {
            let _amount;
            switch(currentBetCoin) {
                case BET_COIN.BNB:
                    _amount = betAmount * bnbMultiByBits;
                    break;
                case BET_COIN.BITS:
                    _amount = betAmount;
                    break;
            }

            doBet(_amount, multiplier);
            setPlayerButtonStyle({disableBtn: true, btnIcon: rocketIcon, buttonName: "BET", btnClassName: "disable-play", btnAction: () => {}})
        }
        else {
            let _amount;
            switch(currentBetCoin) {
                case BET_COIN.BNB:
                    _amount = betAmount * bnbMultiByBits;
                    break;
                case BET_COIN.BITS:
                    _amount = betAmount;
                    break;
            }
            bookBet(_amount, multiplier)
        }
    }
    const betForCurrentRound = () => {
        playBetSoundAction(SOUND_TYPE.PLAY)
        if(!logged) {
            showSelectWalletModal()
            return
        }
        let _amount;
        switch(currentBetCoin) {
            case BET_COIN.BNB:
                _amount = betAmount * bnbMultiByBits;
                break;
            case BET_COIN.BITS:
                _amount = betAmount;
                break;
        }
        doBet(_amount, multiplier);
        setPlayerButtonStyle({disableBtn: true, btnIcon: rocketIcon,buttonName: "BET", btnClassName: "disable-play", btnAction: () => {}})
    }
    const doBet = (_amount, _multiplier) => {
        if(_amount === "0") {
            setPopUp("Please use a bet amount larger then 0!");
            return;
        }
        if(!loadingBetRequest && !betState) {
            console.log("bet user name: ", userName)
            betRequest(userName, _amount, multiplier);
        }
    }
    const stopCurrentBet = async () => {
        
        
        const stopValue = displayValue
        const baseMultiplier = bettedMultiplier
        if(stopValue < baseMultiplier) {
            playBetSoundAction(SOUND_TYPE.STOP_ON_PLAYING)
        }
        else {
            playBetSoundAction(SOUND_TYPE.CANCEL)
        }
        setIsStopingBet(true)
        const stoped = await stopBet(stopValue);
        setIsStopingBet(false)
        if(stoped && stopValue < baseMultiplier) {
            setRoundWin(true)
            setMaxCredits(bettedAmount * stopValue + maxCredits)
        }
    }
    const bookBetForNextRound = () => {
        playBetSoundAction(SOUND_TYPE.PLAY)
        if(!logged) {
            showSelectWalletModal()
            return
        }
        let _amount;
        switch(currentBetCoin) {
            case BET_COIN.BNB:
                _amount = betAmount * bnbMultiByBits;
                break;
            case BET_COIN.BITS:
                _amount = betAmount;
                break;
        }
        console.log(betAmount)
        console.log(_amount)
        if(_amount === "0") {
            setPopUp("Please use a bet amount larger then 0!");
            return;
        }
        bookBet(_amount, multiplier)
    }
    const stopBookedBet = async () => {
        playCloseButtonClickSoundAction(true)
        stopBookBet()
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
        setMultiplier(amount)
        let decimalCount = 0;
        if(Math.floor(amount) !== Number(amount)) {
            decimalCount = amount.toString().split(".")[1].length
        }
        setInputValid({
            ...inputVaild,
            autoCashout: decimalCount <= 2
        })
    }
    useEffect(
        
        () => {
            if(currentBetCoin === BET_COIN.BITS) {
                setMaxDecimalCount(0)
                if(prevSelectedCoin === BET_COIN.BNB) {
                    setBetAmount(betAmount * bnbMultiByBits)
                }
            }
            if(currentBetCoin === BET_COIN.BNB) {
                setMaxDecimalCount(4)
                if(prevSelectedCoin === BET_COIN.BITS) {
                    setBetAmount(betAmount / bnbMultiByBits)
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
            switch(gameState) {
                case GAME_STATE.WAITING:
                    if(isBetBooked) {
                        doBet(bookedAmount, bookedMultiplier);
                        stopBookBet()
                    }
                    break;
            }
        },
        [gameState],
    );
    useEffect(
        async () => {
            if(isStopingBet) {
                setPlayerButtonStyle({disableBtn: true, btnIcon: rocketIcon, buttonName: "CASHING OUT…", buttonNameSuffix: "", btnClassName: "disable-stop opacity", btnAction: ()=>{}})
            }
            else if(autoBetState) {
                setPlayerButtonStyle({disableBtn: false, btnIcon: rocketIcon, buttonName: "AUTOBET RUNNING", btnClassName: "enable-stop opacity", btnAction: ()=>{}})
            }
            else if(loadingBetRequest) {
                setPlayerButtonStyle({disableBtn: true, btnIcon: rocketIcon,buttonName: "BET", btnClassName: "disable-play", btnAction: () => {}})
            }
            else {
                switch(gameState) {
                    case GAME_STATE.WAITING:
                        
                        if(betState || isBetBooked) {
                            setPlayerButtonStyle({disableBtn: false, btnIcon: rocketIcon, buttonName: "PLACING BET", buttonNameSuffix: "", btnClassName: "enable-stop opacity", btnAction: ()=>{}})
                        }
                        else {
                            setPlayerButtonStyle({disableBtn: false, btnIcon: rocketIcon, buttonName: "BET", btnClassName: "enable-play", btnAction: betForCurrentRound})
                        }
                        break;
                    case GAME_STATE.RUNNING:
                        if(betState) {
                            if(winOnRound) {
                                if(isBetBooked) {
                                    setPlayerButtonStyle({disableBtn: false, btnIcon: rocketIcon, buttonName: "BETTING", buttonNameSuffix: "(cancel)", btnClassName: "enable-stop opacity", btnAction: stopBookedBet})
                                }
                                else {
                                    setPlayerButtonStyle({disableBtn: false, btnIcon: rocketIcon, buttonName: "BET", btnClassName: "enable-play", btnAction: bookBetForNextRound})
                                }
                            }
                            else {
                                setPlayerButtonStyle({disableBtn: false, btnIcon: handIcon, buttonName: `${(displayValue * bettedAmount).toFixed(2)} STOP`, btnClassName: "enable-stop stop", btnAction: stopCurrentBet})
                            }
                        }
                        else {
                            if(isBetBooked) {
                                setPlayerButtonStyle({disableBtn: false, btnIcon: rocketIcon, buttonName: "BETTING", buttonNameSuffix: "(cancel)", btnClassName: "enable-stop opacity" , btnAction: stopBookedBet})
                            }
                            else {
                                setPlayerButtonStyle({disableBtn: false, btnIcon: rocketIcon, buttonName: "BET", btnClassName: "enable-play", btnAction: bookBetForNextRound})
                            }
                        }
                        break;
                    case GAME_STATE.CRASHED:
                        if(isBetBooked) {
                            setPlayerButtonStyle({disableBtn: false, btnIcon: rocketIcon, buttonName: "BETTING", buttonNameSuffix: "(cancel)", btnClassName: "enable-stop opacity", btnAction: stopBookedBet})
                        }
                        else {
                            setPlayerButtonStyle({disableBtn: false, btnIcon: rocketIcon, buttonName: "BET", btnClassName: "enable-play", btnAction: bookBetForNextRound})
                        }
                        
                        break;
                }
            }
        },
        [gameState, betState, displayValue, isBetBooked, winOnRound, autoBetState],
    );
    
    return (
        <div className="manual-bet">
            <div className="bet-setting">
                <div className="validate-alert-field">
                {
                    (!inputVaild.betAmount || !inputVaild.autoCashout) &&
                    <p className="validate-alert-text">Input is not a valid number</p>
                }
                </div>
                <div className="bet-detail bet-amount">
                    <MooningBottomLineInput label="Bet Amount" minValue={betAmountMin} maxValue={betAmountMax}
                        type="number" prefix={currentBetCoin} valueChangeHandler={validateAmount}
                        valid={inputVaild.betAmount} floatCount={maxDeciamlCountForInput} defaultValue={betAmount} />
                    <div className="sub-detail-content">
                        <button disabled={betState|isBetBooked} className="detail amount-change-btn" tabindex="1" onClick={()=>clickChangeBetAmountBtn(betAmountMultiple.half)}>1/2</button>
                        <button disabled={betState|isBetBooked} className="detail amount-change-btn" tabindex="2"  onClick={()=>clickChangeBetAmountBtn(betAmountMultiple.double)}>x2</button>
                        <button disabled={betState|isBetBooked} className="detail amount-change-btn" tabindex="3" onClick={()=>clickChangeBetAmountBtn(betAmountMultiple.max)}>Max</button>
                        <button disabled={betState|isBetBooked} className="detail amount-change-btn" tabindex="4" onClick={()=>clickChangeBetAmountBtn(betAmountMultiple.min)}>Min</button>
                        <ButtonGroup className="bet-coin-radio-group">
                            <ToggleButton
                                id="bet-coin-radio-2"
                                type="radio"
                                className={`bits-radio ${currentBetCoin === BET_COIN.BITS ?
                                    "checked-radio" : "unchecked-radio"}`}
                                name="bits-radio"
                                value={BET_COIN.BITS}
                                checked={currentBetCoin === BET_COIN.BITS}
                                onClick={(e) => clickBetCoinButton(BET_COIN.BITS)}
                            >
                                {BET_COIN.BITS}
                            </ToggleButton>
                            <ToggleButton
                                id="bet-coin-radio-1"
                                type="radio"
                                className={`bits-radio ${currentBetCoin === BET_COIN.BNB ?
                                    "checked-radio" : "unchecked-radio"}`}
                                name="bits-radio"
                                value={BET_COIN.BNB}
                                checked={currentBetCoin === BET_COIN.BNB}
                                onClick={(e) => clickBetCoinButton(BET_COIN.BNB)}
                            >
                                {BET_COIN.BNB}
                            </ToggleButton>
                            
                            
                        </ButtonGroup>
                    </div>
                </div>
                <div className="bet-detail">
                    <MooningBottomLineInput label="Auto Cashout" 
                        type="number" prefix="X" minValue={1.01} maxValue={100000} fixedDecimalCount={2}
                        valueChangeHandler={validateCashout} valid={inputVaild.autoCashout} 
                        defaultValue={multiplier} />
                    
                </div>
        
                <MDBBtn className={`play-button ${playerButtonStyle.btnClassName}`} disabled={playerButtonStyle.disableBtn}
                        onClick={playerButtonStyle.btnAction}>
                    <img src={playerButtonStyle.btnIcon}/><span>{playerButtonStyle.buttonName}</span>{playerButtonStyle.buttonNameSuffix ? <span className="suffix">{playerButtonStyle.buttonNameSuffix}</span>: ''}</MDBBtn>
            </div>
            <div className="my-recent-wins">
                <div className="title"><span>My Recent Wins</span></div>
                <div className="data-content">
                    <div className="data-header">
                        <div className="detail">Bet</div>
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
                                        <td>{Math.trunc(data.bet)}</td>
                                        <td>{data.multiplier}X</td>
                                        <td className={`payout ${Number(data.payout)>0?"win":"loss"}`}>
                                            <img src={bnb1Img}></img>
                                            {Math.trunc(data.payout)}</td>
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
        maxCredits: state.betData.maxCredits,
        betState: state.betData.betState,
        loadingBetRequest: state.betData.loadingBetRequest,
        autoBetState: state.betData.autoBetState,
        isBetBooked: state.betGameData.isBetBooked,
        bookedAmount: state.betGameData.bookedAmount,
        currentBetCoin: state.betGameData.currentBetCoin,
        bookedMultiplier: state.betGameData.bookedMultiplier,
        bettedMultiplier: state.betData.multiplier,
        bettedAmount: state.betData.betAmount,
        gameState: state.gameValue.gameState,
        displayValue: state.displayData.value,
        myRecentWin: state.userData.myRecentWin,
        userName: state.userData.userName,
        logged: state.userData.logged,
        winOnRound: state.betGameData.winOnRound,
    }
)

export default connect(mapStateToProps, {betRequest, bookBet, stopBookBet, changeBetCoin,
    playBetSoundAction, setRoundWin,
    stopBet, showSelectWalletModal, setMaxCredits, playCloseButtonClickSoundAction})(ManualBet)