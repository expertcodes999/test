import { Table, Dropdown } from 'react-bootstrap';
import React, { useEffect, useState } from "react";

import takImg from '../../../assets/images/staking-page/tak-img.png';
import './index.scss';


const StakingHistoryTable = (props) => {
    const {dataList} = props;
    return (
        <div className='custom-table leaderboard-table'>
            <Table>
                <thead>
                    <tr className='custom-table-tr'>
                        <th>Created</th>
                        <th>Status</th>
                        <th>Tak Amount</th>
                        <th>Fee</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dataList &&
                        dataList.map(data => 
                            <tr>
                                <td><div className="created-date">{data[1]}</div></td>
                                <td><div className={`status ${data[1]==="Success"?"success-stt": "pending-stt"}`}>{data.status}</div></td>
                                <td><div className="tak-amount"><img src={takImg}></img>{data[0]}</div></td>
                                <td><div className="fee">{data[0]}<img src={takImg}></img></div></td>
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

export default StakingHistoryTable