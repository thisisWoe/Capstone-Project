package com.capstone.material_swap.payload;

import com.capstone.material_swap.entity.ENetworks;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class ObjNetworkDto {
	private Long id;
	private ENetworks networkName;
	private String tokenAddress;
}
