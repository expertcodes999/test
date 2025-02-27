import { Modal } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import { useState, useEffect } from 'react';
import './index.scss';
import {connect} from 'react-redux'
import {getUserStats, addFriend, getMyStatsChartData} from '../../actions/userActions';
import {MY_STATS_CHART_TYPE} from '../../utils/types';
import {nextVersion} from '../../utils/constant';

const ChartTimeFrame = [
    'ALL',
    'H',
    'D',
    'W',
    'M'
];
const UserStatsModal = (props) => {
    const { show, onHide, userName, addFriend } = props;
    const [userStats, setUserStats] = useState({

    });
    const [chartData, setChartData] = useState({
        dataType: MY_STATS_CHART_TYPE.GAME_PLAYED,
        timeFrame: ChartTimeFrame[0],
        data: []
    })
    const [chartDataType, setChartDataType] = useState(ChartTimeFrame[0])
    const chartOptions = {
        chart: {
            type: 'area',
            id: "basic-bar",
            zoom: {
                enabled: false
            },
            background: 'rgba(52, 52, 52, 0)'

        },
        dataLabels: {
            enabled: false
        },
        legend: {
            horizontalAlign: 'left'
        },
        labels: [30, 40, 45, 50, 49, 60, 70, 91],
        xaxis: {
            categories: [17, 18, 19, 20, 21, 22, 23, 24]
        },
        stroke: {
            curve: 'straight',
            width: 1
        },
        fill: {
            type: 'gradient',
            gradient: {
              opacityFrom: 0.6,
              opacityTo: 0.8,
            }
          },
        tooltip: {
            enabled: true
        },
        theme: {
            mode: 'dark'
        },
        colors: ['#F001F4']
    }
    const getJoinedFormatedDate = (date) => {
        const joinedDate = new Date(date)
        let yearStr = joinedDate.getFullYear().toString()
        yearStr = yearStr.substring(yearStr.length - 2)
        let dayStr = "0" + joinedDate.getDate().toString()
        dayStr = dayStr.substring(dayStr.length - 2)
        let monthStr = "0" + (joinedDate.getMonth() + 1).toString()
        monthStr = monthStr.substring(monthStr.length - 2)
        let hourStr = "00" + joinedDate.getHours().toString()
        hourStr = hourStr.substring(hourStr.length - 2)
        let minuteStr = "00" + joinedDate.getMinutes().toString()
        minuteStr = minuteStr.substring(minuteStr.length - 2)
        let secondStr = "00" + joinedDate.getSeconds().toString()
        secondStr = secondStr.substring(secondStr.length - 2)
        return dayStr + "/" + monthStr + "/" + yearStr + " " + hourStr + ":" + minuteStr + ":" + secondStr
    }
    useEffect(
        async () => {
            if(show) {
                setUserStats ({
                    ...userStats,
                    registeredDate: "2000-01-01 00:00:00",
                    betAmount: 0,
                    totalWagered: 0,
                    netProfit: 0,
                    profitATH: 0,
                    profitATL: 0,
                    avgDailyBet: 0,
                    avgWeeklyBet: 0,
                    avgMonthlyBet: 0
                })

                const statsData = await getUserStats(userName)
                if(statsData.length > 0) {
                    setUserStats ({
                        ...userStats,
                        registeredDate: statsData[0][0],
                        betAmount: statsData[0][1],
                        totalWagered: statsData[0][2],
                        netProfit: statsData[0][3],
                        profitATH: statsData[0][4],
                        profitATL: statsData[0][5],
                        avgDailyBet: statsData[0][6],
                        avgWeeklyBet: statsData[0][7],
                        avgMonthlyBet: statsData[0][8]
                    })
                }
            }
        },
        [show],
    );
    useEffect(
        async () => {
            const _chartData = await getMyStatsChartData(MY_STATS_CHART_TYPE.GAME_PLAYED, ChartTimeFrame[0], userName)
            setChartData({
                ...chartData,
                data: _chartData
            })
        },
        [userName],
    );
    const chartSeries = [
        {
          name: "series-1",
          data: [30, 40, 45, 50, 49, 60, 70, 91]
        }
    ]
    const onClickAddFriendBtn = (userName) => {
        addFriend(userName)
        onHide()
    }
    const onClickChartBtn = async (chartType) => {
        const _chartData = await getMyStatsChartData(chartType, chartData.timeFrame, userName)
        setChartData({
            ...chartData,
            dataType: chartType,
            data: _chartData
        })
    }
    const onClickTimeFrameBtn = async (timeFrame) => {
        const _chartData = await getMyStatsChartData(chartData.dataType, timeFrame, userName)
        setChartData({
            ...chartData,
            timeFrame: timeFrame,
            data: _chartData
        })
    }
    return (
        <Modal show={show} onHide={onHide} className="monkey-modal stats-modal">
            <Modal.Header closeButton closeVariant='white'>
                <Modal.Title><span>User Stats</span></Modal.Title>

            </Modal.Header>
            <Modal.Body>
                <h5 className="title-midle mb-3 poppin-bold-txt">{userName}</h5>
                <p className="mt-3 poppin-light-txt"><span className="pink-monkey-text pr-2 poppin-light-txt">Joined:</span>{getJoinedFormatedDate(userStats.registeredDate)}</p>

                <div className="change-box-bottom-btn mt-3 three-dif-btn">
                    {
                        nextVersion&&
                        
                        <button className="tip-btn">
                            Tip
                        </button>
                    }
                    <button onClick={()=>onClickAddFriendBtn(userName)} className="cta-btn add-friend-btn">
                        + Add Friend
                    </button>
                    {
                        nextVersion&&
                    
                        <button className="block-user-btn">
                            Block User
                        </button>
                    }
                </div>

                <ul className="pl-4 stauts-bullet">
                    <li>
                        <div className="share_detail">
                        <button className="chart-data-get-btn" onClick={()=>onClickChartBtn(MY_STATS_CHART_TYPE.GAME_PLAYED)}>Games Played:</button>
                            <div>
                                <span>{Number(Number(userStats.betAmount).toFixed(0)).toLocaleString('en-US')}</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="share_detail">
                        <button className="chart-data-get-btn" onClick={()=>onClickChartBtn(MY_STATS_CHART_TYPE.TOTAL_WAGERED)}>Total Wagered:</button>
                            <div>
                                <span>{Number(Number(userStats.totalWagered).toFixed(0)).toLocaleString('en-US')}</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="share_detail">
                        <button className="chart-data-get-btn" onClick={()=>onClickChartBtn(MY_STATS_CHART_TYPE.NET_PROFIT)}>Net Profit:</button>
                            <div>
                                <span>+ {Number(Number(userStats.netProfit).toFixed(0)).toLocaleString('en-US')}</span>
                            </div>
                        </div>
                    </li>
                    {/*<li>
                        <div className="share_detail">
                            <span>Profit All Time High:</span>
                            <div>
                                <span>+ {Number(Number(userStats.profitATH).toFixed(0)).toLocaleString('en-US')}</span>
                            </div>
                        </div>
                    </li>
                    <li>
                        <div className="share_detail">
                            <span>Profit All Time Low:</span>
                            <div>
                                <span>- {Number(Number(userStats.profitATL).toFixed(0)).toLocaleString('en-US')}</span>
                            </div>
                        </div>
                    </li>*/}
                </ul>


                <p className="mt-4"><span className="pink-monkey-text pr-2">Hint:</span>Click and drag to zoom, hold shift to pan.</p>


                <div className="">
                    <div className="chart-header">
                        {
                            chartData.dataType === MY_STATS_CHART_TYPE.GAME_PLAYED &&
                            <h5 className="chart-title">Games played</h5>
                        }
                        {
                            chartData.dataType === MY_STATS_CHART_TYPE.TOTAL_WAGERED &&
                            <h5 className="chart-title">Total Wagered</h5>
                        }
                        {
                            chartData.dataType === MY_STATS_CHART_TYPE.NET_PROFIT &&
                            <h5 className="chart-title">Net Profit</h5>
                        }
                        <div className="chart-data-type">
                            {
                                ChartTimeFrame.map(data => 
                                    <button className={`type ${chartData.timeFrame === data ? 'selected-type' : ''}`}
                                        onClick={()=>onClickTimeFrameBtn(data)}>{data}</button>
            
                                )
                            }
                        </div>
                    </div>
                    {
                        chartData.data.length > 0 &&
                        <ReactApexChart type="area"
                            height={200}
                            options={{...chartOptions, xaxis: {categories: chartData.data.map(data => data[1])}}} series={[
                                {
                                    type: 'area',
                                    name: "",
                                    data: chartData.data.map(data => data[0])
                                }
                            ]}
                        />
                    
                    }
                </div>

                <div className="total-info">
                    <p className="detail">Average daily bet: <span>{Number(Number(userStats.avgDailyBet).toFixed(0)).toLocaleString('en-US')}</span></p>
                    <p className="detail">Average weekly bet: <span>{Number(Number(userStats.avgWeeklyBet).toFixed(0)).toLocaleString('en-US')}</span></p>
                    <p className="detail">Average monthly bet: <span>{Number(Number(userStats.avgMonthlyBet).toFixed(0)).toLocaleString('en-US')}</span></p>
                </div>
            </Modal.Body>
        </Modal>
    );
}

const mapStateToProps  = (state) => (
    {

    }
)
export default connect(mapStateToProps, {addFriend})(UserStatsModal)