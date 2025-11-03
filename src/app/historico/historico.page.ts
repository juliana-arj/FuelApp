import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular'; 
import { ToastController, AlertController } from '@ionic/angular';
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


@Component({
  selector: 'app-historico',
  templateUrl: './historico.page.html',
  styleUrls: ['./historico.page.scss'],
  standalone: false, 
})
export class HistoricoPage implements OnInit {

  historico: Abastecimento[] = [];

  historicoCarregado: boolean = false;

  constructor(
    private storage: Storage,
    private veiculosService: VeiculosService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
  ) { }

  async ngOnInit() {
    await this.storage.create();

    this.carregarHistorico();
  }

  ionViewWillEnter() {
    this.carregarHistorico();
  }


  async carregarHistorico(): Promise<void> {
    try {
      const veiculoAtivoId = await this.veiculosService.getVeiculoAtivoId();

      if (!veiculoAtivoId) {
        this.historico = []; 
        this.mostrarAlerta('Selecione um veículo ativo na página "Veículos"!', 'warning' as any);
        return;
      }

      const storageKey = `abastecimentos_${veiculoAtivoId}`;

      const value = await this.storage.get(storageKey);

      let listaAbastecimentos: Abastecimento[] = value || [];

      listaAbastecimentos.sort((a, b) => b.id - a.id);

      this.historico = listaAbastecimentos; 

    } catch (error) {
      console.error('Erro ao carregar histórico:', error);
      this.mostrarAlerta('Erro ao carregar histórico.', 'danger');
    } finally {
      this.historicoCarregado = true;
    }
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

  async confirmarExclusao(id: number): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Exclusão',
      message: 'Tem certeza que deseja excluir este registro? Esta ação é irreversível.',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
        },
        {
          text: 'Excluir',
          cssClass: 'danger',
          handler: () => {
            this.deletarAbastecimento(id);
          },
        },
      ],
    });

    await alert.present();
  }

  async deletarAbastecimento(id: number): Promise<void> {
    try {
      const veiculoAtivoId = await this.veiculosService.getVeiculoAtivoId();

      if (!veiculoAtivoId) {
        this.mostrarAlerta('Erro: Veículo ativo não encontrado.', 'danger');
        return;
      }

      const storageKey = `abastecimentos_${veiculoAtivoId}`;

      this.historico = this.historico.filter(item => item.id !== id);

      await this.storage.set(storageKey, this.historico);

      this.mostrarAlerta('Registro excluído com sucesso!', 'dark' as any);

    } catch (error) {
      this.mostrarAlerta('Erro ao excluir registro.', 'danger');
      console.error('Erro ao deletar do Storage:', error);
    }
  }

}