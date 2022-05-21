//import Calender from './component/CheckIn/Calender';
import { Form, ProgressBar, Button} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import serverIP from '../IP_PORT';
import moment from 'moment';
import './Attend.scss';

function Attend(props)
{
    
    let [userId,setUserId] = useState(sessionStorage.getItem('user_uid'));

    let count = [0,1,2,3,4,5,6,7,8];
    const [attMyData, setAttMyData] = useState([true,true,true,true,true,true,true,true,true]);
    const [checklist, setChecklist] = useState([false,false,false,false,false,false,false,false,false]);
    const [originlist, setOriginlist] = useState([]);
    const [currentlist, setCurrentlist] = useState([]);
    const [total, setTotal] = useState(0);
    const [test, settest] = useState(0);
    const [refresh, setRefresh] = useState(false);

    const [currentWeek, setCurrentWeek] = useState([]);
    const [weekname] = useState(['(월)','(화)','(수)','(목)','(금)','(토)','(일)','보류','미참']);
    const [curAttend, setCurAttend] = useState([]);

    useEffect(()=>{
        console.log('Attend',"useEffect");
        let currentDay = new Date();  
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

        let daytoday= [weeklist[0],weeklist[6]];
        let uids = [];

        console.log('total',total);
        if(total==0)
        {
            console.log('on /out_attend');
            fetch(serverIP+"/out_attend",{
                method:"post",
                headers : {
                "content-type" : "application/json",
                },
                body : JSON.stringify(daytoday),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('getAttend',json);
                setOriginlist(json);
                setCurrentlist(json);

                let attlist = count.map((e,i)=>
                {
                    if(i<7)
                        return json.filter(e=>(moment(e.attday).format('MMDD')==moment(weeklist[i]).format('MMDD')) && e.atttype==0);
                    else if(i==7)
                        return json.filter(e=>e.atttype==1);
                    else
                        return json.filter(e=>e.atttype==2);
                });
                setCurAttend(attlist);

                let attcrunt1 = count.map((e,i)=>
                {
                    return (attlist[i].filter(e=>e.uid==userId).length>0);
                });
                setChecklist(attcrunt1);
                let attcrunt2= attcrunt1.slice();
                setAttMyData(attcrunt2);
                console.log('setChecklist_attcrunt1',attcrunt1);
                console.log('setChecklist_test',test);

                json.map((e)=>{
                    if(!uids.includes(e.uid))
                    {
                        uids.push(e.uid); 
                    }
                });
                setTotal(uids.length);
            });
        }
        // 다음할거.

    },[checklist,refresh])

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
        let data = count.map((e,i)=>{
            console.log('onAttSend',checklist[i],attMyData[i]);
            let workday; 
            if(i<7)
                workday = currentWeek[i];
            else
                workday = currentWeek[0];

            if(checklist[i]!==attMyData[i])
            {
                if(checklist[i])
                    return {work:1,uid:userId,day:workday};
                else
                    return {work:-1,uid:userId,day:workday};
            }
            else
                return {work:0,uid:0,day:workday};
        })
        
        fetch(serverIP+"/in_attend", {
            method : "post", // 통신방법
            headers : {
              "content-type" : "application/json",
            },
            body : JSON.stringify(data),
          })
          .then((res)=>{console.log('sendQuery',res)});
    }


    return(
        <div>
        {
            <div>
                <h3> Attend </h3>

                <table className='Attend-table'>
                    <thead>
                        <tr>
                            <th className='Attend-th-20'>날자</th>
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
                                <tr key = {i} className='Attend-tr'>
                                    <td className='Attend-td'>{WeekDay(i)}</td>
                                    <td className='Attend-td'><ProgressBar now={(100/total)*length} /></td>
                                    <td className='Attend-td'>{length}</td>
                                    <td className='Attend-td'>
                                        <Form.Check type='checkbox' id='rd1' onClick={()=>onClickCheck(i)} checked={checklist[i]}></Form.Check>
                                    </td>
                                </tr>)
                            }

                        })

                    }
                    </tbody>
                </table>

                <div className='Attend-button'>
                    <Button variant="secondary" onClick={onAttCancel}>취소</Button>
                    <Button variant="success" onClick={onAttSend}>전송</Button>
                </div>
            </div>
        }
        </div> 
    )
}



export default Attend;