import { Modal } from "react-bootstrap";
import './index.scss';

import {connect} from 'react-redux'

const ConfirmClaimModal = (props) => {
    const { show, clickFunction, onHide } = props;
    const clickClaimBtn = () => {
        clickFunction()
    }
    return (
        <>
            <Modal show={show} onHide={onHide} className="monkey-modal login-modal">
                <Modal.Header closeButton closeVariant='white'>
                    <Modal.Title><span>CONFIRM CLAIM</span></Modal.Title>
                    
                </Modal.Header>
                <Modal.Body>
                    <button className="purple-gradient-btn" onClick={clickClaimBtn}>Confirm Claim</button>
                    
                </Modal.Body>
            </Modal>
            
        </>
    );
}

const mapStateToProps  = (state) => (
    {
        
    }
)
export default connect(mapStateToProps, {})(ConfirmClaimModal)