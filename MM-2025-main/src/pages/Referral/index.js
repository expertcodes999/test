import React, { useEffect, useState } from "react";
import {connect} from 'react-redux'
import TabsBottomRainBow from "../../components/TabsBottomRainBow";
import LogoFooterComponent from '../../components/LogoFooterComponent';
import Overview from './Overview';
import MyBalance from './MyBalance';
import Campaigns from './Campaigns';
import Referrals from './Referrals';
import UnsignedPage from './UnsignedPage';


import './index.scss';

const Referral = (props) => {
    const { signed } = props;
    useEffect(
        () => {
            
        },
        [],
    );
    let tabDataList = [
        {
            title: "Overview",
            component: <Overview/>,
            clickFunc: ()=>{}
        },
        {
            title: "My Balance",
            component: <MyBalance/>,
            clickFunc: ()=>{}
        },
        // {
        //     title: "Campaigns",
        //     component: <Campaigns/>,
        //     clickFunc: ()=>{}
        // },
        {
            title: "Referrals",
            component: <Referrals/>,
            clickFunc: ()=>{}
        }
    ];
    return (

        <div className="referral-page monkey-page">
            <div className="page-main-content">
            {
                !signed
                ?   <>
                        <div className="gradient-font page-title">REFERRAL</div>
                        <UnsignedPage/>
                    </>
                :   <>
                        <div className="gradient-font page-title">REFERRAL</div>
                        <TabsBottomRainBow tabDataList={tabDataList}/>
                        
                    </>
            }
            </div>
            <LogoFooterComponent />
        </div>
    );
}

const mapStateToProps  = (state) => (
    {
        signed: state.userData.signed
    }
)

export default connect(mapStateToProps, {})(Referral)