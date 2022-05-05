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
                <div >
                {
                    props.data.privilege===2?
                    <img className="list-img" src={sub_mg} />:
                    (props.data.privilege===3?
                    <img className="list-img" src={super_mg} />:
                    (props.data.privilege===4?
                    <img className="list-img" src={eng_mg} />:
                    null
                    ))
                }
                </div>
                <p className="list-black"> / </p>
                <p className="list-black">{ props.data.name}</p>
                <p className="list-black"> / </p>
                <div className="list-black">
                {
                    props.data.sex.data[0]?
                    <img className="list-img" src={img_girl}/>:
                    <img className="list-img" src={img_boy}/>
                }
                </div>
                <p className="list-black"> / </p>
                <p className="list-black">{ (props.Year+ 1) - (1900+props.data.age)}</p>
                <p className="list-black"> / </p>
                <p className="list-black">{ props.data.adddate.substr(0,10)}</p>

            </div>
        </div> 
    )
}

export default Member;