import './MainShortcuts.scss';
import { Carousel} from 'react-bootstrap';
import {serverPath,imagePath,vcoinPath} from '../IP_PORT';
import React,{useState,useEffect} from 'react';

function MainShortcuts(props)
{
    const [shortcutImgs] = useState([[{idx:1,path:imagePath()+"/mine/mine1-1.png"},{idx:2,path:imagePath()+"/mine/mine1-2.png"},{idx:3,path:imagePath()+"/mine/mine1-3.png"},{idx:4,path:imagePath()+"/mine/mine1-4.png"},{idx:5,path:imagePath()+"/mine/mine1-5.png"}]]);


    return(
        <div className="Main-Shortcuts">
            <img className="Main-Shortcuts-img p-1 m-1" onClick={()=>{}} src={shortcutImgs[0][0].path} />
        </div>
    )
}

export default MainShortcuts;