import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import anime from 'animejs';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';
import { LoginDto } from 'src/app/interfaces/login-dto';
import { RegisterDto } from 'src/app/interfaces/register-dto';
import { Web3Service } from 'src/app/web3-serv/web3.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit,AfterViewInit {
  @ViewChild('form', { static: true }) formElement!: ElementRef;
  @ViewChild('loginTab', { static: true }) loginElement!: ElementRef;
  @ViewChild('registerTab', { static: true }) registerElement!: ElementRef;

  walletLogged: boolean = false;
  wallet$: Observable<any>;
  walletAddress:string = '';

  newUserData: RegisterDto = {
    publicKey: '',
    password: '',
    roles: []
  };

  userData: LoginDto = {
    publicKey: '',
    password: ''
  };

  formRegister!: FormGroup;
  formLogin!: FormGroup;
  isRegister:boolean = false;

  constructor(private AuthSvc: AuthService, private router: Router, private fb: FormBuilder, private web3Svc: Web3Service) {
    this.wallet$ = this.web3Svc.metamask$;
  }

  ngAfterViewInit(): void {
    /* this.resizeForm(); */
  }

  ngOnInit(): void {
    this.registerElement.nativeElement.style.right = -this.registerElement.nativeElement.offsetWidth+'px';


    this.wallet$.subscribe((wallet) => {
      this.walletLogged = wallet;
      if(wallet){
        this.walletAddress = wallet.selectedAddress;
        this.formLogin = this.fb.group({
          publicKey: [this.walletAddress, Validators.required],
          password: ['', Validators.required]
        });
        this.formRegister = this.fb.group({
          publicKey: [this.walletAddress, Validators.required],
          password: ['', Validators.required],
          roles: [["USER"], Validators.required]
        });
      }

    });


    this.formLogin = this.fb.group({
      publicKey: [this.walletAddress, Validators.required],
      password: ['', Validators.required]
    });

    this.formRegister = this.fb.group({
      publicKey:
      [
        this.walletAddress,
        [
          Validators.required,
          Validators.minLength(42),
          Validators.pattern(/^0x[a-fA-F0-9]{40}$/)
        ]
      ],
      password: ['', [Validators.required, Validators.minLength(5)]],
      roles: [["USER"], Validators.required]
    });
  }

  connectMetamask() {
    this.web3Svc.connect();
  }

  register(){
    this.newUserData = this.formRegister.value;
    if (this.walletLogged) {
      this.web3Svc.signRegisterRequest()
      .then((response) => {
      console.log("response:", response)
        this.AuthSvc.signUp(this.newUserData)
        .subscribe((res:string) => {
          console.log("res:", res)
          this.moveToRegister();
        })
      })
      .catch((error) => {
        console.log("error:", error)
      });
    } else {
      console.log('logga metamask');

    }


  }

  login(){
    this.userData = this.formLogin.value;
    this.AuthSvc.signIn(this.userData)
    .subscribe((res) => {
      console.log("res:", res)
      console.log('You are logged in.')
      this.router.navigate(['home/dashboard']);
    });
  }


  moveToRegister(){
    const login:HTMLDivElement = this.loginElement.nativeElement;
    const register:HTMLDivElement = this.registerElement.nativeElement;

    const radioLogin = document.querySelector('#btnradio1');
    const radioRegister = document.querySelector('#btnradio3');

    const loginWidth = login.offsetWidth;
    console.log("loginWidth:", loginWidth)
    const registerWidth = register.offsetWidth;
    console.log("registerWidth:", registerWidth)
    if (!this.isRegister) {
      radioLogin!.removeAttribute('disabled');
      radioRegister!.setAttribute('disabled', 'disabled');
      anime({
        targets: [login, register],
        delay: 0,
        keyframes: [
          {translateX: -loginWidth}
        ],
        duration: 500,
        easing: 'linear',
        loop: false
      })

      this.isRegister = true;

    } else {
      radioRegister!.removeAttribute('disabled');
      radioLogin!.setAttribute('disabled', 'disabled');
      console.log("loginWidth:", loginWidth)
      anime({
        targets: [login, register],
        delay: 0,
        keyframes: [
          {translateX: (loginWidth/160)}
        ],
        duration: 500,
        easing: 'linear',
        loop: false
      })

      this.isRegister = false;
    }
  }


  /* resizeForm(){
    const form = <HTMLDivElement>this.formElement.nativeElement;


    const width = form.offsetWidth;

    form.style.height = `${width*1.2}px`;
  } */
}


