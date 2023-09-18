package com.capstone.material_swap.entity;

import java.time.LocalDate;

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
@Table(name = "pricing")
public class Pricing {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;
	@ManyToOne
    @JoinColumn(name = "asset_id")
	private Asset targetAsset;
	@Column(nullable = false)
	private LocalDate date;
	@Column(nullable = false)
	private double open;
	@Column(nullable = false)
	private double high;
	@Column(nullable = false)
	private double low;
	@Column(nullable = false)
	private double close;
}
