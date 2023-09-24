export interface AssetAllocationDto {
  id?: number,
  percentage: number,
  buyValue: number,
  amount: number,
  asset: {
    id:number,
    name?: string,
    imgUrl?: string,
  }
  strategy:{
    id:number
  }
}
