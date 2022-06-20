//import Calender from './component/CheckIn/Calender';
import { Form, Button, InputGroup,Alert,Col,Row,Table,Dropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import serverIP from '../../IP_PORT';
import AutoComplete from '../component/AutoComplete/AutoComplete';
import {useSelector} from 'react-redux'
import './MngAvatarAdd.scss';

function MngAvatarAdd(props)
{
    const [useinfo, setUseinfo] = useState({name:"---",uid:"----"});
    const [number, setNumber] = useState("");
    const [index, setIndex] = useState("");
    const [cash, setCash] = useState("100");
    const [sex, setSex] = useState("남");
    const [date, setDate] = useState("");
    const [value, setValue] = useState("");

    const [isAlert, setIsAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertColor,setAlertColor] = useState("primary");

    const [viewImage, setViewImage] = useState('/noimage.jpg');
    const [imagefile, setImagefile] = useState({
        file: "",
        URL: "img/default_image.png",
    });
    const [refresh, setRefresh] = useState(false);

    useEffect(()=>{
        // if(!imagefile) return false;
        // const imgEL = document.querySelector("imgbox");
        // const reader = new FileReader();
        // reader.onload = () => (imgEL.getElementsByClassName.backgroundImage = 'url(${reader.result})');
        // reader.readAsDataURL(imagefile[0]);
    });

    let setAlert= (str,sel) =>{
        let alertColor = ["danger","primary"];
        console.log("setAlert",str,alertColor[sel]);
        setAlertColor(alertColor[sel]);
        setAlertText(str);
        setIsAlert(true);
        let timer = setTimeout(() => {
            setIsAlert(false);
        }, 200);

        return ()=>{ clearTimeout(timer) };
    }


    const onSend = ()=>{
        if(isAlert) return;

        let idx = index;
        let s = sex=="남"?0:1;
        let path = (s==0?'m':'w') + ('00' + number).slice(-3) +".png";

        let data = {idx:idx,path:path,cash:cash,sex:s};

        console.log(data);

        fetch(serverIP+"/in_avatar", {
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
                    setAlert("성공적으로 입력되었습니다",1);
                    setIndex(Number(index)+1);
                    setNumber(Number(number)+1);
                }
                else setAlert("서버에서 처리를 실패 했습니다",0);
            }catch (e) {
                setAlert("서버에서 처리를 실패 했습니다",0);
            }
        });


    }

    return(
        <div>
            <div className="title">
                <h3> Avatar Add </h3>
            </div>  

            <div className="MngGame-block">
                <Form.Group as={Row} controlId="formUser" className="mb-3">
                    <Col xs={1} className='px-0'/>
                    <Form.Label column xs={2} className="px-0">
                        idx :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Control type="text" placeholder="idx" value={index} onChange={(e)=>{setIndex(e.target.value)}} />
                    </Col>
                    <Form.Label column xs={2} className="px-0">
                        cash :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Control type="text" placeholder="" value={cash} onChange={(e)=>{setCash(e.target.value)}} />
                    </Col>
                </Form.Group>
            </div>

            <div className="MngGame-block">
                <Form.Group as={Row} controlId="formUser" className="mb-3">
                    <Col xs={1} className='px-0'/>
                    <Form.Label column xs={2} className="px-0">
                        성별 :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Select id="sex" value={sex} onChange={(e)=>{setSex(e.target.value)}}>
                            <option>남</option>
                            <option>여</option>
                        </Form.Select>
                    </Col>
                    <Form.Label column xs={2} className="px-0">
                        num :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Control type="text" placeholder="000" value={number} onChange={(e)=>{setNumber(e.target.value)}} />
                    </Col>
                </Form.Group>
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
                <Button variant="secondary" onClick={onSend}>전송</Button>
            </div>
        </div> 
    )
}

export default MngAvatarAdd;