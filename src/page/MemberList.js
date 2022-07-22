
import './MemberList.scss';
import Member from './component/Member/Member';
import MemberStatus from './component/Member/MemberStatus';
import { useEffect, useState } from 'react';
import {serverPath,imagePath} from '../IP_PORT';
import {useDispatch, useSelector} from 'react-redux'
import {setStoreMember} from '../store'
import { useParams } from 'react-router-dom';
import { Button,Modal,Form,Row,OverlayTrigger,Tooltip,Toast,ToastContainer } from 'react-bootstrap';
import img_male from './component/Member/male.png';
import img_female from './component/Member/female.png';
import up_mg from './component/Member/up.png';
import down_mg from './component/Member/down.png';


function MemberList(props)
{
    const {id} = useParams();
    console.log('useParams',id);


    const member = useSelector((state)=>{return state.member});
    const dispatch = useDispatch();

    const curDate = new Date();
    const Year = curDate.getFullYear();
    
    const [sel, setSel] = useState(-1);
    const [selData, setSelData] = useState();
    const [status, setStatus] = useState({
        series: [{
          name: 'Series 1',
          data: [0,0,0,0,0,0],
        }],
        options: {
            plotOptions: {
                radar: {
                  size: 70,
                  offsetX: 0,
                  offsetY: -5,
                  polygons: {
                    strokeColors: '#e8e8e8',
                    strokeWidth: 1,
                    connectorColors: '#e8e8e8',
                    fill: {
                      colors: undefined
                    }
                  }
                }
            },
            fill: {
                opacity: 0.3
            },
            chart: {
                redrawOnParentResize: true,
                type: 'radar',
                width: "100%",
                offsetX: 0,
                offsetY: 10,
                toolbar: {
                    show: false,
                },
            },
            title: {
                text: "Play style"   
            },
            yaxis: {
                show: false,
            },
            xaxis: {
                categories: ['추리', '역할', '전략', '조작', '민첩', '도박'],
                labels: {
                    show: true,
                    offsetX: 0,
                    offsetY: 5,
                    style: {
                        colors: ["#a8a8a8"],
                        fontSize: "10px",
                        fontFamily: 'Arial'
                    }
                }
            }
        },
       
    });
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
                console.log('status',status);

                if(sel!=-1)
                {
                    let sta = memlists[sel];
                    let ApexChart = {
                        ...status,
                        series:[{
                            name: member[sel].name,
                            data:[sta.rea,sta.role,sta.stra,sta.oper,sta.agil,sta.gamb]
                        }]
                    };
                    console.log('setMemberSel',ApexChart);
                    setStatus(ApexChart);
                }
            });
        }
        if(sel==-1)
        {
            window.scrollTo({top:scrollY,behavior:"instant"});
            //window.scrollTo(0,scrollY);
            console.log('window.scrollTo',scrollY);
        }
    })

    const setMemberSel = (idx,data)=>{
        console.log('setMemberSel',idx);
        let sta = allStatus[idx];
        let ApexChart = {
            ...status,
            series:[{
                name: member[idx].name,
                data:[sta.rea,sta.role,sta.stra,sta.oper,sta.agil,sta.gamb]
            }]
        };
        setStatus(ApexChart);
        setSelData(data);
        setSel(idx);
        setScrollY(window.scrollY);
        console.log('window.scrollY',window.scrollY);
    }

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
                    <h3> Member List </h3>
                </div>   
            {
                (member.length>0 && sel<0)?(
                member.map((e,i)=>{
                    //console.log('dispatch',e);
                    if(e.view==1)
                    return(
                        <div key={i}>
                            <Member data={e} Year={Year} num={++num} idx = {i+1} setMemberSel={()=>setMemberSel(i,e)}/>
                        </div>
                    )
                })):(sel>=0?<MemberStatus callback={setBackCallback} onSend={onSend} onCancel={onCancel} isButton={isButton} data={selData} status={status} />:null)
            }
            </div>
        }
        </div> 
    )
}



export default MemberList;
 