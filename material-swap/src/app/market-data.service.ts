import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpParams } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { environment } from 'src/environments/environment.development';
import { tap } from 'rxjs';
import { MarketResponse } from './interfaces/market-response';
import { ICoinApiData } from './interfaces/icoin-api-data';
import { IChartData } from './interfaces/ichart-data';
import { IPricingBackend } from './interfaces/ipricing-backend';

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
        //console.log(data);

      }));
  }

  //POST pricing nel backend
  saveDataBackend(data: ICoinApiData | ICoinApiData[]){
    const body = {
      pricingset: this.transformDataforBackend(this.transformDataforChart(data))
    }
    const url = environment.API_BACKEND+environment.POST_PRICING_BLOCK;
    console.log("body:", body)

    return this.http.post(url, body)
      .pipe(tap(res => {
        console.log("res:", res)
      }));
  }

  //ricevo dati di un PAIR di oggi
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

  //trasformo i dati per i grafici (partendo da res di coinAPI)
  transformDataforChart(data: ICoinApiData | ICoinApiData[]): IChartData | IChartData[] {
    if (Array.isArray(data)) {
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

  //trasformo da dati per chart a dati per backend
  transformDataforBackend(data: IChartData | IChartData[]): IPricingBackend | IPricingBackend[] {
    if (Array.isArray(data)) {
      const arrayPricingBackend: IPricingBackend[] = [];
      data.forEach(pricing => {
        const millisecondsDate = pricing.date;
        const date = new Date(millisecondsDate);
        const year = date.getFullYear();
        const month = String(date.getMonth()+1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const fullDate: string = `${year}-${month}-${day}`;

        const newPricing: IPricingBackend = {
          date: fullDate,
          open: pricing.open,
          high: pricing.high,
          low: pricing.low,
          close: pricing.close
        };
        arrayPricingBackend.push(newPricing);
      });
      return arrayPricingBackend;
    } else {
      const millisecondsDate = data.date;
      const date = new Date(millisecondsDate);
      const year = date.getFullYear();
      const month = String(date.getMonth()).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const fullDate: string = `${year}-${month}-${day}`;

      const newPricing: IPricingBackend = {
        date: fullDate,
        open: data.open,
        high: data.high,
        low: data.low,
        close: data.close
      };
      return newPricing;
    }
  }

  //trasformo da dati per backend a dati per chart
  transformDatafromBEforChart(data: IPricingBackend | IPricingBackend[]):IChartData | IChartData[] {
    if (Array.isArray(data)) {
      const arrayPricingForChart: IChartData[] = [];
      data.forEach(pricing => {
        const parts = pricing.date.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) -1;
        const day = parseInt(parts[2], 10);

        const dateMillisends = new Date(year, month, day).getTime();

        const newPricing: IChartData = {
          date: dateMillisends,
          open: pricing.open,
          high: pricing.high,
          low: pricing.low,
          close: pricing.close
        };

        arrayPricingForChart.push(newPricing);
      });
      return arrayPricingForChart;
    } else {
      const parts = data.date.split('-');
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10);
        const day = parseInt(parts[2], 10);

        const dateMillisends = new Date(year, month, day).getTime();

        const newPricing: IChartData = {
          date: dateMillisends,
          open: data.open,
          high: data.high,
          low: data.low,
          close: data.close
        };

        return newPricing;
    }
  }



}
