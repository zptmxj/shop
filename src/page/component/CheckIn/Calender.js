
import './Calender.scss';
import {Button,Alert,OverlayTrigger,Popover,Table,ListGroup} from 'react-bootstrap';
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
    let [selDay,setSelDay] = useState(0);
    let [userId,setUserId] = useState(sessionStorage.getItem('user_uid'));



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

        setSelDay(0);
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

        setSelDay(0);
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

    const onDateBlock = (n)=>
    {
        console.log('Calender_onDateBlock',n);
        setSelDay(n);
    }

    const timeDiff = (rowCheckin,rowCheckout)=>
    {
        let day1 = moment(rowCheckin,'hh:mm:ss');
        let day2 = moment(rowCheckout,'hh:mm:ss');
        if(day1 > day2)
        {
            day1 = moment('01 '+rowCheckin,'DD hh:mm:ss');
            day2 = moment('02 '+rowCheckout,'DD hh:mm:ss');
            console.log('day1 > day1');
        }
        return moment.duration(day2.diff(day1)).asMinutes();
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
                <table className="Cal-Table">
                    <thead>
                        <tr>
                            <th className="Cal-th-sun">{Day[0]}</th>
                            <th className="Cal-th" >{Day[1]}</th>
                            <th className="Cal-th" >{Day[2]}</th>
                            <th className="Cal-th" >{Day[3]}</th>
                            <th className="Cal-th" >{Day[4]}</th>
                            <th className="Cal-th">{Day[5]}</th>
                            <th className="Cal-th-sat">{Day[6]}</th>
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
                                        <DateBlock idx={idx++}  week={week} checkin={checkin} onCreate={onDateBlock}></DateBlock>
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
                            //                 <td className="Cal-td" key={j}>{weekList[i].day}</td>
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

            <div className="Calender-TableName">
                <ListGroup.Item>
                    {selDay != 0?(moment(checkin[selDay-1][0].date).format('YYYY-MM-DD') + ' / ' + checkin[selDay-1].length +'명'):'---'}
                </ListGroup.Item>
            </div> 

            <div className="Calender">
                <div className='Calender-CheckInList'>
                    <Table bordered hover>
                        <thead>
                            <tr>
                            <th>#</th>
                            <th>name</th>
                            <th>point</th>
                            <th>check-in</th>
                            <th>check-out</th>
                            </tr>
                        </thead>
                        {

                            (selDay!==0)?(
                                <tbody>
                                {
                                checkin[selDay-1].map((e,i)=>{
                                        let css = "Cal-td-p";
                                        if(e.uid == userId)
                                            css = "Cal-td-p-user";
                                        
                                        let minute = timeDiff(e.checkin,e.checkout);

                                        if(minute<120)
                                            css = "Cal-td-p-stopby";

                                        console.log('Calender_onDateBlock',css);

                                        return(
                                            <tr key ={i}>
                                                <td className={css}>{i+1}</td>
                                                <td className={css}>{e.name}</td>
                                                <td className={css}>{e.point}</td>
                                                <td className={css}>{e.checkin}</td>
                                                <td className={css}>{e.checkout}</td>
                                            </tr>
                                        )
                                    })
                                }
                                </tbody>
                            ):null
                        }
                    </Table>
                </div> 
            </div> 



        </div>
    )
}

function DateBlock(props){

    const timeDiff = (checkin,checkout)=>
    {
        let day1 = moment(checkin,'hh:mm:ss');
        let day2 = moment(checkout,'hh:mm:ss');
        if(day1 > day2)
        {
            day1 = moment('01 '+checkin,'DD hh:mm:ss');
            day2 = moment('02 '+checkout,'DD hh:mm:ss');
            console.log('day1 > day1');
        }
        return moment.duration(day2.diff(day1)).asMinutes();
    }
    const handleOnClick = (e,i) =>
    {
        console.log('DateBlock_handleOnClick',e,i);
        let idx = Number(e.target.value)+1;
        props.onCreate(idx);
    }

    let curweek = props.week;
    let checkin = props.checkin;
    let [userId,setUserId] = useState(sessionStorage.getItem('user_uid'));



    if(checkin)
    return curweek.map((e,i)=>{
        let rt;
        let idx = (props.idx*7)+i;

        if(checkin.length>0 && checkin[idx].length>0)
        {
            //let variant = "secondary";
            let variant = "dark";
            let user = checkin[idx].filter(e=>e.uid == userId);
            if(user.length > 0)
            {
                variant = "primary";
                if(timeDiff(user[0].checkin,user[0].checkout)<120)
                    variant = "secondary";
            }

            if(e.month==='cur')
            {
                rt = <td className="Cal-td" key={i}>
                <Button  value={idx} onClick={handleOnClick} variant={variant}>{e.day}</Button>
                </td>;
            }
            else
            {
                rt = <td className="Cal-td-noncur" key={i}>
                <Button  value={idx} onClick={handleOnClick} variant={variant}>{e.day}</Button>
                </td>;
            }
        }
        else{
            if(e.month==='cur')
            {
                rt = <td className="Cal-td" key={i}>{e.day}</td>;
            }
            else
            {
                rt = <td className="Cal-td-noncur" key={i}>{e.day}</td>;
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
    // return(
    // // <OverlayTrigger
    // //   trigger="click"
    // //   placement='bottom'
    // //   overlay={
    // //     <Popover id={`popover-positioned-bottom`}>
    // //       <Popover.Header as="h3">{title}</Popover.Header>
    // //       <Popover.Body>
    // //         {
    // //             checkin.map((e)=>{
    // //                 return e.uid==userId?
    // //                 <strong className='Cal-td-p-user'>{e.name}</strong>:
    // //                 <strong className='Cal-td-p'>{e.name}</strong>
    // //             })
    // //         }
    // //       </Popover.Body>
    // //     </Popover>
    // //   }

    // // >
    // //   <Button className='Cal-td-button' variant={variant}>{props.text}</Button>
    // // </OverlayTrigger>
    //     <Button className='Cal-td-button' onClick={()=>setSelDay(props.idx)} variant={variant}>{props.text}</Button>
    // )
}




export default Calender;