import {React, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyApp from './Create.jsx';
import AuthCallback from './smallScripts/AuthCallback.jsx';
import FAQPage from './subpages/FAQ.jsx';
import AdventurePage from './subpages/AdventurePage.jsx';
import Privacy from './subpages/privacy.jsx';
import Terms from './subpages/terms.jsx';
import ExplorePage from './subpages/ExplorePage.jsx';
import AccountPage from './subpages/AccountPage.jsx';
import Plans from './subpages/Plans.jsx';
import CreateWhich from './subpages/characterCreatePageItems/CreateWhich.jsx'
import CreateCharacter from './subpages/characterCreatePageItems/CreateCharacter.jsx'
import { SubscriptionProvider } from './subpages/AccountPageItems/SubscriptionContext'; // Import your SubscriptionProvider
import FarewellPage from './subpages/FarewellPage.jsx';


const Main = () => {
  const [user, setUser] = useState("local_player");
  return (
    <Router>
      <div>
        <Routes>
          <Route exact path="/" element={
            <SubscriptionProvider user={user}><ExplorePage user={user} setUser={setUser} /></SubscriptionProvider>}>
          </Route>
          
          <Route path="/faq" element={
          <SubscriptionProvider user={user}><FAQPage /></SubscriptionProvider>}></Route>
          
          {/*<Route path="/create" element={
            <SubscriptionProvider user={user}><CreateWhich user={user} setUser={setUser} /></SubscriptionProvider>}></Route> 

          <Route path="/create-character" element={
            <SubscriptionProvider user={user}><CreateCharacter user={user} setUser={setUser} /></SubscriptionProvider>}></Route>*/}
          
          <Route path="/privacy" element={
          <SubscriptionProvider user={user}><Privacy /></SubscriptionProvider>}></Route>
          
          <Route path="/terms" element={
          <SubscriptionProvider user={user}><Terms /></SubscriptionProvider>}></Route>
          
          <Route path="/plans" element={
          <SubscriptionProvider user={user}><FarewellPage user={user} setUser={setUser}/></SubscriptionProvider>}></Route>
          
          <Route path="/adventure/:paramID?/:isPublic?/:autoStart?" element={
          <SubscriptionProvider user={user}><AdventurePage user={user} setUser={setUser} /></SubscriptionProvider>}></Route>
          
          <Route exact path="/account" element={
          <SubscriptionProvider user={user}><AccountPage user={user} setUser={setUser} /></SubscriptionProvider>}></Route>
          
          <Route path="/create" element={
          <SubscriptionProvider user={user}><MyApp user={user} setUser={setUser} /></SubscriptionProvider>}></Route>
          {/* Add other routes as needed */}
        </Routes>
      </div>
    </Router>
  );
};

export default Main;
