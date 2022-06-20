
import './MemberList.scss';
import Member from './component/Member/Member';
import { useEffect, useState } from 'react';
import serverIP from '../IP_PORT';
import {useDispatch, useSelector} from 'react-redux'
import {setStoreMember} from '../store'
import { useParams } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import img_male from './component/Member/male.png';
import img_female from './component/Member/female.png';


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
    const [asset,setAsset] = useState([]);
    const [isInit,setIsInit] = useState(false);
    const [avatars, setAvatars] = useState([]);

    const listKey = 0;

    useEffect(()=>{
        console.log('useEffect',member);
        //console.log('MemberList',"MemberList_useEffect");
        if(avatars.length == 0)
        {
            fetch(serverIP+"/out_allavatar",{
                method:"post",
                headers : {
                    "content-type" : "application/json",
                },
                body : JSON.stringify(),
            })
            .then((res)=>res.json())
            .then((json)=>{
                console.log('out_avatar', json);
                setAvatars(json);
            })
        }
        if(member[0].activity[0]!==1)
        {
            let data={uid:"all",order:"SELECT * FROM (SELECT b.idx As idx, b.uid AS uid, b.name AS name, b.sex AS sex, b.age AS age, b.adddate AS adddate, b.privilege AS privilege, a.avatar AS avatar, a.total_point AS total_point FROM asset a, member b WHERE a.uid=b.uid AND b.view = 1) a order by total_point DESC"};

            fetch(serverIP+"/out_custom",{
                method:"post",
                headers : {
                "content-type" : "application/json",
                },
                body : JSON.stringify(data),
            })
            .then((res)=>res.json())
            .then((json)=>{
                
                let asset = json.map((mem)=>{
                    let avatar = avatars.filter(e=>e.idx==mem.avatar);
                    let path = "m000.png";
                    if(avatar.length == 0 )
                    {
                        if(data.sex==1) path = "w000.png";
                        else path = "m000.png";
                    }
                    else{
                        path = avatar[0].path;
                    }
                    mem.path = path;
                    return mem;
                })
                
                setAsset(asset);
                console.log('setAsset',asset);
            })
        }

    },[])

    const setMemberSel = (idx,data)=>{
        console.log('setMemberSel',idx);
        setSelData(data);
        setSel(idx);
    }

    const setBackCallback = ()=>{
        console.log('setBackCallback');
        setSel(-1);
    }

    return(
        <div>
        {
            <div>
                <div className="title">
                    <h3> Member List </h3>
                </div>   
            {
                (asset.length>0 && sel<0)?(
                asset.map((e,i)=>{
                    //console.log('dispatch',e);
                    return(
                        <div key={i}>
                            <Member avatars={avatars} data={e} Year={Year} idx = {i+1} setMemberSel={(idx)=>setMemberSel(idx,e)}/>
                        </div>
                    )
                })):(sel>=0?<MemberStatus callback={setBackCallback} data={selData}/>:null)
            }
            </div>
        }
        </div> 
    )
}

function MemberStatus(props){
    let data = props.data;
    console.log('MemberStatus',data);
    let Year = new Date().getFullYear();
    let img = "http://168.126.179.44:3002/avatars/";
    let sex = "m/";
    let path = data.path;
    if(data.sex==1) sex="w/";
    img = img + sex + path;
    return(
        <>
            <table className="list-Table" >
                <tbody>
                    <tr>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                        <th className="list-th"></th>
                    </tr>
                    <tr>
                        <td className="list-td" rowspan={2} colSpan={2}>
                            <img src={img} width='90px' height='90px'/>
                        </td>
                        <td className="list-td" colSpan={2} onClick={()=>{props.setMemberSel(data.idx)}}>{ data.name }</td>
                        <td className="list-td">{((Year+1)-data.age)}</td>
                        <td className="list-td">{data.sex?
                            <img src={img_female} width='30px' height='30px'/>:
                            <img src={img_male} width='30px' height='30px'/>
                        }</td>
                    </tr>
                    <tr>
                        <td className="list-td" colSpan={2}>{"--"}</td>
                        <td className="list-td" colSpan={2}>{data.total_point+" TP"}</td>
                    </tr>
                    <tr>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                        <td className="list-th"></td>
                    </tr>
                </tbody>
            </table>
            <Button onClick={props.callback}>뒤로</Button>
        </>
    )
}




export default MemberList;
 