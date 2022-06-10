
//Using Date object to get current Time
var date = new Date();

//Audio Object to play Alarm audio
var audio = new Audio("assets/alarm.mp3");
audio.loop = true;

//localList to fetch from  local storage at the beginnning
var localList = [];
localList.push(...JSON.parse(localStorage.getItem('alarms')));

//Getting variables to use;
var container = document.getElementById("container");
var set_btn = document.getElementById("set");
var current_time = document.getElementById("clock");
var hour_input = document.getElementById("hour");
var minute_input = document.getElementById("minute");
var second_input = document.getElementById("second");
var alarm_list_container = document.getElementById("alarm_list_container");
var stop_alarm = document.getElementById("stop");
var no_alarm = document.getElementById("no_alarm");
var clock_icon = document.getElementById("clock_icon");
var clear_all = document.getElementById("clear_all");


//Array to all Alarms Set By User
var alarmList = [];
if (localList.length != 0) {
    alarmList.push(...localList);
}

if (alarmList.length != 0) {
    no_alarm.classList.remove('invisible');
    clear_all.classList.remove('invisible');
}
displayNewAlarms();

//To have Clock current and actual time and update time at every Second;
setInterval(clock, 1000);

//Clock Function to change value of clock on each second and display Actual time
function clock() {
    var date = new Date();
    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();
    var format = convertMeridian(hour);
    if (hour > 12) {
        hour = convertHour(hour);
    }
    current_time.innerText = `${formatTime(hour)}:${formatTime(minute)}:${formatTime(second)}${format}`;

    //if current time matches any time in alarmList then call RingAlarm function
    if (alarmList.length >= 1) {
        if (alarmList.includes(current_time.innerText)) {
            ringAlarm(current_time.innerText);
            alarmList = alarmList.filter(v => v != current_time.innerText);
            localStorage.setItem('alarms', JSON.stringify(alarmList));
            removeAlarm(current_time.innerText);
            displayNewAlarms()
        }
    }
}

//To call Event on change to Set alarm
set_btn.addEventListener('click', setAlarm);

//To set Alarm
function setAlarm(e) {
    e.preventDefault();
    if (hour_input.value.length == 0 || minute_input.value.length == 0 || second_input.value.length == 0) {
        setAlarmFail("Invalid..!! Please fill the correct time!!!.");
        return;
    }
    var hour = formatTime(hour_input.value);
    var minute = formatTime(minute_input.value);
    var second = formatTime(second_input.value);
    var meridian = document.querySelector('input[name="language"]:checked').value;

    //Condition for Invalid value while setting Alarm
    if (isNaN(hour) || isNaN(second) || isNaN(minute) || hour > 12 || minute > 59 || second > 59 || hour < 0 || minute < 0 || second < 0) {
        setAlarmFail("Invalid Alarm Time!! Please Enter Again");
        return;
    }

    var date = new Date();
    var currentHour = date.getHours();
    var currentMinute = date.getMinutes();
    var currentSecond = date.getSeconds();

    var str = `${hour}:${minute}:${second}${meridian}`;
    //Check if the alarm set exist already in alarmList
    if (alarmList.includes(str)) {
        setAlarmFail(`Alarm for ${str} is already set!`);
        return;
    }

    //If the time set is valid
    alarmList.push(str);
    localStorage.setItem('alarms', JSON.stringify(alarmList));
    displayAlarms(str);
    no_alarm.classList.remove('invisible');
    clear_all.classList.remove('invisible');
    setAlarmFail(`Alarm set Successfully for ${hour}:${minute}:${second}`);
}


//displayAlarms to display after setting new Alarm
function displayAlarms(newAlarm) {
    var val = `
    <li class="display_alarms">
    <i class="fa fa-clock-o fa-2x"></i>
    <p class="alarm_time">${newAlarm}</p>
    <button class="delete" onclick="removeAlarm(this.value)" value=${newAlarm} ><i   class="fa fa-trash fa-2x "></i></button>
    </li>`;
    alarm_list_container.innerHTML += val;

}

//DeleteAlarm function to delete Alarm on event click
alarm_list_container.addEventListener('click', function deleteAlarm(e) {
    if (e.target.classList.contains('fa-trash')) {
        var v = parseInt(e.target.parentElement.children[0].innerText);
        e.target.parentElement.parentElement.remove();
        removeAlarm(v);
        alert("Alarm Removed Successfully");
    }
});


//Remove selected alarm from alarmList array
function removeAlarm(v) {
    alarmList = alarmList.filter(value => value != v);
    localStorage.setItem('alarms', JSON.stringify(alarmList));
    if (alarmList.length == 0) {
        no_alarm.classList.add("invisible");
        clear_all.classList.add('invisible');
    }
}

//New Display function based on alarmLIst array to display the new alarm list after alarm rang
function displayNewAlarms() {
    var str = "";
    for (var i = 0; i < alarmList.length; i++) {
        str += `<li class="display_alarms">
        <i class="fa fa-clock-o fa-2x"></i>
       <p class="alarm_time">${alarmList[i]}</p>
       <button class="delete" onclick="removeAlarm(this.value)" value=${alarmList[i]} ><i class="fa fa-trash fa-2x "></i></button>
       </li>`
    }
    alarm_list_container.innerHTML = str;
}

//function to show alert message on invalid alarm time 
function setAlarmFail(str) {
    alert(str);
    hour_input.value = '';
    minute_input.value = '';
    second_input.value = '';
}

//To clear All the alarms on click on Clear All Button;
clear_all.addEventListener('click', clearAll);
function clearAll() {
    alarmList = [];
    localStorage.setItem('alarms', JSON.stringify(alarmList));
    displayNewAlarms();
    if (alarmList == 0) {
        no_alarm.classList.add('invisible');
        clear_all.classList.add('invisible');
    }
}

//Convert from 24hour format to 12hour format
function convertHour(hour) {
    if (hour == 24) {
        return 0;
    }
    return Math.abs(hour - 12);
}

//Convert AM PM depending upon the hour
function convertMeridian(hour) {
    if (hour >= 12) {
        return "PM";
    }
    return "AM";
}

//Animation add to the clock_icon to the top
function clockAnimationAdd() {
    clock_icon.classList.add('ringing');
    container.classList.add('colors');
}

//Animation remove on stop button
function clockAnimationRemove() {
    clock_icon.classList.remove("ringing");
    container.classList.remove("colors");
}

//Add zero if it has one digit value
function formatTime(currentTime) {
    var str = currentTime + "";
    if (currentTime.length == 2) {
        return currentTime;
    }
    if (currentTime < 10 && currentTime > 0) {
        return "0" + currentTime;
    } else if (currentTime == 0) {
        return "00";
    }
    return currentTime;
}

//ringAlarm function to play music on alarm
function ringAlarm() {
    audio.play();
    clockAnimationAdd();
}

//stop Alarm from ringing;
stop_alarm.addEventListener("click", stopAlarm);
function stopAlarm() {
    audio.pause();
    clockAnimationRemove();
}
