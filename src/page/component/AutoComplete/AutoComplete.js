//import Calender from './component/CheckIn/Calender';
import { FormControl,Dropdown,ToggleButton } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import './AutoComplete.scss';

function AutoComplete(props){

    const [results, setResult] = useState([]);
    const setValue = props.setValue;
    let value = props.value;
    let list = props.list;

    const onDropKeyPress = (e)=>{
        console.log('onDropKeyPress',e.key,e.target.id);
        if(e.type = 'keyDown')
        {
            if(e.target.id == "DropItme0" && e.key=="ArrowUp")
            {
                let element = document.getElementById('formUser');
                window.setTimeout(() => element.focus(), 0);
            }
        }
    }
    const oninputKeyPress = (e)=>{
        console.log('onDropKeyPress',e.key,e.target.id);
        if(e.type = 'keyDown')
        {
            if(e.key=="Enter")
            {
                let useridx = list.indexOf(value);
                console.log('Enter',useridx);
                if(useridx != -1)
                {
                    setResult([]);
                    props.onEnter(useridx);
                }
            }
            if(results.length>0 && e.key=="ArrowDown")
            {
                document.getElementById('DropItme0').focus();
            }
        }
    }

    const onItemSelect = (eventKey)=>{
        console.log('onItemSelect',eventKey);
        setValue(list[eventKey]);
        setResult([]);
    }

    const onDropTextChange = (e)=>{
        console.log('onDropTextChange',e.target.value);
        setValue(e.target.value);
        onSearch(e.target.value)
    }
    const onSearch = (indata) => {
        var results = list.filter(item => true === subMatchName(item, indata));
        setResult( results );
    };

    const subMatchName = (item, keyword) => {
        var keyLen = keyword.length;
        item = item.toLowerCase().substring(0, keyLen);
        if (keyword === "") return false;
        return item === keyword.toString().toLowerCase();
    };

    return(
        <>
        {
            <Dropdown show={results.length>0} onSelect={onItemSelect}>
                <FormControl  controlId="DropInput" placeholder={props.placeholder} value={value} onChange={onDropTextChange} onKeyDown={oninputKeyPress}/>
                <Dropdown.Menu onKeyDown={onDropKeyPress} >
                    {
                        (results.length>0)?list.map((e,i)=>
                        {
                            if(results.includes(e))
                            return(
                                <Dropdown.Item key={i} id={"DropItme"+i} eventKey={i} >{e}</Dropdown.Item>
                            )
                        }):null
                    }
                </Dropdown.Menu>
            </Dropdown>    
        }
        </>
    )
}

export default AutoComplete;