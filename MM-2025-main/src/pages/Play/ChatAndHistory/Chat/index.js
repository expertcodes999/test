import { IoMdSend } from 'react-icons/io';
import { FiPaperclip } from 'react-icons/fi';
import { FaPlus } from 'react-icons/fa';
import { AiFillPlusSquare, AiFillMinusSquare } from 'react-icons/ai';
import { IoClose } from 'react-icons/io5';
import {connect} from 'react-redux'

import { useState, useEffect } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { MDBTooltip } from 'mdb-react-ui-kit';
import Picker from 'emoji-picker-react';


import {nextVersion, serverUrl} from '../../../../utils/constant'
import {request} from '../../../../utils/request';
import emoji from '../../../../assets/images/playpage/emoji.png';

import albanian from '../../../../assets/Flags/albanian.svg';
import arabic from '../../../../assets/Flags/arabic.svg';
import armenian from '../../../../assets/Flags/armenian.svg';
import bengali from '../../../../assets/Flags/bengali.svg';
import bosnian from '../../../../assets/Flags/bosnian.svg';
import bulgarian from '../../../../assets/Flags/bulgarian.svg';
import estoniaFlag from '../../../../assets/Flags/albanian.svg';
import china from '../../../../assets/Flags/china.svg';
import croatian from '../../../../assets/Flags/croatian.svg';
import czech from '../../../../assets/Flags/czech.svg';
import denmark from '../../../../assets/Flags/denmark.svg';
import dutch from '../../../../assets/Flags/dutch.svg';
import english from '../../../../assets/Flags/english.svg';
import estonia from '../../../../assets/Flags/estonia.svg';
import farsi from '../../../../assets/Flags/farsi.svg';
import filipino from '../../../../assets/Flags/filipino.svg';
import finland from '../../../../assets/Flags/finland.svg';
import french from '../../../../assets/Flags/french.svg';
import german from '../../../../assets/Flags/german.svg';
import greek from '../../../../assets/Flags/greek.svg';
import hungarian from '../../../../assets/Flags/hungarian.svg';
import india from '../../../../assets/Flags/india.svg';
import indonesia from '../../../../assets/Flags/indonesia.svg';
import israel from '../../../../assets/Flags/israel.svg';
import help from '../../../../assets/Flags/help.png';
import spam from '../../../../assets/Flags/spam.png';

import './index.scss';
import TalkCell from './TalkCell';
import InfoBox from '../../../../components/InfoBox';
import UserStatsModal from '../../../../components/UserStatsModal';
import {removeFriend} from '../../../../actions/userActions';
import {showSelectWalletModal} from '../../../../actions/gameActions';

const renderTooltip = (props) => (
    <MDBTooltip wrapperProps={{ color: 'secondary' }} {...props} placement='right' title={props.countryName}>
        {props.countryName}
    </MDBTooltip>
);
let mounted = false;
let currentTimeOut = null;
let prevMessageResult = ""
const emojiUnicode = require("emoji-unicode"), toEmoji = require("emoji-name-map");


const countries = {
    albanian: albanian,
    arabic: arabic,
    armenian: armenian,
    bengali: bengali,
    bosnian: bosnian,
    bulgarian: bulgarian,
    china: china,
    croatian: croatian,
    czech: czech,
    denmark: denmark,
    dutch: dutch,
    english: english,
    estonia: estonia,
    farsi: farsi,
    filipino: filipino,
    finland: finland,
    french: french,
    german: german,
    greek: greek,
    help: help,
    hungarian: hungarian,
    india: india,
    indonesia: indonesia,
    israel: israel,
    help: help,
    spam: spam
}
const chatTestData = [
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    },
    {
        time: "2022-08-28 21:16:32",
        username: "Luis1",
        messageText: "Nice to meet you csdafad adsfs arfatfa fg arf"
    }
]

const testChat = "2022-08-18 14:12:34 | MM1223 | @ampledrucker congrats on the 1000x<///***br***///>2022-08-22 20:00:20 | Ampeldruecker | gfhn<///***br***///>2022-08-24 12:42:50 | MM1223 | hey !<///***br***///>2022-08-25 08:38:42 | Ampeldruecker | gh<///***br***///>2022-08-25 08:38:44 | Ampeldruecker | vcbcvb<///***br***///>2022-08-25 08:38:50 | Ampeldruecker | weae<///***br***///>2022-08-25 08:38:59 | Ampeldruecker | nbmbnm<///***br***///>2022-08-25 19:27:19 | Ampeldruecker | hi<///***br***///>2022-08-26 07:04:03 | Ampeldruecker | @Ampeldruecker hi<///***br***///>2022-08-26 07:04:24 | Ampeldruecker | @Ampeldruecker how you doing?<///***br***///>2022-08-28 21:16:32 | Ampeldruecker | asd<///***br***///>2022-08-30 21:45:43 | MM1223 | Can\'t wait to play the next round !<///***br***///>2022-08-30 21:46:03 | MM1223 | Let\'s goooo<///***br***///>2022-08-30 21:48:49 | MM1223 | \'\'<///***br***///>2022-08-31 04:24:54 | MYC | @mm1223<///***br***///>2022-08-31 09:05:41 | MM1223 | Let\'s go !<///***br***///>2022-08-31 09:05:50 | MM1223 | This time is MY time !<///***br***///>2022-08-31 09:06:13 | MM1223 | Cant wait to make a Twitch Livestream<///***br***///>2022-08-31 09:06:36 | Ampeldruecker | ^^<///***br***///>2022-08-31 09:11:01 | MM1223 | See we already have a community !<///***br***///>2022-08-31 09:15:47 | Ampeldruecker | true<///***br***///>2022-08-31 09:39:34 | Ampeldruecker |  U\\1f63c <///***br***///>2022-08-31 14:13:05 | MM1223 | yey<///***br***///>2022-08-31 14:13:27 | MM1223 | @myc <///***br***///>2022-08-31 14:24:10 | MYC | cool seems like @mm1223 works<///***br***///>2022-09-02 13:46:09 | Ampeldruecker |  U\\1f600  U\\1f929  U\\1f643  U\\1f642 <///***br***///>2022-09-02 14:05:12 | MYC |  U\\1f600  U\\1f603  U\\1f604 <///***br***///>2022-09-03 07:27:04 | MM1223 | whatsuuuupp@myc<///***br***///>2022-09-03 07:27:25 | MM1223 | whatsup @MYC<///***br***///>2022-09-04 14:17:03 | MYC | all good, nearly there @MM1223<///***br***///>2022-09-06 10:30:23 | MM1223 | Hey !<///***br***///>2022-09-06 10:30:28 | MM1223 | so cool<///***br***///>2022-09-06 10:30:34 | MM1223 | cheers<///***br***///>2022-09-07 08:45:13 | Ampeldruecker | hi<///***br***///>2022-09-15 17:04:47 | MM1223 | hey<///***br***///>2022-09-19 15:22:42 | MYC | Hello Everyone<///***br***///>2022-09-19 15:22:58 | MYC | Hello Everyone<///***br***///>2022-09-21 01:18:42 | poto | sdfwefewfe<///***br***///>2022-09-21 01:18:53 | poto | xvwefdsfxswef<///***br***///>2022-09-21 01:19:00 | poto | hello<///***br***///>2022-09-21 01:19:08 | poto | nice to meet zou<///***br***///>2022-09-21 01:19:21 | poto | what is this_<///***br***///>2022-09-21 01:19:36 | poto | hello<///***br***///>2022-09-21 01:19:46 | poto | i cantä sure<///***br***///>2022-09-21 01:20:04 | poto | who are zou_<///***br***///>2022-09-21 01:33:08 | poto | 1<///***br***///>2022-09-21 01:34:13 | poto | 3<///***br***///>2022-09-21 01:35:59 | poto | whz does it work like this_<///***br***///>2022-09-21 01:39:22 | poto | 1212<///***br***///>2022-09-21 01:42:06 | poto |  U\\1f933  U\\1f4aa <///***br***///>";
const testStr = ['2022-05-22 20:43:47 | ServerTest | Whats up?', '2022-05-22 20:43:47 | ServerTest | afasd', '2022-05-23 17:34:15 | ServerTest | Hi', '2022-05-23 18:24:18 | test2 | Hi', '2022-05-23 18:24:24 | test2 | afdasfasf', '2022-05-23 20:34:28 | test2 | ', '2022-05-23 20:45:11 | test2 | ', '2022-05-26 11:38:56 | Ampeldruecker | afdasfasf', '2022-05-26 11:51:21 | Ampeldruecker | sd', '2022-05-26 11:51:21 | Ampeldruecker | sd', '']

const Chat = (props) => {
    const { userName, logged, maxCredits, showSelectWalletModal, friends, removeFriend } = props;
    const [messages, setMessages] = useState([]);
    const [loadingMessage, setLoadingMessage] = useState(false)
    const [selectedCountries, setSelectedCountries] = useState(["english"]);
    const [selectedCounty, setSelectedCountry] = useState("english");
    const [selectedChanel, setSelectedChanel] = useState({
        country: "english",
        friend: ""
    });
    const [meMessage, setMessage] = useState("");
    const [displayFlagContent, setDisplayFlagContent] = useState(false);
    const [displayCountryChanel, setDisplayCountryChannel] = useState(true);
    const [displayFriendChanel, setDisplayFriendChannel] = useState(true);
    const [statsModalData, setShowStatsModal] = useState({
        display: false,
        userName: ""
    });

    
    const initData = async () => {
        console.log("initData")
        prevMessageResult = ""
        if(selectedCountries.length === 0) {
            if(Object.keys(countries).length > 0) {
                await setSelectedCountries([Object.keys(countries)[0]])
            }
        }
        if(selectedCounty === null && selectedCountries.length > 0) {
            setSelectedCountry(selectedCountries[0])
        }
    }
    useEffect(() => {
        mounted = true
        initData();
        chatTestData.reverse()
        return () => {mounted = false}
        // clearing interval
    },[]);
    useEffect(() => {
        continueGetMessage()
        // clearing interval
    },[selectedChanel]);
    useEffect(() => {
        if(friends.length > 0) {
            setSelectedChanel({
                country: "",
                friend: friends[0]
            })
        }
        else {
            if(selectedCountries.length > 0) {
                setSelectedChanel({
                    country: selectedCountries[0],
                    friend: ""
                })
            }
            else {
                setSelectedChanel({
                    country: "",
                    friend: ""
                })
            }
        }
    },[friends]);
    const changeSelectedCountry = (country) => {
        console.log("changeSelectedCountry")
        if(selectedCounty !== country) {
            if(selectedCountries.includes(country)) {
                setSelectedCountry(country)
            }
        }
    }
    const selectFriend = (friendName) => {
        setSelectedChanel({
            country: "",
            friend: friendName
        })
    }
    const selectCountry = (country) => {
        setSelectedChanel({
            country: country,
            friend: ""
        })
    }
    const addCountry = (country) => {
        if(!selectedCountries.includes(country)) {
            setSelectedCountries([...selectedCountries, country]);
            selectCountry(country)
        }
        setDisplayFlagContent(false);
    }
    const removeSelectedCounntry = () => {
        
        if(selectedChanel.country !== "") {
            const selectedIndex = selectedCountries.indexOf(selectedChanel.country);
            let _selectedCountries = [...selectedCountries];
            _selectedCountries.splice(selectedIndex, 1)
            setSelectedCountries(_selectedCountries);
            if(_selectedCountries.length > 0) {
                setSelectedChanel({
                    country: _selectedCountries[0],
                    friend: ""
                })
            }
            else {
                if(friends.length > 0) {
                    setSelectedChanel({
                        country: "",
                        friend: friends[0]
                    })
                }
                else {
                    setSelectedChanel({
                        country: "",
                        friend: ""
                    })
                }
            }
        }
    }
    const removeSelectedFriend = () => {
        removeFriend(selectedChanel.friend)
    }
    
    const getMesssage = async () => {
        if(loadingMessage) return
        let res = {}
        setLoadingMessage(true)
        if(selectedChanel.friend !== "") {
            res = await request('get', `${serverUrl}chat/getMessagesOnetime.php?room=userToUser*__*${userName}*__*${selectedChanel.friend}`);

        }
        else if(selectedChanel.country !== "") {
            res = await request('get', `${serverUrl}chat/getMessagesOnetime.php?room=${selectedChanel.country}`);
        }
        setLoadingMessage(false)
        if(prevMessageResult !== res.result) {
            setMessages(res.result.split('<///***br***///>').reverse());
        }
    }
    const continueGetMessage = () => {
        if(!mounted) return
        if(currentTimeOut) {
            clearTimeout(currentTimeOut)
        }
        getMesssage()

        currentTimeOut = setTimeout(() => {
            continueGetMessage()
          }, 2000);
    }
    
    const sendMessage = async () => {
        let myMsg = "";
        
        for (let character of meMessage) {

            let unicode = emojiUnicode(character);
            if(unicode.length > 4){
                // This is a emoji
                myMsg = myMsg + " U\\\\"+unicode.toString() + " ";
            }else{
                // This is a normal character
                myMsg = myMsg + character;
            }

          }

        setMessage("")
        var today = new Date()
        var timeStr = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' +
            today.getHours() + ':' + today.getMinutes() + ':' + today.getSeconds();
        setMessages([`${timeStr} | ${userName} | ${myMsg}`, ...messages]);
        if(selectedChanel.friend !== "") {
            
            await request('get', `${serverUrl}chat/sendMessage.php?message=${myMsg}&room=userToUser*__*${userName}*__*${selectedChanel.friend}`);
        }
        else if(selectedChanel.country !== "") {
            await request('get', `${serverUrl}chat/sendMessage.php?message=${myMsg}&room=${selectedChanel.country}`);
        }
    }
    const clickCountryImg = (country) => {
        if(!selectedCountries.includes(country)) {
            setSelectedCountries([...selectedCountries, country]);
            setSelectedCountry(country)
        }
        setDisplayFlagContent(false);
    }

    
    const [displayEmojiPicker, setDisplayEmojiPicker] = useState(false);
  
    const onEmojiClick = (event, emojiObject) => {
      console.log(emojiObject);

      setMessage(meMessage + emojiObject['emoji']);

    };
    const clickNotLoggedInMask = () => {
        showSelectWalletModal()
    }
    return (
        <div className="chat">
            <div className="chat-talks-channel">
                <div className="chat-talks">
                    <div className="current-language">
                        {selectedChanel.friend !== "" ?
                            `${selectedChanel.friend}`
                            :
                            `${selectedChanel.country === "" ? "No language" : selectedChanel.country}`
                        }
                        {
                            selectedChanel.country !== "" &&
                            <div className="leave-btn" onClick={()=>removeSelectedCounntry()}>
                                <div className="close-symbol"><IoClose/></div>
                                Leave
                            </div>
                        }
                        {
                            selectedChanel.friend !== "" &&
                            <div className="leave-btn" onClick={()=>removeSelectedFriend()}>
                                <div className="close-symbol"><IoClose/></div>
                                
                                Unfriend
                            </div>
                        }
                    </div>
                    <div className="talks">
                        {
                            // messages.length > 0 &&
                            // messages.map((message) => {
                            //     let messageParts = message.split(' | ');
                            //     if(messageParts.length < 3) return <></>    
                            //         let time = messageParts[0];
                            //         let username = messageParts[1];
                            //         let messageText = messageParts[2];
                                    
                                    
                            //         let isIncludingUserName = messageText.toLowerCase().includes(userName.toLowerCase()) && logged
                                    
                            //         if(messageParts.length>2) {
                            //             return (
                            //                 <TalkCell includingUserName={isIncludingUserName} clickUserName={setShowStatsModal} t_time={time} t_name={username} t_content={messageText}/>
                            //             )
                            //         }
                            //     }
                            // )
                            chatTestData.length > 0 &&
                            chatTestData.map((chat, index) => {
                                let isIncludingUserName = "hi".toLowerCase().includes("userName".toLowerCase())
                                    return (
                                        <TalkCell includingUserName={isIncludingUserName} clickUserName={setShowStatsModal} t_time={chat.time} t_name={chat.username} t_content={chat.messageText}/>
                                    )
                                }
                            )
                        }
                    </div>
                </div>
                <div className="channel">
                    
                    <div className="friends">

                        <div className="display-btn" onClick={()=>setDisplayFriendChannel(!displayFriendChanel)}>
                            {
                                displayFriendChanel ? <span><AiFillMinusSquare/></span> : <span><AiFillPlusSquare/></span>
                            }
                            Friends
                        </div>
                        <div className="friends-list">
                            {
                                displayFriendChanel &&
                                friends.length > 0 &&
                                friends.map(friend => 
                                    <MDBTooltip placement="left" title={friend} tag="span">
                                        <div className={`friend ${selectedChanel.friend === friend ? "selected-friend" : ""}`}>
                                            <div className="friend-background"></div>
                                            <p className="friend-name"  onClick={()=>setSelectedChanel({country: "", friend: friend})}>{friend.substring(0,2)}</p>
                                        </div> 
                                    
                                    </MDBTooltip>
                                )
                            }
                        </div>
                    </div>
                    <div className="countries">
                        
                        <div className="display-btn" onClick={()=>setDisplayCountryChannel(!displayCountryChanel)}>
                            {
                                displayCountryChanel ? <span><AiFillMinusSquare/></span> : <span><AiFillPlusSquare/></span>
                            }
                            Countries
                        </div>
                        <div className="countries-list">
                            {
                                displayCountryChanel &&
                                selectedCountries.length > 0 &&
                                selectedCountries.map(country => 
                                    <MDBTooltip placement="left" title={country} tag="span">
                                        <div className={`country ${selectedChanel.country === country ? "selected-country" : ""}`}>
                                        <img src={countries[country]} onClick={()=>setSelectedChanel({friend: "", country: country})}></img>
                                        </div> 
                                    
                                    </MDBTooltip>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            
            
            
            <div className="send-message">
                <div className="full-relative">
                    <InfoBox outSideClickFunc={setDisplayEmojiPicker}>
                        <img src={emoji} onClick={()=>setDisplayEmojiPicker(!displayEmojiPicker)} className="emoji-btn"></img>
                        {
                            displayEmojiPicker &&
                            <div className="emoji-content">
                                <Picker onEmojiClick={onEmojiClick}/>
                            </div>
                        }
                    </InfoBox>
    
                    

                    {/*<FiPaperclip className="paper-clip"/>*/}
                    
                    <input onKeyPress={(e) => {
                            if (e.key === "Enter") {
                                sendMessage()
                            }
                        }} value={meMessage}
                        onChange={(e) => setMessage(e.target.value)} className="message-write-content" 
                        placeholder={logged?(maxCredits>0?"Type something here...": "You need to deposit some Credits before you are allowed to chat")
                                            :"You must be logged in to chat"}></input>
                    <div className="send-button" onClick={()=>sendMessage()}>
                        <IoMdSend/>
                    </div>
                    <InfoBox className='relative flag-content' outSideClickFunc={setDisplayFlagContent}>
                        <FaPlus className="plus-button" onClick={() => setDisplayFlagContent(!displayFlagContent)}/>
                        <div className={`absolute flag-drop-box ${!displayFlagContent ? 'hidden' : 'show'}`}>
                            {
                                Object.keys(countries).length > 0 &&
                                Object.keys(countries).map(country => 
                                    <MDBTooltip placement="left" title={country} tag="span">
                                        <img src={countries[country]} onClick={()=>addCountry(country)}></img>
                                    
                                    </MDBTooltip>
                                )
                            }
                        </div>
                    </InfoBox>
                    {
                        (!logged || maxCredits<=0) &&
                        <div onClick={logged? ()=>{}: clickNotLoggedInMask} className="input-mask"></div>
                    }
                    
                </div>
            </div>
            <UserStatsModal show={statsModalData.display} userName={statsModalData.userName} onHide={() => setShowStatsModal({...statsModalData, display: false})} />
        </div>
    );
}

const mapStateToProps  = (state) => (
    { 
        userName: state.userData.userName,
        logged: state.userData.logged,
        friends: state.userData.friends,
        
        maxCredits: state.betData.maxCredits
    }
)
export default connect(mapStateToProps, {removeFriend, showSelectWalletModal})(Chat)