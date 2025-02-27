import './index.scss';
import { useMediaQuery } from 'react-responsive'
import { useState, useEffect } from 'react';
import { AiFillStar } from 'react-icons/ai';
import {connect} from 'react-redux'

import {showLoginModal} from '../../../../actions/gameActions'

const TalkCell = (props) => {
    const { t_time, t_name, t_content, clickUserName, includingUserName, friends, logged, showLoginModal } = props;
    const [mobileDate, setMobileDate] = useState("")
    const [emj_t_content, setEmjTContent] = useState("")
    const isDesktop = useMediaQuery({ query: '(min-width: 1200px)' })
    useEffect(() => {
        const chatDate = new Date(t_time)
        let hourStr = "00" + chatDate.getHours().toString()
        hourStr = hourStr.substring(hourStr.length - 2)
        let minuteStr = "00" + chatDate.getMinutes().toString()
        minuteStr = minuteStr.substring(minuteStr.length - 2)
        setMobileDate(hourStr + ":" + minuteStr)
    },[t_time]);
    useEffect(() => {
        let newT_content = "";
        t_content.split(" ").forEach(function(v){

            if(v.includes("U\\")){
                // This is a special unicode character -> Convert it
                newT_content = newT_content + String.fromCodePoint(parseInt (v.replace("U\\\\", ""), 16));
            }else{
                // This is just a normal character
                newT_content = newT_content + " " + v;
            }

        });
        setEmjTContent(newT_content)
    },[t_content]);
    const onClickUnserName = () => {
        if(logged) {
            clickUserName({display: true, userName: t_name})
        }
        else {
            showLoginModal()
        }
        
    }

    return (
        <div className="talk-cell">
            <div className="time">{mobileDate}</div>
            <div className="person-name" onClick={onClickUnserName}>
                {
                    friends.includes(t_name) &&
                    <AiFillStar/>
                }
                {t_name + ":"}</div>
            <div className={`talk-content ${includingUserName? "include-username": ""}`}>{emj_t_content.replace(/\\'/g, "'")}</div>
        </div>
    );
}

const mapStateToProps  = (state) => (
    {
        friends: state.userData.friends,
        logged: state.userData.logged
    }
)
export default connect(mapStateToProps, {showLoginModal})(TalkCell)