import { useState, useEffect } from "react";
import {connect} from 'react-redux'
import { withRouter } from 'react-router-dom';

import { hideBankRollModal, hideWithdrawModal, hideSelectWalletModal,
  hideSelectNetworkModal, hideLoginModal, hideStatsModal, hideWheelPrizeSpinModal,
  hideHelpModal, hideHelpDetailModal, hideForgotPasswordModal, hideResetPasswordModal, hideDepositModal,
  hideHisotyModal, hideTxSignModal, hideLeaderboardModal, hideDailyBonusModal, hideWheelPrizeWinModal} from '../../actions/gameActions'
import BankrollModal from '../BanrollModal';
import LeaderboardModal from '../LeaderboardModal';
import DepositModal from '../DepositModal';
import StatsModal from '../StatsModal';
import WithdrawModal from '../WIthdrawModal';
import LoginModal from '../LoginModal';
import HelpModal from '../HelpModal';
import HelpDetailModal from '../HelpModal/HelpDetailModal';
import StakingHistoryModal from '../StakingHistoryModal';
import TxSignModal from '../TxSignModal';
import ForgotPassword from '../ForgotPassword';
import ResetPassword from '../ResetPassword';
import SelectNetworkModal from '../SelectNetworkModal';
import DailyBonusModal from '../DailyBonusModal';
import SelectWalletModal from '../SelectWalletModal'
import WheelPrizeSpinModal from '../WheelPrizeSpinModal';
import WheelPrizeWinModal from '../WheelPrizeWinModal';


const ModalController = (props) => {
    const { hideResetPasswordModal, hideLoginModal, hideSelectWalletModal,
      hideBankRollModal, hideWithdrawModal, hideDailyBonusModal, hideWheelPrizeWinModal,
      hideSelectNetworkModal, hideDepositModal, hideStatsModal, hideLeaderboardModal, hideHelpModal, 
      hideHelpDetailModal, hideHisotyModal, hideForgotPasswordModal, hideTxSignModal, hideWheelPrizeSpinModal,
      
      displayDailyBonusModal,
      displayStatsModal, displayLoginModal,
      displayHelpModal,
      displayHelpDetailModal,
      displayHistoryModal,
      displayLeaderboardModal,
      displayForgotPasswordModal,
      displayResetPasswordModal,
      displayTxSignModal,
      
      displayBankRollModal,
      displayWithdrawModal,
      displaySelectNetworkModal, displaySelectWalletModal, displayWheelPrizeSpinModal, displayWheelPrizeWinModal,
      displayDepositModal } = props;
    
    return (
        <>
            <BankrollModal show={displayBankRollModal} onHide={() => hideBankRollModal()} />
            <LeaderboardModal show={displayLeaderboardModal} onHide={() => hideLeaderboardModal()} />
            <StatsModal show={displayStatsModal} onHide={() => hideStatsModal()} />
            <DepositModal show={displayDepositModal} onHide={() => hideDepositModal()} />
            <WithdrawModal show={displayWithdrawModal} onHide={() => hideWithdrawModal()} />
            <SelectNetworkModal show={displaySelectNetworkModal} onHide={() => hideSelectNetworkModal()} />
            <LoginModal show={displayLoginModal} onHide={() => hideLoginModal()} />
            <HelpModal show={displayHelpModal} onHide={() => hideHelpModal()} />
            <HelpDetailModal show={displayHelpDetailModal} onHide={() => hideHelpDetailModal()} />
            <StakingHistoryModal show={displayHistoryModal} onHide={() => hideHisotyModal()} />
            <ForgotPassword show={displayForgotPasswordModal} onHide={() => hideForgotPasswordModal()} />
            <ResetPassword show={displayResetPasswordModal} onHide={() => hideResetPasswordModal()} />
            <TxSignModal show={displayTxSignModal} onHide={() => hideTxSignModal()} />
            <DailyBonusModal show={displayDailyBonusModal} onHide={() => hideDailyBonusModal()} />
            <SelectWalletModal show={displaySelectWalletModal} onHide={() => hideSelectWalletModal()} />
            { 
              displayWheelPrizeSpinModal&&
                <WheelPrizeSpinModal show={displayWheelPrizeSpinModal} onHide={() => hideWheelPrizeSpinModal()} />
            }
            <WheelPrizeWinModal show={displayWheelPrizeWinModal} onHide={() => hideWheelPrizeWinModal()} />
        </>    
    );
}

const mapStateToProps  = (state) => (
  {
    displayLoginModal: state.betGameData.displayLoginModal,
    displayStatsModal: state.betGameData.displayStatsModal,
    displayHelpModal: state.betGameData.displayHelpModal,
    displayHelpDetailModal: state.betGameData.displayHelpDetailModal,
    displayHistoryModal: state.betGameData.displayHistoryModal,
    displayForgotPasswordModal: state.betGameData.displayForgotPasswordModal,
    displayResetPasswordModal: state.betGameData.displayResetPasswordModal,
    displayTxSignModal: state.betGameData.displayTxSignModal,
    displayLeaderboardModal: state.betGameData.displayLeaderboardModal,
    displayDepositModal: state.betGameData.displayDepositModal,
    displaySelectNetworkModal: state.betGameData.displaySelectNetworkModal,
    displayWithdrawModal: state.betGameData.displayWithdrawModal,
    displayBankRollModal: state.betGameData.displayBankRollModal,
    displayDailyBonusModal: state.betGameData.displayDailyBonusModal,
    displaySelectWalletModal: state.betGameData.displaySelectWalletModal,
    displayWheelPrizeSpinModal: state.betGameData.displayWheelPrizeSpinModal,
    displayWheelPrizeWinModal: state.betGameData.displayWheelPrizeWinModal,
  }
)

export default withRouter(connect(mapStateToProps, { hideResetPasswordModal, hideLoginModal, 
  hideStatsModal, hideLeaderboardModal, hideHelpModal, hideSelectWalletModal, hideWheelPrizeWinModal,
  hideBankRollModal, hideWithdrawModal,  hideDailyBonusModal, hideDepositModal, hideWheelPrizeSpinModal,
  hideSelectNetworkModal, hideHelpDetailModal, hideHisotyModal, hideForgotPasswordModal, hideTxSignModal })(ModalController))