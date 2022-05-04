
import './Calender.scss';
import {Button,Alert,OverlayTrigger,Popover} from 'react-bootstrap';
import {getMonth, startOfMonth, startOfWeek, addDays,getDate, getDay} from 'date-fns';
import { useEffect, useLayoutEffect, useState } from 'react';
import serverIP from '../../../IP_PORT';
import moment from 'moment';
//import styled from 'styled-components';


function Calender(props)
{
    let Day = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    let Week = [1,2,3,4,5,6];
    let fullDate = new Date();
    let [curYear,setCurYear] = useState(fullDate.getFullYear());
    let [curMonth,setCurMonth] = useState(getMonth(fullDate));
    let [curDay,setCurDay] = useState(getDay(fullDate));

    let [dateList,setDateList] = useState();
    let [onRender,setOnRender] = useState(true);

    let [checkin,setCheckin] = useState([]);



    useLayoutEffect(()=>{
        console.log('Calender_useLayoutEffect');
    })

    useEffect(()=>{
        console.log('Calender_useEffect');

         if(onRender)
        {
            Rerender();
        }

        return () => {
            //setOnRender(true);

        }
        
    },[onRender]);

    const OnPrev = ()=>{
        if(curMonth==0)
        {
            setCurYear(curYear-1);
            setCurMonth(11);
        }
        else 
            setCurMonth(curMonth-1);
            
        setOnRender(true);
    }

    const OnNext = ()=>{
        if (curMonth == 11)
        {
            setCurYear(curYear+1);
            setCurMonth(0);
        }
        else
            setCurMonth(curMonth+1);

        setOnRender(true);
    }

    const Rerender = ()=>{
        let weekList = [[],[],[],[],[],[]];
        console.log("Rerender", curYear, curMonth, curDay);
        let monthStart = startOfMonth(new Date(curYear, curMonth, curDay));
        let weekStart = startOfWeek(monthStart, {weekStartOn:0});

        if(onRender)
        {
            for(let i =0;i<6;i++)
            {
                for(let j =0;j<7;j++){
                const tempDate = addDays(weekStart,(i*7)+j);
                            
                if(getMonth(tempDate) === curMonth){
                    weekList[i].push({
                        formatted: j,
                        date : tempDate,
                        day : getDate(tempDate),
                        month: 'cur'
                        })
                    }else if(getMonth(tempDate) < curMonth){
                        weekList[i].push({
                        formatted:j,
                        date : tempDate,
                        day : getDate(tempDate),
                        month:'pre'
                        })
                    }else if(getMonth(tempDate) > curMonth){
                        weekList[i].push({
                        formatted:j,
                        date : tempDate,
                        day : getDate(tempDate),
                        month: 'next'
                        })
                    }
                }
            }
            console.log("달력정보" ,weekList);
            setDateList(weekList);

            let startDay= moment(weekList[0][0].date).format('YYYY-MM-DD');
            let endDay= moment(weekList[5][6].date).format('YYYY-MM-DD');
            console.log('Calender',"체크인 정보 불러오기",startDay,endDay);
            let daytoday= [startDay,endDay];
            fetch(serverIP+"/out_checkin",{
              method:"post",
              headers : {
                "content-type" : "application/json",
              },
              body : JSON.stringify(daytoday),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log("json" ,json);
                let node;
                let checkindata= [];
                for(let i =0;i<6;i++)
                {
                    for(let j =0;j<7;j++){
                        node = json.filter((e)=>{
                            //console.log("e.date" ,moment(e.date).format('YYYY-MM-DD'),"weekList[i][j].date" ,moment(weekList[i][j].date).format('YYYY-MM-DD'));
                            if(moment(e.date).format('YYYY-MM-DD') == moment(weekList[i][j].date).format('YYYY-MM-DD')) 
                            return e
                        });
                        checkindata.push(node);
                    }
                }
                console.log("checkindata" ,checkindata);
                setCheckin(checkindata);
            })

            setOnRender(false);
        }
    }

    function CalenderFor(){
        return (
            <div>
                {

                    // <td className="Table-td" key={j}>{e.day}</td>
                }
            </div>
        )
    }


    let idx = 0;

    return(
        <div>
            <div className="Calender-top">
                <Button onClick={OnPrev} size="lg" variant="secondary">{'<'}</Button> 
                <div className="Calender-top-black">
                    <Alert variant="dark" >
                        <h4>{ curYear + ' / ' + (curMonth+1) }</h4>
                    </Alert>
                </div>
                <Button onClick={OnNext} size="lg" variant="secondary">{'>'}</Button> 
            </div>

            <div className="Calender">
                <table className="Table-border">
                    <thead>
                        <tr>
                            <th className="Table-th-sun">{Day[0]}</th>
                            <th className="Table-th">{Day[1]}</th>
                            <th className="Table-th">{Day[2]}</th>
                            <th className="Table-th">{Day[3]}</th>
                            <th className="Table-th">{Day[4]}</th>
                            <th className="Table-th">{Day[5]}</th>
                            <th className="Table-th-sat">{Day[6]}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            !onRender?(
                            dateList.map((week,i)=>{
                                
                                //console.log(week,i);
                                return(
                                    <tr key={i}> 
                                    {
                                        <DateBlock idx={idx++} week={week} checkin={checkin}></DateBlock>
                                        // week.map((e,j)=>{
                                        //     return(

                                        //         e.month==='cur'?
                                        //         <td className="Table-td" key={j}>{e.day}</td>:
                                        //         <td className="Table-td-noncur" key={j}>{e.day}</td>
                                        //     )
                                        // })
                                    }
                                    </tr>
                                )
                            })):null

                            // Week.map((e,i)=>{
                            //     return(
                            //         <tr key={i}> 
                            //         {
                            //             weekList.map((e,j)=>{
                            //                 return(
                            //                 <td className="Table-td" key={j}>{weekList[i].day}</td>
                            //                 )
                            //             })
                            //         }
                            //         </tr>
                            //     )
                            // })
                        }
                    </tbody>
                </table>
                
            </div> 

        </div>
    )
}

function DateBlock(props){
    let curweek = props.week;
    let checkin = props.checkin;
    if(checkin)
    return curweek.map((e,i)=>{
        let rt;
        let idx = (props.idx*7)+i;

        if(checkin.length>0 && checkin[idx].length>0)
        {
            if(e.month==='cur')
            {
                rt = <td className="Table-td" key={i}><CheckInButton text={e.day} checkin={checkin[idx]}/></td>;
            }
            else
            {
                rt = <td className="Table-td-noncur" key={i}><CheckInButton text={e.day} checkin={checkin[idx]}/></td>;
            }
        }
        else{
            if(e.month==='cur')
            {
                rt = <td className="Table-td" key={i}>{e.day}</td>;
            }
            else
            {
                rt = <td className="Table-td-noncur" key={i}>{e.day}</td>;
            }
        }

        return rt;
    })
}

function CheckInButton(props){
    let [userId,setUserId] = useState(sessionStorage.getItem('user_uid'));
    let checkin;
    checkin = props.checkin;
    let title = moment(checkin[0].date).format('YYYY-MM-DD') + ' / ' + checkin.length +'명'
    let variant = "secondary";
    if(checkin.filter(e=>e.uid == userId).length > 0)
        variant = "primary";
    return(
    <OverlayTrigger
      trigger="click"
      placement='bottom'
      overlay={
        <Popover id={`popover-positioned-bottom`}>
          <Popover.Header as="h3">{title}</Popover.Header>
          <Popover.Body>
            {
                checkin.map((e)=>{
                    return e.uid==userId?
                    <strong className='Table-td-p-user'>{e.name}</strong>:
                    <strong className='Table-td-p'>{e.name}</strong>
                })
            }
          </Popover.Body>
        </Popover>
      }

    >
      <Button variant={variant}>{props.text}</Button>
    </OverlayTrigger>
    )
}




export default Calender;