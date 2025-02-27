import { BiPencil } from 'react-icons/bi';
import { AiOutlineCopy } from 'react-icons/ai';
import { RiAlertFill } from 'react-icons/ri';
import ContainerComponentTransparent from "../../../components/ContainerComponentTransparent";
import ContainerGradient from "../../../components/ContainerGradient";

import './index.scss';

const Campaigns = () => {
    return (
      <div className="campaigns">
        <ContainerComponentTransparent className="referral-data data-collection">
          <div className="data-cell">
            <div className="title">
              Name
              <BiPencil className="icon"/>
            </div>
            <div className="data">Insert Name</div>
          </div>
          <div className="data-cell">
            <div className="title">
              Date
              
            </div>
            <div className="data">01/10/2021</div>
          </div>
          <div className="data-cell">
            <div className="title">
              Referrals
              
            </div>
            <div className="data">1</div>
          </div>
          <div className="data-cell">
            <div className="title">
              Referral Gets
              
            </div>
            <div className="data">1.99%/0%</div>
          </div>
          <div className="data-cell link-cell">
            <ContainerGradient className="link-copy">
              referralink.com
              <AiOutlineCopy className="icon"/>
            </ContainerGradient>
            <RiAlertFill className="alert-icon"/>
          </div>
          
        </ContainerComponentTransparent>

        <ContainerComponentTransparent className="wager-data data-collection">
          <div className="data-cell">
            <div className="title">
              Wager
            </div>
            <div className="data">$amount</div>
          </div>
          <div className="data-cell">
            <div className="title">
              Commission Earned
            </div>
            <div className="data">$amount</div>
          </div>
          <div className="data-cell">
            <div className="title">
              Coin Deposited
            </div>
            <div className="data">x</div>
          </div>
          <div className="data-cell">
            <div className="title">
              Referrals
            </div>
            <div className="data">1</div>
          </div>
          <div className="data-cell">
            <div className="title">
              Deposits
            </div>
            <div className="data">1</div>
          </div>
          <div className="data-cell">
            <div className="title">
              Earnings
            </div>
            <div className="data">$amount</div>
          </div>
        </ContainerComponentTransparent>

        <ContainerComponentTransparent className="referral-data data-collection">
          <div className="data-cell">
            <div className="title">
              Name
              <BiPencil className="icon"/>
            </div>
            <div className="data">Insert Name</div>
          </div>
          <div className="data-cell">
            <div className="title">
              Date
              
            </div>
            <div className="data">01/10/2021</div>
          </div>
          <div className="data-cell">
            <div className="title">
              Referrals
              
            </div>
            <div className="data">1</div>
          </div>
          <div className="data-cell">
            <div className="title">
              Referral Gets
              
            </div>
            <div className="data">1.99%/0%</div>
          </div>
          <div className="data-cell link-cell">
            <ContainerGradient className="link-copy">
              referralink.com
              <AiOutlineCopy className="icon"/>
            </ContainerGradient>
            <RiAlertFill className="alert-icon"/>
          </div>
          
        </ContainerComponentTransparent>
      </div>
    );
}

export default Campaigns;