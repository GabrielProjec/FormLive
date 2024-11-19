import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import { currencyFormat } from '../../helpers/currencyFormat';
import {zodResolver} from '@hookform/resolvers/zod'
import {Produto, produtoSchema} from '../../service/Produtos/types'
import {addProduto, attProduto, deleteProduto, getProdutos} from '../../service/Produtos/Produtos'
import './styles.css'

// COMPONENT
import Loading from '../Loading/Loading';

// ALERTS
import Swal from 'sweetalert2';



function FormFive() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm<Produto>({
        resolver: zodResolver(produtoSchema),
    })
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [produtoId, setProdutoId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        listaProdutos();
    }, []);

    {/* LISTA PRODUTOS */ }
    const listaProdutos = async () => {
        try {
            const data = await getProdutos();
            setProdutos(data)
            setLoading(false)
        } catch (error) {
            console.error("Erro ao buscar os dados", error);
    };
}

    {/* ADICIONA PRODUTO */ }
    const adicionarProduto = async (data: Produto) => {
        try {
            const response = await addProduto(data);
            setProdutos((prevProdutos) => [...prevProdutos, response]);
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Produto adicionado com sucesso",
                showConfirmButton: false,
                timer: 1500
            });
            // Limpar os valores do formulário
            reset({
                nome: "",
                descricao: "",
                preco: "",
            });
        } catch (error) {
            console.log('Erro ao adicionar os dados', error);
        }
    };

    {/* ATUALIZAR PRODUTO */ }
    const atualizarProduto = async (data: Produto) => {
        if (!produtoId) return; // Verifica se o produtoId está definido

        try {
            // Envia a atualização para a API
            const response = await attProduto(produtoId, data);
            const produtoAtualizado = response.data;
            console.log(response.data)

            // Atualiza o estado local de produtos
            setProdutos((prevProdutos) =>
                prevProdutos.map((produto) =>
                    produto.id === produtoId ? produtoAtualizado : produto
                )
            );
            // Limpa o ID do produto sendo editado
            setProdutoId(null);
            reset({
                nome: "",
                descricao: "",
                preco: "",
            });
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Produto atualizado com sucesso",
                showConfirmButton: false,
                timer: 1500,
            });
        } catch (error) {
            console.error('Erro ao atualizar os dados', error);

            // Exibe mensagem de erro
            Swal.fire({
                position: "center",
                icon: "error",
                title: "Erro ao atualizar o produto",
                text: "Verifique os dados e tente novamente.",
                showConfirmButton: true,
            });
        }
    };

    const editarProduto = (produto: Produto) => {
        console.log(produto)
        // Atualiza os valores no formulário
        reset({
            nome: produto.nome ,
            descricao: produto.descricao ,
            preco: produto.preco ,
        });
        setProdutoId(produto.id || null);
    }

    {/* DELETAR PRODUTO */ }
    const deletarProduto = async (id: number) => {
        Swal.fire({
            title: "Você tem certeza?",
            text: "Não será possível reverter esta ação!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Sim, deletar!",
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteProduto(id);
                    setProdutos((prevProdutos) =>
                        prevProdutos.filter((produto) => produto.id !== id)
                );
                Swal.fire("Deletado!", "O Produto foi deletada.", "success");
                } catch (error) {
                    console.log('Erro ao excluir o produto', error);
                }
            }
        });
    };

    return (
        <div className='container'>
            <h1>FormFive</h1>
            <form className="form_container" onSubmit={handleSubmit(produtoId ? atualizarProduto : adicionarProduto)}>
                <label className="text">Nome</label>
                <input
                    className={`input_text`}
                    {...register("nome")}
                />
                {errors.nome && <span className="error-message">{errors.nome.message}</span>}

                <label className="text">Descrição</label>
                <input
                    className={`input_text`}
                    {...register("descricao")}
                />
                {errors.descricao && (
                    <span className="error-message">{errors.descricao.message}</span>
                )}

                <label className="text">Preço</label>
                <input
                    className={`input_text`}
                    {...register("preco")}
                />
                {errors.preco && <span className="error-message">{errors.preco.message}</span>}

                <button type="submit">
                    {produtoId ? "Atualizar Produto" : "Cadastrar Produto"}
                </button>
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
                    {loading ? (
                        <tr>
                            <td colSpan={6}>
                                <Loading />
                            </td>
                        </tr>
                    ) :
                        produtos.length > 0 ? (
                            produtos.map((produto) => (
                                <tr key={produto.id} >
                                    <td>{produto.nome}</td>
                                    <td>{produto.descricao}</td>
                                    <td>{currencyFormat(Number(produto.preco))}</td>
                                    <td>
                                        <button onClick={() => editarProduto(produto)}>Editar</button>
                                        <button onClick={() => {
                                            if (produto.id !== undefined) {
                                                deletarProduto(produto.id);
                                            } else {
                                                console.error("O ID do produto está indefinido.");
                                            }
                                        }}>Excluir</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <td>
                                <p>Não há produtos cadastrados</p>
                            </td>
                        )}
                </tbody>
            </table>
        </div>
    );
}

export default FormFive;
