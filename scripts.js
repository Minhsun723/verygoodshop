document.addEventListener('DOMContentLoaded', () => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const updateCartCount = () => {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = cart.length;
        }
    };

    const addToCart = (product) => {
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
    };

    const calculateTotalPrice = () => {
        let totalPrice = 0;
        cart.forEach(item => {
            totalPrice += parseFloat(item.price);
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
                    <p>價格: $${item.price}</p>
                    <button class="remove-from-cart" data-index="${index}">移除</button>
                `;
                cartItemsContainer.appendChild(itemElement);
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

    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const productElement = button.closest('.product');
            const product = {
                id: productElement.getAttribute('data-id'),
                name: productElement.getAttribute('data-name'),
                price: parseFloat(productElement.getAttribute('data-price')),
                image: productElement.querySelector('img').src
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

    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('結帳功能暫未開通。');
            window.location.href = 'checkout_success.html';
        });

        const paymentMethods = document.querySelectorAll('input[name="payment"]');
        paymentMethods.forEach(method => {
            method.addEventListener('change', (event) => {
                const creditCardInfo = document.querySelector('.credit-card-info');
                if (event.target.value === 'credit-card') {
                    creditCardInfo.style.display = 'block';
                } else {
                    creditCardInfo.style.display = 'none';
                }
            });
        });

        // 初始隱藏或顯示信用卡信息
        const selectedPaymentMethod = document.querySelector('input[name="payment"]:checked').value;
        const creditCardInfo = document.querySelector('.credit-card-info');
        if (selectedPaymentMethod === 'credit-card') {
            creditCardInfo.style.display = 'block';
        } else {
            creditCardInfo.style.display = 'none';
        }
    }
});
