import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Usuario } from './models/usuario';
import { DisplayMessage, GenericValidator, ValidationMessages } from './generic-form-validation';
import { Observable, fromEvent, merge } from 'rxjs';


@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html'
})
export class CadastroComponent implements OnInit, AfterViewInit {

  //Reactive forms, precisa de um formGroup e add os FormControls para enviar tudo
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  cadastroForm: FormGroup;
  usuario: Usuario;
  formResult: string = '';
  // MASKS = utilsBr.MASKS;

  validationMessages: ValidationMessages;
  genericValidator: GenericValidator;
  displayMessage: DisplayMessage = {};

  constructor(private fb: FormBuilder) {
    this.validationMessages = {
      nome: {
        required: 'O Nome é requerido',
        minlength: 'O Nome precisa ter no mínimo 3 caracteres',
        maxlength: 'O Nome precisa ter no máximo 10 caracteres'
      },
      email: {
        required: 'Informe o e-mail',
        email: 'Email inválido'
      },
      senha: {
        required: 'Informe a senha',
        minlength: 'O senha precisa ter no mínimo 3 caracteres',
        maxlength: 'O senha precisa ter no máximo 10 caracteres'
      },
      senhaConfirmacao: {
        required: 'Informe a senha novamente',
        minlength: 'A confirmacao da senha precisa ter no mínimo 3 caracteres',
        maxlength: 'A confirmacao da senha precisa ter no máximo 10 caracteres',
        confirmedValidator: 'As senhas estao diferentes'
      }
    };

    this.genericValidator = new GenericValidator(this.validationMessages);

  }

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

  //blur => tirar foco do item do formulario
  ngAfterViewInit(): void {
    let controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs).subscribe(() => {
      this.displayMessage = this.genericValidator.processarMensagens(this.cadastroForm);
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

  //meu metodo que foi substituido pelo GenericValidator
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