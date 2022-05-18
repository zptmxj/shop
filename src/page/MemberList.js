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
    
    let [isInit,setIsInit] = useState(false);
    // let [member,setMember] = useState([{
    //     activity:[0],
    //     adddate:'',
    //     age:0,
    //     deldate:'',
    //     fingerkey:'',
    //     idx:0,
    //     name:'',
    //     nickname:'',
    //     privilege:0,
    //     pw:'',
    //     sex:[0],
    //     uid:'',
    // },{}]);

    let listKey = 0;

    useEffect(()=>{
        console.log('useEffect',member);
        //console.log('MemberList',"MemberList_useEffect");

        // if(member[0].activity[0]!==1)
        // {
        //   listKey = 0;
    
        //   fetch(serverIP+"/out_member",{
        //     method:"post",
        //     headers : {
        //       "content-type" : "application/json",
        //     },
        //     body : JSON.stringify(),
        //   })
        //   .then((res)=>res.json())
        //   .then((json)=>{
        //         console.log('멤버정보 불러오기',json);
        //         setMember(json);
        //         dispatch(setStoreMember(json));
        //         console.log('dispatch',test);
        //     })
        // }
    },[])

    return(
        <div>
        {
            <div>
            <h3> Member List </h3>
            {
                member!==undefined?(
                member.map((e,i)=>{
                    return(
                        <div key={i}>
                            {e.activity.data[0]? <Member data={e} Year={Year} idx = {++listKey}/>:null}
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
 