import React from "react";
import {BrowserRouter, Route, Switch } from "react-router-dom";
import asyncComponent from './AsyncComponent';

const AsyncHomePage = asyncComponent(() => import('./HomePage'));
const AsyncFindTimeSlots = asyncComponent(() => import('./Find_TimeSlots'));
const AsyncViewCalendar = asyncComponent(() => import('./View_Calendar'));
const AsyncViewSummary = asyncComponent(() => import('./View_Summary'));
const AsyncRoomUtil = asyncComponent(() => import('./Room_Util'));
const AsyncUploadFiles = asyncComponent(() => import('./Upload_Files'));
const AsyncRegisterUser = asyncComponent(() => import('./Register_User'));


export default () => 
<BrowserRouter>
    <Switch>
        <Route path='/' exact component={AsyncHomePage} />
        <Route path='/assign' exact component={AsyncFindTimeSlots} />
        <Route exact path='/prof' component={AsyncViewCalendar} />
        <Route path='/summary' exact component={AsyncViewSummary} />
        <Route path='/room' exact component={AsyncRoomUtil} />
        <Route path='/register' exact component={AsyncRegisterUser} />
        <Route path='/upload' exact component={AsyncUploadFiles} />
    </Switch>
</BrowserRouter>