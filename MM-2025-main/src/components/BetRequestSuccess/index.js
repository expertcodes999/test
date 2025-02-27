import { BsCheckLg } from 'react-icons/bs';
import './index.scss';

const BetRequestSuccess = (props) => {
    
    return (
        <>
            <span className="success-checkmark"><BsCheckLg/></span>Sucessfully placed your bet!
        </>    
    );
}

export default BetRequestSuccess;