import { useEffect, useState, useRef } from 'react';

import ReactApexChart from 'react-apexcharts';
import {connect} from 'react-redux'


import AspectRatioImg from '../../assets/images/aspect_ratio_white_24dp.svg'
import TakCoinImgSrc from '../../assets/images/Neon___flare_BNB.png'

import RocketImg from '../../assets/images/playpage/Rocket.png'
import runningSound from '../../assets/sound/Space_Heroes.mp3'
import flyingSound from '../../assets/sound/Sound_Effect_Only_except_cashier_hit_bet_explosion_3_06_m_3.mp3'
import betSound from '../../assets/sound/bet.mp3'
import winSound from '../../assets/sound/coin.mp3'
import explosionSound from '../../assets/sound/explosion.mp3'
import ExplosionGif from '../../assets/images/playpage/explosion.gif'
import FullScreenImg from '../../assets/images/fullscreen_white_24dp.svg'
import astroSrc from '../../assets/images/playpage/astro.png'

import BackgroundVideo from '../../assets/video/MoonBackground.mp4'
import './index.scss'
import {setGameResult, removeAllBets, changeGameState} from '../../actions/gameActions'

import {GAME_STATE} from '../../utils/types'
import SettingModal from './SettingModal'
import { explosionPngs, rocketPngs, coinExplosionPngs, coinSpinningPngs } from '../../utils/GIF'


import { nextVersion } from '../../utils/constant';

const testData = [ 
    {
        time: 1,
        crashValue: 1
    },
    {
        time: 2,
        crashValue: 3
    },
    {
        time: 3,
        crashValue: 8
    },
    {
        time: 4,
        crashValue: 9
    },
    {
        time: 5,
        crashValue: 1
    },
    {
        time: 6,
        crashValue: 6
    },
    {
        time: 8,
        crashValue: 1
    },
    {
        time: 9,
        crashValue: 1
    },
    {
        time: 10,
        crashValue: 1
    },
    {
        time: 12,
        crashValue: 1
    },
    {
        time: 14,
        crashValue: 1
    },
    {
        time: 18,
        crashValue: 1
    },
    {
        time: 19,
        crashValue: 1
    },
    {
        time: 20,
        crashValue: 40
    }];
const testLatestResults = [4.2, 4.2,1.4, 3.2, 2.2, 4.2, 4.2,1.4, 3.2, 2.2, 4.2, 4.2,1.4, 3.2, 2.2];
let perpareTimer = null;
const prepareVideoTime = 7;
const rocketFlyingUpTime = 1.8
let canvas_width = 1600;
let canvas_height = 900;
let graph_content_width = 1400; // 800
let graph_content_height = 580;
let graph_start_x = 0;
let graph_start_y = 240;
let default_max_time = 20;
let default_max_value = 100;
let max_time = 50;
let max_value = 50;
let start_value = 1;
let unit_line_value = max_value / 50;
let unit_line_size = unit_line_value / max_value * graph_content_height;
let main_line_width = 30;
let sub_line_width = 20;
let bigLineStartX = canvas_width - 50;
let bigLineEndX = bigLineStartX + main_line_width;
let subLineStartX = canvas_width - 40;
let subLineEndX = subLineStartX + sub_line_width;

let betNumbers = []
let betAnimationTimeOut = null
let runningTimeOut = null
let prevBetNumbers = []
function BetNumber(number, startPosition) {
    this.str = Number(number).toFixed(2).toString() + "Bits"
    this.displayCount = 0
    this.startPosition = startPosition
    this.updateNumber = () => {
        this.displayCount ++
    }
}
function ReachedBet(time, value, betAmount, multiplier) {
    this.time = time
    this.value = value
    this.kValue = 1 / time
    this.betAmount = betAmount
    this.multiplier = multiplier
    this.payout = Number(betAmount * multiplier).toFixed(2)
    this.reduceUnit = time / 100
    this.animIndex = 0
    
    this.updateValues = () => {
        this.time -= this.reduceUnit;
        this.value = this.time * this.time * this.kValue;
        this.animIndex += 5
    }
}
function CoinExplosion(time, value) {
    this.time = time
    this.value = value
    this.imgIndex = 0
    this.updateValues = () => {
        this.imgIndex += 2
    }
}
function AstroEjection(startX, startY) {
    this.imgIndex = 0
    this.astroPointX = startX
    this.astroPointY = startY
    this.updateValues = () => {
        this.imgIndex ++
        this.astroPointX += 2
        this.astroPointY += 2
    }
}

let reachedBetsForAnim = []
let coinExplosionsForAnim = []
let animcount = 0
let newBetAmounts = []
let betNumberSeperateInterval
let curGameState

let currentGifIndex = 0;
let explosionImgs = []
let rocketImgs = []
let coinSpinningImgs = []
let coinExplosionImgs = []
let astroEjectionAnim;
let rocketImage = new Image()
let takCoinImg = new Image()
let astroImg = new Image()

const defaultRocketWidth = 80
const defaultRocketHeight = 80
const maxRocketIncreaseWidth = 300;
const maxRocketIncreaseHeight = 300
const explosionImgWidth = 480
const explosionImgHeight = 270
const rocketIncreaseMaxStep = 30
let currentValueAndTime = 0
let drawingRunningRocket = false
let playPromise = new Promise((resolve, reject) => {resolve()})
let promiseResolved = true
const testAllBet = [{name: "asd", amount: 100}]
const testLastBets = [[12], [12], [12], [12], [12], [12], [12], [12], [12], [12], [12], [12], [12], [12], [12], [12], [12], [12], [12], [12]] 
const ChartComponent = (props) => {
    const { backgroundAudioVolume, timeToStart, displayValue,
        effectAudioVolume, muteAudio, gameState, 
        multiplier, betState,
        latestResults, currentTime, allBets } = props;

    // const [gameData, setGameData] = useState({
    //     currentState: GAME_STATE.WAITING,
    //     crashValues: [],
    //     displayValues: []
    // });
    
    
    const videoRef = useRef(null);
    const backAudioRef = useRef(null);
    const selfWinAudioRef = useRef(null);
    
    const effectAudioRef = useRef(null);
    const rocketFlyingAudioRef = useRef(null);
    const canvasRef = useRef(null);
    const tempCanvasRef = useRef(null);
    useEffect(() => {
        if(betAnimationTimeOut !== null) {
            clearTimeout(betAnimationTimeOut);
        }
        betNumbers = []
        newBetAmounts = []
        reachedBetsForAnim = []
        prevBetNumbers = []
        for(let i = 0; i < explosionPngs.length; i ++ ) {
            const img = new Image();
            img.src = explosionPngs[i];
            explosionImgs.push(img)
        }
        for(let i = 0; i < rocketPngs.length; i ++ ) {
            const img = new Image();
            img.src = rocketPngs[i];
            rocketImgs.push(img)
        }
        for(let i = 0; i < coinExplosionPngs.length; i ++ ) {
            const img = new Image();
            img.src = coinExplosionPngs[i];
            coinExplosionImgs.push(img)
        }
        for(let i = 0; i < coinSpinningPngs.length; i ++ ) {
            const img = new Image();
            img.src = coinSpinningPngs[i];
            coinSpinningImgs.push(img)
        }
        
        rocketImage.src = RocketImg
        takCoinImg.src = TakCoinImgSrc
        astroImg.src = astroSrc
        return () => {
            // 👇️ clear timeout when component unmounts
            if(betAnimationTimeOut !== null) {
                clearTimeout(betAnimationTimeOut);
            }
            if(runningTimeOut !== null) {
                clearTimeout(runningTimeOut);
            }
            betNumbers = []
            newBetAmounts = []
            reachedBetsForAnim = []
            prevBetNumbers = []
        };
    }, [])
    useEffect(() => {
        curGameState = gameState
        switch(gameState) {
            case GAME_STATE.RUNNING:
                //setEndFlyingUp(true)
                startRunningAction()
                break;
            case GAME_STATE.WAITING:
            
                prepareAction(timeToStart)
                
                BetNumAnimation()
                break;
            case GAME_STATE.CRASHED:
                backAudioRef.current.pause()
                rocketFlyingAudioRef.current.pause()
                PlayEffectSound(explosionSound, 0.5)
                const expPoint = pointConvert(currentValueAndTime, currentValueAndTime)
                astroEjectionAnim = new AstroEjection(expPoint.timeValue, expPoint.gameValue)
                DrawCrashGameCanvas()
                if(videoRef.current !== null && videoRef.current.currentTime < prepareVideoTime) {
                    videoRef.current.currentTime = prepareVideoTime
                }
                break;
            case GAME_STATE.NONE:
                //endFlyingUpFunc()
                //DrawRunningCanvas()
                //test
                //betRequestInterval = setInterval(GetBetsDuringPreparing, 4000)
                // BetNumAnimation()
                break;
        }
    }, [gameState])
    useEffect(() => {
        newBetAmounts = []
        for( var i = 0; i < allBets.length; i++){ 
            if(!prevBetNumbers.find(betData => betData.username === allBets[i].username)) {
                newBetAmounts.push(allBets[i].amount)
            }
        }
        let animCount = Math.min(newBetAmounts.length, 5)
        for(let i = 0; i < animCount; i++){ 
            const betNumber = newBetAmounts[i]
            setTimeout(( )=> AddBetNumber(betNumber, 80*i), 1000 / animCount * i)
        }
        // for( var i = 0; i < newBetAmounts.length; i++){ 
        //     const betNumber = newBetAmounts[i]
        //     setTimeout(() => DrawBetNumber(betNumber, 0), 1000 / newBetAmounts.length * i)
        // }
        //DisplayUserBetNumbers()
        prevBetNumbers = allBets
    }, [allBets])
    useEffect(() => {
        if(backAudioRef.current) {
            backAudioRef.current.muted = muteAudio
            effectAudioRef.current.muted = muteAudio
            rocketFlyingAudioRef.current.muted = muteAudio
        }
    }, [muteAudio])
    useEffect(() => {
        var lastBet = getLastestReachedBet()
        if(lastBet != undefined) {
            const reachedBet = new ReachedBet(currentValueAndTime, currentValueAndTime, lastBet.amount, lastBet.multiplier)
            reachedBetsForAnim.push(reachedBet)
            PlayEffectSound(winSound, 0.5);
            const coinExposion = new CoinExplosion(currentValueAndTime, currentValueAndTime)
            coinExplosionsForAnim.push(coinExposion)
        }
    }, [displayValue])
    useEffect(() => {
        if(backAudioRef.current) {
            backAudioRef.current.volume = backgroundAudioVolume / 100
        }
    }, [backgroundAudioVolume])
    useEffect(() => {
        if(effectAudioRef.current) {
            effectAudioRef.current.volume = effectAudioVolume / 100
        }
        if(rocketFlyingAudioRef.current) {
            rocketFlyingAudioRef.current.volume = effectAudioVolume / 100
            
        }
    }, [effectAudioVolume])
    const addTestBetNummber = () => {
        setTimeout(( )=> AddBetNumber(1, 80), 1000)
    }
    const AddBetNumber = (betNumber, startPosition) => {
        PlayEffectSound(betSound, 0.5)
        const betNumberAnim = new BetNumber(betNumber, startPosition)
        betNumbers.push(betNumberAnim)
        if(betNumbers.length > 5) {
            betNumbers.shift()
        }
    }
    const BetNumAnimation = () => {
        //test
        if(curGameState !== GAME_STATE.WAITING) return
        const ctx = canvasRef.current.getContext('2d');
        ctx.textAlign = "center";
        
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        let i = 0
        let text_y_pos = 0
        let text_opacity = 1
        let text_font_size = 70
        while (i < betNumbers.length) {
            
            if(betNumbers[i].displayCount > 50) {
                betNumbers.splice(i, 1)
                continue
            }
            text_y_pos = canvas_height / 2 - betNumbers[i].displayCount - betNumbers[i].startPosition
            if(betNumbers[i].displayCount < 20) {
                text_opacity = 0.5 + betNumbers[i].displayCount/40
                // text_y_pos = canvas_height / 2 - betNumbers[i].displayCount * 7
                
                // text_font_size = 30+betNumbers[i].displayCount*2
            }
            else if(betNumbers[i].displayCount < 30) {
                text_opacity = 1
            }
            else {
                text_opacity = 1 - (betNumbers[i].displayCount-30)/20
                // text_y_pos = canvas_height / 2 - betNumbers[i].displayCount * 7
                
                // text_font_size = 70-(betNumbers[i].displayCount-20)
            }
            ctx.font = `${text_font_size}px Nurom`;
            ctx.fillStyle = `rgba(102, 255, 51, ${text_opacity})`;
            ctx.fillText(betNumbers[i].str, canvas_width / 4, text_y_pos);
            betNumbers[i].updateNumber()
            i++
        }
        betAnimationTimeOut = setTimeout(BetNumAnimation, 20)
    }
    const PlayEffectSound = (effectSrc, startTime = 0) => {
        // const func = new Promise((resolve, reject) => {
        //     effectAudioRef.current.pause()
        //     effectAudioRef.current.src = effectSrc;
        //     effectAudioRef.current.load()
        //     resolve();
        // })
        
        if(promiseResolved) {
            //console.log("play audio")
            promiseResolved = false
            effectAudioRef.current.src = effectSrc;
            effectAudioRef.current.load()
            effectAudioRef.current.currentTime = startTime
            if(!effectAudioRef.current.muted) {
                playPromise = effectAudioRef.current.play()
                if (playPromise !== undefined) {
                    playPromise.then(_ => {
                        // Autoplay started!
                        // console.log("promise resolved")
                        promiseResolved = true
                    }).catch(error => {
                        // console.log("promise resolved")
                        promiseResolved = true
                        // Autoplay was prevented.
                        // Show a "Play" button so that user can start playback.
                    });
                }
            }
            else {
                promiseResolved = true
            }
        }
        
        
        // effectAudioRef.current.load()
        // effectAudioRef.current.currentTime = startTime
        // if(playPromise !== undefined) {
        //     //console.log("play promise", playPromise)
        //     playPromise.then(_ => {
        //         console.log("play audio")
        //         effectAudioRef.current.src = effectSrc;
        //         effectAudioRef.current.load()
        //         effectAudioRef.current.currentTime = startTime
        //         if(!effectAudioRef.current.muted) {
        //             playPromise = effectAudioRef.current.play()
        //         }
                
        //     })
        // }
        
        // func.then(() => {
        //     if(!effectAudioRef.current.muted) {
        //         effectAudioRef.current.currentTime = startTime
        //         effectAudioRef.current.play()
        //     }
            
        // })     
    }
    const PauseEffectSound = () => {
        effectAudioRef.current.pause()
    }
    
    const getLastestReachedBet = () => {
        const reachedBets = allBets.filter(bet => {
                if(bet.multiplier < displayValue) {
                    return true
                }
            }
        )
        if(reachedBets.length > 0) {
            const reachedBetAmounts = reachedBets.map(bet => bet.multiplier)
            const max = Math.max(...reachedBetAmounts)
            const matchedAnimBet = reachedBetsForAnim.find(bet => {
                if(bet.multiplier === max) return true
                return false                  
            })
            if(matchedAnimBet !== undefined) return undefined
            else {
                const maxBet = reachedBets.find(bet => {
                    if(bet.multiplier === max) return true
                    return false                  
                })
                return maxBet
            } 
        }
        return undefined
    }
    
    const DrawCrashGameCanvas = () => {
        if(curGameState !== GAME_STATE.CRASHED) return;
        if(canvasRef.current === null) return;
        const ctx = canvasRef.current.getContext('2d');
        
        ctx.clearRect(0, 0, canvas_width, canvas_height);
        if(currentGifIndex === explosionPngs.length) {
            currentGifIndex = 0
            return
        }
        drawLinerExplosion(currentValueAndTime, currentValueAndTime)
        drawAstroEjection()
        
        setTimeout(() => {DrawCrashGameCanvas()}, 10)
    }
    const DrawRunningCanvas = () => {
        if(curGameState !== GAME_STATE.RUNNING) {
            //console.log("rocket doesn't fly: ", curGameState, endFlyingUp)
            return;
        }
        //console.log("DrawRunningCanvas: ", curGameState, endFlyingUp && curGameState === GAME_STATE.WAITING)
        currentValueAndTime += 2;
        if(currentValueAndTime > default_max_time / 2) max_time = currentValueAndTime + default_max_time / 2
        else max_time = default_max_time
        if(currentValueAndTime > default_max_value / 10) max_value = currentValueAndTime + default_max_value * 9 / 10
        else max_value = default_max_value
        if(canvasRef.current !== null) {
        const ctx = canvasRef.current.getContext('2d');
            ctx.clearRect(0, 0, canvas_width, canvas_height);
            drawLinerGraph(currentValueAndTime, currentValueAndTime)
            drawLinerRocket(currentValueAndTime, currentValueAndTime)
            drawReachedBet()
            drawCoinExplosions()
        }
        runningTimeOut = setTimeout(DrawRunningCanvas, 100)
        //requestAnimationFrame(DrawRunningCanvas);
    }
    
    const drawCoinExplosions = () => {
        if(canvasRef.current === null) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        let i = 0
        while (i < coinExplosionsForAnim.length) {
            if(coinExplosionsForAnim[i].imgIndex < coinExplosionPngs.length) {
                let explosionWidth = 1440
                let explosionHeight = 810
                const coinPos = pointConvert(coinExplosionsForAnim[i].time, coinExplosionsForAnim[i].value)        
                ctx.drawImage(coinExplosionImgs[coinExplosionsForAnim[i].imgIndex], coinPos.timeValue - explosionWidth/2 ,
                    coinPos.gameValue -explosionHeight/2, explosionWidth, explosionHeight);
                coinExplosionsForAnim[i].updateValues()
                i ++
            }
            else {
                coinExplosionsForAnim.splice(i, 1)
            }
        }
    }
    const drawAstroEjection = () => {
        
        if(astroEjectionAnim.imgIndex > 100) return
        if(canvasRef.current === null) return;
        const ctx = canvasRef.current.getContext('2d');
        let astroWidth = 367 * (0.4 + astroEjectionAnim.imgIndex / 400)
        let astroHeight = 355 * (0.4 + astroEjectionAnim.imgIndex / 400)
        ctx.drawImage(astroImg, astroEjectionAnim.astroPointX - astroWidth/2 ,
            astroEjectionAnim.astroPointY - astroHeight/2, astroWidth, astroHeight);
        
        astroEjectionAnim.updateValues()
    }
    
    const drawReachedBet = () => {

        if(canvasRef.current === null) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.beginPath();
        for(let i = 0; i < reachedBetsForAnim.length; i ++) {
            reachedBetsForAnim[i].updateValues()
            if(reachedBetsForAnim[i].time > 0) {
                let coinWidth = 240
                let coinHeight = 135
                const coinPos = pointConvert(reachedBetsForAnim[i].time, reachedBetsForAnim[i].value)        
                ctx.drawImage(coinSpinningImgs[reachedBetsForAnim[i].animIndex % coinSpinningImgs.length], coinPos.timeValue - coinWidth/2 ,
                    coinPos.gameValue -coinHeight/2, coinWidth, coinHeight);

                ctx.font = "40px Digital-Mono";
                ctx.textAlign = "center";
                ctx.fillStyle = '#66ff33';
                const textWidth = 200;
                const textHeight = 50;
                ctx.fillText(`${reachedBetsForAnim[i].multiplier} X`, coinPos.timeValue,
                    coinPos.gameValue + coinHeight);
                ctx.fillText(`${reachedBetsForAnim[i].payout} Bits`, coinPos.timeValue,
                    coinPos.gameValue + coinHeight + textHeight);
            }
        }
    }
    const drawLinerGraph = (time, value) => {
        if(canvasRef.current === null) return;
        const ctx = canvasRef.current.getContext('2d');
        ctx.strokeStyle = 'cyan';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'cyan';
        ctx.lineWidth = 5;
        ctx.beginPath();
        const cur_point = pointConvert(0, start_value)
        const next_point = pointConvert(time, value)
        var control_time = time / 2 + time / 2 * value / max_value
        var control_value = value / 2 - value / 2 * value / max_value
        const control_point = pointConvert(control_time, control_value)
        
        ctx.moveTo(cur_point.timeValue, cur_point.gameValue);
        ctx.quadraticCurveTo(control_point.timeValue, control_point.gameValue, next_point.timeValue, next_point.gameValue);
        
        ctx.stroke();
        ctx.shadowBlur = 0;
        
    }
    const drawLinerRocket = (time, value) => {
        if(canvasRef.current === null) return;
        let rad = Math.PI / 2;
        const cur_point = pointConvert(0, start_value)
        const next_point = pointConvert(time, value)
        var control_time = time / 2 + time / 2 * value / max_value
        var control_value = value / 2 - value / 2 * value / max_value
        const control_point = pointConvert(control_time, control_value)
        const divResult = (control_point.gameValue - next_point.gameValue) / (next_point.timeValue - control_point.timeValue)
        rad = Math.PI / 2 - Math.atan(divResult)
        
        const ctx = canvasRef.current.getContext('2d');
        const pos = pointConvert(time, value)
        ctx.save()
        
        let multiValue = Math.min(value / default_max_time, 1)
        let width = defaultRocketWidth + multiValue * maxRocketIncreaseWidth;
        let height = defaultRocketHeight + multiValue * maxRocketIncreaseHeight;
        
        ctx.translate(pos.timeValue,  pos.gameValue)
        ctx.stroke();
        ctx.rotate(rad - Math.PI / 4)
        ctx.drawImage(rocketImgs[time % rocketImgs.length], -width/2 , -height/2, width, height);
        ctx.restore();
    }

    const drawLinerExplosion = (time, value) => {
        if(canvasRef.current === null) return;
        
        const ctx = canvasRef.current.getContext('2d');
        if(currentGifIndex < explosionPngs.length/2) {
            if(nextVersion) {
                //drawGraph(crashedDisplayValues)
                drawLinerGraph(currentValueAndTime, currentValueAndTime)
            }
        }
        
        const pos = pointConvert(time, value)
        let multiValue = Math.sqrt(Math.sqrt(value / max_value))
        let width = (defaultRocketWidth + multiValue * maxRocketIncreaseWidth) * 3;
        let height = width * explosionImgHeight / explosionImgWidth
        ctx.drawImage(explosionImgs[currentGifIndex], pos.timeValue - width/2, pos.gameValue - height/2, width, height);
        currentGifIndex ++
        
        
    }

    const pointConvert = (x, y) => {
        let r_x = graph_start_x + graph_content_width / max_time * x;
        let r_y = graph_start_y + graph_content_height - graph_content_height / max_value * (y - start_value);
        return {
            timeValue: r_x,
            gameValue: r_y
        }
    }
    
    const initData = () => {
        
        max_time = 20;
        max_value = 1;
        currentValueAndTime = 0
        unit_line_value = max_value / 50;
        unit_line_size = unit_line_value / max_value * graph_content_height;
    }
    
    const prepareAction = (_timeToStart) => {
        //document.getElementById('bgVideo').currentTime = 0
        //setTimeout(() => {setEndFlyingUp(true)}, _timeToStart * 1000);
        betNumbers = []
        newBetAmounts = []
        reachedBetsForAnim = []
        coinExplosionsForAnim = []
        if(videoRef.current !== null) {
            videoRef.current.currentTime = 0//6 - _timeToStart
        }
        if(backAudioRef.current !== null) {
            backAudioRef.current.currentTime = 0//6 - _timeToStart
            backAudioRef.current.play()
            rocketFlyingAudioRef.current.currentTime = 0//6 - _timeToStart
            rocketFlyingAudioRef.current.play()
        }
    }
    const startRunningAction = () => {
        initData()
        PauseEffectSound()
        runningTimeOut = DrawRunningCanvas()
        if(videoRef.current !== null) {
            videoRef.current.currentTime = 7
        }
    }
    const clickPlaySound = () => {
        PlayEffectSound(winSound, 0.5)
    }
    return (
        <>
            <div className="play-chart">
                <audio src={runningSound} ref={backAudioRef} autoPlay loop/>
                <audio src={betSound} ref={selfWinAudioRef}/>
                <audio ref={effectAudioRef}>
                    <source src={null}></source>    
                </audio>
                <audio src={flyingSound} ref={rocketFlyingAudioRef} autoPlay loop/>
                
                <div className="bg" >
                    <video ref={videoRef} loop autoPlay muted id="bgVideo">
                        <source
                        src={BackgroundVideo }
                        type="video/mp4"
                        />
                        Your browser does not support the video tag.
                    </video>
                
                    <div  className="graph-container">
                        <canvas ref={canvasRef} width="1600" height="900" className="game-canvas"></canvas>

                    </div>
                </div>
                {
                    displayValue > multiplier && gameState === GAME_STATE.RUNNING && betState &&
                    <div className="cashed-out-title">{`⭐️You cashed out at ${multiplier}x`}</div>
                }
            </div>

            <div className="chart-bottom-btns">
                <div className="left-three-btns">
                    { 
                        nextVersion &&
                        <>    
                            <a type="button" className="setting-btn">
                                <img src={AspectRatioImg} alt="" />

                            </a>
                            <a type="button" className="setting-btn">
                                <img src={FullScreenImg} alt="" />

                            </a>
                        </>
                    }
                    <SettingModal/>
                </div>
                <div className="latest-results">
                    {
                        latestResults.length > 0 && 
                        <>
                            {
                                latestResults.map(result => {
                                    return (
                                        <button className={`result-btn ${result[0]>3 ? "high-result":"low-result"}`}>
                                            {result[0]}x
                                        </button>
                                    )
                                })
                            }
                        </>
                    }
                </div>
            </div>
        </>
    );
}

const mapStateToProps  = (state) => (
    {
        displayValue: state.displayData.value,
        gameState: state.gameValue.gameState,
        latestResults: state.betGameData.latestResults,
        currentTime: state.betGameData.currentTime,
        allBets: state.usersBetData.allBets,
        backgroundAudioVolume: state.betGameData.backgroundAudioVolume,
        effectAudioVolume: state.betGameData.effectAudioVolume,
        muteAudio: state.betGameData.muteAudio,
        multiplier: state.betData.multiplier,
        betState: state.betData.betState,
        
        timeToStart: state.betGameData.timeToStart
        
    }
)

export default connect(mapStateToProps, {setGameResult, removeAllBets, changeGameState})(ChartComponent)
