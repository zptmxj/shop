//import Calender from './component/CheckIn/Calender';
import { Form, Button, Alert} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {serverPath} from '../../IP_PORT';
import './MngGoodMorning.scss';
import {setStoreMember} from '../../store'
import {useDispatch, useSelector} from 'react-redux'
import * as PRIVI  from '../../PRIVILEGE';
import NamePlate from '../component/NamePlate/NamePlate';


function MngGoodMorning(props)
{
    const userData = useSelector((state)=>{return state.data});
    const member = useSelector((state)=>{return state.member});
    const [userId,setUserId] = useState(userData.uid);
    const [userName,setUserName] = useState(userData.name);
    const [userPrivilege] = useState(userData.privilege);

    const [morningMember, setMorningMember] = useState([]);
    const [goodMember, setGoodMember] = useState([]);
    const [isAlert, setIsAlert] = useState(false);

    const [readyIdx, setReadyIdx] = useState(-1);
    const [alertText, setAlertText] = useState("");
    const [alertColor,setAlertColor] = useState(["primary","info"]);
    const [isMorning,setIsMorning] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(()=>{
        let timer = setInterval(()=>{
            setRefresh(false);
        },500);
        return () => clearInterval(timer);
    },[refresh]);

    useEffect(()=>{
        if(!refresh)
        {
            let toDay = new Date();
            if(toDay.getHours()>=6 && toDay.getHours()<=9)
                setIsMorning(true);

            setRefresh(true);
            fetch(serverPath()+"/out_goodmorning",{
                method:"post",
                headers : {
                "content-type" : "application/json",
                },
                body : JSON.stringify(),
            })
            .then((res)=>res.json())
            .then((json)=>{
                json= json.map((e,i)=>{return e.targetuid});
                setGoodMember(json);

                console.log("GoodM",json);
                let mems = member.filter((e)=>{if(e.activity==1 && e.view != 0) return e});
                console.log("mems",mems);
                setMorningMember(mems);
            })
        }
    })

    let setAlert= (str,sel) =>{
        let alertColor = ["danger","primary"];
        console.log("setAlert",str,alertColor[sel]);
        setAlertColor(alertColor[sel]);
        setAlertText(str);
        setIsAlert(true);
        let timer = setTimeout(() => {
            setIsAlert(false);
        }, 5000);

        return ()=>{ clearTimeout(timer); setRefresh(false); };
    }

    const onSend = (idx)=>{
        if(isAlert) return;
        if(readyIdx != idx) 
        {
            setReadyIdx(idx); 
            return;
        }

        let data = {uid:userId,name:morningMember[idx].name,targetuid:morningMember[idx].uid};

        fetch(serverPath()+"/in_goodmorning", {
            method : "post", // 통신방법
            headers : {
              "content-type" : "application/json",
            },
            body : JSON.stringify(data),
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log("fetch",json);
            try {
                if(json.succes) 
                {
                    setRefresh(false);
                    setReadyIdx(-1);
                }
                else 
                    setAlert("서버에서 처리를 실패 했습니다",0);
            }catch (e) {
                setAlert("서버에서 처리를 실패 했습니다",0);
            }
        });

    }



    return(
        <div>
            <div className="title">
                <h3> Good Morning </h3>
            </div>  
            
            <div className="Attend-middle mb-5">
                    <table className='Attend-table'>
                        <thead>
                            <tr>
                                <th className='MngGoodMorning-th-15'></th>
                                <th className='MngGoodMorning-th-40'>멤버</th>
                                <th className='MngGoodMorning-th-40'>체크</th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            morningMember.map((e,i)=>{
                                return(
                                    <tr className='Attend-tr'>
                                        <td className='MngGoodMorning-td'>
                                            <p className='m-0'>{i}</p>
                                        </td>
                                        <td className='MngGoodMorning-td flex'>
                                            <div className='p-2 '>
                                                <NamePlate mem={e} size={30}/>
                                            </div>
                                        </td>
                                        <td className='MngGoodMorning-td'>
                                            <div className='p-2'>
                                                {
                                                    (goodMember.indexOf(e.uid)==-1 && userId != e.uid && isMorning)?
                                                        <Button variant={readyIdx==i?alertColor[1]:alertColor[0]} onClick={()=>{onSend(i)}}>Morning</Button>:
                                                    <p className='m-0'> {userId == e.uid?"is Me":isMorning?"Good":"Close"} </p>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })
                        }
                        </tbody>
                    </table>
                </div>
            
        </div> 
    )
}

export default MngGoodMorning;