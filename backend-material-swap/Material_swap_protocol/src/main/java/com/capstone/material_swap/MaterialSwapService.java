package com.capstone.material_swap;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.capstone.material_swap.entity.Asset;
import com.capstone.material_swap.entity.AssetAllocation;
import com.capstone.material_swap.entity.ObjNetwork;
import com.capstone.material_swap.entity.Pricing;
import com.capstone.material_swap.entity.Strategy;
import com.capstone.material_swap.entity.StrategyDto;
import com.capstone.material_swap.payload.AssetAllocationDto;
import com.capstone.material_swap.payload.AssetDto;
import com.capstone.material_swap.payload.ObjNetworkDto;
import com.capstone.material_swap.payload.PricingDto;
import com.capstone.material_swap.payload.PricingRequestPost;
import com.capstone.material_swap.repository.IAssetAllocation;
import com.capstone.material_swap.repository.IAssetRepository;
import com.capstone.material_swap.repository.IObjNetworkRepository;
import com.capstone.material_swap.repository.IPricingRepository;
import com.capstone.material_swap.repository.IStrategyRepository;
import com.capstone.material_swap.security.entity.User;
import com.capstone.material_swap.security.exception.MyAPIException;
import com.capstone.material_swap.security.repository.UserRepository;

@Service
public class MaterialSwapService {
	@Autowired IStrategyRepository StrategyRepo;
	@Autowired IAssetRepository AssetRepo;
	@Autowired IAssetAllocation AssetAllocationRepo;
	@Autowired IObjNetworkRepository objNetworkRepo;
	@Autowired UserRepository userRepo;
	@Autowired IPricingRepository priceRepo;
	
	@Autowired @Qualifier("strategyBean") private ObjectProvider<Strategy> strategyProvider;
	@Autowired @Qualifier("assetBean") private ObjectProvider<Asset> assetProvider;
	@Autowired @Qualifier("assetAllocationBean") private ObjectProvider<AssetAllocation> assetAllocationProvider;
	@Autowired @Qualifier("objNetworkBean") private ObjectProvider<ObjNetwork> objNetworkProvider;
	@Autowired @Qualifier("pricingBean") private ObjectProvider<Pricing> pricingProvider;
	
	public Asset addAsset(Asset assetInEntrance) {
		Asset asset = assetProvider.getObject();
		asset.setImgUrl(assetInEntrance.getImgUrl());
		asset.setName(assetInEntrance.getName());
		
		System.out.println(asset.toString());
		AssetRepo.save(asset);
		return asset;
	}
	
	public String addObjectNetwork(ObjNetwork object) {
//		Asset assetEdit = AssetRepo.getById(asset.getId());

		ObjNetwork obj = objNetworkProvider.getObject();
		obj.setAsset(object.getAsset());
		obj.setNetworkName(object.getNetworkName());
		obj.setTokenAddress(object.getTokenAddress());
		objNetworkRepo.save(obj);
		
		System.out.println(obj.toString());
		
		return "Asset and networks respectively successfully created and added.";
	}
	
	public String addStrategy(Strategy strategyInEntrance) {
		User u = strategyInEntrance.getUser();
		String pKey = u.getPublicKey();
		Optional<User> u2 = userRepo.findBypublicKey(pKey);
		User user = u2.orElse(null);

		Strategy strategy = strategyProvider.getObject();
		
		if (!strategyInEntrance.isSimulation() && userRepo.existsById(user.getId())) {
			Set<Strategy> strategyControl = StrategyRepo.findByUser(user);
			boolean hasStrategyWithSimulationFalse = false;
			for (Strategy strat : strategyControl) {
			    if (!strat.isSimulation()) {
			        // Trovata una Strategy con simulation impostata su false
			        hasStrategyWithSimulationFalse = true;
			        break;
			    }
			}
			if (hasStrategyWithSimulationFalse) {
				throw new MyAPIException(HttpStatus.BAD_REQUEST, 
						"You already have a strategy connected with your wallet, you can only simulate this strategy. Please retry.");
			} else {
			    // Nessuna Strategy nel Set ha simulation impostata su false
				//controllo la percentuale di allocazione
				
				Set<AssetAllocation> controlPercentage = strategyInEntrance.getAssetAllocations();
				this.controlPercentageAllocation(controlPercentage);
				if(this.controlPercentageAllocation(controlPercentage)) {
					strategy.setSimulation(strategyInEntrance.isSimulation());
					strategy.setName(strategyInEntrance.getName());
					strategy.setUser(user);
					strategy.setStart(strategyInEntrance.getStart());
					//strategy.setAssetAllocations(controlPercentage);
					StrategyRepo.save(strategy);
					
					controlPercentage.forEach(all -> {
						all.setStrategy(strategy);
						this.addAllocation(all);					
					});
					return "Strategy successfully created. Please set allocations.";					
				} else {
					throw new MyAPIException(HttpStatus.BAD_REQUEST, "Your asset allocation percentage is not 100% (rounding margin: 0.01).");
				}
				
			}
		} else {
			
			//controllo la percentuale di allocazione
			
			Set<AssetAllocation> controlPercentage = strategyInEntrance.getAssetAllocations();
			this.controlPercentageAllocation(controlPercentage);
			if(this.controlPercentageAllocation(controlPercentage)) {
				strategy.setSimulation(strategyInEntrance.isSimulation());
				strategy.setName(strategyInEntrance.getName());
				strategy.setUser(user);
				strategy.setStart(strategyInEntrance.getStart());
				//strategy.setAssetAllocations(controlPercentage);
				StrategyRepo.save(strategy);
				
				controlPercentage.forEach(all -> {
					//all.setStrategy(strategy);
					all.setStrategy(StrategyRepo.getById(strategy.getId()));
					this.addAllocation(all);					
				});
				return "Strategy successfully created. Please set allocations.";					
			} else {
				throw new MyAPIException(HttpStatus.BAD_REQUEST, "Your asset allocation percentage is not 100% (rounding margin: 0.01).");
			}
			
//			strategy.setSimulation(strategyInEntrance.isSimulation());
//			strategy.setName(strategyInEntrance.getName());
//			strategy.setUser(user);
//			StrategyRepo.save(strategy);
//			return "Strategy successfully created. Please set allocations.";
		}
	}
	
	public boolean controlPercentageAllocation(Set<AssetAllocation> newAllocations) {
		double lastControlPercentage = 0;

		for (AssetAllocation allocation : newAllocations) {
		    double amountPercentage = allocation.getPercentage();
		    lastControlPercentage += amountPercentage;
		}
		
		BigDecimal lastControlPercentageBigDecimal = BigDecimal.valueOf(lastControlPercentage);
		BigDecimal margin = new BigDecimal("0.01");
		
		if (lastControlPercentageBigDecimal.compareTo(BigDecimal.ZERO) >= 0 && lastControlPercentageBigDecimal.subtract(new BigDecimal("100.0")).abs().compareTo(margin) > 0) {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "Your asset allocation percentage is not 100% (rounding margin: 0.01).");
		} else {
			return true;
		}
	}
	
	public String addAllocation(AssetAllocation allocationInEntrance) {
		Asset asset = AssetRepo.getById(allocationInEntrance.getAsset().getId());
		Strategy strategy = StrategyRepo.getById(allocationInEntrance.getStrategy().getId());
		
		Set<AssetAllocation> listControl = AssetAllocationRepo.findByStrategy(strategy);

		listControl.forEach(allocation -> {
			Asset as = AssetRepo.getById(allocation.getAsset().getId());
			Asset as2 = AssetRepo.getById(allocationInEntrance.getAsset().getId());
			System.out.println(as.toString());
			System.out.println(allocationInEntrance.getAsset().toString());
			if(as.equals(as2)) {
				throw new MyAPIException(HttpStatus.BAD_REQUEST, as.getName()+" is already allocated in your strategy.");
			}
		});
		
		AssetAllocation assetAllocation = assetAllocationProvider.getObject();
		assetAllocation.setAsset(asset);
		assetAllocation.setStrategy(strategy);
		assetAllocation.setAmount(allocationInEntrance.getAmount());
		assetAllocation.setBuyValue(allocationInEntrance.getBuyValue());
		assetAllocation.setPercentage(allocationInEntrance.getPercentage());
		AssetAllocationRepo.save(assetAllocation);
		
		return "Allocation successfully created and added to Strategy.";
	}
	
	public StrategyDto getStrategyById(Long id) {
		if (StrategyRepo.existsById(id)) {
			Strategy strategy = StrategyRepo.getById(id);
			StrategyDto strDto = new StrategyDto();
			Set<AssetAllocation> allocations = AssetAllocationRepo.findByStrategy(strategy);
			Set<AssetAllocationDto> newAllocation = new HashSet<>();
			allocations.forEach(all -> {
				all.setStrategy(null);
				Asset asset = AssetRepo.getById(all.getAsset().getId());
				AssetDto assetDto = this.getAssetById(asset.getId());
				
				AssetAllocationDto newAll = new AssetAllocationDto();
				newAll.setId(all.getId());
				newAll.setStrategy(all.getStrategy());
				newAll.setAsset(assetDto);
				newAll.setPercentage(all.getPercentage());
				newAll.setBuyValue(all.getBuyValue());
				newAll.setAmount(all.getAmount());
				newAllocation.add(newAll);
			});
			
			strDto.setId(strategy.getId());
			strDto.setName(strategy.getName());
			strDto.setUser(strategy.getUser());
			strDto.setSimulation(strategy.isSimulation());
			strDto.setAssetAllocations(newAllocation);
			strDto.setStart(strategy.getStart());
			
			return strDto;
		} else {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "Strategy not found.");
		}
	}
	
	public AssetDto getAssetById(Long id) {
		if(AssetRepo.existsById(id)) {
			Asset asset = AssetRepo.getById(id);
			AssetDto assetDto = new AssetDto();
			Set<ObjNetwork> listObjNet = objNetworkRepo.findByAsset(asset);
			Set<ObjNetworkDto> listObjNetDto = new HashSet<>();
			listObjNet.forEach(obj -> {
				System.out.println(obj.toString());
				obj.setAsset(null);
				ObjNetworkDto objNetworkDto = new ObjNetworkDto();
				objNetworkDto.setId(obj.getId());
				objNetworkDto.setNetworkName(obj.getNetworkName());
				objNetworkDto.setTokenAddress(obj.getTokenAddress());
				listObjNetDto.add(objNetworkDto);
			});
			assetDto.setAddresses(listObjNetDto);
			assetDto.setId(id);
			assetDto.setImgUrl(asset.getImgUrl());
			assetDto.setName(asset.getName());
			
			System.out.println(assetDto.toString());

			return assetDto;
		} else {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "Asset not found.");
		}
	}

	public Set<AssetDto> getAssets() {
		Set<Asset> assets = (Set<Asset>) AssetRepo.findAll();
		Set<AssetDto> assetDtos = new HashSet<AssetDto>();
		assets.forEach(asset -> {
			AssetDto assetDto = new AssetDto();
				assetDto.setId(asset.getId());
				assetDto.setName(asset.getName());
				assetDto.setImgUrl(asset.getImgUrl());

			Set<ObjNetworkDto> networkDto = new HashSet<ObjNetworkDto>();
			Set<ObjNetwork> relativeNetworks = objNetworkRepo.findByAsset(asset);
			relativeNetworks.forEach(obj -> {
				ObjNetworkDto nDto = new ObjNetworkDto();
					nDto.setId(obj.getId());
					nDto.setNetworkName(obj.getNetworkName());
					nDto.setTokenAddress(obj.getTokenAddress());
				networkDto.add(nDto);
			});

			assetDto.setAddresses(networkDto);
			assetDtos.add(assetDto);
		});
		return assetDtos;
	}
	
	//lazy
	public ObjNetwork getObjNetworkById(Long id) {
		if(objNetworkRepo.existsById(id)) {
			return objNetworkRepo.getById(id);
		} else {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "ObjNetwork not found.");
		}
	}
	
	public String deleteAssetAndNetworks(Long id) {
		if(AssetRepo.existsById(id)) {
			Asset asset = AssetRepo.getById(id);
			Set<ObjNetwork> listObjNet = objNetworkRepo.findByAsset(asset);
			listObjNet.forEach(obj -> {
				objNetworkRepo.deleteById(obj.getId());
			});
			AssetRepo.deleteById(id);
			
			return "Asset and its own network are successfully deleted.";
		} else {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "Asset not found.");
		}
		
	}
	
	public String deleteSingleObjNetwork(Long id) {
		if(objNetworkRepo.existsById(id)) {
			ObjNetwork obj = objNetworkRepo.getById(id);
			objNetworkRepo.deleteById(id);
			return "Target network successfully deleted.";
		} else {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "Asset not found.");
		}
	}
	
	public String deleteAssetAllocation(Long id) {
		if (AssetAllocationRepo.existsById(id)) {
			AssetAllocationRepo.deleteById(id);
			return "Target allocation successfully deleted.";
		} else {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "Allocation not found.");
		}
	}
	
	public String editAllocation(AssetAllocation assetAllocation) {
		if (AssetAllocationRepo.existsById(assetAllocation.getId())) {
			AssetAllocation assAll = AssetAllocationRepo.getById(assetAllocation.getId());
			assAll = assetAllocation;
			AssetAllocationRepo.save(assAll);
			return "Target allocation successfully edited.";
		} else {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "Allocation not found.");
		}
	}
	
	public String editStrategyAndNested(StrategyDto strategyDto) {
		if (StrategyRepo.existsById(strategyDto.getId())) {
			User u = strategyDto.getUser();
			String pKey = u.getPublicKey();
			Optional<User> u2 = userRepo.findBypublicKey(pKey);
			User user = u2.orElse(null);
			
			Strategy newStrategy = StrategyRepo.getById(strategyDto.getId());
			Set<AssetAllocation> allocationList = AssetAllocationRepo.findByStrategy(newStrategy);
			Set<AssetAllocationDto> allocationListInEntranceDto = strategyDto.getAssetAllocations();
			Set<AssetAllocation> allocationListInEntrance = new HashSet<>();
			allocationListInEntranceDto.forEach(allDto -> {
				AssetAllocation assetAllocation = new AssetAllocation();
				assetAllocation.setId(allDto.getId());
				assetAllocation.setStrategy(allDto.getStrategy());
				Asset a = new Asset();
				a.setId(allDto.getAsset().getId());
				a.setName(allDto.getAsset().getName());
				a.setImgUrl(allDto.getAsset().getImgUrl());
				assetAllocation.setAsset(a);
				assetAllocation.setPercentage(allDto.getPercentage());
				assetAllocation.setBuyValue(allDto.getBuyValue());
				assetAllocation.setAmount(allDto.getAmount());
				allocationListInEntrance.add(assetAllocation);
			});
			System.out.println(allocationListInEntrance);
			
			//Set<AssetAllocation> newAllocationList = new HashSet<>();
			Set<AssetAllocation> toCreateList = new HashSet<>();
			
			allocationListInEntrance.forEach(allocationInEntrance -> {
				allocationList.forEach(allocationPresent -> {
					//se hanno lo stesso id
					if(allocationInEntrance.getId() == allocationPresent.getId()) {
						//se hanno tutti i valori delle proprietà uguali
						if(allocationInEntrance.getAsset() == allocationPresent.getAsset() && 
						   allocationInEntrance.getPercentage() == allocationPresent.getPercentage() && 
						   allocationInEntrance.getBuyValue() == allocationPresent.getBuyValue() &&
						   allocationInEntrance.getAmount() == allocationPresent.getAmount()) {
							//li aggiungo alla lista
							//newAllocationList.add(allocationPresent);
						} else {
							//li modifico nel database e li aggiungo alla lista
							System.out.println("verrà modificata: "+allocationInEntrance);
							this.editAllocation(allocationInEntrance);
							//newAllocationList.add(allocationInEntrance);
						}
					} else if(allocationInEntrance.getId() == null) {
						//se non esiste già, la salvo nella lista per salvarla successivamente nel database
						toCreateList.add(allocationInEntrance);
					}
				});
			});
			
			toCreateList.forEach(allocation -> {
				//salvo nel db le nuove allocation
				this.addAllocation(allocation);
			});
			
			if (!strategyDto.isSimulation()) {
				Set<Strategy> strategyControl = StrategyRepo.findByUser(user);
				boolean hasStrategyWithSimulationFalse = false;
				for (Strategy strategy : strategyControl) {
				    if (!strategy.isSimulation()) {
				        // Trovata una Strategy con simulation impostata su false
				        hasStrategyWithSimulationFalse = true;
				        break;
				    }
				}
				if (hasStrategyWithSimulationFalse) {
					throw new MyAPIException(HttpStatus.BAD_REQUEST, 
							"You already have a strategy connected with your wallet, you can only simulate this strategy. Please retry.");
				} else {
				    // Nessuna Strategy nel Set ha simulation impostata su false
					//faccio l'ultimo controllo sulle percentuali
//					double lastControlPercentage = 0;
					Set<AssetAllocation> controlPercentage = AssetAllocationRepo.findByStrategy(newStrategy);

//					for (AssetAllocation allocation : controlPercentage) {
//					    double amountPercentage = allocation.getPercentage();
//					    lastControlPercentage += amountPercentage;
//					}
//					
//					if(Math.abs(lastControlPercentage - 100.0) > 0.01) {
//						throw new MyAPIException(HttpStatus.BAD_REQUEST, "Your asset allocation percentage is not 100% (rounding margin: 0.01).");
//					} else {
//						newStrategy.setSimulation(strategyDto.isSimulation());
//						newStrategy.setName(strategyDto.getName());
//						newStrategy.setUser(user);
//					}
//					StrategyRepo.save(newStrategy);
//					return "Strategy succesfully updated.";
					if(this.controlPercentageAllocation(controlPercentage)) {
						StrategyRepo.save(newStrategy);
						return "Strategy succesfully updated.";					
					} else {
						throw new MyAPIException(HttpStatus.BAD_REQUEST, "Your asset allocation percentage is not 100% (rounding margin: 0.01).");
					}
				}
			} else {
//				double lastControlPercentage = 0;
				Set<AssetAllocation> controlPercentage = AssetAllocationRepo.findByStrategy(newStrategy);

//				for (AssetAllocation allocation : controlPercentage) {
//				    double amountPercentage = allocation.getPercentage();
//				    lastControlPercentage += amountPercentage;
//				}
//				BigDecimal lastControlPercentageBigDecimal = BigDecimal.valueOf(lastControlPercentage);
//				BigDecimal margin = new BigDecimal("0.01");
//				
//				//if(Math.abs(lastControlPercentage - 100.0) > 0.01) {
//				if (lastControlPercentageBigDecimal.compareTo(BigDecimal.ZERO) >= 0 && lastControlPercentageBigDecimal.subtract(new BigDecimal("100.0")).abs().compareTo(margin) > 0) {
//					System.out.println(Math.abs(lastControlPercentage - 100.0));
//					System.out.println(lastControlPercentage);
//					throw new MyAPIException(HttpStatus.BAD_REQUEST, "Your asset allocation percentage is not 100% (rounding margin: 0.01).");
//				} else {
//					newStrategy.setSimulation(strategyDto.isSimulation());
//					newStrategy.setName(strategyDto.getName());
//					newStrategy.setUser(user);
//				}
				if(this.controlPercentageAllocation(controlPercentage)) {
					StrategyRepo.save(newStrategy);
					return "Strategy succesfully updated.";					
				} else {
					throw new MyAPIException(HttpStatus.BAD_REQUEST, "Your asset allocation percentage is not 100% (rounding margin: 0.01).");
				}
			}

		} else {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "Strategy not found.");
		}
	}
	
	public String deleteStrategyAndNested(Long id) {
		if(StrategyRepo.existsById(id)) {
			Strategy strategy = StrategyRepo.getById(id);
			Set<AssetAllocation> allocations = AssetAllocationRepo.findByStrategy(strategy);
			allocations.forEach(all -> {
				System.out.println(all);
				if(AssetAllocationRepo.existsById(all.getId())) {
					AssetAllocationRepo.deleteById(all.getId());
				} else {
					throw new MyAPIException(HttpStatus.BAD_REQUEST, "Allocation not found, please retry.");
				}
			});
			StrategyRepo.deleteById(id);
			
			return "Strategy and allocations successfully deleted.";
		} else {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "Strategy not found.");
		}
	}
	
	public Set<PricingDto> getAllPricingByAsset(Asset asset){
		if (AssetRepo.existsById(asset.getId())) {
			Set<Pricing> pricingList = priceRepo.findByTargetAsset(asset);
			Set<PricingDto> pricingListDto = new HashSet<>();
			AssetDto assetDto = this.getAssetById(asset.getId());
			pricingList.forEach(price -> {
				PricingDto pr = new PricingDto();
				pr.setId(price.getId());
				pr.setTargetAsset(assetDto);
				pr.setDate(price.getDate());
				pr.setOpen(price.getOpen());
				pr.setHigh(price.getHigh());
				pr.setLow(price.getLow());
				pr.setClose(price.getClose());
				pricingListDto.add(pr);
			});
			return pricingListDto;
		} else {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "Asset not found.");
		}
	}
	
	public PricingDto getByDate(LocalDate date, Asset asset) {
		if (AssetRepo.existsById(asset.getId())) {
			Set<Pricing> pricingList = priceRepo.findByDate(date);
			Set<Pricing> pricingListFilteredXasset = new HashSet<>();
			Pricing pricing = new Pricing();
			PricingDto pr = new PricingDto();
			AssetDto assetDto = this.getAssetById(asset.getId());
			pricingList.forEach(price -> {
				if (price.getTargetAsset().getId() == asset.getId() ) {
					pricingListFilteredXasset.add(price);
				}
			});
			if(pricingListFilteredXasset.size() == 1) {
				Pricing[] array = pricingListFilteredXasset.toArray(new Pricing[0]);
				pricing = array[0];
			}
			pr.setId(pricing.getId());
			pr.setTargetAsset(assetDto);
			pr.setDate(pricing.getDate());
			pr.setOpen(pricing.getOpen());
			pr.setHigh(pricing.getHigh());
			pr.setLow(pricing.getLow());
			pr.setClose(pricing.getClose());
			return pr;
		} else {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "Asset not found.");
		}
	}
	
	public Set<LocalDate> getDatesBetween(LocalDate startDate, LocalDate endDate) {
        Set<LocalDate> datesBetween = new HashSet<>();
        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {
            datesBetween.add(currentDate);
            currentDate = currentDate.plusDays(1);
        }

        return datesBetween;
    }
	
	public Set<PricingDto> getRangePricingByAsset(LocalDate startDate, LocalDate endDate, Asset asset){
		if (AssetRepo.existsById(asset.getId())) {
			Set<PricingDto> pricingList = new HashSet<>();
			Set<LocalDate> dateRange = this.getDatesBetween(startDate, endDate);
			dateRange.forEach(date -> {
				PricingDto targetPrice = this.getByDate(date, asset);
				pricingList.add(targetPrice);
			});
			return pricingList;
		} else {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "Asset not found.");
		}
	}
	
	public String addPricing(Pricing pricing) {
		Pricing price = pricingProvider.getObject();
		price.setTargetAsset(pricing.getTargetAsset());
		
		// Cerca il pricing esistente per l'asset e la data specificati
		Asset targetAsset = pricing.getTargetAsset();
		LocalDate date = pricing.getDate();	    
		Set<Pricing> existingPricingOptional = priceRepo.findByTargetAssetAndDate(targetAsset, date);
	    if (existingPricingOptional.size() >= 1) {
	    	// Sovrascrivi il pricing esistente con i nuovi valori
	    	existingPricingOptional.forEach(pr -> {
	    		Pricing existingPricing = priceRepo.getById(pr.getId());
	    		existingPricing.setOpen(pricing.getOpen());
	    		existingPricing.setHigh(pricing.getHigh());
	    		existingPricing.setLow(pricing.getLow());
	    		existingPricing.setClose(pricing.getClose());
	    		priceRepo.save(existingPricing);	    		
	    	});
	        return "Existing pricing updated.";
	    } else {
	    	price.setDate(pricing.getDate());
	    	price.setOpen(pricing.getOpen());
	    	price.setHigh(pricing.getHigh());
	    	price.setLow(pricing.getLow());
	    	price.setClose(pricing.getClose());
	    	
	    	System.out.println(price.toString());
	    	priceRepo.save(price);
	    	return "Pricing successfully saved.";	    	
	    }
	    
	    
	}
	
	public String addpricingBlock(PricingRequestPost pricingListEntrance) {
		Set<Pricing> pricingset = pricingListEntrance.getPricingset();
		pricingset.forEach(price -> {
			this.addPricing(price);
		});
		return "Pricing block successfully saved.";
	}
	
	public AssetDto editAssetAndNetwork(AssetDto assetDtoInEntrance) {
		AssetDto res = new AssetDto();
		if(AssetRepo.existsById(assetDtoInEntrance.getId())){
			Asset asset = AssetRepo.getById(assetDtoInEntrance.getId());
			asset.setName(assetDtoInEntrance.getName());
			asset.setImgUrl(assetDtoInEntrance.getImgUrl());
			AssetRepo.save(asset);

			Set<ObjNetworkDto> networks = assetDtoInEntrance.getAddresses();
			networks.forEach(obj -> {
				if (objNetworkRepo.existsById(obj.getId())) {
					ObjNetwork object = objNetworkRepo.getById(obj.getId());
					object.setNetworkName(obj.getNetworkName());
					object.setTokenAddress(obj.getTokenAddress());
					objNetworkRepo.save(object);
				} else {
					throw new MyAPIException(HttpStatus.BAD_REQUEST, "Network not found.");
				}
			});
			res = this.getAssetById(assetDtoInEntrance.getId());
		} else {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "Asset not found.");
		}
		return res;
	}
	
	public Set<PricingDto> getPricingDtoByAssetId(Long id){
		if (AssetRepo.existsById(id)) {
			Asset asset = AssetRepo.getById(id);
			return this.getAllPricingByAsset(asset);
		} else {
			throw new MyAPIException(HttpStatus.BAD_REQUEST, "Asset not found.");
		}
	}
	
	public Set<StrategyDto> getAllStrategies(){
		Set<Strategy> strategies = StrategyRepo.findAll();
		Set<StrategyDto> strategyDtoS = new HashSet<StrategyDto>();
		strategies.forEach(str -> {
			StrategyDto newStrDto = new StrategyDto();
				newStrDto.setId(str.getId());
				newStrDto.setName(str.getName());
				newStrDto.setSimulation(str.isSimulation());
				newStrDto.setStart(str.getStart());
				newStrDto.setUser(str.getUser());
			
			Set<AssetAllocationDto> allocationDtos = new HashSet<AssetAllocationDto>();
			Set<AssetAllocation> allocations = AssetAllocationRepo.findByStrategy(str);
				allocations.forEach(all -> {
					AssetAllocationDto newAssAllDto = new AssetAllocationDto();
					newAssAllDto.setId(all.getId());
					newAssAllDto.setStrategy(str);
					newAssAllDto.setAsset(this.getAssetById(all.getAsset().getId()));
					newAssAllDto.setPercentage(all.getPercentage());
					newAssAllDto.setBuyValue(all.getBuyValue());
					newAssAllDto.setAmount(all.getAmount());

					allocationDtos.add(newAssAllDto);
				});
			newStrDto.setAssetAllocations(allocationDtos);
			strategyDtoS.add(newStrDto);
		});
		return strategyDtoS;
	}
	
	public Set<StrategyDto> getAllStrategiesByUser(String pK){
		Optional<User> usr = userRepo.findBypublicKey(pK);
		User userFound = usr.orElse(null);
		Set<Strategy> strategies = StrategyRepo.findByUser(userFound);
		Set<StrategyDto> strategyDtoS = new HashSet<StrategyDto>();
		strategies.forEach(str -> {
			StrategyDto newStrDto = new StrategyDto();
				newStrDto.setId(str.getId());
				newStrDto.setName(str.getName());
				newStrDto.setSimulation(str.isSimulation());
				newStrDto.setStart(str.getStart());
				newStrDto.setUser(str.getUser());
			
			Set<AssetAllocationDto> allocationDtos = new HashSet<AssetAllocationDto>();
			Set<AssetAllocation> allocations = AssetAllocationRepo.findByStrategy(str);
				allocations.forEach(all -> {
					AssetAllocationDto newAssAllDto = new AssetAllocationDto();
					newAssAllDto.setId(all.getId());
					newAssAllDto.setStrategy(str);
					newAssAllDto.setAsset(this.getAssetById(all.getAsset().getId()));
					newAssAllDto.setPercentage(all.getPercentage());
					newAssAllDto.setBuyValue(all.getBuyValue());
					newAssAllDto.setAmount(all.getAmount());

					allocationDtos.add(newAssAllDto);
				});
			newStrDto.setAssetAllocations(allocationDtos);
			strategyDtoS.add(newStrDto);
		});
		return strategyDtoS;
	}

}
