import { NexusGenObjects } from "../nexus-typegen";
import { RESTDataSource } from 'apollo-datasource-rest';

import * as dotenv from "dotenv";
dotenv.config()

export class PollutionAPI extends RESTDataSource {
  constructor() {
    super();
    this.baseURL = 'http://api.openweathermap.org/data/2.5/';
  }

  async getPollution(coord: number[]) {
    const data = await this.get(`air_pollution?lat=${encodeURIComponent(coord[0])}&lon=${encodeURIComponent(coord[1])}&appid=${encodeURIComponent(process.env.API_KEY!)}`)
        .then(e => {return e});

    const condition: NexusGenObjects['Condition'] = {
      coord: coord,
      aqi: data.list[0].main.aqi,
      updatedAt: data.list[0].dt,
    };

    console.log("condition from dataSources.ts: ", condition);

    return condition;
  }
}
