//import Calender from './component/CheckIn/Calender';
import { Form, Button, InputGroup,Alert,Col,Row,Table,Dropdown } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import axios from 'axios';
import serverIP from '../../IP_PORT';
import AutoComplete from '../component/AutoComplete/AutoComplete';
import {useSelector} from 'react-redux'
import './MngMemberAdd.scss';

function MngMemberAdd(props)
{
    let member = useSelector((state)=>{return state.member});

    const [useinfo, setUseinfo] = useState({name:"---",uid:"----"});
    const [number, setNumber] = useState("");
    const [lastname, setLastname] = useState("");
    const [firstname, setFirstname] = useState("");
    const [birth, setBirth] = useState("");
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
        // SELECT MAX(컬럼) FROM 테이블;

    },[])

    useEffect(()=>{
        // if(!imagefile) return false;
        // const imgEL = document.querySelector("imgbox");
        // const reader = new FileReader();
        // reader.onload = () => (imgEL.getElementsByClassName.backgroundImage = 'url(${reader.result})');
        // reader.readAsDataURL(imagefile[0]);
    });

    const getString = (array)=>{
        let str = '';
        for(let i =0; i<array.length; i++)
        {
            if(array[i] && str.length==0) 
                str += (i+1);
            else if(array[i] ) 
                str += ("," + (i+1) );
        }
        return str;
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


    const onSend = (idx)=>{
        if(isAlert) return;

        let num = number;
        let last = lastname;
        let first = firstname;
        let bir = birth;
        let sexinfo = 0;
        let dateinfo = date;

        if(number.length < 4)
        {
            setAlert("번호가 4자리 이하입니다",0);
            return;
        }
        else if(lastname.length == 0)
        {
            setAlert("성이 입력되지 않았습니다",0);
            return;
        }
        else if(firstname.length == 0)
        {
            setAlert("이름이 입력되지 않았습니다",0);
            return;
        }
        else if(birth.length < 4)
        {
            setAlert("년생이 4자리 이하입니다",0);
            return;
        }
        else if(date.length == 0)
        {
            setAlert("입장시기가 입력되지 않았습니다",0);
            return;
        }
        if(sex == "여")  sexinfo = 1;
        console.log(num,last,first,bir,sexinfo,dateinfo);

        let data = {uid:number,last:last,name:first,sex:sexinfo,age:birth,adddate:date};

        fetch(serverIP+"/in_member", {
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
                if(json.succes) setAlert("성공적으로 입력되었습니다",1);
                else setAlert("서버에서 처리를 실패 했습니다",0);
            }catch (e) {
                setAlert("서버에서 처리를 실패 했습니다",0);
            }
        });

    }

    return(
        <div>
            <div className="title">
                <h3> Member Add </h3>
            </div>  

            <Form.Group as={Row} controlId="formUser" className="mb-3">
                <Col xs={1} className='px-0'/>
                <Form.Label column xs={2} className="px-0">
                    번호 :
                </Form.Label>
                <Col xs={3} className='px-0'>
                    <Form.Control type="text" placeholder="번호 4자" value={number} onChange={(e)=>{setNumber(e.target.value)}} />
                </Col>
                <Col xs={1} className='px-0'>
                </Col>
                <Col xs={4} className='px-0'>
                    <Table bordered >
                        <tr>
                            <td className='px-0'>{useinfo.name}</td>
                            <td className='px-0'>{useinfo.uid}</td>
                        </tr>
                    </Table>
                </Col>
            </Form.Group>

            <div className="MngGame-block">
                <Form.Group as={Row} controlId="formUser" className="mb-3">
                    <Col xs={1} className='px-0'/>
                    <Form.Label column xs={2} className="px-0">
                        성 :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Control type="text" placeholder="성" value={lastname} onChange={(e)=>{setLastname(e.target.value)}} />
                    </Col>
                    <Form.Label column xs={2} className="px-0">
                        이름 :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Control type="text" placeholder="이름" value={firstname} onChange={(e)=>{setFirstname(e.target.value)}}/>
                    </Col>
                </Form.Group>
            </div>

            <div className="MngGame-block">
                <Form.Group as={Row} controlId="formUser" className="mb-3">
                    <Col xs={1} className='px-0'/>
                    <Form.Label column xs={2} className="px-0">
                        년생 :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Control type="text" placeholder="년생 4자" value={birth} onChange={(e)=>{setBirth(e.target.value)}} />
                    </Col>
                    <Form.Label column xs={2} className="px-0">
                        성별 :
                    </Form.Label>
                    <Col xs={3} className='px-0'>
                        <Form.Group className="mb-3">
                        <Form.Select id="sex" value={sex} onChange={(e)=>{setSex(e.target.value)}}>
                            <option>남</option>
                            <option>여</option>
                        </Form.Select>
                        </Form.Group>
                    </Col>
                </Form.Group>
            </div>

            <div className="MngGame-block">
                <Form.Group as={Row} controlId="formUser" className="mb-3">
                    <Col xs={5} className='px-0'>
                        <Form.Label column xs={6} className="px-0">
                            입장시기 :
                        </Form.Label>
                    </Col>
                    <Col xs={6} className='px-0'>
                        <Form.Control type="date" value={date} onChange={(e)=>{setDate(e.target.value)}}/>
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

export default MngMemberAdd;