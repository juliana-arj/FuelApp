import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage-angular';
import { VeiculosService } from '../veiculos/veiculos.service'; 
import { Abastecimento } from '../abastecimento.interface'; 
import { Veiculo } from '../veiculos/veiculos.page';

@Component({
  selector: 'app-calculo',
  templateUrl: './calculo.page.html',
  styleUrls: ['./calculo.page.scss'],
  standalone: false,
})
export class CalculoPage implements OnInit {

  @ViewChild(IonContent) content!: IonContent;

  quilometragemAtual: number | null = null;
  litrosAbastecidos: number | null = null;
  valorPago: number | null = null;
  dataAbastecimento: string = '';
  tipoCombustivel: string = '';

  kmAnterior: number | null = null;      
  nomeVeiculoAtivo: string | null = null;
  veiculoAtivoId: string | null = null;

  consumoMedio: string = '—';
  custoPorKm: string = '—';
  calculoRealizado: boolean = false;

  private readonly VEICULOS_KEY = 'veiculos';


  constructor(
    private toastCtrl: ToastController,
    private storage: Storage,
    private veiculosService: VeiculosService
  ) { }

  async ngOnInit() {
    await this.storage.create();
  }

  ionViewWillEnter() {
    this.resetarFormulario();
    this.dataAbastecimento = new Date().toISOString().substring(0, 10);
    this.carregarContextoVeiculo(); // 🔑 Chama o método de carregamento!
  }

  async carregarContextoVeiculo(): Promise<void> {
    const resultado = await this.veiculosService.getKmAnteriorParaCalculo();

    this.kmAnterior = resultado.km;
    this.nomeVeiculoAtivo = resultado.nomeVeiculo;
    this.veiculoAtivoId = await this.veiculosService.getVeiculoAtivoId();

    if (this.kmAnterior === null) {
      this.mostrarAlerta('Selecione um veículo ativo!', 'danger');
    } else {
      this.mostrarAlerta(
        `Veículo: ${this.nomeVeiculoAtivo}. KM Anterior: ${this.kmAnterior}`,
        'secondary'
      );
    }
  }

  get isCalculoDisabled(): boolean {
    const kmAtual = this.quilometragemAtual;
    const litros = this.litrosAbastecidos;
    const kmAnterior = this.kmAnterior;

    const camposBasicosOk = (
      kmAtual !== null && kmAtual > 0 &&
      litros !== null && litros > 0 &&
      this.dataAbastecimento !== '' &&
      this.tipoCombustivel !== ''
    );

    const contextoOk = kmAnterior !== null && this.veiculoAtivoId !== null;

    const kmMaiorQueAnterior = kmAtual !== null && kmAnterior !== null && kmAtual > kmAnterior;

    return !(camposBasicosOk && contextoOk && kmMaiorQueAnterior);
  }

  async calcularConsumo(): Promise<void> {

    if (this.isCalculoDisabled) {
      this.calculoRealizado = false;
      this.mostrarAlerta('Verifique os campos. A KM atual deve ser maior que a KM anterior!', 'warning');
      this.consumoMedio = '—';
      this.custoPorKm = '—';
      return;
    }

    const kmAtual = this.quilometragemAtual!;
    const kmAnterior = this.kmAnterior!;
    const litros = this.litrosAbastecidos!;

    const kmRodados = kmAtual - kmAnterior;

    const consumo = kmRodados / litros;
    this.consumoMedio = consumo.toFixed(2);

    if (this.valorPago !== null && this.valorPago > 0 && kmRodados > 0) {
      const custo = this.valorPago / kmRodados;
      this.custoPorKm = custo.toFixed(2);
    } else {
      this.custoPorKm = '—';
    }

    this.calculoRealizado = true;

    setTimeout(async () => {
      await this.content.scrollToBottom(500);
    }, 50);
  }

  async salvarAbastecimento(): Promise<void> {

    if (!this.calculoRealizado) {
      this.mostrarAlerta('Calcule o consumo primeiro.', 'warning' as any);
      return;
    }

    const novoAbastecimento: Abastecimento = {
      id: new Date().getTime().toString(),
      data: this.dataAbastecimento,
      quilometragem: this.quilometragemAtual!, 
      litros: this.litrosAbastecidos!,
      consumoMedio: parseFloat(this.consumoMedio),
      combustivel: this.tipoCombustivel,

      valor: this.valorPago,
      custoPorKm: this.custoPorKm === '—' ? null : parseFloat(this.custoPorKm),
    };

    try {
      const storageKey = `abastecimentos_${this.veiculoAtivoId}`;
      const value = await this.storage.get(storageKey);
      let listaAbastecimentos: Abastecimento[] = value || [];

      listaAbastecimentos.push(novoAbastecimento);
      listaAbastecimentos.sort((a, b) => parseInt(b.id) - parseInt(a.id));

      await this.storage.set(storageKey, listaAbastecimentos);
      await this.atualizarKmDoVeiculo(this.quilometragemAtual!);

      this.mostrarAlerta('Abastecimento salvo com sucesso!', 'dark' as any);

      this.resetarFormulario();
      await this.carregarContextoVeiculo(); 

    } catch (error) {
      this.mostrarAlerta('Erro ao salvar abastecimento.', 'danger');
      console.error('Erro de Storage:', error);
    }
  }

  private resetarFormulario(): void {
    this.calculoRealizado = false;

    this.quilometragemAtual = null; 
    this.litrosAbastecidos = null;
    this.valorPago = null;
    this.tipoCombustivel = '';

    this.consumoMedio = '—';
    this.custoPorKm = '—';
  }

  async mostrarAlerta(mensagem: string, cor: 'danger' | 'success' | 'warning' | 'secondary' | 'dark' = 'success') {
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 3000,
      position: 'bottom',
      color: cor
    });
    toast.present();
  }

async atualizarKmDoVeiculo(novoKm: number): Promise<void> {
  try {
    let veiculos: Veiculo[] = await this.storage.get(this.VEICULOS_KEY) || []; 

    if (veiculos.length === 0 || !this.veiculoAtivoId) return;

    const veiculoIndex = veiculos.findIndex(v => v.id === this.veiculoAtivoId);

    if (veiculoIndex !== -1) {
      veiculos[veiculoIndex].kmInicial = novoKm; 
      
      await this.storage.set(this.VEICULOS_KEY, veiculos);
    }

  } catch (error) {
    console.error('Erro ao atualizar KM do veículo:', error);
  }
}
}