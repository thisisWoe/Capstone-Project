package com.capstone.material_swap.entity;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
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
@Table(name = "assetAllocation")
public class AssetAllocation {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
    @JoinColumn(name = "strategy_id")
	private Strategy strategy;
	@ManyToOne
    @JoinColumn(name = "asset_id")
	private Asset asset;
	@Column(nullable = false)
	private double percentage;
	@Column(nullable = false)
	private double buyValue;
	@Column(nullable = false)
	private double amount;
}
