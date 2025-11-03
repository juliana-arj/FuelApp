import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

import { Veiculo } from '../veiculos/veiculos.page'; 
import { Abastecimento } from '../abastecimento.interface';


@Injectable({
  providedIn: 'root'
})
export class VeiculosService {
 
  private readonly VEICULOS_KEY = 'veiculos';
  private readonly ATIVO_KEY = 'veiculoAtivoId';
  private readonly ABASTECIMENTOS_PREFIX = 'abastecimentos_'; 

  constructor(private storage: Storage) {
    this.storage.create();
  }

  async getVeiculoAtivoId(): Promise<string | null> {
    return await this.storage.get(this.ATIVO_KEY);
  }

  async getVeiculoAtivo(): Promise<Veiculo | null> {
    const ativoId = await this.getVeiculoAtivoId();
    if (!ativoId) return null;
    
    const veiculos: Veiculo[] = await this.storage.get(this.VEICULOS_KEY);
    
    if (veiculos) {
      return veiculos.find(v => v.id === ativoId) || null;
    }
    return null;
  }

  async getHistoricoAbastecimento(veiculoId: string): Promise<Abastecimento[]> {
    const key = this.ABASTECIMENTOS_PREFIX + veiculoId;
    const historico: Abastecimento[] = await this.storage.get(key); 
    return historico || [];
  }
  
  async getKmAnteriorParaCalculo(): Promise<{ km: number | null, nomeVeiculo: string | null }> {
    const veiculoAtivo = await this.getVeiculoAtivo();

    if (!veiculoAtivo) {
      return { km: null, nomeVeiculo: null };
    }

    const historico = await this.getHistoricoAbastecimento(veiculoAtivo.id);

    if (historico.length > 0) {
      const ultimoAbastecimento = historico[0]; 
      
      return { 
        km: ultimoAbastecimento.quilometragem, 
        nomeVeiculo: veiculoAtivo.nome 
      };

    } else {
      return { 
        km: veiculoAtivo.kmInicial, 
        nomeVeiculo: veiculoAtivo.nome 
      };
    }
  }
}