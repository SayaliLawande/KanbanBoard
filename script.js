let addBtn = document.querySelector('.add_btn');
let modalCont = document.querySelector('.modal-cont');
let textAreaCont = document.querySelector('.textArea-cont');
let removeBtn = document.querySelector('.remove_btn');
let allPriorityColours = document.querySelectorAll('.priority-colour');
let mainContainer = document.querySelector('.main-container');
let toolboxColours = document.querySelectorAll('.colour');

let addTaskFlag = false;
let removeTaskFlag = false;
let modalPriorityColour = 'lightblue';
let ticketsArray = [];
let lockClass = 'fa-lock';
let unlockClass = 'fa-lock-open';

if(localStorage.getItem('tickets')){
    ticketsArray = JSON.parse(localStorage.getItem('tickets'));

    ticketsArray.forEach(function(ticket){
        createTicket(ticket.ticketColour,ticket.ticketTask,ticket.ticketID);
    })
}

for(let i=0;i<toolboxColours.length;i++){

    toolboxColours[i].addEventListener('click',function(){
        let selectedColourToolbox = toolboxColours[i].classList[0];
        let filteredTickets = ticketsArray.filter(function(ticket){
            return selectedColourToolbox === ticket.ticketColour
        })
        let allTickets = document.querySelectorAll('.ticket-cont');
        for(let i=0; i < allTickets.length; i++){
            allTickets[i].remove();
        }

        filteredTickets.forEach(function(filteredTicket){
            createTicket(filteredTicket.ticketColour,filteredTicket.ticketTask,filteredTicket.ticketID);
        })
    })

    toolboxColours[i].addEventListener('dblclick',function(){

            let allTickets = document.querySelectorAll('.ticket-cont');
            for(let i=0; i < allTickets.length; i++){
                allTickets[i].remove();
            }

            ticketsArray.forEach(function(ticketObj){
                createTicket(ticketObj.ticketColour,ticketObj.ticketTask,ticketObj.ticketID);
            })
        })
}

addBtn.addEventListener('click',function(){
    addTaskFlag = !addTaskFlag;
    if(addTaskFlag === false){
        modalCont.style.display = 'flex';
        mainContainer.style.display = 'none';

    }
    else{
        modalCont.style.display = 'none';
        mainContainer.style.display = 'flex';

    }
})

removeBtn.addEventListener('click',function(){
       removeTaskFlag = !removeTaskFlag;

       if(removeTaskFlag === true){
            alert("Remove Button Activated");
            removeBtn.style.color = 'red';
       }
       else{
            removeBtn.style.color = 'white';
       }
})

allPriorityColours.forEach(function(colourElm){
    colourElm.addEventListener('click',function(){
        allPriorityColours.forEach(function(priorityColourElm){
            priorityColourElm.classList.remove('active');
        })
        colourElm.classList.add('active');
        modalPriorityColour=colourElm.classList[0];
    })
})

modalCont.addEventListener('keydown', function(e){
       let key = e.key;
       console.log(key);

       if(key === 'Enter'){
            createTicket(modalPriorityColour,textAreaCont.value);
            modalCont.style.display = 'none';
            mainContainer.style.display = 'flex';
            textAreaCont.value = '';
       }
})

function createTicket(ticketColour, ticketTask, ticketID){
    let id = ticketID || shortid();
    let ticketCont = document.createElement('div');
    ticketCont.setAttribute('class','ticket-cont');
    ticketCont.style.backgroundColor = ticketColour;
    ticketCont.innerHTML = `
        <div class='ticket-colour'></div>
        <div class='ticket-id'>${id}</div>
        <div class='ticket-area'>${ticketTask}</div>
        <div class='ticket-lock'>
            <i class="fa-solid fa-lock"></i>
        </div>
    `

    mainContainer.appendChild(ticketCont);
    handleLock(ticketCont,id);
    handleColour(ticketCont,id);
    handleRemove(ticketCont,id);

    if(!ticketID) {
            ticketsArray.push({ticketColour, ticketTask, ticketID: id});
            localStorage.setItem('tickets',JSON.stringify(ticketsArray));
    }

    console.log(ticketsArray);
}

function handleLock(ticket,id){
    let ticketLockElm = ticket.querySelector('.ticket-lock');
    let ticketLockIcon = ticketLockElm.children[0];
    let ticketTaskArea = ticket.querySelector('.ticket-area');

    ticketLockIcon.addEventListener('click',function(){
        let ticketIdx = getTicketIdx(id);
        if(ticketLockIcon.classList.contains(lockClass)){
            ticketLockIcon.classList.add(unlockClass);
            ticketLockIcon.classList.remove(lockClass);
            ticketTaskArea.setAttribute('contenteditable',true);
        }
        else{
        ticketLockIcon.classList.add(lockClass);
        ticketLockIcon.classList.remove(unlockClass);
        ticketTaskArea.setAttribute('contenteditable',false);
        }

        ticketsArray[ticketIdx].ticketTask = ticketTaskArea.innerText;
    })
}

function handleColour(ticket,id){

}


//removal - we need event listener
//remove container from dom
//remove id from ticketsArray
function handleRemove(ticket, id){
    ticket.addEventListener('click',function(){
        if(!removeTaskFlag) return;
        ticket.remove();
        let idx = getTicketIdx(id);
        let del = ticketsArray.splice(idx,1);
        localStorage.setItem('tickets',JSON.stringify(ticketsArray));
        console.log("deleted" + del);
    })
}

function getTicketIdx(id){
    let ticket = ticketsArray.findIndex(function(e){
        return e.ticketID === id;
    })
    return ticket;
}


//localstorage is 5mb limit. It is available in the browser.