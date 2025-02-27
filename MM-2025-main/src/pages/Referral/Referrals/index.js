import { useEffect, useState } from "react";

import { gerReferralsHistory } from '../../../actions/gameActions'
import './index.scss';

const Referrals = () => {
  const [referralHistory, setReferralHistory] = useState([])
  useEffect(
    async () => {
      const _referralHistory = await gerReferralsHistory()
      setReferralHistory(_referralHistory)
    }, []
  );
    return (
      <div className="referrals">
        <table className="mooning-table referral-table">
          <thead className="table-header">
            <tr>
              <th>Date</th>
              <th>User</th>
              <th>Wager</th>
              <th>You get</th>
            </tr>
          </thead>
          <tbody className="data-list">
            {
              referralHistory.map(history => {
                return(
                  <tr>
                    <td>{history[3]}</td>
                    <td>{history[0]}</td>
                    <td>{history[1]}</td>
                    
                    <td>{history[2]}</td>
                    
                  </tr>      
                )
              })
            }
            
          </tbody>
        </table>
      </div>
    );
}

export default Referrals;