
import './MemberList.scss';
import Member from './component/Member/Member';
import { useEffect, useState } from 'react';
import serverIP from '../IP_PORT';
import {useDispatch, useSelector} from 'react-redux'
import {setStoreMember} from '../store'
import { useParams } from 'react-router-dom';



function MemberList(props)
{
    let {id} = useParams();
    console.log('useParams',id);

    let member = useSelector((state)=>{return state.member});
    let dispatch = useDispatch();

    let curDate = new Date();
    let Year = curDate.getFullYear();
    
    let [asset,setAsset] = useState([]);
    let [isInit,setIsInit] = useState(false);

    let listKey = 0;

    useEffect(()=>{
        console.log('useEffect',member);
        //console.log('MemberList',"MemberList_useEffect");

        if(member[0].activity[0]!==1)
        {
            let data={uid:"all",order:"SELECT * FROM (SELECT b.uid AS uid, b.name AS name, b.sex AS sex, b.age AS age, b.adddate AS adddate, b.privilege AS privilege, a.total_point AS total_point FROM asset a, member b WHERE a.uid=b.uid AND b.view = 1) a order by total_point DESC"};

            fetch(serverIP+"/out_custom",{
                method:"post",
                headers : {
                "content-type" : "application/json",
                },
                body : JSON.stringify(data),
            })
            .then((res)=>res.json())
            .then((json)=>{
                setAsset(json);
                console.log('dispatch',json);
            })
        }
    },[])

    return(
        <div>
        {
            <div>
                <div className="title">
                    <h3> Member List </h3>
                </div>   
            {
                asset.length>0?(
                asset.map((e,i)=>{
                    console.log('dispatch',e);
                    return(
                        <div key={i}>
                            <Member data={e} Year={Year} idx = {i+1}/>
                        </div>
                    )
                })):null
            }
            </div>
        }
        </div> 
    )
}

export default MemberList;
 