import { Table } from 'react-bootstrap';

import './index.scss';
import BNB1Img from '../../assets/images/playpage/bnb1.png';
import BNB2Img from '../../assets/images/playpage/bnb2.png';
import TakCoinImg from '../../assets/images/Neon___flare_BNB.png';

const loadedData = false;
const TransActionTableComponent = (props) => {
    const { dataList } = props;
 
    return (
        <div className='custom-table desktop-data-list'>
            <Table>
                <thead>
                    <tr className='custom-table-tr'>
                        <th>Event</th>
                        <th>Status</th>
                        <th>Amount</th>
                        <th>Fee</th>
                        <th>Credited On</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dataList.length > 0 &&
                        dataList.map((data, index) => 
                            <tr key={index} className={`transaction-cell ${index % 2 && "obb"}`}>
                                <td><div>
                                    {data[2]}
                                </div></td>
                                <td><span className='green-font'>{data[3]}</span></td>
                                <td><div>
                                    <div>
                                        
                                        <img className='coin-type' src={TakCoinImg} alt="bnb1" />
                                        {data[0]}
                                        
                                    </div>
                                </div></td>
                                <td><div>
                                <div>
                                    <img src={TakCoinImg} className='coin-type' alt="bnb2" />
                                    {data[1]}
                                    </div>
                                </div></td>
                                <td><div>
                                    {data[4]}
                                </div></td>
                            </tr>
                            
                        )
                    }
                    
                </tbody>
            </Table>
            {
                dataList.length === 0 &&
                <div className="no-transaction-alert">
                    No Transactions
                </div>
            }
        </div> 
    );
}

export default TransActionTableComponent