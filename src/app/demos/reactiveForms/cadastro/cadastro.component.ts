import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-cadastro',
  templateUrl: './cadastro.component.html'
})
export class CadastroComponent implements OnInit {

  //Reactive forms, precisa de um formGroup e add os FormControls para enviar tudo
  cadastroForm: FormGroup;
  teste: string = 'nome'

  constructor() { }

  ngOnInit() {
    this.cadastroForm = new FormGroup({
      nome: new FormControl(''),
      cpf: new FormControl(''),
      email: new FormControl(''),
      senha: new FormControl(''),
      senhaConfirmacao: new FormControl(''),
    });
  }

  adicionarUsuario() {
    let x = this.cadastroForm.value;
    console.log(x);
  }

}
