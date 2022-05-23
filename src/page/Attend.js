//import Calender from './component/CheckIn/Calender';
import { Form, ProgressBar, Button, Alert} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import serverIP from '../IP_PORT';
import moment from 'moment';
import './Attend.scss';
import {useDispatch, useSelector} from 'react-redux'

function Attend(props)
{
    
    let member = useSelector((state)=>{return state.member});

    let [userId,setUserId] = useState(sessionStorage.getItem('user_uid'));

    let count = [0,1,2,3,4,5,6,7,8];
    const [attMyData, setAttMyData] = useState([true,true,true,true,true,true,true,true,true]);
    const [checklist, setChecklist] = useState([false,false,false,false,false,false,false,false,false]);
    const [openlist, setOpenlist] = useState([false,false,false,false,false,false,false,false,false]);
    const [originlist, setOriginlist] = useState([]);
    const [currentlist, setCurrentlist] = useState([]);
    const [total, setTotal] = useState(0);
    const [test, settest] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [reqAtt, setReqAtt] = useState(false);

    const [currentWeek, setCurrentWeek] = useState([]);
    const [weekname] = useState(['(월)','(화)','(수)','(목)','(금)','(토)','(일)','보류','미참']);
    const [curAttend, setCurAttend] = useState([]);
    const [workDay, setWorkDay] = useState(new Date());
    const [nonNext, setNonNext] = useState(false);

    useEffect(()=>{
        console.log('Attend',"useEffect");
        let currentDay = workDay;  
        let theYear = currentDay.getFullYear();
        let theMonth = currentDay.getMonth();
        let theDate  = currentDay.getDate();
        let theDayOfWeek = currentDay.getDay()
        let weeklist = [];

        console.log('theMonth :',theMonth, 'theDate :',theDate, 'theDayOfWeek :',theDayOfWeek);

        for(let i = 1 ; i<8; i++)
        {
            let weekday = new Date(theYear, theMonth, theDate + (i - theDayOfWeek));
            weeklist.push(weekday);
        }
        setCurrentWeek(weeklist);
        console.log('weeklist',weeklist);
        let endday = new Date(weeklist[6]);
        endday.setDate(endday.getDate()+1);
        let daytoday= [weeklist[0],endday];
        let uids = [];

        console.log('daytoday',daytoday);
        console.log('total',total);
        if(reqAtt==false) 
        {
            console.log('on /out_attend');

            let day = new Date();
            day.setDate(day.getDate()+1);
            let list = weeklist.filter(e=>{
                let eDay = moment(e).format('MMDD');
                let dDay = moment(day).format('MMDD');
                if(eDay==dDay) 
                    return e;
            })
            list.length>0?setNonNext(true):setNonNext(false);

            fetch(serverIP+"/out_attend",{
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
                console.log('getAttend',json);

                let attlist = count.map((e,i)=>
                {
                    if(i<7)
                        return json.filter(j=>(moment(j.attday).format('MMDD') == moment(weeklist[i]).format('MMDD') && j.atttype==0));
                    else if(i==7)
                        return json.filter(j=>j.atttype==1);
                    else
                        return json.filter(j=>j.atttype==2);
                });
                console.log('setCurAttend',attlist);

                setCurAttend(attlist);

                let attcrunt1 = count.map((e,i)=>
                {
                    return (attlist[i].filter(e=>e.uid==userId).length>0);
                });
                setChecklist(attcrunt1);
                let attcrunt2 = attcrunt1.slice();
                setAttMyData(attcrunt2);
                console.log('attcrunt1',attcrunt1);

                json.map((e)=>{
                    if(!uids.includes(e.uid))
                    {
                        uids.push(e.uid); 
                    }
                });
                setTotal(uids.length);
                setReqAtt(true);
            });
        }

    },[reqAtt,total,refresh])

    const WeekDay = (i)=>{

        let weekdaystr;
        if(i < 7)
            weekdaystr = moment(currentWeek[i]).format('MM/DD') + weekname[i];
        else
            weekdaystr = weekname[i];

        return weekdaystr;
    }

    
    const onClickCheck = (e)=>{
        // console.log('onClickCheck',e);
        let checked = checklist;
        checked[e] = !checked[e];
        console.log('onClickCheck',checked);
        setChecklist(checked);
        setRefresh(!refresh);
        // settest(test+1);
        // console.log('settest',test+1);
        // checked.map((e)=>
        // {
        //     if(e)
        // })
        //setAttData
    }
    const onAttCancel = (e)=>{
        
    }

    const onAttSend = (e)=>{
        let isChenge = false;
        let data = count.map((e,i)=>{
            console.log('onAttSend',checklist[i],attMyData[i]);
            let workday; 
            if(i<7)
                workday = currentWeek[i];
            else
                workday = currentWeek[0];

            if(checklist[i]!==attMyData[i])
            {
                isChenge = true;
                if(checklist[i])
                    return {work:1,uid:userId,day:workday};
                else
                    return {work:-1,uid:userId,day:workday};
            }
            else
                return {work:0,uid:0,day:workday};

        })
        
        if(isChenge)
        {
            fetch(serverIP+"/in_attend", {
                method : "post", // 통신방법
                headers : {
                "content-type" : "application/json",
                },
                body : JSON.stringify(data),
            })
            .then((res)=>{
                console.log('sendQuery',res);
                setReqAtt(false);
            });
        }
    }

    const OnPrev = ()=>{
        let curday = new Date(currentWeek[0]);
        console.log('OnPrev1',curday);
        curday.setDate(curday.getDate()-7);
        console.log('OnPrev2',curday);
        setWorkDay(curday);
        setOpenlist([false,false,false,false,false,false,false,false,false]);
        setReqAtt(false);
    }

    const OnNext = ()=>{
        let curday = new Date(currentWeek[0]);
        curday.setDate(curday.getDate()+7);
        console.log('OnNext',curday);
        setWorkDay(curday);
        setOpenlist([false,false,false,false,false,false,false,false,false]);
        setReqAtt(false);

    }

    const onClickList = (i)=>{
        let list = openlist;
        list[i]=!list[i];
        console.log('onClickList',list);
        setOpenlist(list);
        setRefresh(!refresh);
    }

    return(
        <div>
        {
            <div>
                <h3> Attend </h3>

                <div className="Attend-top">
                    <Button onClick={OnPrev} size="lg" variant="secondary">{'<'}</Button>
                    <div className="Attend-top-black">
                        <Alert variant="dark" >
                            {
                                reqAtt?<h4>{moment(currentWeek[0]).format('MM/DD')}</h4>:null
                            }
                        </Alert>
                    </div>
                    {
                        nonNext?<Button onClick={OnNext} size="lg" variant="secondary" disabled>{'>'}</Button>: 
                        <Button onClick={OnNext} size="lg" variant="secondary">{'>'}</Button>
                    }
                </div>
                
                <table className='Attend-table'>
                    <thead>
                        <tr>
                            <th className='Attend-th-20'>날짜</th>
                            <th className='Attend-th-70'>진행률</th>
                            <th className='Attend-th-10'>투표</th>
                            <th className='Attend-th-10'>참석</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            count.map((e,i)=>{
                                if(curAttend !=='undefined' && curAttend.length >0)
                                {
                                    let length = curAttend[i].length;
                                    return(
                                        <>
                                        <tr key = {i} className='Attend-tr'>
                                            <td className='Attend-td' onClick={()=>onClickList(i)}>{WeekDay(i)}</td>
                                            <td className='Attend-td' onClick={()=>onClickList(i)}><ProgressBar now={(100/total)*length} /></td>
                                            <td className='Attend-td' onClick={()=>onClickList(i)}>{length}</td>
                                            <td className='Attend-td'>
                                                <Form.Check type='checkbox' id='rd1' onChange={()=>onClickCheck(i)} checked={checklist[i]}></Form.Check>
                                            </td>
                                        </tr>
                                        <TDATA idx={i} openlist={openlist} curlist={curAttend[i]}/>
                                        </>

                                    )
                                }

                            })
                        }

                    </tbody>
                </table>

                <div className='Attend-button'>
                    {/* <Button variant="secondary" onClick={onAttCancel}>취소</Button> */}
                    <Button variant="success" onClick={onAttSend}>전송</Button>
                </div>
            </div>
        }
        </div> 
    )
}

function TDATA(props)
{
    let i = props.idx;
    let curlist = props.curlist;
    let rt;
    if(props.openlist[i] && curlist.length>0)
        rt = curlist.map((e,i)=>{
        if(i<curlist.length-1)
        {
            return (
                <tr key = {i} className='Attend-tr-member'>
                    <td></td>
                    <td>{e.name}</td>
                    <td></td>
                    <td></td>
                </tr>
                )
        }
        else
        {
            return (
                <tr key = {i} className='Attend-tr'>
                    <td></td>
                    <td>{e.name}</td>
                    <td></td>
                    <td></td>
                </tr>
                )
        }
    })
    return rt;

}

export default Attend;