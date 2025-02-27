import { Fragment, useState, useEffect } from "react";
import ReactApexChart from "react-apexcharts";

import {getMyStatsChartData} from '../../actions/userActions';
import {MY_STATS_CHART_TYPE} from '../../utils/types';

import { nextVersion } from "../../utils/constant";
import './index.scss';

const ChartTimeFrame = [
    'ALL',
    'H',
    'D',
    'W',
    'M'
];
const testData = [[4,"22-05-22"],[64,"22-05-23"],[8,"22-06-06"]];
const MyStats = (props) => {
    const { stats, userName, chartOptions, chartSeries } = props;
    const [chartData, setChartData] = useState({
        dataType: '',
        timeFrame: ChartTimeFrame[0],
        data: []
    })
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
    const getFormatedDate = (date) => {
        const joinedDate = new Date(date)
        let yearStr = joinedDate.getFullYear().toString()
        yearStr = yearStr.substring(yearStr.length - 2)
        let dayStr = "0" + joinedDate.getDate().toString()
        dayStr = dayStr.substring(dayStr.length - 2)
        let monthStr = "0" + (joinedDate.getMonth() + 1).toString()
        monthStr = monthStr.substring(monthStr.length - 2)
        return dayStr + "/" + monthStr + "/" + yearStr
    }
    const getFormatedDateH = (dateStr) => {
        const strs = dateStr.split(" ");
        const dates = strs[0].split("-")

        return dates[2] + "/" + dates[1] + "/" + dates[0]
    }
    useEffect(
        () => {
            onClickChartBtn(MY_STATS_CHART_TYPE.GAME_PLAYED)
        },
        [],
    );
    return (
        <div className="my-stats">
        <h5 className="title-midle mb-3 poppin-bold-txt">{userName}</h5>
                <p className="mt-3 poppin-light-txt"><span className="pink-monkey-text pr-2 poppin-light-txt">Joined</span>{getJoinedFormatedDate(stats.registeredDate)}</p>
                

                <ul className="pl-4 stauts-bullet">
                    <li key={1}>
                        <div className="share_detail">
                            <button className="chart-data-get-btn" onClick={()=>onClickChartBtn(MY_STATS_CHART_TYPE.GAME_PLAYED)}>Games Played</button>
                            <div>
                                <span>{!Number.isNaN(Number(Number(stats.betAmount).toFixed(0)).toLocaleString('en-US')) ? Number(Number(stats.betAmount).toFixed(0)).toLocaleString('en-US') : "Loading.."}</span>
                            </div>
                        </div>
                    </li>
                    <li  key={2}>
                        <div className="share_detail">
                            <button className="chart-data-get-btn" onClick={()=>onClickChartBtn(MY_STATS_CHART_TYPE.TOTAL_WAGERED)}>Total Wagered</button>
                            <div>
                                <span>{!Number.isNaN(Number(Number(stats.totalWagered).toFixed(0)).toLocaleString('en-US')) ? Number(Number(stats.totalWagered).toFixed(0)).toLocaleString('en-US') : "Loading.."}</span>
                            </div>
                        </div>
                    </li>
                    <li key={3}>
                        <div className="share_detail">
                            <button className="chart-data-get-btn" onClick={()=>onClickChartBtn(MY_STATS_CHART_TYPE.NET_PROFIT)}>Net Profit</button>
                            <div>
                                <span>+ {!Number.isNaN(Number(Number(stats.netProfit).toFixed(0)).toLocaleString('en-US')) ? Number(Number(stats.netProfit).toFixed(0)).toLocaleString('en-US') : "Loading.."}</span>
                            </div>
                        </div>
                    </li>
                    {
                        nextVersion &&
                        <li key={4}>
                            <div className="share_detail">
                                <span>Profit All Time High</span>
                                <div>
                                    <span>+ {!Number.isNaN(Number(Number(stats.profitATH).toFixed(0)).toLocaleString('en-US')) ? Number(Number(stats.profitATH).toFixed(0)).toLocaleString('en-US') : "Loading.."}</span>
                                </div>
                            </div>
                        </li>
                    }
                    {
                        nextVersion &&
                        <li key={5}>
                            <div className="share_detail">
                                <span>Profit All Time Low</span>
                                <div>
                                    <span>- {!Number.isNaN(Number(Number(stats.profitATL).toFixed(0)).toLocaleString('en-US')) ? Number(Number(stats.profitATL).toFixed(0)).toLocaleString('en-US') : "Loading.."}</span>
                                </div>
                            </div>
                        </li>
                    }
                </ul>


                <p className="mt-4"><span className="pink-monkey-text pr-2">Hint:</span>Click and drag to zoom, hold shift to pan.</p>


                <div className="">
                    {
                        chartData.dataType !== '' &&
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
                    }
                    {
                        chartData.data.length > 0 &&
                        chartData.timeFrame === 'ALL' || chartData.timeFrame === 'M' ?
                            <ReactApexChart type="area"
                                height={200}
                                options={{...chartOptions, xaxis: {
                                    categories: chartData.data.map(data => data[1].substring(0,3))}
                                }} 
                                series={[
                                    {
                                        type: 'area',
                                        name: "",
                                        data: chartData.data.map(data => data[0])
                                    }
                                ]}
                            />
                        :   <ReactApexChart type="area"
                                height={200}
                                options={{...chartOptions, xaxis: {
                                    categories: chartData.data.map(data => getFormatedDate(data[1]))}
                                }} 
                                series={[
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
                    <p className="detail">Average daily bet: <span>{!Number.isNaN(Number(stats.avgDailyBet).toFixed(0)) ? Number(Number(stats.avgDailyBet).toFixed(0)).toLocaleString('en-US') : "Loading.."}</span></p>
                    <p className="detail">Average weekly bet: <span>{!Number.isNaN(Number(stats.avgWeeklyBet).toFixed(0)) ? Number(Number(stats.avgWeeklyBet).toFixed(0)).toLocaleString('en-US') : "Loading.."}</span></p>
                    <p className="detail">Average monthly bet: <span>{!Number.isNaN(Number(stats.avgMonthlyBet).toFixed(0)) ? Number(Number(stats.avgMonthlyBet).toFixed(0)).toLocaleString('en-US') : "Loading.."}</span></p>
                </div>
                </div>
    );
}
export default MyStats