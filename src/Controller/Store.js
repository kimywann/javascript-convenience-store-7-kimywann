import { DateTimes } from "@woowacourse/mission-utils";

class Store {
    static itemList = [
        { name: '콜라', price: 1000, quantity: 10, promotion: '탄산2+1' },
        { name: '콜라', price: 1000, quantity: 10, promotion: null },
        { name: '사이다', price: 1000, quantity: 8, promotion: '탄산2+1' },
        { name: '사이다', price: 1000, quantity: 7, promotion: null },
        { name: '오렌지주스', price: 1800, quantity: 9, promotion: 'MD추천상품' },
        { name: '오렌지주스', price: 1800, quantity: 0, promotion: null },
        { name: '탄산수', price: 1200, quantity: 5, promotion: '탄산2+1' },
        { name: '탄산수', price: 1200, quantity: 0, promotion: null },
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

    static ExceedItemQuantity(name, quantity) {
        const item = this.findItemByName(name);
        if (!item) {
            throw new Error("[ERROR] 해당 상품을 찾을 수 없습니다.");
        }
        if (item.quantity < quantity) {
            throw new Error("[ERROR] 재고 수량을 초과하여 구매할 수 없습니다. 다시 입력해 주세요.");
        }
    }

    static deductQuantity(name, quantity) {
        const item = this.findItemByName(name);
        if (!item || item.quantity < quantity) return false;
        item.quantity -= quantity;

        if (item.quantity <= 0) {
            item.quantity = '재고 없음';
        }
        return true;
    }

    static calculateTotalPrice(name, quantity) {
        const product = this.findItemByName(name);
        if (!product) return null;

        let totalPrice = this.calculateBasePrice(product, quantity);
        const promotion = this.findPromotionForProduct(product);

        if (promotion && this.isPromotionActive(promotion)) {
            totalPrice = this.applyPromotion(promotion, product, quantity);
        }
        return totalPrice;
    }

    static calculateBasePrice(product, quantity) {
        return product.price * quantity;
    }

    static findPromotionForProduct(product) {
        return this.promotions.find(promo => promo.name === product.promotion);
    }

    static applyPromotion(promotion, product, quantity) {
        const freeItems = Math.floor(quantity / promotion.buy) * promotion.get;
        return product.price * (quantity - freeItems);
    }

    static isPromotionActive(promotion) {
        const today = this.getTodayDate();
        return promotion.start_date <= today && today <= promotion.end_date;
    }

    static getTodayDate() {
        return DateTimes.now().toISOString().split('T')[0];
    }

    static calculateGiftItems(productArray) {
        const giftItems = [];

        productArray.forEach(data => {
            const [name, quantity] = data.split("-");
            const freeItems = this.getFreeItemsIfAvailable(name, quantity);
            if (freeItems > 0) {
                giftItems.push({ name, quantity: freeItems });
            }
        });

        return giftItems;
    }

    static getFreeItemsIfAvailable(name, quantity) {
        const product = this.findItemByName(name);
        if (product) {
            return this.calculateFreeItems(product, quantity);
        }
        return 0;
    }

    static calculateFreeItems(product, quantity) {
        const promotion = this.promotions.find(promo => promo.name === product.promotion && this.isPromotionActive(promo));
        if (!promotion) return 0;

        return Math.floor(parseInt(quantity, 10) / promotion.buy) * promotion.get;
    }

    static getProductsWithTotalPrice(productArray) {
        return productArray
            .map(data => this.createProductWithTotalPrice(data))
            .filter(product => product !== null);
    }

    static createProductWithTotalPrice(data) {
        const [name, quantity] = data.split("-");
        const totalPrice = this.calculateTotalPrice(name, parseInt(quantity, 10));
        if (totalPrice === null) return null;

        return { name, quantity: parseInt(quantity, 10), totalPrice };
    }
}

export default Store;