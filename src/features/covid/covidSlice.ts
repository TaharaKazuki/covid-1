import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { RootState } from '../../app/store'
import dataJson from './data.json'
import dataDailyJson from './dataDaily.json'

const apiUrl = 'https://covid19.mathdro.id/api'

type API_DATA = typeof dataJson
type API_DATA_DAILY = typeof dataDailyJson

type covidState = {
  data: API_DATA
  country: string
  dailyData: API_DATA_DAILY
}

const initialState: covidState = {
  data: {
    confirmed: {
      value: 10667217,
      detail: 'https://covid19.mathdro.id/api/confirmed'
    },
    recovered: {
      value: 5464367,
      detail: 'https://covid19.mathdro.id/api/recovered'
    },
    deaths: {
      value: 515646,
      detail: 'https://covid19.mathdro.id/api/deaths'
    },
    dailySummary: 'https://covid19.mathdro.id/api/daily',
    dailyTimeSeries: {
      pattern: 'https://covid19.mathdro.id/api/daily/[dateString]',
      example: 'https://covid19.mathdro.id/api/daily/2-14-2020'
    },
    image: 'https://covid19.mathdro.id/api/og',
    source: 'https://github.com/mathdroid/covid19',
    countries: 'https://covid19.mathdro.id/api/countries',
    countryDetail: {
      pattern: 'https://covid19.mathdro.id/api/countries/[country]',
      example: 'https://covid19.mathdro.id/api/countries/USA'
    },
    lastUpdate: '2020-07-02T02:33:53.000Z'
  },
  country: '',
  dailyData: [
    {
      totalConfirmed: 555,
      mainlandChina: 548,
      otherLocations: 7,
      deltaConfirmed: 0,
      totalRecovered: 0,
      confirmed: {
        total: 555,
        china: 548,
        outsideChina: 7
      },
      deltaConfirmedDetail: {
        total: 0,
        china: 0,
        outsideChina: 0
      },
      deaths: {
        total: 17,
        china: 17,
        outsideChina: 0
      },
      recovered: {
        total: 0,
        china: 0,
        outsideChina: 0
      },
      active: 0,
      deltaRecovered: 0,
      incidentRate: 0.44821646978651847,
      peopleTested: 0,
      reportDate: '2020-01-22'
    }
  ]
}

export const fetchAsyncGet = createAsyncThunk('covid/get', async () => {
  const { data } = await axios.get<API_DATA>(apiUrl)
  return data
})

export const fetchAsyncGetDaily = createAsyncThunk(
  'covid/getDaily',
  async () => {
    const { data } = await axios.get<API_DATA_DAILY>(`${apiUrl}/daily`)
    return data
  }
)

export const fetchAsyncGetCountry = createAsyncThunk(
  'covid/getCountry',
  async (country: string) => {
    const dynamicUrl = country ? `${apiUrl}/countries/${country}` : apiUrl
    const { data } = await axios.get<API_DATA>(dynamicUrl)
    return { data: data, country: country }
  }
)

const covidSlice = createSlice({
  name: 'covid',
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAsyncGet.fulfilled, (state, action) => {
      return {
        ...state,
        data: action.payload
      }
    })
    builder.addCase(fetchAsyncGetDaily.fulfilled, (state, action) => {
      return {
        ...state,
        dailyData: action.payload
      }
    })
    builder.addCase(fetchAsyncGetCountry.fulfilled, (state, action) => {
      return {
        ...state,
        data: action.payload.data,
        country: action.payload.country
      }
    })
  }
})

export const selectData = (state: RootState) => state.covid.data
export const selectDailyData = (state: RootState) => state.covid.dailyData
export const selectCountry = (state: RootState) => state.covid.country

export default covidSlice.reducer
