import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import './index.scss';
import StakingHistoryTable from './StakingHistoryTable';
import { Dropdown } from 'react-bootstrap';
import Pagination from 'react-responsive-pagination';
import Select from 'react-select';
import {getLeaderBoards} from '../../actions/gameActions';
import {getStakingRewards} from '../../actions/userActions';
import {connect} from 'react-redux'

let testData = [["2021-09-24 at 12:15", "Pending", 0.001, -2],
["2021-09-24 at 12:15", "Success", -0.005, -2],
["2021-09-24 at 12:15", "Success", 0.001, -2]];

const StakingHistoryModal = (props) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [displayCount, setDisplayCount] = useState(10);
    const [historyData, setHistoryData] = useState([]);
    const [displayData, setDisplayData] = useState([]);
    const [totalPages, setTotalPageCopunt] = useState(10);
    const { show, onHide, userName } = props;
    let dataList = [];
    for(let i = 0 ; i < 1 ; i ++) {
        dataList.push(["2021-09-24 at 12:15", "Pending", 0.005, -2]);
    }
    for(let i = 0 ; i < 2 ; i ++) {
        dataList.push(["2021-09-24 at 12:15", "Success", -0.005, -2]);
    }
    const getDisplayData = (baseData, selectedPageNumber, selectedDisplayCount) => {
        const displayArray = baseData.slice((selectedPageNumber-1) * selectedDisplayCount, selectedPageNumber*selectedDisplayCount)
        return displayArray;
    }
    useEffect(
        () => {
            
            let _displayData = getDisplayData(historyData, currentPage, displayCount)
            setDisplayData(_displayData)
        },
        [historyData, currentPage, displayCount],
    );
    useEffect(
        () => {
            setTotalPageCopunt(parseInt((historyData.length-1) / displayCount + 1))
        },
        [historyData, displayCount],
    );
    useEffect(
        async () => {
            if(show) {
                const _historyData = await getStakingRewards('ALL', userName)
                setHistoryData(_historyData)
            }
        },
        [show],
    );
    const changeDisplayCount = (e) => {
        setDisplayCount(e);
    }
    
    const onHideAction = () => {
        onHide()
    }
    const tableRecodCountOptions = [
        { value: 10, label: '10 Records' },
        { value: 20, label: '20 Records' },
        { value: 50, label: '50 Records' } 
    ];
    const recordTableStyle = {
        option: (provided, state) => ({
            ...provided,
            color: 'black'
        }),
        control: (provided) => ({
            ...provided,
            backgroundColor: 'rgba(0, 0, 0, 0)',
            borderRadius: '0',
            borderColor: '#515189',
        }),
        singleValue: provided => ({
            ...provided,
            color: 'white'
          })
    }
    return (
        <Modal show={show} onHide={onHideAction} className="monkey-modal staking-claim-modal">
            <Modal.Header closeButton closeVariant='white'>
                <Modal.Title><span>Staking Claim History</span></Modal.Title>
                
            </Modal.Header>
            <Modal.Body>
    
                <div className="table-responsive">
                    <StakingHistoryTable dataList={displayData}/>
                </div>

                <div className='custom-table-bottom'>
                    <div className='custom-table-bottom-left'>
                        <React.Fragment>
                            <Select value={{label: `${displayCount} Records`, value: displayCount}} className="record-count-select"
                                onChange={(e)=>changeDisplayCount(e.value)}
                                options = {tableRecodCountOptions} styles = {recordTableStyle}>

                            </Select>
                            <div className='custom-table-bottom-left-status'>{`Showing ${displayData.length} out of ${historyData.length}`}</div>
                        </React.Fragment>
                    </div>
                    <div className='pagination-content'>
                        <Pagination current={currentPage}
                            total={totalPages}
                            onPageChange={setCurrentPage}>  
                            </Pagination>
                    </div>
                </div>
                
            </Modal.Body>
        </Modal>
    );
}

const mapStateToProps  = (state) => (
    {
        userName: state.userData.userName,
    }
  )
  
  export default connect(mapStateToProps, {})(StakingHistoryModal)