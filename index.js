// import Data from './json.json' assert { type: 'json' };

// Calender Swaping Div
let calenderContent=document.getElementById('calenderContent')
let displayTimeDiv=document.getElementById('displayTimeDiv')
let calenderDiv=document.getElementById('calenderDiv')
let calDivs=document.querySelectorAll('.calDivs');

// Type Selector
let typeSelector=document.getElementById('typeSelector')

// Interval Selector
let selectInterval=document.getElementById('selectInterval')

// Days Limit Selector
let selectDaysLimit=document.getElementById('selectDaysLimit')

// Clock Limit Selector
let selectClockLimit=document.getElementById('selectClockLimit')

// Submit Button
let submitButton=document.getElementById('submitButton');

// selectHolidays
let selectHolidays=document.getElementById('selectHolidays')
let checkboxDiv=document.getElementById('checkboxDiv')
let holidaySelectable=0;

// Calender Component Divs
let yearDiv=document.getElementById('yearDiv');
let monthDiv=document.getElementById('monthDiv');
let dayDiv=document.getElementById('dayDiv');
let timeDiv=document.getElementById('timeDiv');

// Date Displaying Divs
let startingDateDiv=document.getElementById('endingDateDiv');
let endingDateDiv=document.getElementById('endingDateDiv');

let startYearDiv=document.getElementById('startYearDiv');
let startMonthDiv=document.getElementById('startMonthDiv');
let startDateDiv=document.getElementById('startDateDiv');
let startDayDiv=document.getElementById('startDayDiv');
let startTimeDiv=document.getElementById('startTimeDiv');

let endYearDiv=document.getElementById('endYearDiv');
let endMonthDiv=document.getElementById('endMonthDiv');
let endDateDiv=document.getElementById('endDateDiv');
let endDayDiv=document.getElementById('endDayDiv');

// Todays Date and Other Data
let Today=new Date(),currYear=Today.getFullYear();
let Years=[currYear,currYear+1,currYear+2,currYear+3,currYear+4,currYear+5]
let Months=["January","February","March","April","May","June","July","August","September","October","November","December"]
let DayNames=["Sun","Mon","Tue","Wed","Thur","Fri","Sat"]
let Time=[9,10,11,12,13,14,15,16,17]
let startAvailableTime=makeTimeMin("9:00").time;
let endAvailableTime=makeTimeMin("14:00").time;
let weekStartDay = 0;

// Calender States
let selectedYear;
let selectedMonth;
let selectedDate;
let seletedMode=1;
let timeInterval=makeTimeMin("00:36").time;
let daysLimit=10;
let clockLimit=10;
let startTime=null;
let endTime=null;

let startYear=null;
let endYear=null;
let startMonth=null;
let endMonth=null;
let startDate=null;
let endDate=null;
let startDay=null;
let endDay=null;
let startClock=null;
let endClock=null;
let pseudoEndClock=null;

let maxEndClockTime=null;
let firstBlockedDate=null;

// Month Div Buttons
let monthPreBtn=document.getElementById('monthPreBtn');
let monthCurrBtn=document.getElementById('monthCurrBtn');
let monthNextBtn=document.getElementById('monthNextBtn');

// Day Div Buttons
let dayPreBtn=document.getElementById('dayPreBtn');
let dayCurrBtn=document.getElementById('dayCurrBtn');
let dayNextBtn=document.getElementById('dayNextBtn');

// Time Div Buttons
let timePreBtn = document.getElementById('timePreBtn')
let timeCurrBtn = document.getElementById('timeCurrBtn')
let timeNextBtn = document.getElementById('timeNextBtn')

// Fetched Data
let fetchedData = null;
let generatedData=null;
let dataMonth=null;
let dataYear=null;
function dateToTime(hr,min){
    // console.log(hr,min)
    return parseInt(hr)*60+parseInt(min)
}

async function wholeFetch(){
    var startDateFull = '2023-01-01T00:00:00' 
    var endDateFull = '2025-12-31T23:59:59'  
    const url = 'https://script.google.com/macros/s/AKfycbwajwkQpXyaE3w3bmAcsNz_eahtj8CvIIwL4W5fapjY_Qb-ugdbjrAAfv44QZ5UxEw9/exec' + '?startDate=' + startDateFull + '&endDate=' + endDateFull + '&calendarId=be8bsuqm01i0m5uhec7dc07kbc@group.calendar.google.com' + '&createEvent=' + false + '&allDayEvent=' + false;
    // const url = './json.json';
    fetchedData=await fetch(url).then((response) => response.json())
        .then((json) =>{
            console.log("Fetched")
            // console.log(Data)
            // Data.forEach(e=>{
            //     console.log(e.start,"------",e.end)
            // })
            return json
            
        }
    )
    return url;
}

async function fetchData(startingTime,endingTime,query){
    console.log("Creating Data")
    dataMonth=selectedMonth;
    dataYear=selectedYear;

    let st=0,ed=fetchedData.length-1,stInd,edInd;
    // console.log(Data)
    while(st<=ed){
        let mid=(st+ed - (st+ed)%2)/2;
        let dtst=new Date(fetchedData[mid].start).getTime();
        let dted=new Date(fetchedData[mid].end).getTime();
        // console.log("st  ",st,ed)
        if(dtst>=startingTime && dted<=endingTime){
            ed=mid-1;
        }
        else if(dted<startingTime){
            st=mid+1;
        }
        else if(dtst>endingTime){
            ed=mid-1;
        }
        else{
            ed=mid-1;
        }
    }
    stInd=ed+1;
    st=0,ed=fetchedData.length-1;
    while(st<=ed){
        let mid=(st+ed - (st+ed)%2)/2;
        let dtst=new Date(fetchedData[mid].start).getTime();
        let dted=new Date(fetchedData[mid].end).getTime();
        // console.log("ed  ",st,ed)
        if(dtst>=startingTime && dted<=endingTime){
            st=mid+1;
        }
        else if(dted<startingTime){
            st=mid+1;
        }
        else if(dtst>endingTime){
            ed=mid-1;
        }
        else{
            st=mid+1;
        }
    }
    edInd=st-1;
    
    // console.log(stInd,edInd)
    let returnData={}
    for (let index = stInd; index <= edInd ; index++) {
        let stdate=new Date(fetchedData[index].start);
        let eddate=new Date(fetchedData[index].end);

        for (let dt = Math.max(new Date(stdate.getTime()-stdate%(24*60*60*1000)).getTime(),startingTime); dt <= Math.min(new Date(eddate.getTime()-eddate%(24*60*60*1000)).getTime(),endingTime-1); dt+=(24*60*60*1000)) {
            let dateStr=new Date(dt).toDateString();
            for (let t = startAvailableTime*60*1000; t <= endAvailableTime*60*1000; t+=timeInterval*60*1000){
                // console.log(new Date(stdate).toUTCString(),new Date(dt+t).toUTCString(),new Date(eddate).toUTCString());
                if(((stdate.getTime()+60*60*1000)<=dt+t && dt+t<(eddate.getTime()+60*60*1000)) || ((stdate.getTime()+60*60*1000)<(dt+t+timeInterval*60*1000) && (dt+t+timeInterval*60*1000)<=(eddate.getTime()+60*60*1000)) || ((stdate.getTime()+60*60*1000)>=(dt+t) && (dt+t+timeInterval*60*1000)>=(eddate.getTime()+60*60*1000))){
                    if(!returnData[dateStr])returnData[dateStr]=[]
                        returnData[dateStr].push(makeTimeStr(t/60000).str);
                }
            }
        }
    }

    if(query=='check'){
        if(Object.keys(returnData).length>0){
            console.log("Possible");
            return false;
        }
        else {
            console.log("not-Possible");

            return true
        }
        
    }
    // console.log(returnData)
    generatedData=returnData;
    
    return returnData;

                
}

// Small Functions
function makeTimeStr(time){
    return {hour:(time-time%60)/60,min:time%60,str:((time-time%60)/60).toString().padStart(2,'0')+':'+(time%60).toString().padStart(2,'0')}
}
function makeTimeMin(time){
    let tt=time.split(':')
    return {hour:parseInt(tt[0]),min:parseInt(tt[1]),time:parseInt(tt[0])*60+parseInt(tt[1])}
}

// ---------------------- YEAR SECTION ----------------------

// Function For Year Selection
function onClickYearCell(cell){
    // console.log(cell.innerHTML)
    selectedYear=cell.innerHTML;
    if(seletedMode==1 && startDate!=null && endDate==null){
        endYear=selectInterval;
    }
    else{
        startYear=selectedYear;
        startTime=null
        endTime=null
        startDate=null;
        startMonth=null;
        startClock=null;
        pseudoEndClock=null;
        endDate=null;
        endMonth=null;
        endClock=null;
        
    }
    makeMonthDiv();
    displayTime();
    calenderContent.style.left='-100%'
    calenderDiv.style.height=(calDivs[1].offsetHeight+20)+'px';

}

// Making Year Divs as Given in Years Array
function makeYearDiv(){
    yearDiv.innerHTML='';
    Years.forEach(e=>{
        let yearCell=document.createElement('div');
        yearCell.innerHTML=e;
        yearCell.className='yearCell';
        yearCell.onclick=()=>{
            onClickYearCell(yearCell)
        }
        yearDiv.appendChild(yearCell)
        if(startYear!=null && startYear==e)yearCell.classList.add('selectedYearCell')
    })
    calenderDiv.style.height=(calDivs[0].offsetHeight+20)+'px';
}

// ---------------------- MONTH SECTION ----------------------

// Adding Month Section Buttons
monthPreBtn.onclick=()=>{
    selectedYear--;
    monthCurrBtn.innerHTML=selectedYear;
    makeMonthDiv();
}
monthCurrBtn.onclick=()=>{
    makeYearDiv();
    calenderContent.style.left='0%'
    calenderDiv.style.height=(calDivs[0].offsetHeight+20)+'px';
}
monthNextBtn.onclick=()=>{
    selectedYear++;
    monthCurrBtn.innerHTML=selectedYear;
    makeMonthDiv();
}


// Function for Month Selection
function onClickMonthCell(month){
    selectedMonth=month
    if(seletedMode==1 && startTime!=null && endTime==null){
        endYear=selectedYear;
        endMonth=selectedMonth;
    }
    else{
        startYear=selectedYear;
        startMonth=selectedMonth;
        startTime=null
        endTime=null
        startDate=null;
        startClock=null;
        endDate=null;
        endClock=null;
        pseudoEndClock=null;
    }
    let newDate=new Date(Today);
    newDate.setMonth(selectedMonth);
    newDate.setFullYear(selectedYear);
    // console.log(newDate);
    makeDayDiv();
    calenderContent.style.left='-200%'
    calenderDiv.style.height=(calDivs[2].offsetHeight+20)+'px';
    displayTime();
}

// Making Month Divs as Given in the Months Array
function makeMonthDiv(){
    monthDiv.innerHTML='';
    monthCurrBtn.innerHTML=selectedYear
    // console.log(startMonth)
    Months.forEach((e,ind)=>{
        let monthCell=document.createElement('div');
        monthCell.innerHTML=e;
        monthCell.className='monthCell';
        var currMonth = new Date(selectedYear,ind+1,-1);
        if(currMonth<Today){
            monthCell.classList.add('pastMonths');
        }
        else{
            monthCell.onclick=()=>{
                onClickMonthCell(ind);
            }
        }
        monthDiv.appendChild(monthCell);        
        if(startMonth!=null && ind==startMonth && selectedYear==startYear){
            // console.log(ind,startMonth)
            monthCell.classList.add('selectedMonthCell')
        }

    })
    calenderDiv.style.height=(calDivs[1].offsetHeight+20)+'px';
}

// ---------------------- Days SECTION ----------------------
// Adding Day Section Buttons
dayPreBtn.onclick=()=>{
    selectedMonth--;
    if(selectedMonth==-1){
        selectedMonth=11;
        selectedYear--;
    }
    // dayCurrBtn.innerHTML=Months[selectedMonth]+" "+selectedYear;
    makeDayDiv()
}
dayCurrBtn.onclick=()=>{
    
    calenderContent.style.left='-100%'
    calenderDiv.style.height=(calDivs[1].offsetHeight+20)+'px';
}
dayNextBtn.onclick=()=>{
    selectedMonth++;
    if(selectedMonth==12){
        selectedMonth=0;
        selectedYear++;
    }
    // dayCurrBtn.innerHTML=Months[selectedMonth]+" "+selectedYear;
    makeDayDiv()
}

async function onClickDateCell(date,clickable){
    if((clickable==0 && holidaySelectable==0 && seletedMode!=2)|| document.getElementById(date.toISOString()).classList.contains('pastDays')){
        console.log("Nahi")
        return;
    }
    if(seletedMode==2){
        startYear=selectedYear;
        startMonth=selectedMonth;
        startDate=selectedDate;
        selectedDate=date.getDate();
        if(startTime && new Date(date).getTime()==new Date(startTime).getTime()){
            startTime=null;
            endTime=null;
            startDate=null;
            endDate=null;
            startDay=null;
            endDay=null;
            let prevCell=document.querySelector('.selectedDateCell')
            // console.log(prevCell)
            if(prevCell)prevCell.classList.remove('selectedDateCell','startingDateCell','endingDateCell')

        }
        else{
            let prevCell=document.querySelector('.selectedDateCell')
            if(prevCell)prevCell.classList.remove('selectedDateCell','startingDateCell','endingDateCell')

            startDate=selectedDate;
            endDate=selectedDate;
            startMonth=selectedMonth;
            endMonth=selectedMonth;
            startYear=selectedYear;
            endYear=selectedYear;
            startDay=date.getDay();
            endDay=date.getDay();

            document.getElementById(date.toISOString()).classList.add('selectedDateCell','startingDateCell','endingDateCell')

            try{
                document.getElementById('selectedDateCell').forEach(e=>e.classList.remove('selectedDateCell','startingDateCell','endingDateCell'))
            }catch(e){};
            startClock=null;
            pseudoEndClock=null;

            endClock=null;
            startTime=null;
            endTime=null;
            selectedDate=date.getDate();
            makeTimeDiv();
            calenderContent.style.left='-300%'  
            calenderDiv.style.height=(calDivs[3].offsetHeight+20)+'px';      
            
        }
    }
    else if(seletedMode==1){
        selectedDate=date.getDate();
        if(!startTime){
            startDay=date.getDay();
            startDate=selectedDate;
            startMonth=selectedMonth;
            startYear=selectedYear;    
            startTime=date;

            document.getElementById(date.toISOString()).classList.add('selectedDateCell','startingDateCell',"endingDateCell")
            for (let ind = new Date(date).getTime(); ind < new Date(selectedYear,selectedMonth+1,0).getTime(); ind+=(24*60*60*1000)) {
                if(document.getElementById(new Date(ind).toISOString()).classList.contains('partiallyFilledDateCell') || document.getElementById(new Date(ind).toISOString()).classList.contains('fullyFilledDateCell')){
                    firstBlockedDate=ind;
                    break
                }
            }
            
        }
        else if(!endTime){
            let st=new Date(startTime).getTime();
            let ed=new Date(date).getTime();
            if(ed==st){
                let cells=document.querySelectorAll('.dayCell')
                cells.forEach(e=>e.classList.remove('selectedDateCell','startingDateCell','endingDateCell','hoverDateCell'))
                startTime=null
                endTime=null
                startDate=null;
                endDate=null;
                startDay=null;
                endDay=null;
                firstBlockedDate=null;
                displayTime()
                return;
            }
            else if(Math.abs(ed-st)>=daysLimit*24*60*60*1000){
                endTime=null
                endDate=null;
                endDay=null;
                firstBlockedDate=null;
                startDay=date.getDay();
                startDate=selectedDate;
                startMonth=selectedMonth;
                startYear=selectedYear;    
                startTime=date;
                alert("Days Limit Exeed")
                makeDayDiv();
                displayTime()
                return;
            }
            else if(ed<st){
                endTime=startTime;
                startTime=date;
                endDay=startDay
                endDate=startDate
                endMonth=startMonth
                endYear=startYear
                startDay=date.getDay();
                startDate=selectedDate;
                startMonth=selectedMonth;
                startYear=selectedYear;  
                st=new Date(startTime).getTime();
                ed=new Date(endTime).getTime();
            }
            else{
                endTime=date;
                endDay=date.getDay();
                endDate=selectedDate;
                endMonth=selectedMonth;
                endYear=selectedYear;  
            }
            if(!(await fetchData(startTime.getTime(),new Date(new Date(endTime).getTime()+24*60*60*1000).getTime(),"check"))){
                alert('cant Select This Date');
                let cells=document.querySelectorAll('.dayCell')
                cells.forEach(e=>e.classList.remove('selectedDateCell','startingDateCell','endingDateCell','hoverDateCell'))
                startTime=null
                endTime=null
                startDate=null;
                endDate=null;
                startDay=null;
                endDay=null;
                firstBlockedDate=null;
                displayTime()
                return;
            } 

            let cells=document.querySelectorAll('.dayCell')
            // console.log(cells)
            cells.forEach(e=>{
                let dc=new Date(e.id).getTime();
                e.classList.remove('selectedDateCell','startingDateCell','endingDateCell','hoverDateCell')
                if(st<=dc && dc<=ed)
                    e.classList.add('selectedDateCell');
                if(dc==st)
                    e.classList.add('startingDateCell')
                if(dc==ed)
                    e.classList.add('endingDateCell')
            })

        }
        else{
            let cells=document.querySelectorAll('.selectedDateCell')
            cells.forEach(e=>e.classList.remove('selectedDateCell','startingDateCell','endingDateCell'))
            startTime=null
            endTime=null
            startDate=null;
            endDate=null;
            startDay=null;
            endDay=null;
            firstBlockedDate=null;
        }
        // var allSelected=document.querySelectorAll('.selectedDateCell')
        // // console.log(allSelected)
        // allSelected.forEach(e=>{
        //     e.classList.remove('startingDateCell','endingDateCell')
        // })
        // if(allSelected.length>0){
        //     allSelected[0].classList.add('startingDateCell')
        //     allSelected[allSelected.length-1].classList.add('endingDateCell')
        // }
    }
    displayTime()
}

function onMouseOverDayCell(date){
    // console.log("aya")
    if(seletedMode==2){
        document.getElementById(date.toISOString()).classList.add('hoverDateCell')
    }
    else if(seletedMode==1){
        if(!startTime){
            document.getElementById(date.toISOString()).classList.add('hoverDateCell')
        }
        else if(!endTime){
            let st=new Date(startTime).getTime();
            let ed=new Date(date).getTime();
            if(ed<st){
                let temp=st;
                st=ed;
                ed=temp;
            }
            if(ed-st >= daysLimit*24*60*60*1000){
                return;
            }
            
            let cells=document.querySelectorAll('.dayCell')
            // console.log(cells)
            let f=1;
            cells.forEach(e=>{
                let dc=new Date(e.id).getTime();
                if(st<=dc && dc<=ed){
                    if(e.classList.contains('partiallyFilledDateCell'))f=0;
                    e.classList.add('hoverDateCell');
                }
            })
            if(f==0){
                document.querySelectorAll(".hoverDateCell").forEach(e=>e.classList.remove("hoverDateCell"))
            }
        }
    }
}
function onMouseLeaveDayCell(date){
    document.querySelectorAll(".hoverDateCell").forEach(e=>e.classList.remove("hoverDateCell"))
    
}

async function makeDayDiv(){
    // console.log(selectedYear,selectedMonth)
    dayCurrBtn.innerHTML=Months[selectedMonth]+" "+selectedYear;
    let divStartDate = new Date(0);
    divStartDate.setYear(selectedYear)
    divStartDate.setMonth(selectedMonth)
    dayDiv.innerHTML='Loading';

    let OccupiedDays=(!(dataMonth==selectedMonth && dataYear==selectedYear)?await fetchData(new Date(selectedYear,selectedMonth).getTime(),new Date(selectedYear,selectedMonth+1).getTime()):generatedData);
    dayDiv.innerHTML='';

    for (let day = weekStartDay; day < weekStartDay+7; day++) {
        let dayTitle= document.createElement('div')
        dayTitle.innerHTML=DayNames[day%7];
        dayTitle.className='dayTitle';
        dayDiv.appendChild(dayTitle)
        
    }
    for (let wk = 0; wk < 6; wk++) {
        for (let day = weekStartDay; day < weekStartDay+7; day++) {
            let dayCell= document.createElement('div')
            dayCell.className='dayCell';
            dayDiv.appendChild(dayCell)
            if(divStartDate.getDay()==day%7 && divStartDate.getMonth()==selectedMonth){
                var clickable=1;
                dayCell.innerHTML=divStartDate.getDate();
                dayCell.id=divStartDate.toISOString();
                if(OccupiedDays[divStartDate.toDateString()]){
                    dayCell.classList.add('partiallyFilledDateCell')
                    clickable=0;
                }
                if((new Date(Today.toDateString()).getTime())>divStartDate.getTime()){
                    dayCell.classList.add('pastDays')
                }
                // console.log(new Date(startYear,startMonth,startDate).toDateString())
                if(startTime!=null && new Date(startYear,startMonth,startDate).toDateString()==divStartDate.toDateString()){
                    dayCell.classList.add('selectedDateCell')
                    dayCell.classList.add('startingDateCell')
                    if(endDate==null || seletedMode==2){
                        dayCell.classList.add('endingDateCell')
                    }
                }
                if(endDate!=null && (new Date(startYear,startMonth,startDate).getTime()<=divStartDate.getTime() && new Date(endTime).getTime()>=divStartDate.getTime())){
                    dayCell.classList.add('selectedDateCell')
                    if(new Date(endTime).getTime()==divStartDate.getTime()){
                        dayCell.classList.add('endingDateCell')
                    }
                }

                dayCell.onmouseover=function(divStartDate){
                    if(clickable){
                        return ()=>{
                            onMouseOverDayCell(divStartDate);
                        }
                    }
                }(divStartDate);
                dayCell.onmouseleave=function(divStartDate){
                    if(clickable){
                        return ()=>{
                            onMouseLeaveDayCell(divStartDate);
                        }
                    }    
                }(divStartDate);

                dayCell.onclick=function(divStartDate,clickable){
                    return ()=>{
                        onClickDateCell(divStartDate,clickable);
                    }
                }(divStartDate,clickable);

                divStartDate=new Date(divStartDate.getTime()+24*60*60*1000);
            }
            else{
                dayCell.innerHTML='';
            }
            dayDiv.appendChild(dayCell);
        }
    }
    // var allSelected=document.querySelectorAll('.selectedDateCell')
    // // console.log(allSelected)
    // if(allSelected.length>0){
    //     allSelected[0].classList.add('startingDateCell')
    //     allSelected[allSelected.length-1].classList.add('endingDateCell')
    // }
    calenderDiv.style.height=(calDivs[2].offsetHeight+20)+'px';
}

// ---------------------- TIME SECTION ----------------------
timePreBtn.onclick=()=>{
    let timeDate=new Date(0)
    timeDate.setFullYear(selectedYear);
    timeDate.setMonth(selectedMonth);
    timeDate.setDate(selectedDate-1);
    if(timeDate.getTime()<new Date(Today.toDateString()).getTime()){
        alert("Those are Past Days")
        return;
    }
    selectedYear=timeDate.getFullYear();
    selectedMonth=timeDate.getMonth();
    selectedDate=timeDate.getDate();
    // console.log(timeDate.toDateString())
    makeTimeDiv();
}
timeCurrBtn.onclick=()=>{
    makeDayDiv();
    calenderContent.style.left='-200%'
    calenderDiv.style.height=(calDivs[2].offsetHeight+20)+'px';
}
timeNextBtn.onclick=()=>{
    let timeDate=new Date(0)
    timeDate.setFullYear(selectedYear);
    timeDate.setMonth(selectedMonth);
    timeDate.setDate(selectedDate+1);
    selectedYear=timeDate.getFullYear();
    selectedMonth=timeDate.getMonth();
    selectedDate=timeDate.getDate();
    // console.log(timeDate.toDateString())
    makeTimeDiv()
}
function onClickTimeCell(time){
    if(selectedDate!=startDate || selectedMonth!=startMonth || selectedYear!=startYear){
        startTime=null
        endTime=null
        startClock=null
        pseudoEndClock=null;
        endClock=null
        makeTimeDiv();
    }
    // if(startTime!=null && !endTime){
    //     if(makeTimeMin(time).time==makeTimeMin(startClock).time){
    //         startTime=null
    //         endTime=null
    //         startClock=null
    //         pseudoEndClock=null;
    //         endClock=null
    //         maxEndClockTime=null;
    //         makeTimeDiv();
    //         displayTime();
    //         return;
    //     }
    //     else if(makeTimeMin(time).time<makeTimeMin(startClock).time){
    //         let timeCell=document.getElementById(startClock);
    //         timeCell.classList.remove('selectedTimeCell','startingTimeCell','endingTimeCell');
    //         startTime=null
    //         endTime=null
    //         startClock=null
    //         pseudoEndClock=null;
    //         endClock=null
    //         maxEndClockTime=null;
    //     }
    // }
    if(!startTime){
        let timeCell=document.getElementById(time);
        timeCell.classList.add('selectedTimeCell');
        let stdate=new Date(0);
        stdate.setFullYear(selectedYear);
        stdate.setMonth(selectedMonth);
        stdate=new Date(stdate.getTime()+((selectedDate-1)*24*60 + makeTimeMin(time).time)*60*1000);
        startClock=time;
        pseudoEndClock=makeTimeStr(makeTimeMin(time).time+timeInterval).str;
        startYear=selectedYear;
        startMonth=selectedMonth;
        startDate=selectedDate;
        startTime=stdate;
        // if(timeCell.classList.contains('lastCell')){
        //     stdate=new Date(stdate.getTime() + timeInterval*60*1000);
        //     endClock=makeTimeStr(makeTimeMin(time).time+timeInterval).str;
        //     endTime=stdate
        // }
    }
    else if(!endTime){
        if(makeTimeMin(time).time<makeTimeMin(startClock).time){
            endYear=startYear
            endMonth=startMonth
            endDate=startDate
            endTime=startTime
            endClock=makeTimeStr(makeTimeMin(startClock).time+timeInterval).str
            let stdate=new Date(0);
            stdate.setFullYear(selectedYear);
            stdate.setMonth(selectedMonth);
            stdate=new Date(stdate.getTime()+((selectedDate-1)*24*60 + makeTimeMin(time).time + timeInterval)*60*1000);
            startYear=selectedYear;
            startMonth=selectedMonth;
            startDate=selectedDate;
            startTime=stdate;
            startClock=time;
        }
        else if(makeTimeMin(time).time==makeTimeMin(startClock).time){
            startTime=null
            endTime=null
            startClock=null
            pseudoEndClock=null;
            endClock=null
            maxEndClockTime=null;
            makeTimeDiv();
            displayTime();
            return;
        }
        else{
            let stdate=new Date(0);
            stdate.setFullYear(selectedYear);
            stdate.setMonth(selectedMonth);
            stdate=new Date(stdate.getTime()+((selectedDate-1)*24*60 + makeTimeMin(time).time + timeInterval)*60*1000);
            endYear=selectedYear;
            endMonth=selectedMonth;
            endDate=selectedDate;
            endTime=stdate;
            endClock=makeTimeStr(makeTimeMin(time).time+timeInterval).str;
        }
        if(makeTimeMin(endClock).time-makeTimeMin(startClock).time>clockLimit*timeInterval){
            alert("Selected More time than set")
            endTime=null
            endClock=null
            maxEndClockTime=null;
            let timeCell=document.getElementById(time);
            timeCell.classList.add('selectedTimeCell');
            let stdate=new Date(0);
            stdate.setFullYear(selectedYear);
            stdate.setMonth(selectedMonth);
            stdate=new Date(stdate.getTime()+((selectedDate-1)*24*60 + makeTimeMin(time).time)*60*1000);
            startClock=time;
            pseudoEndClock=makeTimeStr(makeTimeMin(time).time+timeInterval).str;
            startYear=selectedYear;
            startMonth=selectedMonth;
            startDate=selectedDate;
            startTime=stdate;
            makeTimeDiv();
            displayTime();
            return;
        }
        var possible=1;
        for (let t = makeTimeMin(startClock).time; t < makeTimeMin(endClock).time; t+=timeInterval) {
            if(document.getElementById(makeTimeStr(t).str).classList.contains('occupiedTimeCell')){
                possible=0;
                break;
            }
            else{
                document.getElementById(makeTimeStr(t).str).classList.add('selectedTimeCell')
            }
        }
        // console.log(startClock,endClock);
        if(!possible){
            console.log("Not Possible")
            startTime=null
            endTime=null
            startClock=null
            pseudoEndClock=null;
            endClock=null
            maxEndClockTime=null;
            makeTimeDiv();
            return;
        }
    }
    else{
        startTime=null
        endTime=null
        startClock=null
        pseudoEndClock=null;
        endClock=null
        maxEndClockTime=null;
        makeTimeDiv();
    }
    var allTimeCells=document.querySelectorAll('.selectedTimeCell');
    allTimeCells.forEach(e=>{
        e.classList.remove('startingTimeCell','endingTimeCell')
    })
    if(allTimeCells.length>0){
        allTimeCells[0].classList.add('startingTimeCell');
        allTimeCells[allTimeCells.length-1].classList.add('endingTimeCell');
    }
    displayTime()
}

function onMouseOverTimeCell(date){
    console.log("aya")
    if(!startTime){
        document.getElementById(date).classList.add('hoverTimeCell')
    }
    else if(!endTime){
        let st=makeTimeMin(startClock).time;
        let ed=makeTimeMin(date).time;
        if(ed<st){
            let temp=st;
            st=ed;
            ed=temp;
        }
        if(ed-st >= clockLimit*timeInterval){
            return;
        }
        
        let cells=document.querySelectorAll('.timeCell')
        let f=1;
        cells.forEach(e=>{
            let dc=makeTimeMin(e.id).time;
            if(st<=dc && dc<=ed){
                if(e.classList.contains('occupiedTimeCell'))f=0;
                e.classList.add('hoverTimeCell');
            }
        })
        if(f==0){
            document.querySelectorAll(".hoverTimeCell").forEach(e=>e.classList.remove("hoverTimeCell"))
        }
        
    }
}

function onMouseLeaveTimeCell(){
    document.querySelectorAll(".hoverTimeCell").forEach(e=>e.classList.remove("hoverTimeCell"))
    
}

async function makeTimeDiv(){
    timeDiv.innerHTML='Loading';
    timeCurrBtn.innerHTML=selectedDate+" "+Months[selectedMonth]+" "+selectedYear;
    let OccupiedDays=(!(dataMonth==selectedMonth && dataYear==selectedYear)?await fetchData(new Date(selectedYear,selectedMonth).getTime(),new Date(selectedYear,selectedMonth+1).getTime()):generatedData);
    // console.log(OccupiedDays)
    timeDiv.innerHTML='';


    for (let t = startAvailableTime; t <= endAvailableTime; t+=timeInterval) {
        let clickable=1;
        let timeCell=document.createElement('div');
        let timejson=makeTimeStr(t)
        timeCell.innerHTML=timejson.str;
        timeCell.className='timeCell';
        timeCell.id=timejson.str;
        if(OccupiedDays[new Date(selectedYear,selectedMonth,selectedDate).toDateString()]){
            if(OccupiedDays[new Date(selectedYear,selectedMonth,selectedDate).toDateString()].includes(makeTimeStr(t).str)){
                timeCell.classList.add('occupiedTimeCell')
                clickable=0;
            }
        }
        timeCell.onclick=function(time){
            return ()=>{
                if(clickable)
                    onClickTimeCell(time);
                else console.log("UnClickable")
            }
        }(timejson.str);
        timeCell.onmouseover=function(time){
            return ()=>{
                if(clickable)
                onMouseOverTimeCell(time);
                // else console.log("UnClickable")
            }
        }(timejson.str);
        timeCell.onmouseleave=function(){
            return ()=>{
                if(clickable)
                    onMouseLeaveTimeCell();
            }
        }();
        if(selectedDate==startDate && selectedMonth==startMonth && selectedYear==startYear){
            if(startClock!=null && makeTimeMin(startClock).time==t){
                timeCell.classList.add('selectedTimeCell')
            }
            if(endClock!=null && (makeTimeMin(startClock).time<=t &&  t<makeTimeMin(endClock).time)){
                timeCell.classList.add('selectedTimeCell')
            }
        }
        timeDiv.appendChild(timeCell)
    }
    var allTimeCells=document.querySelectorAll('.timeCell');
    for (let ind = 0; ind < allTimeCells.length-1; ind++) {
        if(allTimeCells[ind+1].classList.contains('occupiedTimeCell') && !allTimeCells[ind].classList.contains('occupiedTimeCell')){
            allTimeCells[ind].classList.add('lastCell');
        }
    }
    var allTimeCells=document.querySelectorAll('.timeCell');
    if(allTimeCells.length>0){
        allTimeCells[allTimeCells.length-1].classList.add('lastCell');
    }
    var allSelectedTimeCells=document.querySelectorAll('.selectedTimeCell')
    if(allSelectedTimeCells.length>0){
        allSelectedTimeCells[0].classList.add('startingTimeCell')
        allSelectedTimeCells[allSelectedTimeCells.length-1].classList.add('endingTimeCell')
    }
    
    calenderDiv.style.height=(calDivs[3].offsetHeight+20)+'px';
}

// ---------------------- DATE BUTTONS ----------------------
startYearDiv.onclick=()=>{
    makeYearDiv()
    calenderContent.style.left='0%'
    calenderDiv.style.height=(calDivs[0].offsetHeight+20)+'px';
}

startMonthDiv.onclick=()=>{
    selectedYear=parseInt(startYearDiv.innerHTML);
    makeMonthDiv()
    calenderContent.style.left='-100%'
    calenderDiv.style.height=(calDivs[1].offsetHeight+20)+'px';
}
startDateDiv.onclick=()=>{
    selectedYear=parseInt(startYearDiv.innerHTML);
    Months.forEach((e,ind)=>{
        if(e.substring(0,3)==startMonthDiv.innerHTML){
            selectedMonth=ind;
        }
    })
    makeDayDiv();
    calenderContent.style.left='-200%'
    calenderDiv.style.height=(calDivs[2].offsetHeight+20)+'px';
}
startTimeDiv.onclick=()=>{
    selectedYear=parseInt(startYearDiv.innerHTML);
    Months.forEach((e,ind)=>{
        if(e.substring(0,3)==startMonthDiv.innerHTML){
            selectedMonth=ind;
        }
    })
    selectedDate=parseInt(startDateDiv.innerHTML);
    makeTimeDiv();
    calenderContent.style.left='-300%'
    calenderDiv.style.height=(calDivs[3].offsetHeight+20)+'px';

}

endYearDiv.onclick=()=>{
    makeYearDiv()
    calenderContent.style.left='0%'
    calenderDiv.style.height=(calDivs[0].offsetHeight+20)+'px';
}

endMonthDiv.onclick=()=>{
    selectedYear=parseInt(endYearDiv.innerHTML);
    makeMonthDiv()
    calenderContent.style.left='-100%'
    calenderDiv.style.height=(calDivs[1].offsetHeight+20)+'px';
}
endDateDiv.onclick=()=>{
    selectedYear=parseInt(endYearDiv.innerHTML);
    Months.forEach((e,ind)=>{
        if(e.substring(0,3)==endMonthDiv.innerHTML){
            selectedMonth=ind;
        }
    })
    makeDayDiv();
    calenderContent.style.left='-200%'
    calenderDiv.style.height=(calDivs[2].offsetHeight+20)+'px';
}

// ---------------------- TYPE & SUBMIT SECTION ----------------------

// Adding onChange on Type Selectorpre
typeSelector.onchange=()=>{
    resetCalender();
}
selectInterval.onchange=()=>{
    timeInterval=makeTimeMin(selectInterval.value).time;
    if(!timeInterval || timeInterval<=0)timeInterval=60;
    startTime=null
    endTime=null
    startClock=null
    pseudoEndClock=null;

    endClock=null
    dataMonth=null;
    makeTimeDiv();
    displayTime()
}

selectDaysLimit.onchange=()=>{
    if(selectDaysLimit.value<1)selectDaysLimit.value=1
    daysLimit=selectDaysLimit.value

}

selectClockLimit.onchange=()=>{
    if(selectClockLimit.value<1)selectClockLimit.value=1
    clockLimit=selectClockLimit.value
}


function printDate(date,st){
    return (date.getDate()+'-'+date.getMonth()+'-'+date.getFullYear())+(st?(' T '+st+':00'):'');
}
function displayTime(){
    displayTimeDiv.innerHTML=(startTime?printDate(startTime,startClock):'Start')+' - '+(startTime?printDate(endTime?endTime:startTime,endClock?endClock:pseudoEndClock):'End');
    startYearDiv.innerHTML=(startYear!=null?startYear:Today.getFullYear());

    startMonthDiv.innerHTML=Months[(startMonth!=null?startMonth:Today.getMonth())].substring(0,3);
    startDateDiv.innerHTML=(startDate!=null?startDate:Today.getDate());
    startDayDiv.innerHTML=DayNames[(startDate!=null?startDay:Today.getDay())];
    startTimeDiv.innerHTML=(startClock!=null?startClock:'00')+':00 - '+(startClock!=null?(endClock?endClock+':00':pseudoEndClock+':00'):'00:00');
    // endTimeDiv.innerHTML=;
    if(!startClock){
        startTimeDiv.style.display='none'
    }
    else{
        startTimeDiv.style.display='block'
    }

    endingDateDiv.style.display=((seletedMode==1 && endDate!=null)?'flex':'none')
    endYearDiv.innerHTML=(endYear!=null?endYear:startYear!=null?startYear:Today.getFullYear());
    endMonthDiv.innerHTML=Months[(endMonth!=null?endMonth:startMonth!=null?startMonth:Today.getMonth())].substring(0,3);
    endDateDiv.innerHTML=(endDate!=null?endDate:startDate!=null?startDate:Today.getDate());
    endDayDiv.innerHTML=DayNames[(endDate!=null?endDay:startDate!=null?startDay:Today.getDay())];

    startYearDiv.className=(startYear!=null?'activeDateBtn':'')+" dateDisplay"
    startMonthDiv.className=(startMonth!=null?'activeDateBtn':'')+" dateDisplay"
    startDateDiv.className=(startDate!=null?'activeDateBtn':'')+" dateDisplay"
    startDayDiv.className=(startDate!=null?'activeDateBtn':'')+" dateDisplay"
    startTimeDiv.className="activeDateBtn dateDisplay"

    endYearDiv.className=(startDate!=null && startYear!=endYear?'activeDateBtn':'')+" dateDisplay"
    endYearDiv.style.display=(startYear!=endYear?'inline-block':'none')
    endMonthDiv.className=(startDate!=null ?'activeDateBtn':'')+" dateDisplay"
    endMonthDiv.style.display=(!(startYear==endYear && startMonth==endMonth)?'inline-block':'none')
    endDateDiv.className=(startDate!=null ?'activeDateBtn':'')+" dateDisplay"
    endDayDiv.className=(startDate!=null ?'activeDateBtn':'')+" dateDisplay"
}

function resetCalender(){
    seletedMode=typeSelector.value;
    startTime=null
    endTime=null
    startDate=null;
    endDate=null;
    startMonth=null;
    endMonth=null;
    startYear=null;
    endYear=null;
    startClock=null
    pseudoEndClock=null;

    endClock=null
    holidaySelectable=0;
    selectHolidays.checked=false;
    dataMonth=null;
    checkboxDiv.style.display=(seletedMode==1)?'inline-block':'none';
    selectDaysLimit.style.display=(seletedMode==1)?'inline-block':'none';
    selectClockLimit.style.display=(seletedMode==2)?'inline-block':'none';
    selectInterval.style.display=(seletedMode==2)?'inline-block':'none';

    selectedYear=Today.getFullYear();
    makeMonthDiv()
    displayTime()
    calenderContent.style.left='-100%'
    calenderDiv.style.height=(calDivs[1].offsetHeight+20)+'px';
}

// ---------------------- TYPE & SUBMIT SECTION ----------------------

submitButton.onclick=()=>{
    // if(seletedMode==1){
    //     if(startDate!=null && startMonth!=null && startYear!=null){
    //         alert(`Single= ${startDate}-${startMonth+1}-${startYear}`)
    //         resetCalender();
    //     }
    //     else{
    //         alert("Not Suitable")
    //     }
    // }
    if(seletedMode==2){
        if(startClock!=null && startDate!=null && startMonth!=null && startYear!=null){
            alert(`Time Range= ${startDate}-${startMonth+1}-${startYear} T ${startClock}:00-${endClock!=null?endClock:pseudoEndClock}:00`)
            resetCalender();
        }
        else{
            alert("Not Suitable")
        }

    }
    if(seletedMode==1){
        if(startDate!=null && startMonth!=null && startYear!=null){
            alert(`Date Range= ${startDate}-${startMonth+1}-${startYear} <-> ${endDate!=null?endDate:startDate}-${(endDate!=null?endMonth:startMonth)+1}-${endDate!=null?endYear:startYear}`)
            resetCalender();
        }
        else{
            alert("Not Suitable")
        }

    }
}

selectHolidays.onchange=()=>{
    holidaySelectable^=1;
}

async function main(){
    yearDiv.innerHTML='Preparing'
    displayTime()
    wholeFetch().then(data=>{
        // console.log(data)
        typeSelector.disabled=false
        resetCalender()
    })
    
}
main()
