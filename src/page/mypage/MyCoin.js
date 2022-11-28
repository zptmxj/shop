//import Calender from './component/CheckIn/Calender';
import Pagin from '../component/Pagin/Pagin';
import { Form, ProgressBar, Button, Alert, ListGroup, Table } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import {serverPath} from '../../IP_PORT';
import moment from 'moment';
import './MyCoin.scss';
import {useDispatch, useSelector} from 'react-redux'

function MyCoin(props)
{
    
    let member = useSelector((state)=>{return state.member});
    let userData = useSelector((state)=>{return state.data});
    let [userId,setUserId] = useState(userData.uid);
    const [myCoins, setMyCoins] = useState([]);
    const [historylist, setHistorylist] = useState([]);
    const [sel, setSel] = useState(0);

    const [reqAtt, setReqAtt] = useState(false);

    const [workDay, setWorkDay] = useState(new Date());
    const [nonNext, setNonNext] = useState(false);

    useEffect(()=>{
        console.log('MyCoin',"useEffect");
        let currentDay = workDay;  
        let theYear = currentDay.getFullYear();
        let theMonth = currentDay.getMonth();

        if(reqAtt==false) 
        {
            console.log('on /out_mycoin');

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

            fetch(serverPath()+"/out_coinassetall",{
                method:"post",
                headers : {
                "content-type" : "application/json",
                },
                body : JSON.stringify({uid:userId}),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('MyAsset',json);
                setMyCoins(json);

            });

            fetch(serverPath()+"/out_coinbuy",{
                method:"post",
                headers : {
                "content-type" : "application/json",
                },
                body : JSON.stringify(daytoday),
            })
            .then((res)=>res.json())
            .then((json)=>{
                setHistorylist(json);
                console.log('getMyCoin',json);
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
                    <h3> MyCoin </h3>
                </div>
                <div className="MyCoin-top mb-5">
                        <Table striped bordered hover className="MyCoin-width">
                            <thead>
                                <tr>
                                <th>#</th>
                                <th>코인명</th>
                                <th>보유 수</th>
                                <th>평단가</th>
                                </tr>
                            </thead>
                            {
                                (myCoins.length!==0)?(
                                    <tbody>
                                    {
                                        myCoins.map((e,i)=>{
                                            return(
                                                <tr key ={i}>
                                                    <td>{i}</td>
                                                    <td>{e.name}</td>
                                                    <td>{e.ea}</td>
                                                    <td>{e.average}</td>
                                                </tr>
                                            )
                                        })
                                    }
                                    </tbody>
                                ):null
                            }
                        </Table>
                </div>

                <div className="MyCoin-top">
                    <Button onClick={OnPrev} size="lg" variant="secondary">{'<'}</Button>
                    <div className="MyCoin-top-black">
                        <Alert variant="dark" >
                            {
                                reqAtt?<h4>{moment(workDay).format('MM')+"월"}</h4>:null
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
                            <th >날짜</th>
                            <th >코인명</th>
                            <th >변경</th>
                            <th >가격</th>
                            <th >평단가</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            historylist.map((e,i)=>{
                                if(i>(sel*50) && i < ((sel+1)*50))
                                {
                                    let color = "table-danger";
                                    let sign1 = "+";
                                    let sign2 = "-";
                                    if(e.isbuy==0)
                                    {
                                        sign1 = "-";
                                        sign2 = "+";
                                        color = "table-primary";
                                    }
                                    return(
                                        <tr class={color} key = {i} >
                                            <td >{moment(e.date).format('MM/DD')}</td>
                                            <td >{e.name}</td>
                                            <td >{sign1+e.variance}</td>
                                            <td >{sign2+e.bonusall}</td>
                                            <td >{e.bonusvar}</td>
                                        </tr>
                                    )
                                }
                            })
                        }
                    </tbody>
                </Table>
                <div className="MyCoin-top">
                    <Pagin max={Math.ceil(historylist.length/50)} sel={sel} setValue={(idx)=>(setSel(idx-1))}/>
                </div>
            </div>
        }
        </div> 
    )
}

function HISTORY(props)
{
    let string = props.isbuy;
    if(string == 1)
        string = "구매";
    else if(string == 0)
        string = "판매";

    return (<td >{string}</td>);
}


export default MyCoin;