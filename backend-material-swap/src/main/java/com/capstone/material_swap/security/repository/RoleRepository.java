package com.capstone.material_swap.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.capstone.material_swap.security.entity.ERole;
import com.capstone.material_swap.security.entity.Role;

import java.util.Optional;

public interface RoleRepository extends JpaRepository<Role, Long> {
    
	Optional<Role> findByRoleName(ERole roleName);

}
