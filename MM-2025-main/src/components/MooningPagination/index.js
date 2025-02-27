import React, { useState, useEffect,useRef } from "react";
import Pagination from 'react-responsive-pagination';
import Select from 'react-select';
import './index.scss';

const MooningPagination = (props) => {
  const { tableRecodCountOptions, selectStyle, displayCount, changeDisplayCount, changeCurrentPage, currentPage, 
    changeDisplayData, allData, displayData } = props;
  
  const getDisplayData = (baseData, selectedPageNumber, selectedDisplayCount) => {
    const displayArray = baseData.slice((selectedPageNumber-1) * selectedDisplayCount, selectedPageNumber*selectedDisplayCount)
    return displayArray;
  }
  useEffect(
    () => {
        let _displayData = getDisplayData(allData, currentPage, displayCount)
        changeDisplayData(_displayData)
    },
    [allData, currentPage, displayCount],
  );
  useEffect(
      () => {
        setTotalPageCount(parseInt((allData.length-1) / displayCount + 1))
      },
      [allData, displayCount],
  );
  const [totalPageCount, setTotalPageCount] = useState(0)
    return (
        <div className="mooning-select-pagination">
            <div className="mooning-select">
                    <Select value={{label: `${displayCount} Records`, value: displayCount}} className="record-count-select"
                        onChange={(e)=>changeDisplayCount(e.value)}
                        options = {tableRecodCountOptions} styles = {selectStyle}>
                    </Select>
                    <div className='custom-table-bottom-left-status'>{`Showing ${displayData.length} out of ${allData.length}`}</div>
            </div>
            <div className='mooning-pagination'>
                <Pagination current={currentPage}
                    total={totalPageCount}
                    onPageChange={changeCurrentPage}>  
                </Pagination>
            </div>
        </div>    
    );
}

export default MooningPagination;