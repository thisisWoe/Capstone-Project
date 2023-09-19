import { IAssetDto } from "./iasset-dto";

export interface IObjNetworkDto {
  id?:number,
  asset:IAssetDto,
  networkName:string,
  tokenAddress:string
}
