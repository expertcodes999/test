import { Dropdown } from "react-bootstrap";
import ReactApexChart from "react-apexcharts";
import React, { useEffect, useState } from "react";
import Tabs from "react-bootstrap/Tabs";
import Tab from "react-bootstrap/Tab";
import Pagination from 'react-responsive-pagination';
import {connect} from 'react-redux'

import Web3 from "web3";
import { useWeb3React } from "@web3-react/core";
import { Hearts } from "react-loader-spinner";
import Select from 'react-select';
import { CONTRACTS, CONTRACTS_TYPE } from "../../utils/constants";
import { injected, rinkebyInjectedConnector } from "../../components/wallet/connectors";
import MooningPagination from "../../components/MooningPagination";
import ConfirmClaimModal from "../../components/ConfirmClaimModal";

import { rinkebyChainData } from '../../constants/chain';
import {changeUseChainData, getTakUsdValue} from '../../actions/userActions'
import LogoFooterComponent from "../../components/LogoFooterComponent";
import TimerComponent from "../../components/TimerComponent";

import { showHisotyModal } from '../../actions/gameActions'
import USDImg from "../../assets/images/usd.png";
import MonkeyImg from "../../assets/images/quesitonMark.png";
import NFTStakingComponent from "./NFTStakingComponent";

import "./index.scss";
import { connectWallet, changeNetwork } from '../../utils/interact';
import {nextVersion} from '../../utils/constant'
const { MerkleTree } = require("merkletreejs");
const keccak256 = require("keccak256");
const { L1MonkeyData } = require("./evolution1_merkle_data");
const { ethers } = require("ethers");


// const keccak256 = require('keccak256');

let web3;
let leaves;
let trees;
let roots;

const AirdropsChartTimeFrame = [
  'D',
  'W',
  'M',
  'Y'
];

const ProfitChartTimeFrame = [
  'W',
  'M',
  'Y'
];

const TotalProfitChartTimeFrame = [
  'H',
  'D',
  'W',
  'M',
  'ALL'
];

const CHART_TYPE = {
  TOTAL_PROFIT: 'Total Profit',
  PROFIT_SHARE: 'Profit Share',
  DAILY_AIRDROPS: 'Daily Airdrops'
};
const PRICE_TYPE = {
  USDT: 'USDT',
  BNB: 'BNB'
};
const testChartData = [['234', '22-07-27']]
const displayMonkeyAssets = (assets) => {
  if(assets.length < 5) {
    for(let i = 0; i < 5 - assets.length; i ++) {
      assets.push({
        image: MonkeyImg
      })
    }
  }
  console.log("~~~~~~~~~~~", assets)
  return (
    <div>
      {
        assets.map(monkey => {
          <img src={monkey.image}></img>
        })
      }
    </div>
  )
}
const MonkeyEarning = (props) => {
  const {showHisotyModal, currentChainId, useChainData, changeUseChainData} = props;
  const [displayCount, setDisplayCount] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPageCopunt] = useState(10);

  const [walletNFTDisplayCapacity, setWalletNFTDisplayCapacity] = useState(25);
  const [walletNFTCurrentPage, setWalletNFTCurrentPage] = useState(1);
  const [myNFTData, setMyNFTData] = useState([]);
  const [walletNFTDisplayData, setWalletNFTDisplayData] = useState([]);

  const [myStakedNFTDisplayCapacity, setMyStakedNFTDisplayCapacity] = useState(25);
  const [myStakedNFTCurrentPage, setMyStakedNFTCurrentPage] = useState(1);
  const [myStakedNFTDisplayData, setMyStakedNFTDisplayData] = useState([]);
  const [myStakedNFTData, setMyStakedNFTData] = useState([])//[{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {} , {}, {}, {}, {}]);
  
  const [chartType, setChartType] = useState(CHART_TYPE.DAILY_AIRDROPS)
  const [chartPriceType, setChartPriceType] = useState(PRICE_TYPE.USDT)
  const [chartTimes, setChartTimes] = useState([])
  const [chartTimeFrame, setChartTimeFrame] = useState("")
  const [chartData, setChartData] = useState([])
  const [loadingNFTData, setLoadingNFTData] = useState(false)
  const [mooningMonkeysOnWallet, setMooningMonkysOnWallet] = useState([])
  const [galaticGorillasOnWallet, setGalaticGorillasOnWallet] = useState([])
  const [alienGorillasOnWallet, setAlienGorillasOnWallet] = useState([])
  const [eternalYetisOnWallet, setEternalYetisOnWallet] = useState([])
  const [displayConfirmClaimModal, setDisplayConfirmClaimModal] = useState(false)
  
const onClickChartTypeBtn = async (_chartType) => {
  setChartType(_chartType)
}
const onClickChartPriceTypeBtn = async (_chartPriceType) => {
  setChartPriceType(_chartPriceType)
}
useEffect(
  () => {
      switch(chartType) {
        case CHART_TYPE.DAILY_AIRDROPS:
          setChartTimes(AirdropsChartTimeFrame)
        break;
        case CHART_TYPE.PROFIT_SHARE:
          setChartTimes(ProfitChartTimeFrame)
        break;
        case CHART_TYPE.TOTAL_PROFIT:
          setChartTimes(TotalProfitChartTimeFrame)
        break;
        
      }
  },
  [chartType],
);
useEffect(
  () => {
    if(chartTimes.length > 0) {
      setChartTimeFrame(chartTimes[0])
    }
  },
  [chartTimes],
);
useEffect(
  async () => {
    const _chartData = await getTakUsdValue(chartTimeFrame)
    setChartData(_chartData)
  },
  [chartTimeFrame],
);
const onClickTimeFrameBtn = async (timeFrame) => {
  setChartTimeFrame(timeFrame)
}
  /////// pagination action
  const changeDisplayCount = (e) => {
    setDisplayCount(e);
  }
  const tableRecodCountOptions = [
    { value: 25, label: '25 Records' },
    { value: 50, label: '50 Records' },
    { value: 75, label: '75 Records' },
    { value: 100, label: '100 Records' }
  ];
  const recordTableStyle = {
    option: (provided, state) => ({
        ...provided,
        color: 'black',
        zIndex: '1'
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
  ///////////////////////////////
  function encodeLeaf(tokenId, rarity) {
    const encoded = ethers.utils.solidityKeccak256(
      ["uint256", "uint256"],
      [tokenId, rarity]
    );
    return encoded;
  }

  const initTrees = () => {
    leaves = [L1MonkeyData.map((x) => encodeLeaf(x.tokenId, x.rarity))];
    trees = leaves.map(
      (evoLeafs) =>
        new MerkleTree(evoLeafs, keccak256, {
          sortPairs: true,
        })
    );

    roots = trees.map((tree) => tree.getHexRoot().toString());
    console.log("Roots: ", roots);

  }
  
  async function getProof(evolution, monkey) {
    return trees[evolution].getHexProof(
      encodeLeaf(monkey.tokenId, monkey.rarity)
    );
  }

  ///////////////////////////////
  const chartOptions = {
    chart: {
      type: "area",
      id: "basic-bar",
      zoom: {
        enabled: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      horizontalAlign: "left",
    },
    xaxis: {
      type: "datetime",
      categories: [
        133333330000000, 133333331000000, 133333332000000, 133333333000000,
        133333334000000, 133333335000000, 133333336000000, 133333337000000,
      ],
    },
    yaxis: {
      show: false,
    },
    stroke: {
      curve: "straight",
    },
    tooltip: {
      enabled: true,
    },
    theme: {
      mode: "dark",
    },
    colors: ["#F001F4"],
  };

  const chartSeries = [
    {
      name: "series-1",
      data: [30, 40, 15, 20, 49, 60, 70, 31],
    },
  ];

  const { active, account, library, chainId, connector, activate, deactivate } =
    useWeb3React();
  let metadata0 = CONTRACTS[CONTRACTS_TYPE.TAKTOKEN][4]?.abi;
  let addr0 = CONTRACTS[CONTRACTS_TYPE.TAKTOKEN][4]?.address;

  let metadata1 = CONTRACTS[CONTRACTS_TYPE.NFTMINT][4]?.abi;
  let addr1 = CONTRACTS[CONTRACTS_TYPE.NFTMINT][4]?.address;

  let metadata2 = CONTRACTS[CONTRACTS_TYPE.NFTSTAKING][4]?.abi;
  let addr2 = CONTRACTS[CONTRACTS_TYPE.NFTSTAKING][4]?.address;

  const [approveAmount, setAmountValue] = useState(0);
  const [claimAmount, setClaimAmount] = useState(0);
  const [amountStake, setAmountStake] = useState(0);
  const [lockduration, setLockDuration] = useState(0);
  const [loading, setLoading] = useState(false);
  const [myBalance, setMyBalance] = useState(0);
  
  const [tokenIdList, setTokenIdList] = useState([]);
  const [allApprove, setAllApprove] = useState(false);

  const [unstakedcount, setUnstakedcount] = useState(0);
  const [stakedcount, setStakedcount] = useState(0);

  let base_uri =
    "https://ipfs.io/ipfs/QmT7a4eC1VnwPLK7wzF8jFZU5jDpuPi9KqQ8Kq386tpere/";

  useEffect(() => {
    initTrees()
    changeUseChainData(rinkebyChainData)
  }, [])

  const handleChangeNetwork = async () => {
    const walletResponse = await changeNetwork(useChainData);
}
  const levelUpNFT = async () => {
    
  }
  
  useEffect(
    () => {
        setTotalPageCopunt(parseInt((myStakedNFTData.length-1) / displayCount + 1))
    },
    [myStakedNFTData, displayCount],
  );
  useEffect(
    () => {
      setMooningMonkysOnWallet(getAssetMonkeys(myNFTData, "Mooning Monkey"))
      setGalaticGorillasOnWallet(getAssetMonkeys(myNFTData, "Galactic Gorilla"))
      setAlienGorillasOnWallet(getAssetMonkeys(myNFTData, "Alien Gorilla"))
      setEternalYetisOnWallet(getAssetMonkeys(myNFTData, "Eternal Yeti"))
    },
    [myNFTData],
  );
  useEffect(() => {
    (async () => {
      if(library && account) {
        getUserNFTs(library, account)
      }
      
    })();
  }, [chainId, currentChainId, library, account]);

  const getUserNFTs = async (library, walletAddress) => {
    setUnstakedcount(0);
    setMyNFTData([]);
    setStakedcount(0);
      setMyStakedNFTData([]);
    setLoadingNFTData(true)
    web3 = new Web3(library.provider);
    let NFT_Mint_Contract = new web3.eth.Contract(metadata1, addr1);
        
          
    let NFT_Staking_Contract = new web3.eth.Contract(metadata2, addr2);
    try {
      const approve_result = await NFT_Mint_Contract.methods
        .isApprovedForAll(account, addr2)
        .call();
      console.log(approve_result);
      setAllApprove(approve_result);
      if (!approve_result) {
        const setAppr = await NFT_Mint_Contract.methods
          .setApprovalForAll(addr2, true)
          .send({ from: account });
        console.log("SUCCESS Approved !!!");
      }

      let temp_array = [];
      let allow_result = await NFT_Staking_Contract.methods
        .getNFTsByOwner(walletAddress, 0)
        .call(); //0x16836190dd89aa4aea5f036e3270cb09f8e84790
      console.log("Funcking...........................", allow_result);

      for (let i = 0; i < allow_result.length; i++) {
        let temp_url = base_uri + allow_result[i] + ".json";
        let temp_json = await fetch(temp_url);
        temp_json = await temp_json.json();
        temp_array.push(temp_json);
      }
      setUnstakedcount(allow_result.length);
      setMyNFTData(temp_array);

      
      console.log("setMyNFTData", temp_array)
      temp_array = [];
      allow_result = await NFT_Staking_Contract.methods
        .getStakedMonkeysByUser(walletAddress)
        .call();
      console.log("Funcking+++++++++++++++++++++++++++", allow_result);
      for (let i = 0; i < allow_result.length; i++) {
        let temp_url = base_uri + allow_result[i].tokenId + ".json";

        let temp_json = await fetch(temp_url);
        temp_json = await temp_json.json();
        temp_array.push(temp_json);
      }
      setStakedcount(allow_result.length);
      setMyStakedNFTData(temp_array);
    }
    catch (err) {
      console.log(err);
    }
    setLoadingNFTData(false)
  }
  const getAssetMonkeys = (monkeys, name) => {
    let filteredMonkeys = monkeys.filter(monkey => monkey.title === name)
    while(filteredMonkeys.length < 5) {
      filteredMonkeys.push({
        image: MonkeyImg
      })
    }
    return filteredMonkeys
  }
  function connect() {
    setLoading(true);
    activate(rinkebyInjectedConnector, async (error) => {
      console.log(error);
    });
    setLoading(false);
  }
  const stakeAll = () => {
    let tokenNames = myNFTData.map(data => data.name)
    stakeAction(tokenNames)
  }
  const stakeAction = async (tokenNames) => {
    // alert(Math.floor(Date.now()/1000));
    if (account && chainId && library) {
      setLoading(true);
      web3 = new Web3(library.provider);
      let NFT_Staking_Contract = new web3.eth.Contract(metadata2, addr2);

      let NFT_Mint_Contract = new web3.eth.Contract(metadata1, addr1);
      let new_pm = []
      for(let i = 0; i < tokenNames.length; i ++) {
        let tokenId = Number(tokenNames[i].slice(1, tokenNames[i].length));
        const { rarity } = L1MonkeyData.find((x) => x.tokenId === tokenId);
        let proof = await getProof(0, { tokenId: tokenId, rarity: rarity });
        new_pm.push({
          tokenId: tokenId,
          C: rarity,
          proof: proof,
          evolution: 0,
          timeStaked: Math.floor(Date.now() / 1000),
        })
      }

      try {
        // const approve_result = await NFT_Mint_Contract.methods.approve(addr2, tokenId).send({from: account});
        const gas = await NFT_Staking_Contract.methods
          .stake(new_pm)
          .estimateGas({ from: account });
        console.log("gas ", gas);
        let result = await NFT_Staking_Contract.methods
          .stake(new_pm)
          .send({ from: account });
        console.log(result);
        console.log("done! Congratrations!");
        getUserNFTs(library, account)
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    }
  };

  const unStakeAll = async () => {
    if (account && chainId && library) {
      setLoading(true);
      web3 = new Web3(library.provider);
      let NFT_Staking_Contract = new web3.eth.Contract(metadata2, addr2);
      try {
        let result = await NFT_Staking_Contract.methods
          .unstake()
          .send({ from: account });
        console.log(result);
        console.log("unstake done! Congratrations!");
        getUserNFTs(library, account)
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    }
  };

  const claim = async () => {
    if (account && chainId && library) {
      setLoading(true);
      web3 = new Web3(library.provider);
      let NFT_Staking_Contract = new web3.eth.Contract(metadata2, addr2);
      try {
        let result = await NFT_Staking_Contract.methods
          .claim()
          .send({ from: account });
        console.log(result);
        console.log("claim done! Congratrations!");
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    }
  };
  const clickClaimBtn = () => {
    setDisplayConfirmClaimModal(true);
  }
  const makeTenDatas = (data) => {
    let _data = []
    for(let i = 0; i < 10; i ++) {
      _data = _data.concat(data)
    }
    setWalletNFTDisplayData(_data)
  }
  if (loading) {
    return (
      <div className="staking-container">
        <div style={{ margin: "15% 40%" }}>
          <Hearts color="#F001F4" height={280} width={280} />
        </div>
      </div>
    );
  } else
    return (
      <div className="earning-container monkey-page">
        <div className="gradient-font page-title">
          MY MONKEY EARNINGS
        </div>
        {
          currentChainId !== useChainData.chainId &&
          <p className="change-network-alert">You are still on BSC Chain (Crash Game Blockchain) Please  switch to ETH chain for Staking</p>
        }
        <div className="sub-container staking-container">
          <div className="staking-container-top">
            <div className="gradient-font container-title">
              NFT STAKING OVERVIEW
            </div>

            <div className="staking-container-top-btns">
            {
                currentChainId !== useChainData.chainId &&
                <div className="button-group">
                    <div className="gradient-btn wallet-btn button" onClick={handleChangeNetwork}>Change Network</div>
                </div>
            }
              {currentChainId === useChainData.chainId && !account && (
                <div className="button-group">
                  <div className="gradient-btn wallet-btn button" onClick={connect}>
                    Connect Wallet
                  </div>
                </div>
              )}
            </div>
          </div>
          {unstakedcount > 0 &&
            <div className="staking-container-top">
              <div className="staking-container-header">
                <MooningPagination tableRecodCountOptions={tableRecodCountOptions} selectStyle={recordTableStyle} displayCount={walletNFTDisplayCapacity}
                  changeDisplayCount={setWalletNFTDisplayCapacity} currentPage={walletNFTCurrentPage} changeCurrentPage={setWalletNFTCurrentPage}
                  allData={myNFTData} displayData={walletNFTDisplayData} changeDisplayData={setWalletNFTDisplayData}></MooningPagination>

                  <div className="gradient-btn" onClick={()=>stakeAll()}>
                    STAKE ALL
                  </div>

              </div>
              <div className="nft_container">
                {walletNFTDisplayData.map((data, index) => (
                  <NFTStakingComponent nftName={data.name} data={data} staked={false}
                    index={index} nftImgSrc={data.image} stakeAction={()=>stakeAction([data.name])}/>
                ))}
              </div>
            </div>
          }
          {stakedcount > 0 && (
            <div className="staking-container-top">
              <div className="staking-container-header">
                <MooningPagination tableRecodCountOptions={tableRecodCountOptions} selectStyle={recordTableStyle} displayCount={myStakedNFTDisplayCapacity}
                  changeDisplayCount={setMyStakedNFTDisplayCapacity} currentPage={myStakedNFTCurrentPage} changeCurrentPage={setMyStakedNFTCurrentPage}
                  allData={myStakedNFTData} displayData={myStakedNFTDisplayData} changeDisplayData={setMyStakedNFTDisplayData}></MooningPagination>
                
                  <div className="gradient-btn" onClick={unStakeAll}>
                    UNSTAKE ALL
                  </div>
                
              </div>
              <div className="nft_container">
                {myStakedNFTDisplayData.map((data, index) => (
                  <NFTStakingComponent nftName={data.name} data={data} staked={true}
                    index={index} dnftImgSrc={data.image}/>
                ))}
              </div>
            </div>
          )}
          {
            loadingNFTData &&
            <div className="no-nft-alert">
              Loading...
            </div>
          }
          {!loadingNFTData && stakedcount === 0 && unstakedcount === 0 &&
            <div className="no-nft-alert">
              No NFTs found
            </div>
          }
          <div className="staking-container-bottom">
            {/* <div className='staking-container-bottom-item'>
                        <div className='pink-font'>AVG PAYOUT</div>
                        <div className=''>209</div>
                    </div>
                    <div className='staking-container-bottom-item'>
                        <div className='pink-font'>AVG PAYOUT</div>
                        <div className=''>871</div>
                    </div> */}
            <div className="staking-container-bottom-item">
              <div className="pink-font">UNSTAKED</div>
              <div className="">{unstakedcount}</div>
            </div>
            <div className="staking-container-bottom-item">
              <div className="pink-font">STAKED</div>
              <div className="">{stakedcount}</div>
            </div>
          </div>
        </div>
        <div className="sub-container assets-container">
          <div className="assets-container-top">
            <div className="gradient-font assets-container-title container-title">
              MY ASSETS
            </div>
            <div className="level-up-nft">
            <a target="_blank" href="https://mooningmonkey.com/nft-evolution/" className="level-up-nft-btn">                  
              EVOLVE NOW
            </a>
          </div>
          </div>
          
          <div className="assets-container-body">
            <div className="assets-container-body-part">
              <div className="assets-container-body-part-item">
                <div className="left">
                  <div className="pink-font assets-item-title">Mooning Monkey (Level 1)</div>
                  <div className="right assets-nfts">
                    {mooningMonkeysOnWallet.map(monkey => (
                      <img src={monkey.image}></img>  
                    ))}
                  </div>
                </div>
                
              </div>
              <div className="assets-container-body-part-item">
                <div className="left">
                  <div className="pink-font assets-item-title">Galactic Gorilla (Level 2)</div>
                  <div className="right assets-nfts">
                    {galaticGorillasOnWallet.map(monkey => (
                      <img src={monkey.image}></img>  
                    ))}
                  </div>
                </div>
                <div className="right"></div>
              </div>
            </div>
            <div className="assets-container-body-part">
              <div className="assets-container-body-part-item">
                <div className="left">
                  <div className="pink-font assets-item-title">Alien Gorilla  (Level 3)</div>
                  <div className="right assets-nfts">
                    {alienGorillasOnWallet.map(monkey => (
                      <img src={monkey.image}></img>  
                    ))}
                  </div>
                </div>
                <div className="right"></div>
              </div>
              <div className="assets-container-body-part-item">
                <div className="left">
                  <div className="pink-font assets-item-title">Eternal Yeti (Level 4)</div>
                  <div className="right assets-nfts">
                    {eternalYetisOnWallet.map(monkey => (
                      <img src={monkey.image}></img>  
                    ))}
                  </div>
                </div>
                <div className="right"></div>
              </div>
            </div>
          </div>
          
          <div className="pink-font">
            You can stake or unstake at anytime but daily claims and platform profit sharing will occur only 24h and 1 week respectively after your initial staking.
          </div>
        </div>

        <div className="sub-container airdrop-container">
          <div className="airdrop-container-top">
            <div className="gradient-font container-title">
              MY DAILY CLAIMABLE TAK AIRDROP
            </div>

            <div className="">
              NEXT CLAIMABLE TAK: <TimerComponent />
            </div>
          </div>
          <div className="airdrop-container-middle">
            <div className="airdrop-container-middle-left">
              <div className="">
                <span className="pink-font claim-able-tak">Available TAK to claim:</span> X TAK
              </div>
              <div className="">Corresponding $USDT value: $247</div>
            </div>
            <div className="gradient-btn" onClick={clickClaimBtn}>CLAIM</div>
          </div>
          <div className="airdrop-container-status">
            <div className="item">
              <div className="title">Today</div>
              <div className="value">
                <img src={USDImg} alt="usd_image" />
                <div className="">$447</div>
              </div>
            </div>
            <div className="item">
              <div className="title">This week</div>
              <div className="value">
                <img src={USDImg} alt="usd_image" />
                <div className="">$447</div>
              </div>
            </div>
            <div className="item">
              <div className="title">This month</div>
              <div className="value">
                <img src={USDImg} alt="usd_image" />
                <div className="">$447</div>
              </div>
            </div>
            <div className="item">
              <div className="title">This year</div>
              <div className="value">
                <img src={USDImg} alt="usd_image" />
                <div className="">$447</div>
              </div>
            </div>
            <div className="item">
              <div className="title">Lifetime</div>
              <div className="value">
                <img src={USDImg} alt="usd_image" />
                <div className="">$447</div>
              </div>
            </div>
          </div>
          <div className="airdrop-container-bottom">
            <div className="pink-font">
            In order to be able to claim your daily rewards, you’ll need to stake your NFTs.
            </div>
            <div className="white-btn" onClick={()=>showHisotyModal()}>View History</div>
          </div>
        </div>
        <div className="sub-container airdrop-container">
          <div className="airdrop-container-top">
            <div className="gradient-font container-title">
              WEEKLY GAME PROFIT SHARING
            </div>
            <div className="">
              NEXT CLAIMABLE TAK: <TimerComponent />
            </div>
          </div>
          <div className="airdrop-container-middle">
            <div className="airdrop-container-middle-left">
              <div className="">
                <span className="pink-font claim-able-tak">Available TAK to claim:</span> X TAK
              </div>
              <div className="">Corresponding $USDT value: $247</div>
            </div>
            <div className="gradient-btn" onClick={clickClaimBtn}>CLAIM</div>
          </div>
          <div className="airdrop-container-status">
            
            <div className="item">
              <div className="title">This week</div>
              <div className="value">
                <img src={USDImg} alt="usd_image" />
                <div className="">$447</div>
              </div>
            </div>
            <div className="item">
              <div className="title">This month</div>
              <div className="value">
                <img src={USDImg} alt="usd_image" />
                <div className="">$447</div>
              </div>
            </div>
            <div className="item">
              <div className="title">This year</div>
              <div className="value">
                <img src={USDImg} alt="usd_image" />
                <div className="">$447</div>
              </div>
            </div>
            <div className=""></div>
          </div>
          <div className="airdrop-container-bottom">
            <div className="pink-font">
            In order to be able to claim your weekly platform sharing profits, you’ll need to stake your NFTs.
            </div>
            <div className="white-btn" onClick={()=>showHisotyModal()}>View History</div>
          </div>
        </div>
        <div className="sub-container chart-container">
          <div className="staking-container-top">
            <div className="gradient-font container-title">
              PROFIT HISTORY
            </div>
          </div>
          <div className="chart-type-time">
            <div className="chart-data-type">
              {
                Object.values(CHART_TYPE).map(title => {
                  return (
                    <div className={`chart-data-type-item ${chartType === title ? "selected-chart" : ""}`} onClick={()=>onClickChartTypeBtn(title)}>{title}</div>
                  )
                })
              }
            </div>
            <div className="chart-data-type">
              {
                Object.values(PRICE_TYPE).map(title => {
                  return (
                    <div className={`chart-data-type-item ${chartPriceType === title ? "selected-chart" : ""}`} onClick={()=>onClickChartPriceTypeBtn(title)}>{title}</div>
                  )
                })
              }
            </div>
            
            <div className="chart-time">
              {
                  chartTimes.map(time => 
                  <button className={`time-type ${chartTimeFrame === time ? 'selected-time' : ''}`}
                      onClick={()=>onClickTimeFrameBtn(time)}>{time}</button>
                )
              }
            </div>
          </div>
          <ReactApexChart
                type="area"
                options={{...chartOptions, xaxis: {categories: chartData.map(data => {
                    const date = new Date('20' + data[1])
                    console.log("~~~date", date, data)
                    const options = { month: 'long'};
                    const month = new Intl.DateTimeFormat('en-US', options).format(date)
                    return date.getDay() + "." + month + "." + date.getFullYear()})
                  }}
                } 
                series={[
                    {
                        type: 'area',
                        name: "",
                        data: chartData.map(data => data[0])
                    }
                ]}
                
                height={300}
              />
        </div>
        <LogoFooterComponent />
        <ConfirmClaimModal show={displayConfirmClaimModal} onHide={()=>setDisplayConfirmClaimModal(false)} clickFunction={claim} />
      </div>
    );
};

const mapStateToProps  = (state) => (
  {
    currentChainId: state.userData.currentChainId,
    useChainData: state.userData.useChainData,
  }
)

export default connect(mapStateToProps, {showHisotyModal, changeUseChainData})(MonkeyEarning)