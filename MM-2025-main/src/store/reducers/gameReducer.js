import {GET_ALL_BET_SUCCESS, 
    GET_ALL_BET_ERROR, 
    SET_GAME_RESULT, 
    GAME_STATE, 
    CHANGE_GAME_STATE,
    GET_GAME_HISTORY_SUCCESS,
    GET_GAME_HISTORY_ERROR,
    SET_POPUP,
    GET_ONLINE_PLEYERS_SUCCESS,
    GET_ONLINE_PLEYERS_ERROR,
    SHOW_LOGIN_MODAL,
    HIDE_LOGIN_MODAL,
    GAME_HISTORY_TYPE,
    HIDE_STATS_MODAL,
    SHOW_STATS_MODAL,
    HIDE_HELP_MODAL,
    SHOW_HELP_MODAL,
    HIDE_HELP_DETAIL_MODAL,
    SHOW_HELP_DETAIL_MODAL,
    HIDE_HISTORY_MODAL,
    SHOW_HISTORY_MODAL,
    HIDE_LEADERBOARD_MODAL,
    SHOW_LEADERBOARD_MODAL,
    SHOW_FORGOT_PASSWORD_MODAL,
    HIDE_FORGOT_PASSWORD_MODAL,
    SHOW_RESET_PASSWORD_MODAL,
    HIDE_RESET_PASSWORD_MODAL,
    HIDE_TX_SIGN_MODAL,
    SHOW_TX_SIGN_MODAL,

    SHOW_BANKROLL_MODAL,
    HIDE_BANKROLL_MODAL,
    SHOW_WITHDRAW_MODAL,
    HIDE_WITHDRAW_MODAL,
    SHOW_SELECT_NETWORK_MODAL,
    HIDE_SELECT_NETWORK_MODAL,
    SHOW_DEPOSIT_MODAL,
    HIDE_DEPOSIT_MODAL,
    SHOW_DAILY_BONUS_MODAL,
    HIDE_DAILY_BONUS_MODAL,
    SHOW_SELECT_WALLET_MODAL,
    HIDE_SELECT_WALLET_MODAL,
    SHOW_WHEEL_PRIZE_SPIN_MODAL,
    HIDE_WHEEL_PRIZE_SPIN_MODAL,
    SHOW_WHEEL_PRIZE_WIN_MODAL,
    HIDE_WHEEL_PRIZE_WIN_MODAL,

    SET_LATEST_RESULTS,
    GET_GAME_COINS,
    SET_BACK_AUDIO_VOLUME,
    SET_EFFECT_AUDIO_VOLUME,
    SET_BET_BUTTON_VOLUME,
    SET_MUTE_AUDIO,
    SET_TIME_TO_START,
    SET_ROUND_WIN,
    GET_LAST_RESULTS,
    GET_MAX_PROFIT,
    BOOK_BET,
    STOP_BOOK_BET,
    CHANGE_CURRENT_BET_COION,
    BET_COIN,
    PLAY_BETBUTTON_CLICK_SOUND,
    PLAY_CLOSEBUTTON_CLICK_SOUND,
    PLAY_BET_SOUND,
    PLAY_SPIN_BTN_CLICK_SOUND,
    GET_PRIZE,
    SET_FINGER_PRINTER,
    SET_DISPLAY_VALUE
} from '../../utils/types';

const initialState = {
    gameHistory: null,
    loading: false,
    loaded: false,
    displayValue: 1,
    winOnRound: false,
    popup: "",
    crashValues: [],
    displayValues: [],
    displayStatsModal: false,
    displayLoginModal: false,
    displayHelpModal: false,
    displayHelpDetailModal: false,
    displayHistoryModal: false,
    displayLeaderboardModal: false,
    displayForgotPasswordModal: false,
    displayResetPasswordModal: false,
    displayTxSignModal: false,
    
    displayBankRollModal: false,
    displayWithdrawModal: false,
    displaySelectNetworkModal: false,
    displayDepositModal: false,
    displayDailyBonusModal: false,
    displaySelectWalletModal: false,
    displayWheelPrizeSpinModal: false,
    displayWheelPrizeWinModal: false,

    helpDetailData: {},
    latestResults: [],
    currentTime: 0,
    coins: [],
    backgroundAudioVolume: 10,
    effectAudioVolume: 5,
    betButtonVolume: 10,
    muteAudio: true,
    timeToStart: 0,
    maxProfit: 0,
    isBetBooked: false,
    bookedAmount: 0,
    bookedMultiplier: 0,
    currentBetCoin: BET_COIN.BITS,
    playBetButtonSound: false,
    playCancelButtonSound: false,
    playSpinBtnSound: false,
    playBetSound: false,
    betSoundType: null,
    wheelPrize: 0,
    fingerPrinterValue: ""
}
let usernamess = ""
let curValue = 1
const gameReducer = (state = initialState, action) => {
    let _displayValues = []
    let _crashValues = []
    switch(action.type){
        case SET_DISPLAY_VALUE:
            return {
                ...state,
                displayValue: action.payload
            }
            break;
        case SET_FINGER_PRINTER:
            return {
                ...state,
                fingerPrinterValue: action.payload
            }
        case GET_PRIZE:
            return {
                ...state,
                wheelPrize: action.payload
            }
        case PLAY_BET_SOUND:
            return {
                ...state,
                playBetSound: action.payload.play,
                betSoundType: action.payload.soundType,
            }
        
        case PLAY_BETBUTTON_CLICK_SOUND:
            return {
                ...state,
                playBetButtonSound: action.payload
            }
        case PLAY_CLOSEBUTTON_CLICK_SOUND:
            return {
                ...state,
                playCancelButtonSound: action.payload
            }
        case PLAY_SPIN_BTN_CLICK_SOUND:
            return {
                ...state,
                playSpinBtnSound: action.payload
            }
        case CHANGE_CURRENT_BET_COION:
        return {
            ...state,
            currentBetCoin: action.payload
        }
        case STOP_BOOK_BET:
        return {
            ...state,
            isBetBooked: false,
            bookedAmount: 0,
            bookedMultiplier: 0
        }
        case BOOK_BET:
        return {
            ...state,
            isBetBooked: true,
            bookedAmount: action.payload.bookAmount,
            bookedMultiplier: action.payload.bookMultiplier
        }
        case GET_MAX_PROFIT:
        return {
            ...state,
            maxProfit: action.payload
        }
        
        case GET_LAST_RESULTS:
        return {
            ...state,
            latestResults: action.payload
        }
        case GET_GAME_COINS:
        return {
            ...state,
            coins: action.payload.map(gameCoin => 
            {
                return { tokenAddress: gameCoin[1], tokenDecimal: gameCoin[2], tokenName: gameCoin[4], tokenImgSrc: gameCoin[5], tokenMultiplier: gameCoin[6]}
            }),
        }
        
        case SET_TIME_TO_START:
            return {
                ...state,
                timeToStart: action.payload
            }

        case SET_ROUND_WIN:
            return {
                ...state,
                winOnRound: action.payload
            }
        case GET_GAME_HISTORY_SUCCESS:
        return {
            ...state,
            gameHistory: action.payload.map(historyData => 
                {
                    if(action.historyType !== GAME_HISTORY_TYPE.MY_WAGER) {
                        return { 
                            username: historyData[0],  
                            address: historyData[1], 
                            bet: historyData[2], 
                            multiplier:historyData[3], 
                            payout:historyData[4], 
                            gameDate:historyData[5]
                        }
                    }
                    else {
                        return {
                            
                            bet: historyData[0],
                            multiplier:historyData[1],
                            payout:historyData[2],
                            gameDate:historyData[3]
                        }
                    }
                }
            )
        }
        
        case SET_BACK_AUDIO_VOLUME:
            return {
                ...state,
                backgroundAudioVolume: action.payload
            }
        case SET_EFFECT_AUDIO_VOLUME:
            return {
                ...state,
                effectAudioVolume: action.payload
            }
        case SET_BET_BUTTON_VOLUME:
            return {
                ...state,
                betButtonVolume: action.payload
            }
        case SET_MUTE_AUDIO:
            return {
                ...state,
                muteAudio: action.payload
            }
        case GET_GAME_HISTORY_ERROR:
        return {
            ...state,
            gameHistory: []
        }
        case SET_POPUP:
        return {
            ...state,
            popup: action.payload
        }
        
        case SHOW_LOGIN_MODAL:
        return {
            ...state,
            displayLoginModal: true
        }
        case HIDE_LOGIN_MODAL:
        return {
            ...state,
            displayLoginModal: false
        }
        case SHOW_STATS_MODAL:
        return {
            ...state,
            displayStatsModal: true
        }
        case HIDE_STATS_MODAL:
        return {
            ...state,
            displayStatsModal: false
        }
        case SHOW_HELP_MODAL:
        return {
            ...state,
            displayHelpModal: true
        }
        case HIDE_HELP_MODAL:
        return {
            ...state,
            displayHelpModal: false
        }
        case SHOW_HELP_DETAIL_MODAL:
        return {
            ...state,
            helpDetailData: action.payload,
            displayHelpDetailModal: true,
            displayHelpModal: false
        }
        case HIDE_HELP_DETAIL_MODAL:
        return {
            ...state,
            helpDetailData: {},
            displayHelpDetailModal: false
        }
        case SHOW_HISTORY_MODAL:
            return {
                ...state,
                displayHistoryModal: true
            }
        case HIDE_HISTORY_MODAL:
            return {
                ...state,
                displayHistoryModal: false
            }
        case SHOW_LEADERBOARD_MODAL:
        return {
            ...state,
            displayLeaderboardModal: true
        }
        case HIDE_LEADERBOARD_MODAL:
        return {
            ...state,
            displayLeaderboardModal: false
        }
        case SHOW_FORGOT_PASSWORD_MODAL:
        return {
            ...state,
            displayForgotPasswordModal: true
        }
        case HIDE_FORGOT_PASSWORD_MODAL:
        return {
            ...state,
            displayForgotPasswordModal: false
        }
        case SHOW_RESET_PASSWORD_MODAL:
        return {
            ...state,
            displayResetPasswordModal: true
        }
        case HIDE_RESET_PASSWORD_MODAL:
        return {
            ...state,
            displayResetPasswordModal: false
        }
        case SHOW_TX_SIGN_MODAL:
        return {
            ...state,
            displayTxSignModal: true
        }
        case HIDE_TX_SIGN_MODAL:
        return {
            ...state,
            displayTxSignModal: false
        }
        case SHOW_BANKROLL_MODAL:
        return {
            ...state,
            displayBankRollModal: true
        }
        case HIDE_BANKROLL_MODAL:
        return {
            ...state,
            displayBankRollModal: false
        }
        case SHOW_WITHDRAW_MODAL:
        return {
            ...state,
            displayWithdrawModal: true
        }
        case HIDE_WITHDRAW_MODAL:
        return {
            ...state,
            displayWithdrawModal: false
        }
        case SHOW_SELECT_NETWORK_MODAL:
        return {
            ...state,
            displaySelectNetworkModal: true
        }
        case HIDE_SELECT_NETWORK_MODAL:
        return {
            ...state,
            displaySelectNetworkModal: false
        }
        case SHOW_DEPOSIT_MODAL:
        return {
            ...state,
            displayDepositModal: true
        }
        case HIDE_DEPOSIT_MODAL:
        return {
            ...state,
            displayDepositModal: false
        }
        case SHOW_DAILY_BONUS_MODAL:
        return {
            ...state,
            displayDailyBonusModal: true
        }
        case HIDE_DAILY_BONUS_MODAL:
        return {
            ...state,
            displayDailyBonusModal: false
        }
        case SHOW_SELECT_WALLET_MODAL:
        return {
            ...state,
            displaySelectWalletModal: true
        }
        case HIDE_SELECT_WALLET_MODAL:
        return {
            ...state,
            displaySelectWalletModal: false
        }
        case SHOW_WHEEL_PRIZE_SPIN_MODAL:
        return {
            ...state,
            displayWheelPrizeSpinModal: true
        }
        case HIDE_WHEEL_PRIZE_SPIN_MODAL:
        return {
            ...state,
            displayWheelPrizeSpinModal: false
        }
        case SHOW_WHEEL_PRIZE_WIN_MODAL:
        return {
            ...state,
            displayWheelPrizeWinModal: true
        }
        case HIDE_WHEEL_PRIZE_WIN_MODAL:
        return {
            ...state,
            displayWheelPrizeWinModal: false
        }
        
        case SET_LATEST_RESULTS:
        return {
            ...state,
            latestResults: [[action.payload], ...state.latestResults].slice(0, 20)
        }
        default: return state
    }

}


export default gameReducer;