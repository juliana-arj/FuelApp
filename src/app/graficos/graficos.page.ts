import { Component, OnInit, ViewChild } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { Chart, registerables } from 'chart.js';
import { VeiculosService } from '../veiculos/veiculos.service';

export interface Abastecimento {
  id: number;
  data: string;
  quilometragem: number;
  litros: number;
  valor: number | null;
  combustivel: string;
  consumoMedio: number;
  custoPorKm: number | null;
}

Chart.register(...registerables);

@Component({
  selector: 'app-graficos',
  templateUrl: './graficos.page.html',
  styleUrls: ['./graficos.page.scss'],
  standalone: false,
})
export class GraficosPage implements OnInit {

  @ViewChild('lineCanvas') lineCanvas: any;
  @ViewChild('barCanvas') barCanvas: any;
  lineChart: Chart | null = null; 
  barChart: Chart | null = null;

  abastecimentos: Abastecimento[] = [];

  private readonly KM_KEY_PREFIX = 'abastecimentos_';


  constructor(
    private storage: Storage,
    private toastCtrl: ToastController,
    private veiculosService: VeiculosService 
  ) { }

  async ngOnInit() {
    await this.storage.create();
  }

  ionViewWillEnter() {
  this.carregarDados();
}

  async carregarDados(): Promise<void> {
    
    const veiculoAtivoId = await this.veiculosService.getVeiculoAtivoId();

    if (!veiculoAtivoId) {
        this.mostrarAlerta('Selecione um veículo ativo para ver os gráficos.', 'warning');
        this.clearChartsAndData(); 
        return;
    }

    try {
        const storageKey = `${this.KM_KEY_PREFIX}${veiculoAtivoId}`;
        const value = await this.storage.get(storageKey);
        
        this.abastecimentos = value || [];

        if (this.abastecimentos.length === 0) {
            this.mostrarAlerta('Nenhum histórico encontrado para o veículo ativo.', 'dark');
            this.clearChartsAndData(); 
            return;
        }

        this.abastecimentos.sort((a, b) => a.id - b.id);
        this.desenharGraficos();

    } catch (error) {
        console.error('Erro ao carregar dados para gráficos:', error);
        this.mostrarAlerta('Erro ao carregar dados.', 'danger');
        this.clearChartsAndData();
    }
  }

  private clearChartsAndData(): void {
      if (this.lineChart) {
          this.lineChart.destroy();
          this.lineChart = null;
      }
      if (this.barChart) {
          this.barChart.destroy();
          this.barChart = null;
      }
      
      this.abastecimentos = [];
  }

  desenharGraficos() {
    if (!this.lineCanvas || !this.barCanvas || this.abastecimentos.length === 0) {
      this.clearChartsAndData(); 
      return;
    }

    if (this.lineChart) this.lineChart.destroy();
    if (this.barChart) this.barChart.destroy();

    this.criarGraficoLinhaConsumo();
    this.criarGraficoComparativoCombustivel();
  }

  criarGraficoLinhaConsumo() {
    const labels = this.abastecimentos.map(item => new Date(item.data).toLocaleDateString('pt-BR'));
    const data = this.abastecimentos.map(item => item.consumoMedio);

    this.lineChart = new Chart(this.lineCanvas.nativeElement, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Consumo Médio (km/l)',
          data: data,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          tension: 0.3,
          fill: true
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
      }
    });
  }

  criarGraficoComparativoCombustivel() {
    const dadosAgregados = this.abastecimentos.reduce((acc, item) => {
      if (!acc[item.combustivel]) {
        acc[item.combustivel] = { totalConsumo: 0, count: 0 };
      }
      acc[item.combustivel].totalConsumo += item.consumoMedio;
      acc[item.combustivel].count += 1;
      return acc;
    }, {} as Record<string, { totalConsumo: number, count: number }>);

    const labels = Object.keys(dadosAgregados);
    const mediaConsumo = labels.map(key => dadosAgregados[key].totalConsumo / dadosAgregados[key].count);

    const cores = labels.map(comb => {
      if (comb === 'gasolina') return 'rgb(75, 192, 192)'; 
      if (comb === 'etanol') return 'rgb(255, 159, 64)'; 
      if (comb === 'diesel') return 'rgb(54, 162, 235)';
      return 'rgb(201, 203, 207)'; 
    });


    this.barChart = new Chart(this.barCanvas.nativeElement, {
      type: 'bar', 
      data: {
        labels: labels.map(l => l.charAt(0).toUpperCase() + l.slice(1)),
        datasets: [{
          label: 'Média Consumo (km/l)',
          data: mediaConsumo,
          backgroundColor: cores,
          borderColor: cores,
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  async mostrarAlerta(mensagem: string, cor: 'danger' | 'success' | 'warning' | any = 'success') {
    const toast = await this.toastCtrl.create({
      message: mensagem,
      duration: 3000,
      position: 'bottom',
      color: cor
    });
    toast.present();
  }
}