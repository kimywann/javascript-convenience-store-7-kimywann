import { DateTimes } from "@woowacourse/mission-utils";
import Store from "./Store.js";

const promotion = {
    discountTime() {
        const today = DateTimes.now().toISOString().split('T')[0];
        return Store.promotions.filter(promo => promo.start_date <= today && today <= promo.end_date);
    }
};

export default promotion;