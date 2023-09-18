package com.capstone.material_swap.entity;

import java.util.Set;

import com.capstone.material_swap.payload.AssetAllocationDto;
import com.capstone.material_swap.security.entity.User;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class StrategyDto {
	private Long id;
	private String name;
	private User user;
	private boolean simulation;
	private Set<AssetAllocationDto> assetAllocations;
}
