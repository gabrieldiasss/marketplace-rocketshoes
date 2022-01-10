import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product, Stock } from '../types';

interface CartProviderProps {
	children: ReactNode;
}

interface UpdateProductAmount {
	productId: number;
	amount: number;
}

interface CartContextData {
	cart: Product[];
	addProduct: (productId: number) => Promise<void>;
	removeProduct: (productId: number) => void;
	updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {

	// Estado que armazena a quantidade de produtos distintos (Carrinho)
	const [cart, setCart] = useState<Product[]>(() => {

		// Variável que vai buscar os dados do localStorage
		const storagedCart = localStorage.getItem('@RocketShoes:cart') // Buscar dados do localStorage

		// A variável pode ser STRING ou NULL, se NÃO for null ela entrará nesse if e vamos retornar o valor
		if (storagedCart) {
       // E dentro do IF vamos tratar a variável para converter a informação ( carrinho - que está do tipo string) ao estado original (retornando para o formato de array)

		return JSON.parse(storagedCart);
}

	// Se ela for NULL irá retornar um array vázio
	return [];
});

const addProduct = async (productId: number) => {

	try {

		// o UpdatedCart é um novo array com os valores do cart, qualquer altereção que eu fazer no UPDATEDCART não irá refletir no CART
		const updatedCart = [...cart]

		// Verificar se o produto já existe no carrinho pra incrementar a quantidade dele ou adicionar um novo produto no carrinho

		// Se o ID do product for o mesmo que recebi por parametro na função quer dizer que já existe, se não for o produto não existe no carrinho
		const productExists = updatedCart.find(product => product.id === productId)


		// Verificação do estoque

			// Estamos pegando o ID de cada produto (para identificar apenas 1 produto)
			const stock = await api.get(`/stock/${productId}`)
			// Agora estamos acessando a quantidade do estoque de determinado produto
			const stockAmount = stock.data.amount;

			// Quantidade atual do produto no carrinho, se o produto já existe no carrinho, vamos pegar a quantidade dele, se não existe no carrinho quantidade é 0
			const currentAmount = productExists ? productExists.amount : 0;

			// Aqui estamos acrescentando a quantidade de produtos (quantidade desejada)
			const amount = currentAmount + 1

			// Se a quantidade desejada for maior que o limite do estoque
			if (amount > stockAmount) {
				// Irá dar essa mensagem de erro
				toast.error("Quantidade solicitada fora de estoque")
				return
			}

			// Vamos verificar se o produto realmente existe
			if (productExists) {
				// Vamos atualizar a quantidade do produto
				// Qualquer altereção que eu faça no `productExists` reflete no `updatedCart`
				productExists.amount = amount
			} else {
				// Se ele não existe, adicionamos o novo produto ao carrinho
				const product = await api.get(`/products/${productId}`)

				// Precisamos pegar todos os dados retornados da api e criar um campo `amount` com valor 1, pq é a 1° vez que ele tá sendo adicionado no carrinho

				const newProduct = {
					...product.data,
					amount: 1
				}

				updatedCart.push(newProduct)
			}

		// Vamos setar esse estado para perpetuar
		setCart(updatedCart)	

		// Vamos converter o `updatedCart` para string, pq o localStorage não permite dados de outros tipos
		localStorage.setItem('@RocketShoes:cart', JSON.stringify(updatedCart)) 
		 
	} catch {
		toast.error("Erro na adição do produto")
	}
};

const removeProduct = (productId: number) => {
	try {
		// TODO
	} catch {
		// TODO
	}
};

const updateProductAmount = async ({
	productId,
	amount,
}: UpdateProductAmount) => {
	try {
		// TODO
	} catch {
		// TODO
	}
};

return (
	<CartContext.Provider
		value={{ cart, addProduct, removeProduct, updateProductAmount }}
	>
		{children}
	</CartContext.Provider>
);
}

export function useCart(): CartContextData {
	const context = useContext(CartContext);

	return context;
}
