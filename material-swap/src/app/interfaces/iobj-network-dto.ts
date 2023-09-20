import { IAssetDto } from "./iasset-dto";

export interface IObjNetworkDto {
  id?:number,
  asset:IAssetDto | null,
  networkName:string,
  tokenAddress:string
}
