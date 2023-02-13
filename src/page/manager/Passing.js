//import Calender from './component/CheckIn/Calender';
import { Form, Button, Alert,FormControl,Col,Row,Table,InputGroup,SplitButton,Dropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {serverPath} from '../../IP_PORT';
import AutoComplete from '../component/AutoComplete/AutoComplete';
import './Passing.scss';
import {setStoreMember} from '../../store'
import {useDispatch, useSelector} from 'react-redux'


function Passing(props)
{
    const userData = useSelector((state)=>{return state.data});
    const member = useSelector((state)=>{return state.member});
    const [userId,setUserId] = useState(userData.uid);
    const [userName,setUserName] = useState(userData.name);
    const [userPrivilege] = useState(userData.privilege);

    let dispatch = useDispatch();

    const [fromUser, setFromUser] = useState({name:"---",uid:"----",point:"----"});
    const [toUser, setToUser] = useState({name:"---",uid:"----",point:"----"});
    const [modMember, setModMember] = useState([]);
    const [fromText, setFromText] = useState("");
    const [toText, setToText] = useState("");
    const [isAlert, setIsAlert] = useState(false);
    const [pointValue, setPointValue] = useState(10);
    const [history, setHistory] = useState("");
    
    const [alertText, setAlertText] = useState("");
    const [alertColor,setAlertColor] = useState("primary");
    const [isFromEnter,setIsFromEnter] = useState(false);
    const [isToEnter,setIsToEnter] = useState(false);

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
        setFromUser(mem);
        setIsFromEnter(false);
    }

    const onFromEnterClick = ()=>{
        setIsFromEnter(true);
    }

    const onToEnter = (idx)=>{
        if(isAlert) return;
        let mem = modMember[idx];
        setToUser(mem);
        setIsToEnter(false);
    }

    const onToEnterClick = ()=>{
        setIsToEnter(true);
    }

    const onSend = (idx)=>{
        if(isAlert) return;

        if(fromUser.uid == "----")
        {
            setAlert("From 멤버가 없습니다",0);
            return;
        }
        if(fromUser.point<pointValue)
        {
            setAlert("From 멤버의 포인트가 부족합니다.",0);
        }
        if(toUser.uid == "----")
        {
            setAlert("To 멤버가 없습니다",0);
            return;
        }     
        if(toUser.uid == fromUser.uid)
        {
            setAlert("From 과 To 멤버가 같습니다.",0);
            return;
        }     
        let pay = {uid:fromUser.uid , pay:pointValue};
        let data = {fromuid:fromUser.uid,touid:toUser.uid,point:pointValue,history:history,uid:userId};

        fetch(serverPath()+"/check_point",{
            method:"post",
            headers : {
                "content-type" : "application/json",
            },
            body : JSON.stringify(pay),
        })
        .then((res)=>res.json(res))
        .then((pjson)=>{
            try {
                if(pjson.succes=="succes") 
                {
                    fetch(serverPath()+"/to_point", {
                        method : "post", // 통신방법
                        headers : {
                          "content-type" : "application/json",
                        },
                        body : JSON.stringify(data),
                    })
                    .then((res)=>res.json())
                    .then((json)=>{
                        console.log('buy_avatar', json);
                        try {
                            if(json.succes=="setPoint") 
                            {
                                setFromUser({name:"---",uid:"----",point:"----"});
                                setToUser({name:"---",uid:"----",point:"----"});
                                setAlert("전달 완료했습니다",1);
                            }
                            else 
                            {
                                setAlert("서버 에러",0);
                            }
                        }catch (e) {
                            setAlert("서버에서 처리를 실패 했습니다",0);
                        }
                    });
                }
                else 
                {
                    if(pjson.err=="lack") 
                        setAlert("포인트가 부족합니다",0);
                    else
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
                <h3> Passing </h3>
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
            <InputGroup className='MngPoint-input-deposit'>
                <SplitButton
                variant="outline-secondary"
                title="History :"
                id="segmented-button-dropdown-1"
                >
                    <Dropdown.Item onClick={()=>{setHistory("고삼차"); setPointValue(10)}}>고삼차 (10)</Dropdown.Item>
                </SplitButton>
                <FormControl value={history} onChange={(e)=>{setHistory(e.target.value)}}/>
            </InputGroup>
            {/* <Form.Control className="mb-1" value={history} placeholder="History.." onChange={(e)=>{setHistory(e.target.value)}} /> */}
            <div className="mb-3">
                <strong className="fs-3">{pointValue}p</strong>
                <Form.Range step={1} min={1} max={100} value={pointValue} onChange={(e)=>{setPointValue(e.target.value)}}/>
                <strong className="fs-3">▼</strong>
            </div>

            <Form.Group as={Row} controlId="formUser" className="mb-2">
                <Col xs={2} />
                <Col xs={8} >
                    <Table bordered >
                        <tr>
                            <td className='px-0'>{toUser.name}</td>
                            <td className='px-0'>{toUser.uid}</td>
                            <td className='px-0'>{toUser.point}p</td>
                        </tr>
                    </Table>
                </Col>
                <Col xs={2} />
            </Form.Group>

            <Form.Group as={Row} controlId="formUser" className="mb-4">
                <Form.Label column xs={3} className="px-0">
                    to :
                </Form.Label>
                <Col xs={3} className='px-0'>
                    <AutoComplete list={modMember.map(e=>e.name)} value={toText} setValue={setToText} onEnter={onToEnter} isEnter={isToEnter} setIsEnter={setIsToEnter} placeholder="이름.."/>
                </Col>
                <Col xs={1} className='px-0'>
                    
                </Col>
                <Col xs={3} className='px-0'>
                    <Button onClick={onToEnterClick}>검색</Button>
                </Col>
            </Form.Group>

            <div className="MyPw-alert">
                {
                isAlert?(
                <Alert variant={alertColor}>
                        {alertText}
                </Alert >):null
                }
            </div>
            <div className="MyPw-button">
                <Button variant="secondary" onClick={onSend}>전송</Button>
            </div>
            
        </div> 
    )
}

export default Passing;