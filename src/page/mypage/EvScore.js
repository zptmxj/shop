//import Calender from './component/CheckIn/Calender';
import { Form, Button, Alert,ListGroup,FormControl} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {serverPath} from '../../IP_PORT';
import AutoComplete from '../component/AutoComplete/AutoComplete';
import './EvScore.scss';
import {setStoreMember} from '../../store'
import {useDispatch, useSelector} from 'react-redux'


function EvScore(props)
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
    const [point, setPoint] = useState(0);
    const [iPoint, setIPoint] = useState(0);
    const [tPoint, setTPoint] = useState(0);
    const [ready, setReady] = useState(true);
    const [refresh, setRefresh] = useState(true);

    useEffect(()=>{
        setRefresh(false);
        fetch(serverPath()+"/out_evscore",{
            method:"post",
            headers : {
            "content-type" : "application/json",
            },
            body : JSON.stringify({uid:userId}),
        })
        .then((res)=>res.json())
        .then((json)=>{
            console.log('MyAsset',json);
            setPoint(json[0].point);
            setIPoint(json[0].i_point);
            setTPoint(json[0].t_point);
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

        let data = {point:value,throw:thr,uid:userId};

        if(value>0)
        {
            setReady(false);

            fetch(serverPath()+"/to_evscore",{
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
                <h3> EvScore </h3>
            </div>  
            <div className="MyPoint-top pb-3">
                <ListGroup>
                    <ListGroup.Item>
                        Point :
                    </ListGroup.Item>
                </ListGroup>
                <ListGroup>
                    <ListGroup.Item>
                        {point + " P"}
                    </ListGroup.Item>
                </ListGroup>
            </div>
            
            <strong className="fs-3">{value}P</strong>
            <div className="my-3">
                <p><strong className="fs-3">▲</strong></p>
                <Form.Range className="mb-3 EvScore-Range" step={1} min={0} max={20} value={value} onChange={onChange}/>
                <Form>
                <div className="Sort-c">

                    <Button className="mx-2" variant="danger" type="submit" onClick={(e)=>onSend(e,1)}>팀에 전송</Button>
                    <FormControl className="w-25" controlId="AutoComp" type="number" value={value} onChange={onChange}/>
                    <Button className="mx-2" variant="primary" type="submit" onClick={(e)=>onSend(e,0)}>나에게 전송</Button>
                </div>
                </Form>
                <p><strong className="fs-3">▼</strong></p>
            </div>

            <div className="EvScore-alert">
                {
                isAlert?(
                <Alert variant={alertColor}>
                        {alertText}
                </Alert >):null
                }
            </div>

            <div className="MyBonus-top mt-8">
                <ListGroup>
                    <ListGroup.Item className="px-4">
                        Point To My :
                    </ListGroup.Item>
                </ListGroup>
                <ListGroup>
                    <ListGroup.Item>
                        {iPoint + " P"}
                    </ListGroup.Item>
                </ListGroup>
            </div>

            <div className="MyBonus-top py-3">
                <ListGroup>
                    <ListGroup.Item>
                        Point To Team :
                    </ListGroup.Item>
                </ListGroup>
                <ListGroup>
                    <ListGroup.Item>
                        {tPoint + " P"}
                    </ListGroup.Item>
                </ListGroup>
            </div>

        </div> 
    )
}

export default EvScore;