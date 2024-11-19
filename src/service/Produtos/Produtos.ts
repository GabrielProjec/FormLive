
import api from "../../config/api"; 
import { Produto } from "./types";

export const getProdutos = async () => {
    const response = await api.get("/produtos");
    return response.data;
};

export const addProduto = async (data: Produto) => {
    const response = await api.post("/produtos", data);
    return response.data;
};

export const attProduto = async (id: number, data: Produto) => {
    const response = await api.put(`/produtos/${id}`, data);
    return response.data;
};

export const deleteProduto = async (id: number) => {
    await api.delete(`/produtos/${id}`);
};