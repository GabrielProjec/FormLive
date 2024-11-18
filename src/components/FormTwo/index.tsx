import { useState, useEffect } from 'react';
import api from '../../config/api';
import './styles.css'

interface Produto {
    id: number;
    nome: string;
    descricao: string;
    preco: string;
}

function FormTwo() {
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [nome, setNome] = useState('');
    const [descricao, setDescricao] = useState('');
    const [preco, setPreco] = useState('');
    const [produtoId, setProdutoId] = useState<number | null>(null);

    useEffect(() => {
        listaProdutos();
    }, []);

       {/* LISTA PRODUTOS */}
    const listaProdutos = async () => {
        try {
            const response = await api.get('/produtos', {
            });
            setProdutos(response.data);
        } catch (error) {
            console.log('Erro ao buscar os dados', error);
        }
    };

       {/* ADICIONA PRODUTO */}
    const adicionarProduto = async (event: any) => {
        event.preventDefault();
        if (!nome || !descricao || !preco) {
            alert('Todos os campos são obrigatórios!');
            return;
        }
        try {
            const response = await api.post('/produtos/', {
                nome, descricao, preco
            });
            setProdutos((prevProdutos) => [...prevProdutos, response.data]);
            setNome('');
            setDescricao('');
            setPreco('');
        } catch (error) {
            console.log('Erro ao adicionar os dados', error);
        }
    };

       {/* ATUALIZAR PRODUTO */}
    const atualizarProduto = async (event: any) => {
        event.preventDefault();
        try {
            const response = await api.put(`/produtos/${produtoId}`, {
                nome: nome,
                descricao: descricao,
                preco: preco
            });
            const produtoAtualizado = await response.data;

            setProdutos((prevProdutos) =>
                prevProdutos.map((produto) =>
                    produto.id === produtoId ? produtoAtualizado : produto
                )
            );
            setNome('');
            setDescricao('');
            setPreco('');
            setProdutoId(null);
        } catch (error) {
            console.log('Erro ao atualizar os dados', error);
        }
    };

    const editarProduto = (produto: Produto) => {
        setNome(produto.nome);
        setDescricao(produto.descricao);
        setPreco(produto.preco);
        setProdutoId(produto.id);
    }

    {/* DELETAR PRODUTO */}
    const deletarProduto = async (id: number) => {
        const confirmar = window.confirm('Tem certeza que deseja excluir este produto?');
        if (!confirmar) return;

        try {
            await api.delete(`/produtos/${id}`, {
            });
            setProdutos((prevProdutos) =>
                prevProdutos.filter((produto) => produto.id !== id)
            );
        } catch (error) {
            console.log('Erro ao excluir o produto', error);
        }
    };

    return (
        <div className='container'>
            <h1>FormTwo</h1>
            <form className='form_container' onSubmit={produtoId ? atualizarProduto : adicionarProduto}>
                <label className='text'>Nome</label>
                <input className='input_text' value={nome} onChange={(e) => setNome(e.target.value)} />

                <label className='text'>Descrição</label>
                <input className='input_text' value={descricao} onChange={(e) => setDescricao(e.target.value)} />

                <label className='text'>Preço</label>
                <input className='input_text' value={preco} onChange={(e) => setPreco(e.target.value)} />
                <button type="submit">{produtoId ? 'Atualizar Produto' : 'Cadastrar Produto'}</button>
            </form>
            <table className='tableContainer'>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody className='bodyItems'>
                    {produtos.map((produto) => (
                        <tr key={produto.id}>
                            <td>{produto.nome}</td>
                            <td>{produto.descricao}</td>
                            <td>{produto.preco}</td>
                            <td>
                                <button onClick={() => editarProduto(produto)}>Editar</button>
                                <button onClick={() => deletarProduto(produto.id)}>Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default FormTwo;
