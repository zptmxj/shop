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

export let {setStoreMember} = member.actions

export default configureStore({
    reducer: { 
        member : member.reducer
    }
  }) 