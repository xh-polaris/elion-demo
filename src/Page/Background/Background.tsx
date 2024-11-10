import './Background.css';

export default function Background() {
  return (
    <div className="Background">
      <img src="images/icons/background-top.svg" alt="background-top" className="Background__top" />
      <img src="images/icons/background-bottom.svg" alt="background-bottom" className="Background__bottom" />
      <img src="images/icons/background-left-top.svg" alt="background-left-top" className="Background__left-top" />
      <img src="images/icons/background-right-bottom.svg" alt="background-right-bottom" className="Background__right-bottom" />
    </div>
  );
}
