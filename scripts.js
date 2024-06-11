document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const updateCartCount = () => {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.reduce((acc, item) => acc + item.quantity, 0);
        }
    };

    const addToCart = (product) => {
        const existingProductIndex = cart.findIndex(item => item.id === product.id);
        if (existingProductIndex !== -1) {
            cart[existingProductIndex].quantity++;
        } else {
            cart.push(product);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        showAlert('商品已加入購物車!');
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        cart.forEach(item => {
            totalPrice += parseFloat(item.price) * item.quantity;
        });
        return totalPrice.toFixed(2);
    };

    const renderCartItems = () => {
        const cartItemsContainer = document.getElementById('cart-items');
        const checkoutButton = document.getElementById('checkout');
        cartItemsContainer.innerHTML = '';

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p>您的購物車目前是空的。</p>';
            if (checkoutButton) {
                checkoutButton.disabled = true;
            }
        } else {
            cart.forEach((item, index) => {
                const itemElement = document.createElement('div');
                itemElement.className = 'cart-item';
                itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.name}">
                    <h3>${item.name}</h3>
                    <p>價格: $${parseInt((item.price * item.quantity))}</p>
                    <div class="quantity">
                        <button class="decrease" data-index="${index}">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase" data-index="${index}">+</button>
                    </div>
                    <button class="remove-from-cart" data-index="${index}">移除</button>
                `;
                cartItemsContainer.appendChild(itemElement);
            });

            const decreaseButtons = document.querySelectorAll('.decrease');
            decreaseButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = button.getAttribute('data-index');
                    if (cart[index].quantity > 1) {
                        cart[index].quantity--;
                    } else {
                        removeFromCart(index);
                    }
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCartItems();
                    updateTotalPrice();
                    updateCartCount();
                });
            });

            const increaseButtons = document.querySelectorAll('.increase');
            increaseButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = button.getAttribute('data-index');
                    cart[index].quantity++;
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCartItems();
                    updateTotalPrice();
                    updateCartCount();
                });
            });

            const removeButtons = document.querySelectorAll('.remove-from-cart');
            removeButtons.forEach(button => {
                button.addEventListener('click', () => {
                    const index = button.getAttribute('data-index');
                    cart.splice(index, 1);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCartItems();
                    updateCartCount();
                    updateTotalPrice();
                });
            });

            if (checkoutButton) {
                checkoutButton.disabled = false;
            }
        }
    };

    const updateTotalPrice = () => {
        const totalPriceContainer = document.getElementById('total-price');
        if (totalPriceContainer) {
            totalPriceContainer.textContent = `總金額：$${parseInt(calculateTotalPrice())}`;
        }
    };

    const showAlert = (message) => {
        const alertBox = document.createElement('div');
        alertBox.className = 'alert';
        alertBox.textContent = message;
        document.body.appendChild(alertBox);

        // 設定3秒後自動移除提示框
        setTimeout(() => {
            alertBox.remove();
        }, 1000);
    };


    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productElement = button.closest('.product');
            const product = {
                id: productElement.getAttribute('data-id'),
                name: productElement.getAttribute('data-name'),
                price: parseFloat(productElement.getAttribute('data-price')),
                image: productElement.querySelector('img').src,
                quantity: 1
            };
            addToCart(product);
            updateTotalPrice();
        });
    });

    if (document.getElementById('clear-cart')) {
        document.getElementById('clear-cart').addEventListener('click', () => {
            cart = [];
            localStorage.setItem('cart', JSON.stringify(cart));
            renderCartItems();
            updateCartCount();
            updateTotalPrice();
        });
    }

    if (document.getElementById('checkout')) {
        document.getElementById('checkout').addEventListener('click', () => {
            window.location.href = 'checkout.html';
        });
    }

    // 初始化購物車數量和總金額
    updateCartCount();
    updateTotalPrice();

    // 如果在購物車頁面，渲染購物車項目和總金額
    if (document.getElementById('cart-items')) {
        renderCartItems();
    }

    // 圖片輪播
    const slides = document.querySelector('.slides');
    const slideCount = slides.children.length;
    let currentIndex = 0;

    // 創建指示器
    const indicators = document.querySelector('.slider-indicators');
    indicators.innerHTML = '';
    for (let i = 0; i < slideCount; i++) {
        const indicator = document.createElement('span');
        indicator.setAttribute('data-slide', i);
        if (i === 0) {
            indicator.classList.add('active');
        }
        indicators.appendChild(indicator);
    }

    // 自動播放
    setInterval(() => {
        currentIndex = (currentIndex + 1) % slideCount;
        showSlide(currentIndex);
    }, 5000);

    // 上一張按鈕
    document.getElementById('prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slideCount) % slideCount;
        showSlide(currentIndex);
    });

    // 下一張按鈕
    document.getElementById('next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slideCount;
        showSlide(currentIndex);
    });

    // 顯示指定的幻燈片
    const showSlide = (index) => {
        slides.style.transform = `translateX(-${index * 100}%)`;

        const indicators = document.querySelectorAll('.slider-indicators span');
        indicators.forEach((indicator, i) => {
            if (i === index) {
                indicator.classList.add('active');
            } else {
                indicator.classList.remove('active');
            }
        });
    };
});
document.addEventListener('DOMContentLoaded', () => {
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault(); // 防止表單的默認提交行為
            alert('結帳功能暫未開通，僅為示範。'); // 暫時顯示警示框，您可以在開通結帳功能後刪除此行

            // 導航到結帳成功頁面
            window.location.href = 'checkout_success.html';
        });

        const creditCardInfo = document.querySelector('.credit-card-info');
        const creditCardInputs = creditCardInfo.querySelectorAll('input');

        const paymentMethods = document.querySelectorAll('input[name="payment"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', (event) => {
                if (event.target.value === 'credit-card') {
                    creditCardInfo.style.display = 'flex';
                    creditCardInputs.forEach(input => input.setAttribute('required', 'required'));
                } else {
                    creditCardInfo.style.display = 'none';
                    creditCardInputs.forEach(input => input.removeAttribute('required'));
                }
            });
        });

        // 初始隱藏信用卡信息
        const selectedPaymentMethod = document.querySelector('input[name="payment"]:checked');
        if (selectedPaymentMethod && selectedPaymentMethod.value !== 'credit-card') {
            creditCardInfo.style.display = 'none';
            creditCardInputs.forEach(input => input.removeAttribute('required'));
        } else {
            creditCardInputs.forEach(input => input.setAttribute('required', 'required'));
        }
    }
});
