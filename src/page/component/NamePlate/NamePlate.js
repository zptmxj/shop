import {imagePath} from '../../../IP_PORT';
import './NamePlate.scss';

function NamePlate(props){

    let mem = props.mem;
    let size = props.size;
    if(size == undefined) 
        size = `25px`;
    else
        size = `${size}px`;


    return(
        <div className='App-nameplate'>
            <img className='mr-1' src={ imagePath() + '/avatars/' + mem.path} width={size} height={size} />
            <p className='mb-0'>{mem.name}</p>
        </div>
    )
}

export default NamePlate;