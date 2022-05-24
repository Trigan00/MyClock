const millisecondElement = document.querySelector('.millisecond');
const secondElement = document.querySelector('.second');
const minuteElement = document.querySelector('.minute');
const hourElement = document.querySelector('.hour');

const StartEl = document.querySelector('.Start');
const PauseEl = document.querySelector('.Stop');

let millisecond = 0, second = 0, minute = 0, hour = 0, interval
let keepGoing = false
let startDate

StartEl.addEventListener('click', () => {
        keepGoing = true     
        startDate = new Date();
        timer()    
})
PauseEl.addEventListener('click', () => {
    keepGoing = false
})
    
function timer(){
    
    millisecondElement.innerText = millisecond < 10 ? '0' + millisecond : millisecond
    secondElement.innerText = second < 10 ? '0' + second : second
    minuteElement.innerText = minute < 10 ? '0' + minute : minute
    hourElement.innerText = hour < 10 ? '0' + hour : hour

    let cdateObj = new Date();
    let time = (cdateObj.getTime() - startDate.getTime())

    millisecond = time % 1000;
    time -= millisecond;
    millisecond = Math.floor(millisecond / 10);
    time = Math.floor (time / 1000);

    second = time % 60;
    time -= second;
    time = Math.floor (time / 60);

    minute = time % 60;
    time -= minute;
    time = Math.floor (time/60);
    
    hour = time % 60;
    
    if(keepGoing){
        setTimeout(() => timer())  
    }
      
}