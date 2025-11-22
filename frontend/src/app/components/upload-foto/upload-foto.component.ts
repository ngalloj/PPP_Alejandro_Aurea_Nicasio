// frontend/src/app/components/upload-foto

import { Component, EventEmitter, Output, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-upload-foto',
  standalone: true, // <- Debe terner esto
  templateUrl: './upload-foto.component.html',
  styleUrls: ['./upload-foto.component.css']
})
export class UploadFotoComponent {
  @Output() fotoSeleccionada = new EventEmitter<File>();
  @ViewChild('fileInput') fileInput!: ElementRef;
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvas') canvas!: ElementRef;

  previsualizacion: string | null = null;
  archivo: File | null = null;
  mostrarWebcam: boolean = false;
  stream: MediaStream | null = null;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      this.archivo = file;
      this.crearPrevisualizacion(file);
      this.fotoSeleccionada.emit(file);
    }
  }

  crearPrevisualizacion(file: File): void {
    const reader = new FileReader();
    reader.onload = () => {
      this.previsualizacion = reader.result as string;
    };
    reader.readAsDataURL(file);
  }

  abrirSelectorArchivos(): void {
    this.fileInput.nativeElement.click();
  }

  async activarWebcam(): Promise<void> {
    try {
      this.mostrarWebcam = true;
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }
      });
      
      setTimeout(() => {
        if (this.videoElement && this.videoElement.nativeElement) {
          this.videoElement.nativeElement.srcObject = this.stream;
        }
      }, 100);
    } catch (error) {
      console.error('Error accediendo a la webcam:', error);
      alert('No se pudo acceder a la cámara');
      this.mostrarWebcam = false;
    }
  }

  capturarFoto(): void {
    const video = this.videoElement.nativeElement;
    const canvas = this.canvas.nativeElement;
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob: Blob | null) => {
      if (blob) {
        const file = new File([blob], `webcam-${Date.now()}.jpg`, { type: 'image/jpeg' });
        this.archivo = file;
        this.previsualizacion = canvas.toDataURL('image/jpeg');
        this.fotoSeleccionada.emit(file);
        this.cerrarWebcam();
      }
    }, 'image/jpeg');
  }

  cerrarWebcam(): void {
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    this.mostrarWebcam = false;
  }

  limpiarFoto(): void {
    this.archivo = null;
    this.previsualizacion = null;
    this.cerrarWebcam();
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  ngOnDestroy(): void {
    this.cerrarWebcam();
  }
}
