package com.capstone.material_swap.entity;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import com.capstone.material_swap.security.entity.User;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@NoArgsConstructor
@AllArgsConstructor
@Data
@Builder
@Table(name = "strategy")
public class Strategy {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@Column(nullable = false)
	private String name;
	@ManyToOne
	@JoinColumn(name = "user_publicKey", referencedColumnName = "publicKey")
	private User user;
	private boolean simulation;
	@OneToMany(mappedBy = "strategy")
	private Set<AssetAllocation> assetAllocations;
	@Column(nullable = false)
	private LocalDate start;
	

}
