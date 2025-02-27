import { Modal } from "react-bootstrap";
import './index.scss';

import {connect} from 'react-redux'

const ConvertBetCoinTypeModal = (props) => {
    const { show, acceptFunc, cancelFunc, onHide, targetType } = props;
    const clickAcceptBtn = () => {
        acceptFunc()
        onHide()
    }
    const clickCancelBtn = () => {
        cancelFunc()
        onHide()
    }
    return (
        <>
            <Modal show={show} onHide={onHide} className="monkey-modal login-modal">
                <Modal.Header closeButton closeVariant='white'>
                    <Modal.Title><span>Please Confirm</span></Modal.Title>
                    
                </Modal.Header>
                <Modal.Body>
                    Are you sure you want to change the wager units to {targetType}?
                    <p className="coin-change-amount">1 BNB = 10,000 BITS</p>
                    <div className="confirm-modal-btns">
                        <button className="purple-gradient-btn accept-btn" onClick={clickAcceptBtn}>Confirm</button>
                        <button className="purple-gradient-btn cancel-btn" onClick={clickCancelBtn}>Cancel</button>
                    </div>
                </Modal.Body>
            </Modal>
            
        </>
    );
}

const mapStateToProps  = (state) => (
    {
        
    }
)
export default connect(mapStateToProps, {})(ConvertBetCoinTypeModal)