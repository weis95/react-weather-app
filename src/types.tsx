
export interface Coordinates {
    lat: number
    lon: number
}
  
interface Weather {
    dt: number
}
  
export interface Daily extends Weather {
    temp: Temp
}

export  interface Hourly extends Weather {
    temp: number
}
  
interface Temp {
    min: number
    max: number
}