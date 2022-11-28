//import Calender from './component/CheckIn/Calender';
import { Form, Button, Alert,FormControl,Col,Row,Table,InputGroup,SplitButton,Dropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {serverPath} from '../../IP_PORT';
import AutoComplete from '../component/AutoComplete/AutoComplete';
import './MngAttend.scss';
import {setStoreMember} from '../../store'
import {useDispatch, useSelector} from 'react-redux'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import moment from 'moment';

function MngAttend(props)
{
    const userData = useSelector((state)=>{return state.data});
    const member = useSelector((state)=>{return state.member});
    const [userId,setUserId] = useState(userData.uid);
    const [userName,setUserName] = useState(userData.name);
    const [userPrivilege] = useState(userData.privilege);

    let dispatch = useDispatch();

    const [fromUser, setFromUser] = useState({name:"---",uid:"----",point:"----"});
    const [modMember, setModMember] = useState([]);
    const [fromText, setFromText] = useState("");
    const [toText, setToText] = useState("");
    const [isAlert, setIsAlert] = useState(false);
    const [pointValue, setPointValue] = useState(10);
    const [history, setHistory] = useState("");
    
    const [alertText, setAlertText] = useState("");
    const [alertColor,setAlertColor] = useState("primary");
    const [isFromEnter,setIsFromEnter] = useState(false);
    const [attendData,setAttendData] = useState("");
    const [isInsert,setIsInsert] = useState(false);
    const [isUpdate,setIsUpdate] = useState(false);
    const [isDisSend,setIsDisSend] = useState(true);
    const [inDate,setInDate] = useState("");

    useEffect(()=>{
        if(modMember.length==0)
        {
            let mems = member.filter((e)=>{if(e.privilege<userPrivilege || e.uid == userId) return e});
            console.log("mems",mems);
            setModMember(mems);
        }
    })


    const readMember = ()=>
    {
        console.log('App',"멤버정보 불러오기");

        fetch(serverPath()+"/out_member",{
            method:"post",
            headers : {
            "content-type" : "application/json",
            },
            body : JSON.stringify(),
        })
        .then((res)=>res.json())
        .then((json)=>{
            dispatch(setStoreMember(json));
            setModMember([]);
        })
    }

    let setAlert= (str,sel) =>{
        let alertColor = ["danger","primary"];
        console.log("setAlert",str,alertColor[sel]);
        setAlertColor(alertColor[sel]);
        setAlertText(str);
        setIsAlert(true);
        let timer = setTimeout(() => {
            setIsAlert(false);
        }, 5000);

        return ()=>{ clearTimeout(timer) };
    }


    const onFromEnter = (idx)=>{
        if(isAlert) return;
        let mem = modMember[idx];
        setIsDisSend(true);
        if(attendData.length>0)
        {
            if(attendData[0].uid == mem.uid)
            {
                setIsDisSend(false);
                if(attendData.activity==0)
                    setIsInsert(true);
                else
                    setIsInsert(false);
            }
        }
        setFromUser(mem);
        setIsFromEnter(false);
    }

    const onFromEnterClick = ()=>{
        setIsFromEnter(true);
    }

    const onDateChasnge = (date) =>{
        console.log('onDateChange',date);
        setInDate(moment(date).format('YYYY-MM-DD'));
        setIsDisSend(true);

        let pay = {uid:fromUser.uid, date: moment(date).format('YYYY-MM-DD')};

        console.log("pay",pay);
        fetch(serverPath()+"/check_attend",{
            method:"post",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify(pay),
        })
        .then((res)=>res.json(res))
        .then((pjson)=>{
            console.log(pjson);
            if(fromUser.uid != "----")
            {
                setIsDisSend(false);
                setAttendData([{uid:fromUser.uid, activity: 0}]);
            }

            if(pjson.length>0)
            {
                setAttendData(pjson);
                setIsUpdate(true);
                if(pjson[0].activity==0)
                    setIsInsert(true);
                else 
                    setIsInsert(false);
            }
            else
            {
                setIsUpdate(false);
                setIsInsert(true);
            }
        });
    }

    const onSend = (idx)=>{
        if(isAlert) return;

        if(fromUser.uid == "----")
        {
            setAlert("From 멤버가 없습니다",0);
            return;
        }

        let his= `${userId}:${moment(new Date()).format('MM-DD/HH:mm:ss')}`
        let attend = 0;
        if(isInsert) attend=1;

        let data = {mng:userId, uid:fromUser.uid,history:his,date:inDate,attend:attend,isUpdate:isUpdate};

        fetch(serverPath()+"/in_mngattend",{
            method:"post",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify(data),
        })
        .then((res)=>res.json(res))
        .then((pjson)=>{
            try {
                if(pjson.succes=="succes") 
                {
                    setAlert("기록 완료했습니다",1);
                    setIsInsert(!isInsert);

                }
                else 
                {
                    setAlert("서버 에러",0);
                }
            }catch (e) {
                setAlert("서버에서 처리를 실패 했습니다",0);
                console.log("서버에서 처리를 실패 했습니다",e);
            }
        })

    }



    return(
        <div>
            <div className="title">
                <h3> MngAttend </h3>
            </div>  

            <Form.Group as={Row} controlId="formUser" className="mb-4">
                <Form.Label column xs={3} className="px-0">
                    from :
                </Form.Label>
                <Col xs={3} className='px-0'>
                    <AutoComplete list={modMember.map(e=>e.name)} value={fromText} setValue={setFromText} onEnter={onFromEnter} isEnter={isFromEnter} setIsEnter={setIsFromEnter} placeholder="이름.."/>
                </Col>
                <Col xs={1} className='px-0'>
                    
                </Col>
                <Col xs={3} className='px-0'>
                    <Button onClick={onFromEnterClick}>검색</Button>
                </Col>
            </Form.Group>

            <Form.Group as={Row} controlId="formUser" className="mb-2">
                <Col xs={2} />
                <Col xs={8} >
                    <Table bordered>
                        <tr>
                            <td className='px-0'>{fromUser.name}</td>
                            <td className='px-0'>{fromUser.uid}</td>
                            <td className='px-0'>{fromUser.point}p</td>
                        </tr>
                    </Table>
                </Col>
                <Col xs={2} />
            </Form.Group>

            <strong className="fs-3">▼</strong>

            <div className='Manager'>
                <Calendar onChange={onDateChasnge} />
            </div>

            

            <div className="MyPw-alert">
                {
                isAlert?(
                <Alert variant={alertColor}>
                        {alertText}
                </Alert >):null
                }
            </div>
            <div className="MyPw-button">
                <Button variant="secondary" disabled={isDisSend} onClick={onSend}>{isInsert?"추가":"제거"}</Button>
            </div>
            
        </div> 
    )
}

export default MngAttend;