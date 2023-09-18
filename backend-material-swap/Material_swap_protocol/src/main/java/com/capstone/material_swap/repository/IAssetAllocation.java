package com.capstone.material_swap.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.capstone.material_swap.entity.AssetAllocation;
import com.capstone.material_swap.entity.Strategy;

@Repository
public interface IAssetAllocation extends CrudRepository<AssetAllocation, Long>{
	AssetAllocation getById(Long id);
	Set<AssetAllocation> findByStrategy(Strategy strategy);
	
}
