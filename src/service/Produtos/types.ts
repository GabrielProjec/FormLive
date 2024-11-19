import { z } from "zod";

export const produtoSchema = z.object({
    id: z.number().optional(),
    nome: z.string().min(3, { message: "o-nome-deve-ter-no-minimo-3-digitos" }),
    descricao: z
        .string()
        .min(5, { message: "a-descrição-deve-ter-no-minimo-5-digitos" }),
    preco: z
        .string()
        .regex(/^\d+(\.\d{1,2})?$/, { message: "o-preço-deve-ser-valido" }),
});

export type Produto = z.infer<typeof produtoSchema>;