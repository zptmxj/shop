import './BoardGame.scss';
import React,{useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {Pagination,Button,Breadcrumb,Form,Col,Row } from 'react-bootstrap';
import {serverPath,imagePath} from '../IP_PORT';
import NamePlate from './component/NamePlate/NamePlate'
import AutoComplete from './component/AutoComplete/AutoComplete';
import {useDispatch, useSelector} from 'react-redux'

function BoardGame()
{
    let history = useHistory();
    const userData = useSelector((state)=>{return state.data});
    const member = useSelector((state)=>{return state.member});
    const [userId,setUserId] = useState(userData.uid);
    const [sel, setSel] = useState(0);
    const [games, setGames] = useState([]);
    const [ranks, setRanks] = useState([]);
    const [total, setTotal] = useState(-1);
    const [idx, setIdx] = useState(-1);
    const [picel, setPicel] = useState(-1);
    const [tap, setTap] = useState(0);
    const [modMember, setModMember] = useState([]);
    const [fromText, setFromText] = useState("");
    const [isFromEnter,setIsFromEnter] = useState(false);

    

    
    useEffect(()=>{
        console.log('useEffect', sel);

        if(total == -1)
        {
            fetch(serverPath()+"/out_gametotal",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('boardgame_total', json);
                setTotal(json[0]);
            })
        }

        if(modMember.length==0)
        {
            let mems = member.filter((e)=>{if(e.privilege>0 || e.uid == userId) return e});
            console.log("mems",mems);
            setModMember(mems);
        }

        if(games.length == 0)
        {
            let page = [sel*9,9];
            fetch(serverPath()+"/out_boardgame",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(page),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('out_boardgame', json);
                setGames(json);
            })
        }
    });

    const onFromEnterClick = ()=>{
        setIsFromEnter(true);
    }

    const onFromEnter = (idx)=>{
        // if(isAlert) return;
        let mem = modMember[idx];
        // setFromUser(mem);
        // setIsFromEnter(false);
    }

    const onClickGame = (picker,idx)=>{
        setPicel(picker);
        setIdx(idx);
    }

    const onTapSel = (idx)=>{
        setTap(idx);
    }


    return(
        <div>
            <div className="title">
                <h3> BoardGame </h3>
            </div>
            {
                idx==-1?
                <div>
                    <GameList callback={(i)=>onClickGame(i,i+(sel*9))} array={games} idx={0}/>
                    <div className="BoardGame-pag">
                        <MyPagination max={Math.ceil(total/9)} sel={sel} setValue={(idx)=>(setGames([]),setSel(idx-1))}/>
                    </div>
                </div>:
                <div>
                    <img src={imagePath()+"/images/"+games[picel].image} className="BoardGame-img-L p-0"/>
                    <h4 className="m-3">{games[picel].name}</h4>
                    <Button onClick={()=>{setIdx(-1);setTap(0);}}>Back</Button>
                    <Breadcrumb className="mx-4">
                        <Breadcrumb.Item  active={(tap == 0)} onClick={()=>onTapSel(0)}>랭킹</Breadcrumb.Item>
                        <Breadcrumb.Item  active={(tap == 1)} onClick={()=>onTapSel(1)}>기록</Breadcrumb.Item>
                    </Breadcrumb>
                    {
                    tap==0?
                    <div className="Attend-middle mb-5">
                        <table className='Attend-table'>
                            <thead>
                                <tr>
                                    <th className='Attend-th-20'></th>
                                    <th className='Attend-th-20'>랭킹</th>
                                    <th className='Attend-th-20'></th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className='Attend-tr'>
                                    <td className='Attend-td'>
                                    </td>
                                    <td className='Attend-td'>
                                        {
                                            ranks.map((e,i)=>{
                                                return(<NamePlate mem={e}/>);
                                            })
                                        }
                                    </td>
                                    <td className='Attend-td'>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>:
                    <div>
                        <Form.Group as={Row} controlId="formUser" className="mb-4">
                            <Form.Label column xs={3} className="px-0">
                            </Form.Label>
                            <Col xs={3} className='px-0'>
                                <AutoComplete list={modMember.map(e=>e.name)} value={fromText} setValue={setFromText} onEnter={onFromEnter} isEnter={isFromEnter} setIsEnter={setIsFromEnter} placeholder="이름.."/>
                            </Col>
                            <Col xs={1} className='px-0'>
                                
                            </Col>
                            <Col xs={3} className='px-0'>
                                <Button onClick={onFromEnterClick}>추가</Button>
                            </Col>
                        </Form.Group>
                    </div>
                    }
                </div>
            }
        </div> 
    )
}

function GameList(props)
{
    let array = props.array;
    let idx = props.idx;

    if(array.length>0)
    return (
        <div className="container mag-top">
            <div className="row">
                {
                    array.map((e,i)=>{
                        return(
                            <div key={i} className="col-4 pad-top-2 ">
                                <img onClick={()=>props.callback(i)} src={imagePath()+"/images/"+array[i].image} className="BoardGame-img p-0"/>
                                <h5 className="fs-my">{array[i].name}</h5>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )

}

function MyPagination(props)
{
    let max = props.max;
    let sel = props.sel;
    let isFirst = false;
    let isPrev = false;    
    let isLast = false;
    let isNext = false;
    let array = [];
    let rt = 0;

    const setArray =()=>{
        let limit = 2;
        for(let i = 0; i < max; i++)
        {
            if(sel < 3)
                rt = 4;
            else
                rt = sel+2;
    
            if(max>3 && max-3<sel) limit = max-(sel+1);
            if(i>sel-(5-limit))
                array.push({num:(i+1),active:(i==sel)});
    
            if(i == rt)
                i = max;
        }
        console.log(array);
    }
    
    setArray();

    const onFirst = ()=>{
        if(sel >0)
            props.setValue(1);
    }
    const onPrev = (e)=>{
        if(sel >0)
            props.setValue(sel);
    }
    const onNext = (e)=>{
        if(sel < (max-1))
            props.setValue(sel+2);
    }

    const onLast = ()=>{
        console.log("onLast",max)
        if(sel < (max-1))
            props.setValue(max);
    }

    const onTime = (e)=>{
        if(e.target.text != undefined)
        {
            console.log("onTime",sel,e.target.text)
            sel = Number(e.target.text);
            props.setValue(sel);
        }
    }

    return (
    <Pagination>
        <Pagination.First onClick={onFirst} disabled={isFirst}/>
        <Pagination.Prev onClick={onPrev} disabled={isPrev}/>
        <>
            {
               array.map((e,i)=>{
                return <Pagination.Item key={i} onClick={onTime} active={e.active}>{e.num}</Pagination.Item>
               })
            }
        </>
        <Pagination.Next onClick={onNext} disabled={isNext}/>
        <Pagination.Last onClick={onLast} disabled={isLast}/>
    </Pagination>)
}

export default BoardGame;