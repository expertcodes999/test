import { useState, useEffect, useRef } from 'react';
import TakCoinImg from '../../../assets/images/TAK Token.png';
import './index.scss';

const NFTStakingComponent = (props) => {
    const { nftName, nftImgSrc, stakeAction, staked, index, data } = props;

    return (
        <div className="staking-nft-portrait">
            <img
                
                src={TakCoinImg}
                className="staking-nft-portrait-image-back"
                alt={nftName}
            />
            <img
                
                src={data.image}
                className="staking-nft-portrait-image"
                alt={nftName}
            />
            {
                !staked &&
                <div className="staking-nft-portrait-btn"
                    onClick={() => stakeAction(nftName)}>
                    <div className="staking-nft-portrait-title">
                        {nftName}
                    </div>
                    <div className="staking-nft-portrait-btn-title">STAKE</div>
                </div>
            }
        </div>
    );
}

export default NFTStakingComponent;