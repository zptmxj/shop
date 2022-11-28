//import Calender from './component/CheckIn/Calender';
import { Form, Button, Alert,ListGroup,FormControl} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {serverPath} from '../../IP_PORT';
import AutoComplete from '../component/AutoComplete/AutoComplete';
import './EvScoreDv.scss';
import {setStoreMember} from '../../store'
import {useDispatch, useSelector} from 'react-redux'


function EvScoreDv(props)
{
    const userData = useSelector((state)=>{return state.data});
    const member = useSelector((state)=>{return state.member});
    const [userId,setUserId] = useState(userData.uid);
    const [userName,setUserName] = useState(userData.name);
    const [userPrivilege] = useState(userData.privilege);

    let dispatch = useDispatch();

    const [modMember, setModMember] = useState([]);
    const [isAlert, setIsAlert] = useState(false);
    const [value, setValue] = useState(0);
    
    const [alertText, setAlertText] = useState("");
    const [alertColor,setAlertColor] = useState("primary");
    const [pointAll, setPointAll] = useState(0);
    const [point1, setPoint1] = useState(0);
    const [point2, setPoint2] = useState(0);
    const [ready, setReady] = useState(true);
    const [refresh, setRefresh] = useState(true);

    useEffect(()=>{
        setRefresh(false);
        fetch(serverPath()+"/out_evscoredv",{
            method:"post",
            headers : {
            "content-type" : "application/json",
            },
            body : JSON.stringify({uid:userId}),
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log('MyAsset',json);
            setPoint1(json[1].t_point);
            setPoint2(json[2].t_point);
        });

        fetch(serverPath()+"/all_evscoredv",{
            method:"post",
            headers : {
            "content-type" : "application/json",
            },
            body : JSON.stringify({uid:userId}),
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log('setPointAll',json);
            setPointAll(json[0].point);
        });
    },[refresh])

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


    const onSend = (e,thr)=>{
        e.preventDefault();

        if(isAlert  || !ready) return;

        console.log("onSend",thr);

        if(value == 0)
        {
            setAlert("변경사항이 없습니다",0);
            return;
        }

        let data = {point:value,team:thr};

        if(value>0)
        {
            setReady(false);

            fetch(serverPath()+"/to_evscoredv",{
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
                        setAlert("set Point 완료했습니다",1);
                        setValue(0);
                        setRefresh(true);
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

    }

    const onChange = (e)=>{
        setValue(e.target.value);
    }


    return(
        <div>
            <div className="title mb-3">
                <h3> EvScoreDv </h3>
            </div>  
            
            <strong className="fs-3">{value}P</strong>
            <div className="my-3">
                <p><strong className="fs-3">▲</strong></p>
                <Form.Range className="mb-3 EvScoreDv-Range" step={1} min={0} max={20} value={value} onChange={onChange}/>
                <Form>
                <div className="Sort-c">

                    <Button className="mx-2" variant="danger" type="submit" onClick={(e)=>onSend(e,1)}>1팀에 전송</Button>
                    <FormControl className="w-25" controlId="AutoComp" type="number" value={value} onChange={onChange}/>
                    <Button className="mx-2" variant="primary" type="submit" onClick={(e)=>onSend(e,2)}>2팀에 전송</Button>
                </div>
                </Form>
                <p><strong className="fs-3">▼</strong></p>
            </div>

            <div className="EvScoreDv-alert">
                {
                isAlert?(
                <Alert variant={alertColor}>
                        {alertText}
                </Alert >):null
                }
            </div>

            <div className="MyBonus-top mt-8">
                <ListGroup>
                    <ListGroup.Item >
                        Total From 1T :
                    </ListGroup.Item>
                </ListGroup>
                <ListGroup>
                    <ListGroup.Item>
                        {point1 + " P"}
                    </ListGroup.Item>
                </ListGroup>
            </div>
            <div className="MyBonus-top py-3">
                <ListGroup>
                    <ListGroup.Item>
                        Total From 2T :
                    </ListGroup.Item>
                </ListGroup>
                <ListGroup>
                    <ListGroup.Item>
                        {point2 + " P"}
                    </ListGroup.Item>
                </ListGroup>
            </div>
            <div className="MyBonus-top py-3">
                <ListGroup>
                    <ListGroup.Item>
                        Unassigned :
                    </ListGroup.Item>
                </ListGroup>
                <ListGroup>
                    <ListGroup.Item>
                        {pointAll + " P"}
                    </ListGroup.Item>
                </ListGroup>
            </div>

        </div> 
    )
}

export default EvScoreDv;