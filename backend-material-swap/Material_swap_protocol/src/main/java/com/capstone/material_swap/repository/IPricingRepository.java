package com.capstone.material_swap.repository;

import java.time.LocalDate;
import java.util.Optional;
import java.util.Set;

import org.springframework.data.repository.CrudRepository;

import com.capstone.material_swap.entity.Asset;
import com.capstone.material_swap.entity.Pricing;

public interface IPricingRepository extends CrudRepository<Pricing, Long>{
	Pricing getById(Long id);
	Set<Pricing> findByDate(LocalDate date);
	Set<Pricing> findByTargetAsset(Asset asset);
	Set<Pricing> findByTargetAssetAndDate(Asset targetAsset, LocalDate date);
}
