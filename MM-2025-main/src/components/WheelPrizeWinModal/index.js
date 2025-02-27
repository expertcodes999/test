import { Modal } from "react-bootstrap";
import { useWeb3React } from "@web3-react/core";
import { useEffect, useRef, useCallback } from 'react';
import {connect} from 'react-redux'
import { AiOutlineClose } from 'react-icons/ai';
import ReactCanvasConfetti from 'react-canvas-confetti';
import spinWinSound from '../../assets/sound/wheel prize/explosion-prize/Explosion Prize.mp3'
import angelicChoirSound from '../../assets/sound/wheel prize/angelic-choir-ahhh/Ahh-choir-sound-effect.wav'

import './index.scss';

let mounted = false;
const style = {
    position: 'fixed',
    width: '100%',
    height: '100%',
    zIndex: -1
};

const WheelPrizeWinModal = (props) => {
    const { show, onHide, wheelPrize, effectAudioVolume } = props;
    const spinWinAudioRef = useRef(null);
    const angelicChoirAudioRef = useRef(null);
    
    let confettiFunc = () => {}

    useEffect(() => {
        mounted = true
        return () => {mounted = false}
    }, [])

    useEffect(() => {
        if(show) {
            // if (confettiFunc !== null && confettiFunc.current !== null) {
            //     confettiFunc.current.reset()    
            // }
            playSpinWinAudio()
            setTimeout(playAngelicChoirAudio, 2000)
            playConfetti()
        }
    }, [show])

    useEffect(() => {
        if(spinWinAudioRef.current !== null && angelicChoirAudioRef.current !== null) {
            spinWinAudioRef.current.volume = effectAudioVolume / 100
            angelicChoirAudioRef.current.volume = effectAudioVolume / 100
        }
        
    }, [effectAudioVolume, spinWinAudioRef.current, angelicChoirAudioRef.current])

    const playSpinWinAudio = () => {
        spinWinAudioRef.current.currentTime = 0
        spinWinAudioRef.current.play()
    }

    const playAngelicChoirAudio = () => {
        angelicChoirAudioRef.current.currentTime = 0
        angelicChoirAudioRef.current.play()
    }

    const playConfetti = () => {
        confettiFunc(getRandomStyle())
        confettiFunc(getRandomStyle())
        confettiFunc(getRandomStyle())
    }
    const setConfettiFunc = useCallback((func) => {
        confettiFunc = func
        // confettiFunc.current(getRandomStyle())
        // confettiFunc.current(getRandomStyle())
        // confettiFunc.current(getRandomStyle())
    })

    const getRandomStyle = () => {
        return {
            origin: {
                x: Math.random(),
                y: Math.random()
            }
        }
    }

    const clickPlayBtn = () => {
        onHide()
    }
    return (
        <>
            <Modal show={show} onHide={onHide} className="monkey-modal wheel-prize-win-modal">
                <audio src={spinWinSound} ref={spinWinAudioRef}/>
                <audio src={angelicChoirSound} ref={angelicChoirAudioRef}/>
                
                <AiOutlineClose  className="close-btn" onClick={onHide}/>
                <Modal.Body>
          
                    <div className="win-amount">
                        {wheelPrize} Bits
                    </div>
                    <button className="play-button yellow-btn" onClick={clickPlayBtn}>
                        <p className="inner-text">PLAY NOW</p>
                    </button> 
                    <ReactCanvasConfetti
                        style={null}
                        className={"daily-bonus-cofetti"}
                        // set the callback for getting instance. The callback will be called after initialization ReactCanvasConfetti component
                        refConfetti={setConfettiFunc}
                    />
                </Modal.Body>
            </Modal>
            
        </>
    );
}

const mapStateToProps  = (state) => (
    {
        effectAudioVolume: state.betGameData.effectAudioVolume,
        wheelPrize: state.betGameData.wheelPrize
    }
)
export default connect(mapStateToProps, {})(WheelPrizeWinModal)