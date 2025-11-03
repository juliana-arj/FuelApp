export interface Abastecimento {
  id: string; 
  data: string; 
  quilometragem: number;
  litros: number;
  combustivel: string;
  valor: number | null;
  consumoMedio: number | null;
  custoPorKm: number | null;
}