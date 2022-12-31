import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Usuario } from './models/usuario';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html'
})
export class CadastroComponent implements OnInit {

  //Reactive forms, precisa de um formGroup e add os FormControls para enviar tudo
  cadastroForm: FormGroup;
  usuario: Usuario;
  formResult: string = "";

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.cadastroForm = this.fb.group({
      nome: ['', Validators.required],
      cpf: [''],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(3)]],
      senhaConfirmacao: ['', [Validators.required, Validators.maxLength(10), Validators.minLength(3)]]
    }, {
      validator: ConfirmedValidator('senha', 'senhaConfirmacao')
    });
  }

  //mapeamento do formgroup para o objeto
  adicionarUsuario() {
    if (this.cadastroForm.dirty && this.cadastroForm.valid) {
      this.usuario = Object.assign({}, this.usuario, this.cadastroForm.value);
      console.log(this.usuario);
      this.formResult = JSON.stringify(this.cadastroForm.value);
    }
    else {
      this.formResult = "Nao Submeteu!!";
    }
  }

  validarCampo(nome: string): boolean {
    return this.cadastroForm.get(nome).errors && (this.cadastroForm.get(nome).dirty || this.cadastroForm.get(nome).touched);
  }
}


export function ConfirmedValidator(controlName: string, matchingControlName: string) {
  return (formGroup: FormGroup) => {
    const control = formGroup.controls[controlName];
    const matchingControl = formGroup.controls[matchingControlName];
    if (matchingControl.errors && !matchingControl.errors.confirmedValidator) {
      return;
    }
    if (control.value !== matchingControl.value) {
      matchingControl.setErrors({ confirmedValidator: true });
    } else {
      matchingControl.setErrors(null);
    }
  }

}