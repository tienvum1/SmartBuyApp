import '@react-navigation/native';
import { ParamListBase, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends ParamListBase {
      CheckoutDetailScreen: {
        selectedItems: any[];
        total: number;
      };
      StripePaymentScreen: {
        amount: number;
        orderId?: string;
        shippingAddressId: string;
        selectedItemIds: string[];
      };
      OrderSuccessScreen: undefined;
      DetailProduct: {
        productId: string;
      };
      // Thêm các màn hình khác nếu cần
    }
  }
}

// Nâng cao inferred typing cho các component screens
declare module '@react-navigation/native' {
  export function useNavigation<
    T extends keyof ReactNavigation.RootParamList
  >(): StackNavigationProp<ReactNavigation.RootParamList, T>;
  
  export function useRoute<T extends keyof ReactNavigation.RootParamList>(): RouteProp<
    ReactNavigation.RootParamList,
    T
  >;
} 