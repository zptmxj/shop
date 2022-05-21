//import Calender from './component/CheckIn/Calender';
import { Form, ProgressBar} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import './Attend.scss';

function TestPage(props)
{
    let count = [1,2,3,4,5];
    const [data01, setData01] = useState('');
    const [data02, setData02] = useState('');
    const [checklist, setChecklist] = useState([false,false,false,false,false]);
    const [curlist, setCurlist] = useState([false,false,false,false,false]);
    const [refresh, setRefresh] = useState(false);

    useEffect(()=>{
        let tset = [false,false,false,false,false];
        let tset1 = tset.map(e=>e);
        
        setChecklist(tset);
        setCurlist(tset1);
        console.log('tset',tset);
        console.log('tset1',tset1);
    },[])

    const onChange01 = (e)=>{
        setData01(e.target.value);
    }
    const onClick01 = (e)=>{
        let rt = window.btoa(data01);
        console.log(rt);
    }

    const onChange02 = (e)=>{
        setData02(e.target.value);
    }
    const onClick02 = (e)=>{
        let rt = window.atob(data02);
        console.log(rt);
    }

    const onClickCheck = (e)=>{
        let checked = checklist;
        checked[e] = !checked[e];
        setChecklist(checked);
        console.log(checked);
        setRefresh(!refresh);
        console.log('checklist',checklist);
        console.log('curlist',curlist);

    }


    return(
        <div>
        {
            <div>
                <h3> TestPage </h3>

                <input value={data01} onChange={onChange01}/>
                <button onClick={onClick01}>data1</button>
                <input value={data02} onChange={onChange02}/>
                <button onClick={onClick02}>data2</button>
                <div>
                    {
                        console.log('rf')
                    }
                </div>
                <div>
                {
                    count.map((e,i)=>{
                        return(
                        <Form.Check key ={i} type='checkbox' id='rd1' onChange={()=>onClickCheck(i)} checked={checklist[i]}/>
                        )
                    })
                }
                </div>



            </div>
        }
        </div> 
    )
}

export default TestPage;