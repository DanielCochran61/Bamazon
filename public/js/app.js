$(document).ready(function () {
    const purchaseOrder = [];
    let isFillOrder = true;
    let totalPrice = 0;
    const render = function (products) {
        $('#productDetails').empty();
        for (let i = 0; i < products.length; i++) {
            const productRow = $('<tr>').addClass('productRow');
            const qtyCol = $('<th>');
            qtyCol.append(`<input type="number" min="1" id="qtyRow${i + 1}">`);
            productRow.append(qtyCol);
            const productCol = $('<td>');
            productCol.text(`${products[i].name}`);
            productRow.append(productCol);
            const priceCol = $('<td>');
            priceCol.text(`${products[i].price}`);
            productRow.append(priceCol);
            const avilQtyCol = $('<td>');
            avilQtyCol.text(`${products[i].quantity}`);
            productRow.append(avilQtyCol);
            const cartCol = $('<td>');
            const cartButton = $('<button>').addClass('btn btn-warning cart');
            cartButton.attr('cart-name', `cart${i + 1}`);
            cartButton.attr('product-id', `${products[i].id}`);
            cartButton.text('Add to Cart');
            cartCol.append(cartButton);
            productRow.append(cartCol);
            $('#productDetails').append(productRow);
        }
    }
    const getAllProducts = function () {
        $.ajax({
            method: 'GET',
            url: 'api/products'
        }).then(function (res) {
            render(res);
        });
    }
    getAllProducts();

    const calculateTotal = function (price) {
        totalPrice += parseInt(price);
    }
    const updateInventoryQty = function (pId, newData, itemTotal) {
        $.ajax({
            method: 'PUT',
            url: `/api/products/${pId}`,
            data: newData
        }).then(function (data) {
            getAllProducts();
            calculateTotal(itemTotal);
        });
    }
    const fillOrder = function () {
        for (let i = 0; i < purchaseOrder.length; i++) {
            const poId = purchaseOrder[i].id;
            const poQty = purchaseOrder[i].qty;
            const itemTotal = purchaseOrder[i].total;
            $.get(`/api/product/${poId}`)
                .then(function (data) {
                    const newQty = parseInt(data.avail_quantity) - parseInt(poQty);
                    const newProductData = {
                        name: data.name,
                        department: data.department,
                        price: data.price,
                        avail_quantity: newQty
                    };
                    updateInventoryQty(poId, newProductData, itemTotal);
                });
        }
    }
    const resetPurchaseOrder = function () {
        for (let i = purchaseOrder.length; i > 0; i--) {
            purchaseOrder.pop();
        }
        totalPrice = 0;
        setIsFillOrder(true);
    }
    const displayMessage = function () {
        $('#poResults').removeClass('alert alert-danger');
        $('#poResults').addClass('alert alert-info');
        $('#poResults').text(`Thank you for your order! Your total is $${totalPrice}!`);
        resetPurchaseOrder();
    }
    const validateOrder = function (e) {
        e.preventDefault();
        if (isFillOrder) {
            fillOrder();
            setTimeout(displayMessage, 500);
        } else {
            $('#poResults').removeClass('alert alert-info');
            $('#poResults').addClass('alert alert-danger');
            $('#poResults').text('Insufficient quantity!');
            resetPurchaseOrder();
        }
    }
    const clearMessage = function () {
        $('#poResults').removeClass('alert alert-info');
        $('#poResults').removeClass('alert alert-danger');
        $('#poResults').text('');
    }
    const viewCart = function (e) {
        e.preventDefault();
        $('#purchaseOrder').empty();
        clearMessage();
        for (let i = 0; i < purchaseOrder.length; i++) {
            $('#purchaseOrder').append(`<tr>
        <th scope="row">${i + 1}</th>
        <td>${purchaseOrder[i].qty}</td>
        <td>${purchaseOrder[i].item}</td>
        <td>${purchaseOrder[i].price}</td>
        <td>${purchaseOrder[i].total}</td>
        </tr>`);
        }
    }
    const setIsFillOrder = function (fill) {
        isFillOrder = fill;
    }
    const addCartItem = function (productId, qtyVal) {
        $.get(`/api/product/${productId}`)
            .then(function (data) {
                let cartQty = qtyVal;
                const total = cartQty * data.price;
                const purchaseItem = {
                    id: productId,
                    qty: cartQty,
                    item: data.name,
                    price: data.price,
                    total: total.toFixed(2)
                }
                const idList = [];
                for (let i = 0; i < purchaseOrder.length; i++) {
                    idList.push(purchaseOrder[i].id);
                }
                if (!idList.includes(productId)) {
                    purchaseOrder.push(purchaseItem);
                } else {
                    for (let i in purchaseOrder) {
                        if (purchaseOrder[i].id == productId) {
                            const oldQty = purchaseOrder[i].qty;
                            cartQty = parseInt(qtyVal) + parseInt(oldQty);
                            const newTotal = cartQty * data.price;
                            purchaseOrder.splice(i, 1, {
                                id: productId,
                                qty: cartQty,
                                item: data.name,
                                price: data.price,
                                total: newTotal.toFixed(2)
                            });
                        }
                    }
                }
                if (data.avail_quantity < cartQty) {
                    setIsFillOrder(false);
                }
            });
    }
    const addToCart = function (e) {
        e.preventDefault();
        const productId = $(this).attr('product-id');
        const cartVal = $(this).attr('cart-name');
        const qtyRow = `qtyRow${cartVal.substring(4)}`;
        const qtyVal = $(`#${qtyRow}`).val();
        addCartItem(productId, qtyVal);
    }
    $(this).on('click', '.cart', addToCart);
    $('#viewCart').on('click', viewCart);
    $('#placeOrder').on('click', validateOrder);
});