import { Modal } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useRef } from 'react';
import './index.scss';
import {connect} from 'react-redux'
import { AiOutlineClose } from 'react-icons/ai';

import { showWheelPrizeWinModal, getPrize, setPopUp } from '../../actions/gameActions'
import wheelImgSrc from '../../assets/images/wheel prize/wheel_new_numbers.png'
import middleImgSrc from '../../assets/images/wheel prize/small_circle_spinwin.png'
import arrowImgSrc from '../../assets/images/wheel prize/arrow.png'
import spinSound from '../../assets/sound/wheel prize/digital-prize-wheel/digital prize wheel.wav'
const canvas_width = 700
const canvas_height = 700
const img_width = 660
const img_height = 660
const middleImgWidth = 160
const middleImgHeight = 160
const arrowImgWidth = 189
const arrowImgHeight = 171
const wheelImg = new Image();
const middleImg = new Image();
const arrowImg = new Image();
let mounted = false;
let currentRot = 0
let ctx = null
let currentTimeOut = null
const maxSpeed = 0.4
let currentSpeed = 0
let targetRot = 4.5 * Math.PI;
let stopAcceleration = 0;
let startedStop = false

const rotByValue = {
    
    100000: 0,
    1: 330,
    10000: 300,
    20: 270,
    1000: 240,
    30: 210,
    500: 180,
    50: 150,
    400: 120,
    100: 90,
    300: 60,
    200: 30
}
const WheelPrizeSpinModal = (props) => {
    const { show, onHide, showWheelPrizeWinModal, getPrize, effectAudioVolume } = props;
    const { active, account } = useWeb3React();  
    const canvasRef = useRef(null);
    const spinAudioRef = useRef(null);
    
    useEffect(() => {

    }, [canvasRef])
    useEffect(() => {
        mounted = true
        currentSpeed = 0
        currentRot = 0
        return () => {mounted = false}
        
    }, [])
    useEffect(async () => {
        mounted = show
        wheelImg.src = wheelImgSrc;
        middleImg.src = middleImgSrc
        arrowImg.src = arrowImgSrc
        wheelImg.onload = DrawWheelPrize
        currentRot = 0
        startedStop = false
        if(currentTimeOut) {
            clearTimeout(currentTimeOut)
        }
        if(show) {
            let prize = await getPrize()
            
            if(prize === "Not logged in!") {
                setPopUp("Not logged in!")
            }
            else {
                targetRot = 4 * Math.PI + (rotByValue[prize] + Math.random() * 28 - 14) / 180 * Math.PI
                DrawWheelPrize()
                setTimeout(startRotation, 2000)
            }
        }
    }, [show])
    const startRotation = () => {
        playSpinAudio()
        currentTimeOut = DrawRunningCanvas()
    }
    useEffect(() => {
        //console.log("canvasRef: ", canvasRef.current)
        if(canvasRef.current !== null) {
            ctx = canvasRef.current.getContext('2d');
            ctx.translate(canvas_width/2,  canvas_height/2)
            
        }
    }, [canvasRef.current])
    useEffect(() => {
        if(spinAudioRef.current !== null) {
            spinAudioRef.current.volume = effectAudioVolume / 100
        }
        
    }, [effectAudioVolume, spinAudioRef.current])
    const playSpinAudio = () => {
        spinAudioRef.current.currentTime = 0
        spinAudioRef.current.play()
    }
    const DrawWheelPrize = () => {
        if(ctx !== null) {
            console.log("~~~~~~~~~~DrawWheelPrize")
            ctx.drawImage(wheelImg,  -img_width/2 , -img_height/2, img_width, img_height);
            ctx.drawImage(middleImg,  -middleImgWidth/2 , -middleImgHeight/2, middleImgWidth, middleImgHeight);
            ctx.drawImage(arrowImg,  img_width/2 - arrowImgWidth - 10, -arrowImgHeight/2, arrowImgWidth, arrowImgHeight);
        }

    }
    const DrawRunningCanvas = () => {
        if(!mounted) return
        if(ctx !== null) {
            ctx.clearRect(-canvas_width/2, -canvas_height/2, canvas_width, canvas_height);
            
            
            ctx.save();
            if(currentSpeed < maxSpeed && currentRot < Math.PI * 2) {
                currentSpeed += 0.02
            }
            if(currentRot > targetRot && !startedStop) {
                
                let leftRot = 2 * Math.PI - (currentRot - targetRot)
                stopAcceleration = Math.pow(currentSpeed, 2)/(2*leftRot + currentSpeed)
                startedStop = true
                console.log("~~~~~~~~~~~leftRot: ", leftRot, currentRot, stopAcceleration)
            }
            if(startedStop && currentSpeed > 0) {
                currentSpeed -= stopAcceleration
            }
            
            currentRot += currentSpeed
            ctx.rotate(currentRot)
            ctx.drawImage(wheelImg,  -img_width/2 , -img_height/2, img_width, img_height);
            ctx.restore();
            ctx.drawImage(middleImg,  -middleImgWidth/2 , -middleImgHeight/2, middleImgWidth, middleImgHeight);
            ctx.drawImage(arrowImg,  img_width/2 - arrowImgWidth - 10, -arrowImgHeight/2, arrowImgWidth, arrowImgHeight);
            if(currentSpeed <= 0) 
            {
                console.log("~~~~~~~~~~~stop rot: ", currentRot)
                setTimeout(endRotate, 2000)
                
                return
            }
        }
        //setTimeout(endRotate, 300)
        setTimeout(DrawRunningCanvas, 40)
    }
    const endRotate = () => {
        showWheelPrizeWinModal()
        onHide()
    }
    return (
        <>
            <Modal show={show} onHide={onHide} className="monkey-modal wheel-prize-spin-modal">
                <audio src={spinSound} ref={spinAudioRef}/>
                <AiOutlineClose  className="close-btn" onClick={onHide}/>
                <Modal.Body>
                    
                    <canvas ref={canvasRef} width={`${canvas_width}`} height={`${canvas_height}`} className="wheel-canvas"></canvas>
                </Modal.Body>
            </Modal>
            
        </>
    );
}

const mapStateToProps  = (state) => (
    {
        effectAudioVolume: state.betGameData.effectAudioVolume,
    }
)
export default connect(mapStateToProps, {showWheelPrizeWinModal, getPrize})(WheelPrizeSpinModal)