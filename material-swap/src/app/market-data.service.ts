import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.development';
import { tap } from 'rxjs';
import { MarketResponse } from './interfaces/market-response';
import { ICoinApiData } from './interfaces/icoin-api-data';
import { IChartData } from './interfaces/ichart-data';

@Injectable({
  providedIn: 'root'
})
export class MarketDataService {
  jwtHelper: JwtHelperService = new JwtHelperService();
  merketDataApi: string = environment.coinApi_url;
  slash: string = '/';

  constructor(private http: HttpClient, private router: Router) { }

  getDataBTC(coin1: string, coin2: string) {
    return this.http.get<ICoinApiData[]>(this.merketDataApi + coin1 + this.slash + coin2)
      .pipe(tap(data => {

        console.log("🚀 ~ file: market-data.service.ts:21 ~ MarketDataService ~ getDataBTC ~ data:", data)

        /*  asset_id_base:  "BTC"
            asset_id_quote: "USD"
            rate: 25706.38437426484
            time: "2023-09-07T11:28:00.0000000Z" */

        /* {
          "period_id": "1DAY",
          "length_seconds": 86400,
          "length_months": 0,
          "unit_count": 1,
          "unit_name": "day",
          "display_name": "1 Day"
        }, */
      }))
  }

  getPeriodData(coin1: string, coin2: string, startYYYY_MM_DD: string, endYYYY_MM_DD: string) {
    const params = new HttpParams()
      .set('period_id', '1DAY')
      .set('time_start', startYYYY_MM_DD + 'T00:00:00')
      .set('time_end', endYYYY_MM_DD + 'T00:00:00')


    const url = `${this.merketDataApi}${coin1}/${coin2}/history`;
    /* https://rest.coinapi.io/v1/exchangerate/BTC/USD/history?period_id=1DAY&time_start=10-09-202300:00:00&time_end=15-09-202300:00:00
    https://rest.coinapi.io/v1/exchangerate/BTC/USD/history?period_id=1DAY&time_start=2023-07-20T00:00:00&time_end=2023-09-07T00:00:00 */

    /* const headers = {
      'X-CoinAPI-Key': environment.api_key_coinApi,
    }; */
    return this.http.get<ICoinApiData[]>(url, { params })
      .pipe(tap(data => {
        console.log(data);

      }));
  }

  getDataNow(coin1: string, coin2: string) {
    const now = new Date();
    const year = now.getUTCFullYear();
    const month = String(now.getUTCMonth() + 1).padStart(2, '0');
    const day = String(now.getUTCDate()).padStart(2, '0');
    const dateNow = `${year}-${month}-${day}`;

    const tomorrow = new Date(now);
    tomorrow.setDate(now.getDate() + 1);
    const dayT = String(tomorrow.getUTCDate()).padStart(2, '0');
    const dateTomorrow = `${year}-${month}-${dayT}`;

    const params = new HttpParams()
      .set('period_id', '1DAY')
      .set('time_start', dateNow + 'T00:00:00')
      .set('time_end', dateTomorrow + 'T00:00:00')

    const url = `${this.merketDataApi}${coin1}/${coin2}/history`;

    return this.http.get<ICoinApiData[]>(url, { params })
      .pipe(tap(data => {
        console.log(data);
      }));

  }


  transformData(data: ICoinApiData | ICoinApiData[]): IChartData | IChartData[] {
    if (Array.isArray(data)) {
      console.log("data service:", data)
      console.log('è un array');

      const arrayTransformed: IChartData[] = [];
      data.forEach((objData) => {

        let toTransformDate0_1 = objData.time_period_start;
        let toTransformDate0_2 = new Date(toTransformDate0_1);
        let timeStampTransformed0_3 = toTransformDate0_2.getTime();

        const newObj: IChartData = {
          date: timeStampTransformed0_3,
          open: objData.rate_open,
          high: objData.rate_high,
          low: objData.rate_low,
          close: objData.rate_close
        }

        arrayTransformed.push(newObj);

      });
      return arrayTransformed;
    } else {
      console.log('non è un array');
      let toTransformDate0_1 = data.time_period_start;
      let toTransformDate0_2 = new Date(toTransformDate0_1);
      let timeStampTransformed0_3 = toTransformDate0_2.getTime();

      const newObj: IChartData = {
        date: timeStampTransformed0_3,
        open: data.rate_open,
        high: data.rate_high,
        low: data.rate_low,
        close: data.rate_close
      }
      return newObj;
    }
  }







}
