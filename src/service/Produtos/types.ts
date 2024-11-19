import { z } from "zod";

// Definição do esquema de validação com Zod
export const produtoSchema = z.object({
    id: z.number().optional(), // O ID é opcional porque pode não estar presente em novos produtos
    nome: z.string().min(3, { message: "O nome deve ter pelo menos 3 caracteres" }),
    descricao: z
        .string()
        .min(5, { message: "A descrição deve ter pelo menos 5 caracteres" }),
    preco: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, { message: "O preço deve ser um número válido" }),
});

// Define o tipo Produto inferido a partir do esquema
export type Produto = z.infer<typeof produtoSchema>;