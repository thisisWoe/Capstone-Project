package com.capstone.material_swap.controller;

import java.time.LocalDate;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.HttpStatus;

import com.capstone.material_swap.MaterialSwapService;
import com.capstone.material_swap.entity.Asset;
import com.capstone.material_swap.entity.AssetAllocation;
import com.capstone.material_swap.entity.ObjNetwork;
import com.capstone.material_swap.entity.Pricing;
import com.capstone.material_swap.entity.Strategy;
import com.capstone.material_swap.entity.StrategyDto;
import com.capstone.material_swap.payload.AssetDto;
import com.capstone.material_swap.payload.PricingDto;
import com.capstone.material_swap.payload.PricingRequestPost;

@RestController
@RequestMapping("/api")
public class MaterialSwapController {
	@Autowired MaterialSwapService mSvc;
	
	
	//POST
	@PostMapping("/asset/new")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> createAsset(@RequestBody Asset a){
		Asset response = mSvc.addAsset(a);
		//return new ResponseEntity<Asset>(response, HttpStatus.OK);
		ResponseEntity<Asset> resp = new ResponseEntity<Asset>(response, HttpStatus.OK);
		return resp;
	}
	
	@PostMapping("/objnetowrk/new")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> createNetwork(@RequestBody ObjNetwork o){
		String response = mSvc.addObjectNetwork(o);
		return new ResponseEntity<String>(response, HttpStatus.OK);
	}
	
	@PostMapping("/strategy/new")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> createStrategy(@RequestBody Strategy s){
		String response = mSvc.addStrategy(s);
		return new ResponseEntity<String>(response, HttpStatus.OK);
	}
	
	@PostMapping("/asset-allocation/new")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> addAllocation(@RequestBody AssetAllocation aA){
		String response = mSvc.addAllocation(aA);
		return new ResponseEntity<String>(response, HttpStatus.OK);
	}
	
	@PostMapping("/pricing/new")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> addPricing(@RequestBody Pricing p){
		String response = mSvc.addPricing(p);
		return new ResponseEntity<String>(response, HttpStatus.OK);
	}
	
	@PostMapping("/pricingblock/new")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> addpricingBlock(@RequestBody PricingRequestPost pB){
		String response = mSvc.addpricingBlock(pB);
		return new ResponseEntity<String>(response, HttpStatus.OK);
	}
	
	//PUT
	@PutMapping("/strategy/edit")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> editStrategyAndNested(@RequestBody StrategyDto s){
		String response = mSvc.editStrategyAndNested(s);
		return new ResponseEntity<String>(response, HttpStatus.OK);
	}
	
	
	//GET
	@GetMapping("/asset/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> getAssetById(@PathVariable Long id) {
		AssetDto asset = mSvc.getAssetById(id);
		ResponseEntity<AssetDto> resp = new ResponseEntity<AssetDto>(asset, HttpStatus.OK);
		return resp;
	}

	@GetMapping("/asset")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> getAssets() {
		Set<AssetDto> assets = mSvc.getAssets();
		ResponseEntity<Set<AssetDto>> resp = new ResponseEntity<Set<AssetDto>>(assets, HttpStatus.OK);
		return resp;
	}


	
	@GetMapping("/objnetowrk/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> getObjNetworkById(@PathVariable Long id) {

		ObjNetwork objNetwork = mSvc.getObjNetworkById(id);
		ResponseEntity<ObjNetwork> resp = new ResponseEntity<ObjNetwork>(objNetwork, HttpStatus.OK);
		return resp;
	}
	
	@GetMapping("/strategy/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> getStrategyById(@PathVariable Long id) {
		
		StrategyDto strategy = mSvc.getStrategyById(id);
		ResponseEntity<StrategyDto> resp = new ResponseEntity<StrategyDto>(strategy, HttpStatus.OK);
		return resp;
	}
	
	@GetMapping("/pricing/all")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> getAllPricingByAsset(@RequestBody Asset a) {
		
		Set<PricingDto> pricinglist = mSvc.getAllPricingByAsset(a);
		ResponseEntity<Set<PricingDto>> resp = new ResponseEntity<Set<PricingDto>>(pricinglist, HttpStatus.OK);
		return resp;
	}
	
	@GetMapping("/pricing/singledate")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> getByDate(
			@RequestParam("d")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate d,
            @RequestBody Asset a
			) {
		
		PricingDto pricing = mSvc.getByDate(d, a);
		ResponseEntity<PricingDto> resp = new ResponseEntity<PricingDto>(pricing, HttpStatus.OK);
		return resp;
	}
	
	@GetMapping("/pricing/rangedate")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<?> getRangePricingByAsset(
			@RequestParam("sD")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate sD,
            @RequestParam("eD")
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate eD,
            @RequestBody Asset a
			) {
		
		Set<PricingDto> pricinglist = mSvc.getRangePricingByAsset(sD, eD, a);
		ResponseEntity<Set<PricingDto>> resp = new ResponseEntity<Set<PricingDto>>(pricinglist, HttpStatus.OK);
		return resp;
	}
	
	
	
	//DELETE
	@DeleteMapping("/asset/delete/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<String> deleteAssetById(@PathVariable Long id) {
		String response = mSvc.deleteAssetAndNetworks(id);
		return new ResponseEntity<String>(response, HttpStatus.OK);
	}
	
	@DeleteMapping("/objnetowrk/delete/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<String> deleteSingleObjectById(@PathVariable Long id) {
		String response = mSvc.deleteSingleObjNetwork(id);
		return new ResponseEntity<String>(response, HttpStatus.OK);
	}
	
	@DeleteMapping("/strategy/delete/{id}")
	@PreAuthorize("isAuthenticated()")
	public ResponseEntity<String> deleteStrategyAndNested(@PathVariable Long id) {
		String response = mSvc.deleteStrategyAndNested(id);
		return new ResponseEntity<String>(response, HttpStatus.OK);
	}

	
	
	
	
	
	
	
	
	
	
	
	
}
