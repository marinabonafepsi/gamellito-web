export interface ProdutoFisico {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  categoria: 'pelucia' | 'roupa' | 'adesivo' | 'educativo';
  categoriaLabel: string;
}

export const CATEGORIAS_PRODUTOS = [
  { id: 'todos', label: 'Todos' },
  { id: 'pelucia', label: 'Pelúcia' },
  { id: 'roupa', label: 'Roupas' },
  { id: 'adesivo', label: 'Adesivos' },
  { id: 'educativo', label: 'Educativo' },
] as const;

export const PRODUTOS_FISICOS: ProdutoFisico[] = [
  { id: 'pd1', nome: 'Pelúcia Gamellito 30cm', descricao: 'Macia, bordada, pronta pra abraçar.', preco: 129.9, categoria: 'pelucia', categoriaLabel: 'Pelúcia' },
  { id: 'pd2', nome: 'Pelúcia Gamellito Mini', descricao: 'Versão de bolso, 15cm.', preco: 69.9, categoria: 'pelucia', categoriaLabel: 'Pelúcia' },
  { id: 'pd3', nome: 'Camiseta Gamellito Infantil', descricao: '100% algodão, estampa oficial.', preco: 79.9, categoria: 'roupa', categoriaLabel: 'Roupa' },
  { id: 'pd4', nome: 'Moletom Zaccari Explorer', descricao: 'Quentinho, com capuz.', preco: 149.9, categoria: 'roupa', categoriaLabel: 'Roupa' },
  { id: 'pd5', nome: 'Cartela de Adesivos', descricao: '12 adesivos à prova d\'água.', preco: 19.9, categoria: 'adesivo', categoriaLabel: 'Adesivo' },
  { id: 'pd6', nome: 'Kit 3 Cartelas de Adesivos', descricao: '36 adesivos, temas variados.', preco: 49.9, categoria: 'adesivo', categoriaLabel: 'Adesivo' },
  { id: 'pd7', nome: 'Livro A Chegada do Gamellito', descricao: 'Livro ilustrado sobre o diagnóstico.', preco: 59.9, categoria: 'educativo', categoriaLabel: 'Educativo' },
  { id: 'pd8', nome: 'Cartilha Aprendendo com o Gamellito', descricao: 'Guia prático para famílias.', preco: 34.9, categoria: 'educativo', categoriaLabel: 'Educativo' },
  { id: 'pd9', nome: 'Kit Diário de Bordo', descricao: 'Caderno + adesivos de registro.', preco: 44.9, categoria: 'educativo', categoriaLabel: 'Educativo' },
];

export function getProdutoFisico(id: string): ProdutoFisico | undefined {
  return PRODUTOS_FISICOS.find((p) => p.id === id);
}
