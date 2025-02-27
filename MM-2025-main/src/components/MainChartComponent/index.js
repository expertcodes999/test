import ChartComponent from "./ChartComponent";
import CurrentValueDisplayer from "./CurrentValueDisplayer";
import {connect} from 'react-redux'
import { bnbMultiByBits } from '../../utils/constant'

const MainChartComponent = (props) => {
    const {maxProfit} = props
    return (
        <div className="chart">
            <ChartComponent/>
            <CurrentValueDisplayer/>
            <div className="max-profit">
                Max profit: {Number(maxProfit*0.01/bnbMultiByBits).toFixed(4)} BNB
            </div>
        </div>
    );
}

const mapStateToProps  = (state) => (
    {
        maxProfit: state.betGameData.maxProfit
    }
)

export default connect(mapStateToProps, {})(MainChartComponent)