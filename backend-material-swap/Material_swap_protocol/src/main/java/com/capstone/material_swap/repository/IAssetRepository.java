package com.capstone.material_swap.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.capstone.material_swap.entity.Asset;

@Repository
public interface IAssetRepository extends CrudRepository<Asset, Long>{
	Asset getById(Long id);
	Asset findByName(String name);
	
}
