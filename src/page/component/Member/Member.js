import './Member.css';
import img_boy from './icon-boy.png';
import img_girl from './icon-girl.png';
import super_mg from './super-mg.png';
import sub_mg from './sub-mg.png';
import eng_mg from './eng-mg.png';

function Member(props)
{
    return(
        <div className="list">
            <div className="list-line">
                <p className="list-black">{props.idx}</p>
                <div className="list-img">
                {
                    props.data.privilege===2?
                    <img src={sub_mg} width='25px' height='25px'/>:
                    (props.data.privilege===3?
                    <img src={super_mg} width='25px' height='25px'/>:
                    (props.data.privilege===4?
                    <img src={eng_mg} width='25px' height='25px'/>:
                    null
                    ))
                }
                </div>
                <p> / </p>
                <p className="list-black">{ props.data.name}</p>
                <p> / </p>
                <div className="list-black">
                {
                    props.data.sex.data[0]?
                    <img src={img_girl} width='30px' height='30px'/>:
                    <img src={img_boy} width='30px' height='30px'/>
                }
                </div>
                <p> / </p>
                <p className="list-black">{ (props.Year+ 1) - (1900+props.data.age)}</p>
                <p> / </p>
                <p className="list-black">{ props.data.adddate.substr(0,10)}</p>

            </div>
        </div> 
    )
}

export default Member;