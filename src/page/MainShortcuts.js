import './MainShortcuts.scss';
import { Toast,NavLink} from 'react-bootstrap';
import {serverPath,imagePath,vcoinPath} from '../IP_PORT';
import { Link, Route } from 'react-router-dom';
import React,{useState,useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux'
import setting from './setting.png';
import up_mg from './component/Member/up.png';
import down_mg from './component/Member/down.png';

function MainShortcuts(props)
{
    const [shortcutImgs] = useState([[{idx:1,path:imagePath()+"/shortcut/shortcut01.png"},
                                        {idx:2,path:imagePath()+"/shortcut/shortcut02.png"},
                                        {idx:3,path:imagePath()+"/shortcut/shortcut03.png"},
                                        {idx:4,path:imagePath()+"/shortcut/shortcut04.png"},
                                        {idx:5,path:imagePath()+"/shortcut/shortcut05.png"}]]);

    const [favordata, setFavordata] = useState([]);
    const [isFavor, setIsFavor] = useState(false);
    const member = useSelector((state)=>{return state.member});

    useEffect(()=>{
        if(!isFavor && member.length>0)
        {
            fetch(serverPath()+"/out_newfavor",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(),
            })
            .then((res)=>res.json())
            .then((all)=>{
                setFavordata(all);
                setIsFavor(true);
                console.log("Toast",all);
            });
        }

    })

    function timeForToday(value) {
        const today = new Date();
        const timeValue = new Date(value);

        const betweenTime = Math.floor((today.getTime() - timeValue.getTime()) / 1000 / 60);
        if (betweenTime < 1) return '방금전';
        if (betweenTime < 60) {
            return `${betweenTime}분전`;
        }

        const betweenTimeHour = Math.floor(betweenTime / 60);
        if (betweenTimeHour < 24) {
            return `${betweenTimeHour}시간전`;
        }

        const betweenTimeDay = Math.floor(betweenTime / 60 / 24);
        if (betweenTimeDay < 365) {
            return `${betweenTimeDay}일전`;
        }

        return `${Math.floor(betweenTimeDay / 365)}년전`;
    }
    // const shortcutUrl = (idx)=>{


    // }
    return(
        <div className="Main-Shortcuts">
            <div className="Main-Shortcuts-Top w-100 ">
                {/* <img className="Main-Shortcuts-Setting my-1 mx-3" onClick={()=>{}} src={setting} /> */}
            </div>
            <div className="Main-Shortcuts-Midle mt-4">
                <NavLink as={Link} to="/Attend" className="p-2"><img className="Main-Shortcuts-img p-1" src={shortcutImgs[0][0].path} /></NavLink>
                <NavLink as={Link} to="/VCoin" className="p-2"><img className="Main-Shortcuts-img p-1" src={shortcutImgs[0][1].path} /></NavLink>
                <NavLink as={Link} to="/VCoinMine" className="p-2"><img className="Main-Shortcuts-img p-1 " src={shortcutImgs[0][2].path} /></NavLink>
                <NavLink as={Link} to="/LeavesLottery" className="p-2"><img className="Main-Shortcuts-img p-1" src={shortcutImgs[0][3].path} /></NavLink>
                <NavLink as={Link} to="/MonkeyLottery" className="p-2"><img className="Main-Shortcuts-img p-1" src={shortcutImgs[0][4].path} /></NavLink>
            </div>
            <div className="Main-Favor-Midle">
                <div className="Main-Favor-Boder">
                        {
                            favordata.map((e,i)=>{
                                let classN = "Main-Shortcuts-Toast my-3";
                                let icon = up_mg;
                                
                                let mem = member.filter((m)=>{
                                    if(e.uid == m.uid)
                                        return m;
                                })

                                let target = member.filter((t)=>{
                                    if(e.targetuid == t.uid)
                                        return t;
                                })
                                console.log("test mem",mem);
                                console.log("test e",e);
                                console.log("test target",target);

                                let userAvatar = imagePath()+ "/avatars/" + mem[0].path;
                                let targetAvatar = imagePath()+ "/avatars/" + target[0].path;
                                if(e.favor<0)
                                {
                                    classN = "Main-Shortcuts-Toast my-3";
                                    icon = down_mg;
                                }
                                return(
                                    <div className={classN} key={i}>                
                                        <Toast  className="">
                                            <Toast.Header closeButton={false} className="Main-Favor-Header">
                                                    <div className="Main-Favor-Member">
                                                        <img src={userAvatar} width='20px' height='20px' className="rounded me-1" alt="" />
                                                        <strong >{e.name}</strong>
                                                        <strong >{`▶`}</strong>
                                                        <img src={targetAvatar} width='20px' height='20px' className="rounded me-1" alt="" />
                                                        <strong >{target[0].name}</strong>
                                                    </div>
                                                    <div className="">
                                                        <img src={icon} width='20px' height='20px'/>
                                                        <strong className="me-2">{e.favor}</strong>
                                                        <small>{timeForToday(e.date)}</small>
                                                    </div>
                                            </Toast.Header>
                                            <Toast.Body>{e.text}</Toast.Body>
                                        </Toast>
                                    </div>
                                )
                            })
                        }
                </div>
            </div>
        </div>
    )
}

export default MainShortcuts;