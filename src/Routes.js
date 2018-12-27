import React from "react";
import {BrowserRouter, Route, Switch } from "react-router-dom";
import asyncComponent from './AsyncComponent';

const AsyncHomePage = asyncComponent(() => import('./HomePage'));
const AsyncFindTimeSlots = asyncComponent(() => import('./FindTimeSlots'));
const AsyncViewCalendar = asyncComponent(() => import('./ViewCalendar'));
const AsyncViewSummary = asyncComponent(() => import('./ViewSummary'));
const AsyncUploadFiles = asyncComponent(() => import('./UploadFiles'));


export default () => 
<BrowserRouter>
    <Switch>
        <Route path='/' exact component={AsyncHomePage} />
        <Route path='/assign' exact component={AsyncFindTimeSlots} />
        <Route exact path='/prof' component={AsyncViewCalendar} />
        <Route path='/summary' exact component={AsyncViewSummary} />
        <Route path='/upload' exact component={AsyncUploadFiles} />
    </Switch>
</BrowserRouter>