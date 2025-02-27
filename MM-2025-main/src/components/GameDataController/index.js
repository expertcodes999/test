import { useEffect } from 'react';
import {connect} from 'react-redux'
import {serverUrl} from '../../utils/constant'
import {getAllBets, getOnlinePlayerCount, setGameResult, setTimeToStart, setRoundWin, setLatestResults,
    removeAllBets, changeGameState, getLastResults, getBankroll, setPopUp, setDisplayValue} from '../../actions/gameActions'
import {endBet, setMaxCredits, getMaxCredits} from '../../actions/betActions'
import {GAME_STATE} from '../../utils/types'
import { BsNodePlusFill } from 'react-icons/bs';

let valueTimer = null;
let currentValue = 0;

let failedValueStartTime = null;
let maxFaildValueMSecond = 5000
let evtSource = null//new EventSource(serverUrl+"getGameProgress.php");
let serverValue = 0
let prevServerValue = 0
let valueUpdateTime = 500
let valueUpdateStep = 20
let valueUpdateUnit = 0
let currentTimeOut = null
let finishTimeOut = null
let currentGameState = GAME_STATE.NONE
let isFinishedState = false

let testValue = 1
let mounted = true
let betRequestInterval = null
let valueDisplayer = null
let startGameTimeout = null
let loadingBetsRequest = false
let gettingBetRequest = false
let prevReceivedState = GAME_STATE.NONE;
const GameDataController = (props) => {
    const { getAllBets, getOnlinePlayerCount, setTimeToStart, setRoundWin, getMaxCredits, 
        setDisplayValue, getBankroll, displayValue,
        setGameResult, gameState, gameResult, removeAllBets, changeGameState, endBet, betState,
        multiplier, betAmount, maxCredits, setMaxCredits, winOnRound, getLastResults, setLatestResults } = props;
    useEffect(() => {
        mounted = true
        evtSource = new EventSource(serverUrl+"getGameProgress.php");

        evtSource.onmessage = (event) => {
            let eventData = JSON.parse(event.data);
            gameValueHandler(eventData)
        }
        currentGameState = GAME_STATE.NONE
        //continueVauleSet()
        getLastResults()
        return () => {
            console.log("dismounted component!!!")
            mounted = false
            if(evtSource !== null) {
                evtSource.close()
                //console.log("event source: ", evtSource)
            }
            if(currentTimeOut !== null) {
                clearInterval(currentTimeOut)
            }
            if(betRequestInterval !== null) {
                clearInterval(betRequestInterval)
            }
            if(startGameTimeout !== null) {
                clearTimeout(startGameTimeout)
            }
        };
    }, [])
    useEffect(() => {
        continueVauleSet()
        if((gameState === GAME_STATE.RUNNING || gameState === GAME_STATE.CRASHED) &&
            !winOnRound && betState && displayValue >= multiplier) {
            setRoundWin(true)
            setMaxCredits(betAmount * multiplier + maxCredits)
        }
    }, [displayValue])//, gameState, winOnRound, betState, multiplier, maxCredits, betAmount])
    // useEffect(() => {
    //     console.log("display value: ", displayValue)
    //     currentValue = displayValue
    // }, [displayValue])
    useEffect(() => {
        continueVauleSet()
        if(currentGameState === GAME_STATE.NONE && gameState === GAME_STATE.RUNNING) {
            if(currentTimeOut !== null){
                clearInterval(currentTimeOut)
            }
            clearInterval(currentTimeOut)
            currentTimeOut = setInterval(updateCurrenValue, valueUpdateTime / valueUpdateStep);
        }
        if(gameState !== GAME_STATE.WAITING && betRequestInterval !== null) {
            clearInterval(betRequestInterval);
        }
        currentGameState = gameState
    }, [gameState])
    const continueVauleSet = () => {
        if(valueTimer) {
            clearInterval(valueTimer)
        }
        valueTimer = setInterval(() => valueSetter(), 1000);
    }
    const getAllBetsAync = async () => {
        if(!loadingBetsRequest) {
            //console.log("bets request!!!")
            loadingBetsRequest = true
            await getAllBets();
            loadingBetsRequest = false
        }
        else {
            //console.log("loading bets request!!!")
        }
    }
    const valueSetter = () => {
        testValue = testValue + 1
        gameValueHandler({value: testValue, status: "Running"})
    }

    const startGame = () => {
        gettingBetRequest = false
        valueUpdateUnit = 0
        prevServerValue = 1
        getAllBetsAync();
        
        getOnlinePlayerCount();
        changeGameState(GAME_STATE.RUNNING);
        setRoundWin(false)
        getAllBets();
        getMaxCredits()
        getBankroll()
        
        isFinishedState = false
        if(betRequestInterval !== null) {
            clearInterval(betRequestInterval);
        }
        if(currentTimeOut !== null){
            clearInterval(currentTimeOut)
        }
        currentTimeOut = setInterval(updateCurrenValue, valueUpdateTime / valueUpdateStep);
    }
    const changeDisplayValue = (changeValue) => {
        setDisplayValue(Math.trunc(changeValue*100)/100)
        currentValue = changeValue
    }

    const endGame = (crashedValue) => {
        gettingBetRequest = false
        endBet();
        clearInterval(currentTimeOut)
        changeGameState(GAME_STATE.CRASHED);
        
        //getLastResults();
        setLatestResults(crashedValue)
        if(betRequestInterval !== null) {
            clearInterval(betRequestInterval);
        }
        /*
        evtSource.close();

        setTimeout(() => {
            evtSource.connect()
        }, 5000);*/
    
    }

    const waitGame = (timeToStart) => {
        clearInterval(currentTimeOut)
        removeAllBets();
        setGameResult(1);
        setTimeToStart(timeToStart)
        changeGameState(GAME_STATE.WAITING);
        changeDisplayValue(1)
        if(!gettingBetRequest) {
            GetBetsDuringPreparing()
        }
        startGameTimeout = setTimeout(startGame, 6000)
    }
    const connectToSSE = () => {
        console.log("connect to sse")
        if(evtSource) {
            evtSource.close()
        }
        evtSource = new EventSource(serverUrl+"getGameProgress.php");
        evtSource.onmessage = (event) => {
            let eventData = JSON.parse(event.data);
            gameValueHandler(eventData)
        }
    }
    
    const PrePreparingAction = () => {
        if(!gettingBetRequest) {
            GetBetsDuringPreparing()
        }
    }
    const GetBetsDuringPreparing = () => {
        //test
        gettingBetRequest = true
        getAllBetsAync()
        betRequestInterval = setInterval(getAllBetsAync, 1000)
    }

    const updateCurrenValue = () => {
        if(currentValue < prevServerValue) {
            changeDisplayValue(prevServerValue + valueUpdateUnit)
        }
        else if(currentValue + valueUpdateUnit >= serverValue) {
            changeDisplayValue(serverValue)
        }
        else {
            changeDisplayValue(currentValue + valueUpdateUnit)
        }
    }
    const getFinishedState = (value) => {
        setGameResult(value);
        endGame(value);
    }
    const gameValueHandler = (eventData) => {
        //valueDisplayer.innerHTML = eventData.status + ": " + eventData.value
        
        
        //return;
        if(eventData.value === 0) {
            
            if(failedValueStartTime === null) {
                failedValueStartTime = new Date()
            }
            let failedMSeconds = new Date() - failedValueStartTime
            if(failedMSeconds > maxFaildValueMSecond) {
                
                connectToSSE()
                //setPopUp("Disconnected from Server... Seems like you are having Internet trouble")
                failedValueStartTime = null
            }
        }
        else {
            prevServerValue = serverValue
            serverValue = eventData.value
            failedValueStartTime = null
            switch(eventData.status) {
                case "Preparing":
                    if(currentGameState !== GAME_STATE.WAITING && prevReceivedState !== "Preparing") {
                        waitGame(2 - Number(eventData.secondsSinceStart));
                    }
                    break;
                case "Running":
                    if(currentGameState !== GAME_STATE.RUNNING) {
                        startGame();
                    }
                    valueUpdateUnit = ((serverValue - prevServerValue) * 1.1 / valueUpdateStep)
                    if(currentGameState === GAME_STATE.RUNNING) {
                        //setGameResult(serverValue);
                        //changeDisplayValue(prevServerValue)
                        valueUpdateUnit = (serverValue - prevServerValue) * 1.1 / valueUpdateStep
                    }
                    //changeDisplayValue(prevServerValue)
                    break;
                case "Finished":
                    
                    if(!isFinishedState && currentGameState !== GAME_STATE.CRASHED) {
                        isFinishedState = true
                        valueUpdateUnit = (serverValue - currentValue) * 1.5 / valueUpdateStep
                        if(finishTimeOut) {
                            clearTimeout(finishTimeOut)
                        }
                        finishTimeOut = setTimeout(() => getFinishedState(serverValue), valueUpdateTime);
                    }
                    //setTimeout(waitGame, 5000);
                    break;
                case "Pre-Preparing":
                    if(prevReceivedState !== "Pre-Preparing") {
                        PrePreparingAction()
                    }
                    break;
            }
            if(prevReceivedState !== eventData.status) {
                console.log("new server state: ", eventData.status)
                prevReceivedState = eventData.status
            }
        }
    }
    
    return (
        <>
            
        </>
    );
}

const mapStateToProps  = (state) => (
    {
        gameResult: state.gameValue.gameResult,
        displayValue: state.displayData.value,
        gameState: state.gameValue.gameState,
        winOnRound: state.betGameData.winOnRound,
        betState: state.betData.betState,
        multiplier: state.betData.multiplier,
        maxCredits: state.betData.maxCredits,
        betAmount: state.betData.betAmount
    }
)

export default connect(mapStateToProps, {getAllBets, setTimeToStart, getOnlinePlayerCount, 
    setDisplayValue, getBankroll,
    setRoundWin, setGameResult, removeAllBets, endBet, changeGameState, getMaxCredits, setLatestResults,
    setMaxCredits, getLastResults})(GameDataController)
