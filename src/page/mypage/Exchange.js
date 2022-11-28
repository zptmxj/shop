//import Calender from './component/CheckIn/Calender';
import { Form, Button, Alert,ListGroup,FormControl} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {serverPath} from '../../IP_PORT';
import AutoComplete from '../component/AutoComplete/AutoComplete';
import './Exchange.scss';
import {setStoreMember} from '../../store'
import {useDispatch, useSelector} from 'react-redux'


function Exchange(props)
{
    const userData = useSelector((state)=>{return state.data});
    const member = useSelector((state)=>{return state.member});
    const [userId,setUserId] = useState(userData.uid);
    const [userName,setUserName] = useState(userData.name);
    const [userPrivilege] = useState(userData.privilege);

    let dispatch = useDispatch();

    const [modMember, setModMember] = useState([]);
    const [isAlert, setIsAlert] = useState(false);
    const [pointV, setPointV] = useState(0);
    const [bonusV, setBonusV] = useState(0);
    const [value, setValue] = useState(0);
    
    const [alertText, setAlertText] = useState("");
    const [alertColor,setAlertColor] = useState("primary");
    const [mypoint, setMypoint] = useState(0);
    const [myBonus, setMyBonus] = useState(0);
    const [ready, setReady] = useState(true);

    useEffect(()=>{

        fetch(serverPath()+"/out_asset",{
            method:"post",
            headers : {
            "content-type" : "application/json",
            },
            body : JSON.stringify({uid:userId}),
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log('MyAsset',json.point);
            setMypoint(json[0].point);
            setMyBonus(json[0].bonus);
        });

    })

    let setAlert= (str,sel) =>{
        setReady(true);
        let alertColor = ["danger","primary"];
        console.log("setAlert",str,alertColor[sel]);
        setAlertColor(alertColor[sel]);
        setAlertText(str);
        setIsAlert(true);
        let timer = setTimeout(() => {
            setIsAlert(false);
        }, 3000);

        return ()=>{ clearTimeout(timer) };
    }


    const onSend = (e)=>{
        e.preventDefault();
        if(isAlert  || !ready) return;

        if(value == 0)
        {
            setAlert("변경사항이 없습니다",0);
            return;
        }

        let data = {point:pointV,bonus:bonusV,uid:userId};


        if(value<0)
        {
            setReady(false);
            let pointD = {uid:userId , pay:pointV};
            fetch(serverPath()+"/check_point",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(pointD),
            })
            .then((res)=>res.json(res))
            .then((pjson)=>{
                try {
                    if(pjson.succes=="succes") 
                    {
                        fetch(serverPath()+"/exc_ptob", {
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
                                if(json.succes=="succes") 
                                {
                                    setAlert("Point to Bonus 완료했습니다",1);
                                    setValue(0);
                                    setPointV(0);
                                    setBonusV(0);
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
        else
        {
            setReady(false);
            let bonusD = {uid:userId , pay:bonusV};
            fetch(serverPath()+"/check_bonus",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(bonusD),
            })
            .then((res)=>res.json(res))
            .then((pjson)=>{
                try {
                    if(pjson.succes=="succes") 
                    {
                        fetch(serverPath()+"/exc_btop", {
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
                                if(json.succes=="succes") 
                                {
                                    setAlert("Bonus to Point 완료했습니다",1);
                                    setValue(0);
                                    setPointV(0);
                                    setBonusV(0);
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
                            setAlert("Bonus가 부족합니다",0);
                        else
                            setAlert("서버 에러",0);
                    }
                }catch (e) {
                    setAlert("서버에서 처리를 실패 했습니다",0);
                    console.log("서버에서 처리를 실패 했습니다",e);
                }
            })
        }
        

        

    }

    const onChange = (e)=>{
        setValue(e.target.value);
        let v = Math.abs(e.target.value);
        let b = v * 1000;
        setPointV(v);
        setBonusV(b);
    }


    return(
        <div>
            <div className="title mb-3">
                <h3> Exchange </h3>
            </div>  
            <div className="MyPoint-top pb-3">
                <ListGroup>
                    <ListGroup.Item>
                        MyPoint :
                    </ListGroup.Item>
                </ListGroup>
                <ListGroup>
                    <ListGroup.Item>
                        {mypoint + " Point"}
                    </ListGroup.Item>
                </ListGroup>
            </div>
            
            <strong className="fs-3">{value>0?pointV:-pointV}P</strong>
            <div className="my-3">
                <p><strong className="fs-3">▲</strong></p>
                <Form.Range className="mb-3 Exchange-Range" step={1} min={-20} max={20} value={value} onChange={onChange}/>
                <Form>
                <div className="Sort-c">

                    <FormControl className="w-50" controlId="AutoComp" type="number" value={value} onChange={onChange}/>
                    <Button className="mx-2" variant="primary" type="submit" onClick={onSend}>전송</Button>
                </div>
                </Form>
                <p><strong className="fs-3">▼</strong></p>
            </div>
            <strong className="fs-3">{value>0?-bonusV:bonusV}B</strong>

            <div className="MyBonus-top pt-3">
                    <ListGroup>
                        <ListGroup.Item>
                            MyBonus :
                        </ListGroup.Item>
                    </ListGroup>
                    <ListGroup>
                        <ListGroup.Item>
                            {myBonus + " Bonus"}
                        </ListGroup.Item>
                    </ListGroup>
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
            </div>
            
        </div> 
    )
}

export default Exchange;