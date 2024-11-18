import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form'
import './styles.css'

// CONFIG
import api from '../../config/api';

// COMPONENT
import Loading from '../Loading/Loading';

// ALERTS
import Swal from 'sweetalert2';

interface Produto {
    id?: number;
    nome: string;
    descricao: string;
    preco: string;
}

function FormFour() {
    const {
        register,
        handleSubmit,
    
        formState: { errors },
    } = useForm<Produto>()
    const [produtos, setProdutos] = useState<Produto[]>([]);
    const [formValues, setFormValues] = useState<Produto>({
        id: 0,
        nome: '',
        descricao: '',
        preco: ''
    })
    const [produtoId, setProdutoId] = useState<number | null>(null);
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        listaProdutos();
    }, []);

    {/* LISTA PRODUTOS */ }
    const listaProdutos = async () => {
        try {
            const response = await api.get('/produtos', {
            });
            setProdutos(response.data);
            setLoading(false);
        } catch (error) {
            console.log('Erro ao buscar os dados', error);
        }
    };

    {/* ADICIONA PRODUTO */ }
    const adicionarProduto = async (data: Produto) => {
        try {
            const response = await api.post('/produtos/',
                data
            );
            setProdutos((prevProdutos) => [...prevProdutos, response.data]);
            setFormValues({
                nome: "",
                descricao: "",
                preco: ""
            })
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Produto adicionado com sucesso",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.log('Erro ao adicionar os dados', error);
        }
    };

    {/* ATUALIZAR PRODUTO */ }
    const atualizarProduto = async (data: Produto) => {

        try {
            const response = await api.put(`/produtos/${produtoId}`,
                data
            );
            const produtoAtualizado = response.data;

            setProdutos((prevProdutos) =>
                prevProdutos.map((produto) =>
                    produto.id === produtoId ? produtoAtualizado : produto
                )
            );
            setProdutoId(null);
            setFormValues({
                nome: "",
                descricao: "",
                preco: ""
            })
            Swal.fire({
                position: "center",
                icon: "success",
                title: "Produto atualizado com sucesso",
                showConfirmButton: false,
                timer: 1500
            });
        } catch (error) {
            console.log('Erro ao atualizar os dados', error);
        }
    };

    const editarProduto = (produto: Produto) => {
        setFormValues({
            id: produto.id,
            nome: produto.nome || "",
            descricao: produto.descricao || "",
            preco: produto.preco.toString() || ""
        })
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
                    await api.delete(`/produtos/${id}`);
                    Swal.fire("Deletado!", "O Produto foi deletada.", "success");
                    setProdutos((prevProdutos) =>
                        prevProdutos.filter((produto) => produto.id !== id)
                    );
                } catch (error) {
                    console.log('Erro ao excluir o produto', error);
                }
            }
        });
    };

    return (
        <div className='container'>
            <h1>FormFour</h1>
            <form className="form_container" onSubmit={handleSubmit(produtoId ? atualizarProduto : adicionarProduto)}>
                <label className="text">Nome</label>
                <input
                    className={`input_text`}
                    {...register("nome", { required: "nome-é-obrigatório" })}
                    defaultValue={formValues.nome}
                />
                {errors.nome && <span className="error-message">{errors.nome.message}</span>}

                <label className="text">Descrição</label>
                <input
                    className={`input_text`}
                    {...register("descricao", { required: "descrição-é-obrigatória" })}
                    defaultValue={formValues.descricao}
                />
                {errors.descricao && (
                    <span className="error-message">{errors.descricao.message}</span>
                )}

                <label className="text">Preço</label>
                <input
                    className={`input_text`}
                    {...register("preco", {
                        required: "preço-é-obrigatório",
                    })}
                    defaultValue={formValues.preco}
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
                                <tr key={produto.id}>
                                    <td>{produto.nome}</td>
                                    <td>{produto.descricao}</td>
                                    <td>{produto.preco}</td>
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

export default FormFour;
