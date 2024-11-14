import { useState, useEffect } from 'react'
import './style.css'

function FormOne() {

    const [produtos, setProdutos] = useState([])

    useEffect(() => {
        listaProdutos()
    }, [])

    // GETPRODUTOS
    const listaProdutos = async () => {
        try {
            const response = await fetch('http://localhost:5000/produtos', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const data = await response.json()
            setProdutos(data)
            console.log(data)
        } catch (error) {
            console.log("erro ao buscar os dados", error)
        }
    }


    const handleSubmit = (e: any) => {
        e.preventDefault()
        alert('CLICOU')
    }

    return (
        <div className='container' >
            <h1>FormOne</h1>
            <form className='form_container' onSubmit={handleSubmit} >
                <label className='text' >Nome</label>
                <input className='input_text' />

                <label className='text'>Descrição</label>
                <input className='input_text' />

                <label className='text'>Preço</label>
                <input className='input_text' />
                <button>Cadastrar</button>
            </form>
            <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Descrição</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map((produto) => (
                        <tr key={produto.id}>
                        <td>{produto.nome}</td>
                        <td>{produto.descricao}</td>
                        <td>{produto.preco}</td>
                        <td>
                            <button>
                                Editar
                            </button>
                            <button>
                                Excluir
                            </button>
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default FormOne;