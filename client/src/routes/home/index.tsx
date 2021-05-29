import { FunctionComponent, h } from 'preact';
import style from './style.css';

const Home: FunctionComponent = () => {
    return (
        <div class={style.home}>
            <h1>Home</h1>
            <p>This is the Home component.</p>
        </div>
    );
};

export default Home;
