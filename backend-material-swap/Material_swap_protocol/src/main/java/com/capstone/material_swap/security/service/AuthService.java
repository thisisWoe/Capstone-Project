package com.capstone.material_swap.security.service;

import com.capstone.material_swap.security.payload.LoginDto;
import com.capstone.material_swap.security.payload.RegisterDto;

public interface AuthService {
    
	String login(LoginDto loginDto);
    String register(RegisterDto registerDto);
    
}
