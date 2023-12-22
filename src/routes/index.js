import {Routes, Route } from 'react-router-dom';

import Home from '../pages/Home';
import SignIn from '../pages/SignIn';
import SignUp from '../pages/SignUp';
import Rank from '../pages/Rank';
import Profile from '../pages/Profile';
import Search from '../pages/Search';
import Month from '../pages/Month';
import ErrorPage from '../pages/ErrorPage';

export default function RoutesApp(){
    return(
        <Routes>
            <Route path='/' element={<Home/>}/>
            
            <Route path='/login' element={<SignIn/>}/>
            <Route path='/register' element={<SignUp/>}/>
            <Route path='/rank' element={<Rank/>}/>
            <Route path='/profile/:id' element={<Profile/>}/>
            <Route path='/search' element={<Search/>}/>
            <Route path='/month' element={<Month/>}/>

            <Route path='*' element={<ErrorPage/>}/>

            
        
        </Routes>
    )
}