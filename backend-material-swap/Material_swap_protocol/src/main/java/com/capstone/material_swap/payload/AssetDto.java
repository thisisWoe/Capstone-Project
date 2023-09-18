package com.capstone.material_swap.payload;

import java.util.Set;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AssetDto {

	private Long id;

	private String name;

	private String imgUrl;

	private Set<ObjNetworkDto> addresses;
	
//	public String addAssetToAddresses(ObjNetwork network) {
//		if (this.addresses == null) {
//			this.addresses = new HashSet<>();
//			System.out.println(this.addresses);
//		}
//		this.addresses.add(network);
//		return "New network added to this AssetDto.";
//	}
}
