import "./App.css"

import axios from "axios"
import moment from "moment"
import React, { useEffect, useRef, useState } from "react"

import { Box, Grid, GridContent } from "./App.styled"
import { Coordinates, Daily, Hourly } from "./types"

function App() {
  const [location, setLocation] = useState<string>("Copenhagen")
  const [coordinates, setCoordinates] = useState<Coordinates>({
    lat: 55.6867243,
    lon: 12.5700724,
  })
  const [error, setError] = useState<boolean>(false)
  const [forecast, setForecast] = useState<number>(7)
  const [hourlyWeather, setHourlyWeather] = useState<Hourly[]>()
  const [dailyWeather, setDailyWeather] = useState<Daily[]>()
  const city = useRef<HTMLInputElement | null>(null)
  const days = useRef<HTMLInputElement | null>(null)

  const kelvinToCelcius = (value: number) => {
    return Math.round(value - 273.15)
  }

  const getCoordinates = () => {
    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${city.current?.value},{},{DK}&appid=${process.env.REACT_APP_API_KEY}`
      )
      .then((res) => {
        if (res.data.length && city.current?.value) {
          setCoordinates({ lat: res.data[0].lat, lon: res.data[0].lon })
          setLocation(city.current?.value)
          setError(false)
        } else {
          setError(true)
        }
      })
  }

  useEffect(() => {
    const getWeather = () => {
      axios
        .get(
          `https://api.openweathermap.org/data/3.0/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${process.env.REACT_APP_API_KEY}`
        )
        .then((res) => {
          setHourlyWeather(res.data.hourly)
          const daily: Daily[] = res.data.daily
          daily.length = Number(days.current?.value) || 7
          setDailyWeather(res.data.daily)
        })
    }

    getWeather()

    const interval = setInterval(() => {
      getWeather()
    }, 10000)

    return () => clearInterval(interval)
  }, [coordinates, forecast])

  return (
    <Grid>
      <GridContent>
        <Box direction="column">
          <Box direction="row" justify="center">
            {location.charAt(0).toUpperCase() + location.slice(1)}
          </Box>
          <Box direction="row" justify="center" padding="20px 0 20px 0">
            <input placeholder="Enter city" ref={city} />
            <input
              type="button"
              value="Get weather"
              onClick={() => getCoordinates()}
            />
          </Box>
          {!error ? (
            <>
              <Box direction="column">
                {hourlyWeather?.length &&
                  hourlyWeather.map(
                    (item, index) =>
                      moment.unix(item.dt).format("dddd") ===
                        moment().format("dddd") && (
                        <Box
                          direction="row"
                          justify="space-between"
                          key={index}
                        >
                          <span>{moment.unix(item.dt).format("HH:mm")}</span>
                          <span>{`${kelvinToCelcius(item.temp)} °C`}</span>
                        </Box>
                      )
                  )}
              </Box>
              <Box direction="row" justify="center" padding="40px 0 10px 0">
                <Box direction="row">
                  <input
                    type="number"
                    min="1"
                    max="8"
                    defaultValue={7}
                    ref={days}
                  />
                  <input
                    type="button"
                    value="day weather forecast"
                    onClick={() =>
                      setForecast(Number(days.current?.value) || 7)
                    }
                  />
                </Box>
              </Box>
              <Box direction="column">
                {dailyWeather?.length &&
                  dailyWeather.map((item, index) => (
                    <Box direction="row" justify="space-between" key={index}>
                      <span>{moment.unix(item.dt).format("dddd")}</span>
                      <span>{` ${kelvinToCelcius(
                        item.temp.min
                      )}°C - ${kelvinToCelcius(item.temp.max)} °C`}</span>
                    </Box>
                  ))}
              </Box>
            </>
          ) : (
            <h3>Something went wrong, try again.</h3>
          )}
        </Box>
      </GridContent>
    </Grid>
  )
}

export default App
