//import Calender from './component/CheckIn/Calender';
import { Form, Button, InputGroup,Alert,Col,Row,Table,Dropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import {serverPath} from '../../IP_PORT';
import AutoComplete from '../component/AutoComplete/AutoComplete';
import {useSelector} from 'react-redux'
import './MngAnimalAdd.scss';

function MngAnimalAdd(props)
{
    const [useinfo, setUseinfo] = useState({name:"---",uid:"----"});
    const [number, setNumber] = useState("");
    const [index, setIndex] = useState("");
    const [point, setPoint] = useState("100");
    const [anNmae, setAnNmae] = useState("");
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
        let path = 'a' + ('00' + number).slice(-3) +".png";

        let data = {idx:idx,path:path,point:point,point:point};

        console.log(data);

        fetch(serverPath()+"/in_animal", {
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
                <h3> Animal Add </h3>
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
                        point :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Control type="text" placeholder="" value={point} onChange={(e)=>{setPoint(e.target.value)}} />
                    </Col>
                </Form.Group>
            </div>

            <div className="MngGame-block">
                <Form.Group as={Row} controlId="formUser" className="mb-3">
                    <Col xs={1} className='px-0'/>
                    <Form.Label column xs={2} className="px-0">
                        name :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Control type="text" placeholder="이름" value={anNmae} onChange={(e)=>{setAnNmae(e.target.value)}} />
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

export default MngAnimalAdd;