import { Component, OnInit } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { AlertController, ToastController } from '@ionic/angular';

export interface Veiculo {
  id: string;
  nome: string;
  marca: string;
  modelo: string;
  ano: number | null;
  kmInicial: number;
  placa: string | null;
  cor: string | null;
}

@Component({
  selector: 'app-veiculos',
  templateUrl: './veiculos.page.html',
  styleUrls: ['./veiculos.page.scss'],
  standalone: false,
})
export class VeiculosPage implements OnInit {

  veiculos: Veiculo[] = [];

  veiculoAtivoId: string | null = null;

  private readonly VEICULOS_KEY = 'veiculos';
  private readonly ATIVO_KEY = 'veiculoAtivoId';

  constructor(
    private storage: Storage,
    private alertCtrl: AlertController,
    private toastCtrl: ToastController
  ) { }

  async ngOnInit() {
    await this.storage.create();
  }

  ionViewWillEnter() {
    this.inicializarVeiculos(); 
  }

  async inicializarVeiculos(): Promise<void> {
    await this.carregarVeiculoAtivo();

    await this.carregarVeiculos();

    if (!this.veiculoAtivoId && this.veiculos.length > 0) {
      await this.selecionarVeiculo(this.veiculos[0].id);
    }
  }

  async carregarVeiculos(): Promise<void> {
    try {
      const value = await this.storage.get(this.VEICULOS_KEY);
      this.veiculos = value || [];

    } catch (error) {
      this.mostrarAlerta('Erro ao carregar veículos.', 'danger');
      console.error('Erro ao carregar veículos:', error);
    }
  }

  async carregarVeiculoAtivo(): Promise<void> {
    try {
      this.veiculoAtivoId = await this.storage.get(this.ATIVO_KEY);
    } catch (error) {
      console.error('Erro ao carregar ID do veículo ativo:', error);
    }
  }

  async selecionarVeiculo(id: string): Promise<void> {
    await this.storage.set(this.ATIVO_KEY, id);
    this.veiculoAtivoId = id; 
    this.mostrarAlerta(`Veículo "${this.veiculos.find(v => v.id === id)?.nome}" selecionado!`, 'dark' as any);
  }

  async abrirFormularioCadastro(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Novo Veículo',
      inputs: [
        {
          name: 'nome',
          type: 'text',
          placeholder: 'Nome (Ex: Gol 2018)',
        },
        {
          name: 'kmInicial',
          type: 'number',
          placeholder: 'KM Inicial (Odômetro)',
        },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Salvar',
          handler: (data) => {

            const km = parseFloat(data.kmInicial);

            if (!data.nome || isNaN(km) || km <= 0) {
              this.mostrarAlerta('Preencha os campos Nome e KM Inicial válidos.', 'warning');
              return false; 
            }

            this.adicionarVeiculo(data.nome, km);
            return; 
          },
        },
      ],
    });

    await alert.present();
  }


  async adicionarVeiculo(nome: string, kmInicial: number): Promise<void> {
    try {
      const novoId = new Date().getTime().toString();

      const novoVeiculo: Veiculo = {
        id: novoId,
        nome: nome,
        kmInicial: kmInicial,
        marca: 'N/A', 
        modelo: 'N/A',
        ano: null,
        placa: null,
        cor: null,
      };

      this.veiculos.push(novoVeiculo);
      await this.storage.set(this.VEICULOS_KEY, this.veiculos);

      if (!this.veiculoAtivoId) {
        await this.selecionarVeiculo(novoId);
      }

      this.mostrarAlerta('Veículo adicionado com sucesso!', 'success');

    } catch (error) {
      this.mostrarAlerta('Erro ao adicionar veículo.', 'danger');
      console.error('Erro ao adicionar veículo:', error);
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

  async confirmarExclusaoVeiculo(id: string, nome: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Confirmar Exclusão',
      message: `Tem certeza que deseja excluir o veículo "${nome}"? Isso apagará **TODOS** os abastecimentos relacionados a ele.`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Excluir',
          cssClass: 'danger',
          handler: () => {
            this.deletarVeiculo(id);
          },
        },
      ],
    });

    await alert.present();
  }

  async deletarVeiculo(id: string): Promise<void> {
    try {
      const listaAtualizada = this.veiculos.filter(item => item.id !== id);

      this.veiculos = listaAtualizada;
      await this.storage.set(this.VEICULOS_KEY, this.veiculos);

      if (this.veiculoAtivoId === id) {

        if (listaAtualizada.length > 0) {
          await this.selecionarVeiculo(listaAtualizada[0].id);
        } else {
          await this.storage.remove(this.ATIVO_KEY);
          this.veiculoAtivoId = null;
        }
      }

      await this.storage.remove(`abastecimentos_${id}`);


      this.mostrarAlerta('Veículo e histórico apagados com sucesso!', 'dark' as any);

    } catch (error) {
      this.mostrarAlerta('Erro ao excluir veículo.', 'danger');
      console.error('Erro ao deletar veículo:', error);
    }
  }
}