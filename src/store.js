import {configureStore, createSlice} from '@reduxjs/toolkit'

let member = createSlice({
    name : 'memberlist',
    initialState : [],
    reducers : {
        setStoreMember(stage,action){
            console.log('memberlist', action.payload);
            return action.payload;
        }
    }
})

let nameplate = createSlice({
    name : 'platelist',
    initialState : [],
    reducers : {
        setStorePlate(stage,action){
            console.log('platelist', action.payload);
            return action.payload;
        }
    }
})

let userdata = createSlice({
    name : 'userData',
    initialState : [],
    reducers : {
        setStoreUserData(stage,action){
            console.log('userData', action.payload);
            return action.payload;
        }
    }
})




export let {setStoreMember} = member.actions

export let {setStorePlate} = nameplate.actions

export let {setStoreUserData} = userdata.actions


export default configureStore({
    reducer: { 
        member : member.reducer,
        plate : nameplate.reducer,
        data : userdata.reducer,
    }
}) 