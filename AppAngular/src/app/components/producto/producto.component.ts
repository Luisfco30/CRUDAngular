import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-producto',
  templateUrl: './producto.component.html',
  styleUrls: ['./producto.component.css']
})
export class ProductoComponent implements OnInit {
productoForm:FormGroup
titulo='Crear producto';
id:string | null;
  constructor(private fb: FormBuilder,
              private router:Router,
              private toastr: ToastrService,
              private _productoService: ProductoService,
              private aRouter: ActivatedRoute)
               { 
    this.productoForm = this.fb.group({
      producto: ['', Validators.required],
      categoria: ['', Validators.required],
      ubicacion: ['', Validators.required],
      precio: ['', Validators.required],
    })
    this.id = this.aRouter.snapshot.paramMap.get('id')
  }
  ngOnInit(): void {
    this.esEditar();
  }
  esEditar() {
    if(this.id){
      this.titulo='Editar producto'
      this._productoService.obtenerProducto(this.id).subscribe(data=>{
        this.productoForm.setValue({
          producto: data.nombre,
          categoria:data.categoria,
          ubicacion:data.ubicacion,
          precio:data.precio
        })
      })
    }
  }
  agregarProducto(){

    const PRODUCTO:Producto={
      nombre: this.productoForm.get('producto')?.value,
      categoria: this.productoForm.get('categoria')?.value,
      ubicacion: this.productoForm.get('ubicacion')?.value,
      precio: this.productoForm.get('precio')?.value,
    }

    if ( this.id!){
      this._productoService.editarProducto(this.id, PRODUCTO).subscribe(data=>{
        this.toastr.info('Producto actualizado con exito!', 'Producto actualizado');
      this.router.navigate(['/']); 
      },error=>{
        console.log(error);
      })
    }else{
      console.log(PRODUCTO)

      this._productoService.guardarProducto(PRODUCTO).subscribe(data=>{
        this.toastr.success('Producto registrado con exito!', 'Producto registrado');
      this.router.navigate(['/']); 
      },error=>{
        console.log(error);
      })
    }

    
   
  }
}
