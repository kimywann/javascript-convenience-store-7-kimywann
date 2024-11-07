class Store {
    static itemList = [
        { name: '콜라', price: 1000, quantity: 10, promotion: '탄산2+1' },
        { name: '콜라', price: 1000, quantity: 10, promotion: null },
        { name: '사이다', price: 1000, quantity: 8, promotion: '탄산2+1' },
        { name: '사이다', price: 1000, quantity: 7, promotion: null },
        { name: '오렌지주스', price: 1800, quantity: 9, promotion: 'MD추천상품' },
        { name: '탄산수', price: 1200, quantity: 5, promotion: '탄산2+1' },
        { name: '물', price: 500, quantity: 10, promotion: null },
        { name: '비타민워터', price: 1500, quantity: 6, promotion: null },
        { name: '감자칩', price: 1500, quantity: 5, promotion: '반짝할인' },
        { name: '감자칩', price: 1500, quantity: 5, promotion: null },
        { name: '초코바', price: 1200, quantity: 5, promotion: 'MD추천상품' },
        { name: '초코바', price: 1200, quantity: 5, promotion: null },
        { name: '에너지바', price: 2000, quantity: 5, promotion: null },
        { name: '정식도시락', price: 6400, quantity: 8, promotion: null },
        { name: '컵라면', price: 1700, quantity: 1, promotion: 'MD추천상품' },
        { name: '컵라면', price: 1700, quantity: 10, promotion: null },
    ];

    static promotions = [
        { name: '탄산2+1', buy: 2, get: 1, start_date: '2024-01-01', end_date: '2024-12-31'},
        { name: 'MD추천상품', buy: 1, get: 1, start_date: '2024-01-01', end_date: '2024-12-31'},
        { name: '반짝할인', buy: 1, get: 1, start_date: '2024-11-01', end_date: '2024-11-30'},
    ];

    static findItemByName(name) {
        return this.itemList.find(item => item.name === name);
    }

    static deductQuantity(name, quantity) {
        const item = this.findItemByName(name);
        if (item && item.quantity >= quantity) {
            item.quantity -= quantity;

            if (item.quantity === 0) {
                item.quantity = '재고 없음';
            }
            return false
        }
        return false;
    }

    static calculateTotalPrice(name, quantity) {
        const product = this.itemList.find(item => item.name === name);
        if (product) {
            return product.price * parseInt(quantity, 10);
        }
        return null;
    }
    
    // 상품 목록과 총 금액 계산 후 결과 반환
    static getProductsWithTotalPrice(productArray) {
        return productArray.map((data) => {
            const [name, quantity] = data.split("-");
            const totalPrice = this.calculateTotalPrice(name, quantity);

            if (totalPrice !== null) {
                return { name, quantity: parseInt(quantity, 10), totalPrice };
            }
            return null;  
        }).filter(product => product !== null);
    }
}

export default Store;