import { AssetAllocationDto } from "./asset-allocation-dto"

export interface StrategyDto {
  id?: number,
  name:string,
  user: {
    publicKey:string
  },
  simulation: boolean,
  start:string,
  assetAllocations: AssetAllocationDto[]
}
