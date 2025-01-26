const products = JSON.parse(localStorage.getItem('products')) || [];

// Salva os produtos no localStorage
function saveProducts() {
  localStorage.setItem('products', JSON.stringify(products));
}

// Renderiza os produtos na página do administrador
function displayAdminProducts() {
  const productList = document.querySelector('#product-list ul');
  if (productList) {
    productList.innerHTML = '';
    products.forEach((product, index) => {
      const li = document.createElement('li');
      li.className = 'bg-gray-200 p-4 rounded flex justify-between items-center';
      li.innerHTML = `
        <div>
          <p class='font-bold'>${product.name}</p>
          <p>${product.description}</p>
          <p class='text-green-500'>R$ ${product.price.toFixed(2)}</p>
        </div>
        <button onclick="removeProduct(${index})" class="text-red-500 hover:underline">Remover</button>
      `;
      productList.appendChild(li);
    });
  }
}

// Renderiza os produtos na página do cliente
function displayClientProducts() {
  const productDisplay = document.getElementById('product-display');
  if (productDisplay) {
    productDisplay.innerHTML = '';
    products.forEach((product, index) => {
      const div = document.createElement('div');
      div.className = 'bg-white p-4 rounded shadow';
      div.innerHTML = `
        <img src="${product.image}" alt="Imagem do Produto" class="w-full h-32 object-cover rounded mb-4">
        <h3 class="font-bold text-lg">${product.name}</h3>
        <p>${product.description}</p>
        <p class="text-green-500 font-semibold">R$ ${product.price.toFixed(2)}</p>
        <button onclick="addToCart(${index})" class="mt-4 w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">
          Adicionar ao Carrinho
        </button>
      `;
      productDisplay.appendChild(div);
    });
  }
}

// Função de renderização unificada
function displayProducts() {
  displayAdminProducts();
  displayClientProducts();
}

// Adiciona um produto
document.getElementById('product-form')?.addEventListener('submit', function (e) {
  e.preventDefault();

  const name = document.getElementById('product-name').value;
  const description = document.getElementById('product-description').value;
  const price = parseFloat(document.getElementById('product-price').value);
  const imageFile = document.getElementById('product-image').files[0];

  if (!imageFile) {
    alert('Por favor, selecione uma imagem para o produto.');
    return;
  }

  const reader = new FileReader();
  reader.onload = function (event) {
    const image = event.target.result; // URL da imagem

    const product = { name, description, price, image };
    products.push(product);
    saveProducts();
    displayProducts();
    document.getElementById('product-form').reset();
  };

  reader.readAsDataURL(imageFile); // Lê o arquivo e cria uma URL
});

// Remove um produto
function removeProduct(index) {
  products.splice(index, 1);
  saveProducts();
  displayProducts();
}

// Exibe o carrinho na página do cliente
const cart = [];

function addToCart(index) {
  cart.push(products[index]);
  displayCart();
}

function displayCart() {
  const cartItems = document.getElementById('cart-items');
  const totalPrice = document.getElementById('total-price');
  let total = 0;

  cartItems.innerHTML = '';
  cart.forEach((product, index) => {
    const li = document.createElement('li');
    li.className = 'flex justify-between bg-gray-200 p-4 rounded';
    li.innerHTML = `
      <div>
        <p class='font-bold'>${product.name}</p>
        <p class='text-green-500'>R$ ${product.price.toFixed(2)}</p>
      </div>
      <button onclick="removeFromCart(${index})" class="text-red-500 hover:underline">Remover</button>
    `;
    cartItems.appendChild(li);
    total += product.price;
  });

  totalPrice.textContent = `Total: R$ ${total.toFixed(2)}`;
}

function removeFromCart(index) {
  cart.splice(index, 1); // Remove o item pelo índice
  displayCart(); // Atualiza a exibição do carrinho
}

// Funcionalidade do botão de WhatsApp
document.getElementById('checkout-btn')?.addEventListener('click', function () {
  if (cart.length === 0) {
    alert('Seu carrinho está vazio! Adicione produtos antes de finalizar a compra.');
    return;
  }

  let message = 'Olá! Gostaria de finalizar a compra com os seguintes produtos:\n\n';
  let total = 0;

  cart.forEach((product, index) => {
    message += `${index + 1}. ${product.name} - R$ ${product.price.toFixed(2)}\n`;
    total += product.price;
  });

  message += `\nTotal: R$ ${total.toFixed(2)}\n\nObrigado!`;

  // Codifique a mensagem para a URL
  const encodedMessage = encodeURIComponent(message);

  // Substitua pelo número de WhatsApp correto
  const whatsappNumber = '5516996378308'; // Exemplo: +55 (11) 99999-9999
  window.open(`https://wa.me/${whatsappNumber}?text=${encodedMessage}`, '_blank');
});

// Carrega os produtos salvos no início
displayProducts();
