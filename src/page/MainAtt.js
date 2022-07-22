//import Calender from './component/CheckIn/Calender';
import { Form, ProgressBar, Button, Alert} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {serverPath} from '../IP_PORT';
import moment from 'moment';
import './MainAtt.scss';
import {useDispatch, useSelector} from 'react-redux'


function MainAtt(props)
{
    
    let member = useSelector((state)=>{return state.member});

    let [logId,setlogId] = useState('');
    let [logPw,setlogPw] = useState('');


    let count = [0,1,2,3,4,5,6,7,8];
    const [attMyData, setAttMyData] = useState([true,true,true,true,true,true,true,true,true]);
    const [checklist, setChecklist] = useState([false,false,false,false,false,false,false,false,false]);
    const [originlist, setOriginlist] = useState([]);
    const [currentlist, setCurrentlist] = useState([]);
    const [total, setTotal] = useState(0);
    const [test, settest] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [reqAtt, setReqAtt] = useState(false);

    const [currentWeek, setCurrentWeek] = useState([]);
    const [weekname] = useState(['(월)','(화)','(수)','(목)','(금)','(토)','(일)','보류','미참']);
    const [curMainAtt, setCurMainAtt] = useState([]);
    const [workDay, setWorkDay] = useState(new Date());
    const [isAutoLogin, setAutoLogin] = useState(false);

    useEffect(()=>{
        console.log('MainAtt',"useEffect");
        let currentDay = workDay;  
        let theYear = currentDay.getFullYear();
        let theMonth = currentDay.getMonth();
        let theDate  = currentDay.getDate();
        let theDayOfWeek = currentDay.getDay()
        let weeklist = [];

        for(let i = 1 ; i<8; i++)
        {
            let weekday = new Date(theYear, theMonth, theDate + (i - theDayOfWeek));
            weeklist.push(weekday);
        }
        setCurrentWeek(weeklist);
        let endday = new Date(weeklist[6]);
        endday.setDate(endday.getDate()+1);
        let daytoday= [weeklist[0],endday];
        let uids = [];

        console.log('total',total);
        if(reqAtt==false) 
        {
            console.log('on /out_Attend');

            let day = new Date();
            day.setDate(day.getDate()+1);
            let list = weeklist.filter(e=>{
                let eDay = moment(e).format('MMDD');
                let dDay = moment(day).format('MMDD');
                if(eDay==dDay) 
                    return e;
            })

            fetch(serverPath()+"/out_Attend",{
                method:"post",
                headers : {
                "content-type" : "application/json",
                },
                body : JSON.stringify(daytoday),
            })
            .then((res)=>res.json())
            .then((json)=>{

                json = json.map(j=>{
                    let name = member.filter(e=>{
                        if(j.uid==e.uid) return e.name;
                    })
                    if(name.length > 0)
                        j.name = name[0].name;
                    return j;
                })

                setOriginlist(json);
                setCurrentlist(json);
                console.log('getMainAtt',json);

                let attlist = count.map((e,i)=>
                {
                    if(i<7)
                        return json.filter(j=>(moment(j.attday).format('MMDD') == moment(weeklist[i]).format('MMDD') && j.atttype==0));
                    else if(i==7)
                        return json.filter(j=>j.atttype==1);
                    else
                        return json.filter(j=>j.atttype==2);
                });
                console.log('setCurMainAtt',attlist);

                setCurMainAtt(attlist);

                json.map((e)=>{
                    if(!uids.includes(e.uid))
                    {
                        uids.push(e.uid); 
                    }
                });
                setTotal(uids.length);
                let nonMainAtt = member.filter(mem=>{if(mem.activity&&!uids.includes(mem.uid)) return mem});
                console.log("nonMainAtt",nonMainAtt);
                setReqAtt(true);
            });
        }

    },[reqAtt,total,refresh,curMainAtt])

    const WeekDay = (i)=>{

        let weekdaystr;
        if(i < 7)
            weekdaystr = moment(currentWeek[i]).format('MM/DD') + weekname[i];
        else
            weekdaystr = weekname[i];

        return weekdaystr;
    }


    const login = (e)=>{
        e.preventDefault();
        console.log(logId);

        let user = [logId,logPw];
        fetch(serverPath()+"/out_login",{
          method:"post",
          headers : {
            "content-type" : "application/json",
          },
          body : JSON.stringify(user),
        })
        .then((res)=>res.json())
        .then((json)=>{
          console.log(json);
          if(json.length == 1)
          {
            if(isAutoLogin)
            {
                localStorage.setItem('user_uid',json[0].uid);
                localStorage.setItem('user_name',json[0].name);
                localStorage.setItem('privilege',json[0].privilege);
            }
            sessionStorage.setItem('user_uid',json[0].uid);
            sessionStorage.setItem('user_name',json[0].name);
            sessionStorage.setItem('privilege',json[0].privilege);
            sessionStorage.setItem('login',true);
            localStorage.setItem('autologin',isAutoLogin);
            window.location.replace("/");
          }
        })
    
        //sessionStorage.setItem('user_uid','0773');
    }
    
    const logIdChange = (e)=>{
        setlogId(e.target.value);
    }

    const logPwChange = (e)=>{
        setlogPw(e.target.value);
    }
    const setCheckLogin = (e)=>{
        console.log(e.target.checked);
        setAutoLogin(e.target.checked);
    }
    return(
        <div>
        {
            <div>
                <div className='MainAtt-top mt-5 mb-5'>
                    <Form>
                        <Form.Group id="ifrom" className="mb-3" controlId="formBasicEmail">
                            <Form.Control onChange={logIdChange} value={logId} placeholder="User ID" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Control onChange={logPwChange} value={logPw} type="password" placeholder="Password" />
                        </Form.Group>
                        <Form.Group className="mb-3 " controlId="formBasicCheckbox">
                            <Form.Check  type="checkbox" label="로그인 유지" onChange={setCheckLogin} checked={isAutoLogin}></Form.Check>
                        </Form.Group>
                        <Button onClick={login} variant="primary" type="submit">
                            Login
                        </Button>
                    </Form>
                </div>
                
                <div className="title">
                    <h3> Attend this Week </h3>
                </div>   
                <div className='MainAtt-mid mb-5'>
                    <table className='MainAtt-table'>
                        <thead>
                            <tr>
                                <th className='MainAtt-th-20'>날짜</th>
                                <th className='MainAtt-th-70'>참석률</th>
                                <th className='MainAtt-th-10'>투표</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                count.map((e,i)=>{
                                    if(curMainAtt !=='undefined' && curMainAtt.length >0)
                                    {
                                        let length = curMainAtt[i].length;
                                        let progress;
                                        if(total<=0)  progress=0;
                                        else  progress = (100/total)*length;

                                        return(
                                            <>
                                            <tr key = {i} className='MainAtt-tr'>
                                                <td className='MainAtt-td' >{WeekDay(i)}</td>
                                                <td className='MainAtt-td-prog' ><ProgressBar now={progress} /></td>
                                                <td className='MainAtt-td' >{length}</td>
                                            </tr>
                                            </>
                                        )
                                    }
                                })
                            }
                        </tbody>
                    </table>
                </div>
            </div>
        }
        </div> 
    )
}


export default MainAtt;