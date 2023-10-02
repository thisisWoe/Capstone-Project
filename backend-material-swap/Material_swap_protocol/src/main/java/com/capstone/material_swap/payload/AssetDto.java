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

}
