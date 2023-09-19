import { IObjNetworkDto } from "./iobj-network-dto";

export interface IAssetDto {
  id?:number,
  name:string,
  imgUrl:string,
  addresses:IObjNetworkDto[]
}
