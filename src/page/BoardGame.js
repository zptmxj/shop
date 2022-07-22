import './BoardGame.scss';
import React,{useState,useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import {Pagination } from 'react-bootstrap';
import {serverPath} from '../IP_PORT';

function BoardGame()
{
    let history = useHistory();
    const [sel, setsel] = useState(0);
    const [games, setGames] = useState([]);
    const [total, setTotal] = useState(-1);

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

    return(
        <div>
            <div className="title">
                <h3> BoardGame </h3>
            </div>
            <GameList array={games} idx={0}/>
            <div className="BoardGame-pag">
                <MyPagination max={Math.ceil(total/9)} sel={sel} setValue={(idx)=>(setGames([]),setsel(idx-1))}/>
            </div>
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
                                <img src={"http://168.126.179.44:3002/images/"+array[i].image} className="BoardGame-img p-0"/>
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