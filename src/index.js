import './assets/style.css';
import Icon from './assets/logo.png';

function component() {
  const element = document.createElement('div');
  element.innerHTML = 'Hello World';
  element.classList.add('hello');
  const myIcon = new Image();
  myIcon.src = Icon;
  element.appendChild(myIcon);

  return element;
}

document.body.appendChild(component());
