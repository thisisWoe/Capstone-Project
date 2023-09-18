package com.capstone.material_swap.security.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.capstone.material_swap.security.entity.User;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findBypublicKey(String publicKey);

    Boolean existsBypublicKey(String publicKey);
}
