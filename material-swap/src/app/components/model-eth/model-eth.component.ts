import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from '@avatsaev/three-orbitcontrols-ts';
import { AnimationMixer, Clock } from 'three';


@Component({
  selector: 'app-model-eth',
  templateUrl: './model-eth.component.html',
  styleUrls: ['./model-eth.component.scss']
})
export class ModelEthComponent implements AfterViewInit, OnInit {
  @ViewChild('canvas') private canvasRef!: ElementRef;

  renderer = new THREE.WebGLRenderer;
  scene;
  camera;
  clock = new Clock();
  mixer: AnimationMixer | undefined;
  controls!: OrbitControls;
  mesh!: THREE.Object3D<THREE.Event>;
  light!: THREE.Object3D<THREE.Event>;
  deviceWidth: number = 0;

  constructor() {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(35, 800 / 640, 0.1, 1000)
  }
  ngOnInit(): void {
    this.deviceWidth = window.innerWidth;
    console.log("🚀 ~ file: model-eth.component.ts:42 ~ ModelEthComponent ~ ngAfterViewInit ~ this.deviceWidth:", this.deviceWidth)
  }

  ngAfterViewInit() {
    // Configurazione della scena, della camera, del renderer, dei controlli e creazione di luce e mesh
    this.configScene();
    this.configCamera();
    this.configRenderer();
    this.configControls();
    this.createLight();
    this.createMesh();
    //avvio animazione
    this.animate();
  }




  private calculateAspectRatio(): number {
    const height = this.canvas.clientHeight;
    if (height === 0) {
      return 0;
    }
    return this.canvas.clientWidth / this.canvas.clientHeight;
  }

  private get canvas(): HTMLCanvasElement {
    return this.canvasRef.nativeElement;
  }

  configScene() {
    //qui imposto il colore di sfondo, se non lo inserisco rimane trasparente
    /* this.scene.background = new THREE.Color(0x000000); */
  }

  configCamera() {
    this.camera.aspect = 1;


    this.camera.updateProjectionMatrix();
    this.camera.position.set(5, 0, 15);
    this.camera.lookAt(this.scene.position);
  }

  configRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setPixelRatio(devicePixelRatio);

    this.renderer.setClearColor(0x000000, 0);
    // Adattamento delle dimensioni del canvas in base alla larghezza del dispositivo
    if (this.deviceWidth < 992) {
      const canvasSize = Math.max(this.canvas.clientWidth, this.canvas.clientHeight);
      this.renderer.setSize(canvasSize, canvasSize);
      this.canvas.style.maxWidth = '100%';

      console.log('clientWidth', this.canvas.clientWidth);
      console.log('clientHeight', this.canvas.clientHeight);
    } else if ((this.deviceWidth > 991)) {

      const canvasSize = Math.min(this.canvas.clientWidth, this.canvas.clientHeight);
      this.renderer.setSize(canvasSize, canvasSize);

      console.log('clientWidth', this.canvas.clientWidth);
      console.log('clientHeight', this.canvas.clientHeight);
    }
    // Aggiunta di luce ambientale alla scena
    const ambientLight = new THREE.AmbientLight(0xffffff, 5); // Luce ambientale
    this.scene.add(ambientLight);
  }

  configControls() {
    this.controls = new OrbitControls(this.camera, this.canvas);
    this.controls.autoRotate = true;
    this.controls.enableZoom = false;
    this.controls.enablePan = true;
    this.controls.update();
  }

  createLight() {
    this.light = new THREE.PointLight(0xffffff);
    this.light.position.set(-10, 10, 10);
    this.scene.add(this.light);
  }

  createMesh() {
    // Caricamento del modello usando il loader GLTF
    const loader = new GLTFLoader();
    loader.load('./../../../assets/3d-model/ethereum_logo.glb', (gltf) => {
      this.mesh = gltf.scene;

      // Adattamento delle dimensioni e posizione del modello in base alla larghezza del dispositivo
      if (this.deviceWidth < 575) {
        // Imposto la grandezza del modello
        const grandezza: number = 3;
        this.mesh.scale.set(grandezza, grandezza, grandezza);
        // Posiziono il modello al centro della scena
        this.mesh.position.set(0, -2, 0);
      } else {
        // Imposto la grandezza del modello
        const grandezza: number = 2;
        this.mesh.scale.set(grandezza, grandezza, grandezza);
        // Posiziono il modello al centro della scena
        this.mesh.position.set(0, 0, 0);
      }

      // Aggiunta del modello alla scena
      this.scene.add(this.mesh);
    }, undefined, (error) => {
      console.error(error);
    });
  }

  animate() {
    // Richiesta del frame successivo per l'animazione
    window.requestAnimationFrame(() => this.animate());

    /* this.mesh.rotation.y += 0.02; */

    // Aggiorno il mixer dell'animazione con il delta di tempo
    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());
    }

    // Aggiornamento dei controlli e rendering della scena
    this.controls.update();
    this.renderer.render(this.scene, this.camera);
  }

}
