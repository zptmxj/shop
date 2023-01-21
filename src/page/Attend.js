//import Calender from './component/CheckIn/Calender';
import { Form, ProgressBar, Button, Alert} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {serverPath,imagePath} from '../IP_PORT';
import moment from 'moment';
import './Attend.scss';
import {useDispatch, useSelector} from 'react-redux'
import NamePlate from './component/NamePlate/NamePlate'

function Attend(props)
{
    
    let member = useSelector((state)=>{return state.member});
    let userData = useSelector((state)=>{return state.data});
    let [userId,setUserId] = useState(userData.uid);

    let count = [0,1,2,3,4,5,6,7,8];
    const [attMyData, setAttMyData] = useState([true,true,true,true,true,true,true,true,true]);
    const [checklist, setChecklist] = useState([false,false,false,false,false,false,false,false,false]);
    const [openlist, setOpenlist] = useState([false,false,false,false,false,false,false,false,false]);
    const [total, setTotal] = useState(0);
    const [refresh, setRefresh] = useState(false);
    const [reqAtt, setReqAtt] = useState(false);

    const [currentWeek, setCurrentWeek] = useState([]);
    const [weekname] = useState(['(월)','(화)','(수)','(목)','(금)','(토)','(일)','보류','미참']);
    const [curAttend, setCurAttend] = useState([]);
    const [workDay, setWorkDay] = useState(new Date());
    const [nonNext, setNonNext] = useState(false);

    
    useEffect(()=>{
        console.log('Attend',member);
        console.log('Attend',userData);

        
        console.log('Attend',"useEffect");
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
            console.log('on /out_attend');

            let day = new Date();
            day.setDate(day.getDate()+7);
            let list = weeklist.filter(e=>{
                let eDay = moment(e).format('MMDD');
                let dDay = moment(day).format('MMDD');
                if(eDay==dDay) 
                    return e;
            })
            list.length>0?setNonNext(true):setNonNext(false);

            fetch(serverPath()+"/out_attend",{
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
                    {
                        j.name = name[0].name;
                        j.path = name[0].path;
                    }
                    return j;
                })

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
                    let attarray = attlist[i].filter(e=>e.uid==userId);
                    let settime = "19:00:00";
                    if(i>4) settime = "15:00:00";
                    if(attarray.length>0)
                        return  {activity: true, time:attarray[0].atttime};
                    else
                        return  {activity: false, time:settime};

                });
                setChecklist(attcrunt1);
                //let attcrunt2 = attcrunt1.slice();
                let attcrunt2 = attcrunt1.map((e,i)=>{return {activity: e.activity, time: e.time}});
                setAttMyData(attcrunt2);
                console.log('attcrunt1',attcrunt1);
                console.log('attcrunt2',attcrunt2);

                json.map((e)=>{
                    if(!uids.includes(e.uid))
                    {
                        uids.push(e.uid); 
                    }
                });
                setTotal(uids.length);
                let nonAttend = member.filter(mem=>{if(mem.activity&&!uids.includes(mem.uid)) return mem});
                console.log("nonAttend",nonAttend);
                setReqAtt(true);
            });
        }

    },[reqAtt,total,refresh,curAttend])

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
        console.log('onClickCheck',checked,e);
        checked[e].activity = !checked[e].activity;
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
        console.log('checklist',checklist);
        console.log('attMyData',attMyData);
        let data = count.map((e,i)=>{
            let workday; 
            if(i<7)
                workday = currentWeek[i];
            else
                workday = currentWeek[0];

            let rt;
            if(checklist[i].activity!==attMyData[i].activity)
            {
                isChenge = true;
                if(checklist[i].activity)
                    rt = {work:1,uid:userId,day:workday,time:checklist[i].time};
                else
                    rt = {work:-1,uid:userId,day:workday,time:checklist[i].time};
            }
            else if(checklist[i].activity && checklist[i].time!==attMyData[i].time)
            {
                isChenge = true;
                rt = {work:2,uid:userId,day:workday,time:checklist[i].time};
            }
            else
                rt = {work:0,uid:0,day:workday,time:checklist[i].time};

            return rt;
        })
        
        console.log('isChenge',isChenge);
        if(isChenge)
        {

            fetch(serverPath()+"/in_attend", {
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

    const setCallBack= (e)=>{
        console.log("setCallBack",e);
        setChecklist(e);
        setRefresh(!refresh);
    }

    return(
        <div>
        {
            <div>
                <div className="title">
                    <h3> Attend </h3>
                </div>   

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
                
                <div className="Attend-middle">
                    <table className='Attend-table'>
                        <thead>
                            <tr>
                                <th className='Attend-th-20'>날짜</th>
                                <th className='Attend-th-70'>참석률</th>
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
                                        let progress;
                                        let isDisDay = false;
                                        let isDisHours = false;
                                        let today = new Date();
                                        let curDate = currentWeek[i];
                                        if(i<7) 
                                        {
                                            //console.log("i<7",currentWeek[i].getTime(),today.getTime());
                                            if(curDate.getTime()<=today.getTime())
                                                isDisDay = true;

                                            curDate.setHours(12);
                                            if(curDate.getTime()<=today.getTime())
                                                isDisHours = true;
                                        }
                                        else
                                        {
                                            if(currentWeek[6].getTime()<today.getTime())
                                                isDisDay = true;
                                        }

                                        if(total<=0)  progress=0;
                                        else  progress = (100/total)*length;

                                        return(
                                            <>
                                                <tr key={i} className='Attend-tr'>
                                                    <td className='Attend-td' onClick={()=>onClickList(i)}>{WeekDay(i)}</td>
                                                    <td className='Attend-td-prog' onClick={()=>onClickList(i)}><ProgressBar now={progress} /></td>
                                                    <td className='Attend-td' onClick={()=>onClickList(i)}>{length}</td>
                                                    <td className='Attend-td'>
                                                        <Form.Check type='checkbox' disabled={isDisDay} onChange={()=>onClickCheck(i)} checked={checklist[i].activity}></Form.Check>
                                                    </td>
                                                </tr>
                                                <TDATA idx={i} openlist={openlist} curlist={curAttend} checklist={checklist} userId={userId} isDisHours={isDisHours} setCallBack={setCallBack}/>
                                            </>
                                        )
                                    }

                                })
                            }

                        </tbody>
                    </table>
                </div>

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
    let idx = props.idx;
    let curlist = props.curlist[idx];
    let userId = props.userId;
    let isDisHours = props.isDisHours;
    let rt;

    const change = (e,j)=>{
        let currnt = props.checklist;
        currnt[idx].time = e.target.value+":00";
        props.setCallBack(currnt);
    }

    // const TimeTd = ()=>{
    //     <td></td>
    //     <td></td>
    // }

    if(props.openlist[idx] && curlist.length>0)
        rt = curlist.map((e,i)=>{
        let classN = "Attend-tr";
        if(i<curlist.length-1)
            classN = "Attend-tr-member";

        let timeArray = String(e.atttime).split(':');
        let timeStr = "-- --:--";
        if(idx<7)
        {
            if(timeArray[0]>11)
            {
                if(timeArray[0]==12)
                    timeStr ="오후 " + timeArray[0] + ':' + timeArray[1];
                else 
                    timeStr ="오후 " + (timeArray[0]-12) + ':' + timeArray[1];

            }
            else 
                timeStr ="오전 " + timeArray[0] + ':' + timeArray[1];
        }
        //let imgpath = imagePath()+'/avatars/'+e.path;
        //console.log("imgpath",imgpath);

        return (
            <tr key = {i} className={classN}>
                <td className='Attend-text-right'>
                    <NamePlate mem={e} />
                </td>
                <td className='Attend-td-prog'>{timeStr}</td>
                <td colSpan={2} >
                        {((idx<7)&&(e.uid==userId))?<input disabled={isDisHours} className='Attend-input' type="time" key={i} value={props.checklist[idx].time} onChange={(e)=>change(e,i)}/>:null}
                </td>
            </tr>
            )
    })
    return rt;

}

export default Attend;