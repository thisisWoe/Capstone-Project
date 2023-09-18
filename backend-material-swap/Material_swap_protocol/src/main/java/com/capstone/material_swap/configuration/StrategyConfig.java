package com.capstone.material_swap.configuration;

import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Scope;

import com.capstone.material_swap.entity.Asset;
import com.capstone.material_swap.entity.ObjNetwork;
import com.capstone.material_swap.entity.Pricing;
import com.capstone.material_swap.entity.AssetAllocation;
import com.capstone.material_swap.entity.Strategy;

@Configuration
public class StrategyConfig {
	
	@Bean("strategyBean")
	@Scope("prototype")
	public Strategy strategy() {
		return new Strategy();
	}
	
	@Bean("assetBean")
	@Scope("prototype")
	public Asset asset() {
		return new Asset();
	}
	
	@Bean("assetAllocationBean")
	@Scope("prototype")
	public AssetAllocation assetAllocation() {
		return new AssetAllocation();
	}
	
	@Bean("objNetworkBean")
	@Scope("prototype")
	public ObjNetwork objNetwork() {
		return new ObjNetwork();
	}
	
	@Bean("pricingBean")
	@Scope("prototype")
	public Pricing pricing() {
		return new Pricing();
	}
	
}
