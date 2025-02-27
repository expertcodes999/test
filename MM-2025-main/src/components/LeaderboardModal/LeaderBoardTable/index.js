import { Table, Dropdown } from 'react-bootstrap';
import React, { useEffect, useState } from "react";
import Pagination from 'react-responsive-pagination';
import {connect} from 'react-redux'

import './index.scss';
import {getLeaderBoards} from '../../../actions/gameActions';


const LeaderBoardTable = (props) => {
    const {dataList} = props;
 
    return (
        <div className='custom-table leaderboard-table'>
            <Table>
                <thead>
                    <tr className='custom-table-tr'>
                        <th>#Player</th>
                        <th>Wagered</th>
                        <th>Profit</th>
                        {/* <th>Profit (ATH)</th>
                        <th>Profit(ATL)</th> */}
                        <th>Bets</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        dataList &&
                        dataList.map(data => 
                            <tr>
                                <td>{data.player}</td>
                                <td>{Number(Number(data.wargered).toFixed(0)).toLocaleString('en-US')}</td>
                                <td>{Number(Number(data.profit).toFixed(0)).toLocaleString('en-US')}</td>
                                {/* <td>{Number(Number(data.profitAth).toFixed(0)).toLocaleString('en-US')}</td>
                                <td>{Number(Number(data.{/* ).toFixed(0)).toLocaleString('en-US')}</td> */}
                                <td>{Number(Number(data.bets).toFixed(0)).toLocaleString('en-US')}</td>
                            </tr>
                        )
                    }
                </tbody>
            </Table>
        </div> 
    );
}

const mapStateToProps  = (state) => (
    {

    }
)

export default connect(mapStateToProps, {})(LeaderBoardTable)