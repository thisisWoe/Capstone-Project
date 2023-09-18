package com.capstone.material_swap.payload;

import java.util.Set;

import com.capstone.material_swap.entity.Pricing;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@AllArgsConstructor
@Data
public class PricingRequestPost {
	private Set<Pricing> pricingset;
}
