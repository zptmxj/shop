import {imagePath} from '../../../IP_PORT';

function NamePlate(props){

    let mem = props.mem;
    return(
        <div className='App-nameplate'>
            <img className='mr-1' src={ imagePath() + '/avatars/' + mem.path} width='25px' height='25px' />
            <p className='mb-0'>{mem.name}</p>
        </div>
    )
}

export default NamePlate;