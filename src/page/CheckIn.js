import './CheckIn.scss';
import Calender from './component/CheckIn/Calender';

function CheckIn(props)
{
    return(
        <div>
        {
            <div>
                <div className="title">
                    <h3> Check-In </h3>
                </div>   
                <Calender />
            </div>
        }
        </div> 
    )
}

export default CheckIn;