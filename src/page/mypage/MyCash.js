//import Calender from './component/CheckIn/Calender';
import { Form, ProgressBar, Button, Alert, ListGroup, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {serverPath} from '../../IP_PORT';
import moment from 'moment';
import './MyCash.scss';
import {useDispatch, useSelector} from 'react-redux'

function MyCash(props)
{
    
    let member = useSelector((state)=>{return state.member});
    let userData = useSelector((state)=>{return state.data});
    let [userId,setUserId] = useState(userData.uid);
    const [mycash, setMycash] = useState(0);
    const [historylist, setHistorylist] = useState([]);

    const [reqAtt, setReqAtt] = useState(false);

    const [workDay, setWorkDay] = useState(new Date());
    const [nonNext, setNonNext] = useState(false);

    useEffect(()=>{
        console.log('MyCash',"useEffect");
        let currentDay = workDay;  
        let theYear = currentDay.getFullYear();
        let theMonth = currentDay.getMonth();

        if(reqAtt==false) 
        {
            console.log('on /out_mycash');

            let startDay = new Date(theYear,theMonth,1);
            let endDay = new Date(theYear,theMonth+1,0);
            let daytoday = {uid:userId,sDay:startDay,eDay:endDay};

            console.log('daytoday',daytoday);

            let eDay = moment(workDay).format('YYYYMM');
            let dDay = moment(new Date()).format('YYYYMM');
            if(eDay==dDay) 
                setNonNext(true);
            else
                setNonNext(false);

            fetch(serverPath()+"/out_asset",{
                method:"post",
                headers : {
                "content-type" : "application/json",
                },
                body : JSON.stringify({uid:userId}),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('MyAsset',json.cash);
                setMycash(json[0].cash);

            });

            fetch(serverPath()+"/out_mycash",{
                method:"post",
                headers : {
                "content-type" : "application/json",
                },
                body : JSON.stringify(daytoday),
            })
            .then((res)=>res.json())
            .then((json)=>{
                setHistorylist(json);
                console.log('getMyCash',json);
            });
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

    return(
        <div>
        {
            <div>
                <div className="title">
                    <h3> MyCash </h3>
                </div>
                <div className="MyCash-top">
                    <ListGroup>
                        <ListGroup.Item>
                            MyCash :
                        </ListGroup.Item>
                    </ListGroup>
                    <ListGroup>
                        <ListGroup.Item>
                            {mycash + " ???"}
                        </ListGroup.Item>
                    </ListGroup>
                </div>

                <div className="MyCash-top">
                    <Button onClick={OnPrev} size="lg" variant="secondary">{'<'}</Button>
                    <div className="MyCash-top-black">
                        <Alert variant="dark" >
                            {
                                reqAtt?<h4>{moment(workDay).format('MM')+"???"}</h4>:null
                            }
                        </Alert>
                    </div>
                    {
                        nonNext?<Button onClick={OnNext} size="lg" variant="secondary" disabled>{'>'}</Button>: 
                        <Button onClick={OnNext} size="lg" variant="secondary">{'>'}</Button>
                    }
                </div>
                
                <Table bordered>
                    <thead>
                        <tr class="table-dark">
                            <th >#</th>
                            <th >??????</th>
                            <th >??????</th>
                            <th >??????</th>
                            <th >??????</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            historylist.map((e,i)=>{
                                let color = "table-danger";
                                let sign = "";
                                if(e.variance>0)
                                {
                                    sign = "+";
                                    color = "table-primary";
                                }
                                return(
                                    <tr class={color} key = {i} >
                                        <td >{i}</td>
                                        <td >{moment(e.useday).format('MM/DD')}</td>
                                        <HISTORY history={e.history}/>
                                        <td >{sign+e.variance}</td>
                                        <td >{e.cash}</td>
                                    </tr>
                                )
                            })
                        }

                    </tbody>
                </Table>
            </div>
        }
        </div> 
    )
}

function HISTORY(props)
{
    let string = props.history;
    if(string == "Check-In")
        string = "??????";
    else if(string == "Deposit")
        string = "??????";
    else if(string == "Balance")
        string = "??????";

    return (<td >{string}</td>);
}


export default MyCash;