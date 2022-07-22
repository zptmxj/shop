//import Calender from './component/CheckIn/Calender';
import { Form, ProgressBar, Button, Alert, ListGroup, FormControl } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {serverPath} from '../../IP_PORT';
import moment from 'moment';
import './MyPassword.scss';
import {useDispatch, useSelector} from 'react-redux'

function MyPassword(props)
{
    
    let member = useSelector((state)=>{return state.member});
    let userData = useSelector((state)=>{return state.data});
    let [userId,setUserId] = useState(userData.uid);
    const [curPwInput, setCurPwInput] = useState("");

    const [changePwInput1, setChangePwInput1] = useState("");
    const [changePwInput2, setChangePwInput2] = useState("");

    const [reqAtt, setReqAtt] = useState(false);

    const [workDay, setWorkDay] = useState(new Date());
    const [isAlert, setIsAlert] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [alertColor,setAlertColor] = useState("primary");
    const [alertColorSel] = useState();

    useEffect(()=>{
        console.log('MyPassword',"useEffect");
        let currentDay = workDay;  
        let theYear = currentDay.getFullYear();
        let theMonth = currentDay.getMonth();

        if(reqAtt==false) 
        {
            console.log('on /out_MyPassword');
            setReqAtt(true);
        }

    },[reqAtt])

    const OnPrev = ()=>{
        let curday = new Date(workDay);
        console.log('OnPrev',curday);
        curday.setMonth(curday.getMonth()-1);
        setWorkDay(curday);
        setReqAtt(false);
    }

    const OnNext = ()=>{
        let curday = new Date(workDay);
        console.log('OnNext',curday);
        curday.setMonth(curday.getMonth()+1);
        setWorkDay(curday);
        setReqAtt(false);

    }

    
    let onCurPwInput = (e)=>{
        setCurPwInput(e.target.value);
    }
    let onChangePwInput1 = (e)=>{
        setChangePwInput1(e.target.value);
    }
    let onChangePwInput2 = (e)=>{
        setChangePwInput2(e.target.value);
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


    let sendQuery = ()=>{
        if(changePwInput1!=changePwInput2)
        {
            setAlert("바뀔 두 비밀번호가 일치하지 않습니다.",0);
            return;
        }
        else if(changePwInput1.length<4)
        {
            setAlert("비밀번호가 4자리 보다 작을 수 없습니다.",0);
            return;
        }

        let data = [userId,curPwInput,changePwInput1];
        fetch(serverPath()+"/in_pw", {
            method : "post", // 통신방법
            headers : {
              "content-type" : "application/json",
            },
            body : JSON.stringify(data),
          })
          .then((res)=>res.json())
          .then((json)=>{
            console.log("/in_pw",json);

            if(json.length>0 && json[0]==userId)
            {
                setAlert("비밀번호 변경이 완료되었습니다.",1);
            }
            else if(json.length>0 && json[0]=="fail")
            {
                setAlert("현재 비밀번호가 일치하지 않습니다.",0);
            }
          });
    }

    return(
        <div>
        {
            <div>
                <div className="title">
                    <h3> MyPassword </h3>
                </div>
                <div className="MyPw-input">
                    <ListGroup>
                        <ListGroup.Item>
                            CurrentPW:
                        </ListGroup.Item>
                    </ListGroup>
                    <FormControl id='pwinput' type="password" className='MyPw-input-deposit' value={curPwInput} onChange={onCurPwInput}></FormControl>
                </div>
                <div className="MyPw-input-change">
                    <ListGroup>
                        <ListGroup.Item>
                            ChangePW:
                        </ListGroup.Item>
                    </ListGroup>
                    <FormControl id='pwinput' type="password" className='MyPw-input-deposit' value={changePwInput1} onChange={onChangePwInput1}></FormControl>
                </div>
                <div className="MyPw-input">
                    <ListGroup>
                        <ListGroup.Item>
                            ConfirmPW:
                        </ListGroup.Item>
                    </ListGroup>
                    <FormControl id='pwinput' type="password" className='MyPw-input-deposit' value={changePwInput2} onChange={onChangePwInput2}></FormControl>
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
                    <Button variant="secondary" onClick={sendQuery}>전송</Button>
                </div>
            </div>
        }
        </div> 
    )
}

function HISTORY(props)
{
    let string = props.history;
    if(string == "Check-In")
        string = "참석";
    else if(string == "Deposit")
        string = "입금";
    else if(string == "Balance")
        string = "정산";

    return (<td >{string}</td>);
}


export default MyPassword;