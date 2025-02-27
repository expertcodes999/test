import { useState, useEffect, useRef } from "react";
import {connect} from 'react-redux'
import './index.scss';

import betSound from '../../assets/sound/bet.mp3'
import placeBetSound from '../../assets/sound/betPlaySound.mp3'
import closeBetSound from '../../assets/sound/betCancelSound.mp3'
import stopBetSound from '../../assets/sound/stopBetSound.mp3'
import spinBtnSound from '../../assets/sound/wheel prize/button-click-sound-effect/Button click sound effect --- [0.03].mp3'

import { playBetButtonClickSoundAction, playSpinBtnClickSoundAction, playCloseButtonClickSoundAction, betSoundPlayed } from '../../actions/gameActions'
import { SOUND_TYPE } from '../../utils/types'
const SoundComponent = (props) => {
    const { winOnRound, muteAudio, effectAudioVolume, playBetButtonClickSoundAction, playCloseButtonClickSoundAction, 
       playBetButtonSound, playCancelButtonSound, playSpinBtnClickSoundAction, 
       betButtonVolume, playBetSound, playSpinBtnSound,
       betSoundType, betSoundPlayed } = props;
    const selfWinAudioRef = useRef(null);
    const betBtnAudioRef = useRef(null);
    const closeBetAudioRef = useRef(null);
    const stopBetAudioRef = useRef(null);
    const spinBtnAudioRef = useRef(null);
    
    const playBetSoundFunc = (betActionType) => {
      switch(betActionType) {
        case SOUND_TYPE.PLAY:
          betBtnAudioRef.current.src = placeBetSound
          break;
        case SOUND_TYPE.STOP_ON_PLAYING:
          betBtnAudioRef.current.src = stopBetSound
          break;
        case SOUND_TYPE.CANCEL:
          betBtnAudioRef.current.src = closeBetSound
          break;
      }
      betBtnAudioRef.current.currentTime = 0
      betBtnAudioRef.current.play()
    }
    useEffect(() => {
      //continueVauleSet()
      if(playBetSound) {
        playBetSoundFunc(betSoundType)
        betSoundPlayed()
      }
      
    }, [playBetSound, betSoundType])
    useEffect(() => {
      //continueVauleSet()
      if(winOnRound) {
        selfWinAudioRef.current.currentTime = 0
        selfWinAudioRef.current.play()
      }
    }, [winOnRound])
    useEffect(() => {
      //continueVauleSet()
      if(playBetButtonSound) {
        betBtnAudioRef.current.currentTime = 0
        betBtnAudioRef.current.play()
        playBetButtonClickSoundAction(false)
      }
    }, [playBetButtonSound])
    useEffect(() => {
      //continueVauleSet()
      if(playSpinBtnSound) {
        spinBtnAudioRef.current.currentTime = 0
        spinBtnAudioRef.current.play()
        playSpinBtnClickSoundAction(false)
      }
    }, [playSpinBtnSound])
    useEffect(() => {
      //continueVauleSet()
      if(playCancelButtonSound) {
        closeBetAudioRef.current.currentTime = 0
        closeBetAudioRef.current.play()
        playCloseButtonClickSoundAction(false)
      }
    }, [playCancelButtonSound])

    useEffect(() => {
      selfWinAudioRef.current.muted = muteAudio
      betBtnAudioRef.current.muted = muteAudio
      closeBetAudioRef.current.muted = muteAudio
      stopBetAudioRef.current.muted = muteAudio
      
    }, [muteAudio])
    useEffect(() => {
      selfWinAudioRef.current.volume = effectAudioVolume / 100
      spinBtnAudioRef.current.volume = effectAudioVolume / 100
    }, [effectAudioVolume])
    useEffect(() => {
      betBtnAudioRef.current.volume = betButtonVolume / 100
      closeBetAudioRef.current.volume = betButtonVolume / 100
      stopBetAudioRef.current.volume = betButtonVolume / 100
      
    }, [betButtonVolume])
    return (
        <div>
            <audio src={betSound} ref={selfWinAudioRef}/>
            <audio src={placeBetSound} ref={betBtnAudioRef}/>
            <audio src={closeBetSound} ref={closeBetAudioRef}/>
            <audio src={stopBetSound} ref={stopBetAudioRef}/>
            <audio src={spinBtnSound} ref={spinBtnAudioRef}/>
        </div>    
    );
}

const mapStateToProps  = (state) => (
  {
    winOnRound: state.betGameData.winOnRound,
    effectAudioVolume: state.betGameData.effectAudioVolume,
    betButtonVolume: state.betGameData.betButtonVolume,
    playBetButtonSound: state.betGameData.playBetButtonSound,
    playBetSound: state.betGameData.playBetSound,
    betSoundType: state.betGameData.betSoundType,
    playCancelButtonSound: state.betGameData.playCancelButtonSound,
    playSpinBtnSound: state.betGameData.playSpinBtnSound,
    muteAudio: state.betGameData.muteAudio
  }
)

export default connect(mapStateToProps, {playBetButtonClickSoundAction, playSpinBtnClickSoundAction, betSoundPlayed, playCloseButtonClickSoundAction})(SoundComponent)