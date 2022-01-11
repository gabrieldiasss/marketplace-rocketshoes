import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
	id: number;
	title: string;
	price: number;
	image: string;
}

interface ProductFormatted extends Product {
	priceFormatted: string;
}

interface CartItemsAmount {
	[key: number]: number;
}

const Home = (): JSX.Element => {
	const [products, setProducts] = useState<ProductFormatted[]>([]);
	const { addProduct, cart } = useCart();

	// Função que deve possuir as informações da quantidade de cada produto no carrinho
	const cartItemsAmount = cart.reduce((sumAmount, product) => {

		// Mostrar a quantidade de produtos no carrinho (botão Home)

		// Criando novo objeto
		const newSumAmount = { ...sumAmount }

		// Podemos acessar a chave, depois associamos a chave do produtocls 
		newSumAmount[product.id] = product.amount

		return newSumAmount

	}, {} as CartItemsAmount)

	useEffect(() => {
		async function loadProducts() {

			// Carregar os produtos da API

			const response = await api.get<Product[]>('products')

			// Vamos usar o `map` para formatar o valor do preço (R$)
			const data = response.data.map(product => ({
				...product,
				priceFormatted: formatPrice(product.price)
			}))

			setProducts(data)
		}

		loadProducts();
	}, []);

	function handleAddProduct(id: number) {
		// Adiconar produto (pela home)
		addProduct(id)
	}

	return (
		<ProductList>
			{products.map(product => (
				<li key={product.id} >
					<img src={product.image} alt={product.title} />
					<strong>Tênis de Caminhada Leve Confortável</strong>
					<span>{product.priceFormatted}</span>
					<button
						type="button"
						data-testid="add-product-button"
						onClick={() => handleAddProduct(product.id)}
					>
						<div data-testid="cart-product-quantity">
							<MdAddShoppingCart size={16} color="#FFF" />
							{cartItemsAmount[product.id] || 0} 
						</div>

						<span>ADICIONAR AO CARRINHO</span>
					</button>
				</li>
			))}
		</ProductList>
	);
};

export default Home;
