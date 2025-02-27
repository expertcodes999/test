
import { Tabs, Tab } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive'
import ContainerComponent from "../../../components/ContainerComponent";
import ManualBet from './ManualBet.js';
import AutoBet from './AutoBet.js';
import './index.scss';

const BetTypeContainer = (props) => {
 
  const isMobile = useMediaQuery({ query: '(max-width: 800px)' })
    return (
      <ContainerComponent className="height-100-p">
        <div className="w-80 m-auto flex flex-col bet-type">
            {
              !isMobile ?
                <Tabs defaultActiveKey="manual" className="manual-auto-toggle">
                  <Tab eventKey="manual" title="Manual" className="select-button">
                    <ManualBet/>
                  </Tab>   
                  <Tab eventKey="auto" title="Auto" className="select-button">
                    <AutoBet isMobile={false}/>
                  </Tab>
                    
                </Tabs>  
              : <ManualBet/>
            }
        </div>
      </ContainerComponent>
    );
}

export default BetTypeContainer;