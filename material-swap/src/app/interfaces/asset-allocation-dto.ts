export interface AssetAllocationDto {
  id?: number,
  percentage: number,
  buyValue: number,
  amount: number,
  asset: {
    id:number
  }
  strategy:{
    id:number
  }
}
