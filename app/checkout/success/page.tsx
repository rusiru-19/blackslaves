import { Suspense } from "react";
import OrderSuccessClient from "./success";
export default function SuccessPage() {
  return (
    <div>
      <h1 className="text-center mt-10">Order Success</h1>
      <Suspense fallback={<p>Loading order details...</p>}>
        <OrderSuccessClient />
      </Suspense>
    </div>
  );
}
