import { readCommerceStore } from "../../../_lib/commerceStore";
import { buildShoppingList } from "../_shoppingList";

export async function GET() {
  const store = await readCommerceStore();
  return Response.json({
    ok: true,
    userId: store.userId,
    list: buildShoppingList(store),
    updatedAt: store.updatedAt,
  });
}
