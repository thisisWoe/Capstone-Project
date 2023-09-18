package com.capstone.material_swap.payload;

import java.time.LocalDate;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
public class PricingDto {
	private Long id;
	private AssetDto targetAsset;
	private LocalDate date;
	private double open;
	private double high;
	private double low;
	private double close;
}
