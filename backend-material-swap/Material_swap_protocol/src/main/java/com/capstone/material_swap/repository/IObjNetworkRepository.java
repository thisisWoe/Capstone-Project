package com.capstone.material_swap.repository;

import java.util.List;
import java.util.Set;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.capstone.material_swap.entity.Asset;
import com.capstone.material_swap.entity.ObjNetwork;


@Repository
public interface IObjNetworkRepository extends CrudRepository<ObjNetwork, Long>{
	ObjNetwork getById(Long id);
	List<ObjNetwork> findByNetworkName(String networkName);
	Set<ObjNetwork> findByAsset(Asset asset);
}
