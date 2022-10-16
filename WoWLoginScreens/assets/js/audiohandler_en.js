let expansion = 9;

const expansionMap = [
    'Vanilla',
    'BurningCrusade',
    'WrathOfTheLichKing',
    'Cataclysm',
    'MistsOfPandaria',
    'WarlordsOfDraenor',
    'Legion',
    'BattleForAzeroth',
    'Shadowlands',
    'WrathOfTheLichKingClassic'
];

const audioPath = './assets/audio';
const videoPath = './assets/img/bg';
const logoPath = './assets/img/ui/logos';

const verMap = [
    'Version 1.12.1 (5875) (Release)',
    'Version 2.4.3 (8606) (Release)',
    'Version 3.3.5 (12340) (Release)',
    'Version 4.3.4 (15595) (Release x86)',
    'Version 5.4.8 (18414) (Release x86)',
    'Version 6.2.0 (20173) (Release x64)',
    'Version 7.3.5 (26365) (Release x64)',
    'Version 8.3.7 (35662) (Release x64)',
    'Version 9.0.1 (35944) (Release x64)',
    'Version 3.4.0 (46158) (Release x64)'
];

const dateMap = [
    'Sept 19 2006',
    'Jul 10 2008',
    'Jun 24 2010',
    'Feb 9 2011',
    'Jun 13 2014',
    'Jun 20 2015',
    'Apr 3 2018',
    'Aug 24 2020',
    'Oct 13 2020',
    'Oct 14 2022'
];

const buttonColorMap = [
    0,
    0,
    1,
    0,
    0,
    0,
    0,
    0,
    0,
    0
];

const copyMap = [
    2006,
    2008,
    2010,
    2011,
    2014,
    2015,
    2018,
    2020,
    2020,
    2022
];

const audio = new Audio();
const buttonAudio = new Audio();
let audioInitialPlayback = false;
let queuePos = null;
let disconnected = false;

function init()
{
    switchExpansion();
    window.addEventListener('click', waitForInteractionToPlayAudio);

    getPositionInQueue();
    setInterval(determineIfDisconnect, 8000);
}

function waitForInteractionToPlayAudio()
{
    if(!audioInitialPlayback)
    {
        buttonAudio.volume = 0.5;
        audio.volume = 0.5;
        audio.loop = true;
        audio.play();
        audioInitialPlayback = true;
    }
}

function determineIfDisconnect()
{
    if(!disconnected)
    {
        const rand = Math.random();
        if(rand < 0.75)
            getPositionInQueue();
    }
}

function getPositionInQueue()
{
    let number;
    if(queuePos === null)
    {    
        number = Math.floor(Math.random() * Math.floor(10000));
        queuePos = number;
    }
    else
    {
        number = Math.floor(queuePos - (Math.random() * Math.floor(15)));
        queuePos = number;

        if(queuePos < 3)
        {
            number = 0;
            queuePos = 0;
            doDisconnect();
        }
    }

    document.getElementById('queuePosition').innerHTML = 'Position in Queue: ' + number;
    getEstimatedTime(number)
}

function getEstimatedTime(qPos)
{
    const time = Math.floor(Math.floor(qPos * 2 * 3 * 2 + ((qPos * 2 * 3 * 3) - (qPos * 2 * 3 * 2)) * Math.random()) * 0.01);
    document.getElementById('queueTime').innerHTML = 'Estimated time: ' + time + ' min';
}

function doDisconnect()
{
    hideQueue();
    showDisconnect();
    playButtonAudio(1);
    disconnected = true;
    console.log("DC'd")
}

function manualChangeExpac()
{
    console.log("Changing xpac to: ");
    expansion += 1;
    if(expansion > 9)
        expansion = 0;

    const bg = document.getElementById('background');
    bg.muted = false;
    switchExpansion();
}

function switchExpansion()
{
    if(disconnected)
    {
        disconnected = false;
        hideQueue();
        showDisconnect();
    }
    queuePos = null;
    getPositionInQueue();
    const bg = document.getElementById('background');
    const bgWebM = bg.querySelector('source:nth-child(1)');
    const bgMp4 = bg.querySelector('source:nth-child(2)');
    const logo = document.getElementById('logo');
    const version = document.getElementById('buildVersion');
    const date = document.getElementById('buildDate');
    let copyright = document.getElementById('copyrightText');
    
    bg.pause();
    audio.pause();
    const expName = expansionMap[expansion];
    console.log(expName);
    audio.src = `${audioPath}/${expName}.ogg`;
    bgWebM.setAttribute('src', `${videoPath}/${expName}.webm`);
    bgMp4.setAttribute('src', `${videoPath}/${expName}.mp4`)
    logo.style.background = `url(${logoPath}/${expName}.png)`;
    version.textContent = verMap[expansion];
    date.textContent = dateMap[expansion];
    copyright.textContent = `Copyright 2004-${copyMap[expansion]} Blizzard Entertainment. All Right Reserved.`;
    setButtonColors(buttonColorMap[expansion]);
    
    bg.load();
    bg.play();
    audio.play();
    
}

function playButtonAudio(index)
{
    buttonAudio.pause();
    buttonAudio.time = 0;

    if(index === 0)
        buttonAudio.src = './assets/audio/ui/button_click.ogg';
    else
        buttonAudio.src = './assets/audio/ui/button_click_big.ogg';
    
    buttonAudio.play();
}

function hideQueue()
{
    const x = document.getElementById("queue");
    if(x.style.display === "none")
        x.style.display = "flex";
    else
        x.style.display = "none";
}

function showDisconnect()
{
    const x = document.getElementById("disconnectBox");
    if(x.style.display === "none")
        x.style.display = "flex";
    else
        x.style.display = "none";
}

function resetQueue()
{
    disconnected = false;
    showDisconnect();
    hideQueue();
}

function showSettings()
{
    const opt = document.getElementById("options");
    if(opt.style.display === "none")
    {
        opt.style.display = "flex";
    }
    else
    {
        opt.style.display = "none";
    }
}

function adjustVolume()
{
    const slider = document.getElementById("volumeSlider");
    const val = slider.value * 0.01;
    audio.volume = val;
    buttonAudio.volume = val;
    document.getElementById('background').volume = val;
}

function setButtonColors(index)
{
    const quitButton = document.getElementById("quitButton");
    const optButton = document.getElementById("optButton");
    const realmListButton = document.getElementById("realmListButton");
    const disconButton = document.getElementById("disconButton");
    switch(index)
    {
        case 0:
            quitButton.className = "button";
            optButton.className = "button";
            realmListButton.className = "button";
            disconButton.className = "button";
        break;

        case 1:
            quitButton.className = "button_b";
            optButton.className = "button_b";
            realmListButton.className = "button_b";
            disconButton.className = "button_b";
        break;
    }
}
