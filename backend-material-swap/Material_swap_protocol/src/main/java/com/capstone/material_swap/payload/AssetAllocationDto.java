package com.capstone.material_swap.payload;

import com.capstone.material_swap.entity.Strategy;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class AssetAllocationDto {
	private Long id;
	private Strategy strategy;
	private AssetDto asset;
	private double percentage;
	private double buyValue;
	private double amount;
}
