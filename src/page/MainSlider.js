import show01 from './show01.jpg';
import show02 from './show02.jpg';
import show03 from './show03.jpg';
import { Carousel} from 'react-bootstrap';
import './MainSlider.scss';

function MainSlider(props)
{
    return(
        <div className="Main-slide">
            <Carousel>
                <Carousel.Item interval={8000}>
                    <img
                        className="Main-slide-img"
                        src={show01}
                        alt="First slide"
                    />
                    <Carousel.Caption>
                    <h3>First step means meeting.</h3>
                    <p >Every meeting has a meaning.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={8000}>
                    <img
                        className="Main-slide-img"
                        src={show02}
                        alt="Second slide"
                    />
                    <Carousel.Caption>
                    <h3 className="Main-slide-font">Two steps means pleasure.</h3>
                    <p className="Main-slide-font"> It's a great time to start with a little fun.</p>
                    </Carousel.Caption>
                </Carousel.Item>
                <Carousel.Item interval={8000}>
                    <img
                        className="Main-slide-img"
                        src={show03}
                        alt="Third slide"
                    />
                    <Carousel.Caption>
                    <h3>Third stage means memory.</h3>
                    <p>If it's good, it's a memory if it's bad, it's an experience.</p>
                    </Carousel.Caption>
                </Carousel.Item>
            </Carousel>
        </div>
    )
}

export default MainSlider;