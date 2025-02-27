import {connect} from 'react-redux'
import { useMediaQuery } from "react-responsive";
import ContainerComponentTransparent from "../../components/ContainerComponentTransparent";
import CoinImg from '../../assets/images/transaction history/coins.png';
import CoinSmallImg from '../../assets/images/referral/coins_small.png';
import MonkeyImg from '../../assets/images/transaction history/monkey.png';
import WalletConnectBackImg from '../../assets/images/transaction history/wallet-connect-back.png';
import { showSelectWalletModal } from '../../actions/gameActions'

const WalletNotConnectedComponent = (props) => {
    const {showSelectWalletModal} = props
    const clickConnectWalletBtn = () => {
        showSelectWalletModal()
    }
    const isDesktop = useMediaQuery({ query: "(min-width: 800px)" });
    return (
        <div className="wallet-not-connected-screen">
            <ContainerComponentTransparent className="alert-content">
                <img className="coin-img" src={isDesktop? CoinImg: CoinSmallImg}></img>
                <img className="monkey-img" src={MonkeyImg}></img>
                <p className="title gradient-font">All transactions in one dashboard</p>
                <p className="description">View all your deposit and withdrawal transactions</p>
            </ContainerComponentTransparent>
            <div className="wallet-connnect-content">
                <img className="background" src={WalletConnectBackImg}></img>
                <div className="connect-content">
                    <p className="title">Connect your wallet to have access to this data</p>
                    <button className="connect-button" onClick={clickConnectWalletBtn}>CONNECT WALLET</button>
                </div>
            </div>
        </div>
    );
}

const mapStateToProps  = (state) => (
    {
        
    }
)

export default connect(mapStateToProps, {showSelectWalletModal})(WalletNotConnectedComponent)