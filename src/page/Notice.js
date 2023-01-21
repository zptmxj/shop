import './Notice.scss';
import {Form,Col,Row,Table } from 'react-bootstrap';
import {serverPath,imagePath} from '../IP_PORT';
import { useEffect, useState } from 'react';
import {useDispatch, useSelector} from 'react-redux'


function Notice(props)
{
 
    let member = useSelector((state)=>{return state.member});
    const dispatch = useDispatch();

    const curDate = new Date();
    const Year = curDate.getFullYear();
    
    const [sel, setSel] = useState(-1);
    const [noticeList, setNoticeList] = useState();
    const [isButton,setIsButton] = useState(false);
    const [allStatus, setAllStatus] = useState([]);
    const [scrollY, setScrollY] = useState(0);


    useEffect(()=>{


        if(allStatus.length==0)
        {
            fetch(serverPath()+"/out_allstatus",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(),
            })
            .then((res)=>res.json())
            .then((all)=>{
                console.log('all',all);
                let memlists = member.map((e,i)=>{
                    let memlist = {targetuid:e.uid,rea:0,role:0,stra:0,oper:0,agil:0,gamb:0};
          
                    for(let j = 0 ; j<all.length;j++)
                    {  
                        if(member[i].uid==all[j].targetuid)
                        {
                            memlist.rea += all[j].rea;
                            memlist.role += all[j].role;
                            memlist.stra += all[j].stra;
                            memlist.oper += all[j].oper;
                            memlist.agil += all[j].agil;
                            memlist.gamb += all[j].gamb;
                        }
                    }
                    return memlist;
                })
                console.log('memlists_sel',memlists,sel);
                setAllStatus(memlists);

            });
        }
        if(sel==-1)
        {
            window.scrollTo({top:scrollY,behavior:"instant"});
            //window.scrollTo(0,scrollY);
            console.log('window.scrollTo',scrollY);
        }
        else
        {
            window.scrollTo({top:400,behavior:"instant"});
        }
    })

    const setBackCallback = ()=>{
        setIsButton(false);
        setSel(-1);
    }

    const onSend = ()=>{
        console.log('onSend');
        if(!isButton) setIsButton(true);
        else
        {
            setIsButton(false);
            setAllStatus([]);
        }
    }

    const onCancel = ()=>{
        console.log('onCancel');
        setIsButton(false)
    }

    let num = 0;
    return(
        <div >
        {
            <div id="scrollbar">
                <div className="title">
                    <h3> Notice </h3>
                </div>   

            </div>
        }
        </div> 
    )
}

export default Notice;
