import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth.service';
import { RegisterDto } from 'src/app/interfaces/register-dto';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit,AfterViewInit {
  @ViewChild('form', { static: true }) formElement!: ElementRef;

  newUserData: RegisterDto = {
    publicKey: '',
    password: '',
    roles: []
  };

  formRegister!: FormGroup;

  constructor(private AuthSvc: AuthService, private router: Router, private fb: FormBuilder) { }
  ngAfterViewInit(): void {
    this.resizeForm();
  }

  ngOnInit(): void {
    this.formRegister = this.fb.group({
      publicKey: ['ciao', Validators.required],
      password: ['ciao', Validators.required],
      roles: [["USER"], Validators.required]
    });
  }

  resizeForm(){
    const form = <HTMLDivElement>this.formElement.nativeElement;


    const width = form.offsetWidth;

    form.style.height = `${width}px`;
  }

  register(){

  }

}


