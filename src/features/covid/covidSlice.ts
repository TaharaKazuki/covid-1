import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

type covidState = {
  data: ''
}

const initialState: covidState = {
  data: ''
}

const covidSlice = createSlice({
  name: 'covid',
  initialState: initialState,
  reducers: {}
})

export default covidSlice
