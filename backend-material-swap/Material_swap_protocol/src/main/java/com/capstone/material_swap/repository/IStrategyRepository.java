package com.capstone.material_swap.repository;
import java.util.List;
import java.util.Set;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.capstone.material_swap.entity.Strategy;
import com.capstone.material_swap.security.entity.User;

@Repository
public interface IStrategyRepository extends CrudRepository<Strategy, Long>{
	Strategy getById(Long id);
	Set<Strategy> findByUser(User u);
	Set<Strategy> findAll();
}
